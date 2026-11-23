// Drixo database tests (Phase 4). Runs the real migrations on PGlite (WASM Postgres), so the DDL,
// triggers, view and publisher functions are exercised on actual Postgres semantics.
//
//   node tests/drixo/db.test.mjs
//
// Maps to Doc 05 DB-01, 09, 10, 14-17, 19, 21 and Doc 08 ARC-10, 12, 15, 27.
// NOT covered here (needs a real server / later phases): DB-02..08 (app-level, in the API suites),
// DB-11 mid-flight revocation (kb-e2e.mjs), DB-20 backup/restore, DB-22 rollback drill, D-04 retention.

import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const migDir = join(here, "../../db/migrations");

let pass = 0;
let fail = 0;
const check = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : `  ${extra}`}`);
};

const db = new PGlite();
for (const f of readdirSync(migDir).filter((x) => x.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(join(migDir, f), "utf8"));
}
const q = async (sql, params) => (await db.query(sql, params)).rows;
/** True if the statement is rejected and the error message matches re. */
async function rejects(sql, params, re) {
  try {
    await db.query(sql, params);
    return false;
  } catch (e) {
    return re ? re.test(String(e.message)) : true;
  }
}

// ------------------------------------------------------------------ DB-01 schema lint
{
  const tables = await q("select table_name from information_schema.tables where table_schema='drixo' and table_type='BASE TABLE'");
  check("19 tables: the 17 from Doc 05 plus runtime_flag and flag_audit (migration 003)", tables.length === 19, String(tables.length));
  const cols = await q("select table_name, column_name from information_schema.columns where table_schema='drixo'");
  // Token match so e.g. 'description' does not trip 'ip'.
  const forbidden = new Set(["phone", "msisdn", "email", "iccid", "imei", "vin", "pan", "card", "cvv", "ip", "prompt",
    "message", "transcript", "raw", "location", "latitude", "longitude", "lat", "lon", "password", "otp", "pin", "address", "name_full", "ssn"]);
  const bad = cols.filter((c) => c.column_name.split("_").some((t) => forbidden.has(t)));
  check("DB-01: no column for PII / secrets / raw chat text", bad.length === 0, JSON.stringify(bad));
  const textCols = cols.filter((c) => c.table_name.startsWith("turn_") || c.table_name === "guest_session" || c.table_name === "session_event");
  check("DB-01: guest tables hold no free-text content columns", !textCols.some((c) => ["text", "body", "content", "comment"].some((t) => c.column_name.split("_").includes(t))));
}

// ------------------------------------------------------------------ fixtures
const hostOk = "https://driverxmobile.com/faqs-self-service";
await q("insert into drixo.kb_source (source_key, canonical_url, title, category, owner_team) values ('S03', $1, 'FAQs', 'Support', 'Support Ops')", [hostOk]);
await q("select drixo.activate_source('S03', 'editor-a')");

async function draft(code, text, aliases = "") {
  const r = await q("select drixo.add_draft_revision('S03', $1, $2, $3, 'editor-a') as id", [code, text, aliases]);
  return r[0].id;
}
const visibleCodes = async () => (await q("select revision_code from drixo.approved_public_chunks order by revision_code")).map((r) => r.revision_code);
const ts = (sql) => sql; // readability

// ------------------------------------------------------------------ DB-09 draft excluded; lifecycle
const r1 = await draft("KB-100@1", "An eSIM is a digital SIM profile.", "what is an esim");
check("DB-09: DRAFT revision excluded from public view", !(await visibleCodes()).includes("KB-100@1"));
await q("select drixo.submit_revision($1, 'editor-a')", [r1]);
check("DB-09: IN_REVIEW excluded from public view", !(await visibleCodes()).includes("KB-100@1"));
check("approve: four-eyes (submitter cannot approve own revision)",
  await rejects("select drixo.approve_revision($1, 'editor-a', now() - interval '1 hour')", [r1], /dual control/));
check("approve: effective_from required", await rejects("select drixo.approve_revision($1, 'approver-b', null)", [r1], /effective_from/));
check("approve: until must be after from",
  await rejects("select drixo.approve_revision($1, 'approver-b', now(), now() - interval '1 day')", [r1], /effective_until/));
await q("select drixo.approve_revision($1, 'approver-b', now() - interval '1 hour')", [r1]);
check("ARC-10: APPROVED + effective + active source is visible", (await visibleCodes()).includes("KB-100@1"));
const a = await q("select action, actor_ref from drixo.publication_audit where revision_id = $1 order by created_at, action", [r1]);
check("ARC-27: audit records ingest, submit, approve with actors", ["INGEST", "SUBMIT", "APPROVE"].every((x) => a.some((r) => r.action === x)) && a.find((r) => r.action === "APPROVE").actor_ref === "approver-b");

// ------------------------------------------------------------------ immutability / tamper
check("approved chunk text is immutable", await rejects("update drixo.kb_chunk set public_text = 'Changed' where revision_id = $1", [r1], /immutable/));
check("approved chunk cannot be deleted", await rejects("delete from drixo.kb_chunk where revision_id = $1", [r1], /immutable/));
check("approved revision hash is immutable", await rejects("update drixo.kb_revision set content_sha256 = repeat('a',64) where revision_id = $1", [r1], /immutable/));
{
  const t = await draft("KB-101@1", "Original text.");
  await q("select drixo.submit_revision($1, 'editor-a')", [t]);
  await q("update drixo.kb_chunk set public_text = 'Edited after hashing.' where revision_id = $1", [t]); // allowed while IN_REVIEW
  check("tamper: content changed after hashing is caught at approval",
    await rejects("select drixo.approve_revision($1, 'approver-b', now())", [t], /content hash mismatch/));
}
check("transition: DRAFT cannot jump straight to APPROVED",
  await (async () => {
    const t = await draft("KB-102@1", "x");
    return rejects("update drixo.kb_revision set status='APPROVED', approved_by='x', approved_at=now(), effective_from=now() where revision_id=$1", [t], /illegal revision transition/);
  })());

// ------------------------------------------------------------------ DB-10 expiry & future windows
{
  const t = await draft("KB-103@1", "Window test text.");
  await q("select drixo.submit_revision($1, 'editor-a')", [t]);
  await q("select drixo.approve_revision($1, 'approver-b', now() - interval '1 hour', now() + interval '2 seconds')", [t]);
  check("DB-10: inside window => visible", (await visibleCodes()).includes("KB-103@1"));
  await new Promise((r) => setTimeout(r, 2600));
  check("DB-10: after effective_until => hidden with no app change", !(await visibleCodes()).includes("KB-103@1"));

  const f = await draft("KB-104@1", "Future text.");
  await q("select drixo.submit_revision($1, 'editor-a')", [f]);
  await q("select drixo.approve_revision($1, 'approver-b', now() + interval '1 day')", [f]);
  check("DB-10: future effective_from => hidden until then", !(await visibleCodes()).includes("KB-104@1"));
}

// ------------------------------------------------------------------ revoke, supersede, conflict
{
  const r = await draft("KB-105@1", "Revocable text.");
  await q("select drixo.submit_revision($1, 'editor-a')", [r]);
  await q("select drixo.approve_revision($1, 'approver-b', now() - interval '1 minute')", [r]);
  check("pre-revoke visible", (await visibleCodes()).includes("KB-105@1"));
  await q("select drixo.revoke_revision($1, 'security-c', 'WITHDRAWN_BY_OWNER')", [r]);
  check("DB-09 / ARC-11: revoke takes effect on the very next read", !(await visibleCodes()).includes("KB-105@1"));
  check("revoked is terminal (cannot be re-approved or restored)", await rejects("update drixo.kb_revision set status='APPROVED' where revision_id=$1", [r], /illegal revision transition/));
  check("revoke twice is rejected", await rejects("select drixo.revoke_revision($1, 'x', 'AGAIN')", [r], /already revoked/));
  const ra = await q("select action from drixo.publication_audit where revision_id=$1 and action='REVOKE'", [r]);
  check("ARC-27: revoke is audited", ra.length === 1);

  // supersede
  const v2 = await draft("KB-100@2", "An eSIM is a digital SIM profile (updated).");
  await q("select drixo.submit_revision($1, 'editor-a')", [v2]);
  await q("select drixo.approve_revision($1, 'approver-b', now() - interval '1 minute')", [v2]);
  const codes = await visibleCodes();
  check("approving @2 retires @1 of the same article", codes.includes("KB-100@2") && !codes.includes("KB-100@1"), codes.join());
  const st = await q("select status from drixo.kb_revision where revision_id=$1", [r1]);
  check("retired revision status is RETIRED", st[0].status === "RETIRED");

  // conflict (ARC-12)
  const c = await draft("KB-106@1", "Price text A.");
  await q("select drixo.submit_revision($1, 'editor-a')", [c]);
  await q("select drixo.approve_revision($1, 'approver-b', now() - interval '1 minute')", [c]);
  await q("select drixo.open_conflict($1, 'content-d', 'SOURCES_DISAGREE')", [c]);
  check("ARC-12: open source conflict suppresses the revision", !(await visibleCodes()).includes("KB-106@1"));
  await q("select drixo.resolve_conflict($1, 'content-d', 'OWNER_DECIDED')", [c]);
  check("conflict resolution restores eligibility", (await visibleCodes()).includes("KB-106@1"));
  const blocked = await draft("KB-107@1", "x");
  await q("select drixo.submit_revision($1, 'editor-a')", [blocked]);
  await q("select drixo.open_conflict($1, 'content-d', 'SOURCES_DISAGREE')", [blocked]);
  check("open conflict blocks approval", await rejects("select drixo.approve_revision($1, 'approver-b', now())", [blocked], /conflict/));

  // source hold removes all its content
  await q("update drixo.kb_source set status='HOLD' where source_key='S03'");
  check("source on HOLD hides all of its revisions", (await visibleCodes()).length === 0);
  await q("update drixo.kb_source set status='ACTIVE' where source_key='S03'");
}

// ------------------------------------------------------------------ source / link rules
check("source: http URL rejected", await rejects("insert into drixo.kb_source (source_key, canonical_url, title, category, owner_team) values ('X1','http://driverxmobile.com/','t','c','o')"));
check("source: javascript URL rejected", await rejects("insert into drixo.kb_source (source_key, canonical_url, title, category, owner_team) values ('X2','javascript:alert(1)','t','c','o')"));
check("source: non-PUBLIC visibility rejected", await rejects("insert into drixo.kb_source (source_key, canonical_url, title, category, owner_team, visibility) values ('X3','https://driverxmobile.com/','t','c','o','PRIVATE')"));
await q("insert into drixo.kb_source (source_key, canonical_url, title, category, owner_team) values ('X4','https://evil.example/p','t','c','o')");
check("DB-13: off-domain source cannot be activated", await rejects("select drixo.activate_source('X4','editor-a')", [], /allowlist/));
check("link: http URL rejected", await rejects("insert into drixo.public_link (link_key,label,url,kind) values ('SUP','s','http://driverxmobile.com/s','SUPPORT')"));
check("link: ACTIVE requires verification", await rejects("insert into drixo.public_link (link_key,label,url,kind,status) values ('SUP','s','https://driverxmobile.com/s','SUPPORT','ACTIVE')"));
check("audit: reason must be a controlled code (no free text)", await rejects("insert into drixo.publication_audit (revision_id, action, actor_ref, reason_code) select revision_id,'REVOKE','x','please remove this, it is wrong' from drixo.kb_revision limit 1"));
check("audit: append-only (update rejected)", await rejects("update drixo.publication_audit set actor_ref='x'", [], /append-only/));
check("audit: append-only (delete rejected)", await rejects("delete from drixo.publication_audit", [], /append-only/));

// ------------------------------------------------------------------ DB-14/15/16 config, shortcuts, flows
{
  const [cfg] = await q("insert into drixo.release_config (version_code, status, safety_notice, published_at) values ('v1','ACTIVE','For your safety, chat only when parked.', now()) returning config_id");
  check("DB-15: voice flag cannot be true in P0", await rejects("insert into drixo.release_config (version_code, voice, safety_notice) values ('v2', true, 'x')", [], /p0_flags_off/));
  check("DB-15: supplier_writes cannot be true in P0", await rejects("insert into drixo.release_config (version_code, supplier_writes, safety_notice) values ('v3', true, 'x')", [], /p0_flags_off/));
  check("only one ACTIVE release config per locale", await rejects("insert into drixo.release_config (version_code, status, safety_notice) values ('v4','ACTIVE','x')"));
  const intents = ["FIX_CONNECTION", "ACTIVATE_SIM_ESIM", "PLANS_HOTSPOT", "BILLING_TOPUPS", "FLEET_IOT", "DRIVER_BENEFITS"];
  for (const [i, c] of intents.entries()) await q("insert into drixo.shortcut (config_id, intent_code, label, display_order) values ($1,$2,$2,$3)", [cfg.config_id, c, i + 1]);
  check("DB-14: six unique shortcuts, order 1-6", (await q("select count(distinct display_order)::int n from drixo.shortcut where config_id=$1", [cfg.config_id]))[0].n === 6);
  check("DB-14: duplicate display_order rejected", await rejects("insert into drixo.shortcut (config_id, intent_code, label, display_order) values ($1,'FIX_CONNECTION','x',2)", [cfg.config_id]));
  check("DB-14: order 7 rejected", await rejects("insert into drixo.shortcut (config_id, intent_code, label, display_order) values ($1,'FLEET_IOT','x',7)", [cfg.config_id]));
  check("DB-14: unapproved intent code rejected", await rejects("insert into drixo.shortcut (config_id, intent_code, label, display_order) values ($1,'RUN_TOOL','x',3)", [cfg.config_id]));

  const [f1] = await q("insert into drixo.flow_definition (flow_code, version_code, owner_team) values ('CONNECTION','1','AI') returning flow_id");
  const [f2] = await q("insert into drixo.flow_definition (flow_code, version_code, owner_team) values ('SIM','1','AI') returning flow_id");
  const [s1] = await q("insert into drixo.flow_step (flow_id, step_code, ui_state, step_kind, public_copy) values ($1,'a','S05','QUESTION','Are calls and texts working?') returning step_id", [f1.flow_id]);
  const [s2] = await q("insert into drixo.flow_step (flow_id, step_code, ui_state, step_kind, public_copy) values ($1,'b','S04','GUIDANCE','Restart your phone.') returning step_id", [f1.flow_id]);
  const [x1] = await q("insert into drixo.flow_step (flow_id, step_code, ui_state, step_kind, public_copy) values ($1,'x','S04','GUIDANCE','Other flow.') returning step_id", [f2.flow_id]);
  await q("insert into drixo.flow_option (flow_id, step_id, option_code, label, target_step_id, sort_order) values ($1,$2,'YES','Yes',$3,1)", [f1.flow_id, s1.step_id, s2.step_id]);
  check("DB-16: same-flow transition accepted", true);
  check("DB-16: cross-flow target rejected", await rejects("insert into drixo.flow_option (flow_id, step_id, option_code, label, target_step_id, sort_order) values ($1,$2,'NO','No',$3,2)", [f1.flow_id, s1.step_id, x1.step_id]));
  check("DB-16: option attached to a step of another flow rejected", await rejects("insert into drixo.flow_option (flow_id, step_id, option_code, label, target_step_id, sort_order) values ($1,$2,'Z','z',null,3)", [f2.flow_id, s1.step_id]));
  check("flow copy: URL rejected", await rejects("insert into drixo.flow_step (flow_id, step_code, ui_state, step_kind, public_copy) values ($1,'u','S04','GUIDANCE','Visit https://evil.example now')", [f1.flow_id]));
  check("flow copy: markup rejected", await rejects("insert into drixo.flow_step (flow_id, step_code, ui_state, step_kind, public_copy) values ($1,'m','S04','GUIDANCE','<script>alert(1)</script>')", [f1.flow_id]));
  check("flow step: unsupported UI state rejected", await rejects("insert into drixo.flow_step (flow_id, step_code, ui_state, step_kind, public_copy) values ($1,'s','S14','GUIDANCE','x')", [f1.flow_id]));
}

// ------------------------------------------------------------------ guest metadata constraints
{
  const sid = "11111111-1111-4111-8111-111111111111";
  await q("insert into drixo.guest_session (session_id, capability_hmac, idle_expires_at, absolute_expires_at) values ($1, '\\x00', now() + interval '1 hour', now() + interval '4 hours')", [sid]);
  const t1 = "22222222-2222-4222-8222-222222222221";
  const t2 = "22222222-2222-4222-8222-222222222222";
  const cr = "33333333-3333-4333-8333-333333333331";
  const ins = (turn, req, v) => q("insert into drixo.turn_metadata (turn_id, session_id, client_request_id, context_version, input_type, response_class, ui_state, outcome, correlation_id) values ($1,$2,$3,$4,'TEXT','GUIDANCE','S04','NONE','req-x')", [turn, sid, req, v]);
  await ins(t1, cr, 1);
  check("DB-04: duplicate context_version in a session rejected (race loser)", await rejects("insert into drixo.turn_metadata (turn_id, session_id, client_request_id, context_version, input_type, response_class, ui_state, outcome, correlation_id) values ($1,$2,$3,1,'TEXT','GUIDANCE','S04','NONE','r')", [t2, sid, "33333333-3333-4333-8333-333333333332"]));
  check("DB-05: duplicate client_request_id in a session rejected", await rejects("insert into drixo.turn_metadata (turn_id, session_id, client_request_id, context_version, input_type, response_class, ui_state, outcome, correlation_id) values ($1,$2,$3,2,'TEXT','GUIDANCE','S04','NONE','r')", [t2, sid, cr]));
  check("turn: unknown response_class rejected", await rejects("insert into drixo.turn_metadata (turn_id, session_id, client_request_id, context_version, input_type, response_class, ui_state, outcome, correlation_id) values ($1,$2,$3,2,'TEXT','HACKED','S04','NONE','r')", [t2, sid, "33333333-3333-4333-8333-333333333333"]));
  await q("insert into drixo.turn_feedback (turn_id, helpful, reason) values ($1,false,'OUTDATED')", [t1]);
  check("DB-17: one feedback per turn", await rejects("insert into drixo.turn_feedback (turn_id, helpful) values ($1,true)", [t1]));
  check("DB-17: feedback must reference an existing turn", await rejects("insert into drixo.turn_feedback (turn_id, helpful) values ($1,true)", [t2]));
  check("DB-17: reason is a closed enum (no free text)", await rejects("update drixo.turn_feedback set reason='it was bad' where turn_id=$1", [t1]));
  const rev = (await q("select revision_id from drixo.kb_revision where revision_code='KB-100@2'"))[0].revision_id;
  await q("insert into drixo.turn_source (turn_id, revision_id, citation_order) values ($1,$2,1)", [t1, rev]);
  check("DB-12: citation must reference a real revision", await rejects("insert into drixo.turn_source (turn_id, revision_id, citation_order) values ($1,'99999999-9999-4999-8999-999999999999',2)", [t1]));
  check("session: idle expiry cannot exceed absolute expiry", await rejects("insert into drixo.guest_session (session_id, capability_hmac, idle_expires_at, absolute_expires_at) values ('44444444-4444-4444-8444-444444444444','\\x00', now() + interval '5 hours', now() + interval '1 hour')"));
  check("session: only GUEST mode allowed", await rejects("insert into drixo.guest_session (session_id, capability_hmac, mode, idle_expires_at, absolute_expires_at) values ('55555555-5555-4555-8555-555555555555','\\x00','SUBSCRIBER', now(), now())"));

  await q("delete from drixo.guest_session where session_id=$1", [sid]);
  const left = (await q("select (select count(*) from drixo.turn_metadata)::int + (select count(*) from drixo.turn_feedback)::int + (select count(*) from drixo.turn_source)::int as n"))[0].n;
  check("DB-19: purging a session cascades turns, feedback and citations", left === 0, String(left));
}

check("retention: APPROVED without duration/approver rejected (blank is not approval)",
  await rejects("insert into drixo.retention_policy (retention_class, store_name, status) values ('guest_session','postgres','APPROVED')"));
await q("insert into drixo.retention_policy (retention_class, store_name) values ('guest_session','postgres')");
check("retention: PENDING policy allowed with no duration (D-04 open)", true);

// ------------------------------------------------------------------ ARC-15 / DB-21 roles
{
  const asRole = async (role, fn) => {
    await db.exec(`set role ${role}`);
    try { return await fn(); } finally { await db.exec("reset role"); }
  };
  const denied = (role, sql, params) => asRole(role, () => rejects(sql, params, /permission denied/));

  check("ARC-15: BFF can read the approved view", await asRole("drixo_bff", async () => { await q("select count(*) from drixo.approved_public_chunks"); return true; }));
  check("ARC-15: BFF cannot read raw kb_chunk", await denied("drixo_bff", "select * from drixo.kb_chunk"));
  check("ARC-15: BFF cannot read kb_revision", await denied("drixo_bff", "select * from drixo.kb_revision"));
  check("ARC-15: BFF cannot read kb_source", await denied("drixo_bff", "select * from drixo.kb_source"));
  check("DB-21: BFF cannot approve", await denied("drixo_bff", "select drixo.approve_revision('99999999-9999-4999-8999-999999999999','x',now())"));
  check("DB-21: BFF cannot revoke", await denied("drixo_bff", "select drixo.revoke_revision('99999999-9999-4999-8999-999999999999','x','TEST')"));
  check("DB-21: BFF cannot write kb_revision", await denied("drixo_bff", "update drixo.kb_revision set status='APPROVED'"));
  check("DB-21: BFF cannot touch the audit log", await denied("drixo_bff", "delete from drixo.publication_audit"));
  check("ARC-15: BFF cannot delete guest sessions (purge is the retention role)", await denied("drixo_bff", "delete from drixo.guest_session"));
  check("BFF can insert a guest session", await asRole("drixo_bff", async () => {
    await q("insert into drixo.guest_session (session_id, capability_hmac, idle_expires_at, absolute_expires_at) values ('66666666-6666-4666-8666-666666666666','\\x00', now() + interval '1 hour', now() + interval '2 hours')");
    return true; }));
  check("DB-21: publisher cannot read guest data", await denied("drixo_publisher", "select * from drixo.guest_session"));
  check("DB-21: publisher cannot read turn metadata", await denied("drixo_publisher", "select * from drixo.turn_metadata"));
  check("DB-21: publisher has no direct write on kb tables (guarded functions only)", await denied("drixo_publisher", "update drixo.kb_revision set status='APPROVED'"));
  check("DB-21: publisher cannot insert chunks directly", await denied("drixo_publisher", "insert into drixo.kb_chunk (revision_id, ordinal, public_text) values ('99999999-9999-4999-8999-999999999999',0,'x')"));
  check("DB-21: publisher can run the guarded workflow", await asRole("drixo_publisher", async () => {
    const id = (await q("select drixo.add_draft_revision('S03','KB-200@1','Role test text.','', 'editor-a') as id"))[0].id;
    await q("select drixo.submit_revision($1,'editor-a')", [id]);
    return true; }));
  check("retention role can purge sessions but not read kb", await asRole("drixo_retention", async () => {
    await q("delete from drixo.guest_session where session_id='66666666-6666-4666-8666-666666666666'");
    return rejects("select * from drixo.kb_revision", [], /permission denied/); }));
  check("reporting role sees the thresholded aggregate only", await asRole("drixo_reporting", async () => {
    await q("select * from drixo.daily_metric_reportable");
    return rejects("select * from drixo.guest_session", [], /permission denied/); }));
}

// ------------------------------------------------------------------ Phase 6: runtime flags + retention
{
  const flags = Object.fromEntries((await q("select flag, enabled, rollout_percent from drixo.runtime_flag")).map((r) => [r.flag, r]));
  check("flags: fresh environment ships DARK (assistant 0% rollout)", flags.ASSISTANT.enabled === true && flags.ASSISTANT.rollout_percent === 0);
  check("flags: KB on, model synthesis off by default", flags.KB_RETRIEVAL.enabled === true && flags.MODEL_SYNTHESIS.enabled === false);
  check("flags: unknown flag rejected", await rejects("insert into drixo.runtime_flag (flag, enabled, rollout_percent, changed_by, reason_code) values ('SELF_DESTRUCT', true, 1, 'x', 'TEST')"));
  check("flags: rollout above 100 rejected", await rejects("select drixo.set_flag('ASSISTANT', true, 101, 'ops', 'TEST_REASON')", [], /0-100/));
  await q("select drixo.set_flag('ASSISTANT', true, 5, 'ops-a', 'CANARY_START')");
  await q("select drixo.set_flag('ASSISTANT', false, 5, 'ops-a', 'INCIDENT_TEST')");
  const now = (await q("select enabled, rollout_percent, changed_by, reason_code from drixo.runtime_flag where flag='ASSISTANT'"))[0];
  check("flags: set_flag applies and records who/why", now.enabled === false && now.rollout_percent === 5 && now.changed_by === "ops-a" && now.reason_code === "INCIDENT_TEST");
  check("flags: every change is audited", (await q("select count(*)::int n from drixo.flag_audit where flag='ASSISTANT'"))[0].n === 2);
  check("flags: reason must be a controlled code", await rejects("select drixo.set_flag('ASSISTANT', true, 5, 'ops', 'because I felt like it')"));
  check("flags: audit is append-only (update)", await rejects("update drixo.flag_audit set actor_ref='x'", [], /append-only/));
  check("flags: audit is append-only (delete)", await rejects("delete from drixo.flag_audit", [], /append-only/));
  await q("select drixo.set_flag('ASSISTANT', true, 0, 'ops-a', 'RESET')");

  const asRole = async (role, fn) => {
    await db.exec(`set role ${role}`);
    try { return await fn(); } finally { await db.exec("reset role"); }
  };
  const denied = (role, sql, params) => asRole(role, () => rejects(sql, params, /permission denied/));
  check("flags: BFF can read flags", await asRole("drixo_bff", async () => { await q("select * from drixo.runtime_flag"); return true; }));
  check("flags: BFF cannot change flags directly", await denied("drixo_bff", "update drixo.runtime_flag set enabled = false"));
  check("flags: BFF cannot call set_flag", await denied("drixo_bff", "select drixo.set_flag('ASSISTANT', false, 0, 'x', 'TEST_REASON')"));
  check("flags: ops role can call set_flag", await asRole("drixo_ops", async () => { await q("select drixo.set_flag('KB_RETRIEVAL', true, 100, 'ops-b', 'NOOP_TEST')"); return true; }));
  check("flags: ops role cannot write the flag table directly", await denied("drixo_ops", "update drixo.runtime_flag set enabled = false"));
  check("flags: ops role cannot read guest data", await denied("drixo_ops", "select * from drixo.guest_session"));
  check("flags: ops role cannot publish knowledge", await denied("drixo_ops", "select drixo.revoke_revision('99999999-9999-4999-8999-999999999999','x','TEST')"));

  // Retention worker (DB-19): refuses to run until the policy is approved (D-04), then purges by age.
  const ins = (sid, idle, abs) => q("insert into drixo.guest_session (session_id, capability_hmac, idle_expires_at, absolute_expires_at) values ($1, '\\x00', now() + $2::interval, now() + $3::interval)", [sid, idle, abs]);
  await ins("a0000000-0000-4000-8000-00000000000a", "-3 hours", "-2 hours"); // expired 3h ago
  await ins("b0000000-0000-4000-8000-00000000000b", "-10 seconds", "1 hour"); // expired just now
  await ins("c0000000-0000-4000-8000-00000000000c", "1 hour", "4 hours"); // active
  check("retention: purge refuses to run while the policy is PENDING (fail closed)", await asRole("drixo_retention", () => rejects("select drixo.purge_expired_sessions('job')", [], /not approved/)));
  await q("update drixo.retention_policy set status='APPROVED', duration_seconds=3600, approved_by='privacy-lead', approved_at=now() where retention_class='guest_session'");
  const purged = await asRole("drixo_retention", async () => (await q("select drixo.purge_expired_sessions('job') as n"))[0].n);
  const left = (await q("select session_id from drixo.guest_session order by session_id")).map((r) => r.session_id);
  check("retention: purges only sessions older than the approved duration", Number(purged) === 1 && left.length === 2 && !left.includes("a0000000-0000-4000-8000-00000000000a"), `purged=${purged} left=${left}`);
  check("retention: recently expired and active sessions are kept", left.includes("b0000000-0000-4000-8000-00000000000b") && left.includes("c0000000-0000-4000-8000-00000000000c"));
  check("retention: BFF cannot call purge", await denied("drixo_bff", "select drixo.purge_expired_sessions('x')"));
  check("retention: ops role cannot call purge", await denied("drixo_ops", "select drixo.purge_expired_sessions('x')"));
}

// ------------------------------------------------------------------ Migration 004: metadata + privacy-safe daily metrics
{
  const asRole = async (role, fn) => {
    await db.exec(`set role ${role}`);
    try { return await fn(); } finally { await db.exec("reset role"); }
  };
  const denied = (role, sql, params) => asRole(role, () => rejects(sql, params, /permission denied/));

  const sid = "d0000000-0000-4000-8000-0000000000d1";
  await q("insert into drixo.guest_session (session_id, capability_hmac, idle_expires_at, absolute_expires_at) values ($1, decode('00','hex'), now() + interval '1 hour', now() + interval '2 hours')", [sid]);
  check("turn_metadata records a creation time (needed for daily aggregation and retention)", (await q("select count(*)::int n from information_schema.columns where table_schema='drixo' and table_name='turn_metadata' and column_name='created_at'"))[0].n === 1);
  let v = 0;
  const addTurn = async (intent, cls) => {
    v++;
    await q("insert into drixo.turn_metadata (turn_id, session_id, client_request_id, context_version, input_type, intent_code, response_class, ui_state, outcome, correlation_id) values (gen_random_uuid(), $1, gen_random_uuid(), $2, 'SHORTCUT', $3, $4, 'S05', 'NONE', 'req-x')", [sid, v, intent, cls]);
  };
  for (let i = 0; i < 7; i++) await addTurn("FIX_CONNECTION", "QUESTION");
  for (let i = 0; i < 2; i++) await addTurn("FLEET_IOT", "QUESTION");

  const cells = await asRole("drixo_metrics", async () => (await q("select drixo.refresh_daily_metric(current_date) as n"))[0].n);
  check("daily aggregation: one cell per (intent, class, outcome)", Number(cells) === 2, String(cells));
  const raw = await q("select intent_code, sample_count::int n from drixo.daily_metric order by intent_code");
  check("daily aggregation: counts are correct (7 and 2)", raw.length === 2 && raw.find((r) => r.intent_code === "FIX_CONNECTION").n === 7 && raw.find((r) => r.intent_code === "FLEET_IOT").n === 2, JSON.stringify(raw));
  const rep = await asRole("drixo_reporting", async () => await q("select intent_code from drixo.daily_metric_reportable"));
  check("small-cohort floor: the 2-turn cell is hidden from reporting, the 7-turn cell is visible", rep.length === 1 && rep[0].intent_code === "FIX_CONNECTION", JSON.stringify(rep));
  await asRole("drixo_metrics", async () => { await q("select drixo.refresh_daily_metric(current_date)"); });
  check("aggregation is idempotent (re-running a day does not double count)", (await q("select sum(sample_count)::int n from drixo.daily_metric"))[0].n === 9);
  const colsAgg = (await q("select column_name from information_schema.columns where table_schema='drixo' and table_name='daily_metric'")).map((c) => c.column_name);
  check("the aggregate has no session, guest or text column", !colsAgg.some((c) => /session|guest|text|message|turn_id/.test(c)), colsAgg.join(","));

  check("reporting role cannot read the raw aggregate table", await denied("drixo_reporting", "select * from drixo.daily_metric"));
  check("metrics worker cannot read raw turns", await denied("drixo_metrics", "select * from drixo.turn_metadata"));
  check("metrics worker cannot read sessions", await denied("drixo_metrics", "select * from drixo.guest_session"));
  check("BFF cannot run the aggregation", await denied("drixo_bff", "select drixo.refresh_daily_metric(current_date)"));
  check("BFF cannot read the aggregate", await denied("drixo_bff", "select * from drixo.daily_metric"));
  check("BFF can write turn rows (its narrow grant is intact)", await asRole("drixo_bff", async () => {
    await q("insert into drixo.turn_metadata (turn_id, session_id, client_request_id, context_version, input_type, response_class, ui_state, outcome, correlation_id) values (gen_random_uuid(), $1, gen_random_uuid(), 99, 'TEXT', 'NO_SOURCE', 'S09', 'NONE', 'req-y')", [sid]);
    return true; }));
  check("BFF cannot delete turn rows (purge belongs to the retention worker)", await denied("drixo_bff", "delete from drixo.turn_metadata"));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
