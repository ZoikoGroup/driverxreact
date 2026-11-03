import React from "react";
import {
  Gift,
  RotateCw,
  Sliders,
  BookOpen,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

export default function DriverBenefitsSection() {
  const cards = [
    {
      title: "Eligible partner offers",
      description:
        "Offers from approved partners, each shown with eligibility, region and expiry.",
      ctaText: "View partner offers",
      ctaType: "external",
      icon: Gift,
      isHighlighted: false,
    },
    {
      title: "Plan flexibility",
      description:
        "Top up, change or compare plans as your workload changes, under your plan's terms.",
      ctaText: "See Top-Up plans",
      ctaType: "external",
      icon: RotateCw,
      isHighlighted: true,
    },
    {
      title: "Account tools",
      description:
        "Check usage, manage your plan and handle billing in My DriverX.",
      ctaText: "About My DriverX",
      ctaType: "internal",
      icon: Sliders,
      isHighlighted: false,
    },
    {
      title: "Helpful resources",
      description:
        "Guides for switching, activation, coverage and fleet operations.",
      ctaText: "Read the guides",
      ctaType: "internal",
      icon: BookOpen,
      isHighlighted: false,
    },
  ] as const;

  return (
    <section className="relative w-full bg-[#0E2131] py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-[#FACC15] text-xs font-semibold tracking-wider uppercase mb-3">
            <span className="flex items-center gap-0.5">
              <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
              <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
            </span>
            <span>Driver benefits</span>
            <span className="flex items-center gap-0.5">
              <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
              <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            More value for the road ahead.
          </h2>

          <p className="text-gray-300 text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
            Eligible driver offers and support features, presented with clear
            terms.
          </p>
        </div>

        {/* 4 Trapezoid Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;

            return (
              <div
                key={idx}
                className="relative group transition-transform duration-300 hover:-translate-y-2"
              >
                {/* Trapezoid Shape Box */}
                <div
                  className={`relative p-8 flex flex-col items-center text-center justify-between min-h-[340px] shadow-2xl ${
                    card.isHighlighted
                      ? "bg-white text-[#0E2131]"
                      : "bg-[#142A3E] text-white border border-white/10"
                  }`}
                  style={{
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                  }}
                >
                  {/* Top Circle Badge */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full border-2 p-1 flex items-center justify-center mb-6 shadow-md ${
                        card.isHighlighted
                          ? "border-gray-200 bg-[#FACC15] text-[#0E2131]"
                          : "border-[#FACC15] bg-[#0E2131] text-[#FACC15]"
                      }`}
                    >
                      <IconComponent className="w-7 h-7 stroke-[2]" />
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-lg font-extrabold mb-3 tracking-tight ${
                        card.isHighlighted ? "text-[#0E2131]" : "text-white"
                      }`}
                    >
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-xs leading-relaxed max-w-[220px] font-normal ${
                        card.isHighlighted ? "text-gray-600" : "text-gray-300"
                      }`}
                    >
                      {card.description}
                    </p>
                  </div>

                  {/* Bottom CTA Link */}
                  <a
                    href="#"
                    className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all duration-200 mt-6 ${
                      card.isHighlighted
                        ? "text-[#0E2131] hover:underline"
                        : "text-[#FACC15] hover:underline"
                    }`}
                  >
                    <span>{card.ctaText}</span>
                    {card.ctaType === "external" ? (
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
