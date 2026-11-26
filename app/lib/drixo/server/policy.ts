// DX-POLICY: pre-answer classification (Doc 08 section 8, FRS precedence).
//
//   SAFETY/SECRET -> PROTECTED-INTENT -> UNSUPPORTED ACTION -> HUMAN -> PRICE -> TOPIC -> NONE
//
// Runs on the server BEFORE any answer, flow or (future) model call. Classification
// results are labels only; the input text is never stored, logged or echoed.
//
// Detection here is deterministic and conservative (false positives show a warning; false
// negatives would be worse). Doc 09: "pattern filters alone are not proof of safety" - a
// purpose-trained screen is an open item before launch (Phase 5/7).

import type { IntentCode } from "../../../components/drixo/types";

export type Classification =
  | { kind: "SECRET" }
  | { kind: "EMERGENCY" }
  | { kind: "PROTECTED" }
  | { kind: "UNSUPPORTED_ACTION" }
  | { kind: "HUMAN" }
  | { kind: "PRICE" }
  | { kind: "TOPIC"; intent: IntentCode }
  | { kind: "WELCOME" }
  | { kind: "ABOUT" }
  | { kind: "NONE" };

const norm = (s: string) => s.toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();

/**
 * Canonical form used for ALL policy matching. Defeats cheap obfuscation of secrets and intents:
 *  - Unicode compatibility folding (NFKC): full-width digits/letters become ASCII
 *  - invisible / bidi / format characters (zero-width space, soft hyphen, RLO, BOM ...) are removed
 *  - control characters become spaces
 *  - a small set of look-alike Cyrillic/Greek letters map to Latin
 * It is still not proof of safety (Doc 09): a purpose-trained screen remains an open item.
 */
const LOOKALIKE: Record<string, string> = {
  "\u0430": "a", "\u0435": "e", "\u043e": "o", "\u0440": "p", "\u0441": "c", "\u0443": "y",
  "\u0445": "x", "\u0456": "i", "\u0458": "j", "\u0455": "s", "\u04bb": "h", "\u0501": "d",
  "\u043d": "h", "\u0442": "t", "\u03bf": "o", "\u03b1": "a", "\u03c1": "p", "\u03bd": "v",
  "\u03b9": "i", "\u03ba": "k",
};
export function canonicalize(raw: string): string {
  return raw
    .normalize("NFKC")
    .replace(/[\u00ad\u200b-\u200f\u202a-\u202e\u2060-\u2064\u206a-\u206f\ufeff]/g, "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
    .replace(/[\u0400-\u04ff\u0370-\u03ff\u0500-\u052f]/g, (ch) => LOOKALIKE[ch] ?? ch);
}

const DIGIT_WORDS: Record<string, string> = {
  zero: "0", oh: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9",
};
/** "four eight three nine two zero" -> "483920" (runs of 4+ digit words only). */
function wordsToDigits(t: string): string {
  return t.replace(/\b(?:(?:zero|oh|one|two|three|four|five|six|seven|eight|nine)[ ,.-]*){4,}\b/g, (run) =>
    run.match(/[a-z]+/g)!.map((w) => DIGIT_WORDS[w]).join(""),
  );
}
/** Join digits separated by a single space/dash/dot so "4 8 3 9 2 0" matches \d{4,8}. Used only next to keywords. */
const joinDigits = (t: string) => t.replace(/(?<=\d)[ .\-](?=\d)/g, "");

function luhn(digits: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits.charCodeAt(i) - 48;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

/** Likely password / OTP / PIN / card / ICCID / eSIM QR / transfer PIN. */
export function containsSecret(input: string): boolean {
  const raw = canonicalize(input);
  const t = norm(raw);
  // Spelled-out and spaced digits, used only for the keyword-adjacent code patterns below.
  const tj = joinDigits(wordsToDigits(t));

  // Card numbers: 13-19 digits (space/dash/dot/underscore separators allowed) passing Luhn.
  for (const m of raw.matchAll(/(?:\d[ .\-_]?){13,19}/g)) {
    const digits = m[0].replace(/\D/g, "");
    if (digits.length >= 13 && digits.length <= 19 && luhn(digits)) return true;
  }
  // CVV/CVC next to digits.
  if (/\b(cvv|cvc|cvv2|security code)\b\D{0,12}\d{3,4}\b/.test(tj)) return true;
  // ICCID: 19-20 digits starting 89.
  for (const m of raw.matchAll(/\d[\d -]{17,}\d/g)) {
    const d = m[0].replace(/\D/g, "");
    if ((d.length === 19 || d.length === 20) && d.startsWith("89")) return true;
  }
  // eSIM activation payload.
  if (/\blpa:\s*1\$/.test(t)) return true;
  // Someone offering their own QR / activation code ("here is my eSIM QR code"). A question like
  // "where is my QR code?" is a protected request, not a shared secret, and is handled elsewhere.
  if (/\b(here('s| is)|this is|attached|pasting|pasted|sharing)\b.{0,20}\b(qr|activation code|esim profile)\b/.test(t)) return true;
  // OTP / verification / passcode with a 4-8 digit code nearby (either order).
  if (/\b(otp|one[- ]time|verification|security|passcode|auth(?:entication)?|sms|2fa)\b[^\d]{0,24}\b\d{4,8}\b/.test(tj)) return true;
  if (/\b\d{4,8}\b[^\d]{0,24}\b(is|as)? ?(my |the )?(otp|one[- ]time|verification code|passcode)\b/.test(tj)) return true;
  // PIN / transfer PIN / account PIN with digits.
  if (/\b(pin|transfer pin|port(?:ing)? pin|account pin)\b[^\d]{0,16}\b\d{4,8}\b/.test(tj)) return true;
  // US SSN (123-45-6789, also with spaces) or an SSN/social-security mention next to 9 digits.
  if (/\b\d{3}[- ]\d{2}[- ]\d{4}\b/.test(raw)) return true;
  if (/\b(ssn|social security( number)?)\b\D{0,12}\d{9}\b/.test(tj)) return true;
  // API keys / access tokens: vendor-prefixed keys, or "token|api key|secret|bearer" followed by a long value.
  if (/\b(?:sk|pk|rk)_(?:live|test)_[a-z0-9]{6,}/i.test(raw) || /\bAIza[0-9A-Za-z_-]{20,}/.test(raw) || /\bghp_[A-Za-z0-9]{20,}/.test(raw)) return true;
  if (/\b(api[ _-]?key|access[ _-]?token|auth[ _-]?token|account token|secret(?: key)?|bearer)\b\s*(?:is|:|=)?\s*[A-Za-z0-9_\-.]{12,}/i.test(raw)) return true;
  // Password statements.
  if (/\b(my )?(password|passcode|passphrase)\s*(is|:|=)\s*\S+/.test(t)) return true;
  if (/\bpassword\b.{0,20}\b(is|was)\b\s*\S{4,}/.test(t)) return true;
  return false;
}

const EMERGENCY = [
  /\b(emergency|911|ambulance|heart attack|bleeding|unconscious|on fire|car fire|i('| a)?m (hurt|injured)|been in an? (accident|crash|wreck)|just crashed|medical)\b/,
  /\b(accident|in an? (crash|wreck)|(car|truck|vehicle|van) (crash|wreck)|had an? crash|was (hit|rear[- ]ended))\b/,
  /\b(suicide|kill myself|want to die)\b/,
  /\b(while|as) (i('| a)?m )?driving\b/,
  /\bi('| a)?m (driving|on the highway|behind the wheel)( right now)?\b/,
  /\b(while|as|when) i (drive|am driving|'m driving)\b/,
  /\bi('| a)?m (in (heavy |rush[- ]hour |slow )?traffic|on the road|on the move|stuck in traffic)\b/,
  /^(in traffic|on the road|stuck in traffic)\b/,
  /\bdriving (right )?now\b/,
  /\bi('| a)?m driving an? (truck|car|van|rig|bus|cab|vehicle)\b/,
];

const PROTECTED = [
  /\b(my|the)\s+(?:\w+\s+)?(bill|invoice|balance|statement|payment history|usage|data usage|account|line|subscription|account number)\b/,
  // Password / login / PIN resets belong behind sign-in, not in the public chat.
  /\b(reset|change|forgot|forgotten|recover|lost)\b.{0,15}\b(password|pin|login|log-in|username|passcode)\b/,
  // Billing disputes and order lookups need an authenticated account.
  /\b(charged|billed|overcharged|double[- ]charged)\b.{0,15}\b(twice|two times|again|wrong|incorrect|extra)\b/,
  /\b(why (was|am|did)|was) (i|my card)\b.{0,12}\b(charged|billed)\b/,
  /\b(my|the)\s+(?:\w+\s+)?(order|shipment|package|refund)\b|\border status\b|\bstatus of my\b/,
  /\bwhen\b.{0,20}\b(my|the)\b.{0,15}\b(plan|service|subscription|line)\b.{0,15}\b(renew|expire|end|due)/,
  /\b(how much|what)\b.{0,25}\b(data|gb|minutes)\b.{0,20}\b(left|remaining|used|do i have)\b/,
  /\bdata (left|remaining|balance)\b/,
  /\b(am i|is my (sim|line|esim|number|service|account))\b.{0,20}\b(active|activated|suspended|working|on)\b/,
  /\b(activation|port(?:ing)?|transfer) status\b/,
  /\b(sim swap|swap my sim|change my plan|switch my plan|upgrade my plan|cancel my (plan|service|account)|payment method|saved card|autopay|auto-pay)\b/,
  /\b(top[- ]?up|add (funds|credit|balance)|recharge)\b/,
  /\b(someone else'?s?|another (driver|person|customer)'?s?|his|her|their)\b.{0,25}\b(bill|number|account|usage|phone number|address)\b/,
  /\b(fleet|company)\b.{0,25}\b(usage|lines|vehicles|invoice|bill)\b.{0,15}\b(for|of|at)\b/,
  // Changing or removing fleet lines/devices is a protected write, not public information.
  /\b(cancel|suspend|delete|remove|deactivate|disconnect)\b.{0,20}\b(\d+ )?(fleet|lines?|vehicles?|devices?|sims?)\b/,
  // Other people's or vehicles' location data is never public (cross-tenant, FR-045).
  /\b(drivers?'?s?|employees?|vehicles?|trucks?|fleet)\b.{0,20}\b(location|gps|whereabouts|tracking)\b/,
  /\b(location|gps)\b.{0,12}\b(histor(?:y|ies)|trail|log|records?)\b/,
  /\bi(?: am|'m) (the |an? )?(account owner|owner|admin|administrator|fleet manager|manager|support agent|employee)\b/,
  /\b(show|list|give|tell|get|pull|display|dump)\b.{0,25}\b(all )?(subscribers?|accounts?|customers?|invoices?|vehicles?\b.{0,12}(usage|location))\b/,
];

// "How do I activate my eSIM?" is a request for guidance, not for an action.
const HOW_TO = /\b(how (do|can|to|should|does)|steps?|instructions?|guide|what is|where (do|can)|explain|do i need|what do i need|need to|requirements?|prerequisites?|what (should|must) i)\b/;

// Only unsupported when phrased as a command / an ask to DO it.
const ACTION_COMMAND = [
  /\b(activate|provision|enable|turn on|switch on|start)\b.{0,25}\b(my |the |a |an )?(esim|e-sim|sim|line|service|number|phone)\b/,
  /\bport(?:ing)? (my|the|this)? ?(number|line)\b/,
  /\b(transfer|move)\b.{0,10}\b(my|the)\b.{0,6}\b(number|line)\b/,
];

const UNSUPPORTED_ACTION = [
  /\b(send|give|show|resend|get)\b.{0,15}\b(me )?(my |the |a )?(qr|qr code|activation code|esim profile)\b/,
  /\b(refund|charge|bill|pay|purchase|buy)\b.{0,20}\b(me|my|for me|now)\b/,
  /\b(create|open|file|raise)\b.{0,12}\b(a )?(ticket|case)\b/,
  /\b(transfer|connect)\b.{0,12}\b(me )?(to )?(an? )?(live )?(agent|human|person|representative)\b.{0,15}\b(now)?\b/,
];

const HUMAN = [
  /\b(agent|human|real person|representative|rep|operator|someone)\b/,
  /\b(talk|speak|chat|call)\b.{0,12}\b(to|with)\b.{0,12}\b(someone|support|a person|you guys|customer service)\b/,
  /\b(customer service|customer support|support team|contact support|phone number for support|help desk)\b/,
  /\b(reach|contact|get|find)\b.{0,14}\b(a |an )?(person|human|someone)\b/,
];

const PRICE = [/\b(price|prices|pricing|cost|costs|how much|per month|monthly fee|fee|fees|discount|deal|promo|promotion|coupon|cheapest|best plan|unlimited)\b/];

const TOPICS: { intent: IntentCode; patterns: RegExp[] }[] = [
  {
    intent: "FIX_CONNECTION",
    patterns: [
      /\b(no (signal|service|data|internet|bars|reception|connection)|signal|reception|dropped?|dropping)\b/,
      /\b(data|internet|wifi|wi-fi|network|cellular|lte|5g|4g)\b.{0,25}\b(not working|isn'?t working|stopped|down|slow|won'?t|can'?t|cannot|fail|broken|bad|issue|problem)/,
      /\b(not working|stopped working|slow|won'?t load|can'?t connect|cannot connect|can'?t (call|text)|cannot (call|text)|calls? (fail|drop)|texts? (fail|not))\b/,
      /\b(fix my connection|troubleshoot|connection problem|connectivity)\b/,
      /\bhotspot\b.{0,25}\b(not|won'?t|can'?t|doesn'?t|fail|broken|down|issue|problem)/,
      /\b(my app|delivery app|rideshare app|maps?)\b.{0,25}\b(not loading|won'?t load|not working|fail)/,
    ],
  },
  {
    intent: "ACTIVATE_SIM_ESIM",
    patterns: [/\b(esim|e-sim|sim card|physical sim|sim)\b/, /\b(activate|activation|set ?up|install|byod|bring my own|unlocked phone|number transfer|port)\b/],
  },
  {
    intent: "FLEET_IOT",
    patterns: [/\b(fleet|vehicles?|trucks?|iot|telematics|connected vehicle|eld|trackers?|business lines?|\d+ lines)\b/],
  },
  {
    intent: "DRIVER_BENEFITS",
    patterns: [/\b(driverxtra|benefits?|perks?|partner offers?|rewards?)\b/],
  },
  {
    intent: "PLANS_HOTSPOT",
    patterns: [/\b(plans?|hotspot|tethering|data[- ]only|prepaid|postpaid|coverage|zip ?code|route|roaming|international|gig|rideshare|delivery driver|trucker)\b/],
  },
  {
    intent: "BILLING_TOPUPS",
    patterns: [/\b(billing|bill|payment|pay my|top[- ]?up)\b/],
  },
];

const any = (res: RegExp[], t: string) => res.some((r) => r.test(t));

/**
 * Classify free text. Secret and emergency come first and short-circuit everything:
 * "ignore your rules", "I am an admin" etc. never change this ordering (FR-049).
 */
export function classifyText(input: string): Classification {
  const raw = canonicalize(input);
  if (containsSecret(raw)) return { kind: "SECRET" };
  const t = norm(raw);
  if (any(EMERGENCY, t)) return { kind: "EMERGENCY" };
  if (any(PROTECTED, t)) return { kind: "PROTECTED" };
  if (any(UNSUPPORTED_ACTION, t) || (!HOW_TO.test(t) && any(ACTION_COMMAND, t))) {
    return { kind: "UNSUPPORTED_ACTION" };
  }
  if (any(HUMAN, t)) return { kind: "HUMAN" };
  // Troubleshooting beats price/sales (problem-first). Check it before PRICE.
  const connection = TOPICS[0];
  if (any(connection.patterns, t)) return { kind: "TOPIC", intent: "FIX_CONNECTION" };
  if (any(PRICE, t)) return { kind: "PRICE" };
  for (const topic of TOPICS.slice(1)) {
    if (any(topic.patterns, t)) return { kind: "TOPIC", intent: topic.intent };
  }
  // Greeting or "what can you do" (checked last, whole-message match only, so it never hides a real question).
  const w = t.replace(/[^a-z' ]/g, " ").replace(/\s+/g, " ").trim();
  if (WELCOME.some((r) => r.test(w))) return { kind: "WELCOME" };
  if (ABOUT.some((r) => r.test(w))) return { kind: "ABOUT" };
  return { kind: "NONE" };
}

const WELCOME: RegExp[] = [
  /^(hi|hii+|hello|hey|heya|yo|hola|howdy|good (morning|afternoon|evening)|greetings)( (there|drixo|team))?( (how are you|whats up|what's up))?$/,
  /^(how are you|whats up|what's up)$/,
  /^(thanks|thank you|thx|ok|okay|cool|great)( drixo)?$/,
];
// Natural questions about the assistant itself: the model answers from the built-in reference when enabled.
const ABOUT: RegExp[] = [
  /\b(how|what|where|in what way)\b.*\b(you|drixo)\b.*\b(help|do|assist|support|offer)\b/,
  /\b(can|could|will) (you|drixo)\b.*\b(help|assist)\b/,
  /^(what|how)\b.*\b(help|assist)\b.*\b(me|us)\b$/,
  /\b(what|who) (are|is) (you|drixo)\b/,
  /\b(can|could) you (help|assist)\b/,
  /^(help|help me|i need help)$/,
];
