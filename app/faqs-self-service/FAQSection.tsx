"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What are DriverX Mobile Prepaid Plans?",
      answer: `DriverX Mobile Prepaid Plans offer affordable, flexible wireless service without contracts, credit checks, or hidden fees. You prepay monthly and enjoy premium coverage, great speeds, and full control over your usage.`,
    },
    {
      question: "What prepaid plans are available?",
      answer: `DriverX Mobile offers four world-class prepaid plans:

JumpStart 5: 5GB high-speed data, unlimited talk & text, 1GB hotspot.
Cruise 15: 15GB high-speed data, unlimited talk & text, 3GB hotspot.
PowerDrive 25: 25GB high-speed data, unlimited talk & text, 5GB hotspot.
Unlimited Freedom: Unlimited data (Fair Use up to 50GB), unlimited talk & text, 7GB hotspot.

Each plan includes free international texting and activation via eSIM or SIM.`,
    },
    {
      question: "How much do DriverX Mobile Prepaid Plans cost?",
      answer: `JumpStart 5: $25/month
Cruise 15: $40/month
PowerDrive 25: $60/month
Unlimited Freedom: $75/month

Taxes and fees may apply.`,
    },
    {
      question: "Is there a credit check or contract?",
      answer: `No. DriverX Prepaid is 100% no-contract and requires no credit check. You can upgrade, downgrade, or cancel anytime.`,
    },
    {
      question: "What happens if I use all my high-speed data?",
      answer: `After reaching your limit:

• Data continues at 2G speeds (128–256kbps)
• You can purchase additional high-speed data anytime via the app`,
    },
    {
      question: "How does the Unlimited Freedom plan work?",
      answer: `Unlimited Freedom provides premium 5G/LTE speeds up to 50GB. After 50GB, speeds may slow during congestion. Data remains unlimited.`,
    },
    {
      question: "Are mobile hotspot services included?",
      answer: `Yes.

JumpStart 5 → 1GB
Cruise 15 → 3GB
PowerDrive 25 → 5GB
Unlimited Freedom → 7GB`,
    },
    {
      question: "What payment methods are accepted?",
      answer: `All major credit cards, debit cards, Apple Pay, and Google Pay are accepted.`,
    },
    {
      question: "How do I activate my prepaid plan?",
      answer: `1. Purchase online
2. Receive instant eSIM link or request SIM
3. Follow activation steps

Support is available via chat, email, or phone.`,
    },
    {
      question: "Can I switch plans later?",
      answer: `Yes. You can change plans at the end of your billing cycle via the app or portal.`,
    },
    {
      question: "Does DriverX Mobile support international features?",
      answer: `Yes. All plans include free international texting to 100+ countries. Calling packs are available.`,
    },
    {
      question: "How do refills and renewals work?",
      answer: `Refill manually or enable Auto-Refill for seamless monthly renewals. Promotions may include bonus data.`,
    },
    {
      question: "Can I pause or suspend my prepaid plan?",
      answer: `Plans remain active for the full billing cycle. If not renewed, service expires without penalties.`,
    },
    {
      question: "Where can I manage my account?",
      answer: `Use the DriverX Mobile app or online portal to:

• Check usage
• Refill
• Change plans
• Update payment info
• Access support`,
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 dark:border-gray-700 
                       bg-gray-50 dark:bg-gray-900 transition-all duration-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left"
            >
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {faq.question}
              </h3>

              {openIndex === index ? (
                <Minus className="w-5 h-5 text-green-600 transition-transform duration-300" />
              ) : (
                <Plus className="w-5 h-5 text-green-600 transition-transform duration-300" />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? "max-h-[1000px] opacity-100 px-6 pb-5"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}