// Origin, cookie, HMAC and rate-limit primitives for the Drixo public BFF.

import { createHmac, timingSafeEqual } from "node:crypto";
import { allowedOrigins, isProd, sessionSecret } from "./env";
import { getKV } from "./store";

export const COOKIE_NAME = "dxm_drixo_guest";
export const COOKIE_PATH = "/api/v1/drixo/public";

export const hmac = (value: string) =>
  createHmac("sha256", sessionSecret()).update(value).digest("hex");

export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function getCookie(req: Request, name: string): string | undefined {
  const raw = req.headers.get("cookie");
  if (!raw) return undefined;
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return undefined;
}

/**
 * Every POST needs an allowed Origin (Doc 04). Allowed = DRIXO_ALLOWED_ORIGINS,
 * or (non-production only) an Origin whose host equals the request Host.
 * Production with no allowlist denies everything (fail closed).
 */
export function originAllowed(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin || origin === "null") return false;
  const normalized = origin.replace(/\/$/, "");
  if (allowedOrigins().includes(normalized)) return true;
  if (isProd()) return false;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export function useSecureCookie(req: Request): boolean {
  if (isProd()) return true;
  if (req.headers.get("x-forwarded-proto") === "https") return true;
  try {
    return new URL(req.url).protocol === "https:";
  } catch {
    return false;
  }
}

export function guestCookie(value: string, maxAgeSec: number, secure: boolean): string {
  return [
    `${COOKIE_NAME}=${value}`,
    `Path=${COOKIE_PATH}`,
    `Max-Age=${maxAgeSec}`,
    "HttpOnly",
    "SameSite=Lax",
    ...(secure ? ["Secure"] : []),
  ].join("; ");
}

export const clearCookie = (secure: boolean) => guestCookie("", 0, secure);

/**
 * Client key for abuse limiting. Hashed so raw IPs are never stored (privacy).
 * x-forwarded-for is only trustworthy if the edge overwrites it; confirm with SRE.
 */
export function clientKey(req: Request): string {
  const xff = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = xff || req.headers.get("x-real-ip") || "unknown";
  return hmac(`ip:${ip}`).slice(0, 24);
}

export type RateResult = { ok: true } | { ok: false; retryAfterSec: number };

/** Fixed-window limiter. Window start is derived from the clock so Retry-After is accurate. */
export async function rateLimit(bucket: string, limit: number, windowSec = 60): Promise<RateResult> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSec);
  const n = await getKV().incr(`rl:${bucket}:${windowStart}`, windowSec + 1);
  if (n > limit) return { ok: false, retryAfterSec: Math.max(1, windowStart + windowSec - now) };
  return { ok: true };
}
