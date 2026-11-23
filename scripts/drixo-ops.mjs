#!/usr/bin/env node
// Drixo operations CLI: kill switches, canary rollout, retention purge. INTERNAL TOOL: never exposed
// over HTTP. Every change is written to drixo.flag_audit with a named actor and a controlled reason
// code. Changes take effect on every BFF instance within DRIXO_FLAG_TTL_MS (default 5s), no deploy.
//
// Connection strings come from the environment, never the command line:
//   DRIXO_OPS_DATABASE_URL        member of drixo_ops  (flags / audit)
//   DRIXO_RETENTION_DATABASE_URL  member of drixo_retention (purge)
//   DRIXO_METRICS_DATABASE_URL    member of drixo_metrics (daily aggregation)
//
//   node scripts/drixo-ops.mjs flags
//   node scripts/drixo-ops.mjs rollout 5   --actor alice --reason CANARY_START      # show launcher to 5%
//   node scripts/drixo-ops.mjs rollout 100 --actor alice --reason CANARY_PROMOTE
//   node scripts/drixo-ops.mjs kill        --actor alice --reason INCIDENT_PRIVATE_DATA   # assistant -> 503, widget hides
//   node scripts/drixo-ops.mjs restore     --actor alice --reason INCIDENT_RESOLVED [--percent 5]
//   node scripts/drixo-ops.mjs kb-off      --actor alice --reason UNAPPROVED_PRICE_CLAIM  # force NO_SOURCE
//   node scripts/drixo-ops.mjs kb-on       --actor alice --reason CONTENT_FIXED
//   node scripts/drixo-ops.mjs model-off   --actor alice --reason INCIDENT_BAD_ANSWER   # stop AI-written answers
//   node scripts/drixo-ops.mjs model-on    --actor alice --reason CANARY_MODEL            # allow them (also needs env gate + key)
//   node scripts/drixo-ops.mjs audit [--limit 20]
//   node scripts/drixo-ops.mjs metrics     [--day 2026-11-19]                       # aggregate a day (needs drixo_metrics)
//   node scripts/drixo-ops.mjs purge       --actor retention-job                  # needs APPROVED retention policy (D-04)

import pg from "pg";

const [cmd, ...rest] = process.argv.slice(2);
const f = { _: [] };
for (let i = 0; i < rest.length; i++) {
  if (rest[i].startsWith("--")) f[rest[i].slice(2)] = rest[++i];
  else f._.push(rest[i]);
}

const die = (m) => {
  console.error(`error: ${m}`);
  process.exit(1);
};
const REASON = /^[A-Z0-9_]{2,64}$/;

function client(envName) {
  const url = process.env[envName];
  if (!url) die(`${envName} is not set`);
  return new pg.Client({ connectionString: url, application_name: "drixo-ops-cli" });
}
const actor = () => f.actor || die("--actor <person> is required");
const reason = () => {
  const r = f.reason || die("--reason <CODE> is required (e.g. INCIDENT_PRIVATE_DATA)");
  if (!REASON.test(r)) die("--reason must match [A-Z0-9_]{2,64} (controlled code, not free text)");
  return r;
};

async function current(c, flag) {
  const r = await c.query("select enabled, rollout_percent from drixo.runtime_flag where flag = $1", [flag]);
  if (!r.rowCount) die(`unknown flag ${flag}`);
  return r.rows[0];
}

async function main() {
  if (!cmd) die("command required: flags | rollout | kill | restore | kb-off | kb-on | model-off | model-on | audit | metrics | purge");

  if (cmd === "metrics") {
    // Aggregate one UTC day of turn classifications into daily_metric (default: yesterday). Idempotent.
    const c = client("DRIXO_METRICS_DATABASE_URL");
    await c.connect();
    try {
      const day = f.day || new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) die("--day must be YYYY-MM-DD");
      const r = await c.query("select drixo.refresh_daily_metric($1::date) as cells", [day]);
      console.log(`aggregated ${day}: ${r.rows[0].cells} cell(s). Dashboards read daily_metric_reportable (cells under 5 are hidden).`);
    } catch (e) {
      die(e.message);
    } finally {
      await c.end();
    }
    return;
  }

  if (cmd === "purge") {
    const c = client("DRIXO_RETENTION_DATABASE_URL");
    await c.connect();
    try {
      const r = await c.query("select drixo.purge_expired_sessions($1) as purged", [actor()]);
      console.log(`purged ${r.rows[0].purged} expired guest session(s) (turns, citations and feedback cascade)`);
    } catch (e) {
      die(e.message); // e.g. retention policy not approved: the worker refuses rather than guess
    } finally {
      await c.end();
    }
    return;
  }

  const c = client("DRIXO_OPS_DATABASE_URL");
  await c.connect();
  try {
    switch (cmd) {
      case "flags": {
        const r = await c.query("select flag, enabled, rollout_percent, changed_by, changed_at, reason_code from drixo.runtime_flag order by flag");
        console.table(r.rows);
        break;
      }
      case "rollout": {
        const pct = Number(f._[0]);
        if (!Number.isInteger(pct) || pct < 0 || pct > 100) die("rollout <percent 0-100>");
        const cur = await current(c, "ASSISTANT");
        await c.query("select drixo.set_flag('ASSISTANT', $1, $2, $3, $4)", [cur.enabled, pct, actor(), reason()]);
        console.log(`ASSISTANT rollout ${cur.rollout_percent}% -> ${pct}% (visible within ~5s on every instance)`);
        break;
      }
      case "kill": {
        const cur = await current(c, "ASSISTANT");
        await c.query("select drixo.set_flag('ASSISTANT', false, $1, $2, $3)", [cur.rollout_percent, actor(), reason()]);
        console.log("ASSISTANT disabled: all routes answer 503, the widget hides itself, the site is unaffected");
        break;
      }
      case "restore": {
        const cur = await current(c, "ASSISTANT");
        const pct = f.percent === undefined ? cur.rollout_percent : Number(f.percent);
        if (!Number.isInteger(pct) || pct < 0 || pct > 100) die("--percent must be 0-100");
        await c.query("select drixo.set_flag('ASSISTANT', true, $1, $2, $3)", [pct, actor(), reason()]);
        console.log(`ASSISTANT enabled at ${pct}%`);
        break;
      }
      case "kb-off":
      case "kb-on": {
        await c.query("select drixo.set_flag('KB_RETRIEVAL', $1, 100, $2, $3)", [cmd === "kb-on", actor(), reason()]);
        console.log(cmd === "kb-off" ? "KB_RETRIEVAL off: factual questions answer NO_SOURCE (flows and safety unaffected)" : "KB_RETRIEVAL on");
        break;
      }
      case "model-off":
      case "model-on": {
        await c.query("select drixo.set_flag('MODEL_SYNTHESIS', $1, 100, $2, $3)", [cmd === "model-on", actor(), reason()]);
        console.log(
          cmd === "model-on"
            ? "MODEL_SYNTHESIS on (only takes effect where the server also has DRIXO_MODEL_ENABLED=true and a provider key)"
            : "MODEL_SYNTHESIS off: answers are served from approved article text only; no visitor text goes to the provider",
        );
        break;
      }
      case "audit": {
        const r = await c.query("select created_at, flag, enabled, rollout_percent, actor_ref, reason_code from drixo.flag_audit order by created_at desc limit $1", [Number(f.limit) || 20]);
        console.table(r.rows);
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
