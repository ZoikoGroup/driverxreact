"use client";
import { useState } from "react";

export default function PlansSection() {
  const [activeTab, setActiveTab] = useState("prepaid");

  const plansData = {
    prepaid: [
      {
        name: "DriverX Starter 5",
        price: 16,
        tag: "Weekend drivers, part-time workers, casual users",
        featuresLeft: ["5GB High-Speed Data", "10GB Mobile Hotspot"],
        featuresRight: [
          "Unlimited Talk & Text (U.S. only)",
          "Free International Calls & Texts",
        ],
      },
      {
        name: "DriverX Cruise 15",
        price: 38,
        tag: "Regular gig drivers and steady users",
        featuresLeft: ["15GB High-Speed Data", "5GB Mobile Hotspot"],
        featuresRight: [
          "Unlimited Talk & Text (U.S., Canada, Mexico)",
          "Free International Calls & Texts",
        ],
      },
    ],
    postpaid: [],
    data: [],
    business: [],
  };

  const plans = plansData[activeTab as keyof typeof plansData];

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-2xl font-semibold text-center">
        Choose Plan That’s Right For You
      </h1>

      <p className="text-gray-500 text-center mt-2">
        Choose plan that works best for you
      </p>

      {/* Tabs */}
      <div className="flex justify-center mt-8">
        <div className="bg-gray-100 p-1 rounded-full flex gap-2 shadow-inner">
          {Object.keys(plansData).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-green-700 text-white shadow"
                  : "text-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Plans
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="mt-12 space-y-6 border-2 border-blue-500 p-6 rounded-xl">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border p-6 flex justify-between items-center"
          >
            {/* Left */}
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <h3 className="bg-green-700 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {plan.name}
                </h3>
                <span className="text-sm text-gray-500">{plan.tag}</span>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-4 text-sm text-gray-600">
                <ul className="space-y-2">
                  {plan.featuresLeft.map((item, i) => (
                    <li key={i}>✔ {item}</li>
                  ))}
                </ul>
                <ul className="space-y-2">
                  {plan.featuresRight.map((item, i) => (
                    <li key={i}>✔ {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-8 pl-10 border-l">
              <div>
                <span className="text-2xl font-bold">${plan.price}</span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>

              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-sm font-medium transition">
                Buy Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}