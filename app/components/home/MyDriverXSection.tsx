import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Layers,
  CreditCard,
  Smartphone,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

export default function MyDriverXSection() {
  const accountFeatures = [
    {
      title: "Usage & data",
      description: "See how much high-speed data you've used this period.",
      icon: TrendingUp,
    },
    {
      title: "Plan management",
      description: "Review your plan, top up or switch when your work changes.",
      icon: Layers,
    },
    {
      title: "Billing & payments",
      description: "View bills and payment history in one place.",
      icon: CreditCard,
    },
    {
      title: "SIM / eSIM",
      description: "Track activation progress and manage your SIM.",
      icon: Smartphone,
    },
  ] as const;

  return (
    <section className="relative w-full bg-[#132B40] py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Title, Subtitle, Features List & CTA Buttons */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 text-[#FACC15] text-xs font-semibold tracking-wider uppercase mb-3">
              <span className="flex items-center gap-0.5">
                <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
                <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
              </span>
              <span>My DriverX account</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-black tracking-tight text-white mb-4 leading-tight">
              Manage your wireless, your <br />
              way.
            </h2>

            {/* Subtitle */}
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-8 font-normal">
              A simple place to view service, usage, billing, and activation
              progress.
            </p>

            {/* Account Features Stack */}
            <div className="space-y-3.5 mb-10">
              {accountFeatures.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#142A3E]/70 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-white/20 transition-all duration-200"
                  >
                    <div className="p-3 rounded-xl bg-[#0D4D41] text-[#FACC15] shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white mb-0.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-300 font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-[#FACC15] hover:bg-[#e3b810] text-[#0E2131] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-xl"
              >
                <span>Log in to My DriverX</span>
                <div className="w-6 h-6 rounded-full bg-[#0E2131] text-white flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FACC15] hover:underline"
              >
                <span>Activate SIM / eSIM</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Right Column: Mobile App Frame with Yellow Circle & Dashed Orbit */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end items-center">
            {/* Background Yellow Circle Backdrop */}
            <div className="absolute top-1/2 left-4 sm:left-12 -translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-[#FACC15] z-0" />

            {/* Background Dashed Ring Line */}
            <div className="absolute top-1/2 left-0 sm:left-4 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 rounded-full border-2 border-dashed border-cyan-500/30 pointer-events-none z-0" />

            {/* Phone UI Mockup Card */}
            <div className="relative z-10 w-[280px] sm:w-[310px] bg-[#F7FAF9] rounded-[40px] p-4 shadow-2xl border-4 border-[#1E293B] text-gray-800">
              {/* Phone Dynamic Island / Status Bar */}
              <div className="flex items-center justify-between px-3 pt-1 pb-3 text-[11px] text-gray-700 font-semibold">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                </div>
              </div>

              {/* App Internal Container */}
              <div className="space-y-3">
                {/* Header Banner */}
                <div className="bg-[#0A4138] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-sm">
                  <span className="font-extrabold text-sm tracking-tight">
                    My DriverX
                  </span>
                  {/* Signal bars */}
                  <div className="flex items-end gap-0.5">
                    <span className="w-1 h-1.5 bg-[#FACC15] rounded-xs" />
                    <span className="w-1 h-2.5 bg-[#FACC15] rounded-xs" />
                    <span className="w-1 h-3.5 bg-[#FACC15] rounded-xs" />
                    <span className="w-1 h-4.5 bg-[#FACC15] rounded-xs" />
                  </div>
                </div>

                {/* Sign-in Box */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                  <h4 className="text-xs font-bold text-gray-900 mb-1">
                    Sign in to see your plan
                  </h4>
                  <p className="text-[10px] text-gray-400 mb-3 leading-tight">
                    Your usage and billing details appear only after you sign
                    in.
                  </p>

                  {/* Placeholder lines */}
                  <div className="space-y-1.5 mb-4">
                    <div className="w-3/4 h-2 bg-gray-100 rounded-full mx-auto" />
                    <div className="w-1/2 h-2 bg-gray-100 rounded-full mx-auto" />
                  </div>

                  {/* Yellow Log In Button */}
                  <Link
                    href="/login"
                    className="block w-full bg-[#FACC15] hover:bg-[#e3b810] text-[#0E2131] font-bold text-xs py-2.5 rounded-full transition-colors shadow-sm text-center"
                  >
                    Log In
                  </Link>
                </div>

                {/* Account Links */}
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 shadow-2xs hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <TrendingUp className="w-4 h-4 text-[#0D4D41]" />
                      <span className="text-xs font-bold text-gray-800">
                        Usage & data
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>

                  <Link
                    href="/dashboard"
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 shadow-2xs hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-[#0D4D41]" />
                      <span className="text-xs font-bold text-gray-800">
                        Plan management
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>

                  <Link
                    href="/dashboard"
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 shadow-2xs hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-[#0D4D41]" />
                      <span className="text-xs font-bold text-gray-800">
                        Billing & payments
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>

                  <Link
                    href="/product/shop"
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 shadow-2xs hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-[#0D4D41]" />
                      <span className="text-xs font-bold text-gray-800">
                        SIM / eSIM
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>
                </div>

                {/* Subtitle Label */}
                <div className="text-center pt-2">
                  <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
                    Illustrative screen
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
