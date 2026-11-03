"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus, ArrowUpRight } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Can I keep my number?",
      answer:
        "Yes, you can bring your current phone number to DriverX Mobile. Make sure your account with your previous carrier remains active until the transfer is complete.",
    },
    {
      question: "Can I use my phone?",
      answer:
        "Most unlocked 4G LTE and 5G smartphones are fully compatible with DriverX Mobile. You can bring your own device using either a physical SIM or an eSIM.",
    },
    {
      question: "How does eSIM activation work?",
      answer:
        "Once you purchase a plan with eSIM support, you'll receive a QR code via email. Scan it with your compatible phone's camera settings to download and activate your profile instantly.",
    },
    {
      question: "How do I check coverage?",
      answer:
        "You can check network coverage by entering your U.S. ZIP code into our coverage checker tool on this page to see predicted service strength in your working areas.",
    },
    {
      question: "Are taxes and fees included in the price?",
      answer:
        "Clear pricing terms are shown before you buy, detailing standard taxes, regulatory fees, and any applicable regional surcharges according to your chosen plan.",
    },
    {
      question: "What happens after I use my high-speed data?",
      answer:
        "If you exceed your plan’s high-speed data allowance, you may experience reduced data speeds through the remainder of your billing cycle, or you can purchase a Top-Up plan.",
    },
  ] as const;

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full bg-[#0E2131] py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 text-[#FACC15] text-xs font-semibold tracking-wider uppercase mb-3">
            <span className="flex items-center gap-0.5">
              <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
              <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
            </span>
            <span>Questions before you switch</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Straight answers, before you decide.
          </h2>
        </div>

        {/* Main Grid: Left Accordion List vs Right Callout Banner Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Accordion Questions (span 8) */}
          <div className="lg:col-span-8 space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#142A3E]/90 border border-white/10 rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  >
                    <span className="font-bold text-sm sm:text-base text-white pr-4">
                      {faq.question}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#FACC15] text-[#0E2131] flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200">
                      {isOpen ? (
                        <Minus className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <Plus className="w-4 h-4 stroke-[3]" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-0 text-xs sm:text-sm text-gray-300 leading-relaxed font-normal border-t border-white/5 mt-1 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Still Have Questions Card with Image Background (span 4) */}
          <div className="lg:col-span-4 relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 min-h-[420px] sm:min-h-[480px] flex flex-col justify-end p-6 sm:p-8">
            {/* Background Skyline Image (/images/home/9.png) */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/home/9.png"
                alt="City skyline"
                fill
                className="object-cover object-center"
              />
              {/* Gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#061A26] via-[#061A26]/70 to-transparent" />
            </div>

            {/* Card Content */}
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
                Still have questions?
              </h3>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6 font-normal">
                Short answers here, full terms and step-by-step guides in the
                Help Center.
              </p>

              <a
                href="#"
                className="inline-flex items-center justify-between gap-3 bg-[#FACC15] hover:bg-[#e3b810] text-[#0E2131] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-xl w-full sm:w-auto"
              >
                <span>Visit Help Center</span>
                <div className="w-6 h-6 rounded-full bg-[#0E2131] text-white flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
