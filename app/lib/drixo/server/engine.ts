// DX-FLOW router + output gate for Phase 3 (no model, no retrieval yet).
// Input -> policy classification -> deterministic step -> typed, registry-resolved response.
// Nothing here stores or echoes user text; only labels leave this module.

import type { IntentCode } from "../../../components/drixo/types";
import {
  ENTRY_STEP,
  FIXED,
  getStep,
  type ActionKind,
  type FlowAction,
  type FlowStep,
  type Outcome,
  type ResponseClass,
  type UiState,
} from "./flows";
import { isRegisteredHref, resolveLink } from "./links";
import { classifyText } from "./policy";
import { retrieveApprovedTop, type KbHit, type KbSource } from "./kb";
import { modelEnvEnabled, synthesizeAnswer } from "./model";
import { getFlags } from "./flags";
import { emit } from "./telemetry";

export type TurnInput =
  | { type: "TEXT"; text: string }
  | { type: "SHORTCUT"; intentCode: IntentCode | string }
  | { type: "QUICK_REPLY"; stepId: string; optionId: string };

export interface TurnAction {
  actionId: string;
  kind: ActionKind;
  label: string;
  /** Present for navigation kinds only; always produced by the link registry. */
  href?: string;
}

export interface TurnResult {
  responseClass: ResponseClass;
  uiState: UiState;
  text: string;
  quickReplies: { optionId: string; stepId: string; label: string }[];
  sources: KbSource[]; // only approved, effective, non-revoked KB revisions (Phase 4)
  actions: TurnAction[];
  outcome: Outcome;
}

export type Decision =
  | {
      ok: true;
      result: TurnResult;
      activeStepId: string | null;
      classLabel: string;
      /** KB revisions this answer relies on; re-verified right before commit. */
      revisionIds: string[];
    }
  | { ok: false; reason: "STALE" };

function renderAction(a: FlowAction): TurnAction {
  if (a.kind === "RESTART") return { actionId: a.actionId, kind: a.kind, label: a.label ?? "Start over" };
  const l = resolveLink(a.link!);
  return { actionId: a.actionId, kind: a.kind, label: l.label, href: l.href };
}

function render(step: FlowStep): Decision {
  const actions = (step.actions ?? []).map(renderAction);
  // Output gate (FR-062): every href must come from the registry. Fail closed by dropping it.
  const safeActions = actions.filter((a) => a.href === undefined || isRegisteredHref(a.href));
  return {
    ok: true,
    activeStepId: step.options?.length ? step.id : null,
    classLabel: step.responseClass,
    revisionIds: [],
    result: {
      responseClass: step.responseClass,
      uiState: step.uiState,
      text: step.text,
      quickReplies: (step.options ?? []).map((o) => ({ optionId: o.optionId, stepId: step.id, label: o.label })),
      sources: [],
      actions: safeActions,
      outcome: step.outcome ?? "NONE",
    },
  };
}

const entry = (intent: IntentCode): Decision => {
  const id = ENTRY_STEP[intent];
  return render((getStep(id) ?? FIXED[id])!);
};

export const noSourceDecision = (): Decision => render(FIXED["no-source"]);

/** Approved, cited answer (Phase 4). The text is the human-approved article, served verbatim. */
/** Context the policy layer needs but must never derive from user text. */
export interface TurnContext {
  /** Used only as a key for the per-session model-call budget; never sent to any provider. */
  sessionId: string;
}

const ABOUT_HIT: KbHit = {
  revisionId: "ABOUT@1",
  matched: 0,
  meaningful: 0,
  source: { sourceId: "DRIXO", label: "About Drixo", revision: "ABOUT@1", url: "/faqs-self-service" },
  text:
    "Drixo is the public AI assistant for DriverX Mobile, a mobile service for drivers, couriers, fleets and mobile professionals. " +
    "Drixo can walk visitors through fixing a connection problem, setting up a SIM or eSIM, and finding information about plans, hotspot, fleet and IoT connectivity and driver benefits. " +
    "Drixo is an automated assistant, not a person. In this public chat it has no access to personal, billing, order or SIM records, and it does not carry out activations, cancellations, refunds or charges. " +
    "For personal help, visitors sign in securely or use the official support page. Please chat only when parked.",
};

const ABOUT_ASSISTANT = /\b(you|your|yours|yourself|drixo|assistant|chatbot|bot|copilot)\b/i;

function answerDecision(text: string, hits: KbHit[]): Decision {
  return {
    ok: true,
    activeStepId: null,
    classLabel: "GUIDANCE",
    revisionIds: hits.filter((h) => h !== ABOUT_HIT).map((h) => h.revisionId),
    result: {
      responseClass: "GUIDANCE",
      uiState: "S04",
      text,
      quickReplies: [],
      sources: hits.map((h) => h.source),
      actions: [],
      outcome: "NONE",
    },
  };
}

/**
 * Rung 6 of the arbitration ladder (Doc 09): approved knowledge, never earlier. Every gate above has
 * already run. Retrieval is approved-only. The model, if enabled, can only rewrite those excerpts into a
 * short answer, and only a verified rewrite is used; otherwise the approved article text is served verbatim.
 */
async function answerFromKb(text: string, ctx?: TurnContext): Promise<Decision> {
  // Incident switch: with KB_RETRIEVAL off every factual question answers NO_SOURCE (instant,
  // no deploy). Deterministic flows, safety and protected-intent gates are unaffected.
  const flags = await getFlags();
  if (!flags.KB_RETRIEVAL.enabled) {
    emit("kb_lookup", { kbResult: "DISABLED" });
    return noSourceDecision();
  }

  const modelOn = !!ctx && flags.MODEL_SYNTHESIS.enabled && modelEnvEnabled();
  const retrieved = await retrieveApprovedTop(text, modelOn ? 3 : 1);
  // Natural questions about the assistant itself ("how can you help me?") are answered from this fixed,
  // code-reviewed reference. It has no prices, numbers or promises; the model abstains if it is not relevant.
  // Only for questions that address the assistant itself, so every other question reaches the provider
  // with approved article excerpts only (and with none at all when nothing matched: no model call).
  const hits = modelOn && ABOUT_ASSISTANT.test(text) ? [...retrieved, ABOUT_HIT] : retrieved;
  if (hits.length === 0) return noSourceDecision();

  if (modelOn) {
    const r = await synthesizeAnswer(text, hits, ctx!.sessionId);
    if (r.kind === "ANSWER") return answerDecision(r.text, r.hits);
    // The model judged that the approved excerpts do not answer this question: the retrieval match was
    // a false positive, so the honest result is "no source", not a loosely related article.
    if (r.kind === "ABSTAIN") return noSourceDecision();
    // FALLBACK: model unavailable, over budget, refused or failed the output gate: serve approved text.
  }
  if (retrieved.length === 0) return noSourceDecision();
  return answerDecision(retrieved[0].text, [retrieved[0]]);
}

/** Which policy branch produced the answer. A closed set of labels, safe to put in telemetry. */
export type PolicyLabel =
  | "SHORTCUT" | "QUICK_REPLY" | "SECRET" | "EMERGENCY" | "PROTECTED" | "UNSUPPORTED_ACTION"
  | "HUMAN" | "PRICE" | "TOPIC" | "KB_OR_NO_SOURCE";

export async function decideWithPolicy(
  input: TurnInput,
  activeStepId: string | null,
  ctx?: TurnContext,
): Promise<{ decision: Decision; policy: PolicyLabel }> {
  if (input.type === "SHORTCUT") return { decision: entry(input.intentCode as IntentCode), policy: "SHORTCUT" };

  if (input.type === "QUICK_REPLY") {
    const active = activeStepId ? getStep(activeStepId) : undefined;
    if (!active || active.id !== input.stepId) return { decision: { ok: false, reason: "STALE" }, policy: "QUICK_REPLY" };
    const option = active.options?.find((o) => o.optionId === input.optionId);
    const next = option ? getStep(option.next) : undefined;
    if (!next) return { decision: { ok: false, reason: "STALE" }, policy: "QUICK_REPLY" };
    return { decision: render(next), policy: "QUICK_REPLY" };
  }

  // TEXT: server policy decides, in precedence order. Nothing in the text can alter this.
  const c = classifyText(input.text);
  switch (c.kind) {
    case "SECRET":
      return { decision: render(FIXED["secret-warning"]), policy: "SECRET" };
    case "EMERGENCY":
      return { decision: render(FIXED.emergency), policy: "EMERGENCY" };
    case "PROTECTED":
      return { decision: render(FIXED["gate-account"]), policy: "PROTECTED" };
    case "UNSUPPORTED_ACTION":
      return { decision: render(FIXED["gate-action"]), policy: "UNSUPPORTED_ACTION" };
    case "HUMAN":
      return { decision: render(FIXED.human), policy: "HUMAN" };
    case "PRICE": {
      // Only an approved, effective article may speak to price; otherwise the fixed NO_SOURCE copy.
      const d = await answerFromKb(input.text, ctx);
      return { decision: d.ok && d.revisionIds.length ? d : render(FIXED.price), policy: "PRICE" };
    }
    case "TOPIC":
      return { decision: entry(c.intent), policy: "TOPIC" };
    case "ABOUT": {
      const d = await answerFromKb(input.text, ctx);
      // Model off/unavailable: the fixed welcome is still a useful answer.
      return { decision: d.ok && d.result.responseClass !== "NO_SOURCE" ? d : render(FIXED.welcome), policy: "TOPIC" };
    }
    case "WELCOME":
      return { decision: render(FIXED.welcome), policy: "TOPIC" };
    default:
      return { decision: await answerFromKb(input.text, ctx), policy: "KB_OR_NO_SOURCE" };
  }
}

export async function decide(input: TurnInput, activeStepId: string | null): Promise<Decision> {
  return (await decideWithPolicy(input, activeStepId)).decision;
}
