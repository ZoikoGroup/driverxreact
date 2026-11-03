"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Map, FileText, Smartphone, LifeBuoy, Search } from "lucide-react";

export default function CoverageSection() {
  const [zipCode, setZipCode] = useState("");
  const router = useRouter();

  const handleCoverageSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.trim()) {
      // Directs to the external coverage map tool passing the zip code query if needed
      window.open(
        `https://mvnoc.ai/coverage-map?zip=${encodeURIComponent(zipCode.trim())}`,
        "_blank",
      );
    } else {
      window.open("https://mvnoc.ai/coverage-map", "_blank");
    }
  };

  return (
    <section className="relative w-full bg-[#0E2131] py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Title, ZIP Form & Info Cards */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 text-[#FACC15] text-xs font-semibold tracking-wider uppercase mb-3">
              <span className="flex items-center gap-0.5">
                <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
                <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
              </span>
              <span>Coverage & devices</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-black tracking-tight text-white mb-4 leading-tight">
              Check coverage where you drive.
            </h2>

            {/* Subtitle */}
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-8 font-normal">
              Start with a ZIP code, then see the available coverage information
              for that area.
            </p>

            {/* ZIP Code Input Box */}
            <form
              onSubmit={handleCoverageSearch}
              className="bg-[#142A3E] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl mb-8"
            >
              <label className="block text-xs font-bold text-gray-200 mb-2.5">
                Your ZIP code
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="e.g. 10001"
                    maxLength={5}
                    className="w-full bg-[#0A1A26] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FACC15] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-[#FACC15] hover:bg-[#e3b810] text-[#0E2131] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-md cursor-pointer shrink-0"
                >
                  <span>Check Coverage</span>
                  <Search className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <p className="text-[11px] text-gray-400 mt-2.5 font-medium">
                5-digit U.S. ZIP code. We don&apos;t ask for your location.
              </p>
            </form>

            {/* 2x2 Grid of Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Predicted coverage */}
              <div className="bg-[#142A3E]/70 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-2 rounded-lg bg-[#FACC15] text-[#0E2131] flex items-center justify-center"></div>
                    <h3 className="font-bold text-sm text-white">
                      Predicted coverage
                    </h3>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-normal">
                    Maps model where service is expected. They&apos;re a guide,
                    not a guarantee.
                  </p>
                </div>
              </div>

              {/* Card 2: Indoor & outdoor */}
              <div className="bg-[#142A3E]/70 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-2 rounded-lg bg-[#FACC15] text-[#0E2131] flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-white">
                      Indoor & outdoor
                    </h3>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-normal">
                    Buildings, terrain and vehicles can change the signal you
                    get.
                  </p>
                </div>
              </div>

              {/* Card 3: Your device matters */}
              <div className="bg-[#142A3E]/70 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-2 rounded-lg bg-[#FACC15] text-[#0E2131] flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-white">
                      Your device matters
                    </h3>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-normal">
                    Supported bands and eSIM vary by phone. Check yours before
                    you buy.
                  </p>
                </div>
              </div>

              {/* Card 4: Need a hand? */}
              <div className="bg-[#142A3E]/70 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-2 rounded-lg bg-[#FACC15] text-[#0E2131] flex items-center justify-center">
                      <LifeBuoy className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-white">
                      Need a hand?
                    </h3>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-normal">
                    Our support team can talk through the routes you drive.{" "}
                    <Link
                      href="/24-7-driver-support"
                      className="text-[#FACC15] font-bold hover:underline"
                    >
                      Contact support
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map Graphic with Truck Image & Route Lines */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[540px] aspect-square bg-[#091C2B] rounded-3xl border-2 border-[#FACC15] p-4 shadow-2xl overflow-hidden flex items-center justify-center">
              {/* Map Route SVG Overlay Background Lines */}
              <svg
                className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Diagonal grid streets */}
                <path d="M100 0L350 500" stroke="#3A6B7E" strokeWidth="3" />
                <path d="M0 150L500 220" stroke="#3A6B7E" strokeWidth="2.5" />
                <path d="M50 400L450 100" stroke="#3A6B7E" strokeWidth="2" />
                <path d="M250 0L120 500" stroke="#3A6B7E" strokeWidth="1.5" />

                {/* Wavy bottom route line */}
                <path
                  d="M0 350C150 320 350 380 500 340"
                  stroke="#1D4E62"
                  strokeWidth="12"
                  strokeLinecap="round"
                />

                {/* Dashed curved active route */}
                <path
                  d="M0 270C150 250 350 310 500 290"
                  stroke="#FACC15"
                  strokeWidth="3.5"
                  strokeDasharray="8 8"
                />
              </svg>

              {/* Glowing Pulse Node on Route */}
              <div className="absolute top-[55%] left-[62%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#FACC15]/30 animate-ping absolute" />
                <div className="w-7 h-7 rounded-full bg-[#0E2131] border-4 border-[#FACC15] flex items-center justify-center shadow-lg relative z-10">
                  <div className="w-2 h-2 rounded-full bg-[#FACC15]" />
                </div>
              </div>

              {/* Top Left "Your ZIP" Pill Badge */}
              <div className="absolute top-6 left-6 z-20 bg-[#FACC15] text-[#0E2131] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-md">
                Your ZIP
              </div>

              {/* Top Right Truck Image Card */}
              <div className="absolute top-6 right-6 z-20 w-[210px] sm:w-[240px] aspect-[16/10] rounded-xl overflow-hidden shadow-xl border border-white/20">
                <Image
                  src="/images/home/3.png"
                  alt="Truck"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
