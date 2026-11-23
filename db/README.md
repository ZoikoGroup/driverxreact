# Drixo database and knowledge base (Phase 4)

Schema, seed content and publishing workflow for the Drixo public assistant. Design source: Doc 05
(database), Doc 06 (knowledge base), Doc 08 sections 8-9. **Nothing here is approved for production**:
the DDL needs Data Engineering / Security review (milestone M1), retention (D-04) is unresolved, and
the seeded articles are drafts (D-03).

## Layout

| Path | What |
|---|---|
| `migrations/001_drixo_schema.sql` | 17 tables, integrity triggers, `approved_public_chunks` view, guarded publisher functions |
| `migrations/002_roles.sql` | Least-privilege group roles and grants (review artifact; adapt to your platform's IAM) |
| `migrations/004_metadata_metrics.sql` | Guest metadata support: `turn_metadata.created_at`, `refresh_daily_metric()` (worker role `drixo_metrics`), `daily_metric_reportable` view (cells under 5 hidden) |
| `migrations/003_ops.sql` | Phase 6: runtime kill switches / canary rollout (`runtime_flag`, audited `set_flag`) and the retention purge function. A fresh environment ships dark (0% rollout) |
| `seed/kb-draft.json` | 14 sources + 38 articles from Doc 06, all `DRAFT`. Importing never makes anything public |
| `../scripts/drixo-kb.mjs` | Publisher CLI (internal tool, never exposed over HTTP) |
| `../scripts/drixo-ops.mjs` | Ops CLI: kill switch, canary rollout, KB switch, flag audit, retention purge (see `../ops/RUNBOOKS.md`) |
| `../tests/drixo/db.test.mjs` | Schema, publisher rules and role tests on PGlite (no server needed) |
| `../tests/drixo/kb-e2e.mjs` | End-to-end: real CLI + real `pg` driver + HTTP API + the 40 Doc 06 scenarios |

## Environment variables

| Variable | Used by | Notes |
|---|---|---|
| `DRIXO_DATABASE_URL` | BFF | Connect as a member of `drixo_bff`. Unset = no knowledge base, every factual question answers `NO_SOURCE` (safe default) |
| `DRIXO_DB_POOL_MAX` | BFF | Default 5 |
| `DRIXO_SOURCE_HOSTS` | BFF | Citation host allowlist, default `driverxmobile.com` (the canonical host is decision D-01) |
| `DRIXO_RETRIEVAL_MIN_COVERAGE` | BFF | Default 0.5; first-pass value, calibrate on real approved content |
| `DRIXO_MIGRATE_DATABASE_URL` | CLI `migrate` | Schema owner |
| `DRIXO_PUBLISHER_DATABASE_URL` | CLI | Member of `drixo_publisher` (reads tables, writes only through the guarded functions) |
| `DRIXO_FAULT_DELAY_BEFORE_RECHECK_MS` | BFF, **non-production only** | Test hook that widens the retrieve-to-commit window for the revocation-race test. Ignored when `NODE_ENV=production` |

Never put a connection string with a password on a command line or in the repo.

## Publishing workflow

```
node scripts/drixo-kb.mjs migrate
node scripts/drixo-kb.mjs seed-drafts      --actor alice          # DRAFT, invisible
node scripts/drixo-kb.mjs activate-source  S01 --actor alice      # host must be on the allowlist
node scripts/drixo-kb.mjs submit  KB-006@1 --actor alice          # DRAFT -> IN_REVIEW
node scripts/drixo-kb.mjs approve KB-006@1 --actor bob --from 2026-12-01T00:00:00Z [--until ISO]
node scripts/drixo-kb.mjs revoke  KB-006@1 --actor carol --reason WITHDRAWN_BY_OWNER
node scripts/drixo-kb.mjs conflict-open KB-006@1 --actor dave --reason SOURCES_DISAGREE
```

Rules enforced **inside Postgres** (a bug in the app cannot bypass them):
four-eyes approval (approver != submitter), content-hash tamper check, public + ACTIVE + allowlisted
source, effective window, no open conflict, immutable approved text, append-only audit with controlled
reason codes, approving `@2` retires `@1`.

Revocation, expiry and conflicts take effect on the very next read because eligibility is recomputed
by the view on every query. There is deliberately **no answer cache**; if one is added later it must be
keyed on revision status and invalidated on revoke (Doc 08 section 9).

## Deviations from Doc 05 (update Doc 05 and the DBML when approved)

- `kb_revision.conflict_status` (source conflicts suppress retrieval, ARC-12)
- `kb_chunk.search_aliases` and generated `search_vec` (retrieval matches title + "user might ask" aliases)
- extra `publication_audit.action` codes: `INGEST`, `SUBMIT`, `CONFLICT_OPEN`, `CONFLICT_RESOLVED`
- one revision per article (`KB-006@1`), one chunk per revision, rather than one revision per source page

## Operations (Phase 6)

Environment variables, runbooks, SLO/alert proposals and the release procedure live in [`../ops/`](../ops/).
Redis is now required in production (`DRIXO_REDIS_URL`); Postgres holds knowledge and runtime flags.

## Not done in Phase 4

- (Done in Phase 7 follow-up) Guest metadata is now written to `guest_session`, `turn_metadata`, `turn_source`,
  `turn_feedback` and `session_event` after each Redis commit: best-effort, bounded, classification-only (see
  `app/lib/drixo/server/persist.ts`, `tests/drixo/persist-e2e.mjs`). Redis stays the authority for the protocol.
- The link registry is still in code (`app/lib/drixo/server/links.ts`); `public_link` is unused.
- (Done) Daily aggregation: `drixo-ops.mjs metrics`. The retention purge function exists (migration 003) and now has real rows to purge, but refuses to run until D-04 approves a policy.
- Vector search / embeddings (lexical only, as Doc 08 allows initially).
- Backup/restore and migration-rollback drills (DB-20, DB-22).
