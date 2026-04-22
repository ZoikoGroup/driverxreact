"use client";

import React from "react";

const plans = [
  {
    type: "Gig Driver Plans",
    designed: "Solo drivers, delivery workers, rideshare operators",
    features: "Unlimited talk/text, hotspot ready, no contract",
    network: "4G/5G on AT&T + T-Mobile",
  },
  {
    type: "Fleet Plans",
    designed: "Fleet operators (5–500+ vehicles)",
    features:
      "Centralized billing, pooled/tiered data, SIM management portal",
    network: "Enterprise-grade access & uptime",
  },
  {
    type: "Business Plans",
    designed: "Small businesses, mobile teams, franchises",
    features:
      "Multi-line support, flexible billing, real-time SIM control",
    network: "Dynamic priority routing",
  },
  {
    type: "IoT + Telematics",
    designed: "OEMs, logistics, kiosks, dashcams",
    features:
      "Low-usage fallback or high-data APIs, SIM lifecycle control",
    network: "Multi-network with fallback",
  },
  {
    type: "Travel & Cross-Border",
    designed: "Drivers across US/Canada/Mexico/LatAm",
    features:
      "Roaming bundles, dual-network eSIM/pSIM, intl. calling",
    network: "Global coverage in 200+ countries",
  },
];

const useCases = [
  {
    use: "Rideshare/Gig Driver",
    plan: "10GB Gig Plan",
    why: "GPS, comms & music – no slowdowns",
  },
  {
    use: "Local Courier Fleet (25 vehicles)",
    plan: "100GB Pooled Fleet Plan",
    why: "Share across vehicles, manage centrally",
  },
  {
    use: "Telematics Device OEM",
    plan: "Custom IoT Plan",
    why: "Embedded SIMs, fallback logic, API-ready",
  },
  {
    use: "Mobile Staff (15 agents)",
    plan: "5GB Business Line Plan",
    why: "VoIP-ready, admin-controlled, scalable",
  },
  {
    use: "Intl. Road Warrior",
    plan: "15GB Travel Intl Plan",
    why: "No SIM swaps, auto-routing across borders",
  },
];

const benefits = [
  "Instantly switch between eSIM & physical SIMs",
  "Avoid overages with real-time usage monitoring",
  "Customize plan structure by line, role, or device",
  "Get Tier-1 performance — without Tier-1 complexity",
  "Centralize everything in a telecom-grade admin portal",
];

export default function DriverXPlans() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10 dark:bg-gray-900 dark:text-white">
      {/* Header */}

        <div className="bg-teal-700 text-white text-center py-4 text-xl font-semibold">
       Compare Plans
      </div>
      <div className="text-center">
        <p className="text-teal-600 font-semibold">
          Compare | Choose | Connect
        </p>
        <p className="text-gray-500 mt-2 dark:bg-gray-900 dark:text-white">
          One minute is all it takes to find the best-fit wireless plan for your
          team, fleet, or business.
        </p>
      </div>

      {/* Plans Table */}
      <div className="bg-white border rounded-xl shadow-sm p-6 dark:bg-gray-900 dark:text-white">
        <h2 className="text-lg font-semibold mb-4">
          At-a-Glance: Which DriverX Plan Is Right for You?
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-white">
              <tr>
                <th className="text-left px-4 py-2">Plan Type</th>
                <th className="text-left px-4 py-2">Designed For</th>
                <th className="text-left px-4 py-2">Key Features</th>
                <th className="text-left px-4 py-2">Network & Speed</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3 text-teal-600 font-medium">
                    {p.type}
                  </td>
                  <td className="px-4 py-3">{p.designed}</td>
                  <td className="px-4 py-3">{p.features}</td>
                  <td className="px-4 py-3">{p.network}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white border rounded-xl shadow-sm p-6 dark:bg-gray-900 dark:text-white">
        <h2 className="text-lg font-semibold mb-4">
          Why Businesses Switch to DriverX
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 dark:bg-gray-900 dark:text-white bg-gray-50 relative"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-teal-500 rounded-l-lg"></div>
              <p className="text-sm text-gray-700 pl-2 dark:bg-gray-900 dark:text-white">{b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Use Case Table */}
      <div className="bg-white border rounded-xl shadow-sm p-6 dark:bg-gray-900 dark:text-white">
        <h2 className="text-lg font-semibold mb-4">
          Choose Plans by Use Case
        </h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-white">
            <tr>
              <th className="text-left px-4 py-2">Use Case</th>
              <th className="text-left px-4 py-2">Best Plan</th>
              <th className="text-left px-4 py-2">Why It Works</th>
            </tr>
          </thead>
          <tbody>
            {useCases.map((u, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">{u.use}</td>
                <td className="px-4 py-3">
                  <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium">
                    {u.plan}
                  </span>
                </td>
                <td className="px-4 py-3">{u.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}