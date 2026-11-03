"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";

export default function GetConnectedSection() {
  const [simType, setSimType] = useState<"esim" | "physical">("esim");

  const esimRequirements = [
    "A phone that supports eSIM and is unlocked",
    "A Wi-Fi or data connection to install the eSIM",
    "Your current account number and transfer PIN, if you're keeping your number",
  ];

  const physicalSimRequirements = [
    "An unlocked phone with a physical SIM tray",
    "Your DriverX physical SIM card package",
    "Your current account details if transferring an existing line",
  ];

  return (
    <section className="relative w-full bg-[#132B40] py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header Block */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-[#FACC15] text-xs font-semibold tracking-wider uppercase mb-3">
            <span className="flex items-center gap-0.5">
              <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
              <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
            </span>
            <span>SIM, eSIM & your own phone</span>
            <span className="flex items-center gap-0.5">
              <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
              <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Get connected in three clear steps.
          </h2>

          <p className="text-gray-300 text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
            Choose a plan, check your device, and activate service. Buying
            service and activating it are separate steps, so you can activate
            when you&apos;re ready.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 lg:mb-16">
          {/* Dashed Connecting Line behind cards on desktop */}
          <div className="hidden lg:block absolute top-[110px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-gray-600 z-0" />

          {/* Step 1 Card (Dark Navy) */}
          <div className="relative z-10 bg-[#1A3750] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl justify-between min-h-[300px]">
            <div className="flex flex-col items-center">
              {/* Step Circle Badge */}
              <div className="w-16 h-16 rounded-full border-2 border-[#FACC15]/40 p-1 flex items-center justify-center mb-6">
                <div className="w-full h-full rounded-full bg-[#FACC15] text-[#0E2131] font-black text-xl flex items-center justify-center">
                  1
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                Choose a plan
              </h3>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xs font-normal">
                Compare prepaid, postpaid and data-only options and read each
                plan&apos;s terms.
              </p>
            </div>

            <Link
              href="/plans"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FACC15] hover:underline mt-6"
            >
              <span>Compare plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Step 2 Card (Highlighted White Card with Chamfered Bottom-Right Corner) */}
          <div
            className="relative z-10 bg-white text-[#0E2131] rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl justify-between min-h-[300px]"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
            }}
          >
            <div className="flex flex-col items-center">
              {/* Step Circle Badge */}
              <div className="w-16 h-16 rounded-full border-2 border-gray-200 p-1 flex items-center justify-center mb-6">
                <div className="w-full h-full rounded-full bg-[#FACC15] text-[#0E2131] font-black text-xl flex items-center justify-center">
                  2
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#0E2131] mb-3">
                Confirm your device
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xs font-normal">
                Bring your own unlocked phone after a quick compatibility check,
                or shop phones and accessories.
              </p>
            </div>

            <Link
              href="/product/shop"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0E2131] hover:underline mt-6"
            >
              <span>Shop phones</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          {/* Step 3 Card (Dark Navy) */}
          <div className="relative z-10 bg-[#1A3750] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl justify-between min-h-[300px]">
            <div className="flex flex-col items-center">
              {/* Step Circle Badge */}
              <div className="w-16 h-16 rounded-full border-2 border-[#FACC15]/40 p-1 flex items-center justify-center mb-6">
                <div className="w-full h-full rounded-full bg-[#FACC15] text-[#0E2131] font-black text-xl flex items-center justify-center">
                  3
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                Activate SIM / eSIM
              </h3>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xs font-normal">
                Install your eSIM or insert your SIM card, then transfer your
                number if it&apos;s eligible.
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FACC15] hover:underline mt-6"
            >
              <span>Start activation</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Bottom Banner Box: "How do you want to start?" */}
        <div className="max-w-4xl mx-auto border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Column: SIM Type Toggle */}
            <div className="md:col-span-5">
              <h4 className="text-sm sm:text-base font-bold text-white mb-4">
                How do you want to start?
              </h4>

              <div className="inline-flex p-1 bg-[#0A1A26] rounded-full border border-white/10">
                <button
                  type="button"
                  onClick={() => setSimType("esim")}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    simType === "esim"
                      ? "bg-[#FACC15] text-[#0E2131] shadow-sm"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  eSIM
                </button>
                <button
                  type="button"
                  onClick={() => setSimType("physical")}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    simType === "physical"
                      ? "bg-[#FACC15] text-[#0E2131] shadow-sm"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Physical SIM
                </button>
              </div>
            </div>

            {/* Right Column: Requirements List */}
            <div className="md:col-span-7">
              <h4 className="text-sm sm:text-base font-bold text-white mb-3">
                What you&apos;ll need
              </h4>

              <ul className="space-y-2.5">
                {(simType === "esim"
                  ? esimRequirements
                  : physicalSimRequirements
                ).map((req, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-200"
                  >
                    <Check className="w-4 h-4 text-[#FACC15] shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footnote text inside box */}
          <div className="pt-6 mt-6 border-t border-white/10 text-[11px] text-gray-400 font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              Keep your current service active until your number transfer is
              complete. Transfer timing depends on your previous carrier.
            </span>
            <Link
              href="/faqs-self-service"
              className="text-[#FACC15] hover:underline font-bold whitespace-nowrap"
            >
              Learn about porting
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
