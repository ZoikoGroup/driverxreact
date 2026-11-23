// OUTPUT GATE for model-written answers (Doc 08 INV-03 "no model authority", Doc 09 section 08).
//
// The model may only PROPOSE {answerable, answer, source_ids}. This module decides, deterministically and
// with no model involvement, whether the proposal may be shown. Anything it cannot positively verify is
// rejected, and the caller falls back to the approved article text (or NO_SOURCE). The model never chooses
// the response class, UI state, links, quick replies or citations: the server builds those from registered
// values. The checks below are heuristics for the TEXT only; they are the last line of defence, not a proof
// of factual correctness (Doc 09: pattern filters are not proof of safety). The evaluation set and a human
// review remain launch prerequisites.

export interface GateExcerpt {
  /** Short id shown to the model ("E1", "E2"...); the only citation vocabulary it has. */
  id: string;
  text: string;
}

export interface ModelProposal {
  answerable: boolean;
  answer: string;
  source_ids: string[];
}

export type GateResult =
  | { ok: true; text: string; usedIds: string[] }
  | { ok: false; abstain: true }
  | { ok: false; abstain: false; reason: string };

export const MAX_ANSWER_CHARS = 1200;
const NOVELTY_MAX = () => Number(process.env.DRIXO_MODEL_NOVELTY_MAX) || 0.35;

// ----------------------------------------------------------------------------- shape
/** Strict parse of the structured output. Unknown keys, wrong types or non-JSON are rejected. */
export function parseProposal(raw: string): ModelProposal | undefined {
  let v: unknown;
  try {
    v = JSON.parse(raw);
  } catch {
    return undefined;
  }
  if (typeof v !== "object" || v === null || Array.isArray(v)) return undefined;
  const o = v as Record<string, unknown>;
  const keys = Object.keys(o).sort().join(",");
  if (keys !== "answer,answerable,source_ids") return undefined;
  if (typeof o.answerable !== "boolean" || typeof o.answer !== "string") return undefined;
  if (!Array.isArray(o.source_ids) || o.source_ids.some((x) => typeof x !== "string")) return undefined;
  return { answerable: o.answerable, answer: o.answer, source_ids: o.source_ids as string[] };
}

// ----------------------------------------------------------------------------- helpers
const STOP = new Set(
  ("about above after again also always among and any are around because been before being between both but can could did does doing done down during each " +
    "either else even ever every few for from further had has have having her here hers him his how however into its itself just keep like made make many " +
    "may might more most much must need needs not now off once only other our out over own same she should since some such than that the their them then " +
    "there these they this those through too under until upon very was were what when where whether which while who whom why will with within without " +
    "would you your yours yourself please thing things way ways use used using get gets got let lets see one two three also still well").split(" "),
);

/** Light stemmer so "settings" matches "setting" and "restarted" matches "restart". */
function stem(w: string): string {
  let x = w;
  for (const suf of ["ingly", "edly", "ing", "ed", "ly", "es", "s"]) {
    if (x.length > suf.length + 3 && x.endsWith(suf)) {
      x = x.slice(0, -suf.length);
      break;
    }
  }
  return x;
}
function contentWords(text: string): string[] {
  return (text.toLowerCase().match(/[a-z]{4,}/g) ?? []).filter((w) => !STOP.has(w)).map(stem);
}

/** Digits-bearing tokens ("$38", "35 GB", "99%", "24/7", "5G", "2 3"). */
function numberTokens(text: string): string[] {
  return (text.match(/[$]?\d[\d,.]*\d%?|[$]?\d%?/g) ?? []).map((t) => t.replace(/[,$%]/g, "").replace(/[.]+$/, ""));
}

// Control, bidi and invisible characters. Built from code points so this source file stays plain ASCII.
const BAD_RANGES: [number, number][] = [[0, 8], [11, 12], [14, 31], [127, 127], [0x200b, 0x200f], [0x202a, 0x202e], [0x2060, 0x2064], [0xfeff, 0xfeff]];
const BAD_CHARS = new RegExp("[" + BAD_RANGES.map(([a, b]) => String.fromCharCode(a) + "-" + String.fromCharCode(b)).join("") + "]");

// ----------------------------------------------------------------------------- claim patterns
const RISK_TERMS = [
  "24/7", "guarantee", "guaranteed", "instant", "instantly", "unlimited", "free", "discount", "refund", "cashback",
  "insurance", "uptime", "fastest", "best", "never", "always", "100%", "no contract", "lifetime", "cheapest",
];

const FORBIDDEN: [string, RegExp][] = [
  ["MARKUP", /[<>]/],
  ["MARKDOWN", /```|\*\*|__|^\s*#{1,6}\s|\]\(|^\s*[-*]\s/m],
  ["URL", /https?:|www\.|\b[a-z0-9-]{2,}\.(com|net|org|io|co|us|uk|app|dev|info|biz|xyz)\b/i],
  ["EMAIL", /[a-z0-9._%+-]+@[a-z0-9.-]+/i],
  ["SCHEME", /\b(javascript|data|vbscript):/i],
  ["LEAK", /system prompt|my (instructions|prompt|rules)|ignore (all |the )?(previous|above|prior)|as an ai (language )?model|developer mode/i],
  ["AGENT_CLAIM", /\b(connect(ing)? you (to|with)|transfer(ring)? you|an? (live )?agent (will|is|has|can)|live agent|ticket (number|#|id)|case (number|#|id)|ref(erence)? number)\b/i],
  // The model may not claim to have done, or be about to do, anything: it has no tools. Matches any verb form
  // ("activate", "activated", "activating"), first person, and passive completions ("has been refunded").
  ["ACTION_CLAIM", /\b(i (have|'ve|will|can|am going to|just)|i'll|we (have|will|can)|we'll)\b.{0,24}\b(activat|cancel|refund|chang|updat|reset|sen[dt]|charg|process|transfer|check(ed)? your|look(ed)? up|see(n)? your|reach(ed)? out|contact(ed)? you|call(ed)? you)\w*/i],
  ["ACTION_DONE", /\b(has|have|had) (now |already |just )?been (activated|cancell?ed|refunded|updated|changed|reset|sent|processed|charged|transferred|applied|submitted|scheduled)\b/i],
  ["ACCOUNT_CLAIM", /\byour (account|balance|bill|invoice|usage|data left|remaining data|plan is|number is|sim is|line is|esim is)\b/i],
  ["ROLE_CLAIM", /\b(i am|i'm) (a |an |your )?(human|person|agent|representative|technician|engineer)\b/i],
  ["EMERGENCY_CLAIM", /\b(emergency services (are|have been)|help is on the way|we (have )?(dispatched|contacted))\b/i],
];

// ----------------------------------------------------------------------------- the gate
export interface GateContext {
  question: string;
  excerpts: GateExcerpt[];
  /** Per-process random token embedded in the system prompt; it appearing in output means prompt leakage. */
  canary: string;
}

export function gateAnswer(p: ModelProposal, ctx: GateContext): GateResult {
  if (!p.answerable) return { ok: false, abstain: true };

  const fail = (reason: string): GateResult => ({ ok: false, abstain: false, reason });

  // 1. Citations: only ids we issued; 1-3, unique. (The model cannot cite anything else, so it cannot
  //    smuggle in a source, revision or URL.)
  const issued = new Set(ctx.excerpts.map((e) => e.id));
  const ids = [...new Set(p.source_ids)];
  if (ids.length < 1 || ids.length > 3 || ids.length !== p.source_ids.length) return fail("BAD_CITATIONS");
  if (ids.some((id) => !issued.has(id))) return fail("UNKNOWN_SOURCE_ID");

  // 2. Text hygiene.
  const text = p.answer.normalize("NFKC").replace(/\s+/g, " ").trim();
  if (text.length < 1) return fail("EMPTY");
  if (text.length > MAX_ANSWER_CHARS) return fail("TOO_LONG");
  if (BAD_CHARS.test(text)) return fail("CONTROL_CHARS");
  if (text.includes(ctx.canary)) return fail("PROMPT_LEAK");
  for (const [name, re] of FORBIDDEN) if (re.test(text)) return fail(name);

  const cited = ctx.excerpts.filter((e) => ids.includes(e.id));
  const citedText = cited.map((e) => e.text).join(" ").toLowerCase();
  const allText = (ctx.excerpts.map((e) => e.text).join(" ") + " " + ctx.question).toLowerCase();
  const lower = text.toLowerCase();

  // 3. Numbers must come from the cited excerpts (or be echoed from the user's own question).
  const digitsHay = (citedText + " " + ctx.question.toLowerCase()).replace(/[,$%]/g, "");
  for (const n of numberTokens(text)) {
    if (!digitsHay.includes(n)) return fail("UNGROUNDED_NUMBER");
  }

  // 4. Risky commercial/guarantee terms only if the CITED excerpts themselves use them.
  for (const term of RISK_TERMS) {
    const re = new RegExp(`(^|[^a-z])${term.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}([^a-z]|$)`, "i");
    if (re.test(lower) && !re.test(citedText)) return fail("UNGROUNDED_CLAIM_TERM");
  }

  // 5. Lexical grounding: the answer may not introduce much vocabulary that appears in neither the
  //    excerpts nor the question. Catches invented facts/products that pass the pattern checks.
  const known = new Set(contentWords(allText));
  const words = contentWords(text);
  if (words.length >= 4) {
    const novel = words.filter((w) => !known.has(w)).length / words.length;
    if (novel > NOVELTY_MAX()) return fail("NOT_GROUNDED");
  }

  return { ok: true, text, usedIds: ids };
}
