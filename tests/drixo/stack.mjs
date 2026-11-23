// Test stack for Phase 6: Redis + Postgres (PGlite over the wire protocol) + N production BFF
// instances (`next start`). Used by ops-e2e.mjs and load.mjs; run directly to keep a stack up for
// manual checks or browser tests:
//
//   npx next build --webpack            (needs NEXT_PUBLIC_STRIPE_SECRET_KEY set to any value at build time:
//                                         the existing Stripe route reads it at import)
//   node tests/drixo/stack.mjs          (prints URLs; Ctrl+C stops everything)
//
// Production mode on purpose: it exercises the fail-closed paths that dev mode relaxes (Redis required,
// DRIXO_SESSION_SECRET required, strict Origin allowlist, Secure cookies, fault-injection hook ignored).

import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { spawn } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
export const root = join(here, "../..");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function waitFor(fn, { timeout = 60000, step = 300, label = "condition" } = {}) {
  const t0 = Date.now();
  for (;;) {
    try {
      if (await fn()) return;
    } catch {
      /* retry */
    }
    if (Date.now() - t0 > timeout) throw new Error(`timed out waiting for ${label}`);
    await sleep(step);
  }
}

function startRedis(port) {
  let proc;
  return {
    port,
    url: `redis://127.0.0.1:${port}`,
    async start() {
      proc = spawn("redis-server", ["--port", String(port), "--save", "", "--appendonly", "no", "--bind", "127.0.0.1"], { stdio: "ignore" });
      await waitFor(
        () =>
          new Promise((res) => {
            import("node:net").then(({ createConnection }) => {
              const s = createConnection({ port, host: "127.0.0.1" }, () => {
                s.destroy();
                res(true);
              });
              s.on("error", () => res(false));
            });
          }),
        { label: "redis" },
      );
    },
    async stop() {
      if (!proc) return;
      proc.kill();
      proc = undefined;
      await sleep(300);
    },
  };
}

async function startDb(port) {
  const db = new PGlite();
  for (const f of readdirSync(join(root, "db/migrations")).filter((x) => x.endsWith(".sql")).sort()) {
    await db.exec(readFileSync(join(root, "db/migrations", f), "utf8"));
  }
  let server;
  const api = {
    db,
    port,
    url: `postgres://postgres@127.0.0.1:${port}/postgres`,
    async start() {
      server = new PGLiteSocketServer({ db, port, host: "127.0.0.1", maxConnections: 12 });
      await server.start();
    },
    async stop() {
      await server?.stop();
      server = undefined;
    },
  };
  await api.start();
  return api;
}

function startApp(port, env, logs) {
  const proc = spawn(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "start", "-p", String(port)], {
    cwd: root,
    env: { ...process.env, NODE_ENV: "production", ...env },
  });
  const sink = (d) => String(d).split(/\r?\n/).filter(Boolean).forEach((l) => logs.push(l));
  proc.stdout.on("data", sink);
  proc.stderr.on("data", sink);
  return {
    port,
    base: `http://localhost:${port}`,
    proc,
    logs,
    async stop() {
      proc.kill();
      await sleep(300);
    },
  };
}

export async function startStack({ appPorts = [3111, 3112], redisPort = 6390, dbPort = 54329, env = {} } = {}) {
  const redis = startRedis(redisPort);
  await redis.start();
  const db = await startDb(dbPort);
  const origins = appPorts.map((p) => `http://localhost:${p}`).join(",");
  const sharedEnv = {
    DRIXO_API_ENABLED: "true",
    DRIXO_ENV: "staging",
    DRIXO_SESSION_SECRET: randomBytes(32).toString("hex"),
    DRIXO_ALLOWED_ORIGINS: origins,
    DRIXO_REDIS_URL: redis.url,
    DRIXO_DATABASE_URL: db.url,
    DRIXO_DB_POOL_MAX: "3",
    DRIXO_FLAG_TTL_MS: "500",
    DRIXO_SESSIONS_PER_IP_PER_MIN: "5000",
    DRIXO_REQUESTS_PER_IP_PER_MIN: "50000",
    DRIXO_TURNS_PER_SESSION_PER_MIN: "500",
    DRIXO_KB_BREAKER_THRESHOLD: "2",
    DRIXO_KB_BREAKER_COOLDOWN_MS: "4000",
    // Proves the test-only hook is ignored in production: KB answers must NOT slow down.
    DRIXO_FAULT_DELAY_BEFORE_RECHECK_MS: "1500",
    ...env,
  };
  const apps = appPorts.map((p) => startApp(p, sharedEnv, []));
  await Promise.all(
    apps.map((a) =>
      waitFor(async () => (await fetch(`${a.base}/robots.txt`)).ok, { timeout: 90000, label: `app :${a.port}` }),
    ),
  );
  return {
    redis,
    db,
    apps,
    env: sharedEnv,
    async stop() {
      await Promise.all(apps.map((a) => a.stop()));
      await db.stop().catch(() => undefined);
      await db.db.close().catch(() => undefined);
      await redis.stop();
    },
  };
}

// Direct run: keep a stack up until Ctrl+C.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const s = await startStack();
  console.log(`stack up:\n  apps   ${s.apps.map((a) => a.base).join("  ")}\n  redis  ${s.redis.url}\n  db     ${s.db.url}`);
  const bye = async () => {
    await s.stop();
    process.exit(0);
  };
  process.on("SIGINT", bye);
  process.on("SIGTERM", bye);
  await new Promise(() => {});
}
