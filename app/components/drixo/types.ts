// Phase 1 types. Shapes mirror the Doc 04 OpenAPI config contract so the mock
// in config.ts can be swapped for GET /api/v1/drixo/public/config later.

export type IntentCode =
  | "FIX_CONNECTION"
  | "ACTIVATE_SIM_ESIM"
  | "PLANS_HOTSPOT"
  | "BILLING_TOPUPS"
  | "FLEET_IOT"
  | "DRIVER_BENEFITS";

export interface Shortcut {
  intentCode: IntentCode;
  label: string;
  description: string;
  displayOrder: number; // 1-6, locked order (PR-004)
}

export interface SupportTarget {
  kind: "PHONE" | "PAGE";
  label: string;
  href: string;
}

export interface DrixoConfig {
  contractVersion: string;
  locale: "en-US";
  sessionMode: "GUEST";
  features: {
    uploads: false;
    voice: false;
    liveHandoff: false;
    authenticatedTools: false;
    supplierWrites: false;
  };
  shortcuts: Shortcut[];
  supportTargets: SupportTarget[];
  safetyNotice: string;
  privacyUrl: string;
  /** Canary: share (0-100) of visitors who are shown the launcher. Set by Ops via runtime flags. */
  rolloutPercent?: number;
  /** Pages where the launcher must not appear: checkout, payment, sign-in and consent controls (PR-001). */
  suppressedPathPrefixes?: string[];
}

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  // assistant turns only
  turnId?: string;
  responseClass?: ResponseClass;
  quickReplies?: QuickReply[];
  actions?: TurnAction[];
  sources?: TurnSource[];
  rated?: boolean;
  /** Local display time of the message (for example "9:41 AM"). Real clock time, never invented. */
  at?: string;
}

// ---- Phase 3: turn API shapes (Doc 04 envelope) ----
export type ResponseClass =
  | "GUIDANCE"
  | "QUESTION"
  | "AUTH_GATE"
  | "SUPPORT"
  | "NO_SOURCE"
  | "SECRET_WARNING";

export interface QuickReply {
  optionId: string;
  stepId: string;
  label: string;
}

export interface TurnAction {
  actionId: string;
  kind: "OFFICIAL_LINK" | "SHOW_SUPPORT" | "SIGN_IN" | "RESTART";
  label: string;
  href?: string; // server link registry only
}

export interface TurnSource {
  sourceId: string;
  label: string;
  revision: string;
  url: string; // canonical https URL from the approved source registry
}

export interface TurnResult {
  responseClass: ResponseClass;
  uiState: string;
  text: string;
  quickReplies: QuickReply[];
  sources: TurnSource[];
  actions: TurnAction[];
  outcome: string;
}
