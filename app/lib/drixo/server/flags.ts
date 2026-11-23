// Runtime kill switches and canary rollout (Doc 08 sections 15-16 incident rows, ARC-26).
//
// Flags live in Postgres (drixo.runtime_flag) so Ops can change them WITHOUT a deploy, and every
// change is audited (drixo.flag_audit). They are layered on top of the hard env gate
// DRIXO_API_ENABLED, which can only turn the assistant off.
//
//   ASSISTANT        enabled + rolloutPercent: whole assistant (503 when off) and canary percentage
//   KB_RETRIEVAL     off => answers fall back to NO_SOURCE (incident: "unapproved price claim")
//   MODEL_SYNTHESIS  reserved for Phase 5 (off by default; nothing reads it yet)
//
// Failure semantics (deliberate, documented in ops/RUNBOOKS.md):
//  - A flag read is cached for DRIXO_FLAG_TTL_MS (default 5s), so a kill switch takes effect within
//    one TTL on every instance, with no cross-instance messaging.
//  - If the DB cannot be read, the LAST KNOWN value is kept. If a value was never read (instance just
//    started while the DB is down) the assistant stays enabled but at 0% rollout (fails dark), so
//    new visitors are not shown the launcher until the rollout state can be verified.
//  - With no DB configured (local dev) everything defaults to enabled.

import { getSql } from "./db";

export type FlagName = "ASSISTANT" | "KB_RETRIEVAL" | "MODEL_SYNTHESIS";

export interface FlagState {
  enabled: boolean;
  rolloutPercent: number;
}
export type Flags = Record<FlagName, FlagState>;

const DEV_DEFAULTS: Flags = {
  ASSISTANT: { enabled: true, rolloutPercent: 100 },
  KB_RETRIEVAL: { enabled: true, rolloutPercent: 100 },
  MODEL_SYNTHESIS: { enabled: false, rolloutPercent: 0 },
};

const ttl = () => Number(process.env.DRIXO_FLAG_TTL_MS) || 5000;
const g = globalThis as unknown as { __drixoFlags?: { at: number; flags: Flags } };

export async function getFlags(): Promise<Flags> {
  const sql = getSql();
  // No database (local dev): the model flag simply follows the env gate. With a database, the table decides.
  if (!sql) return { ...DEV_DEFAULTS, MODEL_SYNTHESIS: { enabled: process.env.DRIXO_MODEL_ENABLED === "true", rolloutPercent: 100 } };
  const now = Date.now();
  const cached = g.__drixoFlags;
  if (cached && now - cached.at < ttl()) return cached.flags;
  try {
    const rows = await sql.query<{ flag: FlagName; enabled: boolean; rollout_percent: number }>(
      "select flag, enabled, rollout_percent from drixo.runtime_flag",
    );
    const flags: Flags = JSON.parse(JSON.stringify(DEV_DEFAULTS));
    for (const r of rows) {
      if (flags[r.flag]) flags[r.flag] = { enabled: r.enabled, rolloutPercent: Number(r.rollout_percent) };
    }
    g.__drixoFlags = { at: now, flags };
    return flags;
  } catch {
    // Keep serving the last known state; refresh the timestamp lightly so a down DB is not hammered.
    if (cached) {
      g.__drixoFlags = { at: now - ttl() + 1000, flags: cached.flags };
      return cached.flags;
    }
    // Never read the table (instance started while the DB is down): fail DARK for the canary so we
    // do not expose the launcher to new visitors without being able to verify the rollout state.
    return { ...DEV_DEFAULTS, ASSISTANT: { enabled: true, rolloutPercent: 0 } };
  }
}

/** Test hook. */
export function resetFlagCache() {
  g.__drixoFlags = undefined;
}
