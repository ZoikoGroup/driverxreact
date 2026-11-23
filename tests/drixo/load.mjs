// Drixo latency / load baseline harness (Doc 08 section 15 SLO signals).
//
//   node tests/drixo/load.mjs --stack [--seconds 20] [--concurrency 8] [--instances 2]
//   node tests/drixo/load.mjs http://host1 http://host2 [--seconds 20] [--concurrency 8]
//
// --stack starts the same production-mode stack as ops-e2e (Redis + Postgres + N `next start`
// instances), seeds and approves two fixture articles, runs the load, prints a report and stops.
//
// IMPORTANT: numbers from a single developer machine running the load generator, Redis, an in-process
// WASM Postgres and the app on the same CPU are NOT capacity or SLO evidence. They only (a) catch gross
// regressions and (b) show the relative cost of config vs deterministic vs KB turns. SRE must re-baseline
// on production-equivalent infrastructure before any target is published (Doc 08: targets are proposals).

import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { startStack, root } from "./stack.mjs";

const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : d;
};
const useStack = args.includes("--stack");
const seconds = Number(flag("seconds", 20));
const concurrency = Number(flag("concurrency", 8));
const instances = Number(flag("instances", 2));
let bases = args.filter((a) => a.startsWith("http"));

function cli(script, a, env) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [join(root, "scripts", script), ...a], { env: { ...process.env, ...env } });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("close", (code) => resolve({ code, out }));
  });
}

let stack;
if (useStack) {
  console.log("starting stack...");
  stack = await startStack({ appPorts: [3111, 3112, 3113].slice(0, instances) });
  bases = stack.apps.map((a) => a.base);
  const env = { DRIXO_PUBLISHER_DATABASE_URL: stack.db.url, DRIXO_OPS_DATABASE_URL: stack.db.url };
  await cli("drixo-kb.mjs", ["seed-drafts", "--actor", "importer"], env);
  await cli("drixo-kb.mjs", ["activate-source", "S01", "--actor", "editor"], env);
  const from = new Date(Date.now() - 3600_000).toISOString();
  for (const c of ["KB-001@1", "KB-031@1"]) {
    await cli("drixo-kb.mjs", ["submit", c, "--actor", "editor"], env);
    await cli("drixo-kb.mjs", ["approve", c, "--actor", "approver", "--from", from], env);
  }
}
if (bases.length === 0) {
  console.error("give base URLs or --stack");
  process.exit(1);
}

const samples = { config: [], sessionCreate: [], deterministicTurn: [], kbTurn: [], protectedTurn: [] };
const errors = { config: 0, sessionCreate: 0, deterministicTurn: 0, kbTurn: 0, protectedTurn: 0 };
const kbHits = { hit: 0, other: 0 };

async function timed(kind, fn) {
  const t0 = performance.now();
  try {
    const res = await fn();
    samples[kind].push(performance.now() - t0);
    if (res.status >= 500 || res.status === 429) errors[kind]++;
    return res;
  } catch {
    samples[kind].push(performance.now() - t0);
    errors[kind]++;
    return undefined;
  }
}

async function post(base, path, body, { cookie, csrf } = {}) {
  const h = { "Content-Type": "application/json", Origin: base, "Idempotency-Key": randomUUID() };
  if (cookie) h.Cookie = cookie;
  if (csrf) h["X-Drixo-CSRF"] = csrf;
  const res = await fetch(`${base}/api/v1/drixo/public${path}`, { method: "POST", headers: h, body: JSON.stringify(body) });
  const text = await res.text();
  return { status: res.status, text, res };
}

async function worker(id, until) {
  let n = 0;
  while (Date.now() < until) {
    const base = bases[(id + n++) % bases.length];
    await timed("config", () => fetch(`${base}/api/v1/drixo/public/config`, { headers: { Origin: base } }).then(async (r) => (await r.text(), r)));

    const s = await timed("sessionCreate", () => post(base, "/sessions", { locale: "en-US", clientInstanceId: randomUUID() }));
    if (!s || s.status !== 201) continue;
    const j = JSON.parse(s.text);
    const sess = { cookie: s.res.headers.getSetCookie()[0].split(";")[0], csrf: j.csrfToken };
    const turn = (input, v) => post(base, `/sessions/${j.sessionId}/turns`, { clientRequestId: randomUUID(), contextVersion: v, input }, sess);

    await timed("deterministicTurn", () => turn({ type: "SHORTCUT", intentCode: "FIX_CONNECTION" }, 0));
    const kb = await timed("kbTurn", () => turn({ type: "TEXT", text: "What is DriverX Mobile?" }, 1));
    if (kb) kb.text.includes('"sources":[{') ? kbHits.hit++ : kbHits.other++;
    await timed("protectedTurn", () => turn({ type: "TEXT", text: "how much data do I have left?" }, 2));
  }
}

const pct = (arr, p) => {
  if (!arr.length) return NaN;
  const a = [...arr].sort((x, y) => x - y);
  return a[Math.min(a.length - 1, Math.ceil((p / 100) * a.length) - 1)];
};

// Warm-up so JIT / connection pools are not counted.
await Promise.all(Array.from({ length: Math.min(4, concurrency) }, (_, i) => worker(i, Date.now() + 3000)));
for (const k of Object.keys(samples)) {
  samples[k].length = 0;
  errors[k] = 0;
}
kbHits.hit = kbHits.other = 0;

const t0 = Date.now();
await Promise.all(Array.from({ length: concurrency }, (_, i) => worker(i, t0 + seconds * 1000)));
const elapsed = (Date.now() - t0) / 1000;

const targets = { config: 800, deterministicTurn: 2000, kbTurn: 10000 }; // Doc 08 proposed p95 (ms), NOT SLAs
console.log(`\nLoad report: ${bases.length} instance(s), concurrency ${concurrency}, ${elapsed.toFixed(1)}s`);
console.log("scenario            n     err   p50ms   p95ms   p99ms   proposed p95 target");
let total = 0;
for (const k of Object.keys(samples)) {
  const a = samples[k];
  total += a.length;
  const tgt = targets[k] ? `<= ${targets[k]}ms ${pct(a, 95) <= targets[k] ? "(within)" : "(OVER)"}` : "-";
  console.log(
    `${k.padEnd(18)} ${String(a.length).padStart(5)} ${String(errors[k]).padStart(5)} ${pct(a, 50).toFixed(0).padStart(7)} ${pct(a, 95).toFixed(0).padStart(7)} ${pct(a, 99).toFixed(0).padStart(7)}   ${tgt}`,
  );
}
console.log(`total requests ${total}, ${(total / elapsed).toFixed(0)} req/s`);
console.log(`KB turns answered from approved content: ${kbHits.hit}/${kbHits.hit + kbHits.other}`);
const errTotal = Object.values(errors).reduce((x, y) => x + y, 0);
console.log(`errors (5xx or 429): ${errTotal}`);
console.log("NOTE: single-machine numbers; not capacity or SLO evidence. SRE must re-baseline (Doc 08 section 15).");

if (stack) await stack.stop();
process.exitCode = errTotal > 0 ? 1 : 0;
setTimeout(() => process.exit(process.exitCode), 300);
