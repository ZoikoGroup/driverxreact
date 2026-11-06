import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Radio,
  Zap,
  Smartphone,
  Headphones,
  BarChart3,
  Layers,
  CreditCard,
  CreditCard as CardSim, // Keeping import safe for your icon alias
} from "lucide-react";

const features = [
  {
    Icon: Radio,
    label: ["Coverage checks", "by ZIP code"],
    href: "https://mvnoc.ai/coverage-map",
  },
  { Icon: Zap, label: ["Flexible", "plan options"], href: "/prepaid-plans" },
  { Icon: CardSim, label: ["SIM & eSIM", "activation"], href: "/product/shop" },
  {
    Icon: Headphones,
    label: ["Driver-focused", "support"],
    href: "/24-7-driver-support",
  },
];

const menuItems = [
  { Icon: BarChart3, label: "Usage & Data", href: "/dashboard" },
  { Icon: Layers, label: "Manage Plan", href: "/dashboard" },
  { Icon: Smartphone, label: "SIM / eSIM", href: "/product/shop" },
  { Icon: CreditCard, label: "Billing & Payments", href: "/dashboard" },
];

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[640px] lg:h-[720px] bg-[#0B3D36] overflow-hidden text-white flex items-center">
      {/* Background skyline */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home/bg.png"
          alt="Background Skyline"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Base teal tint */}
        <div className="absolute inset-0 bg-[#0B3D36]/60" />
        {/* Left-to-right fade for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07302A] via-[#0A3A33]/85 via-40% to-transparent to-75%" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07302A]/80 to-transparent" />
      </div>

      {/* Man image — shifted left, less zoomed, blended into the background */}
      <div
        className="absolute top-0 bottom-0 left-[28%] w-[62%] lg:w-[56%] z-[15] pointer-events-none hidden md:block"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 50%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 22%, black 85%, transparent 100%)",
        }}
      >
        <Image
          src="/images/home/man.png"
          alt="Driver"
          fill
          priority
          className="object-cover object-[center_top]"
        />
      </div>

      {/* Mobile fallback: image behind content, faded */}
      <div className="absolute inset-0 z-[15] md:hidden opacity-30 pointer-events-none">
        <Image
          src="/images/home/man.png"
          alt=""
          fill
          className="object-cover object-[70%_top]"
        />
      </div>

      {/* Main content */}
      <div className="relative z-30 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-[#FACC15] text-[#0A2E28] font-bold text-xs sm:text-[13px] px-4 py-1.5 rounded-full w-fit mb-6 shadow-sm">
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
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <path d="M8.5 8.5a5 5 0 0 0 0 7" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M5.5 5.5a9 9 0 0 0 0 13" />
                <path d="M18.5 5.5a9 9 0 0 1 0 13" />
              </svg>
              <span>Driver-Focused Wireless</span>
            </div>

            {/* Headline */}
            <h1 className="text-[40px] sm:text-5xl lg:text-[58px] font-extrabold tracking-tight leading-[1.08] text-white mb-6">
              Connectivity That <br />
              Works as Hard <br />
              <span className="relative inline-block text-[#FACC15] italic">
                as You Do.
                <svg
                  className="absolute -bottom-3 -left-1 w-[104%] h-3 text-[#FACC15]"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 9C50 2 150 2 197 9"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-200/90 text-sm sm:text-[15px] max-w-[340px] font-normal leading-relaxed mt-2 mb-8">
              Wireless built around the working lives of America&apos;s drivers,
              delivery professionals, and fleets.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href="/plans"
                className="inline-flex items-center justify-center gap-2 bg-[#FACC15] hover:bg-[#e3b810] text-[#0A2E28] font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-lg"
              >
                <span>Explore Plans</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </Link>

              <Link
                href="https://mvnoc.ai/coverage-map"
                className="inline-flex items-center justify-center gap-2 bg-[#0A2E28]/40 hover:bg-white/10 text-white font-semibold text-sm px-7 py-3.5 rounded-full border border-white/70 transition-all duration-200 backdrop-blur-sm"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>Check Coverage</span>
              </Link>
            </div>

            {/* Feature row */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-y-4 max-w-[560px]">
              {features.map(({ Icon, label, href }, i) => (
                <Link
                  key={i}
                  href={href}
                  className={`flex items-center gap-2.5 pr-4 hover:opacity-80 transition-opacity ${
                    i !== 0 ? "pl-4" : ""
                  } ${
                    i !== features.length - 1
                      ? "sm:border-r sm:border-white/20"
                      : ""
                  }`}
                >
                  <Icon
                    className="w-[22px] h-[22px] text-[#FACC15] shrink-0"
                    strokeWidth={1.6}
                  />
                  <span className="text-[12px] leading-[1.25] text-gray-100 font-medium whitespace-nowrap">
                    {label[0]}
                    <br />
                    {label[1]}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right column: tilted phone */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center mt-6 lg:mt-0">
            <div className="relative z-40 w-[250px] sm:w-[270px] bg-[#F8FAF9] rounded-[38px] p-3 shadow-[0_25px_60px_rgba(0,0,0,0.45)] border-[5px] border-[#E9EEEC] rotate-[6deg] lg:mr-[-8px] lg:-translate-y-4 hover:rotate-0 transition-transform duration-300">
              {/* Status bar */}
              <div className="relative flex items-center justify-between px-3 pt-1.5 pb-2 text-[10px] text-gray-700 font-semibold">
                <span>9:41</span>
                <div className="absolute left-1/2 -translate-x-1/2 top-1 w-[74px] h-[20px] bg-black rounded-full" />
                <div className="flex items-center gap-1">
                  <span className="w-3 h-2 rounded-[2px] bg-gray-700" />
                  <span className="w-3.5 h-2 rounded-[3px] bg-gray-700" />
                </div>
              </div>

              <div className="px-2 pt-1 pb-2">
                {/* Logo */}
                <div className="relative h-7 w-32 mb-2">
                  <Image
                    src="/logo.png"
                    alt="DriverX Mobile"
                    fill
                    className="object-contain object-left"
                  />
                </div>

                <div className="text-[12px] font-bold text-gray-900 mb-2">
                  Good morning!
                </div>

                {/* Plan card */}
                <Link
                  href="/dashboard"
                  className="block bg-gradient-to-br from-[#1B6B5A] to-[#0D4D41] text-white p-3.5 rounded-2xl mb-3 relative overflow-hidden shadow-md hover:opacity-95 transition-opacity"
                >
                  <div className="text-[9px] text-gray-200 font-medium">
                    My Plan
                  </div>
                  <div className="text-[17px] font-bold mt-0.5 leading-tight">
                    Your data
                  </div>
                  <div className="text-[9px] text-gray-200 mb-2">
                    High-speed usage
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-end gap-[3px]">
                    <span className="w-[4px] h-2 bg-[#FACC15] rounded-[2px]" />
                    <span className="w-[4px] h-3.5 bg-[#FACC15] rounded-[2px]" />
                    <span className="w-[4px] h-5 bg-[#FACC15] rounded-[2px]" />
                    <span className="w-[4px] h-6 bg-[#FACC15] rounded-[2px]" />
                  </div>
                </Link>

                {/* Menu */}
                <div className="space-y-2">
                  {menuItems.map(({ Icon, label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-100 bg-white shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#0D4D41]" />
                        <span className="text-[11px] font-semibold text-gray-700">
                          {label}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </Link>
                  ))}
                </div>

                {/* Home indicator */}
                <div className="w-24 h-1 bg-gray-900 rounded-full mx-auto mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yellow diagonal stripe, bottom right */}
      <div
        className="absolute bottom-0 right-0 w-[38%] h-14 bg-[#FACC15] z-30 hidden lg:block"
        style={{ clipPath: "polygon(35% 100%, 100% 20%, 100% 100%)" }}
      />
    </section>
  );
}
