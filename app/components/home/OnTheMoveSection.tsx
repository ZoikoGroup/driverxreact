import React from "react";
import Image from "next/image";
import {
  Map,
  MessageSquare,
  Radio,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";

export default function OnTheMoveSection() {
  const features = [
    {
      title: "Navigation & maps",
      description: "Turn-by-turn routes and live traffic between stops.",
      icon: Map,
    },
    {
      title: "Messages & calls",
      description: "Reach customers and riders when plans change.",
      icon: MessageSquare,
    },
    {
      title: "Dispatch updates",
      description: "New orders, pickups and route changes as they happen.",
      icon: Radio,
    },
    {
      title: "Multi-app usage",
      description: "Several work apps running on one phone all shift.",
      icon: LayoutGrid,
    },
  ] as const;

  return (
    <section className="relative w-full min-h-[600px] lg:min-h-[680px] bg-[#0E2131] py-16 sm:py-20 lg:py-24 text-white overflow-hidden flex flex-col justify-between">
      {/* Background Delivery Pro Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home/7.png"
          alt="Delivery worker background"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark Translucent Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-[#0E2131]/80 backdrop-brightness-75" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full flex-1 flex flex-col justify-between">
        {/* Hero Banner with Outline Box & Huge Typography */}
        <div className="relative my-auto py-12 flex flex-col items-center text-center">
          {/* Giant Outline Text Background "ON THE MOVE" */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[60px] sm:text-[100px] lg:text-[140px] font-black tracking-widest pointer-events-none select-none uppercase opacity-20 whitespace-nowrap"
            style={{
              WebkitTextStroke: "2px rgba(255, 255, 255, 0.4)",
              color: "transparent",
            }}
          >
            ON THE MOVE
          </div>

          {/* Yellow Framing Border Box */}
          <div className="relative max-w-3xl w-full p-8 sm:p-12 my-4">
            {/* Top-Left Yellow Corner */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#FACC15]" />

            {/* Top-Right Yellow Corner */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#FACC15]" />

            {/* Bottom-Left Yellow Corner */}
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#FACC15]" />

            {/* Bottom-Right Yellow Corner */}
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#FACC15]" />

            {/* Inner Content */}
            <div className="flex flex-col items-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 text-[#FACC15] text-xs font-semibold tracking-wider uppercase mb-4">
                <span className="flex items-center gap-0.5">
                  <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
                  <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
                </span>
                <span>Built for a working day</span>
                <span className="flex items-center gap-0.5">
                  <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
                  <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
                One connection for a busy workday.
              </h2>

              {/* Subtitle */}
              <p className="text-gray-300 text-xs sm:text-sm max-w-lg leading-relaxed font-normal mb-8">
                Navigation, customer contact, order updates, and dispatch can
                all depend on mobile data. Pick a plan with the data your day
                actually uses.
              </p>

              {/* CTA Button */}
              <a
                href="#"
                className="inline-flex items-center justify-center gap-3 bg-[#FACC15] hover:bg-[#e3b810] text-[#0E2131] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-xl"
              >
                <span>Compare driver plans</span>
                <div className="w-6 h-6 rounded-full bg-[#0E2131] text-white flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Floating White 4-Column Feature Bar at Bottom */}
        <div className="bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {features.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 flex flex-col items-center text-center"
                >
                  {/* Yellow Ringed Icon Container */}
                  <div className="w-14 h-14 rounded-full border-2 border-[#FACC15] p-1 flex items-center justify-center mb-4">
                    <div className="w-full h-full rounded-full bg-white text-[#0E2131] flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-[#0E2131]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-sm sm:text-base text-[#0E2131] mb-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-500 leading-relaxed font-normal max-w-[200px]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
