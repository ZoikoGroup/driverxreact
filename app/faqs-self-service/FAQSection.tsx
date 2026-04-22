"use client";

import { useState } from "react";
import RequestForm from "../components/request-form/form";

type TextBlock = { type: "text"; content: string };
type ListBlock = { type: "list"; items: string[] };
type ContentBlock = TextBlock | ListBlock;

type FAQItem = {
  q: string;
  a: string | string[] | ContentBlock[];
};

const faqData: Record<string, FAQItem[]> = {
  prepaid: [
    {
      q: "What are DriverX Mobile Prepaid Plans?",
      a: "DriverX Mobile Prepaid Plans offer affordable, flexible wireless service without contracts, credit checks, or hidden fees.",
    },
    {
      q: "What prepaid plans are available?",
      a: [
        {
          type: "text",
          content: "DriverX Mobile offers four plans:",
        },
        {
          type: "list",
          items: [
            "JumpStart 5 – 5GB data",
            "Cruise 15 – 15GB data",
            "PowerDrive 25 – 25GB data",
            "Unlimited Freedom – Unlimited (50GB FUP)",
          ],
        },
      ],
    },
    {
      q: "How much do prepaid plans cost?",
      a: [
        "JumpStart 5: $25/month",
        "Cruise 15: $40/month",
        "PowerDrive 25: $60/month",
        "Unlimited Freedom: $75/month",
      ],
    },
  ],

  postpaid: [
    {
      q: "What is postpaid?",
      a: "Monthly billing after usage with additional benefits.",
    },
    {
      q: "Billing cycle?",
      a: "Standard 30-day billing cycle.",
    },
  ],

  business: [
    {
      q: "Fleet support?",
      a: "Yes, enterprise-grade solutions for fleets.",
    },
    {
      q: "Custom plans?",
      a: "We offer tailored enterprise plans.",
    },
  ],
};

function RenderAnswer({ a }: { a: FAQItem["a"] }) {
  // string
  if (typeof a === "string") {
    return <p className="text-sm text-gray-600">{a}</p>;
  }

  // string[]
  if (Array.isArray(a) && typeof a[0] === "string") {
    return (
      <ul className="list-disc pl-5 space-y-2">
        {(a as string[]).map((item, i) => (
          <li key={i} className="text-sm text-gray-600">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  // ContentBlock[]
  if (Array.isArray(a)) {
    return (
      <div className="space-y-3">
        {(a as ContentBlock[]).map((block, i) => {
          if (block.type === "text") {
            return (
              <p key={i} className="text-sm text-gray-600">
                {block.content}
              </p>
            );
          }

          if (block.type === "list") {
            return (
              <ul key={i} className="list-disc pl-5 space-y-2">
                {block.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600">
                    {item}
                  </li>
                ))}
              </ul>
            );
          }

          return null;
        })}
      </div>
    );
  }

  return null;
}

export default function FAQSection() {
  const [activeTab, setActiveTab] =
    useState<keyof typeof faqData>("prepaid");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      {/* Header */}
      <div className="bg-teal-800 py-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          FAQs & Self-Service Help Center
        </h1>
      </div>

      {/* Intro */}
      <div className="bg-white py-10 text-center">
        <p className="text-lg font-semibold text-gray-800">
          Need help? We've got answers.
        </p>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Browse common questions or manage your account instantly.
        </p>
      </div>

      {/* Main Section */}
      <section className="bg-[#eef3f1] py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

          {/* LEFT */}
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Frequently Asked Questions
            </h2>

            <div className="flex gap-6 border-b pb-2">
              {Object.keys(faqData).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab as keyof typeof faqData);
                    setOpenIndex(0);
                  }}
                  className={`pb-2 ${
                    activeTab === tab
                      ? "border-b-2 border-teal-600 text-teal-700"
                      : "text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            {faqData[activeTab].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border shadow-sm"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === i ? null : i)
                  }
                  className="w-full flex justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {item.q}
                  </span>
                  <span>{openIndex === i ? "−" : "+"}</span>
                </button>

                {openIndex === i && (
                  <div className="px-5 pb-4">
                    <RenderAnswer a={item.a} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <RequestForm requestType="support" />
      </section>
    </>
  );
}