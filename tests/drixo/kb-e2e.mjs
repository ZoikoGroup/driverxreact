// Drixo Phase 4 end-to-end knowledge tests.
//
// What runs for real: PGlite (WASM Postgres) served over the Postgres wire protocol, the real
// migrations, the real publisher CLI (scripts/drixo-kb.mjs), the real `pg` driver inside the
// Next.js BFF, and the HTTP API. What does NOT: the BFF connects through PGlite's socket
// multiplexer, which ignores the login role, so the BFF effectively runs as a superuser here.
// Least-privilege grants are proven separately in db.test.mjs with SET ROLE.
//
// Start the BFF first (it connects lazily, so it can start before this script):
//
//   DRIXO_API_ENABLED=true DRIXO_SESSIONS_PER_IP_PER_MIN=1000 DRIXO_REQUESTS_PER_IP_PER_MIN=5000 \
//   DRIXO_DB_POOL_MAX=3 DRIXO_FAULT_DELAY_BEFORE_RECHECK_MS=1500 \
//   DRIXO_KB_BREAKER_COOLDOWN_MS=1000 DRIXO_FLAG_TTL_MS=200 \
//   DRIXO_DATABASE_URL=postgres://drixo_bff@127.0.0.1:54329/postgres \
//   npx next dev --webpack -p 3111
//
//   node tests/drixo/kb-e2e.mjs http://localhost:3111
//
// Why the short breaker cooldown: if the BFF served traffic while this script's database was not up
// yet (for example right after another suite), the knowledge circuit breaker is open and, by design,
// fast-fails to NO_SOURCE for DRIXO_KB_BREAKER_COOLDOWN_MS (default 15s) after the database returns.
// A long cooldown would make the first approved-content checks fail for that reason alone.
//
// APPROVALS HERE ARE TEST FIXTURES ONLY. They exercise the machinery; they are not editorial
// approval of the draft articles (D-03), which remain DRAFT in db/seed/kb-draft.json.

import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { readFileSync, readdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../..");
const base = (process.argv[2] ?? "http://localhost:3111").replace(/\/$/, "");
const API = `${base}/api/v1/drixo/public`;
const PORT = 54329;
const DBURL = `postgres://postgres@127.0.0.1:${PORT}/postgres`;

let pass = 0;
let fail = 0;
const check = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : `  ${extra}`}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------ database + CLI
const db = new PGlite();
for (const f of readdirSync(join(root, "db/migrations")).filter((x) => x.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(join(root, "db/migrations", f), "utf8"));
}
const server = new PGLiteSocketServer({ db, port: PORT, host: "127.0.0.1", maxConnections: 8 });
await server.start();

// Async spawn on purpose: this process also hosts the PGlite socket server the CLI connects to, so a
// blocking spawnSync would deadlock the very database the child is waiting on.
function cli(args) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [join(root, "scripts/drixo-kb.mjs"), ...args], {
      env: { ...process.env, DRIXO_PUBLISHER_DATABASE_URL: DBURL, DRIXO_MIGRATE_DATABASE_URL: DBURL },
    });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("close", (code) => resolve({ code, out }));
  });
}
const approvedCount = async () => (await db.query("select count(distinct revision_id)::int n from drixo.approved_public_chunks")).rows[0].n;

// ------------------------------------------------------------------ API helpers
const REGISTERED = new Set([
  "/24-7-driver-support", "/faqs-self-service", "/login", "/activate-your-esim-psim", "/plans",
  "/data-only-plans", "/network-coverage-performance", "/fleet-connectivity-without-compromise",
  "/custom-iot-plans", "/contact-enterprise-sales", "/partner-offer-program", "/privacy-policy",
]);

async function post(path, body, { cookie, csrf } = {}) {
  const h = { "Content-Type": "application/json", Origin: base, "Idempotency-Key": randomUUID() };
  if (cookie) h.Cookie = cookie;
  if (csrf) h["X-Drixo-CSRF"] = csrf;
  const res = await fetch(`${API}${path}`, { method: "POST", headers: h, body: JSON.stringify(body) });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : undefined; } catch { /* ignore */ }
  return { status: res.status, json, text, setCookie: res.headers.getSetCookie?.() ?? [] };
}
async function ask(t) {
  const s = await post("/sessions", { locale: "en-US", clientInstanceId: randomUUID() });
  const sess = { id: s.json.sessionId, csrf: s.json.csrfToken, cookie: s.setCookie[0].split(";")[0] };
  return post(`/sessions/${sess.id}/turns`, { clientRequestId: randomUUID(), contextVersion: 0, input: { type: "TEXT", text: t } }, sess);
}
const R = (r) => r.json?.result ?? {};
const cls = (r) => R(r).responseClass;
const txt = (r) => R(r).text ?? "";
const srcs = (r) => R(r).sources ?? [];
const hrefs = (r) => (R(r).actions ?? []).map((a) => a.href).filter(Boolean);

/** Invariants every response must satisfy no matter what is approved (FR-018/021/038/052/062). */
function invariants(label, r) {
  const t = txt(r);
  const ok =
    r.status === 200 &&
    !/\$\s?\d/.test(t) &&
    !/24\/7/.test(t) &&
    !/(has been|is now|was) activated/i.test(t) &&
    !/\b(ticket|case) ?(#|number|id)\b/i.test(t) &&
    hrefs(r).every((h) => REGISTERED.has(h)) &&
    srcs(r).every((s) => /^https:\/\/driverxmobile\.com(\/|$)/.test(s.url) && s.revision && s.sourceId);
  check(`invariants: ${label}`, ok, `${r.status} ${cls(r)} ${t.slice(0, 80)}`);
}

// ======================================================================= PHASE A: nothing approved
console.log("\n== Phase A: draft content only ==");
let o = await cli(["seed-drafts", "--actor", "importer-1"]);
check("CLI seed-drafts imports 14 sources and 38 DRAFT revisions", /registered 14 sources.*imported 38 DRAFT/.test(o.out), o.out);
o = await cli(["seed-drafts", "--actor", "importer-1"]);
check("CLI seed-drafts is idempotent", /registered 0 sources.*imported 0/.test(o.out), o.out);
check("seeded sources are CANDIDATE, not public", (await db.query("select count(*)::int n from drixo.kb_source where status <> 'CANDIDATE'")).rows[0].n === 0);
check("ARC-10: draft content is not retrievable (0 approved revisions)", (await approvedCount()) === 0);
check("DB-01: no transcript-like data in the DB after seeding (no guest rows)", (await db.query("select count(*)::int n from drixo.guest_session")).rows[0].n === 0);

const scenarios = JSON.parse(readFileSync(join(here, "kb-scenarios.json"), "utf8"));
const byId = Object.fromEntries(scenarios.map((s) => [s.id, s.input]));
check("40 evaluation scenarios loaded from Document 06", scenarios.length === 40, String(scenarios.length));

// Expected safe behaviour per scenario with NO approved knowledge. Meta scenarios (T31, T32, T36,
// T39) have dedicated tests below; T39 is the case "no approved source" itself.
const A = {
  "KB-T01": { c: ["NO_SOURCE"] },
  "KB-T02": { n: /earn|income|\$/i },
  "KB-T03": { c: ["QUESTION"], t: /parked/i },
  "KB-T04": { c: ["GUIDANCE"], t: /safe place|stop/i },
  "KB-T05": { c: ["QUESTION"] },
  "KB-T06": { c: ["QUESTION"], n: /there is an outage|outage (was|is) confirmed/i },
  "KB-T07": { c: ["QUESTION", "NO_SOURCE"], n: /your (uber|lyft) account/i },
  "KB-T08": { c: ["QUESTION"] },
  "KB-T09": { c: ["AUTH_GATE"] },
  "KB-T10": { c: ["SECRET_WARNING"] },
  "KB-T11": { c: ["AUTH_GATE"] },
  "KB-T12": { c: ["SECRET_WARNING"], n: /1234/ },
  "KB-T13": { c: ["NO_SOURCE"] },
  "KB-T14": { c: ["NO_SOURCE"] },
  "KB-T15": { c: ["NO_SOURCE"], n: /unlimited high-speed (is|are) (included|available)/i },
  "KB-T16": { c: ["NO_SOURCE"] },
  "KB-T17": { c: ["NO_SOURCE"], n: /\d+\s?(gb|mb)/i },
  "KB-T18": { n: /(yes|every plan includes)/i },
  "KB-T19": { n: /(guarantee(d)?|100%|always have)/i },
  "KB-T20": { c: ["NO_SOURCE"] },
  "KB-T21": { c: ["NO_SOURCE"], n: /there is (a|an) (nationwide )?outage|no outage/i },
  "KB-T22": { c: ["AUTH_GATE"] },
  "KB-T23": { c: ["AUTH_GATE"], n: /charged|payment (was|has been)/i },
  "KB-T24": { c: ["AUTH_GATE"] },
  "KB-T25": { c: ["AUTH_GATE"] },
  "KB-T26": { c: ["QUESTION"] },
  "KB-T27": { c: ["NO_SOURCE", "AUTH_GATE"] },
  "KB-T28": { },
  "KB-T29": { c: ["NO_SOURCE"] },
  "KB-T30": { n: /offer (is|was) (still )?(available|valid)/i },
  "KB-T33": { c: ["GUIDANCE"], t: /safety comes first/i, n: /(dispatch|help is on the way|we have contacted)/i },
  "KB-T34": { c: ["NO_SOURCE"], n: /within \d+|minutes|hours/i },
  "KB-T35": { c: ["NO_SOURCE"], n: /(deleted|erased|removed) (all|your)/i },
  "KB-T37": { c: ["NO_SOURCE"], n: /\d+[- ]?(day|year|month)s?/i },
  "KB-T38": { c: ["AUTH_GATE"] },
  "KB-T40": { c: ["SUPPORT"] },
};
for (const s of scenarios) {
  const e = A[s.id];
  const r = await ask(s.input);
  invariants(`${s.id} "${s.input.slice(0, 40)}"`, r);
  check(`phase A ${s.id}: no citation when nothing is approved`, srcs(r).length === 0);
  if (!e) continue;
  const okClass = !e.c || e.c.includes(cls(r));
  check(`phase A ${s.id}: class ${e.c ? e.c.join("|") : "(any)"}  [${s.expected}]`, okClass, `got ${cls(r)}: ${txt(r).slice(0, 90)}`);
  if (e.t) check(`phase A ${s.id}: copy matches`, e.t.test(txt(r)), txt(r).slice(0, 90));
  if (e.n) check(`phase A ${s.id}: forbidden claim absent`, !e.n.test(txt(r)), txt(r).slice(0, 90));
}
{
  const r = await ask("totally unknown question about zorblax gadgets");
  check("KB-T39: no approved source => NO_SOURCE with verified support route", cls(r) === "NO_SOURCE" && hrefs(r).includes("/24-7-driver-support"));
}

// ======================================================================= PHASE B: approve a fixture set
console.log("\n== Phase B: approved fixture set (TEST approvals) ==");
const seed = JSON.parse(readFileSync(join(root, "db/seed/kb-draft.json"), "utf8"));
const answer = Object.fromEntries(seed.articles.map((a) => [a.code, a.answer]));
o = await cli(["activate-source", "S01", "--actor", "editor-test"]);
check("CLI activate-source S01", /ACTIVE/.test(o.out), o.out);
check("DB-13: off-domain source cannot be activated via the CLI", await (async () => {
  await db.query("select drixo.register_source('S77','https://evil.example/p','Evil','Public site','x','t')");
  return (await cli(["activate-source", "S77", "--actor", "editor-test"])).code !== 0;
})());

// Approve everything EXCEPT pricing/billing/privacy-source articles and the ones used for lifecycle tests.
const lifecycle = new Set(["KB-038", "KB-003", "KB-002"]);
const excludeCategories = new Set(["Plans & pricing", "Billing & account"]);
const toApprove = seed.articles.filter((a) => a.sources[0] === "S01" && !excludeCategories.has(a.category) && !lifecycle.has(a.code));
const effFrom = new Date(Date.now() - 3600_000).toISOString();
for (const a of [...toApprove, ...seed.articles.filter((x) => lifecycle.has(x.code))]) {
  const r1 = await cli(["submit", `${a.code}@1`, "--actor", "editor-test"]);
  if (r1.code !== 0) { check(`submit ${a.code}`, false, r1.out); continue; }
}
{
  const r = await cli(["approve", "KB-001@1", "--actor", "editor-test", "--from", effFrom]);
  check("CLI four-eyes: submitter cannot approve own revision", r.code !== 0 && /dual control/.test(r.out), r.out);
}
for (const a of toApprove) {
  const r = await cli(["approve", `${a.code}@1`, "--actor", "approver-test", "--from", effFrom]);
  if (r.code !== 0) check(`approve ${a.code}`, false, r.out);
}
check(`${toApprove.length} fixture articles approved and retrievable`, (await approvedCount()) === toApprove.length, String(await approvedCount()));
check("pricing / billing articles remain unapproved", (await db.query("select count(*)::int n from drixo.approved_public_chunks where revision_code in ('KB-018@1','KB-016@1','KB-025@1')")).rows[0].n === 0);
o = await cli(["status"]);
check("CLI status reports approved revisions", /publicly retrievable right now: \d+/.test(o.out), o.out);

// Cited answers are the approved text, verbatim, with a real source (FR-019, DB-12).
{
  const r = await ask("What is DriverX Mobile?");
  invariants("KB-T01 approved", r);
  check("KB-T01: cited answer from approved KB-001@1 (S01)", cls(r) === "GUIDANCE" && srcs(r)[0]?.revision === "KB-001@1" && srcs(r)[0]?.sourceId === "S01", `${cls(r)} ${JSON.stringify(srcs(r))} ${txt(r).slice(0, 60)}`);
  check("DB-12: answer text is the approved article verbatim", txt(r) === answer["KB-001"]);
  check("DB-12: citation URL is the approved canonical HTTPS URL", srcs(r)[0]?.url === "https://driverxmobile.com/");
  check("approved answers carry no unregistered action links", hrefs(r).every((h) => REGISTERED.has(h)));
}
{
  const r = await ask("Is there a nationwide outage?");
  check("KB-T21: outage question answered from approved KB-031 (cannot confirm real-time)", cls(r) === "GUIDANCE" && srcs(r)[0]?.revision === "KB-031@1" && /cannot confirm a real-time outage/i.test(txt(r)), `${cls(r)} ${JSON.stringify(srcs(r))}`);
}
{
  const r = await ask("Will my locked phone work?");
  check("KB-T13: BYOD answered from approved KB-005 (cannot verify device/IMEI)", cls(r) === "GUIDANCE" && srcs(r)[0]?.revision === "KB-005@1", `${cls(r)} ${JSON.stringify(srcs(r))}`);
}
for (const [id, re] of [["KB-T16", /price/i], ["KB-T17", /hotspot/i], ["KB-T15", /unlimited/i]]) {
  const r = await ask(byId[id]);
  invariants(`${id} with other content approved`, r);
  check(`${id}: still NO_SOURCE (no approved pricing article exists)`, cls(r) === "NO_SOURCE" && srcs(r).length === 0, `${cls(r)} ${JSON.stringify(srcs(r))}`);
  void re;
}
{
  const r = await ask("What is your current data retention?");
  check("KB-T37: retention answer withheld (privacy source not approved)", cls(r) === "NO_SOURCE");
}
{
  const r = await ask("What is the capital of France?");
  check("FR-020: unrelated question never matches approved KB", cls(r) === "NO_SOURCE" && srcs(r).length === 0);
}
{
  // The approved set must not change protected / safety / secret behaviour.
  const prot = await ask("how much data do I have left?");
  const sec = await ask("my otp is 483920");
  const emg = await ask("I was in an accident");
  check("approved KB does not weaken the protected-intent gate", cls(prot) === "AUTH_GATE" && srcs(prot).length === 0);
  check("approved KB does not weaken secret detection", cls(sec) === "SECRET_WARNING" && !sec.text.includes("483920"));
  check("approved KB does not weaken emergency handling", cls(emg) === "GUIDANCE" && /safety comes first/i.test(txt(emg)));
}
// Full scenario pass again, with content approved: invariants only (no stale/unsafe leakage).
for (const s of scenarios) invariants(`phase B ${s.id}`, await ask(s.input));

// ======================================================================= revocation (ARC-11, KB-T30)
console.log("\n== Revocation, expiry, conflict, tamper ==");
{
  const before = await ask("What is DriverX Mobile?");
  check("pre-revoke: KB-001 is served", srcs(before).length === 1);
  const rv = await cli(["revoke", "KB-001@1", "--actor", "security-test", "--reason", "WITHDRAWN_BY_OWNER"]);
  check("CLI revoke succeeds", rv.code === 0, rv.out);
  const after = await ask("What is DriverX Mobile?");
  check("KB-T30: revoked article never cited or served again (next request)", !srcs(after).some((x) => x.revision === "KB-001@1") && txt(after) !== answer["KB-001"], `${cls(after)} ${JSON.stringify(srcs(after))}`);
  check("revoke recorded in the audit log with actor and code", (await db.query("select count(*)::int n from drixo.publication_audit a join drixo.kb_revision r using (revision_id) where r.revision_code='KB-001@1' and a.action='REVOKE' and a.actor_ref='security-test' and a.reason_code='WITHDRAWN_BY_OWNER'")).rows[0].n === 1);
  check("CLI rejects free-text revoke reasons", (await cli(["revoke", "KB-004@1", "--actor", "x", "--reason", "because I said so"])).code !== 0);
}
// DB-11 / ARC-11: revoked while the answer is in flight (server holds 1.5s between retrieve and commit).
{
  const inflight = ask("How do I choose a driver profile?"); // KB-002 is submitted but NOT yet approved: approve first
  await inflight; // (warm-up; expected NO_SOURCE because KB-002 is still IN_REVIEW)
  const ap = await cli(["approve", "KB-002@1", "--actor", "approver-test", "--from", effFrom]);
  check("KB-002 approved for the race test", ap.code === 0, ap.out);
  const quick = await ask("How do I choose a driver profile?");
  check("race setup: KB-002 is served when approved", srcs(quick)[0]?.revision === "KB-002@1", `${cls(quick)} ${JSON.stringify(srcs(quick))}`);
  const racing = ask("How do I choose a driver profile?");
  await sleep(600); // retrieval has finished; the server is now waiting out the injected delay
  const rv = await cli(["revoke", "KB-002@1", "--actor", "security-test", "--reason", "WITHDRAWN_BY_OWNER"]);
  const r = await racing;
  check("DB-11: revoked mid-flight => candidate discarded, NO_SOURCE, no stale citation", rv.code === 0 && cls(r) === "NO_SOURCE" && srcs(r).length === 0, `rv=${rv.code} ${cls(r)} ${JSON.stringify(srcs(r))}`);
}
// Expiry mid-session (KB-T31): effective window ends while the system is running.
{
  const ap = await cli(["approve", "KB-038@1", "--actor", "approver-test", "--from", effFrom, "--until", new Date(Date.now() + 5000).toISOString()]);
  check("KB-038 approved with a 5s window", ap.code === 0, ap.out);
  const inWindow = await ask("Can I use this with a screen reader?");
  check("KB-T31: inside the window the article is cited", srcs(inWindow)[0]?.revision === "KB-038@1", `${cls(inWindow)} ${JSON.stringify(srcs(inWindow))}`);
  await sleep(5500);
  const expired = await ask("Can I use this with a screen reader?");
  check("KB-T31: after expiry => NO_SOURCE with no code change", cls(expired) === "NO_SOURCE" && srcs(expired).length === 0, `${cls(expired)} ${JSON.stringify(srcs(expired))}`);
}
// Conflict (KB-T32 / ARC-12).
{
  const ap = await cli(["approve", "KB-003@1", "--actor", "approver-test", "--from", effFrom]);
  check("KB-003 approved", ap.code === 0, ap.out);
  const q = "What is the public support contact?";
  check("pre-conflict: cited", srcs(await ask(q))[0]?.revision === "KB-003@1");
  await cli(["conflict-open", "KB-003@1", "--actor", "content-test", "--reason", "SOURCES_DISAGREE"]);
  const c = await ask(q);
  check("KB-T32: conflicted revision is suppressed (never served or merged)", !srcs(c).some((x) => x.revision === "KB-003@1") && txt(c) !== answer["KB-003"], `${cls(c)} ${JSON.stringify(srcs(c))}`);
  await cli(["conflict-resolve", "KB-003@1", "--actor", "content-test", "--reason", "OWNER_DECIDED"]);
  check("conflict resolved => served again", srcs(await ask(q))[0]?.revision === "KB-003@1");
}
// Source on HOLD hides everything it owns.
{
  await db.query("update drixo.kb_source set status='HOLD' where source_key='S01'");
  const r = await ask("Is there a nationwide outage?");
  check("source HOLD => all of its content suppressed", cls(r) === "NO_SOURCE" && srcs(r).length === 0);
  await db.query("update drixo.kb_source set status='ACTIVE' where source_key='S01'");
  check("source restored => content served again", srcs(await ask("Is there a nationwide outage?")).length === 1);
}
// Defense in depth: app refuses to cite an off-allowlist host even if the DB view lets it through.
{
  await db.exec(`
    insert into drixo.kb_source (source_key, canonical_url, title, category, owner_team, status) values ('S99','https://evil.example/zorblax','Evil','Public site','t','ACTIVE');
    with r as (insert into drixo.kb_revision (source_id, revision_code, content_sha256) select source_id,'KB-999@1', repeat('a',64) from drixo.kb_source where source_key='S99' returning revision_id)
      insert into drixo.kb_chunk (revision_id, ordinal, public_text, search_aliases) select revision_id,0,'Zorblax gadgets are approved here.','zorblax gadgets' from r;
    update drixo.kb_revision set status='IN_REVIEW' where revision_code='KB-999@1';
    update drixo.kb_revision set status='APPROVED', approved_by='x', approved_at=now(), effective_from=now() - interval '1 hour' where revision_code='KB-999@1';`);
  check("setup: tampered off-domain revision IS visible to the DB view (bypassing the publisher)", (await db.query("select count(*)::int n from drixo.approved_public_chunks where revision_code='KB-999@1'")).rows[0].n === 1);
  const r = await ask("tell me about zorblax gadgets");
  check("ARC-09 / DB-13: app refuses to cite a non-allowlisted host", cls(r) === "NO_SOURCE" && srcs(r).length === 0, `${cls(r)} ${JSON.stringify(srcs(r))}`);
}
// ======================================================================= KB outage (fail safe)
console.log("\n== Knowledge base unavailable ==");
await server.stop();
{
  const t0 = Date.now();
  const r = await ask("What is DriverX Mobile?");
  check("DB down: KB question degrades to NO_SOURCE (200), no 5xx, no stale answer", r.status === 200 && cls(r) === "NO_SOURCE" && srcs(r).length === 0, `${r.status} ${cls(r)}`);
  check("DB down: answered within the bounded deadline", Date.now() - t0 < 8000, `${Date.now() - t0}ms`);
  const flow = await ask("My mobile data stopped working");
  check("DB down: deterministic flows still work", r.status === 200 && cls(flow) === "QUESTION");
  const prot = await ask("what is my bill");
  check("DB down: protected-intent gate still works", cls(prot) === "AUTH_GATE");
}

console.log(`\n${pass} passed, ${fail} failed`);
await db.close().catch(() => undefined);
process.exitCode = fail ? 1 : 0;
setTimeout(() => process.exit(process.exitCode), 200);
