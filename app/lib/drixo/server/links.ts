// Canonical destination registry (PR-025 / FR-062). The ONLY source of hrefs in turn
// responses. Flows and the output gate reference keys; the browser and any future model
// output can never supply a URL.
//
// PLACEHOLDER STATUS: these are existing same-site routes in this repo. They are NOT yet
// the approved registry: D-01 (canonical host / www vs non-www), D-05 (verified support
// channels) and D-06 (activation route) must be closed, then these become absolute
// canonical HTTPS URLs. There is no DriverXtra benefits page in this repo, so
// DRIVER_BENEFITS points at the partner offer page until Product names the real one.

export type LinkKey =
  | "SUPPORT"
  | "HELP_FAQ"
  | "SIGN_IN"
  | "ACTIVATE_GUIDE"
  | "PLANS"
  | "DATA_ONLY"
  | "COVERAGE"
  | "FLEET"
  | "IOT"
  | "SALES_CONTACT"
  | "BENEFITS"
  | "PRIVACY";

export interface RegisteredLink {
  label: string;
  href: string;
}

const REGISTRY: Record<LinkKey, RegisteredLink> = {
  SUPPORT: { label: "Official support", href: "/24-7-driver-support" },
  HELP_FAQ: { label: "Help & FAQs", href: "/faqs-self-service" },
  SIGN_IN: { label: "Sign in securely", href: "/login" },
  ACTIVATE_GUIDE: { label: "Official SIM / eSIM guide", href: "/activate-your-esim-psim" },
  PLANS: { label: "View official plans", href: "/plans" },
  DATA_ONLY: { label: "Data-only plans", href: "/data-only-plans" },
  COVERAGE: { label: "Official coverage information", href: "/network-coverage-performance" },
  FLEET: { label: "Fleet connectivity", href: "/fleet-connectivity-without-compromise" },
  IOT: { label: "IoT and connected vehicles", href: "/custom-iot-plans" },
  SALES_CONTACT: { label: "Contact enterprise sales", href: "/contact-enterprise-sales" },
  BENEFITS: { label: "Partner offers", href: "/partner-offer-program" },
  PRIVACY: { label: "Privacy policy", href: "/privacy-policy" },
};

export const resolveLink = (key: LinkKey): RegisteredLink => REGISTRY[key];

/** Used by tests and the output gate: is this href one the registry could have produced? */
export const isRegisteredHref = (href: string): boolean =>
  Object.values(REGISTRY).some((l) => l.href === href);
