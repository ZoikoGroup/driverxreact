"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check, Loader2, SignalHigh } from "lucide-react";
import { BuyPlanModal, type Plan } from "../BuyPlanModal";
import { EnquiryModal } from "../EnquiryModal";

/** Normalise a plan name for matching home cards to API plans. */
const normalizeName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Find the live API plan that corresponds to a home-page card (by name, then by price). */
function findApiPlan(card: { name: string; price: string }, apiPlans: Plan[]): Plan | undefined {
  const active = apiPlans.filter((p) => p.is_active);
  const target = normalizeName(card.name);
  const byName = active.find((p) => normalizeName(p.name) === target);
  if (byName) return byName;
  const price = Number(card.price.replace(/[^0-9.]/g, ""));
  const byPrice = active.filter((p) => p.final_price === price);
  return byPrice.length === 1 ? byPrice[0] : undefined;
}

const AUDIENCES = [
  "Rideshare drivers",
  "Delivery professionals",
  "Truckers & logistics",
  "Fleets & businesses",
] as const;

const TABS = [
  { label: "Prepaid", key: "/prepaid-plans" },
  { label: "Postpaid", key: "/postpaid-plans" },
  { label: "Data-Only", key: "/data-only-plans" },
  { label: "Business & Fleet", key: "/business-plans" },
] as const;

const PLANS_MAP: Record<string, any[]> = {
  "/prepaid-plans": [
    {
      name: "DriverX Starter 5",
      tagline: "For lighter workweeks",
      price: "$16",
      data: "5 GB",
      thereafter: "Unlimited 2G data thereafter",
      features: [
        { text: "1 GB mobile hotspot", sub: null },
        { text: "Unlimited U.S. talk & text", sub: null },
        { text: "Calls & texts to 100+ countries", sub: null },
      ],
      cta: "Choose Starter 5",
      href: "/prepaid-plans",
      details: "/prepaid-plans",
      featured: false,
    },
    {
      name: "DriverX Cruise 15",
      tagline: "For regular gig drivers",
      price: "$38",
      data: "15 GB",
      thereafter: "Unlimited 2G data thereafter",
      features: [
        { text: "5 GB mobile hotspot", sub: null },
        { text: "Unlimited talk & text", sub: "U.S., Canada & Mexico" },
        { text: "Calls & texts to 100+ countries", sub: null },
      ],
      cta: "Choose Cruise 15",
      href: "/prepaid-plans",
      details: "/prepaid-plans",
      featured: false,
    },
    {
      name: "DriverX Power 25",
      tagline: "For multi-app workdays",
      price: "$57",
      data: "25 GB",
      thereafter: "Unlimited 2G data thereafter",
      features: [
        { text: "15 GB mobile hotspot", sub: null },
        { text: "Unlimited talk & text", sub: "U.S., Canada & Mexico" },
        { text: "International calls, texts & roaming", sub: null },
      ],
      cta: "Choose Power 25",
      href: "/prepaid-plans",
      details: "/prepaid-plans",
      featured: true,
    },
    {
      name: "DriverX Unlimited",
      tagline: "For full-time drivers",
      price: "$70",
      data: "35 GB",
      thereafter: "Unlimited 2G data thereafter",
      features: [
        { text: "20 GB mobile hotspot", sub: null },
        { text: "Unlimited talk & text", sub: "U.S., Canada & Mexico" },
        { text: "Calls & texts to 220+ countries", sub: null },
      ],
      cta: "Choose Unlimited",
      href: "/prepaid-plans",
      details: "/prepaid-plans",
      featured: false,
    },
  ],
  "/postpaid-plans": [
    {
      name: "DriverX Flex 7",
      tagline: "Light app usage, part-time drivers",
      price: "$29",
      data: "7 GB",
      thereafter: "Unlimited 2G thereafter",
      features: [
        { text: "2GB Mobile Hotspot", sub: null },
        { text: "Unlimited Talk & Text (U.S. Canada, Mexico only)", sub: null },
        {
          text: "Free International Calls & Texts (to 100+ countries)",
          sub: null,
        },
      ],
      cta: "Buy Plan",
      href: "/postpaid-plans",
      details: "/postpaid-plans",
      featured: false,
    },
    {
      name: "DriverX Essential",
      tagline: "Daily rideshare & delivery drivers",
      price: "$40",
      data: "17 GB",
      thereafter: "Unlimited 2G thereafter",
      features: [
        { text: "7GB Mobile Hotspot", sub: null },
        { text: "Unlimited Talk & Text (U.S, Canada, Mexico only)", sub: null },
        { text: "International Roaming (Select countries)", sub: null },
      ],
      cta: "Buy Plan",
      href: "/postpaid-plans",
      details: "/postpaid-plans",
      featured: false,
    },
    {
      name: "DriverX Infinite",
      tagline: "Full-time Uber, Lyft, truckers & multi-app drivers",
      price: "$55",
      data: "Unlimited",
      thereafter: "High-Speed Data",
      features: [
        { text: "10GB Mobile Hotspot", sub: null },
        {
          text: "Unlimited Talk & Text (U.S., Canada, Mexico only)",
          sub: null,
        },
        { text: "Free International Calls & Texts (10+ Countries)", sub: null },
      ],
      cta: "Buy Plan",
      href: "/postpaid-plans",
      details: "/postpaid-plans",
      featured: false,
    },
    {
      name: "DriverX Elite",
      tagline: "High-earning, multi-platform gig drivers, truckers",
      price: "$70",
      data: "Unlimited",
      thereafter: "High-Speed Data",
      features: [
        { text: "25GB Mobile Hotspot", sub: null },
        {
          text: "Unlimited Talk & Text (U.S., Canada, Mexico only)",
          sub: null,
        },
        { text: "Free Global Roaming (to 30+ Countries)", sub: null },
      ],
      cta: "Buy Plan",
      href: "/postpaid-plans",
      details: "/postpaid-plans",
      featured: true,
    },
  ],
  "/data-only-plans": [
    {
      name: "Flex 10 Starter",
      tagline: "Data-Only SIM Plan",
      price: "$19",
      data: "10 GB",
      thereafter: "Data Allowance",
      features: [
        { text: "2GB Hotspot", sub: null },
        { text: "5G Access & IoT Mode", sub: null },
        { text: "Available in Prepaid and Postpaid Plans", sub: null },
      ],
      cta: "Buy Plan",
      href: "/data-only-plans",
      details: "/data-only-plans",
      featured: false,
    },
    {
      name: "Flex 20 Essential",
      tagline: "Data-Only SIM Plan",
      price: "$37",
      data: "20 GB",
      thereafter: "Data Allowance",
      features: [
        { text: "5GB Mobile Hotspot", sub: null },
        { text: "5G Access & IoT Mode", sub: null },
        { text: "Available in Prepaid and Postpaid Plans", sub: null },
      ],
      cta: "Buy Plan",
      href: "/data-only-plans",
      details: "/data-only-plans",
      featured: false,
    },
    {
      name: "Flex 50 Pro",
      tagline: "Data-Only SIM Plan",
      price: "$78",
      data: "50 GB",
      thereafter: "Data Allowance",
      features: [
        { text: "15GB Mobile Hotspot", sub: null },
        { text: "5G Access & IoT Mode", sub: null },
        { text: "Available in Prepaid and Postpaid Plans", sub: null },
      ],
      cta: "Buy Plan",
      href: "/data-only-plans",
      details: "/data-only-plans",
      featured: true,
    },
  ],
  "/business-plans": [
    {
      name: "DriverX Fleet 10",
      tagline: "For startups, local operators, and small fleets",
      price: "$28",
      data: "10 GB",
      thereafter: "Unlimited 2G thereafter",
      features: [
        { text: "5GB Mobile Hotspot", sub: null },
        { text: "Unlimited Talk & Text (U.S. Canada, Mexico only)", sub: null },
        { text: "Optional GPS tracking and usage monitoring", sub: null },
      ],
      cta: "Buy Plan",
      href: "/business-plans",
      details: "/business-plans",
      featured: false,
    },
    {
      name: "DriverX Fleet 25",
      tagline: "For expanding teams that need extra power & flexibility",
      price: "$58",
      data: "25 GB",
      thereafter: "Unlimited 2G thereafter",
      features: [
        { text: "10GB Mobile Hotspot", sub: null },
        { text: "Unlimited Talk & Text (Across North America)", sub: null },
        { text: "Full access to the DriverX Portal", sub: null },
      ],
      cta: "Buy Plan",
      href: "/business-plans",
      details: "/business-plans",
      featured: false,
    },
    {
      name: "DriverX Fleet Unlimited",
      tagline: "For fleets that need worry-free data access",
      price: "$110",
      data: "Unlimited",
      thereafter: "High-Speed Data",
      features: [
        { text: "15GB Mobile Hotspot", sub: null },
        {
          text: "Unlimited Talk & Text (U.S., Canada, Mexico only)",
          sub: null,
        },
        { text: "GPS Tracking and full telematics integration", sub: null },
      ],
      cta: "Buy Plan",
      href: "/business-plans",
      details: "/business-plans",
      featured: false,
    },
    {
      name: "DriverX Enterprise Custom",
      tagline: "For organizations with 50+ lines",
      price: "$400",
      data: "Custom",
      thereafter: "Custom Data Selection",
      features: [
        { text: "Shared mobile hotspot pools across fleets", sub: null },
        {
          text: "Integration with GPS, telematics, and driver behavior",
          sub: null,
        },
        {
          text: "Account management with quarterly business reviews",
          sub: null,
        },
      ],
      cta: "Enquire Plan",
      href: "/business-plans",
      details: "/business-plans",
      featured: true,
    },
  ],
};

const FOOTER_LINKS = [
  { label: "Check coverage", href: "https://mvnoc.ai/coverage-map" },
  { label: "Get help choosing", href: "/faqs-self-service" },
] as const;

export default function PlansPricing() {
  const [activeTab, setActiveTab] = useState<string>("/prepaid-plans");
  const router = useRouter();

  // Live plans from the API, cached per category (same source the plan pages use).
  const plansCache = useRef<Record<string, Promise<Plan[]>>>({});
  const [buyPlan, setBuyPlan] = useState<Plan | null>(null);
  const [enquiryPlan, setEnquiryPlan] = useState<Plan | null>(null);
  const [pendingCard, setPendingCard] = useState<string | null>(null);

  const loadCategory = useCallback((tabKey: string): Promise<Plan[]> => {
    const slug = tabKey.replace(/^\//, "");
    if (!plansCache.current[slug]) {
      plansCache.current[slug] = fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/plans/v1/category/${slug}`
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch plans");
          return res.json() as Promise<Plan[]>;
        })
        .catch((err) => {
          delete plansCache.current[slug]; // allow retry on next click
          throw err;
        });
    }
    return plansCache.current[slug];
  }, []);

  // Prefetch the visible tab so the Choose click opens instantly.
  useEffect(() => {
    loadCategory(activeTab).catch(() => {});
  }, [activeTab, loadCategory]);

  const handleChoose = async (card: any) => {
    setPendingCard(card.name);
    try {
      const apiPlans = await loadCategory(activeTab);
      const match = findApiPlan(card, apiPlans);
      if (match) {
        const isEnquiry = match.final_price === 0 || String(card.cta).startsWith("Enquire");
        if (isEnquiry) setEnquiryPlan(match);
        else setBuyPlan(match); // SIM setup steps → /checkout, same as plan pages
        return;
      }
    } catch {
      // fall through to the category page
    } finally {
      setPendingCard(null);
    }
    // No live plan found: fall back to the category page.
    router.push(card.href);
  };

  const currentPlans = PLANS_MAP[activeTab] || PLANS_MAP["/prepaid-plans"];
  const isDataOnly = activeTab === "/data-only-plans";

  return (
    <section className="w-full overflow-x-hidden bg-[#0f1f33] px-6 py-10 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1350px]">
        {/* Header */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-[#f9c80e]">
              <SignalHigh className="h-4 w-4" aria-hidden="true" />
              Plans &amp; pricing
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Built for your workday.
              <span className="block text-[#f9c80e]">
                Priced for your next move.
              </span>
            </h2>
            <p className="mt-4 text-base text-[#b8c4d4]">
              Compare real plans. Find your balance of data, hotspot and monthly
              cost.
            </p>
            <ul className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {AUDIENCES.map((audience, index) => (
                <li key={audience} className="flex items-center gap-4">
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-[#f9c80e]"
                    />
                  )}
                  {audience}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-[160px] w-full max-w-[420px] overflow-hidden rounded-3xl lg:h-[200px] lg:w-[400px] lg:shrink-0">
            <Image
              src="/images/home/14.png"
              alt="Smiling driver behind the wheel of a car"
              fill
              sizes="(min-width: 1024px) 240px, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Tabs */}
        <nav
          aria-label="Plan categories"
          className="mt-8 flex flex-wrap items-center gap-3 border-b border-white/10 pb-5"
        >
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={
                  isActive
                    ? "rounded-full bg-[#f9c80e] px-4 py-2 text-sm font-semibold text-[#0f1f33] cursor-pointer"
                    : "rounded-full border border-white/10 bg-[#1d3250] px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-pointer"
                }
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Plans Grid */}
        <ul
          className={`mt-8 grid gap-5 sm:grid-cols-2 ${
            isDataOnly
              ? "mx-auto max-w-5xl lg:grid-cols-3"
              : "w-full lg:grid-cols-4"
          }`}
        >
          {currentPlans.map((plan: any) => (
            <li
              key={plan.name}
              className={
                plan.featured
                  ? "relative flex flex-col overflow-hidden rounded-xl border-2 border-[#1f6b5c] bg-white p-5 text-[#14233a] shadow-xl"
                  : "relative flex flex-col overflow-hidden rounded-xl bg-white p-5 text-[#14233a]"
              }
            >
              {plan.featured && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1.5 bg-[#f9c80e]"
                />
              )}

              <h3 className="mt-1 text-xl font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-[#5d6b80]">{plan.tagline}</p>

              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-sm text-[#5d6b80]">/mo</span>
              </p>

              <div className="mt-4 rounded-xl bg-[#e8f1ef] px-4 py-4 text-center">
                <p className="text-3xl font-bold text-[#1f6b5c]">{plan.data}</p>
                <p className="mt-1 text-sm font-semibold text-[#1f6b5c]">
                  high-speed data
                </p>
                <p className="mt-1 text-sm text-[#5d6b80]">{plan.thereafter}</p>
              </div>

              <ul className="mt-5 flex-1 space-y-3 border-t border-[#e3e8f0] pt-5">
                {plan.features.map((feature: any) => (
                  <li key={feature.text} className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#1f6b5c]"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm leading-5">{feature.text}</p>
                      {feature.sub && (
                        <p className="text-sm leading-5 text-[#5d6b80]">
                          {feature.sub}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleChoose(plan)}
                disabled={pendingCard === plan.name}
                className={
                  plan.featured
                    ? "mt-6 flex w-full cursor-pointer items-center justify-between rounded-full bg-[#f9c80e] hover:bg-[#e3b810] py-2 pl-5 pr-2 text-sm font-semibold text-[#14233a] transition-colors disabled:cursor-wait disabled:opacity-80"
                    : "mt-6 flex w-full cursor-pointer items-center justify-between rounded-full bg-[#1f5c4f] hover:bg-[#17483e] py-2 pl-5 pr-2 text-sm font-semibold text-white transition-colors disabled:cursor-wait disabled:opacity-80"
                }
              >
                {plan.cta}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#14233a]">
                  {pendingCard === plan.name ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
              </button>

              <Link
                href={plan.details}
                className="mt-4 text-center text-sm font-medium text-[#1f5c4f] hover:underline underline-offset-4"
              >
                View plan details
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer banner */}
        <div className="mt-8 flex flex-col gap-4 rounded-xl border border-white/10 bg-[#1a3350] px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-lg font-semibold">
            Your phone. Your number. Your next move.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-full border border-white hover:bg-white hover:text-[#0f1f33] px-5 py-2 text-sm font-semibold text-white transition-all duration-200"
              >
                {link.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Same checkout flow as the plan pages */}
      {buyPlan && <BuyPlanModal plan={buyPlan} onClose={() => setBuyPlan(null)} />}
      {enquiryPlan && <EnquiryModal plan={enquiryPlan} onClose={() => setEnquiryPlan(null)} />}
    </section>
  );
}
