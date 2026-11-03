import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function ResourcesSection() {
  const articles = [
    {
      badge: "Activation",
      updated: "Updated Oct 31, 2026",
      readTime: "5 min read",
      title: "eSIM setup guide",
      description:
        "Check eSIM support on your phone, install your eSIM and confirm service before your next shift.",
      image: "/images/home/6.png", // or /images/home/10.png
      imagePosition: "left",
    },
    {
      badge: "Devices",
      updated: "Updated Oct 31, 2026",
      readTime: "4 min read",
      title: "Bring-your-own-phone checklist",
      description:
        "Unlock status, compatibility and what to have ready before you switch.",
      image: "/images/home/1.png", // or /images/home/11.png
      imagePosition: "right",
    },
    {
      badge: "Coverage",
      updated: "Updated Oct 31, 2026",
      readTime: "6 min read",
      title: "Coverage basics for drivers",
      description:
        "What coverage maps predict, why indoor service differs, and how to check the routes you drive.",
      image: "/images/home/bg.png", // or /images/home/12.png
      imagePosition: "right",
    },
    {
      badge: "Fleets",
      updated: "Updated Oct 31, 2026",
      readTime: "7 min read",
      title: "Fleet connectivity guide",
      description:
        "Plan lines, devices and data for delivery teams, field crews and logistics operations.",
      image: "/images/home/4.png", // or /images/home/13.png
      imagePosition: "left",
    },
  ] as const;

  return (
    <section className="relative w-full bg-[#132B40] py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#FACC15] text-xs font-semibold tracking-wider uppercase mb-3">
              <span className="flex items-center gap-0.5">
                <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
                <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
              </span>
              <span>Resources & guidance</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Know more. Work smarter.
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-normal">
              Helpful guides for switching, activation, connectivity and fleet
              operations.
            </p>
          </div>
        </div>

        {/* 2x2 Resource Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {articles.map((item, idx) => {
            return (
              <a
                key={idx}
                href="#"
                className="group  border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col sm:flex-row hover:border-white/20 transition-all duration-300 hover:-translate-y-1 block"
              >
                {/* Conditional Image Order based on imagePosition */}
                {item.imagePosition === "left" ? (
                  <>
                    {/* Image Box */}
                    <div className="relative w-full sm:w-[42%] h-48 sm:h-auto shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Yellow Category Badge */}
                      <div className="absolute top-3 left-3 bg-[#FACC15] text-[#0E2131] text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                        {item.badge}
                      </div>
                    </div>

                    {/* Text Content Box */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mb-2">
                          <span>{item.updated}</span>
                          <span>•</span>
                          <span>{item.readTime}</span>
                        </div>

                        <h3 className="font-extrabold text-lg sm:text-xl text-white mb-2 tracking-tight group-hover:text-[#FACC15] transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-xs text-gray-300 leading-relaxed font-normal mb-6">
                          {item.description}
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-200 group-hover:text-[#FACC15] transition-colors">
                        <span>Read the guide</span>
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Text Content Box First */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between order-2 sm:order-1">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mb-2">
                          <span>{item.updated}</span>
                          <span>•</span>
                          <span>{item.readTime}</span>
                        </div>

                        <h3 className="font-extrabold text-lg sm:text-xl text-white mb-2 tracking-tight group-hover:text-[#FACC15] transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-xs text-gray-300 leading-relaxed font-normal mb-6">
                          {item.description}
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-200 group-hover:text-[#FACC15] transition-colors">
                        <span>Read the guide</span>
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>

                    {/* Image Box Second */}
                    <div className="relative w-full sm:w-[42%] h-48 sm:h-auto shrink-0 overflow-hidden order-1 sm:order-2">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Yellow Category Badge */}
                      <div className="absolute top-3 left-3 bg-[#FACC15] text-[#0E2131] text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                        {item.badge}
                      </div>
                    </div>
                  </>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
