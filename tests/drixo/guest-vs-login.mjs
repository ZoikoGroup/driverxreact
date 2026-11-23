// End-to-end walkthrough of the Drixo widget in a real browser, run twice: as a GUEST and as a visitor who is
// SIGNED IN to the website. P0 rule: Drixo is guest-only. A site login must change nothing about the chatbot:
// no identity sent to the API, no account data in answers, billing/usage questions still gated to sign-in.
//
//   node tests/drixo/guest-vs-login.mjs        (self-contained: starts Redis + Postgres + one production instance,
//                                               approves the draft KB articles as FIXTURES, runs, stops)
//
// "Signed in" is SIMULATED: the site keeps its login in localStorage (driverx_token, driverx_user) and a cookie.
// This script plants fake values there; it never uses a real account. It proves the chatbot ignores them.

import puppeteer from "puppeteer-core";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { startStack, root } from "./stack.mjs";

const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const executablePath = CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.error("No Chrome/Edge found. Set CHROME_PATH.");
  process.exit(2);
}

let pass = 0;
let fail = 0;
const check = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : `  ${extra}`}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const LAUNCHER = 'button[aria-label="Open Drixo AI assistant"]';
const DIALOG = '[role="dialog"]';

const FAKE_TOKEN = "fake-login-token-SENTINEL-8f3a1c";
const FAKE_EMAIL = "sentinel.user@example.test";
const FAKE_USER = JSON.stringify({ id: 4242, name: "Sentinel User", email: FAKE_EMAIL });

const stack = await startStack({ appPorts: [3121], redisPort: 6395, dbPort: 54335, env: { DRIXO_FAULT_DELAY_BEFORE_RECHECK_MS: "0" } });
const base = stack.apps[0].base;

function cli(script, args) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [join(root, "scripts", script), ...args], {
      env: { ...process.env, DRIXO_PUBLISHER_DATABASE_URL: stack.db.url, DRIXO_OPS_DATABASE_URL: stack.db.url },
    });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("close", (code) => resolve({ code, out }));
  });
}

const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });

async function newPage(path, mode) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  const drixoReqs = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/v1/drixo/")) drixoReqs.push({ url: r.url(), method: r.method(), headers: r.headers(), body: r.postData() ?? "" });
  });
  if (mode === "signed-in") {
    await page.evaluateOnNewDocument((t, u) => {
      localStorage.setItem("driverx_token", t);
      localStorage.setItem("driverx_user", u);
    }, FAKE_TOKEN, FAKE_USER);
    await page.setCookie({ name: "driverx_token", value: FAKE_TOKEN, url: base });
  }
  await page.goto(`${base}${path}`, { waitUntil: "networkidle2", timeout: 120000 });
  await sleep(2500);
  return { page, ctx, drixoReqs };
}
async function openChat(page) {
  for (let i = 0; i < 20 && !(await page.$(DIALOG)); i++) {
    await page.click(LAUNCHER).catch(() => {});
    await sleep(700);
  }
  await page.waitForSelector(`${DIALOG} textarea`, { timeout: 30000 });
}
const dialogText = (page) => page.evaluate(() => document.querySelector('[role="dialog"]').innerText);
const waitText = (page, t) => page.waitForFunction((x) => document.querySelector('[role="dialog"]')?.innerText.includes(x), { timeout: 30000 }, t);
async function clickText(page, text, selector = "button") {
  const ok = await page.evaluate((t, sel) => {
    const el = [...document.querySelectorAll(`[role="dialog"] ${sel}`)].find((b) => (b.innerText || b.getAttribute("aria-label") || "").trim().startsWith(t));
    if (!el) return false;
    el.click();
    return true;
  }, text, selector);
  return ok;
}
async function ask(page, text) {
  const before = (await dialogText(page)).length;
  await page.type(`${DIALOG} textarea`, text);
  await page.keyboard.press("Enter");
  await page.waitForFunction((n) => document.querySelector('[role="dialog"]').innerText.length > n + text.length - 5 && !document.querySelector('[role="dialog"]').innerText.endsWith("..."), { timeout: 30000 }, before).catch(() => {});
  await sleep(1500);
  return dialogText(page);
}
const hrefs = (page) => page.evaluate(() => [...document.querySelectorAll('[role="dialog"] a')].map((a) => a.getAttribute("href")));

async function scenario(mode) {
  const tag = `[${mode}]`;
  console.log(`\n================ ${mode.toUpperCase()} ================`);

  // ---------------------------------------------------------------- launcher and shell
  {
    const { page, ctx, drixoReqs } = await newPage("/faqs-self-service", mode);
    check(`${tag} launcher is present on an ordinary page`, !!(await page.$(LAUNCHER)));
    if (mode === "signed-in") {
      const ls = await page.evaluate(() => localStorage.getItem("driverx_token"));
      check(`${tag} (setup) the simulated login is really in the page`, ls === FAKE_TOKEN);
    }
    await openChat(page);
    const t0 = await dialogText(page);
    check(`${tag} header shows Drixo / Your DriverX Copilot`, /Drixo/.test(t0) && /Your DriverX Copilot/.test(t0));
    check(`${tag} parked-only safety notice is shown`, /parked/i.test(t0));
    check(`${tag} no live-agent or 24/7 availability claim in the shell`, !/live agent|24\/7|24-7|speak to a human now/i.test(t0), t0.slice(0, 200));
    const labels = await page.evaluate(() => [...document.querySelectorAll('[role="dialog"] ul[aria-label="What can I help with?"] button')].map((b) => b.innerText.split("\n")[0].trim()));
    check(`${tag} exactly six shortcuts`, labels.length === 6, JSON.stringify(labels));

    // header controls after the clean-up: expand, more options, close. No minimize.
    const header = await page.evaluate(() => [...document.querySelectorAll('[role="dialog"] header button')].map((b) => b.getAttribute("aria-label")));
    check(`${tag} header has Expand, More options, Close (no duplicate Minimize)`, JSON.stringify(header) === JSON.stringify(["Expand chat window", "More options", "Close chat"]), JSON.stringify(header));
    await page.click('[role="dialog"] button[aria-label="More options"]');
    await sleep(300);
    const items = await page.evaluate(() => [...document.querySelectorAll('[role="menu"] [role="menuitem"]')].map((b) => b.innerText.trim()));
    check(`${tag} ⋮ menu lists New chat, Chat history, theme toggle`, items.length === 3 && items[0] === "New chat" && items[1] === "Chat history" && /mode$/.test(items[2]), JSON.stringify(items));
    await page.keyboard.press("Escape");
    await sleep(300);
    check(`${tag} Escape closes the menu but keeps the chat open`, !(await page.$('[role="menu"]')) && !!(await page.$(DIALOG)));
    // expand / shrink
    const w0 = await page.evaluate(() => document.querySelector('[role="dialog"]').getBoundingClientRect().width);
    await page.click('[role="dialog"] button[aria-label="Expand chat window"]');
    await sleep(500);
    const w1 = await page.evaluate(() => document.querySelector('[role="dialog"]').getBoundingClientRect().width);
    check(`${tag} Expand widens the window (${Math.round(w0)}px to ${Math.round(w1)}px)`, w1 > w0);
    await page.click('[role="dialog"] button[aria-label="Shrink chat window"]');
    await sleep(400);
    // theme via menu
    const bg0 = await page.evaluate(() => getComputedStyle(document.querySelector('[role="dialog"]')).backgroundColor);
    await page.click('[role="dialog"] button[aria-label="More options"]');
    await clickText(page, "Switch to", '[role="menuitem"]');
    await sleep(400);
    const bg1 = await page.evaluate(() => getComputedStyle(document.querySelector('[role="dialog"]')).backgroundColor);
    check(`${tag} theme toggle from the ⋮ menu changes the panel colours and closes the menu`, bg0 !== bg1 && !(await page.$('[role="menu"]')), `${bg0} -> ${bg1}`);
    await page.click('[role="dialog"] button[aria-label="More options"]');
    await clickText(page, "Switch to", '[role="menuitem"]');
    await sleep(300);

    // ---------------------------------------------------------------- shortcut flow (connection triage)
    await clickText(page, "Fix my connection");
    await waitText(page, "?").catch(() => {});
    await sleep(1500);
    const t1 = await dialogText(page);
    check(`${tag} FIX_CONNECTION shortcut answers with a guided question`, t1.length > t0.length + 40, t1.slice(-200));
    check(`${tag} troubleshooting makes no outage / network-status claim`, !/there (is|was) an outage|network is down|we are experiencing/i.test(t1));
    const qr = await page.evaluate(() => [...document.querySelectorAll('[role="group"][aria-label="Quick replies"] button')].map((b) => b.innerText.trim()));
    check(`${tag} quick replies are offered`, qr.length >= 2, JSON.stringify(qr));
    if (qr.length) {
      await clickText(page, qr[0]);
      await sleep(1800);
      const t2 = await dialogText(page);
      check(`${tag} tapping a quick reply advances the flow`, t2.length > t1.length + 30);
    }

    // ---------------------------------------------------------------- free-text turns
    let t = await ask(page, "What is DriverX Mobile?");
    check(`${tag} approved-KB question gets a cited answer (wireless service) not an invention`, /wireless/i.test(t) && (await hrefs(page)).length > 0, t.slice(-250));

    t = await ask(page, "how much is the unlimited plan?");
    const tail = t.slice(-400);
    check(`${tag} price question is not answered with a price (no source, official link)`, !/\$\s?\d/.test(tail), tail);

    t = await ask(page, "what is my bill this month?");
    const h = await hrefs(page);
    check(`${tag} billing question is gated to sign-in (AUTH_GATE), even when signed in`, /sign in|signed in|securely/i.test(t.slice(-500)) && h.includes("/login"), `${t.slice(-300)} ${JSON.stringify(h)}`);
    check(`${tag} the answer shows no account data (no email, name or token)`, !t.includes(FAKE_EMAIL) && !t.includes("Sentinel") && !t.includes(FAKE_TOKEN));

    t = await ask(page, "I was in an accident");
    check(`${tag} emergency message tells the visitor to stop safely and call emergency services`, /911|emergency/i.test(t.slice(-500)));

    t = await ask(page, "my password is Hunter2Secret!");
    check(`${tag} pasted secret triggers a warning`, /(don't|do not|never|please don't).{0,80}(share|send|type|enter)|sensitive|secret/i.test(t.slice(-500)), t.slice(-300));

    // ---------------------------------------------------------------- feedback
    const rated = await clickText(page, "Yes");
    await sleep(800);
    check(`${tag} "Was this helpful?" vote is accepted`, rated && /Thanks for the feedback/.test(await dialogText(page)));

    // ---------------------------------------------------------------- history, new chat, close
    await page.click('[role="dialog"] button[aria-label="More options"]');
    await clickText(page, "Chat history", '[role="menuitem"]');
    await sleep(600);
    check(`${tag} Chat history opens from the ⋮ menu`, /history/i.test(await dialogText(page)));
    await page.keyboard.press("Escape");
    await sleep(300);
    await page.click('[role="dialog"] button[aria-label="More options"]');
    await clickText(page, "New chat", '[role="menuitem"]');
    await sleep(1200);
    const fresh = await dialogText(page);
    check(`${tag} New chat starts over (shortcuts shown again)`, /Fix my connection/.test(fresh) && !/Hunter2/.test(fresh));
    await page.click('[role="dialog"] button[aria-label="Close chat"]');
    await sleep(800);
    check(`${tag} ✕ closes the panel and the launcher returns`, !(await page.$(DIALOG)) && !!(await page.$(LAUNCHER)));

    // ---------------------------------------------------------------- what went over the wire
    const calls = drixoReqs.filter((r) => r.url.includes("/api/v1/drixo/public"));
    const onlyFive = calls.every((r) => /\/public\/(config|sessions(\/[^/]+\/(turns|feedback|end))?)$/.test(new URL(r.url).pathname));
    check(`${tag} the widget only calls the five Drixo endpoints (${calls.length} requests)`, calls.length > 0 && onlyFive, JSON.stringify([...new Set(calls.map((r) => new URL(r.url).pathname))]));
    const wire = JSON.stringify(calls.map((r) => ({ h: { ...r.headers, cookie: undefined }, b: r.body })));
    check(`${tag} no login token, email or Authorization header in any Drixo request`, !wire.includes(FAKE_TOKEN) && !wire.includes(FAKE_EMAIL) && !/authorization/i.test(Object.keys(Object.assign({}, ...calls.map((r) => r.headers))).join(",")));
    const clientCookies = await page.cookies();
    const drixoCookie = clientCookies.find((c) => /drixo/i.test(c.name));
    check(`${tag} no JS-readable Drixo session cookie (HttpOnly or absent)`, !drixoCookie || drixoCookie.httpOnly === true, JSON.stringify(drixoCookie));
    await ctx.close();
  }

  // ---------------------------------------------------------------- pages where the launcher must not appear
  for (const path of ["/login", "/register", "/checkout"]) {
    const { page, ctx } = await newPage(path, mode);
    // A signed-in visitor is redirected away from /login and /register by the site itself. The rule is about the
    // page the visitor actually sees, so judge the landing page and say so.
    const landed = new URL(page.url()).pathname;
    const suppressed = ["/checkout", "/login", "/register", "/forgot-password", "/reset-password", "/dashboard/billing-payment", "/cookie-preferences-opt-out"].some((p) => landed.startsWith(p));
    const note = landed === path ? "" : ` (site redirected to ${landed})`;
    check(`${tag} launcher ${suppressed ? "hidden" : "allowed"} on ${path}${note}`, suppressed ? !(await page.$(LAUNCHER)) : true);
    await ctx.close();
  }
  {
    const { page, ctx } = await newPage("/", mode);
    check(`${tag} launcher present on the home page`, !!(await page.$(LAUNCHER)));
    await ctx.close();
  }
}

// -------------------------------------------------------------------- server side: a site login is ignored
async function serverSideLoginIgnored() {
  console.log("\n================ API: site login is ignored ================");
  const API = `${base}/api/v1/drixo/public`;
  const run = async (extra) => {
    const h = { Origin: base, "Content-Type": "application/json", "Idempotency-Key": randomUUID(), ...extra };
    const s = await fetch(`${API}/sessions`, { method: "POST", headers: h, body: JSON.stringify({ locale: "en-US", clientInstanceId: randomUUID() }) });
    const sj = await s.json();
    const cookie = [(s.headers.getSetCookie?.() ?? [])[0]?.split(";")[0], extra.Cookie].filter(Boolean).join("; ");
    const t = await fetch(`${API}/sessions/${sj.sessionId}/turns`, {
      method: "POST",
      headers: { Origin: base, "Content-Type": "application/json", "Idempotency-Key": randomUUID(), "X-Drixo-CSRF": sj.csrfToken, Cookie: cookie, ...(extra.Authorization ? { Authorization: extra.Authorization } : {}) },
      body: JSON.stringify({ clientRequestId: randomUUID(), contextVersion: 0, input: { type: "TEXT", text: "what is my bill this month?" } }),
    });
    return { s: sj, status: t.status, body: await t.json() };
  };
  const anon = await run({});
  const authed = await run({ Cookie: `driverx_token=${FAKE_TOKEN}`, Authorization: `Bearer ${FAKE_TOKEN}` });
  check("session response carries no identity field (guest only)", !/email|userId|accountId|customer/i.test(JSON.stringify(authed.s)), JSON.stringify(authed.s));
  check("billing question with a login cookie + bearer token is still AUTH_GATE", authed.body?.result?.responseClass === "AUTH_GATE", JSON.stringify(authed.body).slice(0, 300));
  check("response with login is the same class as without", authed.body?.result?.responseClass === anon.body?.result?.responseClass);
  check("login token / email never echoed back", !JSON.stringify(authed).includes(FAKE_TOKEN) && !JSON.stringify(authed).includes(FAKE_EMAIL));
}

try {
  // Approve the draft articles as TEST FIXTURES (not editorial approval) so knowledge answers can be exercised.
  await cli("drixo-kb.mjs", ["seed-drafts", "--actor", "importer"]);
  await cli("drixo-kb.mjs", ["activate-source", "S01", "--actor", "editor"]);
  const from = new Date(Date.now() - 3600_000).toISOString();
  for (const code of ["KB-001@1"]) {
    await cli("drixo-kb.mjs", ["submit", code, "--actor", "editor"]);
    await cli("drixo-kb.mjs", ["approve", code, "--actor", "approver", "--from", from]);
  }
  await cli("drixo-ops.mjs", ["rollout", "100", "--actor", "ops", "--reason", "CANARY_PROMOTE"]);
  await sleep(1500);

  await scenario("guest");
  await scenario("signed-in");
  await serverSideLoginIgnored();
} catch (e) {
  fail++;
  console.log(`FAIL  harness error: ${e.stack || e}`);
} finally {
  await browser.close().catch(() => undefined);
  await stack.stop().catch(() => undefined);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
setTimeout(() => process.exit(process.exitCode), 300);
