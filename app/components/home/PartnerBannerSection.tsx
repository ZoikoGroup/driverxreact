import React from "react";
import Image from "next/image";
import { Truck, Users, Cpu, Gift, Handshake, ArrowUpRight } from "lucide-react";

export default function PartnerBannerSection() {
  const pills = [
    { title: "Fleet & channel partners", icon: Truck },
    { title: "Driver service providers", icon: Users },
    { title: "Technology partners", icon: Cpu },
    { title: "Affiliate opportunities", icon: Gift },
  ] as const;

  return (
    <section className="relative w-full py-8 sm:py-12 bg-[#0E2131]">
      {/* Outer Main Container - Full Width */}
      <div className="relative w-full bg-[#0E2131] overflow-hidden shadow-2xl flex flex-col lg:flex-row items-stretch border-y border-white/10">
        {/* Left Column: Truck Image with Handshake Icon Overlay & Yellow Divider */}
        <div className="relative lg:w-[28%] min-h-[220px] lg:min-h-[260px] shrink-0 border-b-4 lg:border-b-0 lg:border-r-4 border-[#FACC15]">
          <Image
            src="/images/home/3.png"
            alt="Truck Partner"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Dark Overlay for contrast */}
          <div className="absolute inset-0 bg-[#0E2131]/30" />

          {/* Yellow Circular Handshake Icon Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FACC15] text-[#0E2131] shadow-xl flex items-center justify-center p-3 border-4 border-[#0E2131]">
            <Handshake className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.2]" />
          </div>
        </div>

        {/* Middle Column: Title, Subtitle & Partner Pills */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">
            Partner with a network built around drivers.
          </h2>

          <p className="text-gray-300 text-xs sm:text-sm font-normal leading-relaxed mb-6">
            Bring relevant services and offers to professional drivers.
          </p>

          {/* Partner Category Pills */}
          <div className="flex flex-wrap gap-3">
            {pills.map((pill, idx) => {
              const IconComponent = pill.icon;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2.5 bg-[#142A3E]/90 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold text-gray-200 hover:border-white/20 transition-all duration-200"
                >
                  <IconComponent className="w-4 h-4 text-[#FACC15]" />
                  <span>{pill.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Slanted Yellow Section */}
        <div
          className="relative lg:w-[32%] bg-[#FACC15] text-[#0E2131] p-6 sm:p-8 lg:p-10 flex flex-col justify-center items-start lg:items-start z-10"
          style={{
            clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        >
          <p className="text-xs sm:text-sm font-bold text-[#0E2131] leading-relaxed mb-6 max-w-xs pl-4 lg:pl-6">
            Tell us what you offer and who it&apos;s for. We&apos;ll follow up
            if it&apos;s a fit for our drivers.
          </p>

          <div className="flex flex-col gap-3 w-full pl-4 lg:pl-6">
            {/* Primary CTA Button */}
            <a
              href="#"
              className="inline-flex items-center justify-between gap-3 bg-[#0E2131] hover:bg-[#07131D] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-xl w-fit"
            >
              <span>Become a Partner</span>
              <div className="w-6 h-6 rounded-full bg-[#FACC15] text-[#0E2131] flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </a>

            {/* Secondary Link */}
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#0E2131] hover:underline pt-1"
            >
              <span>Contact enterprise sales</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
