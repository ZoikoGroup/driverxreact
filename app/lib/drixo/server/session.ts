// Guest session lifecycle and the shared request guard for session-scoped POSTs.
// A sessionId is only a locator; authority = cookie possession + CSRF + Origin (Doc 04/08).

import { randomBytes, randomUUID } from "node:crypto";
import { limits } from "./env";
import { problem, UUID_RE, type ProblemCode } from "./http";
import { clientKey, COOKIE_NAME, getCookie, hmac, originAllowed, rateLimit, safeEqual } from "./security";
import { getKV } from "./store";

export interface SessionRec {
  id: string;
  cookieHash: string;
  csrfHash: string;
  contextVersion: number;
  /** Server-issued quick-reply step. Phase 3 populates this; null => any QUICK_REPLY is stale. */
  activeStepId: string | null;
  createdAt: number;
  absExpiresAt: number;
  ended: boolean;
  turnIds: string[];
  rated: string[];
}

export const sessionKey = (id: string) => `s:${id}`;

/** TTL (seconds) to store with the record: idle window capped by absolute expiry. */
export function ttlFor(rec: Pick<SessionRec, "absExpiresAt">, now = Date.now()): number {
  return Math.max(1, Math.min(limits.idleTtlSec, Math.floor((rec.absExpiresAt - now) / 1000)));
}

export async function createSession(): Promise<{ rec: SessionRec; cookie: string; csrf: string; expiresAt: Date }> {
  const now = Date.now();
  const cookie = randomBytes(32).toString("base64url");
  const csrf = randomBytes(24).toString("base64url");
  const rec: SessionRec = {
    id: randomUUID(),
    cookieHash: hmac(`cookie:${cookie}`),
    csrfHash: hmac(`csrf:${csrf}`),
    contextVersion: 0,
    activeStepId: null,
    createdAt: now,
    absExpiresAt: now + limits.absoluteTtlSec * 1000,
    ended: false,
    turnIds: [],
    rated: [],
  };
  const ttl = ttlFor(rec, now);
  await getKV().set(sessionKey(rec.id), rec, ttl);
  return { rec, cookie, csrf, expiresAt: new Date(now + ttl * 1000) };
}

export type Guarded = { ok: true; session: SessionRec; cid: string } | { ok: false; response: Response };

/**
 * Order matters and is deliberate:
 *  1. malformed id            -> 404 (non-enumerating)
 *  2. Origin not allowed      -> 403 ORIGIN_BLOCKED (before touching any session state)
 *  3. per-IP request budget   -> 429
 *  4. cookie/session mismatch, ended (unless allowEnded: only POST /end, so an idempotent
 *     retry of a successful end can replay 204), expired -> 404 (identical for all, no oracle)
 *  5. CSRF mismatch           -> 403 CSRF_FAILED
 */
export async function guardGuestRequest(
  req: Request,
  sessionId: string,
  cid: string,
  opts: { allowEnded?: boolean } = {},
): Promise<Guarded> {
  const fail = (status: number, code: ProblemCode, extra?: Parameters<typeof problem>[3]): Guarded => ({
    ok: false,
    response: problem(status, code, cid, extra),
  });

  if (!UUID_RE.test(sessionId)) return fail(404, "SESSION_NOT_FOUND");
  if (!originAllowed(req)) return fail(403, "ORIGIN_BLOCKED");

  const rl = await rateLimit(`ip:${clientKey(req)}`, limits.requestsPerIpPerMin);
  if (!rl.ok) {
    return fail(429, "RATE_LIMITED", { retryable: true, headers: { "Retry-After": String(rl.retryAfterSec) } });
  }

  const cookie = getCookie(req, COOKIE_NAME);
  const rec = await getKV().get<SessionRec>(sessionKey(sessionId));
  if (
    !cookie ||
    !rec ||
    (rec.ended && !opts.allowEnded) ||
    rec.absExpiresAt <= Date.now() ||
    !safeEqual(rec.cookieHash, hmac(`cookie:${cookie}`))
  ) {
    return fail(404, "SESSION_NOT_FOUND");
  }

  const csrf = req.headers.get("x-drixo-csrf");
  if (!csrf || !safeEqual(rec.csrfHash, hmac(`csrf:${csrf}`))) return fail(403, "CSRF_FAILED");

  return { ok: true, session: rec, cid };
}
