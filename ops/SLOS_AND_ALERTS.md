# Drixo telemetry, SLO proposals and alert rules

Source: Doc 08 section 15 (performance, SRE, telemetry). **Every number here is a proposal.** Doc 08 states
the targets are not customer SLAs and "require SRE baseline"; the figures measured in this repo come from a
single developer machine and are not capacity evidence. Platform-specific alert syntax is deliberately
omitted because the logging/metrics stack has not been chosen (decision for SRE).

## Telemetry design

- One JSON line per event on **stdout**, collected by the platform log pipeline. There is **no metrics HTTP
  route**: Doc 08 INV-02 freezes the public surface at exactly five endpoints, and the production build
  output lists only those five Drixo routes.
- Redacted by construction (`app/lib/drixo/server/telemetry.ts`): every field has a name allowlist and a
  value validator (closed enum or short id pattern). User text, cookies, CSRF tokens, session ids, IPs and
  user agents have no field to travel in. Invalid fields are dropped and counted as `telemetry_dropped`.
  `tests/drixo/ops-e2e.mjs` asserts none of those values appear in any server log line.
- Set `DRIXO_ENV` to `sandbox|staging|preprod|production` so every event is labelled. `DRIXO_TELEMETRY=off`
  disables emission (tests/emergencies only).

### Event catalog

| Event | Fields (besides `ts`, `env`) | Meaning |
|---|---|---|
| `session_started` / `session_ended` | `route`, `endReason` | lifecycle; no persistent guest id |
| `turn_response` | `inputType`, `policy`, `responseClass`, `uiState`, `outcome`, `latencyBucket`, `correlationId` | one per committed turn |
| `protected_request_blocked` | `policy`, `correlationId` | account/line/billing/action request gated (`PROTECTED`, `UNSUPPORTED_ACTION`) |
| `secret_blocked` | `policy`, `correlationId` | a likely password/OTP/PIN/card was detected; the value is never logged |
| `kb_lookup` | `kbResult` (`HIT` `MISS` `ERROR` `BREAKER_OPEN` `DISABLED`), `sourceId` on HIT | retrieval outcome |
| `kb_revoked_or_conflict` | `revisionId`, `reasonCode` | an answer was discarded at commit because its source was no longer approved |
| `kb_circuit_open` / `kb_circuit_closed` | `reasonCode` | retrieval circuit breaker |
| `rate_limited` | `route`, `status` | a 429 was returned |
| `stale_context` | `route`, `status` | a 409: stale or forged quick reply / context |
| `feedback` | `helpful`, `reasonCode` | optional helpfulness vote (no free text) |
| `request_error` | `route`, `status`, `errorCode` (`KILL_SWITCH` `INTERNAL` `UPSTREAM` `METADATA_WRITE`), `correlationId` | 5xx; `KILL_SWITCH` is deliberate; `METADATA_WRITE` is a failed audit write with status 200: the visitor was not affected |
| `model_call` | `modelResult` (`OK` `ABSTAIN` `REJECTED` `REFUSAL` `ERROR` `TIMEOUT` `BREAKER_OPEN` `BUDGET`), `reasonCode`, `latencyBucket`, `inputTokens`, `outputTokens` | one per attempted model call. `REJECTED` carries the output-gate reason (for example `UNGROUNDED_NUMBER`). Token counts only: never text |
| `telemetry_dropped` | `droppedCount` | code attempted a disallowed field (should be zero; investigate) |

`latencyBucket` is one of `lt250ms lt500ms lt1s lt2s lt5s lt10s gte10s` and covers server processing of a turn
(including retrieval), not network time.

## SLO proposals (Doc 08 section 15) and how to measure them

| Signal | Proposed objective | Evidence source |
|---|---|---|
| Public config latency | p95 <= 0.8s at agreed launch load | edge / RUM on `GET /config` (the BFF emits no config latency) |
| Deterministic turn latency | p95 <= 2s | share of `turn_response` with `latencyBucket` in `lt250ms..lt2s` >= 95% for policies other than `KB_OR_NO_SOURCE` |
| KB-grounded turn latency | p95 <= 10s or bounded safe timeout | same, for `policy=KB_OR_NO_SOURCE` / `PRICE`. A DB stall is bounded by `statement_timeout` 2s + the breaker. With the model on, a turn includes the provider call, bounded by `DRIXO_MODEL_TIMEOUT_MS` (default 9s) then falling back to approved text; use `model_call.latencyBucket` for the model share |
| Public UI availability | >= 99.9% after load and incident review | synthetic check of `GET /config` (expect 200, or deliberate 503 only when the kill switch is on) |
| Policy violations | zero accepted privileged guest actions | security counters + the regression suites; `protected_request_blocked` is expected traffic, not a violation |
| KB source leakage | zero unapproved/private/revoked citations | `kb_revoked_or_conflict` should be rare; any answer citing a non-approved revision is a P0 |
| Accessibility | no critical WCAG 2.2 AA failures in P0 flows | manual assistive-technology testing (not yet done) |

### What was actually measured here (do not publish)

`node tests/drixo/load.mjs --stack --seconds 20 --concurrency 8 --instances 2` (2 production instances +
Redis + in-process WASM Postgres + the load generator, all on one developer machine, 21,195 requests, ~1,060
req/s, 0 errors): config p95 6 ms, session create p95 8 ms, deterministic turn p95 10 ms, KB turn p95 24 ms,
protected turn p95 9 ms. These are orders of magnitude inside the proposals, which says only that the
implementation has no gross latency problem. They say nothing about production capacity, real Postgres/Redis
latency over a network, TLS, cold starts or a CDN. **SRE must re-baseline on production-equivalent
infrastructure** (Doc 08: owners "must baseline traffic, cost, rate limits, support coverage and capacity
before publication").

## Alert rules (conditions to implement in your platform)

Thresholds are starting points to tune against baseline data.

| # | Condition | Severity | Why / runbook |
|---|---|---|---|
| A1 | `request_error` with `errorCode` in (`INTERNAL`,`UPSTREAM`) > 2% of requests for 5 min | page | Redis/DB/BFF fault (R3/R4) |
| A2 | any `request_error` with `errorCode=KILL_SWITCH` | notify (not page) | confirms a deliberate kill switch is active; makes sure someone owns restoring it (R1) |
| A3 | `kb_circuit_open` emitted, or `kb_lookup kbResult=ERROR` > 5 in 5 min | page | knowledge DB degraded (R4) |
| A4 | any `kb_revoked_or_conflict` | ticket | a source changed mid-flight; content owner should confirm intent |
| A5 | `rate_limited` > 5x its 7-day baseline for 10 min, or `session_started` > 5x baseline | page | possible bot flood / denial of wallet (R5) |
| A6 | `telemetry_dropped` > 0 | ticket | code emitted a disallowed field; privacy review (R7) |
| A7 | `stale_context` ratio > 5% of turns for 15 min | ticket | client/server step mismatch or replay abuse |
| A8 | `secret_blocked` > 3x baseline | notify | possible phishing campaign aimed at drivers; inform Security |
| A9 | `protected_request_blocked` > 3x baseline | notify | probing for account data |
| A10 | synthetic `GET /config` not 200 for 3 consecutive checks while the kill switch is off | page | public availability |
| A11 | deterministic `turn_response` with `latencyBucket` `lt5s`+ > 5% for 10 min | page | latency regression |
| A13 | `model_call REJECTED` > 15% of model calls for 30 min | ticket | the model or prompt is producing text the gate refuses; answer quality problem (R10) |
| A14 | any `model_call REFUSAL`, or `REJECTED` with reason `PROMPT_LEAK`, `LEAK`, `ACTION_CLAIM`, `AGENT_CLAIM` or `ACCOUNT_CLAIM` | ticket (page if > 5 in 10 min) | the model attempted something it must not; possible probing or a prompt regression |
| A15 | `model_call` with `inputTokens` or `outputTokens` > 3x its 7-day baseline, or `BUDGET` events > 10% of model calls | page | cost or abuse (R11) |
| A16 | `model_call ERROR`/`TIMEOUT` > 20% of model calls for 10 min | notify | provider trouble; fallback is serving approved text (R11) |
| A17 | `request_error errorCode=METADATA_WRITE` > 1% of turns for 10 min | ticket | audit/analytics rows are being lost (R12) |
| A12 | a `turn_response` with `responseClass=GUIDANCE`, `policy=KB_OR_NO_SOURCE` and no preceding `kb_lookup HIT` | page | should be impossible: an answer without an approved source |

Alerts that need data the BFF does not emit (config latency, edge 4xx/5xx, WAF) must come from the edge/APM.
