// Server-only configuration. None of these are NEXT_PUBLIC_*; they never reach the browser.
// Numeric values are PROPOSALS pending Security / SRE / Privacy (API-D11, D-04).

import { randomBytes } from "node:crypto";

const num = (name: string, fallback: number) => {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const isProd = () => process.env.NODE_ENV === "production";

/** Kill switch. API answers 404 unless explicitly enabled (Doc 08 section 16). */
export const apiEnabled = () => process.env.DRIXO_API_ENABLED === "true";

// Held on globalThis: in dev, each route bundle can load its own copy of this module,
// and a per-module secret would make cookies signed in one route fail in another.
const gs = globalThis as unknown as { __drixoDevSecret?: string };
export function sessionSecret(): string {
  const s = process.env.DRIXO_SESSION_SECRET;
  if (s && s.length >= 32) return s;
  if (isProd()) throw new Error("DRIXO_SESSION_SECRET (>=32 chars) is required in production");
  // Dev only: random per process, sessions die on restart.
  gs.__drixoDevSecret ??= randomBytes(32).toString("hex");
  return gs.__drixoDevSecret;
}

export const limits = {
  idleTtlSec: num("DRIXO_SESSION_IDLE_TTL_SEC", 30 * 60),
  absoluteTtlSec: num("DRIXO_SESSION_ABS_TTL_SEC", 4 * 60 * 60),
  replayTtlSec: num("DRIXO_REPLAY_TTL_SEC", 10 * 60),
  maxBodyBytes: num("DRIXO_MAX_BODY_BYTES", 8 * 1024),
  maxTextChars: 2000, // Doc 04 contract
  sessionsPerIpPerMin: num("DRIXO_SESSIONS_PER_IP_PER_MIN", 10),
  turnsPerSessionPerMin: num("DRIXO_TURNS_PER_SESSION_PER_MIN", 20),
  requestsPerIpPerMin: num("DRIXO_REQUESTS_PER_IP_PER_MIN", 120),
};

export function allowedOrigins(): string[] {
  return (process.env.DRIXO_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
}
