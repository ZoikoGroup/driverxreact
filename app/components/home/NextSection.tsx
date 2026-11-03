import React from "react";
import { ArrowRight } from "lucide-react";

export default function NextSection() {
  return (
    <section className="relative w-full bg-[#0E2131] py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center text-white mb-12 sm:mb-16 tracking-tight">
          Ready to make your next move?
        </h2>

        {/* Slanted Dual Banner Container */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch">
          {/* Left Teal Section: For drivers */}
          <div className="relative flex-1 bg-[#0A4138] text-white p-8 sm:p-10 lg:p-14 flex flex-col justify-between min-h-[300px] z-10">
            <div>
              <span className="text-xs font-bold text-[#FACC15] uppercase tracking-wider block mb-3">
                For drivers
              </span>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight">
                Explore wireless plans
              </h3>

              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal max-w-sm mb-8">
                Compare prepaid, postpaid and data-only options for work on the
                road.
              </p>
            </div>

            <div>
              <a
                href="#"
                className="inline-flex items-center justify-between gap-3 bg-[#FACC15] hover:bg-[#e3b810] text-[#0E2131] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-lg"
              >
                <span>Explore Plans</span>
                <div className="w-6 h-6 rounded-full bg-white text-[#0E2131] flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </a>
            </div>
          </div>

          {/* Right Yellow Section with Diagonal Slanted Cut: For fleets */}
          <div
            className="relative flex-1 bg-[#FACC15] text-[#0E2131] p-8 sm:p-10 lg:p-14 flex flex-col justify-between min-h-[300px] z-20 md:-ml-12"
            style={{
              clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0% 100%)",
            }}
          >
            <div className="pl-4 sm:pl-8">
              <span className="text-xs font-bold text-[#0E2131]/80 uppercase tracking-wider block mb-3">
                For fleets
              </span>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0E2131] mb-3 tracking-tight">
                Talk with our team
              </h3>

              <p className="text-xs sm:text-sm text-[#0E2131]/80 leading-relaxed font-semibold max-w-sm mb-8">
                Get help planning lines and devices for your drivers and
                vehicles.
              </p>
            </div>

            <div className="pl-4 sm:pl-8">
              <a
                href="#"
                className="inline-flex items-center justify-between gap-3 bg-[#0E2131] hover:bg-[#07131D] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-xl"
              >
                <span>Talk to Sales</span>
                <div className="w-6 h-6 rounded-full bg-[#FACC15] text-[#0E2131] flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
