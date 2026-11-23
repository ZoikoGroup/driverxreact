// Route logic for the five Drixo public endpoints (Doc 04 / Doc 08 section 6).
// Phase 2: transport + session security. Phase 3: turns are answered by the deterministic
// engine (policy -> flows). Retrieval (Phase 4) and model synthesis (Phase 5) come later.
// Nothing here stores or echoes user text.

import { randomUUID } from "node:crypto";
import { apiEnabled, isProd, limits } from "./env";
import { decideWithPolicy, noSourceDecision } from "./engine";
import { getFlags } from "./flags";
import { emit, latencyBucket } from "./telemetry";
import { stillApproved } from "./kb";
import { persistFeedback, persistSessionEnd, persistSessionStart, persistTurn } from "./persist";
import { INTENT_CODES, getPublicConfig } from "./config";
import {
  correlationId,
  hasUnknownKeys,
  isObj,
  json,
  problem,
  readJsonBody,
  UUID_RE,
} from "./http";
import { withIdempotency } from "./idempotency";
import { clearCookie, clientKey, guestCookie, originAllowed, rateLimit, useSecureCookie } from "./security";
import { createSession, guardGuestRequest, sessionKey, ttlFor, type SessionRec } from "./session";
import { getKV } from "./store";

const notFound = (req: Request) => problem(404, "NOT_FOUND", correlationId(req));

type Route = "config" | "sessions" | "turns" | "feedback" | "end";

/**
 * Wrap a handler: hard env gate, runtime kill switch, then KV/unknown failures fail closed as 503
 * (never a fake success). Emits redacted telemetry for throttling and failures.
 */
async function run(req: Request, route: Route, fn: (cid: string) => Promise<Response>): Promise<Response> {
  if (!apiEnabled()) return notFound(req);
  const cid = correlationId(req);
  try {
    const flags = await getFlags();
    if (!flags.ASSISTANT.enabled) {
      // Ops kill switch: every route answers 503 so the widget falls back to official support.
      emit("request_error", { route, status: 503, errorCode: "KILL_SWITCH", correlationId: cid });
      return problem(503, "SERVICE_UNAVAILABLE", cid, { retryable: false, headers: { "Retry-After": "60" } });
    }
    const res = await fn(cid);
    if (res.status === 429) emit("rate_limited", { route, status: 429, correlationId: cid });
    else if (res.status >= 500) emit("request_error", { route, status: res.status, errorCode: "UPSTREAM", correlationId: cid });
    return res;
  } catch {
    // Do not leak internals; do not claim anything was saved.
    emit("request_error", { route, status: 503, errorCode: "INTERNAL", correlationId: cid });
    return problem(503, "SERVICE_UNAVAILABLE", cid, { retryable: true });
  }
}

function idemKey(req: Request): string | undefined {
  const k = req.headers.get("idempotency-key");
  return k && UUID_RE.test(k) ? k : undefined;
}

// ---------- GET /config ----------
export const handleConfig = (req: Request) =>
  run(req, "config", async (cid) => {
    const rl = await rateLimit(`ip:${clientKey(req)}`, limits.requestsPerIpPerMin);
    if (!rl.ok) {
      return problem(429, "RATE_LIMITED", cid, {
        retryable: true,
        headers: { "Retry-After": String(rl.retryAfterSec) },
      });
    }
    const flags = await getFlags();
    // rolloutPercent drives the canary: the widget shows its launcher to this share of visitors.
    return json(200, { ...getPublicConfig(), rolloutPercent: flags.ASSISTANT.rolloutPercent }, {
      // Short public cache; purge on source/link revocation (Doc 08 section 9).
      "Cache-Control": "public, max-age=60",
      "X-Request-ID": cid,
    });
  });

// ---------- POST /sessions ----------
export const handleCreateSession = (req: Request) =>
  run(req, "sessions", async (cid) => {
    if (!originAllowed(req)) return problem(403, "ORIGIN_BLOCKED", cid);

    const rl = await rateLimit(`sess:${clientKey(req)}`, limits.sessionsPerIpPerMin);
    if (!rl.ok) {
      return problem(429, "RATE_LIMITED", cid, {
        retryable: true,
        headers: { "Retry-After": String(rl.retryAfterSec) },
      });
    }

    const body = await readJsonBody(req, limits.maxBodyBytes);
    if (!body.ok) return bodyProblem(body.status, cid);
    const v = body.value;
    if (
      !isObj(v) ||
      hasUnknownKeys(v, ["locale", "clientInstanceId", "reducedMotion"]) ||
      v.locale !== "en-US" ||
      typeof v.clientInstanceId !== "string" ||
      !UUID_RE.test(v.clientInstanceId) ||
      (v.reducedMotion !== undefined && typeof v.reducedMotion !== "boolean")
    ) {
      return problem(400, "INVALID_INPUT", cid);
    }
    const key = idemKey(req);
    if (!key) return problem(400, "INVALID_INPUT", cid);

    return withIdempotency("sessions", key, v, cid, async () => {
      const { rec, cookie, csrf, expiresAt } = await createSession();
      emit("session_started", { route: "sessions", correlationId: cid });
      // Audit/analytics record (best-effort, bounded). Only the HMAC of the capability is stored.
      await persistSessionStart({
        sessionId: rec.id,
        capabilityHmacHex: rec.cookieHash,
        idleExpiresAt: expiresAt,
        absoluteExpiresAt: new Date(rec.absExpiresAt),
      });
      const maxAge = Math.max(1, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
      return json(
        201,
        {
          sessionId: rec.id,
          mode: "GUEST",
          contextVersion: 0,
          csrfToken: csrf,
          uiState: "S01",
          expiresAt: expiresAt.toISOString(),
        },
        { "Set-Cookie": guestCookie(cookie, maxAge, useSecureCookie(req)) },
      );
    });
  });

function bodyProblem(status: 400 | 413 | 415, cid: string): Response {
  if (status === 413) return problem(413, "PAYLOAD_TOO_LARGE", cid);
  if (status === 415) return problem(415, "UNSUPPORTED_MEDIA_TYPE", cid);
  return problem(400, "INVALID_INPUT", cid);
}

// ---------- POST /sessions/{id}/turns ----------
type TurnInput =
  | { type: "TEXT"; text: string }
  | { type: "SHORTCUT"; intentCode: string }
  | { type: "QUICK_REPLY"; stepId: string; optionId: string };

interface TurnBody {
  clientRequestId: string;
  contextVersion: number;
  input: TurnInput;
}

const idLike = (s: unknown): s is string =>
  typeof s === "string" && s.length >= 1 && s.length <= 64 && /^[A-Za-z0-9_.:-]+$/.test(s);

function parseTurnBody(v: unknown): TurnBody | undefined {
  if (!isObj(v) || hasUnknownKeys(v, ["clientRequestId", "contextVersion", "input"])) return undefined;
  if (typeof v.clientRequestId !== "string" || !UUID_RE.test(v.clientRequestId)) return undefined;
  if (!Number.isInteger(v.contextVersion) || (v.contextVersion as number) < 0) return undefined;
  const i = v.input;
  if (!isObj(i)) return undefined;

  if (i.type === "TEXT") {
    if (hasUnknownKeys(i, ["type", "text"]) || typeof i.text !== "string") return undefined;
    const t = i.text.trim();
    if (t.length < 1 || t.length > limits.maxTextChars) return undefined;
    return { clientRequestId: v.clientRequestId, contextVersion: v.contextVersion as number, input: { type: "TEXT", text: t } };
  }
  if (i.type === "SHORTCUT") {
    if (hasUnknownKeys(i, ["type", "intentCode"])) return undefined;
    if (typeof i.intentCode !== "string" || !INTENT_CODES.includes(i.intentCode as never)) return undefined;
    return { clientRequestId: v.clientRequestId, contextVersion: v.contextVersion as number, input: { type: "SHORTCUT", intentCode: i.intentCode } };
  }
  if (i.type === "QUICK_REPLY") {
    if (hasUnknownKeys(i, ["type", "stepId", "optionId"]) || !idLike(i.stepId) || !idLike(i.optionId)) return undefined;
    return { clientRequestId: v.clientRequestId, contextVersion: v.contextVersion as number, input: { type: "QUICK_REPLY", stepId: i.stepId, optionId: i.optionId } };
  }
  return undefined;
}

export const handleTurn = (req: Request, sessionId: string) =>
  run(req, "turns", async (cid) => {
    const g = await guardGuestRequest(req, sessionId, cid);
    if (!g.ok) return g.response;

    const rl = await rateLimit(`turn:${sessionId}`, limits.turnsPerSessionPerMin);
    if (!rl.ok) {
      return problem(429, "RATE_LIMITED", cid, {
        retryable: true,
        headers: { "Retry-After": String(rl.retryAfterSec) },
      });
    }

    const body = await readJsonBody(req, limits.maxBodyBytes);
    if (!body.ok) return bodyProblem(body.status, cid);
    const turn = parseTurnBody(body.value);
    const key = idemKey(req);
    if (!turn || !key) return problem(400, "INVALID_INPUT", cid);

    // Idempotency first: a replay of an already-committed turn returns the original
    // outcome even though its contextVersion is now stale.
    return withIdempotency(`t:${sessionId}`, key, turn, cid, async () => {
      const t0 = Date.now();
      const kv = getKV();
      const cur = await kv.get<SessionRec>(sessionKey(sessionId));
      if (!cur || cur.ended) return problem(404, "SESSION_NOT_FOUND", cid);

      const stale = () => {
        emit("stale_context", { route: "turns", status: 409, correlationId: cid });
        return problem(409, "STALE_CONTEXT", cid, { detail: "The conversation has moved on. Please start again." });
      };

      if (turn.contextVersion !== cur.contextVersion) return stale();
      // Policy -> deterministic flow -> typed response. A QUICK_REPLY must match the step this
      // server issued last (forged / reused / stale options fail closed with 409, no state change).
      const decided = await decideWithPolicy(turn.input, cur.activeStepId, { sessionId });
      let decision = decided.decision;
      if (!decision.ok) return stale();
      // Source revoked/expired/conflicted while this turn was in flight: discard the candidate
      // and fall back to NO_SOURCE (DB-11). Checked as close to the commit as possible.
      // Test-only fault injection (never in production): widen the retrieve->commit window so the
      // revocation-race test can revoke deterministically in between.
      const faultMs = isProd() ? 0 : Number(process.env.DRIXO_FAULT_DELAY_BEFORE_RECHECK_MS) || 0;
      if (faultMs > 0 && decision.revisionIds.length > 0) await new Promise((r) => setTimeout(r, faultMs));
      if (decision.revisionIds.length > 0 && !(await stillApproved(decision.revisionIds))) {
        emit("kb_revoked_or_conflict", { revisionId: decision.revisionIds[0], reasonCode: "NOT_APPROVED_AT_COMMIT", correlationId: cid });
        decision = noSourceDecision();
        if (!decision.ok) return stale();
      }
      const { result, activeStepId } = decision;

      const turnId = randomUUID();
      // Atomic CAS: exactly one concurrent turn per contextVersion wins (ARC-05).
      const next = await kv.updateIf<SessionRec>(
        sessionKey(sessionId),
        (s) => !s.ended && s.contextVersion === turn.contextVersion,
        (s) => ({
          ...s,
          contextVersion: s.contextVersion + 1,
          activeStepId,
          turnIds: [...s.turnIds, turnId].slice(-200),
        }),
        ttlFor(cur),
      );
      if (!next) return stale();

      // Telemetry only after the turn is committed; labels and classes, never text.
      emit("turn_response", {
        route: "turns",
        status: 200,
        inputType: turn.input.type,
        policy: decided.policy,
        responseClass: result.responseClass,
        uiState: result.uiState,
        outcome: result.outcome,
        latencyBucket: latencyBucket(Date.now() - t0),
        correlationId: cid,
      });
      await persistTurn({
        sessionId,
        turnId,
        clientRequestId: turn.clientRequestId,
        contextVersion: next.contextVersion,
        inputType: turn.input.type,
        intentCode: turn.input.type === "SHORTCUT" ? turn.input.intentCode : undefined,
        responseClass: result.responseClass,
        uiState: result.uiState,
        outcome: result.outcome,
        correlationId: cid,
        revisionIds: decision.revisionIds,
        idleExpiresAt: new Date(Date.now() + ttlFor(cur) * 1000),
        secretBlocked: decided.policy === "SECRET",
        protectedBlocked: decided.policy === "PROTECTED" || decided.policy === "UNSUPPORTED_ACTION",
      });
      if (decided.policy === "SECRET") emit("secret_blocked", { policy: decided.policy, correlationId: cid });
      if (decided.policy === "PROTECTED" || decided.policy === "UNSUPPORTED_ACTION") {
        emit("protected_request_blocked", { policy: decided.policy, correlationId: cid });
      }

      return json(200, {
        sessionId,
        clientRequestId: turn.clientRequestId,
        turnId,
        contextVersion: next.contextVersion,
        correlationId: cid,
        result,
      });
    });
  });

// ---------- POST /sessions/{id}/feedback ----------
const REASONS = ["UNCLEAR", "NOT_RELEVANT", "OUTDATED", "OTHER"];

export const handleFeedback = (req: Request, sessionId: string) =>
  run(req, "feedback", async (cid) => {
    const g = await guardGuestRequest(req, sessionId, cid);
    if (!g.ok) return g.response;

    const body = await readJsonBody(req, limits.maxBodyBytes);
    if (!body.ok) return bodyProblem(body.status, cid);
    const v = body.value;
    const key = idemKey(req);
    if (
      !key ||
      !isObj(v) ||
      hasUnknownKeys(v, ["turnId", "helpful", "reason"]) ||
      typeof v.turnId !== "string" ||
      !UUID_RE.test(v.turnId) ||
      typeof v.helpful !== "boolean" ||
      (v.reason !== undefined && (typeof v.reason !== "string" || !REASONS.includes(v.reason)))
    ) {
      return problem(400, "INVALID_INPUT", cid);
    }
    const turnId = v.turnId;

    return withIdempotency(`f:${sessionId}`, key, v, cid, async () => {
      const kv = getKV();
      const cur = await kv.get<SessionRec>(sessionKey(sessionId));
      if (!cur || cur.ended) return problem(404, "SESSION_NOT_FOUND", cid);
      // Ownership: only turns issued in THIS session can be rated.
      if (!cur.turnIds.includes(turnId)) return problem(404, "NOT_FOUND", cid);
      if (!cur.rated.includes(turnId)) {
        await kv.updateIf<SessionRec>(
          sessionKey(sessionId),
          (s) => !s.ended && !s.rated.includes(turnId),
          (s) => ({ ...s, rated: [...s.rated, turnId] }),
          ttlFor(cur),
        );
        emit("feedback", { route: "feedback", helpful: v.helpful as boolean, reasonCode: (v.reason as string | undefined) ?? "NONE" });
        await persistFeedback(sessionId, turnId, v.helpful as boolean, v.reason as string | undefined);
      }
      return json(202, { accepted: true });
    });
  });

// ---------- POST /sessions/{id}/end ----------
export const handleEnd = (req: Request, sessionId: string) =>
  run(req, "end", async (cid) => {
    const g = await guardGuestRequest(req, sessionId, cid, { allowEnded: true });
    if (!g.ok) return g.response;

    const body = await readJsonBody(req, limits.maxBodyBytes);
    if (!body.ok) return bodyProblem(body.status, cid);
    const v = body.value;
    const key = idemKey(req);
    if (
      !key ||
      !isObj(v) ||
      hasUnknownKeys(v, ["reason"]) ||
      (v.reason !== "USER_ENDED" && v.reason !== "RESTARTED")
    ) {
      return problem(400, "INVALID_INPUT", cid);
    }

    return withIdempotency(`e:${sessionId}`, key, v, cid, async () => {
      const kv = getKV();
      // A fresh (non-replayed) end on an already-ended session is not found.
      if (g.session.ended) return problem(404, "SESSION_NOT_FOUND", cid);
      // Revoke the capability: later turns, feedback and ends return 404. We keep a
      // tombstone until expiry so the id cannot be reused. No claim of permanent deletion.
      await kv.updateIf<SessionRec>(
        sessionKey(sessionId),
        () => true,
        (s) => ({ ...s, ended: true, activeStepId: null }),
        ttlFor(g.session),
      );
      emit("session_ended", { route: "end", endReason: v.reason as string });
      await persistSessionEnd(sessionId);
      return new Response(null, {
        status: 204,
        headers: {
          "Cache-Control": "no-store",
          "Set-Cookie": clearCookie(useSecureCookie(req)),
        },
      });
    });
  });
