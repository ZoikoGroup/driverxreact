// Guest metadata persistence (Doc 05 sections 04-06, Doc 08 DX-STORE).
//
// WHAT IS STORED: opaque session metadata and CLASSIFICATIONS only: session uuid, an HMAC of the guest
// capability (never the cookie), context version, UI state, expiry; per turn the input type, intent code for
// shortcuts, response class, UI state, outcome, correlation id and the approved knowledge revisions cited;
// optional helpfulness vote; tiny lifecycle events. There is no column for message text, answers, phone
// numbers, ids of any person, IP or location (db.test.mjs lints the schema, persist-e2e.mjs checks the rows).
//
// WHAT IS NOT DECIDED: how long this metadata lives (D-04). The retention worker refuses to purge until
// Privacy approves a policy, so until then rows accumulate; do not launch with D-04 open.
//
// DESIGN: Redis remains the authority for the protocol (sessions, CSRF, replay, CAS). Postgres is the audit and
// analytics record, written AFTER the Redis commit, bounded to a short deadline and best-effort: a Postgres
// failure is reported through telemetry (never to the visitor as success or failure) and never blocks or
// fakes a turn. Doc 08 allows this ordering because the visible result and the conversation state live in
// Redis; the database never claims something the visitor was not shown.

import { getSql } from "./db";
import { emit } from "./telemetry";

const BUDGET_MS = () => Number(process.env.DRIXO_PERSIST_TIMEOUT_MS) || 700;

async function bounded(run: () => Promise<unknown>, what: string): Promise<void> {
  const sql = getSql();
  if (!sql) return; // no database configured: nothing to persist (dev / sandbox)
  try {
    await Promise.race([
      run(),
      new Promise((_, rej) => setTimeout(() => rej(new Error("persist timeout")), BUDGET_MS())),
    ]);
  } catch {
    emit("request_error", { route: what as "sessions", status: 200, errorCode: "METADATA_WRITE" });
  }
}

export interface SessionStart {
  sessionId: string;
  /** Hex HMAC of the guest cookie (never the cookie itself). */
  capabilityHmacHex: string;
  idleExpiresAt: Date;
  absoluteExpiresAt: Date;
}

export const persistSessionStart = (s: SessionStart) =>
  bounded(async () => {
    await getSql()!.query(
      `with g as (
         insert into drixo.guest_session (session_id, capability_hmac, idle_expires_at, absolute_expires_at)
         values ($1, decode($2, 'hex'), $3, $4)
         on conflict (session_id) do nothing
         returning session_id)
       insert into drixo.session_event (session_id, event_code) select session_id, 'SESSION_STARTED' from g`,
      [s.sessionId, s.capabilityHmacHex, s.idleExpiresAt.toISOString(), s.absoluteExpiresAt.toISOString()],
    );
  }, "sessions");

export interface TurnRecord {
  sessionId: string;
  turnId: string;
  clientRequestId: string;
  contextVersion: number;
  inputType: "TEXT" | "SHORTCUT" | "QUICK_REPLY";
  intentCode?: string; // only for SHORTCUT input (a closed enum), never derived from text
  responseClass: string;
  uiState: string;
  outcome: string;
  correlationId: string;
  revisionIds: string[]; // approved KB revisions actually cited
  idleExpiresAt: Date;
  secretBlocked: boolean;
  protectedBlocked: boolean;
}

/** One atomic statement: the turn row, its citations, the session's new version/state/expiry, and events. */
export const persistTurn = (t: TurnRecord) =>
  bounded(async () => {
    await getSql()!.query(
      `with turn as (
         insert into drixo.turn_metadata
           (turn_id, session_id, client_request_id, context_version, input_type, intent_code, response_class, ui_state, outcome, correlation_id)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         on conflict do nothing
         returning turn_id),
       src as (
         insert into drixo.turn_source (turn_id, revision_id, citation_order)
         select turn.turn_id, u.rev, u.ord::smallint
           from turn, unnest($11::uuid[]) with ordinality as u(rev, ord)
         returning 1),
       sess as (
         update drixo.guest_session
            set context_version = greatest(context_version, $4), current_ui_state = $8, idle_expires_at = least($12::timestamptz, absolute_expires_at)
          where session_id = $2
         returning session_id),
       ev as (
         insert into drixo.session_event (session_id, event_code)
         select $2, c from unnest($13::text[]) as c
         returning 1)
       select 1`,
      [
        t.turnId, t.sessionId, t.clientRequestId, t.contextVersion, t.inputType, t.intentCode ?? null,
        t.responseClass, t.uiState, t.outcome, t.correlationId, t.revisionIds, t.idleExpiresAt.toISOString(),
        [t.secretBlocked ? "SECRET_BLOCKED" : null, t.protectedBlocked ? "PROTECTED_BLOCKED" : null].filter(Boolean),
      ],
    );
  }, "turns");

export const persistFeedback = (sessionId: string, turnId: string, helpful: boolean, reason: string | undefined) =>
  bounded(async () => {
    await getSql()!.query(
      `insert into drixo.turn_feedback (turn_id, helpful, reason)
       select t.turn_id, $3, $4 from drixo.turn_metadata t where t.turn_id = $2 and t.session_id = $1
       on conflict (turn_id) do update set helpful = excluded.helpful, reason = excluded.reason`,
      [sessionId, turnId, helpful, reason ?? null],
    );
  }, "feedback");

export const persistSessionEnd = (sessionId: string) =>
  bounded(async () => {
    await getSql()!.query(
      `with g as (
         update drixo.guest_session set state = 'ENDED', ended_at = now()
          where session_id = $1 and state = 'ACTIVE'
         returning session_id)
       insert into drixo.session_event (session_id, event_code) select session_id, 'SESSION_ENDED' from g`,
      [sessionId],
    );
  }, "end");
