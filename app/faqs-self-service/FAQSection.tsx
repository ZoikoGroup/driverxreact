"use client";

import { useState } from "react";

const faqData = {
  prepaid: [
    {
      
      q: "What are DriverX Mobile Prepaid Plans?",
      a: [
        "DriverX Mobile Prepaid Plans offer affordable, flexible wireless service without contracts, credit checks, or hidden fees. You prepay monthly and enjoy premium coverage, great speeds, and full control over your usage.",
      ]
    },
    {
       q: "What prepaid plans are available?",
      a: [
        "JumpStart 5: 5GB of high-speed data, unlimited talk and text, 1GB mobile hotspot.",
        "Cruise 15: 15GB of high-speed data, unlimited talk and text, 3GB mobile hotspot.",
        "PowerDrive 25: 25GB of high-speed data, unlimited talk and text, 5GB mobile hotspot.",
        "Unlimited Freedom: Unlimited high-speed data (Fair Use up to 50GB), unlimited talk and text."
      ]

    },
    {
       q: "How much do DriverX Mobile Prepaid Plans cost?",
      a: [
        " JumpStart 5: $25 per month",
        "Cruise 15: $40 per month.",
        "PowerDrive 25: $60 per month.",
        "Unlimited Freedom: $75 per month."
      ]

    }
  ],
  postpaid: [
    {
      q: "What is postpaid?",
      a: "Monthly billing after usage with flexible plans."
    },
    {
      q: "Billing cycle?",
      a: "Standard 30-day billing cycle."
    }
  ],
  business: [
    {
      q: "Fleet support?",
      a: "Yes, enterprise-grade solutions for fleets."
    },
    {
      q: "Custom plans?",
      a: "We offer tailored enterprise plans."
    }
  ],
};

export default function FAQSection() {
  const [activeTab, setActiveTab] = useState<keyof typeof faqData>("prepaid");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-[#eef3f1] py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">

        {/* LEFT SIDE */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-snug">
            Frequently Asked <br /> Questions
          </h2>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-300 pb-2">
            {Object.keys(faqData).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as any);
                  setOpenIndex(0);
                }}
                className={`text-sm font-medium pb-2 transition ${
                  activeTab === tab
                    ? "text-teal-700 border-b-2 border-teal-600"
                    : "text-gray-500 hover:text-teal-600"
                }`}
              >
                {tab === "prepaid" && "Prepaid Plans"}
                {tab === "postpaid" && "Postpaid Plans"}
                {tab === "business" && "Business Plans"}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-4">

          {faqData[activeTab].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === i ? null : i)
                }
                className="w-full flex justify-between items-center px-5 py-4 text-left"
              >
                <span className="text-sm md:text-base font-medium text-gray-800">
                  {item.q}
                </span>

                <span className="text-lg text-gray-600">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>

              {openIndex === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">

                  {Array.isArray(item.a) ? (
                    <ul className="list-disc pl-5 space-y-2 marker:text-teal-600">
                      {item.a.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{item.a}</p>
                  )}

                </div>
              )}
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}