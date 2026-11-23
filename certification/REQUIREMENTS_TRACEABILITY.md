# Requirements traceability (PRD PR-001..026, FRS gaps)

Status: **implemented** (built and covered by an automated test), **partial** (built, with a stated gap or
dependence on an open decision), **not built**, **n/a** (feature intentionally off in P0).
Source: Doc 02 section 07 (PR register), Doc 03 (FRS). Evidence files are in `tests/drixo/`.

## PR-001..026

| ID | Requirement | Status | Notes |
|---|---|---|---|
| PR-001 | Universal launcher, closed by default, dismissible invite, no checkout obstruction, no duplicates | **implemented** | closed by default, focus returns, one instance, and the launcher is **suppressed on checkout, payment, sign-in, registration, password-reset and cookie-consent pages** (`suppressedPathPrefixes` from the server config; `ui-behaviour.mjs`). The optional proactive invitation is not built |
| PR-002 | Responsive shell at 320/360/390/430/1440 | **implemented** | 1280, 390 and 320 verified (`a11y`); 360 and 430 use the same layout but were not run explicitly |
| PR-003 | Identity and safety: supplied favicon, "Your DriverX Copilot", parked-only notice | **partial** | the widget now follows the approved design image (`docs/WhatsApp Image 2026-10-21 at 00.43.08.jpeg`): teal header with the Drixo mark, greeting, cream safety notice, icon cards, avatars and times, outlined pills, yellow send button. **Deliberate deviations from the image, per Docs 06/07:** the "24/7 support" label is shown as "Public guidance" (unverified availability claim, D-05), and the paperclip and microphone are not rendered (attachments and voice are off in P0; unsupported controls must be omitted). The Drixo mark is an SVG recreation of the design, not the supplied brand file; colors remain provisional |
| PR-004 | Six intents, order locked, free text accepted | **implemented** | `api-contract`, `flow-contract` |
| PR-005 | Connectivity triage with explicit retest | **implemented** | `flow-contract` J-01 |
| PR-006 | Troubleshooting integrity (no outage claims) | **implemented** | asserted across flows and all 40 scenarios |
| PR-007 | SIM/eSIM journey, prerequisites, no anonymous activation | **partial** | behavior verified; the guide link is a placeholder (D-06) and guide content is unapproved draft copy |
| PR-008 | Activation-status boundary behind sign-in | **implemented** | `AUTH_GATE`, no guessed status |
| PR-009 | Source-backed plans, BCL | **partial** | assistant never quotes a price or allowance (`NO_SOURCE` or official link). Nothing is approved to cite and Broadband Consumer Label handling does not exist (D-02) |
| PR-010 | Coverage guidance, ZIP check, no GPS | **partial** | predicted-coverage caveat shown in plan/trucking flows; no GPS; no ZIP form (FR-042 is conditional on a verified form existing) |
| PR-011 | Hotspot / data-only distinction | **partial** | flows link data-only plans and defer to published terms; no approved allowance content |
| PR-012 | Secure account gateway | **implemented** | 12 protected phrasings plus forged-role prompts all `AUTH_GATE` |
| PR-013 | Tool-access prohibition (server-enforced) | **implemented** | no routes or tools exist; five-route build output; fuzz and injection suites |
| PR-014 | Fleet inquiry (new vs existing) | **implemented** | `flow-contract` J-06 |
| PR-015 | DriverXtra benefits only from verified sources | **partial** | answers with a link to `/partner-offer-program` (placeholder; no DriverXtra page exists in this repo) |
| PR-016 | Human-support discovery at welcome and unresolved steps | **implemented** | persistent link; placeholder target (D-05) |
| PR-017 | Escalation consent | **n/a** | live handoff is off by design (P1) |
| PR-018 | Resilient error behavior | **implemented** | 503/429/stale/session-expired/network states with retry and support (`a11y` error state, `ops-e2e`). AI-timeout paths n/a (no model) |
| PR-019 | Secrets and privacy | **implemented** | with the documented regex gaps |
| PR-020 | Session control (minimize, restart, end) | **implemented** | no deletion promises; end revokes the capability |
| PR-021 | Accessibility WCAG 2.2 AA | **partial** | automated audit clean; **no manual assistive-technology evidence** |
| PR-022 | AI answer provenance | **implemented** | every factual answer is approved article text or a model rewrite of approved excerpts, always with server-built citations, or `NO_SOURCE`. Model rewrites pass a deterministic output gate (citations issued by the server, numbers and claim terms grounded in the cited excerpts, no links/markup/agent or action claims). Verified against a mock provider; real-model faithfulness is not yet evidenced (`model-live.mjs`) |
| PR-023 | Privacy-safe analytics | **implemented** | server-side redacted telemetry, plus browser events `dx_drixo_opened`, `_intent_selected`, `_message_sent` (length bucket only), `_answer_shown`, `_auth_gate`, `_handoff_selected`, `_helpful_vote`, `_error`, `_closed`, pushed to `window.dataLayer` and a DOM `dx_drixo` event behind a field allowlist (`ui-behaviour.mjs`). Wiring to the site's actual analytics tool and consent gating is the host site's job (tool not specified) |
| PR-024 | Published content workflow | **implemented** | CLI + database rules (approve, effective-date, supersede, revoke). **Gap:** no web UI for content owners |
| PR-025 | Canonical destination registry | **partial** | registry exists and is the only source of links; its values are same-site placeholders (D-01) |
| PR-026 | Feedback and recovery | **implemented** | helpful/not-helpful, restart, **"Rephrase my question"** after a miss, and official-support emphasis after two misses in a row (`ui-behaviour.mjs`) |

## FRS requirements with known gaps

| FR | Gap |
|---|---|
| FR-002 | optional proactive invitation not built |
| FR-006 | brand favicon pending |
| FR-042 | ZIP capture not built (conditional on a verified coverage form) |
| FR-054 / FR-053 | handoff and consent: off by design |

Closed in the last pass: FR-001 (suppression on checkout/sign-in/consent pages), FR-011 (scroll position), FR-014 (over-length error; nothing is silently cut), FR-065 (rephrase).

All other FR items were built per the FRS as read and are exercised by the suites listed in
`RELEASE_RECORD.md`; this table lists only the departures I am aware of. It is not an independent
requirement-by-requirement audit by someone who did not build it, which the gate process still requires.
