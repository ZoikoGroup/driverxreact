"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BusinessFleetSection() {
  const [selectedConnectivity, setSelectedConnectivity] = useState<string[]>([
    "Smartphones",
  ]);

  const toggleConnectivity = (item: string) => {
    if (selectedConnectivity.includes(item)) {
      setSelectedConnectivity(selectedConnectivity.filter((i) => i !== item));
    } else {
      setSelectedConnectivity([...selectedConnectivity, item]);
    }
  };

  const connectivityOptions = [
    "Smartphones",
    "Hotspots & tablets",
    "Telematics & IoT",
    "In-vehicle devices",
  ];

  return (
    <section className="relative w-full bg-[#0E2131] py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          {/* Left Title Block */}
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#FACC15] text-xs font-semibold tracking-wider uppercase mb-3">
              <span className="flex items-center gap-0.5">
                <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
                <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
              </span>
              <span>Business & fleet connectivity</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Keep your people, lines, and <br />
              devices connected.
            </h2>
          </div>

          {/* Right Subtitle */}
          <div className="max-w-md">
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-normal">
              Plan and manage wireless for delivery operations, field teams, and
              fleets. Tell us what you run and our business team will help you
              size the right setup.
            </p>
          </div>
        </div>

        {/* Main Grid: Left Images Collage vs Right Callback Form Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Collage */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Top Large Image */}
            <div className="relative w-full h-[280px] sm:h-[340px] rounded-2xl overflow-hidden shadow-xl border border-white/10">
              <Image
                src="/images/home/8.png"
                alt="Fleet vans"
                fill
                priority
                className="object-cover object-center"
              />
            </div>

            {/* Bottom Two Images Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bottom Left Image (Truck - 3.png) */}
              <div className="relative w-full h-[200px] sm:h-[220px] rounded-2xl overflow-hidden shadow-xl border border-white/10">
                <Image
                  src="/images/home/3.png"
                  alt="Truck logistics"
                  fill
                  className="object-cover object-center"
                />
              </div>

              {/* Bottom Right Image (Delivery Pro - 2.png) */}
              <div className="relative w-full h-[200px] sm:h-[220px] rounded-2xl overflow-hidden shadow-xl border border-white/10">
                <Image
                  src="/images/home/2.png"
                  alt="Delivery worker"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Callback Form Card */}
          <div className="lg:col-span-5 bg-white text-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100">
            <h3 className="text-xl sm:text-2xl font-black text-[#0E2131] mb-2 tracking-tight">
              Talk with our business team
            </h3>

            <p className="text-xs sm:text-sm text-gray-500 mb-6 font-normal">
              Tell us about your team and we&apos;ll reply by email.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              {/* Full name */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#0E2131] transition-colors"
                />
              </div>

              {/* Business email */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Business email
                </label>
                <input
                  type="email"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#0E2131] transition-colors"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  We&apos;ll only use this to respond to your request.
                </p>
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Company
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#0E2131] transition-colors"
                />
              </div>

              {/* Fleet size */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Fleet size
                </label>
                <input
                  type="text"
                  placeholder="Select number of lines"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-[#0E2131] transition-colors"
                />
              </div>

              {/* Connectivity you need */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  Connectivity you need
                </label>
                <div className="flex flex-wrap gap-2">
                  {connectivityOptions.map((option) => {
                    const isSelected = selectedConnectivity.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleConnectivity(option)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                          isSelected
                            ? "bg-[#0E2131] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="consent"
                  className="mt-0.5 rounded border-gray-300 text-[#0E2131] focus:ring-[#0E2131]"
                />
                <label
                  htmlFor="consent"
                  className="text-[11px] text-gray-500 leading-tight"
                >
                  I agree that DriverX Mobile may contact me about business
                  wireless service. See our{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-[#0E2131] font-bold underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 flex items-center justify-between bg-[#FACC15] hover:bg-[#e3b810] text-[#0E2131] font-bold text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-md cursor-pointer"
              >
                <span>Request a callback</span>
                <div className="w-6 h-6 rounded-full bg-[#0E2131] text-white flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
