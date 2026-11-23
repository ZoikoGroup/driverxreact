// Browser analytics hooks for Drixo (PRD section 11 event taxonomy, PR-023, FR-064).
//
// Metadata only. Like the server telemetry, every field has an allowlist and a value validator: message
// text, personal data, ids, precise location and anything a visitor typed cannot be passed in, so it cannot
// reach an analytics tool by mistake.
//
// The site's analytics tool was not specified, so this does two neutral things:
//   1. pushes {event: "dx_drixo_...", ...} onto window.dataLayer when it exists (Google Tag Manager style)
//   2. dispatches a DOM CustomEvent "dx_drixo" on window, so any other tool can subscribe without code changes
// Nothing is sent anywhere by this file itself. Consent handling (cookie banner / GDPR) is the host site's
// responsibility: gate your tag on consent as you would any other analytics tag.

export type DrixoEvent =
  | "dx_drixo_opened"
  | "dx_drixo_intent_selected"
  | "dx_drixo_message_sent"
  | "dx_drixo_answer_shown"
  | "dx_drixo_auth_gate"
  | "dx_drixo_handoff_selected"
  | "dx_drixo_helpful_vote"
  | "dx_drixo_error"
  | "dx_drixo_closed";

const ENUMS: Record<string, readonly string[]> = {
  intentCode: ["FIX_CONNECTION", "ACTIVATE_SIM_ESIM", "PLANS_HOTSPOT", "BILLING_TOPUPS", "FLEET_IOT", "DRIVER_BENEFITS"],
  responseClass: ["GUIDANCE", "QUESTION", "AUTH_GATE", "SUPPORT", "NO_SOURCE", "SECRET_WARNING"],
  inputType: ["TEXT", "SHORTCUT", "QUICK_REPLY"],
  lengthBucket: ["lt20", "lt100", "lt500", "gte500"],
  errorCode: ["STALE_CONTEXT", "SESSION_EXPIRED", "RATE_LIMITED", "UNAVAILABLE", "INVALID", "UNKNOWN", "OFFLINE"],
  helpful: ["true", "false"],
  cited: ["true", "false"],
};

export type AnalyticsFields = Partial<Record<keyof typeof ENUMS, string | boolean>>;

export function lengthBucket(n: number): string {
  if (n < 20) return "lt20";
  if (n < 100) return "lt100";
  if (n < 500) return "lt500";
  return "gte500";
}

export function track(event: DrixoEvent, fields: AnalyticsFields = {}): void {
  try {
    if (typeof window === "undefined") return;
    const clean: Record<string, string> = {};
    for (const [k, raw] of Object.entries(fields)) {
      const v = String(raw);
      if (ENUMS[k]?.includes(v)) clean[k] = v; // unknown field or value: dropped, never sent
    }
    const detail = { event, ...clean };
    const w = window as unknown as { dataLayer?: unknown[] };
    if (Array.isArray(w.dataLayer)) w.dataLayer.push(detail);
    window.dispatchEvent(new CustomEvent("dx_drixo", { detail }));
  } catch {
    // analytics must never break the chat
  }
}
