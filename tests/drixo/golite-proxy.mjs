// Tests for the server-side GoLite device-check proxy (app/api/upstream/golite-device-check).
// Self-contained: starts Redis + Postgres + one production `next start` instance and a MOCK upstream that
// records what it receives. No real GoLite call is ever made and no real credential is used.
//
//   node tests/drixo/golite-proxy.mjs
//
// What this proves: the secret is attached server-side and never returned; only three fixed actions with a
// valid device identifier are forwarded; the browser cannot choose the upstream URL, headers or extra fields;
// same-origin, rate-limit, size, media-type and timeout controls work; upstream responses pass through so the
// existing UI keeps working; a rate-limit store outage fails closed.
// What it does NOT prove: that the real GoLite API accepts these requests (needs the real credential and a
// staging test), or that callers are authorized (the proxy cannot authenticate users; see DEFECT-1).

import http from "node:http";
import { startStack } from "./stack.mjs";

let pass = 0;
let fail = 0;
const check = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : `  ${extra}`}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SECRET = "test-secret-abc-123-do-not-leak";
const MOCK_PORT = 9911;
const seen = []; // requests the mock upstream received
let mode = "ok";
const mock = http.createServer((req, res) => {
  let body = "";
  req.on("data", (d) => (body += d));
  req.on("end", async () => {
    seen.push({ method: req.method, url: req.url, headers: req.headers, body });
    if (mode === "hang") {
      await sleep(10000);
      return res.end("{}");
    }
    if (mode === "html") {
      res.writeHead(200, { "Content-Type": "text/html" });
      return res.end("<html>oops</html>");
    }
    if (mode === "upstream403") {
      res.writeHead(403, { "Content-Type": "application/json", "X-Upstream-Secret": "leak-me" });
      return res.end(JSON.stringify({ error: "forbidden upstream", compatible: false }));
    }
    res.writeHead(200, { "Content-Type": "application/json", "Set-Cookie": "upstream=1", "X-Upstream-Secret": "leak-me" });
    res.end(JSON.stringify({ compatible: true, esimCompatible: true }));
  });
});
await new Promise((r) => mock.listen(MOCK_PORT, "127.0.0.1", r));

const stack = await startStack({
  appPorts: [3116],
  redisPort: 6392,
  dbPort: 54331,
  env: {
    GOLITE_API_URL: `http://127.0.0.1:${MOCK_PORT}/api/device_compatibility_checker/`,
    ESIM_SECRET_KEY: SECRET,
    SITE_DEVICE_CHECK_PER_MIN: "40",
  },
});
const app = stack.apps[0];
const URL = `${app.base}/api/upstream/golite-device-check`;
const IMEI = "356938035643809";

async function post(body, { origin = app.base, ct = "application/json", raw } = {}) {
  const h = {};
  if (ct) h["Content-Type"] = ct;
  if (origin) h.Origin = origin;
  const res = await fetch(URL, { method: "POST", headers: h, body: raw ?? JSON.stringify(body) });
  const text = await res.text();
  return { status: res.status, text, headers: res.headers };
}

try {
  // ------------------------------------------------------------------ happy path
  {
    seen.length = 0;
    const r = await post({ action: "esim_check", imei: IMEI });
    check("valid request is forwarded and answered 200", r.status === 200 && JSON.parse(r.text).compatible === true, `${r.status} ${r.text}`);
    check("the secret is attached SERVER-SIDE (upstream received X-Secret-Key)", seen[0]?.headers["x-secret-key"] === SECRET, JSON.stringify(seen[0]?.headers));
    check("upstream received exactly {action, imei} (no extra client-controlled fields)", seen[0] && JSON.stringify(JSON.parse(seen[0].body)) === JSON.stringify({ action: "esim_check", imei: IMEI }), seen[0]?.body);
    check("upstream URL path is the fixed one (client cannot choose it)", seen[0]?.url === "/api/device_compatibility_checker/");
    check("the secret never appears in the response body or headers", !r.text.includes(SECRET) && ![...r.headers.values()].some((v) => v.includes(SECRET)));
    check("upstream headers and cookies are not forwarded to the browser", !r.headers.has("x-upstream-secret") && !r.headers.has("set-cookie"));
    check("response is no-store JSON", /application\/json/.test(r.headers.get("content-type")) && /no-store/.test(r.headers.get("cache-control")));
    for (const action of ["esim_v_check", "esim_update"]) {
      const x = await post({ action, imei: IMEI });
      check(`allowlisted action ${action} is forwarded`, x.status === 200);
    }
    const eid = await post({ action: "esim_check", imei: "89049032000001000000012345678901" });
    check("32-character EID and hex MEID formats are accepted", eid.status === 200);
  }

  // ------------------------------------------------------------------ validation: nothing reaches upstream
  {
    seen.length = 0;
    const bad = [
      ["unknown action", { action: "delete_all", imei: IMEI }],
      ["action case/whitespace trick", { action: "esim_check ", imei: IMEI }],
      ["action in upper case", { action: "ESIM_CHECK", imei: IMEI }],
      ["missing action", { imei: IMEI }],
      ["missing imei", { action: "esim_check" }],
      ["imei too short", { action: "esim_check", imei: "1234567" }],
      ["imei too long", { action: "esim_check", imei: "1".repeat(33) }],
      ["imei with non-hex characters", { action: "esim_check", imei: "35693803564380G" }],
      ["imei with path characters", { action: "esim_check", imei: "../../etc/passwd" }],
      ["imei with CRLF", { action: "esim_check", imei: "3569380356\r\nX-Evil: 1" }],
      ["imei as object", { action: "esim_check", imei: { $ne: null } }],
      ["imei as array", { action: "esim_check", imei: [IMEI] }],
      ["extra field url", { action: "esim_check", imei: IMEI, url: "http://evil.example/" }],
      ["extra field headers", { action: "esim_check", imei: IMEI, headers: { "X-Secret-Key": "x" } }],
      ["array body", [{ action: "esim_check", imei: IMEI }]],
      ["null body", null],
    ];
    for (const [name, body] of bad) {
      const r = await post(body);
      check(`rejected 400: ${name}`, r.status === 400, `${r.status} ${r.text}`);
    }
    check("none of the rejected requests reached the upstream", seen.length === 0, String(seen.length));
    const malformed = await post(null, { raw: "{not json" });
    check("malformed JSON => 400", malformed.status === 400, String(malformed.status));
    const ct = await post({ action: "esim_check", imei: IMEI }, { ct: "text/plain" });
    check("wrong media type => 415", ct.status === 415, String(ct.status));
    const big = await post(null, { raw: JSON.stringify({ action: "esim_check", imei: IMEI, pad: "x".repeat(2000) }) });
    check("oversized body => 413", big.status === 413, String(big.status));
    check("still nothing reached the upstream", seen.length === 0, String(seen.length));
    const get = await fetch(URL, { method: "GET", headers: { Origin: app.base } });
    check("GET is not served (405)", get.status === 405, String(get.status));
  }

  // ------------------------------------------------------------------ same-origin only
  {
    seen.length = 0;
    const evil = await post({ action: "esim_check", imei: IMEI }, { origin: "https://evil.example" });
    const none = await post({ action: "esim_check", imei: IMEI }, { origin: null });
    check("foreign Origin => 403", evil.status === 403, String(evil.status));
    check("missing Origin => 403", none.status === 403, String(none.status));
    check("blocked-origin requests never reached the upstream", seen.length === 0);
  }

  // ------------------------------------------------------------------ upstream behaviour
  {
    mode = "upstream403";
    const r = await post({ action: "esim_check", imei: IMEI });
    check("upstream error status and JSON pass through unchanged (UI keeps working)", r.status === 403 && JSON.parse(r.text).error === "forbidden upstream", `${r.status} ${r.text}`);
    check("upstream response headers are still not forwarded", !r.headers.has("x-upstream-secret"));
    mode = "html";
    const h = await post({ action: "esim_check", imei: IMEI });
    check("non-JSON upstream body => 502 (HTML is never relayed to the page)", h.status === 502 && !h.text.includes("<html>"), `${h.status} ${h.text}`);
    mode = "hang";
    const t0 = Date.now();
    const slow = await post({ action: "esim_check", imei: IMEI });
    const took = Date.now() - t0;
    check(`hung upstream => bounded timeout then 502 (${took}ms)`, slow.status === 502 && took < 9500, `${slow.status} ${took}ms`);
    mode = "ok";
  }

  // ------------------------------------------------------------------ rate limit (limit 40/min per client)
  {
    let limited;
    for (let i = 0; i < 60 && !limited; i++) {
      const r = await post({ action: "esim_check", imei: IMEI });
      if (r.status === 429) limited = r;
    }
    check("rate limit: bursts get 429 with Retry-After", limited?.status === 429 && Number(limited.headers.get("retry-after")) >= 1, limited ? `${limited.status}` : "never limited");
  }

  // ------------------------------------------------------------------ fail closed when the limiter store is down
  {
    await stack.redis.stop();
    await sleep(500);
    seen.length = 0;
    const r = await post({ action: "esim_check", imei: IMEI });
    check("rate-limit store down => 503 and the request is NOT forwarded (fail closed)", r.status === 503 && seen.length === 0, `${r.status} upstream=${seen.length}`);
    await stack.redis.start();
  }

  // ------------------------------------------------------------------ secret hygiene in logs
  {
    const logs = app.logs.join("\n");
    check("the secret value appears in no server log line", !logs.includes(SECRET));
  }
} finally {
  await stack.stop();
  mock.close();
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
setTimeout(() => process.exit(process.exitCode), 300);
