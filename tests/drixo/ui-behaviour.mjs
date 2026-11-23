// Browser tests for Drixo widget behaviour added to close the P0 gaps (PRD PR-001, PR-023, PR-026; FRS FR-001,
// FR-011, FR-014, FR-065, WF-09). Run against a server with the widget enabled and the assistant at 100%.
//
//   node tests/drixo/ui-behaviour.mjs http://localhost:3111      (cert-run.mjs does this for you)
//   (set CHROME_PATH if Chrome/Edge is not found)

import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const BASE = (process.argv[2] ?? "http://localhost:3111").replace(/\/$/, "");
const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
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

const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });

async function newPage(path, { track = false } = {}) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  // Deterministic measurements: motion is decoration and is switched off for visitors who ask for less of it.
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  if (track) {
    await page.evaluateOnNewDocument(() => {
      window.__dx = [];
      window.dataLayer = [];
      window.addEventListener("dx_drixo", (e) => window.__dx.push(e.detail));
    });
  }
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle2", timeout: 120000 });
  await sleep(2500); // hydration + config fetch
  return { page, ctx };
}
async function openChat(page) {
  for (let i = 0; i < 20 && !(await page.$(DIALOG)); i++) {
    await page.click(LAUNCHER).catch(() => {});
    await sleep(700);
  }
  await page.waitForSelector(`${DIALOG} textarea`, { timeout: 30000 });
}
const waitText = (page, t) => page.waitForFunction((x) => document.querySelector('[role="dialog"]')?.innerText.includes(x), { timeout: 30000 }, t);
async function ask(page, text) {
  await page.type(`${DIALOG} textarea`, text);
  await page.keyboard.press("Enter");
}
const dialogText = (page) => page.evaluate(() => document.querySelector('[role="dialog"]').innerText);
async function setComposer(page, value) {
  // Set through the native setter so React sees an input event (like a paste).
  await page.evaluate((v) => {
    const el = document.querySelector('[role="dialog"] textarea');
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set;
    setter.call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}

try {
  // ================================================================== suppression (PR-001 / FR-001)
  console.log("\n== Launcher is suppressed on checkout, payment, sign-in and consent pages ==");
  for (const path of ["/checkout", "/login", "/register", "/forgot-password", "/cookie-preferences-opt-out"]) {
    const { page, ctx } = await newPage(path);
    check(`no launcher on ${path}`, !(await page.$(LAUNCHER)));
    await ctx.close();
  }
  {
    const { page, ctx } = await newPage("/faqs-self-service");
    check("launcher still present on an ordinary page", !!(await page.$(LAUNCHER)));
    await ctx.close();
  }

  // ================================================================== oversized input (FR-014)
  console.log("\n== Message length ==");
  {
    const { page, ctx } = await newPage("/faqs-self-service");
    await openChat(page);
    await setComposer(page, "a".repeat(2100));
    await waitText(page, "too long");
    const info = await page.evaluate(() => {
      const ta = document.querySelector('[role="dialog"] textarea');
      const send = document.querySelector('[role="dialog"] button[aria-label="Send message"]');
      const err = document.querySelector('[role="dialog"] [role="alert"]');
      return { len: ta.value.length, invalid: ta.getAttribute("aria-invalid"), described: ta.getAttribute("aria-describedby"), sendDisabled: send.disabled, errId: err?.id, errText: err?.textContent };
    });
    check("over 2000 characters: an accessible error is shown (role=alert, linked with aria-describedby)", info.errText?.includes("2100 of 2000") && info.described === info.errId && info.invalid === "true", JSON.stringify(info));
    check("the text is NOT silently cut (all 2100 characters remain for the visitor to edit)", info.len === 2100);
    check("Send is disabled while the message is too long", info.sendDisabled === true);
    await page.keyboard.press("Enter");
    await sleep(500);
    check("pressing Enter does not send an over-long message", !(await dialogText(page)).includes("aaaaaaaaaa"));
    await setComposer(page, "short question");
    await sleep(300);
    check("shortening the message clears the error and re-enables Send", await page.evaluate(() => !document.querySelector('[role="dialog"] [role="alert"]') && !document.querySelector('[role="dialog"] button[aria-label="Send message"]').disabled));
    await ctx.close();
  }

  // ================================================================== offline (WF-09)
  console.log("\n== Offline ==");
  {
    const { page, ctx } = await newPage("/faqs-self-service");
    await openChat(page);
    await page.type(`${DIALOG} textarea`, "my draft stays here");
    await page.setOfflineMode(true);
    await page.evaluate(() => window.dispatchEvent(new Event("offline")));
    await waitText(page, "You appear to be offline");
    check("offline: a status message appears and Send is disabled", await page.evaluate(() => document.querySelector('[role="dialog"] button[aria-label="Send message"]').disabled && !!document.querySelector('[role="dialog"] [role="status"]')));
    check("offline: the draft is kept in the composer, nothing is queued silently", await page.evaluate(() => document.querySelector('[role="dialog"] textarea').value === "my draft stays here"));
    await page.setOfflineMode(false);
    await page.evaluate(() => window.dispatchEvent(new Event("online")));
    await sleep(500);
    check("back online: the message disappears and Send works again", await page.evaluate(() => !document.querySelector('[role="dialog"]').innerText.includes("You appear to be offline") && !document.querySelector('[role="dialog"] button[aria-label="Send message"]').disabled));
    await ctx.close();
  }

  // ================================================================== rephrase + escalation (PR-026, FR-065)
  console.log("\n== Not finding an answer: rephrase and escalate ==");
  {
    const { page, ctx } = await newPage("/faqs-self-service");
    await openChat(page);
    await ask(page, "What is the airspeed of a swallow?");
    await waitText(page, "I cannot verify that information");
    check("a NO_SOURCE answer offers 'Rephrase my question'", (await dialogText(page)).includes("Rephrase my question"));
    check("one miss does not escalate yet", !(await dialogText(page)).includes("Still not finding it"));
    await page.evaluate(() => [...document.querySelectorAll('[role="dialog"] button')].find((b) => b.textContent.trim() === "Rephrase my question").click());
    await sleep(300);
    check("Rephrase focuses the composer and changes its hint", await page.evaluate(() => document.activeElement?.tagName === "TEXTAREA" && /different words/i.test(document.activeElement.placeholder)));
    await ask(page, "Tell me about zorblax gadgets");
    await page.waitForFunction(() => (document.querySelector('[role="dialog"]')?.innerText.match(/I cannot verify that information/g) || []).length >= 2, { timeout: 30000 });
    check("two misses in a row: official support is emphasised", (await dialogText(page)).includes("Still not finding it? Official support can help"));
    check("the rephrase button is offered only on the newest answer", await page.evaluate(() => [...document.querySelectorAll('[role="dialog"] button')].filter((b) => b.textContent.trim() === "Rephrase my question").length === 1));
    await ctx.close();
  }

  // ================================================================== scroll (FR-011)
  console.log("\n== Scroll position ==");
  {
    const { page, ctx } = await newPage("/faqs-self-service");
    await openChat(page);
    for (let i = 0; i < 6; i++) {
      await ask(page, `Unmatched question number ${i} about zorblax`);
      await page.waitForFunction((n) => (document.querySelector('[role="dialog"]')?.innerText.match(/I cannot verify that information/g) || []).length >= n, { timeout: 30000 }, i + 1);
    }
    const atBottom = await page.evaluate(() => { const r = document.querySelector('[role="dialog"] [aria-live]'); return r.scrollHeight - r.scrollTop - r.clientHeight < 90; });
    check("new answers follow the conversation while the visitor is at the bottom", atBottom);
    await page.evaluate(() => { document.querySelector('[role="dialog"] [aria-live]').scrollTop = 0; });
    await sleep(300);
    // A change that is not a new message (rating an early answer) must not drag the reader to the bottom.
    await page.evaluate(() => [...document.querySelectorAll('[role="dialog"] button')].find((b) => b.textContent.trim() === "Yes")?.click());
    await sleep(500);
    const top = await page.evaluate(() => document.querySelector('[role="dialog"] [aria-live]').scrollTop);
    check("a visitor reading older messages is not pulled to the bottom by an unrelated update", top < 40, `scrollTop=${top}`);
    await ctx.close();
  }

  // ================================================================== analytics (PR-023)
  console.log("\n== Analytics events (metadata only) ==");
  {
    const { page, ctx } = await newPage("/faqs-self-service", { track: true });
    await openChat(page);
    await page.click('button[data-intent="FIX_CONNECTION"]');
    await waitText(page, "Are calls and texts still working");
    const SECRET_TEXT = "swallow velocity secretword xyzzy";
    await ask(page, SECRET_TEXT);
    await waitText(page, "I cannot verify that information");
    await page.evaluate(() => [...document.querySelectorAll('[role="dialog"] button')].find((b) => b.textContent.trim() === "Yes")?.click());
    await sleep(300);
    await page.keyboard.press("Escape");
    await page.focus(`${DIALOG} textarea`).catch(() => {});
    await page.keyboard.press("Escape");
    await sleep(500);
    const ev = await page.evaluate(() => window.__dx);
    const names = ev.map((e) => e.event);
    for (const n of ["dx_drixo_opened", "dx_drixo_intent_selected", "dx_drixo_message_sent", "dx_drixo_answer_shown", "dx_drixo_helpful_vote", "dx_drixo_closed"]) {
      check(`event emitted: ${n}`, names.includes(n), names.join(","));
    }
    check("intent_selected carries the closed intent code only", ev.find((e) => e.event === "dx_drixo_intent_selected")?.intentCode === "FIX_CONNECTION");
    check("message_sent carries only a length bucket, never the text", ev.find((e) => e.event === "dx_drixo_message_sent")?.lengthBucket === "lt100" && !JSON.stringify(ev).includes("swallow") && !JSON.stringify(ev).includes("xyzzy"));
    check("answer_shown carries the response class and whether it was cited", ev.some((e) => e.event === "dx_drixo_answer_shown" && e.responseClass === "NO_SOURCE" && e.cited === "false"));
    check("events are also pushed to window.dataLayer for tag managers", (await page.evaluate(() => window.dataLayer.length)) === ev.length);
    const allowed = new Set(["event", "intentCode", "responseClass", "inputType", "lengthBucket", "errorCode", "helpful", "cited"]);
    check("only allowlisted fields ever appear", ev.every((e) => Object.keys(e).every((k) => allowed.has(k))), JSON.stringify(ev));
    await ctx.close();
  }
} catch (e) {
  fail++;
  console.log(`FAIL  ui behaviour run crashed: ${e?.message ?? e}`);
} finally {
  await browser.close();
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
