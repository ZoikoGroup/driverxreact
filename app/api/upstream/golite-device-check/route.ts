// Server-side proxy for the GoLite device-compatibility API.
//
// WHY: the browser used to call GoLite directly with `X-Secret-Key: NEXT_PUBLIC_ESIM_SECRET_KEY`, which
// Next.js inlines into client JavaScript, so every visitor could read the key and call ANY GoLite action
// with it. The key now lives only in server config and is attached here.
//
// This is a CONSTRAINED proxy, not a general one (an open proxy would be worse than the leak):
//  - only three fixed actions are forwarded; the upstream URL is fixed server-side (never client-supplied)
//  - the device identifier must look like an IMEI / MEID / EID (hex, 8-32 chars)
//  - same-origin only (Origin allowlist), per-client rate limit, small body cap, upstream timeout
//  - the upstream response is passed through unchanged (status + JSON), so the existing UI keeps working;
//    upstream headers are never forwarded and the secret is never echoed
//
// KNOWN LIMIT: `esim_update` is a WRITE (it records a device as eSIM-compatible). It was equally reachable
// by anyone holding the leaked key; the proxy narrows it to a validated call but cannot authenticate the
// caller. Proper protection needs server-side user verification (see certification/DEFECT_REGISTER.md).
//
// Config: ESIM_SECRET_KEY (preferred) and optionally GOLITE_API_URL. For a transition the legacy
// NEXT_PUBLIC_ESIM_SECRET_KEY is still read here (SERVER side only) with a warning; remove it after rotating.

import { originAllowed, rateLimit, clientKey } from "../../../lib/drixo/server/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT_URL = "https://goliteapi.golitemobile.com/api/device_compatibility_checker/";
const ACTIONS = new Set(["esim_check", "esim_v_check", "esim_update"]);
const ID = /^[0-9A-Fa-f]{8,32}$/;
const MAX_BODY = 1024;
const UPSTREAM_TIMEOUT_MS = 8000;
const LIMIT_PER_MIN = Number(process.env.SITE_DEVICE_CHECK_PER_MIN) || 30;

let warnedLegacy = false;
function secret(): string | undefined {
  if (process.env.ESIM_SECRET_KEY) return process.env.ESIM_SECRET_KEY;
  const legacy = process.env.NEXT_PUBLIC_ESIM_SECRET_KEY;
  if (legacy && !warnedLegacy) {
    warnedLegacy = true;
    console.warn("[golite-proxy] using legacy NEXT_PUBLIC_ESIM_SECRET_KEY; set ESIM_SECRET_KEY and remove the public variable after rotating the key");
  }
  return legacy;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export async function POST(req: Request) {
  // Browsers always send Origin on same-origin POSTs; anything else is not our page.
  if (!originAllowed(req)) return json(403, { error: "forbidden" });

  try {
    const rl = await rateLimit(`golite:${clientKey(req)}`, LIMIT_PER_MIN);
    if (!rl.ok) {
      return new Response(JSON.stringify({ error: "rate_limited" }), {
        status: 429,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "Retry-After": String(rl.retryAfterSec) },
      });
    }
  } catch {
    return json(503, { error: "unavailable" }); // rate-limit store down: fail closed
  }

  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) return json(415, { error: "unsupported_media_type" });
  const raw = await req.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY) return json(413, { error: "too_large" });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: "invalid_json" });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) return json(400, { error: "invalid_input" });
  const b = body as Record<string, unknown>;
  const keys = Object.keys(b);
  if (keys.some((k) => k !== "action" && k !== "imei")) return json(400, { error: "invalid_input" });
  if (typeof b.action !== "string" || !ACTIONS.has(b.action)) return json(400, { error: "invalid_input" });
  if (typeof b.imei !== "string" || !ID.test(b.imei)) return json(400, { error: "invalid_input" });

  const key = secret();
  if (!key) return json(503, { error: "not_configured" });

  try {
    const res = await fetch(process.env.GOLITE_API_URL || DEFAULT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Secret-Key": key },
      body: JSON.stringify({ action: b.action, imei: b.imei }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: "no-store",
    });
    const text = await res.text();
    try {
      JSON.parse(text);
    } catch {
      return json(502, { error: "bad_gateway" });
    }
    return new Response(text, {
      status: res.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return json(502, { error: "bad_gateway" });
  }
}
