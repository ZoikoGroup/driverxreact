// DX-FLOW: versioned deterministic flow graphs for the six P0 shortcuts (WF-03..WF-08).
//
// CONTENT STATUS: all copy below is adapted from the Document 06 knowledge drafts, which are
// DRAFT / owner approval required (D-03). It deliberately contains no prices, allowances,
// speeds, hours, outage claims or activation promises, only navigation, safe generic steps
// and caveats. Editorial sign-off must be recorded before launch.
//
// Authority rule: the client can only submit (stepId, optionId) pairs that the server issued
// for the current turn; transitions are decided here, never by the browser.

import type { IntentCode } from "../../../components/drixo/types";
import type { LinkKey } from "./links";

export const FLOW_VERSION = "p0-flows-1";

export type ResponseClass = "GUIDANCE" | "QUESTION" | "AUTH_GATE" | "SUPPORT" | "NO_SOURCE" | "SECRET_WARNING";
export type UiState = "S04" | "S05" | "S06" | "S07" | "S08" | "S09" | "S11";
export type Outcome = "NONE" | "USER_REPORTED_RESOLVED" | "USER_REPORTED_UNRESOLVED" | "UNKNOWN";
export type ActionKind = "OFFICIAL_LINK" | "SHOW_SUPPORT" | "SIGN_IN" | "RESTART";

export interface FlowAction {
  actionId: string;
  kind: ActionKind;
  link?: LinkKey; // resolved through the registry at response time
  label?: string; // only for RESTART (no href)
}

export interface FlowOption {
  optionId: string;
  label: string;
  next: string; // step id
}

export interface FlowStep {
  id: string;
  responseClass: ResponseClass;
  uiState: UiState;
  text: string;
  options?: FlowOption[];
  actions?: FlowAction[];
  outcome?: Outcome;
}

const SUPPORT: FlowAction = { actionId: "SUPPORT", kind: "SHOW_SUPPORT", link: "SUPPORT" };
const SIGN_IN: FlowAction = { actionId: "SIGN_IN", kind: "SIGN_IN", link: "SIGN_IN" };
const RESTART: FlowAction = { actionId: "RESTART", kind: "RESTART", label: "Start over" };
const link = (id: string, key: LinkKey): FlowAction => ({ actionId: id, kind: "OFFICIAL_LINK", link: key });

const RETEST = (prefix: string): FlowOption[] => [
  { optionId: "RETEST_RESOLVED", label: "Yes, it's working", next: "conn-resolved" },
  { optionId: "RETEST_UNRESOLVED", label: "No, still not working", next: "conn-unresolved" },
  { optionId: "RETEST_UNSURE", label: "Not sure", next: "conn-unsure-end" },
];

const STEPS: FlowStep[] = [
  // ---------------- FIX_CONNECTION (WF-03, FR-025..030) ----------------
  {
    id: "conn-step-01",
    responseClass: "QUESTION",
    uiState: "S05",
    text: "Sorry your connection is giving you trouble. Only continue when you're parked. Are calls and texts still working on your phone?",
    options: [
      { optionId: "CALLS_SMS_YES", label: "Yes, they work", next: "conn-data" },
      { optionId: "CALLS_SMS_NO", label: "No, they don't", next: "conn-nosvc" },
      { optionId: "CALLS_SMS_UNSURE", label: "Not sure", next: "conn-data" },
    ],
    actions: [SUPPORT],
  },
  {
    id: "conn-data",
    responseClass: "QUESTION",
    uiState: "S06",
    text: "If calls and texts work but data doesn't, check that mobile data is on for the correct SIM and that airplane mode is off. Then restart your phone and try one app. I can't verify a network outage from this chat. Is it working now?",
    options: RETEST("data"),
    actions: [SUPPORT],
  },
  {
    id: "conn-nosvc",
    responseClass: "QUESTION",
    uiState: "S06",
    text: "When you're safely parked, check that your phone recognizes the SIM, then restart it. Reception can also depend on where you are. I can't verify a network outage from this chat. Is it working now?",
    options: RETEST("nosvc"),
    actions: [SUPPORT],
  },
  {
    id: "conn-resolved",
    responseClass: "GUIDANCE",
    uiState: "S04",
    outcome: "USER_REPORTED_RESOLVED",
    text: "Glad it's working again. I can't verify the network from here, so if the problem comes back, contact official support.",
    actions: [SUPPORT, RESTART],
  },
  {
    id: "conn-unresolved",
    responseClass: "SUPPORT",
    uiState: "S08",
    outcome: "USER_REPORTED_UNRESOLVED",
    text: "Sorry it's still not working. I can't verify a network outage or repair your connection from this chat. Please contact official support.",
    actions: [SUPPORT, link("HELP", "HELP_FAQ"), RESTART],
  },
  {
    id: "conn-unsure-end",
    responseClass: "SUPPORT",
    uiState: "S08",
    outcome: "UNKNOWN",
    text: "No problem. I can't confirm whether it's fixed from here. If you're still having trouble, official support can help.",
    actions: [SUPPORT, link("HELP", "HELP_FAQ"), RESTART],
  },

  // ---------------- ACTIVATE_SIM_ESIM (WF-04, FR-031..036) ----------------
  {
    id: "sim-step-01",
    responseClass: "QUESTION",
    uiState: "S05",
    text: "Which kind of SIM are you setting up? Buying a plan and activating service are separate steps. I can't activate service from this chat.",
    options: [
      { optionId: "SIM_ESIM", label: "eSIM", next: "sim-esim" },
      { optionId: "SIM_PHYSICAL", label: "Physical SIM", next: "sim-psim" },
      { optionId: "SIM_UNSURE", label: "Not sure", next: "sim-unsure" },
    ],
    actions: [link("GUIDE", "ACTIVATE_GUIDE")],
  },
  {
    id: "sim-esim",
    responseClass: "GUIDANCE",
    uiState: "S04",
    text: "An eSIM is a digital SIM profile. Before setup, check that your phone supports eSIM and is unlocked, and be ready to connect to Wi-Fi if installation needs a data connection. Follow the official activation instructions. Please don't paste QR codes, PINs or verification codes here.",
    options: [{ optionId: "SIM_KEEP_NUMBER", label: "Moving my number", next: "sim-port" }],
    actions: [link("GUIDE", "ACTIVATE_GUIDE"), SIGN_IN, SUPPORT],
  },
  {
    id: "sim-psim",
    responseClass: "GUIDANCE",
    uiState: "S04",
    text: "For a physical SIM, use your phone maker's instructions to insert the SIM, then restart as directed. Service works only after the official activation process is complete. Please don't share PINs or codes here.",
    options: [{ optionId: "SIM_KEEP_NUMBER", label: "Moving my number", next: "sim-port" }],
    actions: [link("GUIDE", "ACTIVATE_GUIDE"), SIGN_IN, SUPPORT],
  },
  {
    id: "sim-unsure",
    responseClass: "GUIDANCE",
    uiState: "S04",
    text: "A good first check is whether your phone is unlocked and supports eSIM. The official guide explains both options and what you need. I can't check your specific device in this chat.",
    options: [
      { optionId: "SIM_ESIM", label: "eSIM", next: "sim-esim" },
      { optionId: "SIM_PHYSICAL", label: "Physical SIM", next: "sim-psim" },
    ],
    actions: [link("GUIDE", "ACTIVATE_GUIDE"), SUPPORT],
  },
  {
    id: "sim-port",
    responseClass: "GUIDANCE",
    uiState: "S04",
    text: "If you're keeping your number, keep your current service active until the transfer finishes. Never share a transfer PIN or account number in this chat. Use the official secure channel instead. I can't check port status here.",
    actions: [link("GUIDE", "ACTIVATE_GUIDE"), SIGN_IN, SUPPORT],
  },

  // ---------------- PLANS_HOTSPOT (WF-05, FR-037..043) ----------------
  {
    id: "plan-step-01",
    responseClass: "QUESTION",
    uiState: "S05",
    text: "I can point you to current plan information. What best describes how you'll use data?",
    options: [
      { optionId: "USE_RIDESHARE_DELIVERY", label: "Rideshare or delivery", next: "plan-gig" },
      { optionId: "USE_TRUCKING", label: "Trucking or long haul", next: "plan-trucking" },
      { optionId: "USE_FLEET", label: "Fleet or business", next: "fleet-step-01" },
      { optionId: "USE_OTHER", label: "Something else", next: "plan-other" },
    ],
    actions: [link("PLANS", "PLANS")],
  },
  {
    id: "plan-gig",
    responseClass: "GUIDANCE",
    uiState: "S04",
    text: "I can't quote current prices or allowances here because plan details change. The official plans page lists current terms. If you plan to use hotspot, check the published hotspot terms for the plan you choose. Coverage maps predict service, and actual availability can vary by location, device and conditions.",
    actions: [link("PLANS", "PLANS"), link("COVERAGE", "COVERAGE"), SUPPORT],
  },
  {
    id: "plan-trucking",
    responseClass: "GUIDANCE",
    uiState: "S04",
    text: "I can't quote current prices or promise coverage on a route. Coverage maps predict service, and actual availability can vary by location, device and conditions. Check the official coverage and plan pages before you choose.",
    actions: [link("COVERAGE", "COVERAGE"), link("PLANS", "PLANS"), SUPPORT],
  },
  {
    id: "plan-other",
    responseClass: "GUIDANCE",
    uiState: "S04",
    text: "I can't quote current prices or allowances here because plan details change. The official plan pages list current terms, including data-only options for devices other than phones.",
    actions: [link("PLANS", "PLANS"), link("DATA_ONLY", "DATA_ONLY"), SUPPORT],
  },

  // ---------------- BILLING_TOPUPS (WF-06, FR-047..050) ----------------
  // Entry is an immediate AUTH_GATE; see AUTH_GATE_STEP below.

  // ---------------- FLEET_IOT (WF-07, FR-044..045) ----------------
  {
    id: "fleet-step-01",
    responseClass: "QUESTION",
    uiState: "S05",
    text: "Are you looking at connectivity for a new fleet or business, or do you already have a fleet account?",
    options: [
      { optionId: "FLEET_NEW", label: "New fleet or business", next: "fleet-new" },
      { optionId: "FLEET_EXISTING", label: "I have an account", next: "fleet-existing" },
    ],
    actions: [link("FLEET", "FLEET")],
  },
  {
    id: "fleet-new",
    responseClass: "GUIDANCE",
    uiState: "S04",
    text: "DriverX publishes information about fleet and connected-vehicle connectivity. I can't share pricing, availability or line counts here. The official pages and the enterprise sales team can help with your needs.",
    actions: [link("FLEET", "FLEET"), link("IOT", "IOT"), link("SALES", "SALES_CONTACT"), SUPPORT],
  },
  {
    id: "fleet-existing",
    responseClass: "AUTH_GATE",
    uiState: "S07",
    text: "Account-specific fleet help needs a secure sign-in. I can't see fleet lines, vehicles or usage in this public chat.",
    actions: [SIGN_IN, SUPPORT],
  },

  // ---------------- DRIVER_BENEFITS (FR-046) ----------------
  {
    id: "benefits-01",
    responseClass: "GUIDANCE",
    uiState: "S04",
    text: "Current driver benefits, eligibility and expiry dates are published on the official site. I can't confirm specific offers or discounts from this chat, so please check the current terms there.",
    actions: [link("BENEFITS", "BENEFITS"), SUPPORT],
  },
];

const BY_ID = new Map(STEPS.map((s) => [s.id, s]));
export const getStep = (id: string): FlowStep | undefined => BY_ID.get(id);

export const ENTRY_STEP: Record<IntentCode, string> = {
  FIX_CONNECTION: "conn-step-01",
  ACTIVATE_SIM_ESIM: "sim-step-01",
  PLANS_HOTSPOT: "plan-step-01",
  BILLING_TOPUPS: "gate-account",
  FLEET_IOT: "fleet-step-01",
  DRIVER_BENEFITS: "benefits-01",
};

// ---------------- Policy-driven (non-flow) responses ----------------
// Approved templates from Doc 09 where one exists (SECRET_WARNING, AUTH_GATE, NO_SOURCE).
export const FIXED: Record<string, FlowStep> = {
  "gate-account": {
    id: "gate-account",
    responseClass: "AUTH_GATE",
    uiState: "S07",
    text: "I can explain the next steps, but I cannot access or change your account in this public chat. Please sign in securely or use our official support page.",
    actions: [SIGN_IN, SUPPORT],
  },
  "gate-action": {
    id: "gate-action",
    responseClass: "AUTH_GATE",
    uiState: "S07",
    text: "I can't activate, change or move service from this public chat. The official guide explains the steps, and account-specific actions need a secure sign-in.",
    actions: [link("GUIDE", "ACTIVATE_GUIDE"), SIGN_IN, SUPPORT],
  },
  "secret-warning": {
    id: "secret-warning",
    responseClass: "SECRET_WARNING",
    uiState: "S11",
    text: "For your security, please do not share passwords, verification codes, payment card information, or SIM transfer details here. Use the secure sign-in page for account help. If you already shared a secret, consider changing it through the official channel.",
    actions: [SIGN_IN, SUPPORT],
  },
  emergency: {
    id: "emergency",
    responseClass: "GUIDANCE",
    uiState: "S04",
    text: "Your safety comes first. If you're driving, please stop in a safe place before using your phone. If anyone is in danger, call your local emergency number (911 in the U.S.). Drixo can't contact emergency services.",
    actions: [SUPPORT],
  },
  human: {
    id: "human",
    responseClass: "SUPPORT",
    uiState: "S08",
    text: "Here are DriverX Mobile's official support options. Drixo can't transfer you to a person or open a support case from this chat.",
    actions: [SUPPORT, link("HELP", "HELP_FAQ")],
  },
  welcome: {
    id: "welcome",
    responseClass: "QUESTION",
    uiState: "S05",
    text: "Hi, I'm Drixo. I can walk you through fixing a connection, setting up a SIM or eSIM, and where to find plans, fleet and driver-benefit information. I can't see or change your account here. Tap one of the topics above, or tell me what's happening.",
  },
  price: {
    id: "price",
    responseClass: "NO_SOURCE",
    uiState: "S09",
    text: "I can't verify current prices or discounts from approved sources, so I won't guess. The official plans page lists current terms.",
    actions: [link("PLANS", "PLANS"), SUPPORT],
  },
  "no-source": {
    id: "no-source",
    responseClass: "NO_SOURCE",
    uiState: "S09",
    text: "I cannot verify that information from current approved DriverX Mobile sources. Please check the official page or contact support before relying on it.",
    actions: [link("HELP", "HELP_FAQ"), SUPPORT],
  },
};
