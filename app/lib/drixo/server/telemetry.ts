// DX-OBS: redacted operational telemetry (Doc 08 section 15, FR-063/064, PR-023).
//
// One JSON line per event on stdout; the platform's log pipeline turns these into metrics, dashboards
// and alerts (see ops/SLOS_AND_ALERTS.md). There is deliberately NO metrics HTTP route: Doc 08 INV-02
// freezes the public surface at five endpoints.
//
// PRIVACY BY CONSTRUCTION: callers cannot pass free text. Every field has a name allowlist AND a
// value validator (closed enum, or a short id pattern). Anything else is dropped and counted, never
// emitted. User text, cookies, CSRF tokens, session ids, IPs and user-agents have no field to ride in
// on, so they cannot leak by mistake (ARC-14).

import { isProd } from "./env";

export type EventName =
  | "session_started"
  | "session_ended"
  | "turn_response"
  | "protected_request_blocked"
  | "secret_blocked"
  | "kb_lookup"
  | "kb_revoked_or_conflict"
  | "kb_circuit_open"
  | "kb_circuit_closed"
  | "model_call"
  | "rate_limited"
  | "stale_context"
  | "feedback"
  | "request_error"
  | "flag_state"
  | "telemetry_dropped";

const ENUMS: Record<string, readonly string[]> = {
  route: ["config", "sessions", "turns", "feedback", "end"],
  responseClass: ["GUIDANCE", "QUESTION", "AUTH_GATE", "SUPPORT", "NO_SOURCE", "SECRET_WARNING"],
  uiState: ["S01", "S04", "S05", "S06", "S07", "S08", "S09", "S10", "S11"],
  inputType: ["TEXT", "SHORTCUT", "QUICK_REPLY"],
  outcome: ["NONE", "USER_REPORTED_RESOLVED", "USER_REPORTED_UNRESOLVED", "UNKNOWN"],
  kbResult: ["HIT", "MISS", "ERROR", "BREAKER_OPEN", "DISABLED"],
  modelResult: ["OK", "ABSTAIN", "REJECTED", "REFUSAL", "ERROR", "TIMEOUT", "BREAKER_OPEN", "BUDGET"],
  helpful: ["true", "false"],
  endReason: ["USER_ENDED", "RESTARTED"],
  latencyBucket: ["lt250ms", "lt500ms", "lt1s", "lt2s", "lt5s", "lt10s", "gte10s"],
  env: ["sandbox", "staging", "preprod", "production", "development", "test"],
};
// Short opaque identifiers only (policy codes, error codes, correlation ids, revision keys, flag names).
const ID = /^[A-Za-z0-9_.:@-]{1,96}$/;
const IDS = new Set(["policy", "errorCode", "correlationId", "revisionId", "reasonCode", "flag", "sourceId"]);
const NUMS = new Set(["status", "rolloutPercent", "droppedCount", "inputTokens", "outputTokens"]);

export type Fields = Partial<Record<string, string | number | boolean>>;
type Sink = (line: string) => void;

const g = globalThis as unknown as { __drixoSink?: Sink };
const defaultSink: Sink = (line) => process.stdout.write(`${line}\n`);

/** Test hook: capture emitted lines instead of writing to stdout. */
export function setTelemetrySink(s: Sink | undefined) {
  g.__drixoSink = s;
}

export function latencyBucket(ms: number): string {
  if (ms < 250) return "lt250ms";
  if (ms < 500) return "lt500ms";
  if (ms < 1000) return "lt1s";
  if (ms < 2000) return "lt2s";
  if (ms < 5000) return "lt5s";
  if (ms < 10_000) return "lt10s";
  return "gte10s";
}

function envName(): string {
  const e = process.env.DRIXO_ENV;
  if (e && ENUMS.env.includes(e)) return e;
  return isProd() ? "production" : "development";
}

function clean(fields: Fields): { out: Record<string, string | number>; dropped: number } {
  const out: Record<string, string | number> = {};
  let dropped = 0;
  for (const [k, raw] of Object.entries(fields)) {
    if (raw === undefined) continue;
    const v = typeof raw === "boolean" ? String(raw) : raw;
    if (ENUMS[k]) {
      if (typeof v === "string" && ENUMS[k].includes(v)) out[k] = v;
      else dropped++;
    } else if (IDS.has(k)) {
      if (typeof v === "string" && ID.test(v)) out[k] = v;
      else dropped++;
    } else if (NUMS.has(k)) {
      if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
      else dropped++;
    } else {
      dropped++; // unknown field name: never emitted
    }
  }
  return { out, dropped };
}

export function emit(event: EventName, fields: Fields = {}): void {
  try {
    if (process.env.DRIXO_TELEMETRY === "off") return;
    const { out, dropped } = clean(fields);
    const sink = g.__drixoSink ?? defaultSink;
    sink(JSON.stringify({ drixo: true, event, ts: new Date().toISOString(), env: envName(), ...out }));
    if (dropped > 0 && event !== "telemetry_dropped") {
      sink(JSON.stringify({ drixo: true, event: "telemetry_dropped", ts: new Date().toISOString(), env: envName(), droppedCount: dropped }));
    }
  } catch {
    // Telemetry must never break a request.
  }
}
