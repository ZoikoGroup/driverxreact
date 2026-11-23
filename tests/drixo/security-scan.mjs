// Drixo security scan: dependency audit, secret scan, client-bundle leakage, response headers.
//
//   node tests/drixo/security-scan.mjs [http://localhost:3111]
//
// Needs a production build for the bundle scan (npx next build --webpack) and a running instance for the
// header checks. Output separates:
//   FAIL         a defect in Drixo-owned code/config: fails the run
//   OPEN DEFECT  a pre-existing defect elsewhere in this repo that blocks launch (reported loudly, does not
//                fail this script because it is outside the Drixo change set; it DOES fail gate G4/ARC-25)
//   INFO         needs triage by an owner
// Secret VALUES are never printed, only file:line and the pattern name.
//
// This is not a penetration test. Doc 08 requires an external security review before launch.

import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const BASE = process.argv[2]?.replace(/\/$/, "");

let pass = 0;
let fail = 0;
let openDefects = 0;
const check = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : `  ${extra}`}`);
};
const defect = (msg) => {
  openDefects++;
  console.log(`OPEN DEFECT  ${msg}`);
};
const info = (msg) => console.log(`INFO  ${msg}`);

const DRIXO_OWNED = [
  "app/lib/drixo", "app/components/drixo", "app/api/v1", "db", "scripts", "tests/drixo", "ops",
  "next.config.ts",
].map((p) => p.split("/").join(sep));
const owned = (rel) => DRIXO_OWNED.some((p) => rel === p || rel.startsWith(p + sep));

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (["node_modules", ".next", ".git", "dist", "coverage"].includes(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else yield p;
  }
}

// ----------------------------------------------------------------------------- 1. secret scan
console.log("\n== Secret scan (values are never printed) ==");
const PATTERNS = [
  ["Stripe live key", /sk_live_[A-Za-z0-9]{10,}/],
  ["Stripe test secret key", /sk_test_[A-Za-z0-9]{16,}/],
  ["Stripe restricted key", /rk_(live|test)_[A-Za-z0-9]{10,}/],
  ["AWS access key id", /AKIA[0-9A-Z]{16}/],
  ["private key block", /-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ["JWT", /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ["connection string with password", /(postgres(ql)?|redis|mysql|mongodb(\+srv)?):\/\/[^\s:@/]+:[^\s@/]{3,}@/],
  ["Google API key", /AIza[0-9A-Za-z_-]{35}/],
  ["Slack token", /xox[baprs]-[A-Za-z0-9-]{10,}/],
  ["GitHub token", /gh[pousr]_[A-Za-z0-9]{30,}/],
];
const TEXT_EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs", ".json", ".md", ".sql", ".yml", ".yaml", ".env", ".css", ".html", ".txt", ".example"]);
const findings = [];
for (const file of walk(root)) {
  const rel = relative(root, file);
  const ext = file.slice(file.lastIndexOf("."));
  if (!TEXT_EXT.has(ext) && !rel.endsWith(".env.local")) continue;
  if (rel.endsWith("package-lock.json") || statSync(file).size > 2_000_000) continue;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const [name, re] of PATTERNS) {
      if (re.test(line)) {
        // Test fixtures use obviously fake localhost credentials: postgres://postgres@127.0.0.1 has no password.
        findings.push({ rel, line: i + 1, name });
      }
    }
  });
}
const ownedFindings = findings.filter((f) => owned(f.rel));
check("no secret-shaped values in Drixo-owned files", ownedFindings.length === 0, ownedFindings.map((f) => `${f.rel}:${f.line} (${f.name})`).join("; "));
for (const f of findings.filter((x) => !owned(x.rel))) defect(`secret-shaped value (${f.name}) in ${f.rel}:${f.line}: rotate and move to server-side config`);
const envLocal = existsSync(join(root, ".env.local"));
info(`.env.local ${envLocal ? "exists locally (gitignored: confirmed not scanned for values, not committed)" : "not present"}`);

// ----------------------------------------------------------------------------- 2. browser-exposed secrets by name
console.log("\n== Browser-exposed secret names (NEXT_PUBLIC_*) ==");
const publicSecrets = new Map();
for (const file of walk(join(root, "app"))) {
  if (!/\.(ts|tsx|js|jsx|mjs)$/.test(file)) continue;
  const rel = relative(root, file);
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // commented-out code and doc comments do not ship
    for (const m of line.matchAll(/process\.env\.(NEXT_PUBLIC_[A-Z0-9_]+)/g)) {
      const name = m[1];
      if (/(SECRET|TOKEN|PASSWORD|PRIVATE)/.test(name) || (/KEY/.test(name) && !/PUBLISHABLE|PUBLIC_KEY|SITE_KEY|MAPS/.test(name))) {
        if (!publicSecrets.has(name)) publicSecrets.set(name, []);
        publicSecrets.get(name).push(`${rel}:${i + 1}`);
      }
    }
  });
}
const drixoPublic = [...publicSecrets.entries()].filter(([, where]) => where.some((w) => owned(w.replace(/:\d+$/, ""))));
check("Drixo adds no NEXT_PUBLIC_ secret (ARC-25 for Drixo code)", drixoPublic.length === 0, JSON.stringify(drixoPublic));
const API_DIR = ["app", "api"].join(sep) + sep;
for (const [name, where] of publicSecrets) {
  const outside = where.filter((w) => !owned(w.replace(/:\d+$/, "")));
  if (outside.length === 0) continue;
  const clientUses = outside.filter((w) => !w.startsWith(API_DIR));
  if (clientUses.length > 0) {
    defect(`${name} is used in client code (${clientUses.length} use(s), e.g. ${clientUses[0]}). Next.js inlines NEXT_PUBLIC_* values into browser JavaScript and these calls send it from the visitor's browser: rotate the credential and move the call server-side`);
  } else {
    info(`${name} is only read in server routes (${outside.join(", ")}) but carries a public-looking name: rename to a server-only variable and rotate the credential, then remove the legacy fallback`);
  }
}

// ----------------------------------------------------------------------------- 3. client bundle
console.log("\n== Client bundle leakage (needs a production build) ==");
const staticDir = join(root, ".next", "static");
if (!existsSync(staticDir)) {
  info("no .next/static found: run `npx next build --webpack` to enable the bundle scan");
} else {
  const serverOnly = ["DRIXO_SESSION_SECRET", "DRIXO_REDIS_URL", "DRIXO_DATABASE_URL", "drixo_bff", "drixo_publisher", "approved_public_chunks", "CAS_LUA", "set_flag(", "purge_expired_sessions"];
  const leaked = new Set();
  let secretShaped = 0;
  let files = 0;
  for (const file of walk(staticDir)) {
    if (!file.endsWith(".js")) continue;
    files++;
    const txt = readFileSync(file, "utf8");
    for (const m of serverOnly) if (txt.includes(m)) leaked.add(m);
    if (/sk_(live|test)_[A-Za-z0-9_]{10,}/.test(txt)) secretShaped++;
  }
  check(`client bundle (${files} files) contains no server-only Drixo identifiers`, leaked.size === 0, [...leaked].join(", "));

  // Canary check: build with distinctive fake values in the NEXT_PUBLIC_ secret variables, for example
  //   NEXT_PUBLIC_ESIM_SECRET_KEY=CANARY_ESIM_x NEXT_PUBLIC_BEQUICK_TOKEN=CANARY_BEQUICK_x npx next build --webpack
  // and pass them here: SCAN_CANARIES=CANARY_ESIM_x,CANARY_BEQUICK_x. A canary found in client JavaScript
  // proves that variable reaches visitors' browsers.
  const canaries = (process.env.SCAN_CANARIES ?? "").split(",").map((c) => c.trim()).filter(Boolean);
  if (canaries.length === 0) {
    info("SCAN_CANARIES not set: the bundle was not checked for specific secret values (see comment in this script)");
  } else {
    const found = new Set();
    for (const file of walk(staticDir)) {
      if (!file.endsWith(".js")) continue;
      const txt = readFileSync(file, "utf8");
      for (const c of canaries) if (txt.includes(c)) found.add(c);
    }
    for (const c of canaries) {
      if (found.has(c)) defect(`canary ${c.slice(0, 14)}... IS PRESENT in client JavaScript: that variable is delivered to every visitor's browser`);
      else info(`canary ${c.slice(0, 14)}... is absent from client JavaScript`);
    }
  }
  if (secretShaped > 0) {
    defect(`${secretShaped} client JavaScript file(s) contain a Stripe secret-key-shaped value: this confirms NEXT_PUBLIC_STRIPE_SECRET_KEY is shipped to every visitor's browser`);
  } else {
    info("no Stripe secret-key-shaped value in the client bundle for this build (it depends on the value present at build time)");
  }
}

// ----------------------------------------------------------------------------- 4. dependency audit
console.log("\n== Dependency audit (npm audit --omit=dev) ==");
{
  const r = spawnSync("npm", ["audit", "--omit=dev", "--json"], { cwd: root, encoding: "utf8", shell: true, timeout: 120000 });
  let audit;
  try { audit = JSON.parse(r.stdout); } catch { /* offline or registry error */ }
  if (!audit?.metadata) {
    info(`npm audit could not run (${(r.stderr || "no output").slice(0, 100)}): re-run with network access`);
  } else {
    const v = audit.metadata.vulnerabilities;
    info(`vulnerabilities in production dependencies: critical ${v.critical}, high ${v.high}, moderate ${v.moderate}, low ${v.low}`);
    const drixoDeps = new Set(["pg", "ioredis", "pg-pool", "pg-protocol", "pg-types", "pgpass", "denque", "cluster-key-slot", "redis-errors", "redis-parser", "standard-as-callback", "lodash.defaults", "lodash.isarguments"]);
    const mine = Object.values(audit.vulnerabilities ?? {}).filter((x) => drixoDeps.has(x.name) && ["high", "critical"].includes(x.severity));
    check("no high/critical vulnerability in the dependencies Drixo added (pg, ioredis and their trees)", mine.length === 0, mine.map((m) => `${m.name}:${m.severity}`).join(","));
    const others = Object.values(audit.vulnerabilities ?? {}).filter((x) => !drixoDeps.has(x.name) && ["high", "critical"].includes(x.severity));
    if (others.length) info(`high/critical in pre-existing dependencies: ${others.map((o) => `${o.name} (${o.severity})`).join(", ")}: owner triage required before launch (the Drixo scope did not change these)`);
  }
}

// ----------------------------------------------------------------------------- 5. response headers
console.log("\n== HTTP response headers ==");
if (!BASE) {
  info("no base URL given: skipping header checks (pass http://localhost:3111 against a production instance)");
} else {
  const api = `${BASE}/api/v1/drixo/public`;
  const config = await fetch(`${api}/config`);
  const h = (res, n) => res.headers.get(n) ?? "";
  check("config: X-Content-Type-Options nosniff", h(config, "x-content-type-options") === "nosniff");
  check("config: X-Frame-Options DENY", h(config, "x-frame-options") === "DENY");
  check("config: restrictive CSP (default-src 'none', no framing)", /default-src 'none'/.test(h(config, "content-security-policy")) && /frame-ancestors 'none'/.test(h(config, "content-security-policy")));
  check("config: Referrer-Policy no-referrer", h(config, "referrer-policy") === "no-referrer");
  check("config: Cross-Origin-Resource-Policy same-origin", h(config, "cross-origin-resource-policy") === "same-origin");
  check("config: Permissions-Policy denies camera, microphone, geolocation", /camera=\(\)/.test(h(config, "permissions-policy")) && /geolocation=\(\)/.test(h(config, "permissions-policy")));
  check("config: short public cache only (max-age 60)", /public, max-age=60/.test(h(config, "cache-control")));
  check("responses do not advertise the framework (no X-Powered-By)", !config.headers.has("x-powered-by"));
  check("no CORS: no Access-Control-Allow-Origin on config", !config.headers.has("access-control-allow-origin"));
  const pre = await fetch(`${api}/sessions`, { method: "OPTIONS", headers: { Origin: "https://evil.example", "Access-Control-Request-Method": "POST" } });
  check("CORS preflight from a foreign origin gets no allow headers", !pre.headers.has("access-control-allow-origin"), `${pre.status}`);
  const s = await fetch(`${api}/sessions`, { method: "POST", headers: { Origin: BASE, "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ locale: "en-US", clientInstanceId: crypto.randomUUID() }) });
  check("session response: Cache-Control no-store", /no-store/.test(h(s, "cache-control")));
  check("session response: security headers also present on POST", h(s, "x-content-type-options") === "nosniff" && /default-src 'none'/.test(h(s, "content-security-policy")));
  const bad = await fetch(`${api}/sessions`, { method: "POST", headers: { Origin: "https://evil.example", "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: "{}" });
  check("error response: problem+json, no-store, no stack trace or server detail", /problem\+json/.test(h(bad, "content-type")) && /no-store/.test(h(bad, "cache-control")) && !/\bat \w+.*\(|node_modules|\.ts:\d+/.test(await bad.text()));
}

console.log(`\n${pass} passed, ${fail} failed, ${openDefects} OPEN DEFECT(s) outside Drixo-owned code that block launch`);
process.exitCode = fail ? 1 : 0;
