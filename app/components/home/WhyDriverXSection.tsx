"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Check, ArrowRight, MapPin, Phone } from "lucide-react";

export default function WhyDriverXSection() {
  const [activeTab, setActiveTab] = useState<
    "driver-first" | "coverage" | "sim" | "fleet"
  >("driver-first");

  const tabs = [
    { id: "driver-first", label: "Driver-first plans" },
    { id: "coverage", label: "Coverage checks" },
    { id: "sim", label: "SIM & eSIM" },
    { id: "fleet", label: "Fleet connectivity" },
  ] as const;

  return (
    <section className="relative w-full bg-[#0E2131] py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Yellow Backdrop Border Box & Circular Badge */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[540px]">
              {/* Yellow Decorative Border Frame Box */}
              <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-[#FACC15] rounded-3xl z-0 pointer-events-none" />

              {/* Main Image Container */}
              <div className="relative z-10 w-full h-[320px] sm:h-[380px] lg:h-[420px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/home/man.png"
                  alt="Driver working"
                  fill
                  priority
                  className="object-cover object-top"
                />

                {/* Circular Rotating Badge Overlay */}
                <div className="absolute -bottom-6 -left-6 z-20 w-32 h-32 sm:w-36 sm:h-36 bg-[#0E2131] border-4 border-[#FACC15] rounded-full flex items-center justify-center p-2 shadow-2xl animate-spin-slow">
                  <svg
                    className="w-full h-full overflow-visible"
                    viewBox="0 0 100 100"
                  >
                    <path
                      id="circlePath"
                      d="M 15, 50 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                      fill="none"
                    />
                    <text className="text-[11px] font-extrabold uppercase tracking-widest fill-white">
                      <textPath href="#circlePath" startOffset="0%">
                        • DRIVER-FIRST WIRELESS • DRIVERX MOBILE
                      </textPath>
                    </text>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#FACC15] text-[#0E2131] flex items-center justify-center shadow-md">
                      <span className="w-3.5 h-3.5 bg-[#0E2131] rounded-xs" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Section Header, Tabs, Content & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 text-[#FACC15] text-xs font-semibold tracking-wider uppercase mb-3">
              <span className="flex items-center gap-0.5">
                <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
                <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
              </span>
              <span>Why DriverX Mobile</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
              Built around your working day.
            </h2>

            {/* Subtitle */}
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
              Wireless plans and service paths explained for people who earn a
              living on the move.
            </p>

            {/* Interactive Tab Buttons */}
            <div className="flex flex-wrap gap-2 bg-[#142A3E]/90 p-1.5 rounded-2xl border border-white/10 mb-8">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
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

            {/* Content & Floating Phone/Callout Box */}
            <div className="space-y-6 mb-8">
              <p className="text-gray-200 text-xs sm:text-sm leading-relaxed font-medium">
                Plan journeys start with the work you do, so you compare options
                that make sense for driving, not a generic phone catalog.
              </p>

              {/* Bullet Points & Support Card Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Bullet Points */}
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200">
                    <Check className="w-4 h-4 text-[#FACC15] shrink-0 mt-0.5" />
                    <span>Rideshare, delivery and logistics paths</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200">
                    <Check className="w-4 h-4 text-[#FACC15] shrink-0 mt-0.5" />
                    <span>Terms and labels shown up front</span>
                  </li>
                </ul>

                {/* Floating Support Callout Box */}
                <div className="bg-white text-gray-900 rounded-2xl p-4 shadow-xl border-2 border-[#FACC15] flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#E6F4EA] text-[#137333] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                      Questions about switching?
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#0E2131]">
                      +1 (800) 399-0087
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Good to know footnote */}
            <p className="text-[11px] text-gray-400 leading-relaxed mb-8 pt-4 border-t border-white/10 font-normal">
              <strong className="text-gray-200 font-bold">Good to know:</strong>{" "}
              DriverX Mobile is a wireless carrier for working drivers.
              We&apos;re not a rideshare, dispatch or driver-payments app.
              Coverage and speeds vary by location and device.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 bg-[#FACC15] hover:bg-[#e3b810] text-[#0E2131] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-xl"
              >
                <span>Explore Plans</span>
                <div className="w-6 h-6 rounded-full bg-[#0E2131] text-white flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </a>

              <a
                href="#"
                className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-full border border-white/40 transition-all duration-200"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>Check Coverage</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
