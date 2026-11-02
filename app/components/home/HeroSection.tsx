import React from "react";
import Image from "next/image";
import {
  ChevronRight,
  MapPin,
  Radio,
  Zap,
  Smartphone,
  Headphones,
  ChevronRight as ChevronRightIcon,
  BarChart3,
  Layers,
  CreditCard,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[640px] lg:h-[720px] bg-[#06231E] overflow-hidden text-white flex items-center justify-center">
      {/* Background Skyline Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home/bg.png"
          alt="Background Skyline"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Left Dark Gradient Fade for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06231E] via-[#06231E]/80 to-transparent z-10" />
      </div>

      {/* Man Standing Image aligned to top edge (top-0) to remove top margin */}
      <div
        className="absolute top-0 right-0 bottom-0 w-[70%] sm:w-[65%] lg:w-[58%] z-15 pointer-events-none"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 25%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 25%, black 100%)",
        }}
      >
        <Image
          src="/images/home/man.png"
          alt="Driver"
          fill
          priority
          className="object-cover object-top"
        />
      </div>

      {/* Main Content Container capped at max-w-[1440px] */}
      <div className="relative z-30 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FACC15] text-[#0A2E28] font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full w-fit mb-6 shadow-sm">
              <span className="flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="M4.93 4.93l1.41 1.41" />
                  <path d="M17.66 17.66l1.41 1.41" />
                  <path d="M4.93 19.07l1.41-1.41" />
                  <path d="M17.66 6.34l1.41-1.41" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </span>
              <span>Driver-Focused Wireless</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-black tracking-tight leading-[1.05] text-white mb-6">
              Connectivity That <br />
              Works as Hard <br />
              <span className="relative inline-block text-[#FACC15] italic">
                as You Do.
                {/* Yellow Curved Underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#FACC15]"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 9C50 2 150 2 197 9"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle / Description */}
            <p className="text-gray-200 text-sm sm:text-base max-w-md font-normal leading-relaxed mb-8">
              Wireless built around the working lives of America&apos;s drivers,
              delivery professionals, and fleets.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 bg-[#FACC15] hover:bg-[#e3b810] text-[#0A2E28] font-bold text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-md"
              >
                <span>Explore Plans</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </a>

              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-semibold text-sm px-6 py-3.5 rounded-full border border-white/60 transition-all duration-200"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>Check Coverage</span>
              </a>
            </div>

            {/* 4 Feature Columns at Bottom */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/15 max-w-2xl">
              {/* Feature 1 */}
              <div className="flex items-start gap-2.5 pr-2 border-r border-white/15 last:border-0">
                <Radio className="w-5 h-5 text-[#FACC15] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight text-gray-200 font-medium">
                  Coverage checks by ZIP code
                </span>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-2.5 pr-2 border-r border-white/15 last:border-0">
                <Zap className="w-5 h-5 text-[#FACC15] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight text-gray-200 font-medium">
                  Flexible plan options
                </span>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-2.5 pr-2 border-r border-white/15 last:border-0">
                <Smartphone className="w-5 h-5 text-[#FACC15] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight text-gray-200 font-medium">
                  SIM & eSIM activation
                </span>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start gap-2.5">
                <Headphones className="w-5 h-5 text-[#FACC15] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight text-gray-200 font-medium">
                  Driver-focused support
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Slightly Tilted Floating Phone Mockup */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end items-center h-full mt-6 lg:mt-0">
            {/* Tilted Mobile Phone Frame */}
            <div className="relative z-40 w-[260px] sm:w-[280px] bg-white rounded-[36px] p-3.5 shadow-2xl text-gray-800 border-4 border-gray-100 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              {/* Phone Dynamic Island Bar */}
              <div className="flex items-center justify-between px-3 pt-1 pb-2 text-[10px] text-gray-600 font-semibold">
                <span>9:41</span>
                <div className="w-16 h-3.5 bg-black rounded-full" />
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="w-2.5 h-2 rounded-full bg-gray-400" />
                </div>
              </div>

              {/* App Content */}
              <div className="px-2 pt-1 pb-2">
                {/* Logo Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="relative h-6 w-28">
                    <Image
                      src="/images/logo.svg.png"
                      alt="DriverX Mobile"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                </div>

                {/* Greeting */}
                <div className="text-xs font-bold text-gray-900 mb-2">
                  Good morning!
                </div>

                {/* "My Plan" Card */}
                <div className="bg-[#0D4D41] text-white p-3.5 rounded-2xl mb-3 relative overflow-hidden shadow-inner">
                  <div className="text-[10px] text-gray-300 font-medium">
                    My Plan
                  </div>
                  <div className="text-sm font-bold mt-0.5">Your data</div>
                  <div className="text-[9px] text-gray-300 mb-3">
                    High-speed usage
                  </div>

                  {/* Signal Bars */}
                  <div className="absolute bottom-3 right-3 flex items-end gap-1">
                    <span className="w-1 h-2 bg-[#FACC15] rounded-xs" />
                    <span className="w-1 h-3.5 bg-[#FACC15] rounded-xs" />
                    <span className="w-1 h-5 bg-[#FACC15] rounded-xs" />
                    <span className="w-1 h-6 bg-[#FACC15] rounded-xs" />
                  </div>
                </div>

                {/* Navigation Menu */}
                <div className="space-y-2">
                  <a
                    href="#"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-4 h-4 text-[#0D4D41]" />
                      <span className="text-[11px] font-semibold text-gray-700">
                        Usage & Data
                      </span>
                    </div>
                    <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400" />
                  </a>

                  <a
                    href="#"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-[#0D4D41]" />
                      <span className="text-[11px] font-semibold text-gray-700">
                        Manage Plan
                      </span>
                    </div>
                    <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400" />
                  </a>

                  <a
                    href="#"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-[#0D4D41]" />
                      <span className="text-[11px] font-semibold text-gray-700">
                        SIM / eSIM
                      </span>
                    </div>
                    <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400" />
                  </a>

                  <a
                    href="#"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-[#0D4D41]" />
                      <span className="text-[11px] font-semibold text-gray-700">
                        Billing & Payments
                      </span>
                    </div>
                    <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                </div>

                {/* Home Indicator */}
                <div className="w-20 h-1 bg-black rounded-full mx-auto mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yellow Decorative Bottom Right Stripe */}
      <div
        className="absolute bottom-0 right-0 w-[40%] h-12 bg-[#FACC15] z-30 hidden lg:block"
        style={{ clipPath: "polygon(20% 100%, 100% 0, 100% 100%)" }}
      />
    </section>
  );
}
