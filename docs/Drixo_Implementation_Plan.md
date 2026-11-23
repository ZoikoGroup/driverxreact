# Drixo Public AI Assistant: Implementation Plan (P0)

Derived from docs 01–10 in this folder (WF, PRD 02, FRS 03, API 04, DB 05, KB 06, UX 07, Architecture 08, Prompt/Guardrails 09, RBAC/RAG/Security/Eval 10).
Target repo: `driverxreact` (Next.js 16 App Router, React 19, TS, Tailwind). The existing web code is untouched by this plan until Phase 1.

## 1. What we are building (P0 boundary)
- A **guest-only, read-only** public chatbot ("Drixo", "Your DriverX Copilot") embedded on public DriverX pages.
- **Exactly 5 endpoints**: `GET config`, `POST sessions`, `POST sessions/{id}/turns`, `POST sessions/{id}/feedback`, `POST sessions/{id}/end` under `/api/v1/drixo/public/*`. No others (INV-02).
- **6 shortcuts**: FIX_CONNECTION, ACTIVATE_SIM_ESIM, PLANS_HOTSPOT, BILLING_TOPUPS, FLEET_IOT, DRIVER_BENEFITS.
- **6 response classes**: GUIDANCE, QUESTION, AUTH_GATE, SUPPORT, NO_SOURCE, SECRET_WARNING.
- **Out of P0 (feature flags stay false)**: live handoff, voice, uploads, authenticated account tools, supplier writes (ZoikoNex/BeQuick/payments/CRM), streaming, multilingual.
- Billing/usage/line-status questions return AUTH_GATE with a link to the existing login. The bot never reads the dashboard APIs in P0.

## 2. Architecture mapped to this repo

| Doc 08 component | Implementation here |
|---|---|
| DX-UI | `app/components/drixo/*` (launcher, shell, intent grid, message list, quick replies, composer, auth gate, link card, support card, error, privacy controls), mounted from `app/layout.tsx` |
| DX-BFF | Next.js route handlers: `app/api/v1/drixo/public/{config,sessions,sessions/[id]/turns,.../feedback,.../end}/route.ts` (same-origin). Needs ADR-08-01 sign-off (the doc does not assume Next.js). |
| DX-POLICY / DX-FLOW / DX-KB / DX-MODEL-ADAPTER | server-only modules in `app/lib/drixo/{policy,flow,kb,model,output-gate,link-registry}` (never imported by client code) |
| DX-STORE | PostgreSQL 16+, schema `drixo`, 17 tables from Doc 05 DDL |
| DX-KV | Redis (flow step, CSRF binding, idempotency/replay, rate limits, TTL pending D-04) |
| DX-OBS | redacted metrics/traces, no raw text/IP/cookie |
| DX-PUBLISH | internal CLI/admin workflow (not a public route): ingest, approve, effective-date, revoke |

Stack additions: `pg` (or Prisma/Drizzle), `ioredis`, `zod` (strict schemas, reject unknown fields), an OpenAPI validator, a vitest/jest + Playwright test setup, an LLM SDK behind the gateway (provider TBD).

## 3. Phase 0: Decisions and prerequisites (blocks launch, not scaffolding)
Close D-01–D-08 (owners in Doc 08 §18). Practical minimum to start building: D-01 canonical host, D-03 KB approvers, D-04 retention/TTL, D-05 support channels, and an ADR for the stack, LLM provider, hosting, Postgres and Redis. Until D-02 (pricing source) closes, plan questions return NO_SOURCE or a link.

**Pre-work in this repo (security, do first):** `NEXT_PUBLIC_STRIPE_SECRET_KEY`, `NEXT_PUBLIC_ESIM_SECRET_KEY` and `NEXT_PUBLIC_BEQUICK_TOKEN` are exposed to browsers. This conflicts with INV/ARC-25 (no credentials in browser). Rotate and move server-side before Drixo ships. The chatbot must not add any `NEXT_PUBLIC_` secrets.

## 4. Phases (from Doc 08 §19) with deliverables and exit gates

### Phase 1: Web shell (WF-00/01/02/10)
- Launcher, desktop 420px panel, mobile full-height sheet (320px+), parked-only safety banner, six shortcut cards, privacy/end controls.
- Config consumed from the `GET config` mock; a static official-support fallback when config is unavailable.
- Accessibility baseline: focus restore, Escape, 44px targets, reduced motion, no streaming live-region.
- **Exit:** ARC-21/22/23/24 on the shell; no fake "live agent" or "24/7" claim.

### Phase 2: Session security (BFF core)
- `POST sessions`: opaque HttpOnly/Secure/SameSite=Lax cookie scoped to `/api/v1/drixo/public`, CSRF token, `contextVersion=0`, idempotency, expiry.
- `POST end`, origin allowlist, per-session/IP rate limits (values from Security/SRE), `application/problem+json` errors, `Cache-Control: no-store`.
- Redis fails closed. The site's login cookie is ignored by this API.
- **Exit:** ARC-01–08, 16, 17 and API-N01, N02, N04, N12, N13, N14 pass.

### Phase 3: Deterministic flows (WF-03/04/06/07/08/09)
- Versioned `flow_definition/step/option` graphs: connection triage (calls/SMS branch, retest), SIM/eSIM guidance, fleet/IoT discovery, support referral.
- Server-issued `stepId/optionId`, CAS on `contextVersion`, stale/forged quick-reply returns 409.
- Policy layer before everything: secret detection (SECRET_WARNING), protected-intent classifier (AUTH_GATE), unsafe-driving/emergency copy.
- `POST turns` works end-to-end with no LLM; the link registry resolves action keys to allowlisted HTTPS URLs.
- **Exit:** FRS acceptance tests (36); ARC-05/06/07/19; API-N03, N05, N06, N08, N11.

### Phase 4: Content governance and retrieval
- Apply the Doc 05 DDL (migrations, least-privilege roles, `approved_public_chunks` view, no transcript columns).
- KB ingestion from the 38 draft articles and 14 source records. They stay DRAFT until approved. The publish tool records SHA-256, editor, approver, effective window and revocation.
- Retrieval over the approved view only (FTS first, version-pinned vectors optional). Revocation invalidates caches and the index, with a final source check at commit.
- Conflict, expiry or missing source returns NO_SOURCE with an official link.
- **Exit:** ARC-10/11/12/14/15/27; the 40 KB scenarios pass on approved content only.

### Phase 5: Optional AI synthesis (feature-flagged)
- Model gateway: stateless, egress allowlist, timeout and token/cost caps, no tools, no arbitrary URLs. Flag off by default.
- Pipeline: policy, then deterministic or retrieval, then synthesis from curated excerpts, then output gate (response class, citation IDs, action keys and URLs against the registry, no HTML or Markdown images), then source recheck, then CAS commit.
- Prompt templates and injection isolation per Doc 09; model failure falls back to deterministic or NO_SOURCE.
- **Exit:** the 48 prompt/adversarial cases and 64 cross-layer cases from Doc 10; ARC-09/13/18; zero unapproved URLs or citations.

### Phase 6: Operations
- Telemetry per Doc 08 §15 (aggregates only, `dx_drixo_*` events), alerts, kill-switch feature flag, canary and rollback, incident runbooks, and daily metrics/retention workers.
- Environments: sandbox, staging, preprod, prod with separate secrets and service accounts.
- **Exit:** ARC-20/26; SLO baselines (config p95 ≤ 0.8s, deterministic turn p95 ≤ 2s, AI turn p95 ≤ 10s are proposals until SRE baselines).

### Phase 7: Certification and launch
- Pentest, WCAG 2.2 AA manual/AT testing, privacy/legal sign-off, support-route verification, and executive sign-off (gates G1–G8).
- **Exit:** ARC-28/29/30, no open P0 defects. P1 flags remain false.

## 5. Suggested sequencing and parallel tracks
- **Week 0–1:** Phase 0 decisions, secret rotation, stack ADR, repo scaffolding and CI (lint, contract tests, secret scan).
- **Weeks 1–3:** Phase 1 (frontend) in parallel with Phase 2 (backend). The OpenAPI file is the contract; the frontend develops against a mock server.
- **Weeks 3–5:** Phase 3, plus Phase 4 DB and KB governance in parallel (content team reviews the 38 articles).
- **Weeks 5–7:** Phase 4 retrieval, then Phase 5 behind a flag.
- **Weeks 7–9:** Phase 6, then Phase 7.
These durations are rough estimates, not from the docs. Re-estimate after the team and stack are confirmed.

## 6. Test strategy (runs from day one)
- Contract: OpenAPI 3.1 lint and schema tests, Postman collection against the sandbox (10 ordered requests + 14 negative cases API-N01–N14).
- Functional: FRS 36 tests; architecture ARC-01–30; KB 40 scenarios.
- AI safety: Doc 09's 48 adversarial cases and Doc 10's 64 cross-layer cases (prompt injection in KB page, forged fleet role, pasted OTP, other-user bill).
- Non-functional: accessibility (axe plus screen reader and keyboard), 320/360/390/430/1440px, load, Redis/Postgres/model outage drills, revocation drill.
- All docs mark tests as NOT RUN, so evidence must be recorded per gate.

## 7. Key risks
| Risk | Mitigation |
|---|---|
| Open decisions D-01–D-08 stall launch | Start them in week 0; build behind flags meanwhile |
| Stale or conflicting pricing and coverage claims | NO_SOURCE until D-02 closes; link registry only |
| Browser-exposed secrets already in the repo | Fix in Phase 0 |
| Model drift, injection, cost | Flag-off default, output gate, token caps, kill switch |
| Stack mismatch (docs do not assume Next.js, Postgres or Redis) | ADR and sign-off before Phase 2 |
| Retention undefined (D-04) | No transcript persistence; ephemeral TTL set by Privacy/Legal |

## 8. Definition of done (P0)
All 5 endpoints live with no extras; six shortcuts and eleven surfaces working; zero privileged guest actions; no raw transcripts in DB, logs or analytics; approved-source-only answers; all P0 gates G1–G8 signed; P1 flags verified false.

## 9. Progress (updated 2026-11-20)

| Phase | State |
|---|---|
| 0 Decisions | **open** (D-01..D-08 not closed by owners); secret rotation not done |
| 1 Web shell | built, browser-checked |
| 2 Session security | built; Redis store added in Phase 6 |
| 3 Deterministic flows | built; copy is DRAFT pending editorial sign-off |
| 4 Content governance and retrieval | built (schema, publisher workflow, approved-only retrieval); content still DRAFT; guest metadata not yet persisted to Postgres |
| 5 Optional AI synthesis | **built, OFF by default**, verified against a mock provider (101 checks); real-model quality, injection resistance, latency and cost **not yet evidenced** (live evaluation script exists, not run); needs vendor approval (D-04) before any visitor text is sent |
| 6 Operations | built and tested in production mode (Redis, flags/canary/kill, breaker, redacted telemetry, runbooks, load harness); real-infrastructure drills, alert delivery and SRE baselines still required |
| 7 Certification | automated evidence assembled (882 checks, `npm run drixo:certify`) and gates recorded in `certification/`; **not certified**: needs owner decisions, external pen test, assistive-technology testing, real-infrastructure drills and sign-offs. Verdict: not ready to launch (see `certification/RELEASE_RECORD.md`) |

See `ops/ENVIRONMENTS_AND_RELEASE.md` for what is proven vs still needed.
