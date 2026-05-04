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
    a: "DriverX Mobile Prepaid Plans offer affordable, flexible wireless service without contracts, credit checks, or hidden fees. You prepay monthly and enjoy premium coverage, great speeds, and full control over your usage.",
  },
  {
    q: "What prepaid plans are available?",
    a: [
      {
        type: "text",
        content: "DriverX Mobile offers four world-class prepaid plans to fit different needs:",
      },
      {
        type: "list",
        items: [
          "JumpStart 5: 5GB of high-speed data, unlimited talk and text, 1GB mobile hotspot.",
          "Cruise 15: 15GB of high-speed data, unlimited talk and text, 3GB mobile hotspot.",
          "PowerDrive 25: 25GB of high-speed data, unlimited talk and text, 5GB mobile hotspot.",
          "Unlimited Freedom: Unlimited high-speed data (Fair Use up to 50GB), unlimited talk and text, 7GB mobile hotspot.",
        ],
      },
      {
        type: "text",
        content: "Each plan includes free international texting and simple activation through eSIM or SIM card.",
      },
    ] as ContentBlock[],
  },
  {
    q: "How much do DriverX Mobile Prepaid Plans cost?",
    a: [
      {
        type: "list",
        items: [
          "JumpStart 5: $25 per month.",
          "Cruise 15: $40 per month.",
          "PowerDrive 25: $60 per month.",
          "Unlimited Freedom: $75 per month.",
        ],
      },
      {
        type: "text",
        content: "Taxes and fees may apply based on your location.",
      },
    ] as ContentBlock[],
  },
  {
    q: "Is there a credit check or contract?",
    a: "No. DriverX Prepaid is 100% no-contract, and no credit check is required. You pay month-to-month and have full freedom to change, upgrade, or cancel anytime.",
  },
  {
    q: "What happens if I use all my high-speed data?",
    a: [
      {
        type: "text",
        content: "Once you reach your high-speed data limit for the month:",
      },
      {
        type: "list",
        items: [
          "Your data will continue at slower 2G speeds (typically 128–256kbps) for the rest of your billing cycle.",
          "You can purchase additional high-speed data anytime through the DriverX app or portal if you need more.",
        ],
      },
    ] as ContentBlock[],
  },
  {
    q: "How does the Unlimited Freedom plan work?",
    a: "Unlimited Freedom offers unlimited data with premium 5G/LTE speeds for up to 50GB per month. After 50GB, your speeds may slow during times of network congestion to maintain service quality for all users. You'll still have unlimited data, just at a reduced speed when the network is busy.",
  },
  {
    q: "Are mobile hotspot services included?",
    a: [
      {
        type: "text",
        content: "Yes! Each prepaid plan includes mobile hotspot access:",
      },
      {
        type: "list",
        items: [
          "JumpStart 5 includes 1GB of hotspot data.",
          "Cruise 15 includes 3GB.",
          "PowerDrive 25 includes 5GB.",
          "Unlimited Freedom includes 7GB.",
        ],
      },
      {
        type: "text",
        content: "Once you use your hotspot allowance, you can buy hotspot add-ons or continue at reduced speeds.",
      },
    ] as ContentBlock[],
  },
  {
    q: "What payment methods are accepted?",
    a: "DriverX Mobile accepts all major credit cards, debit cards, and digital wallets like Apple Pay and Google Pay for prepaid plan purchases.",
  },
  {
    q: "Can I bring my own phone (BYOD)?",
    a: "Yes, absolutely! DriverX Mobile supports most unlocked GSM-compatible devices. Before activating, we recommend checking your device's IMEI number to ensure compatibility with our network.",
  },
  {
    q: "How do I activate my prepaid plan?",
    a: [
      {
        type: "text",
        content: "Activating your DriverX Prepaid Plan is easy:",
      },
      {
        type: "list",
        items: [
          "Purchase your plan online.",
          "Receive an instant eSIM activation link or request a physical SIM card shipment.",
          "Follow the simple instructions to activate within minutes.",
        ],
      },
      {
        type: "text",
        content: "If you need help, DriverX Support is available via chat, email, or phone.",
      },
    ] as ContentBlock[],
  },
  {
    q: "Can I switch plans later?",
    a: "Yes! You can upgrade, downgrade, or change your prepaid plan at the end of your current monthly cycle. Manage your plan easily through the DriverX app or online portal.",
  },
  {
    q: "Does DriverX Mobile support international features?",
    a: "Yes. Every prepaid plan includes free international texting to over 100 countries. For international calling or roaming, you can add low-cost global calling packs at any time.",
  },
  {
    q: "How do refills and renewals work?",
    a: "You can easily refill your plan manually through the app, website, or set up Auto-Refill for seamless monthly renewals. Auto-Refill customers enjoy bonus rewards like small discounts or bonus data on select promotions.",
  },
  {
    q: "Can I pause or suspend my prepaid plan?",
    a: "Prepaid plans are active for the full billing cycle once purchased. If you choose not to renew, your service will simply expire at the end of the billing period without penalties.",
  },
  {
    q: "Where can I manage my account?",
    a: [
      {
        type: "text",
        content: "You can manage everything through the DriverX Mobile app or the DriverX online portal:",
      },
      {
        type: "list",
        items: [
          "Check your usage",
          "Refill your account",
          "Change plans",
          "Update payment info",
          "Access support",
        ],
      },
      {
        type: "text",
        content: "Everything is built for full flexibility and control!",
      },
    ] as ContentBlock[],
  },
],
  postpaid: [
  {
    q: "What are DriverX Mobile Postpaid Plans?",
    a: "DriverX Mobile Postpaid Plans offer flexible, premium wireless service billed monthly after usage. You get high-speed data, unlimited talk and text, international benefits, and powerful gig worker perks — all on a premium network.",
  },
  {
    q: "What postpaid plans does DriverX Mobile offer?",
    a: [
      {
        type: "text",
        content: "DriverX Mobile offers several postpaid plans to fit different needs:",
      },
      {
        type: "list",
        items: [
          "dX Flex 7: 7GB high-speed data, unlimited talk and text, 2GB mobile hotspot.",
          "dX Essential 17: 17GB high-speed data, unlimited talk and text, 7GB mobile hotspot, international roaming in select countries.",
          "dXm Infinite: Unlimited 5G/LTE data (Fair Use at 50GB), 10GB hotspot, free international calling.",
          "dXm Elite: Unlimited 5G/LTE data (priority speeds up to 50GB), 30GB hotspot, free global roaming, AI-powered gig insights.",
          "dX Enterprise: Customized business packages for fleets, with shared data and dedicated support.",
        ],
      },
    ] as ContentBlock[],
  },
  {
    q: "How much do DriverX Mobile Postpaid Plans cost?",
    a: [
      {
        type: "text",
        content: "DriverX Mobile Postpaid Plans start at approximately:",
      },
      {
        type: "list",
        items: [
          "dX Flex 7: $30 per month.",
          "dX Essential 17: $45–$50 per month.",
          "dXm Infinite: $70 per month.",
          "dXm Elite: $95 per month.",
          "dX Enterprise: Custom pricing based on fleet size and requirements.",
        ],
      },
      {
        type: "text",
        content: "Pricing varies depending on plan features, device financing options, and any promotions applied.",
      },
    ] as ContentBlock[],
  },
  {
    q: "What's the difference between Prepaid and Postpaid?",
    a: "With Prepaid, you pay before service each month and there's no credit check. With Postpaid, you pay after usage each month, typically with added benefits like international roaming, loyalty perks, and access to premium services.",
  },
  {
    q: "Is a credit check required for postpaid activation?",
    a: "Yes, a basic credit check is required to activate a DriverX Mobile Postpaid Plan. This helps ensure eligibility for monthly billing and device financing (if selected).",
  },
  {
    q: "How does billing work for postpaid customers?",
    a: "You'll receive a monthly statement detailing all your charges, typically due 15–20 days after the bill is generated. You can view, manage, and pay your bill easily via the DriverX Mobile app or online portal. AutoPay and eBilling options are available for convenience and possible discounts.",
  },
  {
    q: "What happens if I use all my high-speed data?",
    a: [
      {
        type: "text",
        content: "If you exceed your high-speed data allowance:",
      },
      {
        type: "list",
        items: [
          "On capped plans like dX Flex 7 and dX Essential 17, you'll continue at slower speeds (typically 512kbps–1Mbps).",
          "On unlimited plans like dXm Infinite and dXm Elite, after 50GB of high-speed data, your speeds may slow during network congestion based on Fair Use Policy.",
        ],
      },
      {
        type: "text",
        content: "You can purchase high-speed data top-ups if needed anytime through your account.",
      },
    ] as ContentBlock[],
  },
  {
    q: "How does the Unlimited Data on Postpaid plans work?",
    a: "Unlimited plans include premium 5G/LTE access. After reaching the Fair Use threshold (e.g., 50GB), speeds may slow slightly during peak usage times to maintain network performance. Your data remains unlimited — just at reduced speeds temporarily if needed.",
  },
  {
    q: "What mobile hotspot allowances are included?",
    a: [
      {
        type: "list",
        items: [
          "dX Flex 7 includes 2GB of mobile hotspot.",
          "dX Essential 17 includes 7GB of hotspot data.",
          "dXm Infinite includes 10GB of hotspot.",
          "dXm Elite includes 30GB of mobile hotspot.",
        ],
      },
      {
        type: "text",
        content: "Additional hotspot booster packs are available for purchase.",
      },
    ] as ContentBlock[],
  },
  {
    q: "Can I bring my own device (BYOD)?",
    a: "Yes, DriverX Mobile supports BYOD programs. Your device must be unlocked and compatible with GSM networks. You can check compatibility easily during signup or through our online tool.",
  },
  {
    q: "Do postpaid plans include international features?",
    a: "Yes. All postpaid plans include free international texting, and selected plans (like dX Essential 17, dXm Infinite, and dXm Elite) include free or discounted international roaming, free international calling, and global roaming in over 160–220 countries.",
  },
  {
    q: "What loyalty or rewards are offered for postpaid customers?",
    a: [
      {
        type: "text",
        content: "DriverX Mobile rewards loyal customers with:",
      },
      {
        type: "list",
        items: [
          "Priority service upgrades after 6 months of active service.",
          "Bonus data offers and promotional perks at 12 months.",
          "Device upgrade opportunities after 12–18 months.",
          "Special gig worker discounts on fuel, insurance, maintenance, and more for eligible plans.",
        ],
      },
    ] as ContentBlock[],
  },
  {
    q: "What if I want to switch plans later?",
    a: "Postpaid customers can upgrade or downgrade their plans once per billing cycle without penalties. You can manage plan changes through the app, portal, or by speaking with DriverX Customer Care.",
  },
  {
    q: "How do I activate my postpaid plan?",
    a: [
      {
        type: "text",
        content: "Activation is simple:",
      },
      {
        type: "list",
        items: [
          "Apply online or with a DriverX Sales Specialist.",
          "Complete a credit check.",
          "Choose your plan and device (or BYOD).",
          "Receive a SIM card or eSIM activation.",
          "Start service within minutes or 1–2 days (for physical SIM delivery).",
        ],
      },
    ] as ContentBlock[],
  },
  {
    q: "What support options are available?",
    a: [
      {
        type: "text",
        content: "DriverX Mobile provides premium support for postpaid customers, including:",
      },
      {
        type: "list",
        items: [
          "24/7 live chat, phone, and email support.",
          "In-app support ticketing.",
          "Fleet Concierge access for business and enterprise customers.",
        ],
      },
    ] as ContentBlock[],
  },
],
  business: [
  {
    q: "What types of businesses are eligible for DriverX Mobile Business Plans?",
    a: [
      {
        type: "text",
        content: "DriverX Mobile Business Plans are designed for small, medium, and large businesses operating mobile teams, fleets, or remote workers. We support industries such as logistics, transportation, field services, gig platforms, delivery networks, and government operations.",
      },
      {
        type: "text",
        content: "A valid U.S. business tax ID (EIN) is required to activate business plans.",
      },
    ] as ContentBlock[],
  },
  {
    q: "How does billing work for business plans?",
    a: "Billing is consolidated into one simple monthly invoice for all active lines on your account. You can easily add or remove lines through your online portal, and charges adjust on your next bill cycle accordingly. Optional AutoPay discounts and eBilling options are available for added convenience.",
  },
  {
    q: "Can I mix different DriverX Business Plans across my fleet?",
    a: "Yes. You can customize your fleet by assigning different plans to different lines based on each driver's usage needs. For example, you can give supervisors Fleet Unlimited plans while assigning Flex 10 plans to seasonal drivers.",
  },
  {
    q: "How do I manage my fleet's lines and data usage?",
    a: [
      {
        type: "text",
        content: "Every DriverX Business customer receives access to the DriverX Fleet Portal:",
      },
      {
        type: "list",
        items: [
          "Activate, suspend, or terminate lines instantly.",
          "Monitor data usage per line in real time.",
          "View detailed billing, call history, and hotspot usage reports.",
          "Set data usage alerts or limits for specific lines if needed.",
          "Access GPS tracking integration options (where available).",
        ],
      },
    ] as ContentBlock[],
  },
  {
    q: "What is the Fair Use Policy for Unlimited Plans?",
    a: "Unlimited plans include up to 50GB of high-speed 5G/LTE data per line per billing cycle. After reaching the high-speed threshold, data speeds may be reduced during periods of network congestion to ensure fair network access for all users. Hotspot usage is also subject to specific plan limits (e.g., 15GB for Fleet Unlimited).",
  },
  {
    q: "How quickly can my business get started with DriverX Mobile?",
    a: "Activation is fast and simple. If you use eSIM-capable devices, activation can occur the same day after account approval. If you require physical SIM cards, we ship priority via UPS or FedEx, usually within 1–2 business days.",
  },
  {
    q: "Are mobile hotspot services included in DriverX Business Plans?",
    a: [
      {
        type: "text",
        content: "Yes. Every business plan includes mobile hotspot access with a specific allotment of high-speed data:",
      },
      {
        type: "list",
        items: [
          "Fleet Flex 10 includes 5GB hotspot per line.",
          "Fleet Core 25 includes 10GB hotspot per line.",
          "Fleet Unlimited includes 15GB hotspot per line.",
        ],
      },
      {
        type: "text",
        content: "Hotspot data boosters are available for purchase if your fleet needs more.",
      },
    ] as ContentBlock[],
  },
  {
    q: "Can I bring my own devices (BYOD) to DriverX Mobile?",
    a: "Absolutely. DriverX Mobile fully supports BYOD (Bring Your Own Device) programs. Your devices must be unlocked and compatible with GSM networks (5G/4G LTE supported). Our team can assist you in checking IMEI compatibility during onboarding.",
  },
  {
    q: "Does DriverX Mobile offer fleet GPS tracking and telematics integration?",
    a: "Yes. Fleet GPS tracking is available as an optional add-on or included with certain plans like Fleet Core 25 and higher. DriverX integrates with major telematics platforms for driver behavior monitoring, route optimization, and live vehicle tracking.",
  },
  {
    q: "What kind of support does DriverX offer business customers?",
    a: "DriverX Business customers enjoy 24/7 access to a dedicated fleet concierge team. This includes live phone support, priority ticket handling, proactive account monitoring, and direct escalation contacts for mission-critical fleet operations.",
  },
  {
    q: "Are there contracts required for DriverX Business Plans?",
    a: "DriverX Business Plans are available without contracts unless your organization requests a customized agreement for special pricing or device financing. Our month-to-month flexibility gives your business freedom to scale up or down based on your needs.",
  },
  {
    q: "How does DriverX's pricing compare to major carriers?",
    a: "DriverX Mobile offers business-grade service quality with much greater flexibility and cost efficiency than traditional carriers. Our pricing is straightforward, competitive, and designed specifically for businesses managing mobile fleets and teams.",
  },
  {
    q: "What are the loyalty rewards for DriverX Business customers?",
    a: [
      {
        type: "text",
        content: "DriverX Business offers a Fleet Loyalty Rewards Program:",
      },
      {
        type: "list",
        items: [
          "After 12 months with 10+ active lines, earn a free month of service for every line.",
          "Grow beyond 25 lines and receive a permanent 5% monthly discount and free hotspot data boosts.",
          "Reach 50+ lines to unlock Platinum status benefits including bonus free lines and a dedicated account manager.",
          "100+ lines achieve Diamond status with 15% discounts and VIP fleet support.",
        ],
      },
    ] as ContentBlock[],
  },
  {
    q: "What happens if a line exceeds its monthly data allowance?",
    a: "If a line exceeds its high-speed data allowance, it will continue operating at reduced speeds (typically 512kbps–1Mbps) for the remainder of the billing cycle. Business managers will also be notified via portal alerts, and you can purchase additional high-speed data boosters instantly if needed.",
  },
  {
    q: "How do I get started with DriverX Mobile Business Plans?",
    a: [
      {
        type: "text",
        content: "Getting started is simple:",
      },
      {
        type: "list",
        items: [
          "Contact a DriverX Fleet Specialist via our website or business sales line.",
          "Complete a short application including your business tax ID (EIN) and company information.",
          "Choose your plans and activate your fleet within 24–48 hours.",
        ],
      },
      {
        type: "text",
        content: "Our team handles everything — activation, shipping, onboarding, and optimization — to get you moving fast.",
      },
    ] as ContentBlock[],
  },
],
};
 
function RenderAnswer({ a }: { a: FAQItem["a"] }) {
  // Plain string → <p>
  if (typeof a === "string") {
    return <p className="text-sm text-gray-600 leading-relaxed">{a}</p>;
  }
 
  // string[] → simple <ul>
  if (Array.isArray(a) && typeof a[0] === "string") {
    return (
      <ul className="list-disc pl-5 space-y-2 marker:text-teal-600">
        {(a as string[]).map((point, idx) => (
          <li key={idx} className="text-sm text-gray-600">{point}</li>
        ))}
      </ul>
    );
  }
 
  // ContentBlock[] → mixed: list + text rendered separately but together
  if (Array.isArray(a) && typeof a[0] === "object" && "type" in a[0]) {
    return (
      <div className="space-y-3">
        {(a as ContentBlock[]).map((block, idx) => {
          if (block.type === "list") {
            return (
              <ul key={idx} className="list-disc pl-5 space-y-2 marker:text-teal-600">
                {block.items.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600">{item}</li>
                ))}
              </ul>
            );
          }
          if (block.type === "text") {
            return (
              <p key={idx} className="text-sm text-gray-500 leading-relaxed">
                {block.content}
              </p>
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
  const [activeTab, setActiveTab] = useState<keyof typeof faqData>("prepaid");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
 
  return (
    <>

    <div className="bg-teal-800 py-6 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold  text-white">
          FAQs & Self-Service Help Center
        </h1>
      </div>
 
      {/* White subtitle section */}
      <div className="bg-white py-10 px-4 text-center dark:bg-gray-900 dark:text-white ">
        <p className="text-base md:text-lg font-semibold text-gray-800 mb-2 dark:text-white">
          Need help? We've got answers.
        </p>
        <p className="text-sm md:text-base dark:bg-gray-900 dark:text-white text-gray-500 max-w-2xl mx-auto leading-relaxed">
          From plan details to account management and technical support, find everything you need
          in our self-service help center. Browse common questions or manage your account
          instantly — no wait times, no hassle.
        </p>
      </div>
    <section className="bg-[#eef3f1] py-16 px-4 dark:bg-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
 
        {/* LEFT SIDE */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold dark:bg-gray-900 dark:text-white text-gray-800 mb-6 leading-snug">
            Frequently Asked <br /> Questions
          </h2>
 
          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-300 pb-2">
            {Object.keys(faqData).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as keyof typeof faqData);
                  setOpenIndex(0);
                }}
                className={`text-sm font-medium pb-2 transition ${
                  activeTab === tab
                    ? "text-teal-700 border-b-2 border-teal-600 dark:border-teal-400"
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
              className="bg-white rounded-xl border dark:bg-gray-900 dark:text-white border-gray-200 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center px-5 py-4 text-left dark:bg-gray-900 dark:text-white"
              >
                <span className="text-sm md:text-base font-medium text-gray-800 dark:bg-gray-900 dark:text-white">
                  {item.q}
                </span>
                <span className="text-lg dark:bg-gray-900 dark:text-white text-gray-600">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
 
              {openIndex === i && (
                <div className="px-5 pb-4 dark:bg-gray-900 dark:text-white">
                  <RenderAnswer a={item.a} />
                </div>
              )}
            </div>
          ))}
        </div>
 
      </div>

      <br />

       <RequestForm requestType="support" />
    </section>
    </>
  );
}