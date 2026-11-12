"use client";

// ===== OLD DATA-ONLY PLANS PAGE (commented out, replaced by new Figma design below) =====
/*
import { useEffect, useState } from "react";
import Image from "next/image";
import SingleCatPlansSection from "../components/SingleCatPlansSection";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getPlans() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/plans/`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("API returned error:", res.status);
      return [];
    }

    return await res.json();

  } catch (error) {
    console.error("Error fetching plans:", error);
    return [];
  }
}
export default function DriverXPlans() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const loadPlans = async () => {
      const data = await getPlans();
      setPlans(data);
    };

    loadPlans();
  }, []);

  return (
    <section className="w-full bg-gray-100 dark:bg-gray-900">

      // HEADER
      <div className="bg-[#2f6f66] text-white text-center py-4 text-lg font-semibold">
        DriverX Premium Data Plans Built For Drivers
      </div>

      // HERO
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-6 py-10 px-4">

        <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-xl max-w-md">
          <h2 className="font-semibold text-lg dark:text-white">
            Not Just a Data Plan
          </h2>

          <h3 className="font-bold text-xl mb-2 dark:text-white">
            Your Driver Business Advantage
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            High-speed connectivity for fleets, gig workers, and enterprise drivers.
          </p>
        </div>

        <Image
          src="/images/elderly-passenger-in-back-seat-showing-smartphone-2025-03-13-01-27-29-utc 1.png"
          alt="Driver"
          width={769}
          height={513}
          className="rounded-xl"
        />
      </div>

      <SingleCatPlansSection cat="data-only-plans" heading="Data-Only SIM Plans"/>

      // VOICE BOOST
      <div className="bg-gray-200 dark:bg-gray-800 py-1">

        <div className="max-w-4xl mx-auto text-center border border-gray-300 dark:border-gray-700 py-5 rounded-lg">

          <h3 className="text-lg font-semibold mb-2 dark:text-white">
            Voice Boost Top-Ups
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-8">
            Add voice and text capabilities to any data plan (30-day validity)
          </p>

          <div className="grid md:grid-cols-2 gap-8">

            // CARD 1
            <div className="bg-white dark:bg-gray-900 border-l-4 border-yellow-400 p-6 rounded-xl shadow">

              <h4 className="font-semibold mb-2 dark:text-white">
                Voice Boost 500
              </h4>

              <p className="text-yellow-500 text-xl font-bold">$9</p>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                500 minutes + 500 texts
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Perfect for moderate voice and SMS needs
              </p>

              <button className="mt-4 bg-[#2f6f66] text-white px-6 py-2 rounded-full">
                Buy Top-Up
              </button>

            </div>

            // CARD 2
            <div className="bg-white dark:bg-gray-900 border-l-4 border-yellow-400 p-6 rounded-xl shadow">

              <h4 className="font-semibold mb-2 dark:text-white">
                Voice Boost Max
              </h4>

              <p className="text-yellow-500 text-xl font-bold">$20</p>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Unlimited minutes + Unlimited texts
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Ideal for heavy voice use or multi-purpose SIMs
              </p>

              <button className="mt-4 bg-[#2f6f66] text-white px-6 py-2 rounded-full">
                Buy Top-Up
              </button>

            </div>

          </div>
        </div>
      </div>

      // PREMIUM FEATURES
     <div className="bg-[#e7dfc2] py-8 md:py-16">

  <div className="max-w-6xl mx-auto px-4">

    <h3 className="text-center text-xl md:text-3xl font-semibold mb-10 md:mb-14 text-[#2f6f66] ">
      Premium Features Across All Plans
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-y-12 gap-x-12">

      {
      [
        {
          title: "5G Ultra-Wideband Network",
          desc: "Nationwide 5G Ultra-Wideband coverage with automatic LTE fallback for seamless connectivity wherever you drive.",
          icon: "/images/Group (2).png",
        },
        {
          title: "IoT Optimisation Mode",
          desc: "Specially optimized for telematics, GPS tracking, connected sensors, and smart devices in your vehicle",
          icon: "/images/Vector (17).png",
        },
        {
          title: "Data Rollover",
          desc: "Unused data carries forward on Starter, Essential, and Pro tiers - up to your monthly allowance",
          icon: "/images/Vector (15).png",
        },
        {
          title: "Fleet Priority Support",
          desc: "24/7 commercial-grade support for Enterprise, Unlimited Plus, and Max Ultra tiers.",
          icon: "/images/Vector (18).png",
        },
        {
          title: "No Long-Term Contracts",
          desc: "Complete flexibility to upgrade, downgrade, or cancel your plan anytime without penalties.",
          icon: "/images/Vector (16).png",
        },
        {
          title: "Driver-Focused Design",
          desc: "Built specifically for the unique connectivity needs of professional drivers and fleet operations.",
          icon: "/images/Vector (20).png",
        },
      ].map((feature, i) => (

        <div key={i} className="flex items-start gap-4 md:gap-5">

         <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white  shadow flex items-center justify-center">
  <Image
    src={feature.icon}
    alt={feature.title}
    width={25}
    height={25}
    className="object-contain"
  />
</div>

          <div className="max-w-md">
            <h4 className="font-semibold text-gray-900 text-base md:text-lg">
              {feature.title}
            </h4>

            <p className="text-sm md:text-base text-gray-900  mt-1 leading-relaxed">
              {feature.desc}
            </p>
          </div>

        </div>

      ))}

    </div>

  </div>

</div>

    </section>
  );
}
*/

// ===== NEW DATA-ONLY PLANS PAGE (Figma design) =====
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Laptop, Plus, Minus, Wifi, Radio } from "lucide-react";
import { BuyPlanModal } from "../components/BuyPlanModal";
import { EnquiryModal } from "../components/EnquiryModal";
import type { Plan } from "../components/BuyPlanModal";

const tabs = [
  { label: "Prepaid", href: "/prepaid-plans" },
  { label: "Postpaid", href: "/postpaid-plans" },
  { label: "Data-Only", href: "/data-only-plans", active: true },
  { label: "Business", href: "/business-plans" },
  { label: "Top-Ups", href: "/top-up-plans" },
  { label: "IoT & Connected Vehicles", href: "/iot-connected-vehicles" },
];

const faqsData = [
  {
    q: "What happens when I use my data allowance?",
    a: "Once you reach your high-speed data allowance, your connection continues at reduced speeds (up to 2G/128 kbps) with no overage charges. You can easily add more high-speed data at any time via a top-up in your account dashboard.",
  },
  {
    q: "How does the hotspot allowance work?",
    a: "Your mobile hotspot allowance lets you share your connection with other devices like laptops, tablets, or telematics gear. Hotspot data draws from your plan's dedicated hotspot pool and operates at full 5G/4G LTE speeds until fully used.",
  },
  {
    q: "What fees and billing terms apply?",
    a: "DriverX offers transparent pricing with no hidden fees, surprise charges, or long-term contracts. Monthly plans run on a 30-day billing cycle. You can switch between prepaid and postpaid or cancel anytime without penalties.",
  },
];

function getDataAllowance(plan: Plan): string {
  // First "<n> GB" feature that is not the hotspot line comes from the API.
  const f = plan.features?.find((x) => /\d+\s*GB/i.test(x.title) && !/hotspot/i.test(x.title));
  const m = f?.title.match(/(\d+)\s*GB/i);
  return m ? `${m[1]} GB` : "";
}

function getHotspotAllowance(plan: Plan): string {
  const f = plan.features?.find((x) => /hotspot/i.test(x.title));
  const m = f?.title.match(/(\d+)\s*GB/i);
  return m ? `${m[1]} GB` : "";
}

function getPlanActionLabel(plan: Plan): string {
  if (plan.name.includes("Starter")) return "Choose Starter";
  if (plan.name.includes("Essential")) return "Choose Essential";
  if (plan.name.includes("Pro")) return "Choose Pro";
  return `Choose ${plan.name.replace("DriverX", "").trim()}`;
}

export default function DriverXPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [buyPlan, setBuyPlan] = useState<Plan | null>(null);
  const [enquiryPlan, setEnquiryPlan] = useState<Plan | null>(null);
  const [detailModalPlan, setDetailModalPlan] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPlans = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/plans/v1/category/data-only-plans`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch plans");
        const data: Plan[] = await res.json();
        if (isMounted && Array.isArray(data)) {
          setPlans(data.filter((p) => p.is_active).sort((a, b) => a.final_price - b.final_price));
        }
      } catch (err) {
        console.warn("Could not fetch plans:", err);
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

  const handlePlanAction = (plan: Plan) => {
    if (plan.final_price === 0) {
      setEnquiryPlan(plan);
    } else {
      setBuyPlan(plan);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div
      className={`bg-[#f1f6f4] dark:bg-gray-900 text-[#0f2133] dark:text-white min-h-screen`}
    >
      {/* ── HERO SECTION ────────────────────────────────────────────── */}
      <section className="bg-[#0f2133] overflow-hidden min-h-[256px] relative">
        {/* Background image: right half */}
        <div className="absolute inset-y-0 right-0 w-full sm:w-[56%] md:w-[52%] lg:w-[806px] h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/new/image (49).png"
            alt="Delivery driver checking tablet beside delivery vans"
            className="w-full h-full object-cover object-center"
          />
          {/* Left subtle dark gradient overlay for smooth transition */}
          <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#0f2133] to-transparent" />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-8 py-10 flex flex-col justify-center min-h-[256px]">
          <p className="text-[#f5c518] font-extrabold tracking-wider text-xl uppercase leading-9">
            Data-only plans
          </p>
          <h1 className="mt-1 text-white font-extrabold text-4xl sm:text-5xl leading-[1.08] tracking-tight max-w-[641px]">
            Keep your devices connected.
          </h1>
          <p className="mt-3 text-[#e8eeec] text-base sm:text-lg font-normal leading-7 max-w-[480px]">
            Compare data and hotspot allowances for your
            <br className="hidden sm:block" />
            connected workday.
          </p>
        </div>
      </section>

      {/* ── CATEGORY TABS ───────────────────────────────────────────── */}
      <nav className="bg-white dark:bg-gray-800 border-b border-[#b2d8d1]">
        <ul className="mx-auto flex justify-center items-center overflow-x-auto scrollbar-hide px-4">
          {tabs.map((t, i) => (
            <li key={t.label} className="flex items-center shrink-0">
              {i > 0 && <span className="h-4 w-px bg-[#aac8d3] self-center shrink-0" />}
              <Link
                href={t.href}
                className={`relative block px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold whitespace-nowrap flex items-center transition-colors ${
                  t.active
                    ? "text-[#1d6c5c] font-bold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[3px] after:bg-[#1d6c5c] after:rounded-t-[2px]"
                    : "text-[#0f2133] dark:text-gray-200 hover:text-[#1d6c5c]"
                }`}
              >
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── BRING YOUR OWN DEVICE BANNER ────────────────────────────── */}
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-6">
        <div className="px-6 py-4 bg-[#e8f1ee] dark:bg-gray-800 rounded-2xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-6 border border-[#c8e3de] dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-16 pr-6 border-r border-[#89c8bb] flex items-center justify-center shrink-0">
              <div className="w-11 h-11 rounded-lg bg-white dark:bg-gray-700/60 border border-[#b2d8d1] flex items-center justify-center text-[#1d6c5c] dark:text-[#37C4A0]">
                <Laptop size={26} strokeWidth={2.2} />
              </div>
            </div>
            <h2 className="text-[#0f2133] dark:text-white text-xl sm:text-2xl font-extrabold leading-7 tracking-tight">
              Bringing your own device?
            </h2>
          </div>
          <Link
            href="/compare-plans"
            className="w-full sm:w-auto min-h-11 px-5 py-1.5 bg-white dark:bg-gray-700 rounded-[10px] outline outline-2 outline-offset-[-2px] outline-[#1d6c5c] text-[#1d6c5c] dark:text-[#37C4A0] text-lg font-bold leading-7 text-center hover:bg-[#1d6c5c] hover:text-white transition-colors duration-200"
          >
            Check device compatibility
          </Link>
        </div>
      </div>

      {/* ── MAIN PLANS SECTION ──────────────────────────────────────── */}
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-8 pb-4 flex flex-col gap-6">
        {/* Header row with Title & Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[#0f2133] dark:text-white text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
              Choose your data allowance.
            </h2>
            <p className="text-[#4a6a7a] dark:text-gray-400 text-sm sm:text-base font-normal mt-1 leading-6">
              All three plans offer prepaid and postpaid options.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Compare plan details link */}
            <Link
              href="/compare-plans"
              className="text-[#1d6c5c] text-base font-bold underline leading-7 hover:text-[#155a4c] transition-colors"
            >
              Compare plan details
            </Link>
          </div>
        </div>

        {/* Plan Cards Grid */}
        {loading && <p className="py-10 text-center text-[#4a6a7a]">Loading plans…</p>}
        {!loading && error && <p className="py-10 text-center text-red-500 font-medium">{error}</p>}
        <div className="flex flex-wrap justify-center items-stretch gap-5 pt-4">
          {plans.map((plan) => {
            const dataAllowance = getDataAllowance(plan);
            const hotspotAllowance = getHotspotAllowance(plan);
            const actionLabel = getPlanActionLabel(plan);
            const displayPrice = plan.final_price;

            return (
              <div
                key={plan.id}
                className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] lg:max-w-[305px] min-h-[580px] bg-white dark:bg-gray-800 rounded-2xl border border-[#c8e3de] p-5 shadow-[0px_6px_18px_-12px_rgba(16,38,59,0.35)] flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
              >
                <div>
                  {/* Card Title */}
                  <h3 className="text-[#0f2133] dark:text-white text-2xl font-extrabold leading-7 tracking-tight min-h-[32px]">
                    {plan.name}
                  </h3>

                  {/* Subtitle placeholder for consistent vertical alignment */}
                  <p className="mt-1 text-[#4a6a7a] dark:text-gray-400 text-sm font-normal leading-5 min-h-[40px] flex items-center">
                    {plan.short_description || "High-speed dedicated data for all your connected devices."}
                  </p>

                  {/* Price */}
                  <div className="pt-2 flex items-baseline gap-1 h-12">
                    <span className="text-[#0f2133] dark:text-white text-5xl font-extrabold leading-[48px]">
                      ${displayPrice}
                    </span>
                    <span className="text-[#4a6a7a] dark:text-gray-400 text-base font-normal leading-7">
                      /mo
                    </span>
                  </div>

                  {/* Pricing & Terms */}
                  <div className="pt-1 pb-1 h-7 flex items-center">
                    <button
                      type="button"
                      onClick={() =>
                        setDetailModalPlan({
                          title: `${plan.name} - Pricing & Terms`,
                          content:
                            "Monthly service renews every 30 days. High-speed data is throttled to 2G speeds after monthly allotment is used. No multi-year contracts or termination penalties apply. Taxes and regulatory fees are calculated at checkout based on billing address.",
                        })
                      }
                      className="text-[#1d6c5c] text-sm font-normal underline leading-6 cursor-pointer text-left hover:text-[#155a4c]"
                    >
                      Pricing &amp; terms
                    </button>
                  </div>

                  {/* Highlight Box: Data Allowance */}
                  {dataAllowance && (
                  <div className="mt-3.5 mb-1 px-3 pt-3 pb-3.5 bg-[#f0f6f4] dark:bg-gray-700/50 rounded-xl flex flex-col items-center justify-center border border-[#d6ebe6] dark:border-gray-600">
                    <div className="text-[#1d6c5c] dark:text-[#37C4A0] text-5xl font-extrabold leading-10">
                      {dataAllowance}
                    </div>
                    <div className="text-[#0f2133] dark:text-gray-200 text-sm font-normal leading-6">
                      data allowance
                    </div>
                  </div>
                  )}

                  {/* Features list */}
                  <div className="pt-3 pb-4 border-t border-[#c8e3de] flex flex-col">
                    {/* Hotspot */}
                    {hotspotAllowance && (
                    <div className="h-11 flex items-center gap-3 border-b border-[#e5eeec] dark:border-gray-700">
                      <div className="w-5 h-5 flex items-center justify-center text-[#1d6c5c] dark:text-[#37C4A0] shrink-0">
                        <Wifi size={17} strokeWidth={2.2} />
                      </div>
                      <div className="text-[#0f2133] dark:text-gray-200 text-sm leading-5">
                        <span className="font-bold">{hotspotAllowance}</span>{" "}
                        <span className="font-normal text-[#4a6a7a] dark:text-gray-400">mobile hotspot</span>
                      </div>
                    </div>
                    )}

                    {/* 5G Access & IoT Mode */}
                    <div className="h-11 flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center text-[#1d6c5c] dark:text-[#37C4A0] shrink-0">
                        <Radio size={17} strokeWidth={2.2} />
                      </div>
                      <div className="text-[#0f2133] dark:text-gray-200 text-sm font-bold leading-5">
                        5G access &amp; IoT mode
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Block */}
                <div>
                  <button
                    type="button"
                    onClick={() => handlePlanAction(plan)}
                    className="w-full min-h-12 py-2 bg-[#1d6c5c] hover:bg-[#155a4c] dark:bg-[#37C4A0] dark:text-gray-900 text-white text-xl font-bold leading-8 rounded-[10px] transition-colors duration-200 text-center cursor-pointer shadow-sm"
                  >
                    {actionLabel}
                  </button>

                  <p className="pt-1.5 text-center text-[#4a6a7a] dark:text-gray-400 text-sm font-normal leading-6">
                    Next: choose prepaid or postpaid
                  </p>

                  <div className="pt-2 flex items-center justify-center gap-3.5">
                    <button
                      type="button"
                      onClick={() =>
                        setDetailModalPlan({
                          title: `${plan.name} - Plan Details`,
                          content:
                            "Provides high-speed data for connected vehicles, tablets, telematics, and hotspot devices. Features include automated failover, 5G Ultra-Wideband access, IoT connectivity optimization, and flexible monthly renewals.",
                        })
                      }
                      className="text-[#1d6c5c] text-sm font-normal underline leading-6 cursor-pointer hover:text-[#155a4c]"
                    >
                      Plan details
                    </button>
                    <span className="text-[#aac8d3] text-sm font-normal">|</span>
                    <button
                      type="button"
                      onClick={() =>
                        setDetailModalPlan({
                          title: `${plan.name} - Broadband Consumer Label`,
                          content: `Broadband Consumer Facts:\n• Provider: DriverX Mobile\n• Monthly Base Charge: $${plan.final_price}\n• Typical Download Speeds: 75–250 Mbps on 5G\n• Typical Upload Speeds: 10–40 Mbps\n• Network Management: No data limits, throttled to 2G after monthly allotment\n• Privacy & Security: Fully FCC & PCI compliant`,
                        })
                      }
                      className="text-[#1d6c5c] text-sm font-normal underline leading-6 cursor-pointer hover:text-[#155a4c]"
                    >
                      Broadband label
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note below plan cards */}
        <p className="pt-2 text-center text-[#4a6a7a] dark:text-gray-400 text-sm font-normal leading-6">
          Device compatibility and network coverage vary. Review plan terms before choosing.
        </p>

        {/* ── VOICE BOOST TOP-UPS SECTION ───────────────────────────── */}
        <div className="pt-7">
          <h2 className="text-[#0f2133] dark:text-white text-3xl sm:text-4xl font-extrabold leading-10 tracking-tight">
            Add calls and texts when you need them.
          </h2>
          <p className="text-[#0f2133] dark:text-gray-300 text-base font-normal leading-7 mt-1">
            Optional Voice Boost top-ups • 30-day validity • Priced separately
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            {/* Voice Boost 500 */}
            <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-[#c8e3de] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex-1">
                <h3 className="text-[#0f2133] dark:text-white text-2xl font-extrabold leading-7 tracking-tight">
                  Voice Boost 500
                </h3>
              </div>
              <div className="sm:pr-5 sm:border-r border-[#89c8bb]">
                <span className="text-[#0f2133] dark:text-white text-4xl font-extrabold leading-10">
                  $9
                </span>
              </div>
              <div className="flex-1 text-[#0f2133] dark:text-gray-300 text-base font-normal leading-5">
                500 minutes +<br />
                500 texts
              </div>
              <Link
                href="/top-up-plans"
                className="w-full sm:w-auto h-10 min-h-10 px-5 bg-white dark:bg-gray-700 rounded-[10px] outline outline-2 outline-offset-[-2px] outline-[#1d6c5c] text-[#1d6c5c] dark:text-[#37C4A0] text-base font-bold leading-7 inline-flex items-center justify-center hover:bg-[#1d6c5c] hover:text-white transition-colors duration-200"
              >
                View top-up
              </Link>
            </div>

            {/* Voice Boost Max */}
            <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-[#c8e3de] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex-1">
                <h3 className="text-[#0f2133] dark:text-white text-2xl font-extrabold leading-7 tracking-tight">
                  Voice Boost Max
                </h3>
              </div>
              <div className="sm:pr-5 sm:border-r border-[#89c8bb]">
                <span className="text-[#0f2133] dark:text-white text-4xl font-extrabold leading-10">
                  $20
                </span>
              </div>
              <div className="flex-1 text-[#0f2133] dark:text-gray-300 text-base font-normal leading-5">
                Unlimited minutes +<br />
                unlimited texts
              </div>
              <Link
                href="/top-up-plans"
                className="w-full sm:w-auto h-10 min-h-10 px-5 bg-white dark:bg-gray-700 rounded-[10px] outline outline-2 outline-offset-[-2px] outline-[#1d6c5c] text-[#1d6c5c] dark:text-[#37C4A0] text-base font-bold leading-7 inline-flex items-center justify-center hover:bg-[#1d6c5c] hover:text-white transition-colors duration-200"
              >
                View top-up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQ SECTION ("Get the details before you connect.") ────── */}
      <section className="mt-12 pt-14 pb-12 bg-[#e8f1ee] dark:bg-gray-800/60 border-t border-[#b2d8d1]">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8 flex flex-col gap-4">
          <h2 className="text-[#0f2133] dark:text-white text-3xl sm:text-4xl font-extrabold leading-10 tracking-tight mb-2">
            Get the details before you connect.
          </h2>

          <div className="flex flex-col gap-3">
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
                    className="w-full min-h-20 px-6 py-4 flex items-center justify-between text-left gap-4"
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

          {/* Footer links in FAQ */}
          <div className="pt-6 pb-2 flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/network-coverage-performance"
              className="inline-flex items-center gap-1.5 text-base font-bold text-[#1d6c5c] underline leading-7 hover:text-[#155a4c]"
            >
              Check coverage <ArrowUpRight size={18} />
            </Link>
            <span className="h-6 w-px bg-[#89c8bb] hidden sm:block" />
            <Link
              href="/contact-enterprise-sales"
              className="inline-flex items-center gap-1.5 text-base font-bold text-[#1d6c5c] underline leading-7 hover:text-[#155a4c]"
            >
              Talk to our team <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MODALS ──────────────────────────────────────────────────── */}
      {buyPlan && (
        <BuyPlanModal plan={buyPlan} onClose={() => setBuyPlan(null)} />
      )}
      {enquiryPlan && (
        <EnquiryModal
          plan={enquiryPlan}
          onClose={() => setEnquiryPlan(null)}
        />
      )}

      {/* Detail / Terms Modal */}
      {detailModalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#c8e3de]">
            <h3 className="text-2xl font-extrabold text-[#0f2133] dark:text-white mb-4">
              {detailModalPlan.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed whitespace-pre-line mb-6">
              {detailModalPlan.content}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModalPlan(null)}
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