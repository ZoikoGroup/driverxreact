export type FooterLink = { label: string; href: string };

export type FooterColumn = {
  title: string;
  links: readonly FooterLink[];
};

export const CTA = {
  title: "Stay connected",
  highlight: "wherever work takes you.",
  primary: { label: "Explore plans", href: "#" },
  secondary: { label: "Check coverage", href: "#" },
} as const;

export const CONTACTS = {
  location: {
    label: "Location",
    lines: ["418 Broadway, STE R", "Albany, NY 12207"],
    href: "#",
  },
  email: {
    label: "Email",
    value: "info@driverxmobile.com",
    href: "#",
  },
  phone: {
    label: "Phone",
    value: "+1 (800) 399-0087",
    href: "#",
  },
} as const;

export const COLUMNS: readonly FooterColumn[] = [
  {
    title: "Plans & Pricing",
    links: [
      { label: "Compare All Plans", href: "#" },
      { label: "Prepaid Plans", href: "#" },
      { label: "Postpaid Plans", href: "#" },
      { label: "Business Plans", href: "#" },
      { label: "Data-Only Plans", href: "#" },
      { label: "Top-Up Plans", href: "#" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Gig & Delivery Drivers", href: "#" },
      { label: "Fleet & Logistics", href: "#" },
      { label: "Telematics & IoT", href: "#" },
      { label: "Business Connectivity", href: "#" },
      { label: "Enterprise Sales", href: "#" },
    ],
  },
  {
    title: "Driver Benefits",
    links: [
      { label: "Driver-Focused Plans", href: "#" },
      { label: "Partner Offers", href: "#" },
      { label: "Coverage & Connectivity", href: "#" },
      { label: "Driver Support", href: "#" },
      { label: "Self-Service Guides", href: "#" },
    ],
  },
  {
    title: "Partners",
    links: [
      { label: "Become a Partner", href: "#" },
      { label: "Partner Offer Program", href: "#" },
      { label: "Technology Integrations", href: "#" },
      { label: "Partner with DriverX", href: "#" },
      { label: "Contact Enterprise Sales", href: "#" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Phones & Accessories", href: "#" },
      { label: "Compare Wireless Plans", href: "#" },
      { label: "Top-Ups", href: "#" },
      { label: "SIM & eSIM Activation", href: "#" },
      { label: "Get Connected", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center / FAQs", href: "#" },
      { label: "Driver Support", href: "#" },
      { label: "Fleet Priority Line", href: "#" },
      { label: "Coverage & Performance", href: "#" },
      { label: "Account Login", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  },
] as const;

export const QUICK_LINKS: readonly (FooterLink & { active?: boolean })[] = [
  { label: "Company", href: "#", active: true },
  { label: "Network Coverage", href: "#" },
  { label: "Partner with DriverX", href: "#" },
  { label: "Accessibility & Languages", href: "#" },
  { label: "Contact", href: "#" },
] as const;

export const LEGAL_LINKS: readonly FooterLink[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Refund & Service Policies", href: "#" },
  { label: "Cookie Preferences", href: "#" },
  { label: "Accessibility", href: "#" },
] as const;

export const COPYRIGHT = "© 2026 DriverX Mobile. All rights reserved.";

export const DISCLAIMER =
  "Network availability varies by location and device. Plan prices, data allowances and terms are shown on each plan page and in our Broadband Consumer Label.";
