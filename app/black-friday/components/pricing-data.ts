export const PLAN_TABS = [
  { id: "prepaid", label: "Prepaid" },
  { id: "postpaid", label: "Postpaid" },
  { id: "data", label: "Data-Only" },
  { id: "fleet", label: "Business & Fleet" },
] as const;

export type PlanTabId = (typeof PLAN_TABS)[number]["id"];

export const BILLING_PERIODS = [
  { id: "monthly", label: "Monthly" },
  { id: "annually", label: "Annually" },
] as const;

export type BillingPeriodId = (typeof BILLING_PERIODS)[number]["id"];

export type PlanFeature = {
  text: string;
  note?: string;
};

export type Plan = {
  id: string;
  name: string;
  audience: string;
  price: number;
  data: string;
  thereafter: string;
  features: readonly PlanFeature[];
  cta: string;
  href: string;
  detailsHref: string;
  featured?: boolean;
};

const PREPAID_HREF = "/prepaid-plans";
const POSTPAID_HREF = "/postpaid-plans";
const DATA_ONLY_HREF = "/data-only-plans";
const BUSINESS_HREF = "/business-plans";

const PREPAID_TALK_AND_TEXT: PlanFeature = {
  text: "Unlimited talk & text",
  note: "U.S., Canada & Mexico",
};

const PREPAID_PLANS: readonly Plan[] = [
  {
    id: "starter-5",
    name: "DriverX Starter 5",
    audience: "For lighter workweeks",
    price: 16,
    data: "5 GB",
    thereafter: "Unlimited 2G data thereafter",
    features: [
      { text: "1 GB mobile hotspot" },
      { text: "Unlimited U.S. talk & text" },
      { text: "Calls & texts to 100+ countries" },
    ],
    cta: "Choose Starter 5",
    href: PREPAID_HREF,
    detailsHref: PREPAID_HREF,
  },
  {
    id: "cruise-15",
    name: "DriverX Cruise 15",
    audience: "For regular gig drivers",
    price: 38,
    data: "15 GB",
    thereafter: "Unlimited 2G data thereafter",
    features: [
      { text: "5 GB mobile hotspot" },
      PREPAID_TALK_AND_TEXT,
      { text: "Calls & texts to 100+ countries" },
    ],
    cta: "Choose Cruise 15",
    href: PREPAID_HREF,
    detailsHref: PREPAID_HREF,
  },
  {
    id: "power-25",
    name: "DriverX Power 25",
    audience: "For multi-app workdays",
    price: 57,
    data: "25 GB",
    thereafter: "Unlimited 2G data thereafter",
    features: [
      { text: "15 GB mobile hotspot" },
      PREPAID_TALK_AND_TEXT,
      { text: "International calls, texts & roaming" },
    ],
    cta: "Choose Power 25",
    href: PREPAID_HREF,
    detailsHref: PREPAID_HREF,
    featured: true,
  },
  {
    id: "unlimited",
    name: "DriverX Unlimited",
    audience: "For full-time drivers",
    price: 70,
    data: "35 GB",
    thereafter: "Unlimited 2G data thereafter",
    features: [
      { text: "20 GB mobile hotspot" },
      PREPAID_TALK_AND_TEXT,
      { text: "Calls & texts to 220+ countries" },
    ],
    cta: "Choose Unlimited",
    href: PREPAID_HREF,
    detailsHref: PREPAID_HREF,
  },
];

const POSTPAID_PLANS: readonly Plan[] = [
  {
    id: "postpaid-flex-7",
    name: "DriverX Flex 7",
    audience: "Light app usage, part-time drivers",
    price: 29,
    data: "7 GB",
    thereafter: "Unlimited 2G thereafter",
    features: [
      { text: "2GB Mobile Hotspot" },
      { text: "Unlimited Talk & Text (U.S. Canada, Mexico only)" },
      { text: "Free International Calls & Texts (to 100+ countries)" },
    ],
    cta: "Buy Plan",
    href: POSTPAID_HREF,
    detailsHref: POSTPAID_HREF,
  },
  {
    id: "postpaid-essential",
    name: "DriverX Essential",
    audience: "Daily rideshare & delivery drivers",
    price: 40,
    data: "17 GB",
    thereafter: "Unlimited 2G thereafter",
    features: [
      { text: "7GB Mobile Hotspot" },
      { text: "Unlimited Talk & Text (U.S, Canada, Mexico only)" },
      { text: "International Roaming (Select countries)" },
    ],
    cta: "Buy Plan",
    href: POSTPAID_HREF,
    detailsHref: POSTPAID_HREF,
  },
  {
    id: "postpaid-infinite",
    name: "DriverX Infinite",
    audience: "Full-time Uber, Lyft, truckers & multi-app drivers",
    price: 55,
    data: "Unlimited",
    thereafter: "High-Speed Data",
    features: [
      { text: "10GB Mobile Hotspot" },
      { text: "Unlimited Talk & Text (U.S., Canada, Mexico only)" },
      { text: "Free International Calls & Texts (10+ Countries)" },
    ],
    cta: "Buy Plan",
    href: POSTPAID_HREF,
    detailsHref: POSTPAID_HREF,
  },
  {
    id: "postpaid-elite",
    name: "DriverX Elite",
    audience: "High-earning, multi-platform gig drivers, truckers",
    price: 70,
    data: "Unlimited",
    thereafter: "High-Speed Data",
    features: [
      { text: "25GB Mobile Hotspot" },
      { text: "Unlimited Talk & Text (U.S., Canada, Mexico only)" },
      { text: "Free Global Roaming (to 30+ Countries)" },
    ],
    cta: "Buy Plan",
    href: POSTPAID_HREF,
    detailsHref: POSTPAID_HREF,
    featured: true,
  },
];

const DATA_ONLY_FEATURES: readonly PlanFeature[] = [
  { text: "5G Access & IoT Mode" },
  { text: "Available in Prepaid and Postpaid Plans" },
];

const DATA_ONLY_PLANS: readonly Plan[] = [
  {
    id: "data-flex-10",
    name: "Flex 10 Starter",
    audience: "Data-Only SIM Plan",
    price: 19,
    data: "10 GB",
    thereafter: "Data Allowance",
    features: [{ text: "2GB Hotspot" }, ...DATA_ONLY_FEATURES],
    cta: "Buy Plan",
    href: DATA_ONLY_HREF,
    detailsHref: DATA_ONLY_HREF,
  },
  {
    id: "data-flex-20",
    name: "Flex 20 Essential",
    audience: "Data-Only SIM Plan",
    price: 37,
    data: "20 GB",
    thereafter: "Data Allowance",
    features: [{ text: "5GB Mobile Hotspot" }, ...DATA_ONLY_FEATURES],
    cta: "Buy Plan",
    href: DATA_ONLY_HREF,
    detailsHref: DATA_ONLY_HREF,
  },
  {
    id: "data-flex-50",
    name: "Flex 50 Pro",
    audience: "Data-Only SIM Plan",
    price: 78,
    data: "50 GB",
    thereafter: "Data Allowance",
    features: [{ text: "15GB Mobile Hotspot" }, ...DATA_ONLY_FEATURES],
    cta: "Buy Plan",
    href: DATA_ONLY_HREF,
    detailsHref: DATA_ONLY_HREF,
    featured: true,
  },
];

const BUSINESS_PLANS: readonly Plan[] = [
  {
    id: "fleet-10",
    name: "DriverX Fleet 10",
    audience: "For startups, local operators, and small fleets",
    price: 28,
    data: "10 GB",
    thereafter: "Unlimited 2G thereafter",
    features: [
      { text: "5GB Mobile Hotspot" },
      { text: "Unlimited Talk & Text (U.S. Canada, Mexico only)" },
      { text: "Optional GPS tracking and usage monitoring" },
    ],
    cta: "Buy Plan",
    href: BUSINESS_HREF,
    detailsHref: BUSINESS_HREF,
  },
  {
    id: "fleet-25",
    name: "DriverX Fleet 25",
    audience: "For expanding teams that need extra power & flexibility",
    price: 58,
    data: "25 GB",
    thereafter: "Unlimited 2G thereafter",
    features: [
      { text: "10GB Mobile Hotspot" },
      { text: "Unlimited Talk & Text (Across North America)" },
      { text: "Full access to the DriverX Portal" },
    ],
    cta: "Buy Plan",
    href: BUSINESS_HREF,
    detailsHref: BUSINESS_HREF,
  },
  {
    id: "fleet-unlimited",
    name: "DriverX Fleet Unlimited",
    audience: "For fleets that need worry-free data access",
    price: 110,
    data: "Unlimited",
    thereafter: "High-Speed Data",
    features: [
      { text: "15GB Mobile Hotspot" },
      { text: "Unlimited Talk & Text (U.S., Canada, Mexico only)" },
      { text: "GPS Tracking and full telematics integration" },
    ],
    cta: "Buy Plan",
    href: BUSINESS_HREF,
    detailsHref: BUSINESS_HREF,
  },
  {
    id: "fleet-enterprise",
    name: "DriverX Enterprise Custom",
    audience: "For organizations with 50+ lines",
    price: 400,
    data: "Custom",
    thereafter: "Custom Data Selection",
    features: [
      { text: "Shared mobile hotspot pools across fleets" },
      { text: "Integration with GPS, telematics, and driver behavior" },
      { text: "Account management with quarterly business reviews" },
    ],
    cta: "Enquire Plan",
    href: BUSINESS_HREF,
    detailsHref: BUSINESS_HREF,
    featured: true,
  },
];

export const PLANS_BY_TAB: Record<PlanTabId, readonly Plan[]> = {
  prepaid: PREPAID_PLANS,
  postpaid: POSTPAID_PLANS,
  data: DATA_ONLY_PLANS,
  fleet: BUSINESS_PLANS,
};
