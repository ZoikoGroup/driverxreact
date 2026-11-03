import React from "react";
import Image from "next/image";
import { Wifi, Tablet, Car, Layers, ArrowRight } from "lucide-react";

export default function DataOnlySection() {
  const features = [
    {
      title: "Mobile hotspot",
      description:
        "Share a connection with a laptop or a second device on the road.",
      icon: Wifi,
    },
    {
      title: "Tablets & devices",
      description: "Keep route sheets, logbooks and card readers online.",
      icon: Tablet,
    },
    {
      title: "Connected vehicles",
      description: "Data for in-cab devices, trackers and dash equipment.",
      icon: Car,
    },
    {
      title: "Data-only plans",
      description: "Compare allowances and terms for each device type.",
      icon: Layers,
    },
  ] as const;

  return (
    <section className="relative w-full bg-[#0E2131] py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Yellow Accent Underlay Box & Callout Badge */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[540px]">
              {/* Yellow Decorative Backplate Box */}
              <div className="absolute -bottom-4 -left-4 w-full h-full bg-[#FACC15] rounded-3xl z-0" />

              {/* Main Image Container */}
              <div className="relative z-10 w-full h-[320px] sm:h-[380px] lg:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src="/images/home/6.png"
                  alt="Data-only devices and hotspot"
                  fill
                  priority
                  className="object-cover object-center"
                />

                {/* Dark Floating Overlay Callout Badge */}
                <div className="absolute top-6 right-6 z-20 bg-[#0E2131]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl max-w-[220px]">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#FACC15]/20 text-[#FACC15] shrink-0 mt-0.5">
                      <Wifi className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-white leading-snug">
                      One data line for the device that keeps you working
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Section Header & Feature Grid */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 text-[#FACC15] text-xs font-semibold tracking-wider uppercase mb-3">
              <span className="flex items-center gap-0.5">
                <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
                <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
              </span>
              <span>Data-only & hotspot</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
              More ways to stay connected.
            </h2>

            {/* Subtitle */}
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-8 font-normal">
              Data-only connectivity for hotspots, tablets, and working devices.
            </p>

            {/* 2x2 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#142A3E]/70 border border-white/10 rounded-2xl p-5 flex items-start gap-3.5 hover:border-white/20 transition-all duration-200"
                  >
                    <div className="p-2.5 rounded-xl bg-[#1D3B54] text-[#FACC15] shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-300 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-3 bg-[#FACC15] hover:bg-[#e3b810] text-[#0E2131] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-lg"
              >
                <span>See data-only plans</span>
                <div className="w-6 h-6 rounded-full bg-[#0E2131] text-white flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
