export type FooterLink = { label: string; href: string };

export type FooterColumn = {
  title: string;
  links: readonly FooterLink[];
};

export const CTA = {
  title: "Stay connected",
  highlight: "wherever work takes you.",
  primary: { label: "Explore plans", href: "/prepaid-plans" },
  secondary: { label: "Check coverage", href: "https://mvnoc.ai/coverage-map" },
} as const;

export const CONTACTS = {
  location: {
    label: "Location",
    lines: ["418 Broadway, STE R", "Albany, NY 12207"],
    href: "https://maps.google.com/?q=418+Broadway,+STE+R,+Albany,+NY+12207",
  },
  email: {
    label: "Email",
    value: "info@driverxmobile.com",
    href: "mailto:info@driverxmobile.com",
  },
  phone: {
    label: "Phone",
    value: "+1 (800) 399-0087",
    href: "tel:+18003990087",
  },
} as const;

export const COLUMNS: readonly FooterColumn[] = [
  {
    title: "Plans & Pricing",
    links: [
      { label: "Compare All Plans", href: "/prepaid-plans" },
      { label: "Prepaid Plans", href: "/prepaid-plans" },
      { label: "Postpaid Plans", href: "/postpaid-plans" },
      { label: "Business Plans", href: "/business-plans" },
      { label: "Data-Only Plans", href: "/data-only-plans" },
      { label: "Top-Up Plans", href: "/top-up-plans" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Gig & Delivery Drivers", href: "/gig-delivery-driver-plans" },
      { label: "Fleet & Logistics", href: "/fleet-logistics-connectivity" },
      { label: "Telematics & IoT", href: "/telematics-iot-integrations" },
      { label: "Business Connectivity", href: "/fleet-logistics-connectivity" },
      { label: "Enterprise Sales", href: "/contact-enterprise-sales" },
    ],
  },
  {
    title: "Driver Benefits",
    links: [
      { label: "Driver-Focused Plans", href: "/gig-delivery-driver-plans" },
      { label: "Partner Offers", href: "/partner-offer-program" },
      {
        label: "Coverage & Connectivity",
        href: "https://mvnoc.ai/coverage-map",
      },
      { label: "Driver Support", href: "/24-7-driver-support" },
      { label: "Self-Service Guides", href: "/faqs-self-service" },
    ],
  },
  {
    title: "Partners",
    links: [
      { label: "Become a Partner", href: "/become-a-driverx-partner" },
      { label: "Partner Offer Program", href: "/partner-offer-program" },
      {
        label: "Technology Integrations",
        href: "/telematics-iot-integrations",
      },
      { label: "Partner with DriverX", href: "/partner-with-driverx" },
      { label: "Contact Enterprise Sales", href: "/contact-enterprise-sales" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Phones & Accessories", href: "/product/shop" },
      { label: "Compare Wireless Plans", href: "/prepaid-plans" },
      { label: "Top-Ups", href: "/top-up-plans" },
      { label: "SIM & eSIM Activation", href: "/product/shop" },
      { label: "Get Connected", href: "/register" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center / FAQs", href: "/faqs-self-service" },
      { label: "Driver Support", href: "/24-7-driver-support" },
      { label: "Fleet Priority Line", href: "/fleet-priority-line" },
      {
        label: "Coverage & Performance",
        href: "/network-coverage-performance",
      },
      { label: "Account Login", href: "/login" },
      { label: "Accessibility", href: "/accessibility-language-options" },
    ],
  },
] as const;

export const QUICK_LINKS: readonly (FooterLink & { active?: boolean })[] = [
  { label: "Company", href: "/about-us", active: true },
  { label: "Network Coverage", href: "https://mvnoc.ai/coverage-map" },
  { label: "Partner with DriverX", href: "/partner-with-driverx" },
  {
    label: "Accessibility & Languages",
    href: "/accessibility-language-options",
  },
  { label: "Contact", href: "/contact-enterprise-sales" },
] as const;

export const LEGAL_LINKS: readonly FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service-legal" },
  { label: "Refund & Service Policies", href: "/refund-service-guarantees" },
  { label: "Cookie Preferences", href: "/cookie-preferences-opt-out" },
  { label: "Accessibility", href: "/accessibility-language-options" },
] as const;

export const COPYRIGHT = "© 2026 DriverX Mobile. All rights reserved.";

export const DISCLAIMER =
  "Network availability varies by location and device. Plan prices, data allowances and terms are shown on each plan page and in our Broadband Consumer Label.";
