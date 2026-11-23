// Server-side public config (GET /v1/drixo/public/config).
// Support hrefs are existing site routes and are PLACEHOLDERS until D-01 (canonical host /
// link registry) and D-05 (verified support channels) are closed. Do not add a phone number
// or staffed hours until D-05 is signed off. The browser never supplies or edits these.

import type { DrixoConfig } from "../../../components/drixo/types";

const CONFIG: DrixoConfig = {
  contractVersion: "1.0.0-proposal",
  locale: "en-US",
  sessionMode: "GUEST",
  features: {
    uploads: false,
    voice: false,
    liveHandoff: false,
    authenticatedTools: false,
    supplierWrites: false,
  },
  shortcuts: [
    { intentCode: "FIX_CONNECTION", label: "Fix my connection", description: "Data, calls or texts not working", displayOrder: 1 },
    { intentCode: "ACTIVATE_SIM_ESIM", label: "Activate SIM / eSIM", description: "Set up your SIM or eSIM", displayOrder: 2 },
    { intentCode: "PLANS_HOTSPOT", label: "Plans & hotspot", description: "Plans, hotspot and coverage info", displayOrder: 3 },
    { intentCode: "BILLING_TOPUPS", label: "Billing & top-ups", description: "Bills, usage and top-ups", displayOrder: 4 },
    { intentCode: "FLEET_IOT", label: "Fleet & IoT", description: "Business, fleet and connected vehicles", displayOrder: 5 },
    { intentCode: "DRIVER_BENEFITS", label: "Driver benefits", description: "DriverXtra benefits", displayOrder: 6 },
  ],
  supportTargets: [
    { kind: "PAGE", label: "Official support", href: "/24-7-driver-support" },
    { kind: "PAGE", label: "Help & FAQs", href: "/faqs-self-service" },
  ],
  safetyNotice: "For your safety, chat only when parked.",
  privacyUrl: "/privacy-policy",
  // Never interrupt a purchase, payment, account-security or consent flow (PRD PR-001, FRS FR-001).
  suppressedPathPrefixes: [
    "/checkout",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/dashboard/billing-payment",
    "/cookie-preferences-opt-out",
  ],
};

export const getPublicConfig = (): DrixoConfig => CONFIG;

export const INTENT_CODES = CONFIG.shortcuts.map((s) => s.intentCode);
