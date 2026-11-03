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
          k("Prepaid Plans", "Pay upfront and stay in control.", Smartphone),
          k("Postpaid Plans", "Flexible monthly plan choices.", Layers),
          k("Data-Only Plans", "Connections for tablets and hotspots.", Wifi),
        ],
      },
      {
        heading: "Business connectivity",
        links: [
          k("Business Plans", "Wireless service for your team.", FileText),
          k(
            "Fleet & Logistics",
            "Connectivity for vehicles and operations.",
            Truck,
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
          ),
          k("Top-Up Plans", "Find options to add more service.", RefreshCw),
          k(
            "Activate SIM / eSIM",
            "Start service with your SIM or eSIM.",
            CreditCard,
          ),
        ],
      },
    ],
    note: "Every plan shows its price, data, hotspot terms and Broadband Consumer Label before you buy.",
    noteLink: { label: "See plan details", href: "#" },
    card: {
      eyebrow: "SIM & eSIM ready",
      title: "Power your workday.",
      text: "A connection that works wherever your job takes you.",
      cta: "Explore all plans",
      href: "#",
      image: "/images/navbar/1.png",
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
          ),
          k(
            "Fleet & Logistics",
            "Connectivity for vehicles and operations.",
            Truck,
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
          ),
          k("Business Plans", "Wireless service for your team.", FileText),
        ],
      },
      {
        heading: "Specialist support",
        links: [
          k(
            "Talk to a Solution Architect",
            "Plan a deployment with our team.",
            Users,
          ),
          k(
            "Contact Enterprise Sales",
            "Pricing and onboarding for larger teams.",
            Mail,
          ),
        ],
      },
    ],
    note: "Running a fleet or a larger team? Our business team can help you plan lines and devices.",
    noteLink: { label: "Talk to sales", href: "#" },
    card: {
      eyebrow: "Solutions",
      title: "Every route, connected.",
      text: "From a single driver to a full fleet, start with the work you do.",
      cta: "Explore solutions",
      href: "#",
      image: "/images/navbar/2.png",
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
          k("Driver-Focused Plans", "Plans shaped around driving work.", Car),
          k("Compare Plans", "See plan types side by side.", SlidersHorizontal),
          k("Top-Up Plans", "Add service when you need it.", RefreshCw),
        ],
      },
      {
        heading: "Help on the road",
        links: [
          k("Driver Support", "Help with your service and account.", LifeBuoy),
          k(
            "Self-Service FAQs",
            "Quick answers whenever you need them.",
            BookOpen,
          ),
        ],
      },
      {
        heading: "Service confidence",
        links: [
          k("Network Coverage", "How coverage and performance work.", Map),
          k(
            "Accessibility & Languages",
            "Options that make service easier to use.",
            Accessibility,
          ),
        ],
      },
    ],
    note: "Partner offers appear only while a program is active, and each one shows its eligibility and terms.",
    noteLink: { label: "View partner offers", href: "#" },
    card: {
      eyebrow: "Driver benefits",
      title: "Made for life behind the wheel.",
      text: "Clear plans, real help and honest coverage information.",
      cta: "Explore benefits",
      href: "#",
      image: "/images/navbar/box.png",
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
          ),
          k("Partner Offer Program", "Bring an offer to our drivers.", Gift),
          k("Partner with DriverX", "Explore ways to work together.", Users),
        ],
      },
      {
        heading: "Technology & business",
        links: [
          k(
            "Telematics & IoT Integrations",
            "Connect your devices and platforms.",
            Cpu,
          ),
          k(
            "Talk to a Solution Architect",
            "Scope an integration with our team.",
            SlidersHorizontal,
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
          ),
        ],
      },
    ],
    note: "Buying wireless for your own fleet rather than partnering? Our enterprise team can help.",
    noteLink: { label: "Contact enterprise sales", href: "#" },
    card: {
      eyebrow: "Partners",
      title: "Reach drivers who keep business moving.",
      text: "Bring relevant services to professional drivers.",
      cta: "Become a partner",
      href: "#",
      image: "/images/navbar/3.png",
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
          k("Prepaid Plans", "Pay upfront and stay in control.", Smartphone),
          k("Postpaid Plans", "Flexible monthly plan choices.", Layers),
          k("Data-Only Plans", "Connections for tablets and hotspots.", Wifi),
        ],
      },
      {
        heading: "Devices & extras",
        links: [
          k(
            "Shop Phones & Accessories",
            "Phones and gear for the road.",
            ShoppingCart,
          ),
          k("Top-Up Plans", "Add more service when you need it.", RefreshCw),
        ],
      },
      {
        heading: "Start service",
        links: [
          k(
            "Activate SIM / eSIM",
            "Start service with your SIM or eSIM.",
            CreditCard,
          ),
          k("Join DriverX", "Sign up for new service.", Zap),
        ],
      },
    ],
    note: "Bringing your own phone? Check it works with DriverX before you buy a plan.",
    noteLink: { label: "Check compatibility", href: "#" },
    card: {
      eyebrow: "Shop",
      title: "Ready when you are.",
      text: "Pick a plan, choose a device and activate on your schedule.",
      cta: "Explore shop",
      href: "#",
      image: "/images/navbar/xm.png",
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
          k("Driver Support", "Help with your service and account.", LifeBuoy),
          k(
            "FAQs & Self-Service",
            "Quick answers and step-by-step guides.",
            BookOpen,
          ),
          k("Fleet Priority Line", "Support for business accounts.", Truck),
        ],
      },
      {
        heading: "Account & activation",
        links: [
          k(
            "Activate SIM / eSIM",
            "Start service with your SIM or eSIM.",
            CreditCard,
          ),
          k("Top-Up Plans", "Add more service when you need it.", RefreshCw),
          k("Log In", "Manage your DriverX account.", User),
        ],
      },
      {
        heading: "Accessibility & coverage",
        links: [
          k(
            "Accessibility & Languages",
            "Options that make service easier to use.",
            Accessibility,
          ),
          k("Network Coverage", "How coverage and performance work.", Map),
        ],
      },
    ],
    note: "Prefer to talk? Call +1 (800) 399-0087 or email info@driverxmobile.com.",
    noteLink: { label: "Email support", href: "#" },
    card: {
      eyebrow: "Help Center",
      title: "Real answers, built for drivers.",
      text: "Search guides on activation, billing and coverage.",
      cta: "Visit Help Center",
      href: "#",
      image: "/images/navbar/6.png",
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
export const CTA = { label: "Get Connected", href: "#" } as const;
