// Drixo session expiry tests (Doc 08 ARC-16, Doc 04 session semantics) against a production-mode instance
// with very short TTLs. Self-contained: starts its own Redis + Postgres + one `next start` instance.
//
//   node tests/drixo/expiry-e2e.mjs
//
// The TTL values here (2s idle, 6s absolute) exist only to make expiry observable in a test. The real
// values are decision D-04 (Privacy / Legal / SRE).

import { randomUUID } from "node:crypto";
import { startStack } from "./stack.mjs";

let pass = 0;
let fail = 0;
const check = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : `  ${extra}`}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const stack = await startStack({
  appPorts: [3114],
  redisPort: 6391,
  dbPort: 54330,
  env: { DRIXO_SESSION_IDLE_TTL_SEC: "2", DRIXO_SESSION_ABS_TTL_SEC: "6" },
});
const [app] = stack.apps;
const API = `${app.base}/api/v1/drixo/public`;

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
  return { r, id: r.json.sessionId, csrf: r.json.csrfToken, cookie: r.setCookie[0].split(";")[0], v: 0 };
}
async function turn(s, text = "hello") {
  const r = await call("POST", `/sessions/${s.id}/turns`, {
    cookie: s.cookie, csrf: s.csrf,
    body: { clientRequestId: randomUUID(), contextVersion: s.v, input: { type: "TEXT", text } },
  });
  if (r.status === 200) s.v = r.json.contextVersion;
  return r;
}

try {
  // Idle expiry
  {
    const s = await session();
    const secsToExpiry = (Date.parse(s.r.json.expiresAt) - Date.now()) / 1000;
    check("expiresAt reflects the idle TTL (about 2s)", secsToExpiry > 0 && secsToExpiry <= 2.5, `${secsToExpiry}s`);
    check("cookie Max-Age matches the idle TTL", /Max-Age=[12]\b/.test(s.r.setCookie[0]), s.r.setCookie[0]);
    check("a fresh session works", (await turn(s)).status === 200);
    await sleep(3200);
    const late = await turn(s);
    check("idle expiry: after 3s without activity the session is gone (404)", late.status === 404, String(late.status));
    const fb = await call("POST", `/sessions/${s.id}/feedback`, { cookie: s.cookie, csrf: s.csrf, body: { turnId: randomUUID(), helpful: true } });
    check("idle expiry: feedback also rejected (404)", fb.status === 404, String(fb.status));
  }

  // Activity keeps the session alive (idle window slides)...
  {
    const s = await session();
    let alive = true;
    const t0 = Date.now();
    while (Date.now() - t0 < 4200) {
      await sleep(900);
      if ((await turn(s)).status !== 200) { alive = false; break; }
    }
    check("activity extends the idle window (alive well past the 2s idle TTL)", alive);

    // ...but never past the absolute lifetime.
    await sleep(Math.max(0, 6500 - (Date.now() - t0)));
    const past = await turn(s);
    check("absolute expiry: session ends at the absolute lifetime even while active (404)", past.status === 404, String(past.status));
  }

  // Ending is final.
  {
    const s = await session();
    await call("POST", `/sessions/${s.id}/end`, { cookie: s.cookie, csrf: s.csrf, body: { reason: "USER_ENDED" } });
    check("ended session cannot be used again", (await turn(s)).status === 404);
  }
} finally {
  await stack.stop();
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
setTimeout(() => process.exit(process.exitCode), 300);
