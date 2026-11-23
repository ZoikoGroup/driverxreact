# Drixo runbooks

Operational procedures for the Drixo public assistant (Doc 08 section 16 incident rows, section 13 failure
handling). Written against what is implemented and tested in this repo. **Names, escalation paths, on-call
rotation and paging tools are placeholders for your organization to fill in.** Nothing here has been
exercised in a real incident.

All commands use the internal CLIs, which read credentials from the environment (never from the command
line): `scripts/drixo-ops.mjs` (flags, retention) and `scripts/drixo-kb.mjs` (knowledge). Every flag or
knowledge change is audited with a named actor and a controlled reason code.

## How fast does a change reach users?

| Change | Server side | Browsers |
|---|---|---|
| Kill switch / rollout / KB switch | within `DRIXO_FLAG_TTL_MS` (default 5s) on every instance, no deploy | `GET /config` is cached publicly for 60s, so the launcher appears/disappears within **about 65s** (longer if a CDN ignores `Cache-Control`; purge it) |
| Knowledge revoke / expiry / conflict | the very next request (the database view recomputes on every read; there is no answer cache) | n/a (answers are never cached) |

Already-open chat panels are not forcibly closed: their next request gets a 503 (kill switch) and the
widget shows its "couldn't reach Drixo, use official support" message.

## Severity quick reference

| Situation | Action | Section |
|---|---|---|
| Possible private data exposure, guest got non-public data, or model/tool escalation | **Kill switch first**, then investigate | R1 |
| Assistant stated an unapproved or wrong price/claim | Force `NO_SOURCE`, revoke the article | R2 |
| Redis down | Automatic fail-closed (503). Restore Redis | R3 |
| Knowledge database down | Automatic degrade to `NO_SOURCE`; breaker opens | R4 |
| Bot flood / cost spike | Throttle, lower rollout or kill | R5 |
| Bad release | Roll back by rollout/kill; redeploy previous artifact | R6 |
| Secret or personal data found in logs | Stop the emitter, purge, rotate | R7 |
| Session/CSRF anomaly | Rotate the session secret | R8 |
| Retention purge refuses to run | Expected until D-04 is approved | R9 |
| AI-written answer was wrong, unsafe or off-brand | `model-off` (answers revert to approved article text) | R10 |
| Model provider outage, slow answers or cost spike | Automatic fallback + breaker; `model-off` to stop spend | R11 |
| Guest metadata not being written | Telemetry `METADATA_WRITE`; visitors unaffected | R12 |

---

## R1. Suspected private-data exposure (stop-ship)

Doc 08 INV-01: a privileged call or private output is a P0 stop-ship.

1. **Contain (seconds):**
   `node scripts/drixo-ops.mjs kill --actor <you> --reason INCIDENT_PRIVATE_DATA`
   Every route answers 503 and the widget hides itself within ~65s. The rest of the website is unaffected.
2. If you cannot reach the flag database: set `DRIXO_API_ENABLED=false` on the instances and restart. That
   env gate overrides everything and makes all routes 404.
3. Preserve evidence: copy the `correlationId` values of the affected turns. Telemetry carries no text, so
   the correlation id plus timestamps are what link a report to server logs. **Do not** paste live cookies,
   CSRF tokens or user text into tickets.
4. Notify Security and Legal per your incident policy. Revoke affected tokens/secrets if any credential could
   be involved (R8).
5. **Do not restore** until Security signs off and the failing test case is added to
   `tests/drixo/` (flow, API or KB suites) and passes.
6. Restore gradually: `restore --percent 0` first, then follow the canary steps in `ENVIRONMENTS_AND_RELEASE.md`.

## R2. Assistant stated an unapproved / wrong claim

1. Find the article: the response carried `sources[].revision` (for example `KB-018@1`).
2. **Stop the claim everywhere immediately:**
   `node scripts/drixo-kb.mjs revoke KB-018@1 --actor <you> --reason WITHDRAWN_BY_OWNER`
   Effective on the next request. If you do not know the article or the claim came from a flow:
   `node scripts/drixo-ops.mjs kb-off --actor <you> --reason UNAPPROVED_PRICE_CLAIM` (factual questions
   answer `NO_SOURCE`; flows, safety and protected-intent gates are unaffected). Flow copy lives in
   `app/lib/drixo/server/flows.ts`; fix it, add a test, redeploy.
3. Content owner corrects the article as a **new revision** (`KB-018@2`), submits, and a *different* person
   approves (four-eyes is enforced in the database). Then `kb-on` if you used it.
4. If two sources disagree: `node scripts/drixo-kb.mjs conflict-open KB-018@1 --actor <you> --reason SOURCES_DISAGREE`
   suppresses it until `conflict-resolve`.
5. Record the root cause (D-02 pricing source of truth, D-03 approvals) in the incident notes.

## R3. Redis unavailable

Behavior (tested, ARC-17): every route that needs state answers **503 problem+json**; nothing is served from
memory and no CSRF/replay/step check is skipped. Config also 503s, so the widget hides. On recovery the
client reconnects automatically. Sessions are **not** restored if Redis lost its data: users get "session
expired" and start a new chat. That is correct, not a bug.

1. Confirm: `request_error` events with `errorCode` `INTERNAL`/`UPSTREAM` rising on every instance.
2. Restore Redis (failover/restart). Check persistence mode and TTL settings (D-04 decides what Redis may keep).
3. Watch `request_error` fall to zero; no action needed on the BFF.
4. Production **refuses to start without `DRIXO_REDIS_URL`**; do not work around that with per-process memory.

## R4. Knowledge database unavailable

Behavior (tested): factual questions degrade to `NO_SOURCE` + official support link (HTTP 200, never a 5xx);
deterministic flows, safety and protected-intent gates are unaffected. After `DRIXO_KB_BREAKER_THRESHOLD`
(default 3) consecutive failures the breaker opens (`kb_circuit_open`) and lookups are skipped for
`DRIXO_KB_BREAKER_COOLDOWN_MS` (default 15s), then one trial call decides (`kb_circuit_closed`).
Flags keep their **last known value** while the DB is unreachable (a kill switch stays on).

1. Restore the database. Expect up to one cooldown (default 15s) of `NO_SOURCE` after it returns.
2. If a new instance starts while the DB is down it has no known flag state and **fails dark** (assistant
   enabled, rollout 0%) so new visitors are not shown the launcher.
3. Revocations and approvals cannot be performed while the DB is down. If you need an emergency stop with the
   DB down, use R1 step 2.

## R5. Bot flood / cost spike (denial of wallet)

Signals: `rate_limited` events climbing, `session_started` far above normal, WAF/edge alerts.
1. Edge/WAF first (Doc 08 DX-EDGE): block the source; the BFF limits are a second line, not the only one.
2. Tighten per-instance limits via env (`DRIXO_SESSIONS_PER_IP_PER_MIN`, `DRIXO_TURNS_PER_SESSION_PER_MIN`,
   `DRIXO_REQUESTS_PER_IP_PER_MIN`) and redeploy, or reduce exposure: `rollout 0` hides the launcher.
3. If it continues: `kill` (R1 step 1 with reason `INCIDENT_ABUSE`).
4. IP-based limits trust `x-forwarded-for`. Confirm the edge overwrites it, otherwise attackers can rotate it.
5. There is no model cost in P0. When Phase 5 adds synthesis, its token/time caps and the `MODEL_SYNTHESIS`
   flag belong in this runbook.

## R6. Bad release: rollback

1. Fastest: `node scripts/drixo-ops.mjs rollout 0 --actor <you> --reason ROLLBACK` (hides the launcher) or
   `kill` if the bug can hurt users who already have the panel open.
2. Redeploy the previous immutable artifact (platform specific).
3. Database migrations are **forward-only**. If a migration is implicated, write a new forward migration;
   do not edit applied files. Rollback/restore drills (DB-20, DB-22) are not yet done.
4. Restore with the canary steps; do not jump to 100%.

## R7. Personal data or secrets found in logs

This should be impossible by construction (telemetry fields are allowlisted; `tests/drixo/ops-e2e.mjs`
asserts no user text, cookie, CSRF token, session id or IP in any server log line), so treat it as a bug.
1. Identify the emitter. Anything outside `app/lib/drixo/server/telemetry.ts` that logs request data is a
   defect (Next/platform request logs, reverse proxy logs, APM body capture).
2. Disable that logging, purge or restrict the affected log store per Privacy/Legal procedure.
3. Rotate anything that may have leaked (R8). Add a regression assertion.

## R8. Session / CSRF anomaly or key compromise

Symptoms: `CSRF_FAILED`/`SESSION_NOT_FOUND` spikes, evidence of cookie theft, or a leaked `DRIXO_SESSION_SECRET`.
1. Rotate `DRIXO_SESSION_SECRET` on **all** instances at once (all guest sessions become invalid; users
   start new chats; that is the intended effect and no user data is lost because none is stored).
2. `DRIXO_ALLOWED_ORIGINS` must list only first-party origins; production denies everything if it is empty.
3. Session ids alone grant nothing (cookie + CSRF + Origin are all required), so a leaked session id is
   not an incident by itself.

## R9. Retention purge refuses to run

`purge_expired_sessions` fails closed until the `guest_session` retention policy is `APPROVED` with a
duration (decision D-04). That is deliberate. Do not insert a duration to "unblock" it; get Privacy/Legal
approval, then record it in `drixo.retention_policy`. Note guest sessions and turns are currently held in
Redis with TTLs, not in Postgres, so the purge function protects the future Postgres-backed metadata.

---

## R10. An AI-written answer was wrong, unsafe or off-brand

The model path is optional and OFF by default. When on, the model may only rewrite approved excerpts into a short
answer, and only text that passes the server-side output gate is shown. If a bad answer still reached a visitor:

1. **Stop AI-written answers now (seconds, no deploy):**
   `node scripts/drixo-ops.mjs model-off --actor <you> --reason INCIDENT_BAD_ANSWER`
   Within the flag TTL (5s) every instance serves the approved article text verbatim instead. Nothing else changes:
   flows, safety, protected-intent gates and citations keep working.
2. Find the turn: the visitor's report gives a time; telemetry carries `correlationId` and, for each answer,
   `model_call` with `modelResult` (`OK` means the gate accepted it). Telemetry has **no text**, so you cannot
   re-read the answer from logs. Ask the reporter for a screenshot, never for secrets or personal data.
3. Classify the failure and fix the control, not only the symptom:
   - invented fact or number that slipped through: tighten `app/lib/drixo/server/answer-gate.ts` (grounding,
     claim terms) and add the exact output as a case in `tests/drixo/model-e2e.mjs`
   - the approved article itself was wrong or unclear: revoke it (R2) and publish a corrected revision
   - prompt problem: change `SYSTEM_PROMPT` in `model.ts`, bump `PROMPT_VERSION`
4. Re-run `npm run drixo:certify` and the live evaluation (`tests/drixo/model-live.mjs --yes-spend`, spends money) before
   `model-on`. Restore gradually (it is a global switch: do it in a low-traffic period and watch alerts A13-A15).
5. The gate is a heuristic, not a proof. If model answers cannot be made reliably safe, leave `model-off`: the
   assistant is complete and safe without it.

## R11. Model provider outage, slow answers or cost spike

Behavior (tested with a mock provider): every provider failure (HTTP 5xx, 429, timeout, refusal, bad output) falls
back to the approved article text, so visitors still get an answer. After `DRIXO_MODEL_BREAKER_THRESHOLD`
(default 3) consecutive failures the breaker opens for `DRIXO_MODEL_BREAKER_COOLDOWN_MS` (default 30s) and the
provider is not called at all; one trial call then decides whether it closes.

Cost is bounded three ways: per-session cap (`DRIXO_MODEL_CALLS_PER_SESSION`, default 6), global per-minute cap
across all instances (`DRIXO_MODEL_CALLS_PER_MIN`, default 60), and a token cap per call
(`DRIXO_MODEL_MAX_TOKENS`). Hitting a cap is normal and silent (fallback + `model_call BUDGET`).

1. Outage: nothing to do for visitors. Watch `model_call` for `ERROR`/`TIMEOUT`/`BREAKER_OPEN`; if it lasts, leave it
   (the fallback is the product) or `model-off` to avoid the extra latency of failing calls.
2. Spend spike: `model-off` first, then lower the caps via environment and redeploy. Token counts per call are in
   `model_call.inputTokens/outputTokens` (counts only). Provider-side spend limits belong in the provider console.
3. Key compromise: rotate `ANTHROPIC_API_KEY` in the vault and restart; also `model-off` meanwhile. The key is
   server-only and appears in no log (asserted by `model-e2e.mjs`).
4. `ANTHROPIC_BASE_URL` must NOT be set in production except to an approved gateway: the SDK sends the API key to
   whatever host it names. Restrict egress to the provider host at the network layer (Doc 08).

## R12. Guest metadata is not being written

Visitors are never affected: Redis is authoritative for conversations; Postgres holds the audit/analytics record,
written after the Redis commit, bounded to `DRIXO_PERSIST_TIMEOUT_MS` (default 700ms), best-effort.
A failed write emits `request_error` with `errorCode=METADATA_WRITE` (alert A17). Causes: database down or slow,
role grants wrong (the BFF role must have the grants in `002_roles.sql`), or a schema/migration mismatch.
Rows for turns during an outage are simply missing (they are not back-filled); the daily aggregation reflects what
was written. Retention: until D-04 approves a policy, `purge` refuses to run, so rows accumulate. Do not launch
with D-04 open.

## Drills required before launch (none have been run with real owners)

- [ ] Kill switch + restore, timed end to end including CDN/browser propagation
- [ ] Knowledge revocation drill (publish, serve, revoke, confirm next-request effect)
- [ ] Redis failover/restart with real infrastructure
- [ ] Database failover/restore with real infrastructure (DB-20)
- [ ] Rollback of a real deployment artifact
- [ ] Alert delivery to the real paging system (rules in `SLOS_AND_ALERTS.md`)
- [ ] `model-off` / `model-on` timed end to end, and a provider-outage drill (block egress to the provider host)
- [ ] Live model evaluation reviewed by a human (`model-live.mjs`) before the first `model-on`
