#!/usr/bin/env node
// Drixo knowledge publisher CLI (DX-PUBLISH). INTERNAL TOOL: never exposed over HTTP, never run by
// the public BFF. Publication rules are enforced inside Postgres (db/migrations/001), this script
// only calls the guarded functions with a named human actor.
//
// Connection strings come from the environment (never put credentials on the command line):
//   DRIXO_MIGRATE_DATABASE_URL    schema owner, used only by `migrate`
//   DRIXO_PUBLISHER_DATABASE_URL  member of drixo_publisher, used by every other command
//
//   node scripts/drixo-kb.mjs migrate
//   node scripts/drixo-kb.mjs seed-drafts --actor alice                 # imports db/seed/kb-draft.json as DRAFT
//   node scripts/drixo-kb.mjs activate-source S01 --actor alice
//   node scripts/drixo-kb.mjs submit  KB-006@1 --actor alice
//   node scripts/drixo-kb.mjs approve KB-006@1 --actor bob --from 2026-12-01T00:00:00Z [--until ISO]
//   node scripts/drixo-kb.mjs revoke  KB-006@1 --actor carol --reason WITHDRAWN_BY_OWNER
//   node scripts/drixo-kb.mjs conflict-open|conflict-resolve KB-006@1 --actor dave --reason SOURCES_DISAGREE
//   node scripts/drixo-kb.mjs status
//
// Approval is four-eyes: the approver must differ from the submitter. Seeded content is DRAFT and
// stays invisible to the public assistant until a human approves it (D-03).

import pg from "pg";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [cmd, ...rest] = process.argv.slice(2);

function flags(args) {
  const out = { _: [] };
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) out[args[i].slice(2)] = args[++i];
    else out._.push(args[i]);
  }
  return out;
}
const f = flags(rest);

function die(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

function client(envName) {
  const url = process.env[envName];
  if (!url) die(`${envName} is not set`);
  return new pg.Client({ connectionString: url, application_name: "drixo-kb-cli" });
}

const needActor = () => f.actor || die("--actor <person> is required (who is making this change)");
const REASON = /^[A-Z0-9_]{2,64}$/;

async function revisionId(c, code) {
  const r = await c.query("select revision_id, status from drixo.kb_revision where revision_code = $1", [code]);
  if (r.rowCount === 0) die(`unknown revision ${code}`);
  if (r.rowCount > 1) die(`revision code ${code} is ambiguous across sources`);
  return r.rows[0].revision_id;
}

async function main() {
  if (!cmd) die("command required: migrate | seed-drafts | activate-source | submit | approve | revoke | conflict-open | conflict-resolve | status");

  if (cmd === "migrate") {
    const c = client("DRIXO_MIGRATE_DATABASE_URL");
    await c.connect();
    await c.query("create table if not exists public.drixo_migrations (name text primary key, applied_at timestamptz not null default now())");
    const done = new Set((await c.query("select name from public.drixo_migrations")).rows.map((r) => r.name));
    const dir = join(root, "db/migrations");
    for (const file of readdirSync(dir).filter((x) => x.endsWith(".sql")).sort()) {
      if (done.has(file)) continue;
      console.log(`applying ${file}`);
      await c.query("begin");
      try {
        await c.query(readFileSync(join(dir, file), "utf8"));
        await c.query("insert into public.drixo_migrations (name) values ($1)", [file]);
        await c.query("commit");
      } catch (e) {
        await c.query("rollback");
        die(`${file} failed and was rolled back: ${e.message}`);
      }
    }
    console.log("migrations up to date");
    return c.end();
  }

  const c = client("DRIXO_PUBLISHER_DATABASE_URL");
  await c.connect();
  try {
    switch (cmd) {
      case "seed-drafts": {
        const actor = needActor();
        const seed = JSON.parse(readFileSync(join(root, "db/seed/kb-draft.json"), "utf8"));
        let srcs = 0;
        let revs = 0;
        for (const s of seed.sources) {
          const have = await c.query("select 1 from drixo.kb_source where source_key = $1", [s.key]);
          if (have.rowCount) continue;
          // CANDIDATE only: activate-source is a separate, allowlist-checked human step.
          await c.query("select drixo.register_source($1,$2,$3,'Public site','Content (owner TBD, D-03)',$4)", [s.key, s.url, s.title, actor]);
          srcs++;
        }
        for (const a of seed.articles) {
          const code = `${a.code}@1`;
          const have = await c.query("select 1 from drixo.kb_revision where revision_code = $1", [code]);
          if (have.rowCount) continue;
          const aliases = [a.title, ...(a.userMightAsk ?? [])].join(". ");
          await c.query("select drixo.add_draft_revision($1,$2,$3,$4,$5)", [a.sources[0], code, a.answer, aliases, actor]);
          revs++;
        }
        console.log(`registered ${srcs} sources (CANDIDATE), imported ${revs} DRAFT revisions. Nothing is public yet.`);
        break;
      }
      case "activate-source": {
        const key = f._[0] || die("source key required");
        await c.query("select drixo.activate_source($1,$2)", [key, needActor()]);
        console.log(`source ${key} ACTIVE`);
        break;
      }
      case "submit": {
        const id = await revisionId(c, f._[0] || die("revision code required"));
        await c.query("select drixo.submit_revision($1,$2)", [id, needActor()]);
        console.log(`${f._[0]} IN_REVIEW`);
        break;
      }
      case "approve": {
        const id = await revisionId(c, f._[0] || die("revision code required"));
        if (!f.from) die("--from <ISO timestamp> (effective_from) is required");
        await c.query("select drixo.approve_revision($1,$2,$3::timestamptz,$4::timestamptz)", [id, needActor(), f.from, f.until ?? null]);
        console.log(`${f._[0]} APPROVED effective ${f.from}${f.until ? ` until ${f.until}` : ""}`);
        break;
      }
      case "revoke": {
        const id = await revisionId(c, f._[0] || die("revision code required"));
        const reason = f.reason || die("--reason <CODE> required (controlled code, e.g. WITHDRAWN_BY_OWNER)");
        if (!REASON.test(reason)) die("--reason must match [A-Z0-9_]{2,64}");
        await c.query("select drixo.revoke_revision($1,$2,$3)", [id, needActor(), reason]);
        console.log(`${f._[0]} REVOKED (effective on the very next read; no cache to purge)`);
        break;
      }
      case "conflict-open":
      case "conflict-resolve": {
        const id = await revisionId(c, f._[0] || die("revision code required"));
        const reason = f.reason || die("--reason <CODE> required");
        if (!REASON.test(reason)) die("--reason must match [A-Z0-9_]{2,64}");
        await c.query(`select drixo.${cmd === "conflict-open" ? "open_conflict" : "resolve_conflict"}($1,$2,$3)`, [id, needActor(), reason]);
        console.log(`${f._[0]} ${cmd === "conflict-open" ? "conflict OPEN (suppressed)" : "conflict resolved"}`);
        break;
      }
      case "status": {
        const r = await c.query(
          "select status, count(*)::int n from drixo.kb_revision group by status order by status",
        );
        const v = await c.query("select count(distinct revision_id)::int n from drixo.approved_public_chunks");
        console.table(r.rows);
        console.log(`publicly retrievable right now: ${v.rows[0].n} revision(s)`);
        break;
      }
      default:
        die(`unknown command ${cmd}`);
    }
  } catch (e) {
    die(e.message);
  } finally {
    await c.end();
  }
}

main().catch((e) => die(e.message));
