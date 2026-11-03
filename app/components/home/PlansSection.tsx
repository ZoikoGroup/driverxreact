"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  BarChart3,
  Wifi,
  Sliders,
  ShieldCheck,
} from "lucide-react";

export default function PlansSection() {
  const [activeTab, setActiveTab] = useState<
    "prepaid" | "postpaid" | "data-only" | "business"
  >("prepaid");

  const tabs = [
    { id: "prepaid", label: "Prepaid", href: "/prepaid-plans" },
    { id: "postpaid", label: "Postpaid", href: "/postpaid-plans" },
    { id: "data-only", label: "Data-Only", href: "/data-only-plans" },
    { id: "business", label: "Business & Fleet", href: "/business-plans" },
  ] as const;

  const tabContent = {
    prepaid: {
      title: "Pay upfront and stay in control.",
      description:
        "Pay before each service period and decide month by month. A good fit if your hours and routes change often.",
      bullets: [
        "Pay ahead for each service period",
        "Add more with Top-Up plans when needed",
        "Start on a physical SIM or eSIM",
      ],
      mainCtaText: "See prepaid plans & prices",
      mainCtaHref: "/prepaid-plans",
    },
    postpaid: {
      title: "Flexible monthly plan choices.",
      description:
        "Consistent service with easy monthly billing. Ideal for full-time drivers looking for hassle-free connectivity.",
      bullets: [
        "Automatic monthly renewal options",
        "Consistent high-speed data access",
        "Seamless line management",
      ],
      mainCtaText: "See postpaid plans & prices",
      mainCtaHref: "/postpaid-plans",
    },
    "data-only": {
      title: "Dedicated data for tablets & hotspots.",
      description:
        "Keep your in-vehicle displays, navigation tablets, and mobile hotspots connected without voice clutter.",
      bullets: [
        "High-speed data built for connected devices",
        "Flexible data caps and unlimited tiers",
        "Ideal for in-cab telematics and entertainment",
      ],
      mainCtaText: "See data-only plans & prices",
      mainCtaHref: "/data-only-plans",
    },
    business: {
      title: "Wireless service for your entire team.",
      description:
        "Scale connectivity across your fleet with customized pooled data, centralized billing, and enterprise support.",
      bullets: [
        "Multi-line management for fleet operations",
        "Custom deployment & telemetry support",
        "Direct access to enterprise support lines",
      ],
      mainCtaText: "See business plans & options",
      mainCtaHref: "/business-plans",
    },
  };

  const currentContent = tabContent[activeTab];

  return (
    <section className="relative w-full bg-[#132B40] py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 lg:mb-16">
          {/* Left Title Block */}
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#FACC15] text-xs font-semibold tracking-wider uppercase mb-3">
              <span className="flex items-center gap-0.5">
                <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
                <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
              </span>
              <span>Plans & pricing</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Find a plan that fits your <br className="hidden sm:block" />
              workday.
            </h2>
          </div>

          {/* Right Text Description & Tab Filter Buttons */}
          <div className="flex flex-col items-start lg:items-end gap-6 max-w-xl">
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed text-left lg:text-right">
              Compare the plan families first, then choose a specific offer.
              Every plan shows its price, data, hotspot terms and Broadband
              Consumer Label before you buy.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 bg-[#0E2131]/80 p-1.5 rounded-full border border-white/10">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#FACC15] text-[#0E2131] shadow-md"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feature Showcase Banner Container */}
        <div className="bg-transparent rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Image Column - Zero Padding, Full Height */}
            <div className="lg:col-span-5 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] rounded-2xl lg:rounded-3xl overflow-hidden">
              <Image
                src="/images/home/5.png"
                alt="Driver working"
                fill
                priority
                className="object-cover object-center"
              />
            </div>

            {/* Middle Content Column */}
            <div className="lg:col-span-4 flex flex-col justify-center py-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">
                {currentContent.title}
              </h3>

              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                {currentContent.description}
              </p>

              <ul className="space-y-3.5 mb-8">
                {currentContent.bullets.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-xs sm:text-sm font-medium text-gray-200"
                  >
                    <Check className="w-4 h-4 text-[#FACC15] shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={currentContent.mainCtaHref}
                  className="inline-flex items-center justify-center gap-2 bg-[#FACC15] hover:bg-[#e3b810] text-[#0E2131] font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-all duration-200 shadow-md"
                >
                  <span>{currentContent.mainCtaText}</span>
                  <div className="w-6 h-6 rounded-full bg-[#0E2131] text-white flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>

                <Link
                  href="/top-up-plans"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FACC15] hover:underline"
                >
                  <span>Top-Up plans</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>

            {/* Right Card: Broadband Label Box */}
            <div className="lg:col-span-3 bg-white text-gray-900 rounded-2xl p-6 sm:p-7 shadow-xl border border-gray-100 flex flex-col justify-between h-full">
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-[#0E2131] mb-5 tracking-tight">
                  Before you buy, every plan shows
                </h4>

                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <CreditCard className="w-4 h-4 text-[#0D4D41] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
                      Price and billing period
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <BarChart3 className="w-4 h-4 text-[#0D4D41] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
                      High-speed data and any reduced-speed policy
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <Wifi className="w-4 h-4 text-[#0D4D41] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
                      Hotspot allowance and terms
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <Sliders className="w-4 h-4 text-[#0D4D41] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
                      Taxes, fees and eligibility
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-[#0D4D41] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
                      Its FCC Broadband Consumer Label
                    </span>
                  </li>
                </ul>
              </div>

              <p className="text-[11px] text-gray-500 leading-normal pt-4 border-t border-gray-100 font-medium">
                Current prices come from our live plan catalog, so you always
                see today&apos;s offer.{" "}
                <Link
                  href="/prepaid-plans"
                  className="text-[#0D4D41] font-bold underline hover:text-black"
                >
                  Compare all plans
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
