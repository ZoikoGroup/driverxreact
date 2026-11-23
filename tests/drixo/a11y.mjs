// Drixo automated accessibility audit (WCAG 2.2 AA target, Doc 07 / FRS FR-067..072 / PR-021).
//
//   node tests/drixo/a11y.mjs http://localhost:3111
//   (set CHROME_PATH to a Chrome/Edge executable if auto-detection fails)
//
// The target server must have the widget enabled (NEXT_PUBLIC_DRIXO_ENABLED=true at build/dev time) and the
// assistant at 100% rollout. Runs axe-core (WCAG 2.0/2.1/2.2 A+AA rules) over every UI state of the Drixo widget
// only (the host site's own accessibility is out of scope here), plus checks axe cannot make:
// keyboard order and visible focus, touch-target size, 200% text size + 320px reflow, reduced motion, live
// regions, dialog naming, focus return.
//
// THIS IS NOT A CONFORMANCE CLAIM. Automated tools find roughly a third of accessibility problems. Doc 07 and
// Doc 08 require manual assistive-technology testing (NVDA/JAWS/VoiceOver/TalkBack, switch/voice control,
// real devices) before any claim; that has not been done and cannot be done by this script.

import puppeteer from "puppeteer-core";
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const BASE = (process.argv[2] ?? "http://localhost:3111").replace(/\/$/, "");
const PAGE = `${BASE}/faqs-self-service`;

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
const warn = (msg) => console.log(`WARN  ${msg}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const LAUNCHER = 'button[aria-label="Open Drixo AI assistant"]';
const DIALOG = '[role="dialog"]';
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });

async function openPage({ width, height, reducedMotion = false, interceptTurn503 = false }) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width, height });
  // Deterministic measurements: motion is decoration and is switched off for visitors who ask for less of it.
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  if (reducedMotion) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  if (interceptTurn503) {
    await page.setRequestInterception(true);
    page.on("request", (r) => {
      if (r.method() === "POST" && /\/turns$/.test(r.url())) {
        r.respond({ status: 503, contentType: "application/problem+json", body: JSON.stringify({ type: "about:blank", title: "x", status: 503, code: "SERVICE_UNAVAILABLE", detail: "x", correlationId: "req-test", retryable: true }) });
      } else r.continue();
    });
  }
  await page.goto(PAGE, { waitUntil: "networkidle2", timeout: 120000 });
  await page.waitForSelector(LAUNCHER, { timeout: 30000 });
  return { page, ctx };
}

async function openChat(page) {
  // SSR'd launcher can be clicked before hydration; retry until React attaches the handler.
  for (let i = 0; i < 20 && !(await page.$(DIALOG)); i++) {
    await page.click(LAUNCHER).catch(() => {});
    await sleep(700);
  }
  await page.waitForSelector(`${DIALOG} button[data-intent]`, { timeout: 30000 });
}

async function axeAudit(page, label, include) {
  await page.evaluate(axeSource);
  const res = await page.evaluate(
    async (tags, inc) => {
      // eslint-disable-next-line no-undef
      const r = await axe.run({ include: [[inc]] }, { runOnly: { type: "tag", values: tags }, resultTypes: ["violations", "incomplete"] });
      return {
        violations: r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map((n) => n.target.join(" ")).slice(0, 4), count: v.nodes.length })),
        incomplete: r.incomplete.map((v) => ({ id: v.id, count: v.nodes.length })),
      };
    },
    WCAG_TAGS,
    include,
  );
  check(`axe WCAG 2.2 AA: ${label}`, res.violations.length === 0, JSON.stringify(res.violations));
  if (res.incomplete.length) warn(`axe "needs review" in ${label}: ${res.incomplete.map((i) => `${i.id}x${i.count}`).join(", ")} (verify manually)`);
}

const clickText = (page, text) =>
  page.evaluate((t) => {
    const b = [...document.querySelectorAll('[role="dialog"] button')].find((x) => x.textContent.trim() === t);
    b?.click();
    return !!b;
  }, text);
const waitText = (page, text) => page.waitForFunction((t) => document.querySelector('[role="dialog"]')?.innerText.includes(t), { timeout: 30000 }, text);

try {
  // ===================================================================== states, desktop
  {
    const { page, ctx } = await openPage({ width: 1280, height: 800 });
    await axeAudit(page, "closed launcher", LAUNCHER);
    await openChat(page);
    check("dialog is named by its heading (aria-labelledby)", await page.$eval(DIALOG, (d) => { const id = d.getAttribute("aria-labelledby"); return !!id && !!document.getElementById(id)?.textContent?.trim(); }));
    check("dialog is non-modal and focusable (focus moved into it on open)", await page.evaluate(() => document.activeElement?.getAttribute("role") === "dialog"));
    check("conversation region is a polite live region", await page.$eval(`${DIALOG} [aria-live]`, (e) => e.getAttribute("aria-live") === "polite"));
    check("safety notice present and announced as a note", await page.$eval(`${DIALOG} [role="note"]`, (e) => /parked/i.test(e.textContent)));
    await axeAudit(page, "welcome (desktop 1280)", DIALOG);

    // Keyboard order and visible focus.
    const stops = [];
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const a = document.activeElement;
        if (!a || !a.closest('[role="dialog"]')) return { outside: true };
        const cs = getComputedStyle(a);
        const r = a.getBoundingClientRect();
        const name = a.getAttribute("aria-label") || a.textContent.trim().slice(0, 30);
        const ring = cs.boxShadow !== "none" || (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2);
        return { name, tag: a.tagName, ring, w: r.width, h: r.height };
      });
      if (info.outside) break;
      stops.push(info);
    }
    check("keyboard: Tab visits every control inside the dialog in order", stops.length >= 10, `${stops.length} stops`);
    check("keyboard: header controls come first, then the six shortcuts in order", /^Expand chat window\|More options\|Close chat$/.test(stops.slice(0, 3).map((s) => s.name).join("|")) && stops.slice(3, 9).map((s) => s.name.split("\n")[0]).join("|").startsWith("Fix my connection"), stops.slice(0, 9).map((s) => s.name).join(" | "));
    check("keyboard: every focused control shows a visible focus indicator (>=2px ring)", stops.every((s) => s.ring), stops.filter((s) => !s.ring).map((s) => s.name).join(","));
    const tooSmall = stops.filter((s) => s.w < 24 || s.h < 24);
    check("target size: every control is at least 24x24 CSS px (WCAG 2.5.8 AA)", tooSmall.length === 0, tooSmall.map((s) => `${s.name} ${Math.round(s.w)}x${Math.round(s.h)}`).join(","));
    const below44 = stops.filter((s) => (s.w < 44 || s.h < 44) && s.w >= 24 && s.h >= 24);
    if (below44.length) warn(`controls under the preferred 44px (Doc 07): ${below44.map((s) => `${s.name} ${Math.round(s.w)}x${Math.round(s.h)}`).join("; ")}`);

    // Conversation states
    await page.click('button[data-intent="FIX_CONNECTION"]');
    await waitText(page, "Are calls and texts still working");
    await axeAudit(page, "question with quick replies", DIALOG);
    check("quick replies are grouped and labelled", await page.$eval(`${DIALOG} [role="group"]`, (g) => !!g.getAttribute("aria-label")));
    await clickText(page, "Yes, they work");
    await waitText(page, "Is it working now?");
    await clickText(page, "No, still not working");
    await waitText(page, "official support");
    await axeAudit(page, "support / unresolved result", DIALOG);

    await page.type(`${DIALOG} textarea`, "what is my bill");
    await page.keyboard.press("Enter");
    await waitText(page, "cannot access or change your account");
    await axeAudit(page, "auth gate", DIALOG);

    await page.type(`${DIALOG} textarea`, "my otp is 483920");
    await page.keyboard.press("Enter");
    await waitText(page, "do not share passwords");
    await axeAudit(page, "secret warning", DIALOG);

    // Settings / privacy view and end confirmation
    await page.click('button[aria-label="Privacy and settings"]');
    await waitText(page, "Privacy & settings");
    await axeAudit(page, "privacy and settings view", DIALOG);
    await page.keyboard.press("Escape");
    await waitText(page, "Hey, I'm Drixo");
    check("Escape in a sub-view returns to the chat (does not close the panel)", !!(await page.$(DIALOG)));
    // The X closes at once; the confirmation is reached from Privacy -> End chat.
    await page.click('button[aria-label="Privacy and settings"]');
    await waitText(page, "Privacy & settings");
    await clickText(page, "End chat");
    await waitText(page, "Do you want to end this chat?");
    await axeAudit(page, "end-chat confirmation", DIALOG);
    await clickText(page, "Keep chatting");

    // Escape closes the panel and returns focus.
    await page.keyboard.press("Escape").catch(() => {});
    await page.focus(`${DIALOG} textarea`).catch(() => {});
    await page.keyboard.press("Escape");
    await page.waitForSelector(LAUNCHER, { timeout: 5000 });
    check("Escape closes the panel and returns focus to the launcher", await page.evaluate(() => document.activeElement?.getAttribute("aria-label") === "Open Drixo AI assistant"));
    await ctx.close();
  }

  // ===================================================================== error state
  {
    const { page, ctx } = await openPage({ width: 1280, height: 800, interceptTurn503: true });
    await openChat(page);
    await page.click('button[data-intent="FIX_CONNECTION"]');
    await waitText(page, "couldn't reach Drixo");
    check("error state offers Try again and official support", await page.evaluate(() => [...document.querySelectorAll('[role="dialog"] button')].some((b) => b.textContent.trim() === "Try again") && [...document.querySelectorAll('[role="dialog"] a')].some((a) => /support/i.test(a.textContent))));
    await axeAudit(page, "error state with retry", DIALOG);
    await ctx.close();
  }

  // ===================================================================== mobile / reflow / text size
  for (const [w, h] of [[320, 640], [390, 800]]) {
    const { page, ctx } = await openPage({ width: w, height: h });
    await openChat(page);
    await axeAudit(page, `welcome (mobile ${w})`, DIALOG);
    const geo = await page.$eval(DIALOG, (d) => { const r = d.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; });
    check(`mobile ${w}: panel fills the viewport, nothing clipped`, geo.l >= 0 && geo.r <= w + 1 && geo.t >= 0 && geo.b <= h + 1, JSON.stringify(geo));
    check(`mobile ${w}: no horizontal scroll (WCAG 1.4.10 reflow)`, !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)));
    check(`mobile ${w}: composer and send button are within the viewport`, await page.evaluate((vw, vh) => { const t = document.querySelector('[role="dialog"] textarea').getBoundingClientRect(); const b = document.querySelector('[role="dialog"] button[aria-label="Send message"]').getBoundingClientRect(); return t.left >= 0 && b.right <= vw + 1 && b.bottom <= vh + 1; }, w, h));

    // 200% text size (WCAG 1.4.4): scale the root font size; the layout must still work at this width.
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    await sleep(400);
    const overflow = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      const kids = [...d.querySelectorAll("button, a, textarea, h2, p")];
      const clippedX = kids.filter((k) => { const r = k.getBoundingClientRect(); return r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1); }).length;
      return { clippedX, hScroll: document.documentElement.scrollWidth > window.innerWidth };
    });
    check(`mobile ${w} at 200% text size: no horizontally clipped controls`, overflow.clippedX === 0, JSON.stringify(overflow));
    check(`mobile ${w} at 200% text size: composer still reachable`, await page.evaluate(() => { const c = document.querySelector('[role="dialog"] textarea'); const r = c.getBoundingClientRect(); return r.bottom <= window.innerHeight + 1 && r.height > 0; }));
    await ctx.close();
  }

  // ===================================================================== reduced motion
  {
    const { page, ctx } = await openPage({ width: 1280, height: 800, reducedMotion: true });
    const dur = await page.$eval(LAUNCHER, (b) => parseFloat(getComputedStyle(b).transitionDuration) || 0);
    check("prefers-reduced-motion: launcher animation/transition is off", dur === 0, `${dur}s`);
    await ctx.close();
  }
} catch (e) {
  fail++;
  console.log(`FAIL  audit crashed: ${e?.message ?? e}`);
} finally {
  await browser.close();
}

console.log(`\n${pass} passed, ${fail} failed`);
console.log("NOTE: automated checks only. Manual assistive-technology testing is still required before any WCAG 2.2 AA claim.");
process.exitCode = fail ? 1 : 0;
