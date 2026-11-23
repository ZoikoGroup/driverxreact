// Drixo Phase 6 operations tests, run against a real production-mode stack:
// Redis + Postgres(PGlite over the wire) + TWO `next start` BFF instances (see stack.mjs).
//
//   npx next build --webpack            (set NEXT_PUBLIC_STRIPE_SECRET_KEY to any value for the build)
//   node tests/drixo/ops-e2e.mjs
//
// Maps to Doc 08: ARC-05 (cross-instance), ARC-14 (no raw text in logs), ARC-17 (Redis loss),
// ARC-18 (degrade safely), ARC-20, ARC-25, ARC-26 (canary + rollback), section 13 (failure handling),
// section 15 (telemetry), section 16 (incident rows).
// NOT proven here: real load / capacity / SLOs, platform alert delivery, multi-AZ failover, Redis TLS.

import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { startStack, root, waitFor } from "./stack.mjs";

let pass = 0;
let fail = 0;
const check = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : `  ${extra}`}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

console.log("starting stack (redis + db + 2 production instances)...");
const stack = await startStack();
const [A, B] = stack.apps;
const dbUrl = stack.db.url;

// ------------------------------------------------------------------ helpers
function runCli(script, args, extraEnv = {}) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [join(root, "scripts", script), ...args], {
      env: {
        ...process.env,
        DRIXO_PUBLISHER_DATABASE_URL: dbUrl,
        DRIXO_MIGRATE_DATABASE_URL: dbUrl,
        DRIXO_OPS_DATABASE_URL: dbUrl,
        DRIXO_RETENTION_DATABASE_URL: dbUrl,
        ...extraEnv,
      },
    });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("close", (code) => resolve({ code, out }));
  });
}
const pub = (...a) => runCli("drixo-kb.mjs", a);
const ops = (...a) => runCli("drixo-ops.mjs", a);

const secretsSeen = new Set(); // cookies, csrf tokens, session ids: must never appear in any log line

async function call(app, method, path, { body, cookie, csrf, origin, idem = randomUUID() } = {}) {
  const h = { Origin: origin ?? app.base };
  if (body !== undefined) h["Content-Type"] = "application/json";
  if (cookie) h.Cookie = cookie;
  if (csrf) h["X-Drixo-CSRF"] = csrf;
  if (method === "POST" && idem) h["Idempotency-Key"] = idem;
  const t0 = Date.now();
  const res = await fetch(`${app.base}/api/v1/drixo/public${path}`, {
    method,
    headers: h,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : undefined; } catch { /* ignore */ }
  return { status: res.status, json, text, ms: Date.now() - t0, headers: res.headers, setCookie: res.headers.getSetCookie?.() ?? [] };
}

async function newSession(app) {
  const r = await call(app, "POST", "/sessions", { body: { locale: "en-US", clientInstanceId: randomUUID() } });
  if (r.status !== 201) return { r };
  const cookie = r.setCookie[0].split(";")[0];
  const s = { r, id: r.json.sessionId, csrf: r.json.csrfToken, cookie, v: 0 };
  secretsSeen.add(cookie.split("=")[1]);
  secretsSeen.add(s.csrf);
  secretsSeen.add(s.id);
  return s;
}
const turnOn = (app, s, input, extra = {}) =>
  call(app, "POST", `/sessions/${s.id}/turns`, {
    cookie: s.cookie,
    csrf: s.csrf,
    body: { clientRequestId: randomUUID(), contextVersion: s.v, input },
    ...extra,
  });
async function ask(app, text) {
  const s = await newSession(app);
  return turnOn(app, s, { type: "TEXT", text });
}
const R = (r) => r.json?.result ?? {};
const cfgPercent = async (app) => (await call(app, "GET", "/config")).json?.rolloutPercent;

try {
  // ================================================================== production hardening
  console.log("\n== Production-mode hardening ==");
  {
    const c = await call(A, "GET", "/config");
    check("config 200 in production mode", c.status === 200, String(c.status));
    check("fresh environment ships DARK: rolloutPercent 0", c.json?.rolloutPercent === 0, String(c.json?.rolloutPercent));
    const s = await newSession(A);
    check("session created in production mode", s.r?.status === 201, String(s.r?.status));
    const sc = s.r.setCookie[0] ?? "";
    check("production cookie is Secure + HttpOnly + SameSite=Lax", /Secure/i.test(sc) && /HttpOnly/i.test(sc) && /SameSite=Lax/i.test(sc), sc);
    const evil = await call(A, "POST", "/sessions", { body: { locale: "en-US", clientInstanceId: randomUUID() }, origin: "https://evil.example" });
    check("ARC-25: non-allowlisted Origin blocked in production", evil.status === 403, String(evil.status));
    const t0 = await ask(A, "What is DriverX Mobile?");
    check("production: unauthenticated BFF never exposes provider/DB credentials in responses", !/postgres:\/\/|redis:\/\/|DRIXO_/i.test(t0.text + c.text));
  }

  // ================================================================== multi-instance (shared Redis)
  console.log("\n== Two instances, one Redis ==");
  {
    const s = await newSession(A);
    const t1 = await turnOn(B, s, { type: "SHORTCUT", intentCode: "FIX_CONNECTION" });
    check("session created on A is accepted by B (shared state)", t1.status === 200 && t1.json?.contextVersion === 1, `${t1.status} ${t1.text.slice(0, 80)}`);
    s.v = 1;
    const K = randomUUID();
    const body = { clientRequestId: randomUUID(), contextVersion: 1, input: { type: "TEXT", text: "cross instance replay" } };
    const ra = await call(A, "POST", `/sessions/${s.id}/turns`, { cookie: s.cookie, csrf: s.csrf, body, idem: K });
    const rb = await call(B, "POST", `/sessions/${s.id}/turns`, { cookie: s.cookie, csrf: s.csrf, body, idem: K });
    check("ARC-07: same Idempotency-Key replays the same turn across instances", ra.status === 200 && rb.status === 200 && ra.json.turnId === rb.json.turnId && rb.json.contextVersion === 2, `${ra.status}/${rb.status}`);
    s.v = 2;
    const race = await Promise.all(
      Array.from({ length: 8 }, (_, i) => turnOn(i % 2 ? B : A, s, { type: "TEXT", text: `race ${i}` })),
    );
    const wins = race.filter((x) => x.status === 200).length;
    const stales = race.filter((x) => x.status === 409).length;
    check("ARC-05: 8 concurrent turns split across 2 instances => exactly one wins", wins === 1 && stales === 7, `wins=${wins} stales=${stales}`);
    s.v = 3;
    const e = await call(B, "POST", `/sessions/${s.id}/end`, { cookie: s.cookie, csrf: s.csrf, body: { reason: "USER_ENDED" } });
    const after = await turnOn(A, s, { type: "TEXT", text: "x" });
    check("ARC-16: ending on B revokes the session on A", e.status === 204 && after.status === 404, `${e.status}/${after.status}`);
  }

  // ================================================================== knowledge fixtures + prod fault-hook
  console.log("\n== Knowledge base under production settings ==");
  {
    let o = await pub("seed-drafts", "--actor", "importer");
    check("CLI seed against the stack DB", /imported 38 DRAFT/.test(o.out), o.out);
    await pub("activate-source", "S01", "--actor", "editor");
    const from = new Date(Date.now() - 3600_000).toISOString();
    for (const code of ["KB-001@1", "KB-031@1"]) {
      await pub("submit", code, "--actor", "editor");
      o = await pub("approve", code, "--actor", "approver", "--from", from);
      if (o.code !== 0) check(`approve ${code}`, false, o.out);
    }
    const q = () => ask(B, "What is DriverX Mobile?");
    await q(); // warm connections
    const r = await q();
    check("approved KB answer is cited from instance B", R(r).responseClass === "GUIDANCE" && R(r).sources?.[0]?.revision === "KB-001@1", `${R(r).responseClass} ${JSON.stringify(R(r).sources)}`);
    check("production ignores the test-only fault delay (1500ms configured, answer is fast)", r.ms < 1200, `${r.ms}ms`);
  }

  // ================================================================== runtime flags: canary, kb switch, kill switch
  console.log("\n== Flags: canary, KB switch, kill switch, rollback ==");
  {
    const f0 = await ops("flags");
    check("ops CLI lists the three flags", /ASSISTANT/.test(f0.out) && /KB_RETRIEVAL/.test(f0.out) && /MODEL_SYNTHESIS/.test(f0.out), f0.out);

    let o = await ops("rollout", "50", "--actor", "ops-alice", "--reason", "CANARY_START");
    check("ops rollout 50", o.code === 0, o.out);
    await waitFor(async () => (await cfgPercent(A)) === 50 && (await cfgPercent(B)) === 50, { timeout: 8000, label: "rollout 50 on both instances" });
    check("canary percentage reaches BOTH instances within the flag TTL, no deploy", true);

    o = await ops("rollout", "101", "--actor", "ops-alice", "--reason", "CANARY_BAD");
    check("ops rollout rejects >100", o.code !== 0, o.out);
    o = await ops("rollout", "10", "--actor", "ops-alice", "--reason", "free text not allowed");
    check("ops rejects free-text reason codes", o.code !== 0, o.out);

    // KB switch (incident: unapproved claim) -> NO_SOURCE instantly, flows and safety unaffected
    o = await ops("kb-off", "--actor", "ops-bob", "--reason", "UNAPPROVED_PRICE_CLAIM");
    check("ops kb-off", o.code === 0, o.out);
    await waitFor(async () => R(await ask(B, "What is DriverX Mobile?")).responseClass === "NO_SOURCE", { timeout: 8000, label: "kb-off" });
    const flowDuringKbOff = await ask(A, "My mobile data stopped working");
    const protDuringKbOff = await ask(A, "what is my bill");
    check("KB off: factual questions answer NO_SOURCE with no citation", R(await ask(A, "What is DriverX Mobile?")).sources?.length === 0);
    check("KB off: deterministic flows and the protected-intent gate are unaffected", R(flowDuringKbOff).responseClass === "QUESTION" && R(protDuringKbOff).responseClass === "AUTH_GATE");
    await ops("kb-on", "--actor", "ops-bob", "--reason", "CONTENT_FIXED");
    await waitFor(async () => R(await ask(B, "What is DriverX Mobile?")).sources?.length === 1, { timeout: 8000, label: "kb-on" });
    check("KB on again: cited answers return", true);

    // Kill switch (incident: private data exposure / runaway cost)
    const live = await newSession(A);
    check("pre-kill: an in-flight session is working", (await turnOn(A, live, { type: "SHORTCUT", intentCode: "PLANS_HOTSPOT" })).status === 200);
    live.v = 1;
    o = await ops("kill", "--actor", "ops-carol", "--reason", "INCIDENT_PRIVATE_DATA");
    check("ops kill", o.code === 0, o.out);
    await waitFor(async () => (await call(A, "GET", "/config")).status === 503 && (await call(B, "GET", "/config")).status === 503, { timeout: 8000, label: "kill on both" });
    const k1 = await call(A, "GET", "/config");
    const k2 = await turnOn(B, live, { type: "TEXT", text: "hello" });
    const k3 = await call(A, "POST", "/sessions", { body: { locale: "en-US", clientInstanceId: randomUUID() } });
    check("ARC-26: kill switch => config 503 on every instance (widget hides itself)", k1.status === 503 && /problem\+json/.test(k1.headers.get("content-type")));
    check("ARC-26: kill switch => in-flight session turns and new sessions also 503", k2.status === 503 && k3.status === 503, `${k2.status}/${k3.status}`);
    check("kill switch response is generic and not retryable-spammy (Retry-After set)", k1.json?.retryable === false && k1.headers.get("retry-after") === "60", JSON.stringify(k1.json));

    // Kill state survives a database outage (last-known value is kept).
    await stack.db.stop();
    await sleep(1200); // > flag TTL so each instance tries (and fails) to re-read the table
    const killedDuringDbOutage = await call(A, "GET", "/config");
    check("kill switch stays ON while the flag DB is unreachable (last known value kept)", killedDuringDbOutage.status === 503, String(killedDuringDbOutage.status));
    await stack.db.start();
    await waitFor(async () => (await ops("flags")).code === 0, { timeout: 15000, label: "db back" });

    // Rollback / restore
    o = await ops("restore", "--actor", "ops-carol", "--reason", "INCIDENT_RESOLVED", "--percent", "5");
    check("ops restore at 5%", o.code === 0, o.out);
    await waitFor(async () => (await call(A, "GET", "/config")).status === 200 && (await cfgPercent(B)) === 5, { timeout: 15000, label: "restore" });
    const back = await newSession(A);
    check("ARC-26: rollback complete: new sessions work again, canary back at 5%", back.r?.status === 201);

    const audit = (await stack.db.db.query("select actor_ref, reason_code, flag, enabled, rollout_percent from drixo.flag_audit order by created_at")).rows;
    const who = audit.map((a) => `${a.actor_ref}:${a.reason_code}`);
    check("every flag change is audited with actor and controlled reason", ["ops-alice:CANARY_START", "ops-bob:UNAPPROVED_PRICE_CLAIM", "ops-carol:INCIDENT_PRIVATE_DATA", "ops-carol:INCIDENT_RESOLVED"].every((x) => who.includes(x)), who.join(","));
    await ops("rollout", "100", "--actor", "ops-alice", "--reason", "CANARY_PROMOTE");
    await waitFor(async () => (await cfgPercent(A)) === 100, { timeout: 8000, label: "promote" });
  }

  // ================================================================== knowledge circuit breaker
  console.log("\n== Circuit breaker (database failure) ==");
  {
    await stack.db.stop();
    const t = [];
    for (let i = 0; i < 4; i++) {
      const r = await ask(A, "What is DriverX Mobile?");
      t.push({ cls: R(r).responseClass, ms: r.ms, status: r.status });
    }
    check("DB down: KB questions degrade to NO_SOURCE (200), never a 5xx", t.every((x) => x.status === 200 && x.cls === "NO_SOURCE"), JSON.stringify(t));
    const events = A.logs.filter((l) => l.startsWith("{") && l.includes('"drixo":true')).map((l) => JSON.parse(l));
    check("breaker opens after repeated failures (kb_circuit_open emitted)", events.some((e) => e.event === "kb_circuit_open"));
    check("further lookups skip the database (kb_lookup BREAKER_OPEN emitted)", events.some((e) => e.event === "kb_lookup" && e.kbResult === "BREAKER_OPEN"));
    const flow = await ask(A, "My mobile data stopped working");
    check("DB down: deterministic flows and safety gates still work", R(flow).responseClass === "QUESTION");

    await stack.db.start();
    await sleep(4500); // > breaker cooldown
    let recovered = false;
    for (let i = 0; i < 8 && !recovered; i++) {
      recovered = R(await ask(A, "What is DriverX Mobile?")).sources?.length === 1;
      if (!recovered) await sleep(700);
    }
    check("DB back: breaker closes and cited answers resume", recovered);
    const ev2 = A.logs.filter((l) => l.startsWith("{") && l.includes('"drixo":true')).map((l) => JSON.parse(l));
    check("kb_circuit_closed emitted on recovery", ev2.some((e) => e.event === "kb_circuit_closed"));
  }

  // ================================================================== Redis loss fails closed (ARC-17)
  console.log("\n== Redis loss (ARC-17) ==");
  {
    const live = await newSession(A);
    check("pre-outage: session works", (await turnOn(B, live, { type: "SHORTCUT", intentCode: "FIX_CONNECTION" })).status === 200);
    live.v = 1;
    await stack.redis.stop();
    await sleep(500);
    const r1 = await turnOn(A, live, { type: "TEXT", text: "hello" });
    const r2 = await call(B, "GET", "/config");
    const r3 = await newSession(A);
    const r4 = await turnOn(A, { ...live, csrf: "forged" }, { type: "TEXT", text: "hello" });
    const r5 = await turnOn(A, { ...live, cookie: "dxm_drixo_guest=forged" }, { type: "TEXT", text: "hello" });
    check("Redis down: valid session turn => 503 (not served from memory)", r1.status === 503 && /problem\+json/.test(r1.headers.get("content-type")), `${r1.status}`);
    check("Redis down: config and session creation => 503", r2.status === 503 && r3.r?.status === 503, `${r2.status}/${r3.r?.status}`);
    check("Redis down: forged CSRF / cookie never succeeds (no bypass)", r4.status !== 200 && r5.status !== 200, `${r4.status}/${r5.status}`);
    check("Redis down: responses are bounded (no hanging)", [r1, r2, r4, r5].every((x) => x.ms < 5000), [r1, r2, r4, r5].map((x) => x.ms).join(","));
    check("Redis down: error body is generic (no internals)", !/redis|ECONN|stack|at \w+/i.test(r1.text), r1.text.slice(0, 120));
    await stack.redis.start();
    let up = false;
    for (let i = 0; i < 15 && !up; i++) {
      up = (await newSession(A)).r?.status === 201;
      if (!up) await sleep(500);
    }
    check("Redis back: new sessions work again after automatic reconnect", up);
    const old = await turnOn(A, live, { type: "TEXT", text: "old" });
    check("Redis restarted without persistence: old session is honestly gone (404), not resurrected", old.status === 404, String(old.status));
  }

  // ================================================================== telemetry redaction audit (ARC-14)
  console.log("\n== Telemetry redaction ==");
  {
    // Fresh canaries after everything is healthy.
    const s = await newSession(A);
    const canaries = ["997755", "CANARY-TEXT-XYZ-123", "5551234567", "jane.doe@example.com"];
    await turnOn(A, s, { type: "TEXT", text: "my otp is 997755" });
    s.v = 1;
    await turnOn(A, s, { type: "TEXT", text: "please call 5551234567 or jane.doe@example.com about CANARY-TEXT-XYZ-123" });
    s.v = 2;
    await turnOn(A, s, { type: "TEXT", text: "what is my bill" });
    s.v = 3;
    await call(A, "POST", `/sessions/${s.id}/feedback`, { cookie: s.cookie, csrf: s.csrf, body: { turnId: (await turnOn(A, s, { type: "SHORTCUT", intentCode: "FLEET_IOT" })).json.turnId, helpful: true } });
    await call(A, "POST", `/sessions/${s.id}/end`, { cookie: s.cookie, csrf: s.csrf, body: { reason: "USER_ENDED" } });
    await sleep(500);

    const lines = [...A.logs, ...B.logs];
    const events = lines.filter((l) => l.startsWith("{") && l.includes('"drixo":true')).map((l) => JSON.parse(l));
    check("telemetry events are emitted as JSON lines", events.length > 20, String(events.length));

    const leaked = [];
    for (const l of lines) {
      for (const c of [...canaries, ...secretsSeen]) if (c && l.includes(c)) leaked.push(`${c.slice(0, 12)}…`);
    }
    check("ARC-14: no user text, cookie, CSRF token or session id appears in ANY server log line", leaked.length === 0, leaked.slice(0, 5).join(" "));
    check("ARC-14: no IP address or user-agent in telemetry events", !events.some((e) => JSON.stringify(e).match(/127\.0\.0\.1|::1|Mozilla|node/)));

    const ALLOWED_KEYS = new Set(["drixo", "event", "ts", "env", "route", "responseClass", "uiState", "inputType", "outcome", "kbResult", "helpful", "endReason", "latencyBucket", "policy", "errorCode", "correlationId", "revisionId", "reasonCode", "flag", "sourceId", "status", "rolloutPercent", "droppedCount"]);
    const badKeys = events.filter((e) => Object.keys(e).some((k) => !ALLOWED_KEYS.has(k)));
    check("telemetry uses only allowlisted field names", badKeys.length === 0, JSON.stringify(badKeys[0]));
    check("no telemetry_dropped events (code never tries to emit a disallowed field)", !events.some((e) => e.event === "telemetry_dropped"));
    check("environment label is set from DRIXO_ENV", events.every((e) => e.env === "staging"));

    const names = new Set(events.map((e) => e.event));
    for (const n of ["session_started", "session_ended", "turn_response", "secret_blocked", "protected_request_blocked", "kb_lookup", "feedback", "request_error", "kb_circuit_open", "kb_circuit_closed"]) {
      check(`event seen: ${n}`, names.has(n));
    }
    check("request_error covers the kill switch and infrastructure failure", events.some((e) => e.event === "request_error" && e.errorCode === "KILL_SWITCH") && events.some((e) => e.event === "request_error" && ["INTERNAL", "UPSTREAM"].includes(e.errorCode)));
    const tr = events.filter((e) => e.event === "turn_response");
    check("turn_response carries class, UI state, policy and a latency bucket", tr.every((e) => e.responseClass && e.uiState && e.policy && e.latencyBucket));
  }
} finally {
  await stack.stop();
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
setTimeout(() => process.exit(process.exitCode), 300);
