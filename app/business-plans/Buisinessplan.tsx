"use client";

// ===== OLD BUSINESS PLANS PAGE (commented out, replaced by new Figma design below) =====
/*
import Image from "next/image";
import SingleCatPlansSection from "../components/SingleCatPlansSection";

const benefits = [
  {
    title: "Centralized Billing & Easy Management Dashboard",
    icon: "🧾",
  },
  {
    title: "Shared Data Pools for Fleets",
    icon: "↕️",
  },
  {
    title: "Free SIM Swap & Device Swap Programs",
    icon: "📱",
  },
  {
    title: "Exclusive Maintenance & Fuel Partnerships",
    icon: "🤝",
  },
  {
    title: "24/7 Dedicated Business Concierge Line",
    icon: "🎧",
  },
];

const Buisinessplans = () => {
  return (
    <>
      <div className="bg-teal-800 py-8">
        <h2 className="text-white text-center font-bold text-2xl">
          DriverX Business Plans
        </h2>
      </div>

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-2 dark:bg-gray-900">
        <div className="grid items-center gap-10 md:grid-cols-2 rounded-3xl overflow-hidden">
          <div className="bg-[#f6fbef] dark:bg-gray-900 py-2 md:py-2 flex flex-col justify-center">
            <h3 className="text-2xl md:text-2xl font-bold text-gray-900 dark:bg-gray-900 dark:text-white ">
              Business Plans Designed for Fleets, 
              <br />Teams & Professional Operations
            </h3>

            <p className="mt-6 text-gray-600 text-lg max-w-md dark:bg-gray-900 dark:text-white">
              Scale your transportation, logistics, or field service operation with plans crafted to maximize uptime, lower costs, and keep your entire team connected on America’s most reliable Tier-1 network.
            </p>
          </div>

          <div className="relative h-[350px] md:h-full">
            <Image
              src="/images/man2.png" 
              alt="Driver advantage"
              fill
              className="object-cover rounded-3xl"
              priority
            />
          </div>
        </div>
      </section>

      <SingleCatPlansSection cat="business-plans"/>

      <section className="relative bg-gradient-to-br from-teal-800 to-teal-600 py-8">
        <h2 className="mb-16 text-center text-3xl font-bold text-white">
          Benefits of DriverX Post-paid Plans
        </h2>

        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20 relative">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center"
            >
              <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl shadow-lg transition group-hover:bg-yellow-400">
                {item.icon}
              </div>

              <div className="mt-[-20px] w-full rounded-xl bg-teal-900 px-6 py-8 text-center text-white transition group-hover:bg-yellow-400 group-hover:text-black">
                <p className="font-semibold leading-snug">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8 dark:bg-gray-900 dark:text-white">
        <div className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-16 items-start dark:bg-gray-900 dark:text-white">
          <div>
            <img
              src="/images/Group 1597883061.png"
              alt="DriverX city scene"
              className="w-full rounded-2xl object-cover"
            />
          </div>

          <div className="space-y-6 dark:bg-gray-900 dark:text-white">
            <h3 className="text-2xl font-bold text-gray-900 dark:bg-gray-900 dark:text-white  ">
              Why Choose DriverX Mobile?
            </h3>

            <div className="space-y-4 dark:bg-gray-900 dark:text-white">
              <div className="flex items-start gap-4">
                <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  ✓
                </span>
                <p className="text-gray-800 dark:bg-gray-900 dark:text-white">
                  Credit-friendly plans with low deposit options
                </p>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  ✓
                </span>
                <p className="text-gray-700 dark:bg-gray-900 dark:text-white">
                  PCI & FCC Compliant • Encrypted billing
                </p>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  ✓
                </span>
                <p className="text-gray-700 dark:bg-gray-900 dark:text-white">
                  Flexible spend caps and no overage shocks
                </p>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  ✓
                </span>
                <p className="text-gray-800 dark:bg-gray-900 dark:text-white">
                  Built-in perks that lower your total cost of driving
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-2 dark:bg-gray-900 dark:text-white">
        <div className="mx-auto max-w-2xl grid grid-cols-1 lg:grid-cols-2 gap-2 items-center px-6">
          <div className="max-w-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 dark:bg-gray-900 dark:text-white">
              Coverage, Features & Control
            </h3>

            <p className="text-gray-900 font-medium mb-4 dark:bg-gray-900 dark:text-white">
              Your phone. Your plan. Your way.
            </p>

            <p className="text-gray-600 leading-relaxed dark:bg-gray-900 dark:text-white">
              Professional drivers trust DriverX Mobile for unmatched connectivity, exclusive cash-back perks, and support designed for the road. It’s more than a plan — it’s your business partner.
            </p>
          </div>

          <div className="flex justify-end">
            <img
              src="/images/Group 1597883060.png"
              alt="Driver using phone"
              className="w-full max-w-[520px] h-[340px] object-cover rounded-3xl"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Buisinessplans;
*/

// ===== NEW BUSINESS PLANS PAGE (Figma design) =====
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Wifi,
  Phone,
  Shield,
  Gauge,
  Star,
  MapPin,
  Laptop,
  Headphones,
  Sliders,
  CreditCard,
  Cpu,
  Plus,
  Minus,
  Info,
  FileText,
  Layers,
  Settings,
} from "lucide-react";
import { BuyPlanModal } from "../components/BuyPlanModal";
import { EnquiryModal } from "../components/EnquiryModal";
import type { Plan } from "../components/BuyPlanModal";

const tabs = [
  { label: "Prepaid", href: "/prepaid-plans" },
  { label: "Postpaid", href: "/postpaid-plans" },
  { label: "Data-Only", href: "/data-only-plans" },
  { label: "Business", href: "/business-plans", active: true },
  { label: "Top-Ups", href: "/top-up-plans" },
  { label: "IoT & Connected Vehicles", href: "/iot-connected-vehicles" },
];

const faqsData = [
  {
    q: "What is included in my monthly price?",
    a: "Your monthly price includes high-speed data, unlimited nationwide talk and text, dedicated mobile hotspot allowance, and full access to DriverX fleet management controls. Transparent pricing with no hidden fees or surprise surcharges.",
  },
  {
    q: "How do data and hotspot allowances work?",
    a: "Each line receives its dedicated high-speed data allowance. Mobile hotspot draws from your plan's dedicated hotspot pool. After the high-speed data is used, data continues at 2G speeds with zero unexpected overage charges.",
  },
  {
    q: "Are tracking and telematics included?",
    a: "Yes, DriverX Fleet plans include optional GPS tracking and usage monitoring through the DriverX portal, with advanced telematics API integrations available for larger fleets.",
  },
  {
    q: "Can I manage all my lines in one portal?",
    a: "Yes. The DriverX Business Management Portal allows administrators to assign lines, view real-time data consumption, manage eSIM activations, adjust allowances, and handle centralized billing seamlessly.",
  },
];

// All plan content below is derived from the API (name, short_description, features).
function getDataAllowanceText(plan: Plan): { feature?: string; primary: string; sub: string } | null {
  const f = plan.features?.find((x) => /data/i.test(x.title) && !/hotspot/i.test(x.title));
  if (!f) return null;
  if (/unlimited/i.test(f.title.split(/[(]/)[0])) return { feature: f.title, primary: "Unlimited data", sub: "Fair use terms apply" };
  const m = f.title.match(/(\d+)\s*GB/i);
  return m ? { feature: f.title, primary: `${m[1]} GB`, sub: "high-speed data" } : null;
}

function featureIcon(title: string) {
  if (/hotspot/i.test(title)) return Wifi;
  if (/talk|text|call/i.test(title)) return Phone;
  if (/gps|track|telematic|portal|fleet/i.test(title)) return Shield;
  return Gauge;
}

const enterpriseIcons = [Layers, CreditCard, Cpu, Settings];

export default function Buisinessplans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [buyPlan, setBuyPlan] = useState<Plan | null>(null);
  const [enquiryPlan, setEnquiryPlan] = useState<Plan | null>(null);
  const [detailModal, setDetailModal] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPlans = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/plans/v1/category/business-plans`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch plans");
        const data: Plan[] = await res.json();
        if (isMounted && Array.isArray(data)) setPlans(data.filter((p) => p.is_active));
      } catch (err) {
        console.warn("Could not fetch business plans:", err);
        if (isMounted) setError("We couldn't load plans right now. Please try again shortly.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPlans();
    return () => {
      isMounted = false;
    };
  }, []);

  const pricedPlans = plans
    .filter((p) => p.final_price > 0)
    .sort((a, b) => a.final_price - b.final_price);

  const customEnterprisePlan =
    plans.find((p) => p.final_price === 0 || p.name.toLowerCase().includes("custom"));

  const enterprise = {
    name: customEnterprisePlan?.name ?? "DriverX Enterprise Custom",
    description: customEnterprisePlan?.short_description || "Connectivity designed around your operation.",
    features: customEnterprisePlan?.features?.length
      ? customEnterprisePlan.features
      : [
          { id: 1, title: "Custom data configurations" },
          { id: 2, title: "Centralized billing & controls" },
          { id: 3, title: "SIM/eSIM deployment" },
          { id: 4, title: "Optional telematics integration" },
        ],
  };

  const handlePlanAction = (plan: Plan) => {
    if (plan.final_price === 0) {
      setEnquiryPlan(plan);
    } else {
      setBuyPlan(plan);
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div
      className={`bg-[#f1f6f4] dark:bg-gray-900 text-[#0f2133] dark:text-white min-h-screen`}
    >
      {/* ── HERO SECTION ────────────────────────────────────────────── */}
      <section className="bg-[#0f2133] overflow-hidden min-h-[300px] sm:min-h-[340px] relative">
        {/* Hero Image on Right */}
        <div className="absolute inset-y-0 right-0 w-full sm:w-[58%] md:w-[52%] lg:w-[807px] h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/new/image (50).png"
            alt="Fleet operations manager standing beside delivery vans"
            className="w-full h-full object-cover object-top"
          />
          {/* Gradient fade to seamlessly blend into navy background */}
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#0f2133] to-transparent" />
        </div>

        {/* Content on Left */}
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-8 py-12 sm:py-16 flex flex-col justify-center min-h-[300px] sm:min-h-[340px]">
          <p className="text-[#f5c518] font-extrabold tracking-wider text-xl uppercase leading-9">
            Business Connectivity
          </p>
          <h1 className="mt-1 text-white font-extrabold text-4xl sm:text-5xl leading-[1.08] tracking-tight max-w-[640px]">
            Keep every driver.
            <br />
            Every route. Connected.
          </h1>
          <p className="mt-3 text-[#e8eeec] text-base sm:text-lg font-normal leading-7 max-w-[480px]">
            Flexible mobile plans for local fleets, growing teams,
            <br className="hidden sm:block" />
            and nationwide operations.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href="#plans"
              className="min-h-11 px-6 py-2.5 bg-white text-[#0f2133] font-bold text-base rounded-[10px] inline-flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-sm"
            >
              Explore fleet plans <ArrowRight size={18} />
            </a>
            <Link
              href="/contact-enterprise-sales"
              className="min-h-11 px-6 py-2.5 border border-white text-white font-bold text-base rounded-[10px] inline-flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              Talk to business sales
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORY TABS ───────────────────────────────────────────── */}
      <nav className="bg-white dark:bg-gray-800 border-b border-[#b2d8d1]">
        <ul className="mx-auto max-w-[1440px] flex justify-start md:justify-center overflow-x-auto scrollbar-hide">
          {tabs.map((t, i) => (
            <li key={t.label} className="flex items-center shrink-0">
              {i > 0 && <span className="h-5 w-px bg-[#aac8d3] self-center" />}
              <Link
                href={t.href}
                className={`relative block px-6 sm:px-7 py-3 text-lg sm:text-xl leading-8 min-h-14 flex items-center transition-colors ${
                  t.active
                    ? "text-[#1d6c5c] font-extrabold after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[5px] after:bg-[#1d6c5c] after:rounded-t-[5px]"
                    : "text-[#0f2133] dark:text-gray-200 font-semibold hover:text-[#1d6c5c]"
                }`}
              >
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── MAIN PLANS SECTION ──────────────────────────────────────── */}
      <div id="plans" className="mx-auto max-w-[1280px] px-4 md:px-8 pt-8 pb-4 flex flex-col gap-5">
        {/* Heading & Subtitle */}
        <div>
          <h2 className="text-[#0f2133] dark:text-white text-3xl sm:text-5xl font-extrabold leading-10 tracking-tight">
            Business plans built to move with you.
          </h2>
          <p className="text-[#4a6a7a] dark:text-gray-400 text-base font-normal mt-1 leading-7">
            Compare transparent data, hotspot and fleet features.
          </p>
        </div>

        {/* Controls Bar: Toggle, Price badge & Compare link */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Price shown per line badge */}
            <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-[#b2d8d1] flex items-center gap-2 text-sm font-medium text-[#0f2133] dark:text-gray-200 shadow-sm">
              <Info size={16} className="text-[#1d6c5c]" />
              <span>Prices shown per line / month</span>
            </div>
          </div>

          <Link
            href="/compare-plans"
            className="text-[#1d6c5c] text-base font-bold underline leading-7 inline-flex items-center gap-1 hover:text-[#155a4c] transition-colors"
          >
            Compare all features <ArrowRight size={16} />
          </Link>
        </div>

        {/* Plan Cards Grid */}
        {loading && <p className="py-10 text-center text-[#4a6a7a]">Loading plans…</p>}
        {!loading && error && <p className="py-10 text-center text-red-500 font-medium">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {pricedPlans.map((plan) => {
            const dataInfo = getDataAllowanceText(plan);
            const isPopular = plan.is_popular;
            const displayPrice = plan.final_price;
            const extraFeatures = (plan.features ?? []).filter((f) => f.title !== dataInfo?.feature);

            const buttonLabel = `Choose ${plan.name.replace("DriverX", "").trim()}`;

            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-[0px_6px_18px_-12px_rgba(16,38,59,0.35)] flex flex-col justify-between hover:shadow-md transition-all duration-200 ${
                  isPopular
                    ? "border-2 border-[#f5c518] dark:border-[#f5c518]"
                    : "border border-[#c8e3de]"
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#f5c518] text-[#0f2133] px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Star size={12} fill="#0f2133" /> Popular for growing teams
                  </div>
                )}

                <div>
                  {/* Card Name */}
                  <h3 className="text-[#0f2133] dark:text-white text-2xl font-extrabold leading-7 tracking-tight mt-1">
                    {plan.name}
                  </h3>

                  {/* Subtitle */}
                  {plan.short_description && (
                    <p className="mt-1 text-[#4a6a7a] dark:text-gray-400 text-sm font-normal min-h-[40px] leading-5">
                      {plan.short_description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="pt-2 flex items-baseline gap-1">
                    <span className="text-[#0f2133] dark:text-white text-5xl font-extrabold leading-[48px]">
                      ${displayPrice}
                    </span>
                    <span className="text-[#4a6a7a] dark:text-gray-400 text-base font-normal leading-7">/line/mo</span>
                  </div>

                  {/* Data Allowance Box */}
                  {dataInfo && (
                    <div className="mt-3.5 mb-3 px-3 py-3.5 bg-[#f0f6f4] dark:bg-gray-700/50 rounded-xl flex flex-col items-center justify-center border border-[#d6ebe6] dark:border-gray-600">
                      <div className="text-[#1d6c5c] dark:text-[#37C4A0] text-4xl sm:text-5xl font-extrabold leading-10 text-center">
                        {dataInfo.primary}
                      </div>
                      <div className="text-[#0f2133] dark:text-gray-200 text-sm font-normal text-center mt-0.5">
                        {dataInfo.sub}
                      </div>
                    </div>
                  )}

                  {/* Features list (from API) */}
                  <div className="pt-2 pb-4 border-t border-[#c8e3de] flex flex-col gap-3 text-sm">
                    {extraFeatures.map((f) => {
                      const FIcon = featureIcon(f.title);
                      // "Unlimited Talk & Text (U.S., Canada & Mexico)" -> bold title + grey sub-line
                      const m = f.title.match(/^(.*?)\s*\((.*)\)\s*$/);
                      const main = m ? m[1] : f.title;
                      const sub = m ? m[2] : "";
                      return (
                        <div key={f.id} className="flex items-start gap-3">
                          <div className="w-5 h-5 flex items-center justify-center text-[#1d6c5c] dark:text-[#37C4A0] shrink-0 mt-0.5">
                            <FIcon size={17} strokeWidth={2.2} />
                          </div>
                          <div className="text-[#0f2133] dark:text-gray-200 leading-tight">
                            <span className="font-bold block">{main}</span>
                            {sub && <span className="text-xs text-[#4a6a7a] dark:text-gray-400">{sub}</span>}
                          </div>
                        </div>
                      );
                    })}

                    {/* Speed rule / data policy (derived from the plan's data feature) */}
                    {dataInfo && dataInfo.primary === "Unlimited data" && (
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 flex items-center justify-center text-[#1d6c5c] dark:text-[#37C4A0] shrink-0 mt-0.5">
                          <FileText size={17} strokeWidth={2.2} />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setDetailModal({
                              title: `${plan.name} - Data Policy`,
                              content: dataInfo.feature ?? "Fair use terms apply.",
                            })
                          }
                          className="text-[#1d6c5c] underline font-bold cursor-pointer text-left"
                        >
                          See data policy
                        </button>
                      </div>
                    )}
                    {dataInfo && dataInfo.primary !== "Unlimited data" && /2G/i.test(dataInfo.feature ?? "") && (
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 flex items-center justify-center text-[#1d6c5c] dark:text-[#37C4A0] shrink-0 mt-0.5">
                          <Gauge size={17} strokeWidth={2.2} />
                        </div>
                        <span className="text-[#0f2133] dark:text-gray-200">
                          After {dataInfo.primary}, speeds reduce to 2G
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom CTA Block */}
                <div>
                  <button
                    type="button"
                    onClick={() => handlePlanAction(plan)}
                    className="w-full min-h-12 py-2 bg-[#1d6c5c] hover:bg-[#155a4c] dark:bg-[#37C4A0] dark:text-gray-900 text-white text-xl font-bold leading-8 rounded-[10px] transition-colors duration-200 text-center cursor-pointer shadow-sm"
                  >
                    {buttonLabel}
                  </button>

                  <div className="pt-3 flex items-center justify-center gap-3.5">
                    <button
                      type="button"
                      onClick={() =>
                        setDetailModal({
                          title: `${plan.name} - Plan Details`,
                          content:
                            "Engineered specifically for commercial fleets. Features nationwide 5G coverage, centralized billing, telematics support, priority fleet routing, and 24/7 dedicated fleet support.",
                        })
                      }
                      className="text-[#1d6c5c] text-base font-normal underline leading-6 cursor-pointer hover:text-[#155a4c]"
                    >
                      Plan details
                    </button>
                    <span className="text-[#aac8d3] text-base font-normal">|</span>
                    <button
                      type="button"
                      onClick={() =>
                        setDetailModal({
                          title: `${plan.name} - Broadband Label`,
                          content: `Broadband Consumer Facts:\n• Provider: DriverX Mobile Business\n• Base Charge: $${plan.final_price}/line/mo\n• 5G Ultra-Wideband & 4G LTE included\n• Upload/Download: 75–250 Mbps typical\n• Fleet discounts apply at checkout`,
                        })
                      }
                      className="text-[#1d6c5c] text-base font-normal underline leading-6 cursor-pointer hover:text-[#155a4c]"
                    >
                      Broadband label
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── ENTERPRISE / 50+ LINES BANNER ─────────────────────────── */}
        <div className="mt-4 bg-[#14473e] text-white rounded-2xl p-6 sm:p-8 shadow-md border border-[#23685c]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[#f5c518] text-xs font-extrabold uppercase tracking-wider block">
                Enterprise / 50+ Lines
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                {enterprise.name}
              </h3>
              <p className="text-gray-200 text-base sm:text-lg mt-1">
                {enterprise.description}
              </p>

              {/* Feature icons row (from API) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {enterprise.features.map((f, i) => {
                  const EIcon = enterpriseIcons[i % enterpriseIcons.length];
                  return (
                    <div key={f.id} className="flex items-center gap-2.5">
                      <EIcon size={20} className="text-[#f5c518] shrink-0" />
                      <span className="text-xs sm:text-sm font-medium leading-tight">{f.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Request a custom quote button */}
            <button
              type="button"
              onClick={() => (customEnterprisePlan ? handlePlanAction(customEnterprisePlan) : (window.location.href = "/contact-enterprise-sales"))}
              className="min-h-12 px-6 py-3 bg-[#f5c518] hover:bg-[#e6b812] text-[#0f2133] text-lg font-extrabold rounded-[10px] inline-flex items-center gap-2 transition-colors shrink-0 shadow-md"
            >
              Request a custom quote <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* ── PLAN YOUR FLEET'S NEXT MOVE BANNER ────────────────────── */}
        <div className="mt-4 px-6 py-4 bg-[#e8f1ee] dark:bg-gray-800 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-[#c8e3de] dark:border-gray-700 shadow-sm">
          <h3 className="text-[#0f2133] dark:text-white text-xl font-extrabold">
            Plan your fleet&apos;s next move.
          </h3>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/network-coverage-performance"
              className="inline-flex items-center gap-1.5 text-base font-bold text-[#1d6c5c] hover:text-[#155a4c] underline"
            >
              <MapPin size={18} /> Check coverage <ArrowUpRight size={16} />
            </Link>
            <span className="h-5 w-px bg-[#89c8bb] hidden sm:block" />
            <Link
              href="/compare-plans"
              className="inline-flex items-center gap-1.5 text-base font-bold text-[#1d6c5c] hover:text-[#155a4c] underline"
            >
              <Laptop size={18} /> Check device compatibility <ArrowUpRight size={16} />
            </Link>
            <span className="h-5 w-px bg-[#89c8bb] hidden sm:block" />
            <Link
              href="/contact-enterprise-sales"
              className="inline-flex items-center gap-1.5 text-base font-bold text-[#1d6c5c] hover:text-[#155a4c] underline"
            >
              <Headphones size={18} /> Speak with business sales <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── FAQ ACCORDION SECTION ───────────────────────────────────── */}
      <section className="mt-10 pt-12 pb-14 bg-[#e8f1ee] dark:bg-gray-800/60 border-t border-[#b2d8d1]">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8 flex flex-col gap-3">
          {faqsData.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.q}
                className="bg-white dark:bg-gray-800 rounded-[10px] border border-[#b2d8d1] overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full min-h-16 px-6 py-4 flex items-center justify-between text-left gap-4"
                >
                  <span className="text-[#0f2133] dark:text-white text-lg font-bold leading-7">
                    {faq.q}
                  </span>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-[#0f2133] dark:text-white shrink-0">
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-gray-700 dark:text-gray-300 text-base leading-relaxed border-t border-gray-100 dark:border-gray-700">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── MODALS ──────────────────────────────────────────────────── */}
      {buyPlan && (
        <BuyPlanModal plan={buyPlan} onClose={() => setBuyPlan(null)} />
      )}
      {enquiryPlan && (
        <EnquiryModal plan={enquiryPlan} onClose={() => setEnquiryPlan(null)} />
      )}

      {/* Detail / Terms Modal */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#c8e3de]">
            <h3 className="text-2xl font-extrabold text-[#0f2133] dark:text-white mb-4">
              {detailModal.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed whitespace-pre-line mb-6">
              {detailModal.content}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModal(null)}
                className="px-6 py-2 bg-[#1d6c5c] hover:bg-[#155a4c] text-white font-bold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}