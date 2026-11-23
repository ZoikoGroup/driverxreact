// Drixo certification evidence runner (Phase 7). Runs every automated suite in order and prints one table.
//
//   npx next build --webpack            (with NEXT_PUBLIC_DRIXO_ENABLED=true and any NEXT_PUBLIC_STRIPE_SECRET_KEY)
//   node tests/drixo/cert-run.mjs [--skip kb,ops]      (npm run drixo:certify)
//
// Takes several minutes. Needs Node 20+, `redis-server` on PATH, and Chrome or Edge (CHROME_PATH) for the
// accessibility audit. Exit code 0 only if every step passed.
//
// What a green run means: the automated checks that exist all pass in production mode. What it does NOT
// mean: the release is certified. Gates G1-G8 need human owners, an external security review, assistive
// technology testing, signed decisions D-01..D-08 and real-infrastructure drills. See certification/.

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { startStack, root, waitFor } from "./stack.mjs";

const skip = new Set((process.argv.includes("--skip") ? process.argv[process.argv.indexOf("--skip") + 1] : "").split(",").filter(Boolean));
const results = [];

function run(label, script, args = [], { timeoutMs = 10 * 60_000, env = {} } = {}) {
  return new Promise((resolve) => {
    console.log(`\n=== ${label} ===`);
    const t0 = Date.now();
    const p = spawn(process.execPath, [join(root, "tests/drixo", script), ...args], { env: { ...process.env, ...env }, cwd: root });
    let out = "";
    const onData = (d) => {
      out += d;
      process.stdout.write(d);
    };
    p.stdout.on("data", onData);
    p.stderr.on("data", onData);
    const timer = setTimeout(() => p.kill(), timeoutMs);
    p.on("close", (code) => {
      clearTimeout(timer);
      const m = [...out.matchAll(/(\d+) passed, (\d+) failed/g)].pop();
      const defects = out.match(/(\d+) OPEN DEFECT/);
      results.push({
        label,
        passed: m ? Number(m[1]) : NaN,
        failed: m ? Number(m[2]) : NaN,
        code,
        secs: Math.round((Date.now() - t0) / 1000),
        defects: defects ? Number(defects[1]) : 0,
      });
      resolve(code);
    });
  });
}

const ops = (stack, args) =>
  new Promise((res) => {
    const p = spawn(process.execPath, [join(root, "scripts/drixo-ops.mjs"), ...args], { env: { ...process.env, DRIXO_OPS_DATABASE_URL: stack.db.url } });
    p.on("close", res);
  });

// 1. database, roles, retention (no server)
if (!skip.has("db")) await run("Database: schema, publisher rules, roles, flags, retention", "db.test.mjs");

// 2. operations on a two-instance production stack
if (!skip.has("ops")) await run("Operations: 2 instances, Redis, flags/canary/kill, breaker, Redis loss, telemetry redaction", "ops-e2e.mjs");

// 3. session expiry
if (!skip.has("expiry")) await run("Session idle and absolute expiry", "expiry-e2e.mjs");

// 3b. site: server-side device-check proxy (secret no longer in the browser)
if (!skip.has("proxy") && existsSync(join(root, "app/api/upstream/golite-device-check/route.ts"))) await run("Site: server-side GoLite proxy (eSIM secret kept off the browser)", "golite-proxy.mjs");

// 3c. guest metadata persistence, daily metrics, retention
if (!skip.has("persist")) await run("Guest metadata persistence, daily metrics, retention", "persist-e2e.mjs");

// 3d. Phase 5: model-written answers against a MOCK provider (free)
if (!skip.has("model")) await run("Phase 5: model answers, output gate, budgets, breaker, kill switch (mock provider)", "model-e2e.mjs", [], { timeoutMs: 15 * 60_000 });

// 4. contract, flows, adversarial, accessibility and security against a PRODUCTION-mode stack with default limits
if (!skip.has("stack")) {
  console.log("\n=== starting production-mode stack for contract / flow / adversarial / a11y / security ===");
  const stack = await startStack({
    appPorts: [3111, 3112],
    env: { DRIXO_TURNS_PER_SESSION_PER_MIN: "20", DRIXO_FAULT_DELAY_BEFORE_RECHECK_MS: "0" },
  });
  try {
    await ops(stack, ["rollout", "100", "--actor", "cert-run", "--reason", "CANARY_PROMOTE"]);
    await waitFor(async () => (await (await fetch(`${stack.apps[0].base}/api/v1/drixo/public/config`)).json()).rolloutPercent === 100, { timeout: 15000, label: "rollout 100" });
    const base = stack.apps[0].base;
    await run("API contract (5 endpoints) in production mode", "api-contract.mjs", [base]);
    await run("Flows, policy, intents, secrets in production mode", "flow-contract.mjs", [base]);
    await run("Adversarial, robustness and fuzz in production mode", "adversarial.mjs", [base]);
    await run("Accessibility audit (axe WCAG 2.2 AA + keyboard + reflow)", "a11y.mjs", [base]);
    await run("Widget behaviour: suppression, length, offline, rephrase, scroll, analytics", "ui-behaviour.mjs", [base]);
    await run("Security scan (secrets, bundle, dependencies, headers)", "security-scan.mjs", [base]);
  } finally {
    await stack.stop();
  }
}

// 5. knowledge base end-to-end (needs the dev-only fault hook, so it runs on a dev server)
if (!skip.has("kb")) {
  console.log("\n=== starting dev server for the knowledge-base suite (needs the test-only fault hook) ===");
  const dev = spawn(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "dev", "--webpack", "-p", "3115"], {
    cwd: root,
    env: {
      ...process.env,
      DRIXO_API_ENABLED: "true",
      DRIXO_SESSIONS_PER_IP_PER_MIN: "5000",
      DRIXO_REQUESTS_PER_IP_PER_MIN: "50000",
      DRIXO_TURNS_PER_SESSION_PER_MIN: "100",
      DRIXO_DB_POOL_MAX: "3",
      DRIXO_FAULT_DELAY_BEFORE_RECHECK_MS: "1500",
      DRIXO_KB_BREAKER_COOLDOWN_MS: "1000",
      DRIXO_FLAG_TTL_MS: "200",
      DRIXO_DATABASE_URL: "postgres://drixo_bff@127.0.0.1:54329/postgres",
      NEXT_DIST_DIR: ".next-cert", // own build dir: does not clash with a dev server you already have open
    },
    stdio: "ignore",
  });
  try {
    await waitFor(async () => (await fetch("http://localhost:3115/robots.txt")).ok, { timeout: 120000, label: "dev server" });
    await fetch("http://localhost:3115/api/v1/drixo/public/config").catch(() => undefined); // compile routes
    await run("Knowledge base end-to-end + 40 Document 06 scenarios", "kb-e2e.mjs", ["http://localhost:3115"]);
  } catch (e) {
    // Most common cause: another `next dev` already runs in this project (they share the .next/dev lock),
    // for example one started from an editor or terminal. Stop it, or run this suite from a copy.
    console.log(`\nKNOWLEDGE SUITE NOT RUN: ${e.message}. Is another "next dev" already running for this project?`);
    results.push({ label: "Knowledge base end-to-end + 40 Document 06 scenarios (NOT RUN)", passed: NaN, failed: NaN, code: 1, secs: 0, defects: 0 });
  } finally {
    dev.kill();
  }
}

// ------------------------------------------------------------------ summary
console.log("\n==================== CERTIFICATION EVIDENCE SUMMARY ====================");
let bad = 0;
for (const r of results) {
  const ok = r.code === 0 && r.failed === 0;
  if (!ok) bad++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${String(r.passed).padStart(4)} passed ${String(r.failed).padStart(3)} failed  ${String(r.secs).padStart(4)}s  ${r.label}${r.defects ? `   [${r.defects} open defect(s) outside Drixo code]` : ""}`);
}
const total = results.reduce((a, r) => a + (Number.isFinite(r.passed) ? r.passed : 0), 0);
console.log(`\n${total} automated checks passed across ${results.length} suites; ${bad} suite(s) failing.`);
console.log("This is evidence, not certification: see certification/RELEASE_RECORD.md for gates that still need people.");
process.exitCode = bad ? 1 : 0;
setTimeout(() => process.exit(process.exitCode), 300);
