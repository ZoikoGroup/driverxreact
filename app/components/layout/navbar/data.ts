import {
  Award,
  BookOpen,
  Building2,
  CreditCard,
  Cpu,
  Gift,
  Handshake,
  Headphones,
  HelpCircle,
  Layers,
  LifeBuoy,
  Map,
  Mail,
  Navigation,
  Phone,
  RefreshCw,
  Route,
  ShoppingCart,
  SlidersHorizontal,
  Smartphone,
  Truck,
  User,
  Users,
  Wifi,
  Zap,
  Accessibility,
  Car,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type MenuLink = {
  title: string;
  text: string;
  href: string;
  icon: LucideIcon;
};

export type MenuGroup = {
  heading: string;
  links: readonly MenuLink[];
};

export type Dropdown = {
  key: string;
  label: string;
  headerIcon: LucideIcon;
  eyebrow: string;
  title: string;
  subtitle: string;
  groups: readonly MenuGroup[];
  note: string;
  noteLink: { label: string; href: string };
  card: {
    eyebrow: string;
    title: string;
    text: string;
    cta: string;
    href: string;
    image: string;
    imageAlt: string;
  };
};

const k = (
  title: string,
  text: string,
  icon: LucideIcon,
  href = "#",
): MenuLink => ({ title, text, icon, href });

export const DROPDOWNS: readonly Dropdown[] = [
  {
    key: "plans",
    label: "Plans & Pricing",
    headerIcon: Smartphone,
    eyebrow: "Driver-ready plans",
    title: "Find your next connection.",
    subtitle: "Explore flexible wireless options for your workday.",
    groups: [
      {
        heading: "Personal wireless",
        links: [
          k(
            "Prepaid Plans",
            "Pay upfront and stay in control.",
            Smartphone,
            "/prepaid-plans",
          ),
          k(
            "Postpaid Plans",
            "Flexible monthly plan choices.",
            Layers,
            "/postpaid-plans",
          ),
          k(
            "Data-Only Plans",
            "Connections for tablets and hotspots.",
            Wifi,
            "/data-only-plans",
          ),
        ],
      },
      {
        heading: "Business connectivity",
        links: [
          k(
            "Business Plans",
            "Wireless service for your team.",
            FileText,
            "/business-plans",
          ),
          k(
            "Fleet & Logistics",
            "Connectivity for vehicles and operations.",
            Truck,
            "/fleet-logistics-connectivity",
          ),
        ],
      },
      {
        heading: "Get connected",
        links: [
          k(
            "Compare All Plans",
            "Explore plan types side by side.",
            SlidersHorizontal,
            "/plans",
          ),
          k(
            "Top-Up Plans",
            "Find options to add more service.",
            RefreshCw,
            "/top-up-plans",
          ),
          k(
            "Activate SIM / eSIM",
            "Start service with your SIM or eSIM.",
            CreditCard,
            "/activate-your-esim-psim",
          ),
        ],
      },
    ],
    note: "Every plan shows its price, data, hotspot terms and Broadband Consumer Label before you buy.",
    noteLink: { label: "See plan details", href: "/plans" },
    card: {
      eyebrow: "SIM & eSIM ready",
      title: "Power your workday.",
      text: "A connection that works wherever your job takes you.",
      cta: "Explore all plans",
      href: "/plans",
      image: "/images/navbar/n1.png",
      imageAlt: "Driver smiling in a vehicle",
    },
  },
  {
    key: "solutions",
    label: "Solutions",
    headerIcon: Route,
    eyebrow: "Made for work in motion",
    title: "Connected for every mile.",
    subtitle:
      "Find the setup that matches your role and the devices you rely on.",
    groups: [
      {
        heading: "Individuals & teams",
        links: [
          k(
            "Gig & Delivery Drivers",
            "Plans for rideshare and delivery work.",
            Car,
            "/gig-delivery-driver-plans",
          ),
          k(
            "Fleet & Logistics",
            "Connectivity for vehicles and operations.",
            Truck,
            "/fleet-logistics-connectivity",
          ),
        ],
      },
      {
        heading: "Connected operations",
        links: [
          k(
            "Telematics & IoT",
            "Connect trackers, sensors and in-vehicle devices.",
            Cpu,
            "/telematics-iot-integrations",
          ),
          k(
            "Business Plans",
            "Wireless service for your team.",
            FileText,
            "/business-plans",
          ),
        ],
      },
      {
        heading: "Specialist support",
        links: [
          k(
            "Talk to a Solution Architect",
            "Plan a deployment with our team.",
            Users,
            "/talk-to-a-solution-architect",
          ),
          k(
            "Contact Enterprise Sales",
            "Pricing and onboarding for larger teams.",
            Mail,
            "/contact-enterprise-sales",
          ),
        ],
      },
    ],
    note: "Running a fleet or a larger team? Our business team can help you plan lines and devices.",
    noteLink: { label: "Talk to sales", href: "/contact-enterprise-sales" },
    card: {
      eyebrow: "Solutions",
      title: "Every route, connected.",
      text: "From a single driver to a full fleet, start with the work you do.",
      cta: "Explore solutions",
      href: "/fleet-logistics-connectivity",
      image: "/images/navbar/n2.png",
      imageAlt: "Truck driving at sunset",
    },
  },
  {
    key: "benefits",
    label: "Driver Benefits",
    headerIcon: Award,
    eyebrow: "The driver advantage",
    title: "Built around your day.",
    subtitle:
      "Plans, help and service details shaped for people who drive for a living.",
    groups: [
      {
        heading: "Driver essentials",
        links: [
          k(
            "Driver-Focused Plans",
            "Plans shaped around driving work.",
            Car,
            "/gig-delivery-driver-plans",
          ),
          k(
            "Compare Plans",
            "See plan types side by side.",
            SlidersHorizontal,
            "/plans",
          ),
          k(
            "Top-Up Plans",
            "Add service when you need it.",
            RefreshCw,
            "/top-up-plans",
          ),
        ],
      },
      {
        heading: "Help on the road",
        links: [
          k(
            "Driver Support",
            "Help with your service and account.",
            LifeBuoy,
            "/24-7-driver-support",
          ),
          k(
            "Self-Service FAQs",
            "Quick answers whenever you need them.",
            BookOpen,
            "/faqs-self-service",
          ),
        ],
      },
      {
        heading: "Service confidence",
        links: [
          k(
            "Network Coverage",
            "How coverage and performance work.",
            Map,
            "https://mvnoc.ai/coverage-map",
          ),
          k(
            "Accessibility & Languages",
            "Options that make service easier to use.",
            Accessibility,
            "/accessibility-language-options",
          ),
        ],
      },
    ],
    note: "Partner offers appear only while a program is active, and each one shows its eligibility and terms.",
    noteLink: { label: "View partner offers", href: "/partner-offer-program" },
    card: {
      eyebrow: "Driver benefits",
      title: "Made for life behind the wheel.",
      text: "Clear plans, real help and honest coverage information.",
      cta: "Explore benefits",
      href: "/gig-delivery-driver-plans",
      image: "/images/navbar/nbox.png",
      imageAlt: "Delivery driver holding boxes",
    },
  },
  {
    key: "partners",
    label: "Partners",
    headerIcon: Handshake,
    eyebrow: "Grow with DriverX",
    title: "Stronger connections. Together.",
    subtitle: "Programs for businesses that serve professional drivers.",
    groups: [
      {
        heading: "Partner programs",
        links: [
          k(
            "Become a DriverX Partner",
            "Apply to join our partner network.",
            Handshake,
            "/become-a-driverx-partner",
          ),
          k(
            "Partner Offer Program",
            "Bring an offer to our drivers.",
            Gift,
            "/partner-offer-program",
          ),
          k(
            "Partner with DriverX",
            "Explore ways to work together.",
            Users,
            "/partner-with-driverx",
          ),
        ],
      },
      {
        heading: "Technology & business",
        links: [
          k(
            "Telematics & IoT Integrations",
            "Connect your devices and platforms.",
            Cpu,
            "/telematics-iot-integrations",
          ),
          k(
            "Talk to a Solution Architect",
            "Scope an integration with our team.",
            SlidersHorizontal,
            "/talk-to-a-solution-architect",
          ),
        ],
      },
      {
        heading: "Contact",
        links: [
          k(
            "Contact Enterprise Sales",
            "For larger buyers and deployments.",
            Mail,
            "/contact-enterprise-sales",
          ),
        ],
      },
    ],
    note: "Buying wireless for your own fleet rather than partnering? Our enterprise team can help.",
    noteLink: {
      label: "Contact enterprise sales",
      href: "/contact-enterprise-sales",
    },
    card: {
      eyebrow: "Partners",
      title: "Reach drivers who keep business moving.",
      text: "Bring relevant services to professional drivers.",
      cta: "Become a partner",
      href: "/become-a-driverx-partner",
      image: "/images/navbar/n3.png",
      imageAlt: "Row of white delivery vans",
    },
  },
  {
    key: "shop",
    label: "Shop",
    headerIcon: ShoppingCart,
    eyebrow: "Your connection starts here",
    title: "Find it. Set it up. Go.",
    subtitle: "Plans, phones, refills and activation, each in its own place.",
    groups: [
      {
        heading: "Wireless plans",
        links: [
          k(
            "Prepaid Plans",
            "Pay upfront and stay in control.",
            Smartphone,
            "/prepaid-plans",
          ),
          k(
            "Postpaid Plans",
            "Flexible monthly plan choices.",
            Layers,
            "/postpaid-plans",
          ),
          k(
            "Data-Only Plans",
            "Connections for tablets and hotspots.",
            Wifi,
            "/data-only-plans",
          ),
        ],
      },
      {
        heading: "Devices & extras",
        links: [
          k(
            "Shop Phones & Accessories",
            "Phones and gear for the road.",
            ShoppingCart,
            "/product/shop",
          ),
          k(
            "Top-Up Plans",
            "Add more service when you need it.",
            RefreshCw,
            "/top-up-plans",
          ),
        ],
      },
      {
        heading: "Start service",
        links: [
          k(
            "Activate SIM / eSIM",
            "Start service with your SIM or eSIM.",
            CreditCard,
            "/activate-your-esim-psim",
          ),
          k("Join DriverX", "Sign up for new service.", Zap, "/register"),
        ],
      },
    ],
    note: "Bringing your own phone? Check it works with DriverX before you buy a plan.",
    noteLink: { label: "Check compatibility", href: "/faqs-self-service" },
    card: {
      eyebrow: "Shop",
      title: "Ready when you are.",
      text: "Pick a plan, choose a device and activate on your schedule.",
      cta: "Explore shop",
      href: "/product/shop",
      image: "/images/navbar/nxm.png",
      imageAlt: "Phones showing the DriverX app",
    },
  },
  {
    key: "support",
    label: "Support",
    headerIcon: LifeBuoy,
    eyebrow: "Help for the road ahead",
    title: "Support that moves with you.",
    subtitle:
      "Help, account access and service information, even when you're signed out.",
    groups: [
      {
        heading: "Get help",
        links: [
          k(
            "Driver Support",
            "Help with your service and account.",
            LifeBuoy,
            "/24-7-driver-support",
          ),
          k(
            "FAQs & Self-Service",
            "Quick answers and step-by-step guides.",
            BookOpen,
            "/faqs-self-service",
          ),
          k(
            "Fleet Priority Line",
            "Support for business accounts.",
            Truck,
            "/fleet-priority-line",
          ),
        ],
      },
      {
        heading: "Account & activation",
        links: [
          k(
            "Activate SIM / eSIM",
            "Start service with your SIM or eSIM.",
            CreditCard,
            "/activate-your-esim-psim",
          ),
          k(
            "Top-Up Plans",
            "Add more service when you need it.",
            RefreshCw,
            "/top-up-plans",
          ),
          k("Log In", "Manage your DriverX account.", User, "/login"),
        ],
      },
      {
        heading: "Accessibility & coverage",
        links: [
          k(
            "Accessibility & Languages",
            "Options that make service easier to use.",
            Accessibility,
            "/accessibility-language-options",
          ),
          k(
            "Network Coverage",
            "How coverage and performance work.",
            Map,
            "https://mvnoc.ai/coverage-map",
          ),
        ],
      },
    ],
    note: "Prefer to talk? Call +1 (800) 399-0087 or email info@driverxmobile.com.",
    noteLink: { label: "Email support", href: "mailto:info@driverxmobile.com" },
    card: {
      eyebrow: "Help Center",
      title: "Real answers, built for drivers.",
      text: "Search guides on activation, billing and coverage.",
      cta: "Visit Help Center",
      href: "/24-7-driver-support",
      image: "/images/navbar/n6.png",
      imageAlt: "City skyline at sunset with a road",
    },
  },
] as const;

// Silence unused-import lint for icons kept handy for future edits.
export const SPARE_ICONS = [
  Building2,
  Headphones,
  HelpCircle,
  Navigation,
  Phone,
];

export const LOGIN = { label: "Log in", href: "/login" } as const;
export const CTA = { label: "Get Connected", href: "/register" } as const;
