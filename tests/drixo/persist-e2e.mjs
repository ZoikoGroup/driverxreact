// Tests for guest-metadata persistence, daily aggregation and retention (Doc 05, DEFECT-8).
// Self-contained production-mode stack (Redis + Postgres over the wire + one `next start` instance).
//
//   node tests/drixo/persist-e2e.mjs
//
// Proves: a full conversation leaves classification-only rows in the Doc 05 tables; nothing a visitor typed,
// no cookie, no CSRF token reaches the database; the capability is stored only as an HMAC; a Postgres outage
// never fails or fakes a turn (Redis stays authoritative) and is reported via telemetry; the daily
// aggregation hides small cohorts; the retention worker purges ended sessions by the approved policy and the
// purge cascades while aggregates are kept.
// Limit: the BFF here connects through PGlite's multiplexer as a superuser; least-privilege grants are proven
// separately (db.test.mjs, SET ROLE).

import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { startStack, root } from "./stack.mjs";

let pass = 0;
let fail = 0;
const check = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : `  ${extra}`}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const stack = await startStack({ appPorts: [3119], redisPort: 6394, dbPort: 54333, env: { DRIXO_PERSIST_TIMEOUT_MS: "1500" } });
const app = stack.apps[0];
const API = `${app.base}/api/v1/drixo/public`;
const db = stack.db.db;
const q = async (sql, params) => (await db.query(sql, params)).rows;

function cli(script, args) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [join(root, "scripts", script), ...args], {
      env: {
        ...process.env,
        DRIXO_PUBLISHER_DATABASE_URL: stack.db.url,
        DRIXO_OPS_DATABASE_URL: stack.db.url,
        DRIXO_METRICS_DATABASE_URL: stack.db.url,
        DRIXO_RETENTION_DATABASE_URL: stack.db.url,
      },
    });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("close", (code) => resolve({ code, out }));
  });
}

async function call(method, path, { body, cookie, csrf } = {}) {
  const h = { Origin: app.base, "Content-Type": "application/json", "Idempotency-Key": randomUUID() };
  if (cookie) h.Cookie = cookie;
  if (csrf) h["X-Drixo-CSRF"] = csrf;
  const res = await fetch(`${API}${path}`, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : undefined; } catch { /* ignore */ }
  return { status: res.status, json, setCookie: res.headers.getSetCookie?.() ?? [] };
}
async function session() {
  const r = await call("POST", "/sessions", { body: { locale: "en-US", clientInstanceId: randomUUID() } });
  return { id: r.json.sessionId, csrf: r.json.csrfToken, cookie: r.setCookie[0].split(";")[0], v: 0, cookieValue: r.setCookie[0].split(";")[0].split("=")[1] };
}
async function turn(s, input) {
  const r = await call("POST", `/sessions/${s.id}/turns`, { cookie: s.cookie, csrf: s.csrf, body: { clientRequestId: randomUUID(), contextVersion: s.v, input } });
  if (r.status === 200) s.v = r.json.contextVersion;
  return r;
}
const text = (s, t) => turn(s, { type: "TEXT", text: t });
const events = () => app.logs.filter((l) => l.startsWith("{") && l.includes('"drixo":true')).map((l) => JSON.parse(l));

try {
  // knowledge so one turn carries a citation
  await cli("drixo-kb.mjs", ["seed-drafts", "--actor", "importer"]);
  await cli("drixo-kb.mjs", ["activate-source", "S01", "--actor", "editor"]);
  const from = new Date(Date.now() - 3600_000).toISOString();
  await cli("drixo-kb.mjs", ["submit", "KB-001@1", "--actor", "editor"]);
  await cli("drixo-kb.mjs", ["approve", "KB-001@1", "--actor", "approver", "--from", from]);

  // ================================================================== a full conversation
  console.log("\n== One conversation leaves classification-only rows ==");
  const CANARY_Q = "What is DriverX Mobile?";
  const CANARY_SECRET = "my otp is 997755";
  const CANARY_BILL = "what is my bill please";
  const s = await session();
  const t1 = await turn(s, { type: "SHORTCUT", intentCode: "FIX_CONNECTION" });
  const q1 = t1.json.result.quickReplies[0];
  await turn(s, { type: "QUICK_REPLY", stepId: q1.stepId, optionId: q1.optionId });
  const kb = await text(s, CANARY_Q);
  await text(s, CANARY_BILL);
  await text(s, CANARY_SECRET);
  const fb = await call("POST", `/sessions/${s.id}/feedback`, { cookie: s.cookie, csrf: s.csrf, body: { turnId: kb.json.turnId, helpful: false, reason: "OUTDATED" } });
  check("feedback accepted", fb.status === 202, String(fb.status));
  const end = await call("POST", `/sessions/${s.id}/end`, { cookie: s.cookie, csrf: s.csrf, body: { reason: "USER_ENDED" } });
  check("conversation ended", end.status === 204);
  await sleep(500);

  const [gs] = await q("select session_id, state, mode, context_version, current_ui_state, ended_at, encode(capability_hmac, 'hex') as hmac_hex, length(capability_hmac) as hmac_len from drixo.guest_session where session_id = $1", [s.id]);
  check("guest_session row exists, ENDED, mode GUEST, ended_at set", gs?.state === "ENDED" && gs.mode === "GUEST" && gs.ended_at, JSON.stringify(gs));
  check("context_version matches the 5 turns", gs?.context_version === 5, String(gs?.context_version));
  check("capability stored as a 32-byte HMAC, never the cookie value", gs?.hmac_len === 32 && gs.hmac_hex !== s.cookieValue && !gs.hmac_hex.includes(s.cookieValue));

  const turns = await q("select input_type, intent_code, response_class, ui_state, outcome, correlation_id, context_version, created_at from drixo.turn_metadata where session_id = $1 order by context_version", [s.id]);
  check("5 turn rows with contiguous context versions", turns.length === 5 && turns.every((t, i) => t.context_version === i + 1), JSON.stringify(turns.map((t) => t.context_version)));
  check("classes recorded per turn (QUESTION, then flow step, GUIDANCE, AUTH_GATE, SECRET_WARNING)", turns.map((t) => t.response_class).join() === "QUESTION,QUESTION,GUIDANCE,AUTH_GATE,SECRET_WARNING", turns.map((t) => t.response_class).join());
  check("input types recorded", turns.map((t) => t.input_type).join() === "SHORTCUT,QUICK_REPLY,TEXT,TEXT,TEXT");
  check("intent_code is stored only for the shortcut (never derived from text)", turns[0].intent_code === "FIX_CONNECTION" && turns.slice(1).every((t) => t.intent_code === null));
  check("correlation ids and timestamps present", turns.every((t) => /^req-/.test(t.correlation_id) && t.created_at));

  const src = await q("select r.revision_code, ts.citation_order from drixo.turn_source ts join drixo.kb_revision r using (revision_id) join drixo.turn_metadata t using (turn_id) where t.session_id = $1", [s.id]);
  check("the cited approved revision is recorded (KB-001@1, order 1)", src.length === 1 && src[0].revision_code === "KB-001@1" && src[0].citation_order === 1, JSON.stringify(src));
  const f = await q("select helpful, reason from drixo.turn_feedback f join drixo.turn_metadata t using (turn_id) where t.session_id = $1", [s.id]);
  check("feedback stored with the closed-enum reason, no free text", f.length === 1 && f[0].helpful === false && f[0].reason === "OUTDATED");
  const ev = (await q("select event_code from drixo.session_event where session_id = $1", [s.id])).map((e) => e.event_code).sort().join();
  check("lifecycle and block events recorded", ev === "PROTECTED_BLOCKED,SECRET_BLOCKED,SESSION_ENDED,SESSION_STARTED", ev);

  // ---- privacy: dump everything stored about this guest and search it
  const dump = JSON.stringify(
    await Promise.all(
      ["guest_session", "turn_metadata", "turn_source", "turn_feedback", "session_event"].map((t) => q(`select * from drixo.${t}`)),
    ),
  );
  const forbidden = [CANARY_SECRET, "997755", CANARY_BILL, "my bill", CANARY_Q, "DriverX Mobile", s.cookieValue, s.csrf];
  const leaked = forbidden.filter((x) => dump.includes(x));
  check("nothing the visitor typed, no cookie and no CSRF token appears in any guest table", leaked.length === 0, leaked.join(" | "));

  // ================================================================== Postgres outage never fails or fakes a turn
  console.log("\n== Postgres outage ==");
  {
    await stack.db.stop();
    const s2 = await session(); // session creation must also succeed
    const r = await turn(s2, { type: "SHORTCUT", intentCode: "PLANS_HOTSPOT" });
    check("DB down: session creation and the turn still succeed (Redis is authoritative)", s2.id && r.status === 200 && r.json.result.responseClass === "QUESTION", `${r.status}`);
    const failures = events().filter((e) => e.event === "request_error" && e.errorCode === "METADATA_WRITE");
    check("DB down: the write failure is reported through telemetry (METADATA_WRITE), not hidden", failures.length >= 1, String(failures.length));
    await stack.db.start();
    await sleep(500);
    const r2 = await turn(s2, { type: "TEXT", text: "tell me about plans" });
    check("DB back: the conversation continues normally", r2.status === 200);
  }

  // ================================================================== daily aggregation and the small-cohort floor
  console.log("\n== Daily metrics ==");
  {
    for (let i = 0; i < 6; i++) await turn(await session(), { type: "SHORTCUT", intentCode: "FIX_CONNECTION" });
    await sleep(300);
    const today = new Date().toISOString().slice(0, 10);
    const o = await cli("drixo-ops.mjs", ["metrics", "--day", today]);
    check("ops metrics aggregates the day", o.code === 0 && /aggregated/.test(o.out), o.out);
    const cells = await q("select intent_code, response_class, sample_count::int n from drixo.daily_metric where metric_day = $1::date", [today]);
    const fix = cells.find((c) => c.intent_code === "FIX_CONNECTION" && c.response_class === "QUESTION");
    check("aggregate counts the FIX_CONNECTION questions (6 new + 1 earlier + the flow step)", fix && fix.n >= 7, JSON.stringify(cells));
    const reportable = await q("select intent_code, response_class, sample_count::int n from drixo.daily_metric_reportable where metric_day = $1::date", [today]);
    check("dashboard view hides every cell under 5 turns", reportable.every((c) => c.n >= 5) && reportable.length < cells.length, JSON.stringify({ cells: cells.length, reportable: reportable.length }));
    const again = await cli("drixo-ops.mjs", ["metrics", "--day", today]);
    const total = (await q("select sum(sample_count)::int n from drixo.daily_metric where metric_day = $1::date", [today]))[0].n;
    const turnsToday = (await q("select count(*)::int n from drixo.turn_metadata where created_at >= $1::date", [today]))[0].n;
    check("re-running the aggregation is idempotent (total equals the number of turns)", again.code === 0 && total === turnsToday, `${total} vs ${turnsToday}`);
    const bad = await cli("drixo-ops.mjs", ["metrics", "--day", "yesterday"]);
    check("ops metrics rejects a malformed day", bad.code !== 0, bad.out);
  }

  // ================================================================== retention
  console.log("\n== Retention worker ==");
  {
    const refuse = await cli("drixo-ops.mjs", ["purge", "--actor", "retention-job"]);
    check("purge refuses to run while the retention policy is not approved (D-04)", refuse.code !== 0 && /not approved/.test(refuse.out), refuse.out);
    check("nothing was deleted by the refused run", (await q("select count(*)::int n from drixo.guest_session where session_id = $1", [s.id]))[0].n === 1);

    await db.query("insert into drixo.retention_policy (retention_class, store_name, duration_seconds, status, approved_by, approved_at) values ('guest_session','postgres',2,'APPROVED','privacy-test',now()) on conflict (retention_class) do update set duration_seconds=2, status='APPROVED', approved_by='privacy-test', approved_at=now()");
    await sleep(2500);
    const run = await cli("drixo-ops.mjs", ["purge", "--actor", "retention-job"]);
    check("purge runs once a policy is approved", run.code === 0 && /purged \d+/.test(run.out), run.out);
    check("the ended session is gone", (await q("select count(*)::int n from drixo.guest_session where session_id = $1", [s.id]))[0].n === 0);
    const orphans = (await q("select (select count(*) from drixo.turn_metadata where session_id = $1)::int a, (select count(*) from drixo.session_event where session_id = $1)::int b", [s.id]))[0];
    check("the purge cascaded: no turns, citations, feedback or events remain for that session", orphans.a === 0 && orphans.b === 0 && (await q("select count(*)::int n from drixo.turn_feedback f where not exists (select 1 from drixo.turn_metadata t where t.turn_id = f.turn_id)"))[0].n === 0);
    check("aggregates are kept (they hold no session or guest identifier)", (await q("select count(*)::int n from drixo.daily_metric"))[0].n > 0);
    check("recently active sessions (not yet past the retention duration) are kept", (await q("select count(*)::int n from drixo.guest_session"))[0].n > 0);
  }
} finally {
  await stack.stop();
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
setTimeout(() => process.exit(process.exitCode), 300);
