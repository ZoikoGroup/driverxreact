# Drixo P0 release record (Phase 7: certification evidence)

Prepared 2026-11-20 from the automated evidence in this repository. Source of the gates: Doc 08 section 20
(G1-G8) and section 17 (ARC-01..30).

## Verdict

**NOT READY TO LAUNCH. This record is evidence, not certification.**

The automated suites all pass. The release is still blocked by items automation cannot resolve:
people (owners, sign-offs), decisions (D-01..D-08), an external security review, assistive-technology
testing, real-infrastructure drills, and defects in the existing website that were found along the way.
Two were worked on in this phase (see below); the biggest, a client-side-only authorization model in the dashboard
(DEFECT-18), is open and needs a backend design.

Nothing in this document has been signed. The sign-off table at the bottom is intentionally blank.

## Automated evidence (`npm run drixo:certify`, last run 2026-11-20, after the AI-synthesis, P0-gap and persistence work)

| Suite | Checks | Result | What it proves |
|---|---|---|---|
| Database (`db.test.mjs`) | 114 | pass | schema constraints, publish/revoke rules, immutability, append-only audit, role grants via `SET ROLE`, runtime flags, retention fail-closed, metadata aggregation and the small-cohort floor |
| Operations (`ops-e2e.mjs`) | 63 | pass | 2 prod instances + Redis + Postgres: shared state, CAS across instances, Redis/DB loss, kill switch/canary/rollback, breaker, log redaction |
| Session expiry (`expiry-e2e.mjs`) | 8 | pass | idle and absolute expiry, activity extends idle but not absolute |
| Guest metadata persistence (`persist-e2e.mjs`) | 29 | pass | classification-only rows land in Postgres after a conversation; nothing typed, no cookie or CSRF token in any guest table; capability stored only as an HMAC; Postgres outage never fails or fakes a turn; daily aggregation with k=5 floor; retention purge cascades |
| Phase 5 model answers (`model-e2e.mjs`) | 101 | pass | **against a free MOCK provider**: off by default, runtime switch, only approved excerpts and the escaped question reach the provider (no tools, cookies, ids), policy gates run first, 21 bad-proposal cases rejected by the output gate, refusal/429/500/hang/breaker/budgets, revocation mid-call |
| Site device-check proxy (`golite-proxy.mjs`) | 42 | pass | eSIM secret attached server-side only; fixed actions, validated input, same-origin, rate limit, timeout, pass-through, fail closed (mock upstream, not the real GoLite) |
| API contract (`api-contract.mjs`) | 60 | pass | 5 endpoints in **production mode**: CSRF, Origin, idempotency, CAS, validation, rate limit |
| Flows and policy (`flow-contract.mjs`) | 96 | pass | journeys J-01..J-08, secrets, protected intents, safety, link registry, quick-reply integrity |
| Adversarial and fuzz (`adversarial.mjs`) | 58 | pass | obfuscated secrets, look-alike characters, pathological inputs, 300 hostile bodies, protocol abuse. **6 evasions are known gaps (below)** |
| Widget behaviour (`ui-behaviour.mjs`) | 32 | pass | launcher hidden on checkout/sign-in pages, accessible over-length error, offline state, rephrase and escalation, scroll position, metadata-only analytics events |
| Accessibility (`a11y.mjs`) | 34 | pass | axe WCAG 2.2 AA over every widget state, keyboard order, focus visibility, 200% text, 320px reflow, reduced motion |
| Security scan (`security-scan.mjs`) | 17 | pass | no secrets in Drixo code, no server identifiers in the client bundle, response headers, no CORS; **reports 4 open defects elsewhere** |
| Knowledge base (`kb-e2e.mjs`) | 228 | pass | real CLI + driver, 40 Document 06 scenarios, revoke/expiry/conflict/mid-flight revoke, DB-down |
| **Total** | **882** | **all pass** | across 13 suites |

Also available: `tests/drixo/load.mjs --stack` (latency baseline; **single-machine numbers, not capacity evidence**).

Reproduce: build with `NEXT_PUBLIC_DRIXO_ENABLED=true` and any value for `NEXT_PUBLIC_STRIPE_SECRET_KEY`, then
`npm run drixo:certify` (several minutes; needs `redis-server` on PATH and Chrome/Edge for the accessibility
audit).

## What the last pass added (2026-11-20)

| Item | State |
|---|---|
| **Phase 5: AI-written answers** (`model.ts`, `answer-gate.ts`) | **built, OFF by default** (hard env gate + runtime flag `MODEL_SYNTHESIS` + provider key). The model can only rewrite approved excerpts into a short answer; the server builds the class, UI state, citations and links; an output gate rejects anything it cannot verify and falls back to the approved article text. Verified against a **mock** provider only. **Not verified:** the real model's answer quality, its resistance to prompt injection, its latency and cost: `tests/drixo/model-live.mjs --yes-spend` exists for that and has NOT been run (it spends money and needs a key). Do not turn the model on before a human has read its live answers and D-04 covers the vendor |
| P0 gaps closed | launcher suppressed on checkout/payment/sign-in/consent pages (PR-001, FR-001); scroll position respected (FR-011); explicit over-length error (FR-014); rephrase and escalation after repeated misses (PR-026, FR-065); offline state (WF-09); browser analytics events (PR-023) |
| Guest metadata in Postgres (DEFECT-8) | persisted after each Redis commit, best-effort and bounded; daily aggregation with a small-cohort floor; retention purge has real rows to act on (still refuses to run until D-04 is approved) |
| Tooling | `NEXT_DIST_DIR` opt-in so the certification run's dev server no longer clashes with a dev server you already have open |

## Site fixes made during certification (2026-11-20)

| Item | Result |
|---|---|
| Critical dependency advisories (`next`, `next-auth`, transitive highs) | **resolved**: `next` 16.4.6, `next-auth` 4.24.15; production dependencies now report 0 vulnerabilities; build, 65 of 65 page routes, auth endpoints and all Drixo suites verified. Not covered: flows needing real credentials (login against the backend, checkout, dashboard) |
| eSIM secret in browser code | **fixed in code and verified**: server proxy + canary build shows the value absent from browser JavaScript. **The key still has to be rotated and `ESIM_SECRET_KEY` set** |
| Stripe key naming | server-only code path with legacy fallback; build no longer needs the key; **rename the variable and rotate the key** |
| BeQuick token and API key in browser code | **still open**: confirmed present in browser JavaScript by canary build. Blocked by DEFECT-18 |
| Dashboard authorization (DEFECT-18), payment amount trusted from the client (DEFECT-19) | **found, not fixed**: need backend design; details in `DEFECT_REGISTER.md` |

## Gate status (Doc 08 section 20)

Status words: **evidence complete** (automated evidence exists; owner sign-off still required), **partial**,
**not met**, **not started**. Nothing is marked "certified".

| Gate | Required evidence | Status | Why |
|---|---|---|---|
| G1 Contract | API contract tests for 5 endpoints, response/schema guard, idempotency | **evidence complete** (sign-off pending) | 60 contract checks in production mode, exactly 5 routes in the build output. **Caveat:** the Doc 04 OpenAPI/Postman files were not in the project, so the implementation was built from the Doc 04 text and has not been validated against the YAML |
| G2 Data | approved retention, migration, grants, deletion, restore tests | **not met** | D-04 (retention) is open; migrations and grants were tested on PGlite, not a real server; backup/restore (DB-20) and migration rollback (DB-22) not done; guest metadata is held in Redis TTL, not yet in the Postgres tables |
| G3 Content | published source registry, commercial claims reconciled | **not met** | every article and all flow copy is DRAFT; D-01 (canonical host), D-02 (pricing truth), D-03 (approvers) open; support/activation links are placeholders |
| G4 Security | threat model, pentest, injection tests, credential boundary | **not met** | automated attack evidence is strong, but: no external penetration test; **credential boundary still fails (BeQuick token and API key in browser code; dashboard authorization is client-side, DEFECT-18); payment amount is client-supplied (DEFECT-19)**; regex screen has known gaps. (Critical `next`/`next-auth` advisories were resolved) |
| G5 UX / accessibility | 11 surfaces, WCAG 2.2 AA evidence, parked-only messaging | **partial** | automated audit clean; parked-only notice verified; **no manual assistive-technology testing, no real-device testing** (Doc 07 requires both); two axe "needs review" items to verify by hand |
| G6 Support / Ops | verified support routes, real availability copy, incident ownership | **not met** | D-05 open; the support page URL contains "24-7" (an availability claim not substantiated, see D-05); runbooks written but no owners or drills |
| G7 SRE / deployment | latency/load baselines, incident drill, rollback, telemetry verification | **partial** | kill switch, canary, rollback, breaker, redaction proven in tests; no drill on real infrastructure, no baseline on production-equivalent hardware, alert delivery untested |
| G8 Executive | CTO/Product/Security/Privacy/Support/QA sign-off | **not started** | requires G1-G7 |

## Open decisions that gate launch (Doc 08 section 18)

None of these has evidence of closure in this repository.

| ID | Decision | Owner | Effect on this build |
|---|---|---|---|
| D-01 | canonical host; www vs non-www authority | Web Ops / Product / Legal | all links are same-site placeholders; `DRIXO_SOURCE_HOSTS` and `DRIXO_ALLOWED_ORIGINS` need the real host |
| D-02 | versioned plan/price/tax eligibility source | Product / Finance / Legal | assistant refuses prices (`NO_SOURCE`) by design until content is approved |
| D-03 | knowledge approvers, publish/revoke ownership, emergency stop | AI / Content / Legal | no content approved; four-eyes approval enforced in the database but approvers are not named |
| D-04 | session TTL, Redis/backup retention, notice/consent, data rights | Privacy / Legal / SRE | **blocks production**: TTL values are my proposals; retention purge refuses to run; end-chat copy makes no deletion promise |
| D-05 | official support channels and real availability | Support | support link is a placeholder; the existing page URL claims "24-7" |
| D-06 | activation route and supplier responsibility | OSS/BSS / Web | activation guide link is a placeholder |
| D-07 | ZoikoNex vs legacy BeQuick authority | CTO / Backend / Carrier Ops | none in P0: no supplier integration exists or may be added |
| D-08 | owners/evidence for WCAG, adversarial and release-gate testing | Accessibility / QA / Security | automated evidence exists; named human owners do not |

## Known limitations of the automated evidence

- **Regex screen gaps (measured, not hidden).** `adversarial.mjs` reports these evasions as NOT detected:
  base64-encoded secrets, secrets split across messages, leetspeak passwords, digit homophones ("ate", "too"),
  and a bare number with no keyword. Doc 09 states pattern filters are not proof of safety; a purpose-trained
  screen and a human red team remain prerequisites.
- **PGlite is not a production Postgres.** It is real Postgres code (WASM), good for schema, triggers,
  functions and grants; it says nothing about network latency, replication, extension versions or tuning.
- **The knowledge end-to-end suite runs on a dev server** because it uses a test-only fault hook (ignored in
  production, proven by `ops-e2e.mjs`) to race a revocation against an in-flight answer.
- **Test approvals are fixtures.** The knowledge suites approve draft articles to exercise the machinery;
  that is not editorial approval.
- **The model path is verified with a mock, not the real model.** The output gate, budgets, breaker, kill switch and
  privacy of the request are proven; the real model's faithfulness, injection resistance, latency and cost are not.
  The output gate is a set of heuristics (grounding by vocabulary, numbers, claim terms, patterns), not a proof of
  factual correctness: a human must review live answers, and a wrong-but-plausible paraphrase of an approved excerpt
  can pass it.
- **Single-machine load numbers** are not capacity or SLO evidence.

## Where the detail is

| Document | Content |
|---|---|
| `ARC_TRACEABILITY.md` | each of ARC-01..30: status and the exact evidence |
| `REQUIREMENTS_TRACEABILITY.md` | PR-001..026 status, FR gaps |
| `DEFECT_REGISTER.md` | defects and risks with severity and suggested owner |
| `../ops/` | runbooks, SLO and alert proposals, environments and release procedure |

## Sign-off (intentionally blank)

| Role | Name | Decision | Date | Conditions |
|---|---|---|---|---|
| Product owner | | | | |
| CTO / Backend | | | | |
| Security / IAM | | | | |
| Privacy / Legal | | | | |
| Support operations | | | | |
| QA / Accessibility | | | | |
| SRE | | | | |
