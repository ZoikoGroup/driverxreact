# Drixo environments, configuration and release procedure

Source: Doc 08 section 14 (deployment topology and environment segregation), section 16 (pipeline and
change control), section 20 (release gates). The Doc 08 position still applies: it does not assume a cloud,
cluster technology or model vendor. This file records what the **code** requires and what has been **proven
in this repo**. Hosting, WAF, IAM, vault and region are decisions for SRE/Platform.

## Runtime requirements

| Dependency | Why | Production rule |
|---|---|---|
| Node.js app (Next.js, `next start`) | the five BFF routes | stateless instances; run >= 2 per zone |
| Redis | sessions, CSRF binding, replay cache, rate counters | **required**; the app refuses to serve without `DRIXO_REDIS_URL`. Any Redis error => 503 (fail closed) |
| PostgreSQL 16+ | approved knowledge, runtime flags | optional at runtime: without it the assistant answers `NO_SOURCE` and flags default to enabled/100%. **Managed environments should always configure it** (that is where the canary and kill switch live) |

## Environment variables

Server-only. None may start with `NEXT_PUBLIC_`. **The rest of the site reads secrets from `NEXT_PUBLIC_`
variables (`NEXT_PUBLIC_ESIM_SECRET_KEY`, `NEXT_PUBLIC_BEQUICK_TOKEN`, `NEXT_PUBLIC_BEQUICK_API_KEY` are sent from
client code; `NEXT_PUBLIC_STRIPE_SECRET_KEY` is mis-named). Rotate and move them server-side before launch
(ARC-25, `certification/DEFECT_REGISTER.md` DEFECT-1). Drixo adds none.**

| Variable | Req. in prod | Purpose |
|---|---|---|
| `DRIXO_API_ENABLED` | yes (`true`) | hard env gate; anything else => all routes 404. Emergency off switch when the flag DB is unreachable |
| `DRIXO_ENV` | yes | `sandbox|staging|preprod|production`; labels telemetry |
| `DRIXO_SESSION_SECRET` | yes | >= 32 chars; HMAC key for cookie/CSRF binding. Store in the vault; rotate per runbook R8 |
| `DRIXO_ALLOWED_ORIGINS` | yes | comma-separated first-party origins (`https://driverxmobile.com`). Empty in production denies every request |
| `DRIXO_REDIS_URL` | yes | `rediss://` with auth in real environments |
| `DRIXO_DATABASE_URL` | recommended | member of `drixo_bff` (least privilege). Never an owner or superuser |
| `DRIXO_DB_POOL_MAX` | no | default 5 |
| `DRIXO_FLAG_TTL_MS` | no | flag cache, default 5000 (how fast a kill switch reaches every instance) |
| `DRIXO_KB_BREAKER_THRESHOLD` / `DRIXO_KB_BREAKER_COOLDOWN_MS` | no | defaults 3 / 15000 |
| `DRIXO_SOURCE_HOSTS` | no | citation host allowlist, default `driverxmobile.com` (canonical host is decision D-01) |
| `DRIXO_RETRIEVAL_MIN_COVERAGE` | no | default 0.5, first-pass value; calibrate on real approved content |
| `DRIXO_SESSION_IDLE_TTL_SEC` / `DRIXO_SESSION_ABS_TTL_SEC` / `DRIXO_REPLAY_TTL_SEC` | no | proposals (30 min / 4 h / 10 min). **Final values are decision D-04 (Privacy/Legal/SRE)** |
| `DRIXO_SESSIONS_PER_IP_PER_MIN` / `DRIXO_REQUESTS_PER_IP_PER_MIN` / `DRIXO_TURNS_PER_SESSION_PER_MIN` | no | abuse limits (defaults 10 / 120 / 20); SRE sets final values. IP limits trust `x-forwarded-for`: the edge must overwrite it |
| `DRIXO_TELEMETRY` | no | `off` disables telemetry |
| `ESIM_SECRET_KEY` / `GOLITE_API_URL` | site | **server-only** key for the GoLite device-check proxy (`app/api/upstream/golite-device-check`) and an optional URL override. The legacy `NEXT_PUBLIC_ESIM_SECRET_KEY` is still read server-side as a fallback with a warning; remove it after rotating |
| `STRIPE_SECRET_KEY` | site | server-only Stripe key; legacy `NEXT_PUBLIC_STRIPE_SECRET_KEY` still read server-side as a fallback with a warning |
| `SITE_DEVICE_CHECK_PER_MIN` | no | per-client limit for the device-check proxy, default 30. The proxy also needs `DRIXO_ALLOWED_ORIGINS` (it reuses the same Origin allowlist) and Redis in production, and fails closed without them |
| `DRIXO_MODEL_ENABLED` + `ANTHROPIC_API_KEY` | no | the model path exists only when BOTH are set (plus the runtime flag `MODEL_SYNTHESIS`). Default: off. The key is server-only; keep it in the vault; never `NEXT_PUBLIC_` |
| `DRIXO_MODEL` | no | default `claude-opus-5-5`. A cheaper model may be adequate: decide with the live evaluation and Finance |
| `DRIXO_MODEL_TIMEOUT_MS` / `DRIXO_MODEL_MAX_TOKENS` | no | defaults 9000 / 4096 (Opus 5.5 always reasons, so the cap includes reasoning) |
| `DRIXO_MODEL_CALLS_PER_SESSION` / `DRIXO_MODEL_CALLS_PER_MIN` | no | defaults 6 / 60 (the per-minute cap is global across instances) |
| `DRIXO_MODEL_BREAKER_THRESHOLD` / `DRIXO_MODEL_BREAKER_COOLDOWN_MS` | no | defaults 3 / 30000 |
| `DRIXO_MODEL_NOVELTY_MAX` | no | grounding strictness of the output gate, default 0.35 (lower is stricter) |
| `ANTHROPIC_BASE_URL` | **never in production** | test hook for a mock provider. The SDK sends the API key to whatever host this names; only ever an approved gateway |
| `DRIXO_PERSIST_TIMEOUT_MS` | no | deadline for the best-effort metadata write, default 700 |
| `NEXT_PUBLIC_DRIXO_ENABLED` | build-time | `true` mounts the widget in the layout. Not a secret. The widget still shows only if the runtime canary includes the visitor |
| `DRIXO_FAULT_DELAY_BEFORE_RECHECK_MS` | **never** | test hook, ignored when `NODE_ENV=production` (proven by `ops-e2e.mjs`) |

CLI-only (never given to the web process): `DRIXO_METRICS_DATABASE_URL` (`drixo_metrics`, daily aggregation), `DRIXO_MIGRATE_DATABASE_URL` (schema owner), `DRIXO_PUBLISHER_DATABASE_URL`
(`drixo_publisher`), `DRIXO_OPS_DATABASE_URL` (`drixo_ops`), `DRIXO_RETENTION_DATABASE_URL` (`drixo_retention`).

## Environment segregation (Doc 08 section 14)

| Environment | Rules |
|---|---|
| Developer sandbox | synthetic content and fake accounts only; memory KV is allowed (no `DRIXO_REDIS_URL`); never real customer data |
| Integration / staging | API contract tests, migration dry-run, flows, abusive inputs, publish/revoke rollback, load harness. Separate secrets, Redis, database |
| Pre-production | production-equivalent WAF/TLS/headers, access controls, telemetry redaction, failover, restore proof, external security review |
| Production | signed release, immutable artifact, owner sign-offs, canary + rollback, flags confirmed, incident runbook and on-call owner |

Separate service accounts and secrets per role: runtime BFF (`drixo_bff`), publisher, ops, retention worker,
migrations. No shared root principal. The role grants are in `db/migrations/002_roles.sql` and `003_ops.sql`
and are tested with `SET ROLE` in `tests/drixo/db.test.mjs`. Role creation/login/password provisioning is
platform IAM work and is **not** done here.

## Pipeline stages (Doc 08 section 16) and what exists

| Stage | Status |
|---|---|
| Static analysis (SAST, secret scan, dependency inventory, IaC validation) | partial: `tests/drixo/security-scan.mjs` does a secret scan, client-bundle scan, `npm audit` and header checks. No SAST. ESLint config is broken in this repo (`eslint-config-next/core-web-vitals` missing); fix before relying on it |
| Type check + production build | works: `NEXT_PUBLIC_STRIPE_SECRET_KEY=<any> npx next build --webpack` (the existing Stripe route reads that variable at import time). Build lists exactly the 5 Drixo routes |
| Contract tests (5 endpoints) | `tests/drixo/api-contract.mjs` (60 checks, dev server) |
| Flow + policy tests | `tests/drixo/flow-contract.mjs` (96 checks) |
| DB / role / retention tests | `tests/drixo/db.test.mjs` (101 checks, no server needed; `npm run drixo:test:db`) |
| Knowledge end-to-end + 40 Doc 06 scenarios | `tests/drixo/kb-e2e.mjs` (228 checks) |
| Operations: 2 instances + Redis + DB, flags, breaker, Redis loss, redaction | `tests/drixo/ops-e2e.mjs` (63 checks) |
| Load/latency baseline | `tests/drixo/load.mjs` (not capacity evidence) |
| Accessibility (automated + assistive tech) | **not done** |
| External security review / penetration test | **not done** |

Start-up commands for each suite are in the header comment of each test file.

## Release procedure

1. **Gates G1-G8** (Doc 08 section 20) have owners and evidence; open decisions D-01..D-08 are closed (see
   `docs/Drixo_Implementation_Plan.md`). Do not launch with D-04 open.
2. Apply migrations to the target database with `scripts/drixo-kb.mjs migrate`. A fresh environment ships
   **dark**: the assistant flag is enabled at **0%** rollout, KB retrieval on, model synthesis off.
3. Import knowledge as DRAFT, get editorial review, approve each article with a different person than the
   submitter. Confirm `drixo-kb.mjs status` shows only what you intend to be public.
3b. Apply migrations 001-004 (`drixo-kb.mjs migrate`). Run `drixo-ops.mjs metrics` daily (cron) so `daily_metric` fills; dashboards read `daily_metric_reportable` (cells under 5 turns hidden).
4. Deploy the artifact with `NEXT_PUBLIC_DRIXO_ENABLED=true` and all required env vars. Verify:
   - `GET /api/v1/drixo/public/config` returns 200 with `rolloutPercent: 0`
   - exactly five Drixo routes exist; the site works with the launcher hidden
5. **Canary** (each step holds until the alerts in `SLOS_AND_ALERTS.md` are green for the hold time):
   `node scripts/drixo-ops.mjs rollout 1 --actor <you> --reason CANARY_START`, then 5, 25, 50, 100
   (`--reason CANARY_PROMOTE`). Suggested hold: 30-60 minutes per step, longer overnight at 25%.
   The draw is per browser tab (kept in `sessionStorage`, not an identifier, never sent anywhere), so a visitor
   does not flicker while you raise the percentage.
5b. **AI-written answers are a separate, later canary.** Launch without the model first (it is optional and the product is complete without it). To enable: obtain vendor retention/DPA approval (D-04), run `tests/drixo/model-live.mjs --yes-spend` and have a human read every answer, set `DRIXO_MODEL_ENABLED=true` and the key on the instances, then `drixo-ops.mjs model-on`. Watch alerts A13-A16. `model-off` returns to approved article text instantly (R10).
6. **Rollback** at any point: `rollout 0 --reason ROLLBACK`, or `kill --reason <INCIDENT_...>` (runbooks R1/R6).
   Both are audited and need no deploy.
7. Keep P1 flags (`live handoff`, `authenticated tools`, `supplier writes`, uploads, voice) off. They are
   constrained to `false` by a database CHECK constraint on `release_config` (DB-15); enabling any requires a
   new migration and an ADR.

## Proven in this repo vs still needed

Proven by the automated suites (production mode, real Redis, real Postgres engine, two instances): cross-instance
session sharing and CAS, idempotent replay across instances, Redis loss fails closed with no bypass and honest
recovery, database loss degrades to `NO_SOURCE` with circuit breaker open/close, kill switch / canary / KB
switch propagation without deploy, kill state surviving a database outage, redaction of user text and
identifiers from all server logs, production hardening (Secure cookies, strict origins, test hook ignored),
widget visibility following the rollout/kill state in a real browser.

Still needed before launch: real infrastructure drills (see `RUNBOOKS.md`), real alert delivery, SRE
re-baseline of the SLO proposals, external security review, accessibility evidence, CDN behavior for the
60-second config cache, Redis TLS/persistence decisions (D-04), secret rotation of the existing
browser-exposed keys, and a real CI pipeline.
