// Drixo public API contract tests (Phase 2). Zero dependencies; run against a sandbox server:
//
//   DRIXO_API_ENABLED=true DRIXO_SESSIONS_PER_IP_PER_MIN=100 DRIXO_REQUESTS_PER_IP_PER_MIN=1000 \
//     npx next dev --webpack -p 3111
//   node tests/drixo/api-contract.mjs http://localhost:3111
//   node tests/drixo/api-contract.mjs http://localhost:3111 --expect-disabled   (kill-switch run)
//
// Maps to Doc 08 ARC-xx and Doc 04 API-Nxx. Results are evidence for gate G1 only when run
// against the real sandbox build; the in-memory store used in Phase 2 does not prove multi-instance behavior.

import { randomUUID } from "node:crypto";

const base = (process.argv[2] ?? "http://localhost:3111").replace(/\/$/, "");
const expectDisabled = process.argv.includes("--expect-disabled");
const API = `${base}/api/v1/drixo/public`;
const ORIGIN = base;

let pass = 0;
let fail = 0;
const check = (name, cond, extra = "") => {
  if (cond) pass++;
  else fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : `  ${extra}`}`);
};

async function call(method, path, { body, headers = {}, cookie, csrf, origin = ORIGIN, idem = randomUUID(), raw } = {}) {
  const h = { ...headers };
  if (body !== undefined || raw !== undefined) h["Content-Type"] ??= "application/json";
  if (origin) h.Origin = origin;
  if (cookie) h.Cookie = cookie;
  if (csrf) h["X-Drixo-CSRF"] = csrf;
  if (method === "POST" && idem) h["Idempotency-Key"] = idem;
  const res = await fetch(`${API}${path}`, {
    method,
    headers: h,
    body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
    redirect: "manual",
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : undefined;
  } catch {
    /* non-json */
  }
  return { res, status: res.status, json, text, setCookie: res.headers.getSetCookie?.() ?? [] };
}

const cookieOf = (setCookie) => setCookie[0]?.split(";")[0];

async function newSession() {
  const r = await call("POST", "/sessions", { body: { locale: "en-US", clientInstanceId: randomUUID() } });
  return { r, cookie: cookieOf(r.setCookie), csrf: r.json?.csrfToken, id: r.json?.sessionId, v: r.json?.contextVersion };
}
const turn = (s, input, extra = {}) =>
  call("POST", `/sessions/${s.id}/turns`, {
    cookie: s.cookie,
    csrf: s.csrf,
    body: { clientRequestId: randomUUID(), contextVersion: s.v, input },
    ...extra,
  });

async function main() {
  if (expectDisabled) {
    const c = await call("GET", "/config");
    check("kill switch: config 404 when API disabled", c.status === 404, `got ${c.status}`);
    const s = await call("POST", "/sessions", { body: { locale: "en-US", clientInstanceId: randomUUID() } });
    check("kill switch: sessions 404 when API disabled", s.status === 404, `got ${s.status}`);
    return;
  }

  // ---- config ----
  const cfg = await call("GET", "/config");
  check("config 200", cfg.status === 200, `got ${cfg.status}`);
  const codes = (cfg.json?.shortcuts ?? []).map((s) => s.intentCode);
  check(
    "config: exactly six shortcuts in locked order",
    JSON.stringify(codes) ===
      JSON.stringify(["FIX_CONNECTION", "ACTIVATE_SIM_ESIM", "PLANS_HOTSPOT", "BILLING_TOPUPS", "FLEET_IOT", "DRIVER_BENEFITS"]),
    JSON.stringify(codes),
  );
  const f = cfg.json?.features ?? {};
  check(
    "config: all P0-denied capability flags are false",
    ["uploads", "voice", "liveHandoff", "authenticatedTools", "supplierWrites"].every((k) => f[k] === false),
    JSON.stringify(f),
  );
  check("config: public short cache", /public, max-age=\d+/.test(cfg.res.headers.get("cache-control") ?? ""));

  // ---- ARC-01: no extra routes ----
  for (const p of ["/activate", "/billing", "/subscriber", "/handoff", "/payment", "/fleet/lines"]) {
    const r = await call("GET", p);
    check(`ARC-01: ${p} does not exist`, r.status === 404, `got ${r.status}`);
  }

  // ---- session creation ----
  const s = await newSession();
  check("session 201", s.r.status === 201, `got ${s.r.status} ${s.r.text}`);
  check("session: contextVersion 0, GUEST, S01", s.v === 0 && s.r.json?.mode === "GUEST" && s.r.json?.uiState === "S01");
  const sc = s.r.setCookie[0] ?? "";
  check(
    "session cookie: HttpOnly, SameSite=Lax, scoped Path",
    /HttpOnly/i.test(sc) && /SameSite=Lax/i.test(sc) && sc.includes("Path=/api/v1/drixo/public"),
    sc,
  );
  check("session: no-store", /no-store/.test(s.r.res.headers.get("cache-control") ?? ""));
  check("session cookie value not in JSON body", !s.r.text.includes(s.cookie?.split("=")[1] ?? "@@"));

  // ---- idempotent session create ----
  const sk = randomUUID();
  const sb = { locale: "en-US", clientInstanceId: randomUUID() };
  const a1 = await call("POST", "/sessions", { body: sb, idem: sk });
  const a2 = await call("POST", "/sessions", { body: sb, idem: sk });
  check("ARC-07: same key+body returns same session", a1.json?.sessionId && a1.json.sessionId === a2.json?.sessionId);
  const a3 = await call("POST", "/sessions", { body: { ...sb, reducedMotion: true }, idem: sk });
  check("ARC-08: same key + changed body => 409", a3.status === 409 && a3.json?.code === "IDEMPOTENCY_CONFLICT", `got ${a3.status}`);

  // ---- session validation ----
  const bad = await call("POST", "/sessions", { body: { locale: "fr-FR", clientInstanceId: randomUUID() } });
  check("session: bad locale 400", bad.status === 400);
  const unk = await call("POST", "/sessions", { body: { locale: "en-US", clientInstanceId: randomUUID(), role: "admin" } });
  check("API-N12: unknown field rejected 400", unk.status === 400, `got ${unk.status}`);
  const noidem = await call("POST", "/sessions", { body: sb, idem: null });
  check("session: missing Idempotency-Key 400", noidem.status === 400, `got ${noidem.status}`);
  const badOrigin = await call("POST", "/sessions", { body: sb, origin: "https://evil.example" });
  check("API-N02: non-allowlisted Origin 403", badOrigin.status === 403 && badOrigin.json?.code === "ORIGIN_BLOCKED", `got ${badOrigin.status}`);
  const noOrigin = await call("POST", "/sessions", { body: sb, origin: null });
  check("missing Origin 403", noOrigin.status === 403, `got ${noOrigin.status}`);
  const ct = await call("POST", "/sessions", { raw: "x", headers: { "Content-Type": "text/plain" } });
  check("wrong content-type 415", ct.status === 415, `got ${ct.status}`);
  const big = await call("POST", "/sessions", { raw: JSON.stringify({ locale: "en-US", clientInstanceId: randomUUID(), pad: "x".repeat(20000) }) });
  check("oversized body 413", big.status === 413, `got ${big.status}`);
  const malformed = await call("POST", "/sessions", { raw: "{not json" });
  check("malformed JSON 400", malformed.status === 400, `got ${malformed.status}`);
  check("errors are problem+json", /application\/problem\+json/.test(malformed.res.headers.get("content-type") ?? ""));

  // ---- turns: happy path ----
  const t1 = await turn(s, { type: "SHORTCUT", intentCode: "FIX_CONNECTION" });
  check("turn 200", t1.status === 200, `got ${t1.status} ${t1.text}`);
  check("turn: contextVersion incremented to 1", t1.json?.contextVersion === 1);
  check(
    "turn: typed response, no source/price/status invented",
    t1.json?.result?.responseClass === "QUESTION" && Array.isArray(t1.json.result.sources) && t1.json.result.sources.length === 0,
  );
  check("turn: user text never echoed", !(await turn({ ...s, v: 1 }, { type: "TEXT", text: "SECRET-CANARY-12345" })).text.includes("SECRET-CANARY-12345"));
  s.v = 2;

  // ---- ARC-07: idempotent retry yields one turn ----
  const k = randomUUID();
  const body = { clientRequestId: randomUUID(), contextVersion: 2, input: { type: "TEXT", text: "hello" } };
  const r1 = await call("POST", `/sessions/${s.id}/turns`, { cookie: s.cookie, csrf: s.csrf, body, idem: k });
  const r2 = await call("POST", `/sessions/${s.id}/turns`, { cookie: s.cookie, csrf: s.csrf, body, idem: k });
  check("ARC-07: retry replays same turnId, one increment", r1.status === 200 && r2.status === 200 && r1.json.turnId === r2.json.turnId && r2.json.contextVersion === 3, `${r1.status}/${r2.status}`);
  s.v = 3;
  const r3 = await call("POST", `/sessions/${s.id}/turns`, {
    cookie: s.cookie,
    csrf: s.csrf,
    body: { ...body, input: { type: "TEXT", text: "different" } },
    idem: k,
  });
  check("ARC-08: turn same key + changed body => 409", r3.status === 409 && r3.json?.code === "IDEMPOTENCY_CONFLICT", `got ${r3.status}`);

  // ---- ARC-05: stale context ----
  const stale = await turn({ ...s, v: 0 }, { type: "TEXT", text: "old" });
  check("ARC-05: stale contextVersion 409", stale.status === 409 && stale.json?.code === "STALE_CONTEXT", `got ${stale.status}`);
  const afterStale = await turn(s, { type: "TEXT", text: "ok" });
  check("stale request did not change state", afterStale.status === 200 && afterStale.json.contextVersion === 4, `got ${afterStale.status} v=${afterStale.json?.contextVersion}`);
  s.v = 4;

  // ---- ARC-06 / API-N03: forged quick reply ----
  const qr = await turn(s, { type: "QUICK_REPLY", stepId: "conn-step-01", optionId: "CALLS_SMS_YES" });
  check("ARC-06: forged quick reply 409", qr.status === 409 && qr.json?.code === "STALE_CONTEXT", `got ${qr.status}`);

  // ---- race: concurrent turns, one wins ----
  const race = await Promise.all(
    [0, 1, 2, 3, 4].map(() => turn(s, { type: "TEXT", text: "race" })),
  );
  const wins = race.filter((x) => x.status === 200).length;
  const stales = race.filter((x) => x.status === 409).length;
  check("ARC-05: concurrent turns, exactly one wins", wins === 1 && stales === 4, `wins=${wins} stales=${stales}`);
  s.v = 5;

  // ---- input validation ----
  check("input: empty text 400", (await turn(s, { type: "TEXT", text: "   " })).status === 400);
  check("input: >2000 chars 400", (await turn(s, { type: "TEXT", text: "a".repeat(2001) })).status === 400);
  check("input: unknown intent 400", (await turn(s, { type: "SHORTCUT", intentCode: "ACTIVATE_NOW" })).status === 400);
  check("input: unknown type 400", (await turn(s, { type: "TOOL_CALL", name: "x" })).status === 400);
  check("input: extra field in input 400", (await turn(s, { type: "TEXT", text: "hi", role: "agent" })).status === 400);

  // ---- ARC-03 / API-N02: CSRF + cookie ----
  const noCsrf = await turn({ ...s, csrf: undefined }, { type: "TEXT", text: "x" });
  check("ARC-03: missing CSRF 403", noCsrf.status === 403 && noCsrf.json?.code === "CSRF_FAILED", `got ${noCsrf.status}`);
  const wrongCsrf = await turn({ ...s, csrf: "nope" }, { type: "TEXT", text: "x" });
  check("ARC-03: wrong CSRF 403", wrongCsrf.status === 403, `got ${wrongCsrf.status}`);
  const noCookie = await turn({ ...s, cookie: undefined }, { type: "TEXT", text: "x" });
  check("ARC-04: sessionId alone grants nothing (no cookie) 404", noCookie.status === 404, `got ${noCookie.status}`);
  const origBad = await turn(s, { type: "TEXT", text: "x" }, { origin: "https://evil.example" });
  check("ARC-03: wrong Origin 403", origBad.status === 403, `got ${origBad.status}`);

  // ---- API-N01: another session's id with my cookie ----
  const other = await newSession();
  const cross = await call("POST", `/sessions/${other.id}/turns`, {
    cookie: s.cookie,
    csrf: other.csrf,
    body: { clientRequestId: randomUUID(), contextVersion: 0, input: { type: "TEXT", text: "x" } },
  });
  check("API-N01: my cookie on another session 404", cross.status === 404, `got ${cross.status}`);
  const crossCsrf = await call("POST", `/sessions/${other.id}/turns`, {
    cookie: other.cookie,
    csrf: s.csrf,
    body: { clientRequestId: randomUUID(), contextVersion: 0, input: { type: "TEXT", text: "x" } },
  });
  check("API-N01: other session with my CSRF 403", crossCsrf.status === 403, `got ${crossCsrf.status}`);
  const fake = await call("POST", `/sessions/${randomUUID()}/turns`, {
    cookie: s.cookie,
    csrf: s.csrf,
    body: { clientRequestId: randomUUID(), contextVersion: 0, input: { type: "TEXT", text: "x" } },
  });
  check("fake sessionId 404 (same as wrong cookie, non-enumerating)", fake.status === 404 && fake.json?.code === cross.json?.code, `got ${fake.status}`);
  check("non-uuid sessionId 404", (await call("POST", "/sessions/not-a-uuid/turns", { cookie: s.cookie, csrf: s.csrf, body: {} })).status === 404);

  // ---- feedback ----
  const fb = await call("POST", `/sessions/${s.id}/feedback`, { cookie: s.cookie, csrf: s.csrf, body: { turnId: t1.json.turnId, helpful: false, reason: "OUTDATED" } });
  check("feedback 202", fb.status === 202 && fb.json?.accepted === true, `got ${fb.status}`);
  const fb2 = await call("POST", `/sessions/${s.id}/feedback`, { cookie: s.cookie, csrf: s.csrf, body: { turnId: t1.json.turnId, helpful: true } });
  check("feedback: rating same turn again is accepted idempotently", fb2.status === 202, `got ${fb2.status}`);
  const fbForeign = await call("POST", `/sessions/${s.id}/feedback`, { cookie: s.cookie, csrf: s.csrf, body: { turnId: randomUUID(), helpful: true } });
  check("feedback: turn not owned by session 404", fbForeign.status === 404, `got ${fbForeign.status}`);
  const fbFree = await call("POST", `/sessions/${s.id}/feedback`, { cookie: s.cookie, csrf: s.csrf, body: { turnId: t1.json.turnId, helpful: true, comment: "free text" } });
  check("feedback: free-text field rejected 400", fbFree.status === 400, `got ${fbFree.status}`);

  // ---- rate limit (per-session turns) ----
  const rs = await newSession();
  let limited;
  for (let i = 0; i < 30; i++) {
    const x = await turn(rs, { type: "TEXT", text: "burst" });
    if (x.status === 429) {
      limited = x;
      break;
    }
    rs.v = x.json?.contextVersion ?? rs.v;
  }
  check("API-N14: turn burst => 429 with Retry-After", limited?.status === 429 && Number(limited.res.headers.get("retry-after")) >= 1 && limited.json?.retryable === true, `got ${limited?.status}`);

  // ---- end + ARC-16 ----
  const es = await newSession();
  const endBad = await call("POST", `/sessions/${es.id}/end`, { cookie: es.cookie, csrf: es.csrf, body: { reason: "BECAUSE" } });
  check("end: invalid reason 400", endBad.status === 400);
  const ek = randomUUID();
  const end1 = await call("POST", `/sessions/${es.id}/end`, { cookie: es.cookie, csrf: es.csrf, body: { reason: "USER_ENDED" }, idem: ek });
  check("end 204 with empty body", end1.status === 204 && end1.text === "", `got ${end1.status}`);
  check("end clears cookie (Max-Age=0)", /Max-Age=0/i.test(end1.setCookie[0] ?? ""), end1.setCookie[0]);
  const end2 = await call("POST", `/sessions/${es.id}/end`, { cookie: es.cookie, csrf: es.csrf, body: { reason: "USER_ENDED" }, idem: ek });
  check("end retry with same key replays 204", end2.status === 204, `got ${end2.status}`);
  const after = await turn(es, { type: "TEXT", text: "replay" });
  check("API-N13 / ARC-16: turn after end 404", after.status === 404, `got ${after.status}`);
  const afterFb = await call("POST", `/sessions/${es.id}/feedback`, { cookie: es.cookie, csrf: es.csrf, body: { turnId: randomUUID(), helpful: true } });
  check("feedback after end 404", afterFb.status === 404, `got ${afterFb.status}`);

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exitCode = fail ? 1 : 0;
}

main().catch((e) => {
  console.error("Test run crashed:", e);
  process.exitCode = 2;
});
