"use client";

import React from "react";
import RequestForm from "../components/request-form/form";


const features = [
  "Activate instantly with eSIM or shipped SIM",
  "Nationwide Tier-1 coverage (AT&T + T- Mobile)",
  "Keep your device-no contract, no store visit",
  "Switch anytime-no lock-in, no hidden fees",
  "Built for gig apps-optimized for real- time GPS, navigation, uploads, and more",
];

const drivers = [
  {
    type: "Delivery Drivers",
    reason: "Faster GPS and app refresh while on the go",
  },
  {
    type: "Rideshare Operators",
    reason: "More reliable calls and routing across metro and suburban zones",
  },
  {
    type: "Fleet Owners",
    reason: "Manage multiple drivers from one secure dashboard",
  },
  {
    type: "Mobile Entrepreneurs",
    reason: "Run devices, SIMs, and hotspots all from your pocket",
  },
  {
    type: "Side Hustlers",
    reason: "Stay connected during peak hours without signal loss",
  },
];

const benefits = [
  "Instant eSIM or fast pSIM activation",
  "BYOD-friendly: works with unlocked phones and tablets",
  "Plans with unlimited data, hotspots, and team add-ons",
  "Smart network switching (failover between AT&T/T-Mobile)",
  "24/7 support built for drivers, not robots",
  "Flexible top-up, pause, and upgrade options",
];

const steps = [
  {
    title: "Pick your plan",
    desc: "Choose the data and features that match your driving style",
  },
  {
    title: "Activate instantly",
    desc: "Use your QR code or insert your SIM — live in minutes",
  },
  {
    title: "Drive connected",
    desc: "Earn without disruption with reliable nationwide coverage",
  },
];

const requirements = [
  "An unlocked phone or data-enabled tablet",
  "Debit/credit card",
  "(Optional) Your gig platform for exclusive perks",
];

export default function Join() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10 dark:bg-gray-900 dark:text-white">
        
        
 <div className="bg-teal-700 text-white text-center py-4 text-xl font-semibold">
     Power Every Mile with DriverX
      </div>
      
      {/* HERO */}
      <div className="bg-teal-700 text-white rounded-xl p-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold">
          Drive Smart. Stay Connected. Get Paid Without Dropouts.
        </h1>
        <p className="mt-3 text-sm md:text-base text-teal-100">
      DriverX gives you the mobile performance you need to keep moving, earning, and winning — whether you’re working with Uber, DoorDash, Amazon Flex, Lyft, Roadie, or managing your own schedule.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-teal-600/40 border border-teal-500 rounded-lg p-4 text-sm"
            >
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* WHO'S IT FOR */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Who's It For?</h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="text-left px-4 py-2">Driver Type</th>
              <th className="text-left px-4 py-2">
                Why They Choose DriverX
              </th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d, i) => (
              <tr
                key={i}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="px-4 py-3 text-teal-600 dark:text-teal-400 font-medium">
                  {d.type}
                </td>
                <td className="px-4 py-3">{d.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


 <div className="flex justify-center mt-8 mb-6">
  <a href="/#plans">
    <button className="rounded-full bg-teal-800 px-8 py-3 font-semibold text-white shadow-lg hover:bg-teal-600 transition">
      Explore Plans
    </button>
  </a>
</div>
      {/* WHAT YOU GET */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          What You Get with DriverX
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="bg-yellow-50 dark:bg-yellow-900/20 border dark:border-yellow-800 rounded-lg p-4 relative"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500 rounded-l-lg"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300 pl-2">
                {b}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* STEPS */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-6">
          How to Join in 3 Steps
        </h2>

      <div className="grid md:grid-cols-3 gap-6">
  {steps.map((s, i) => (
    <div
      key={i}
      className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center bg-gray-50 dark:bg-gray-800"
    >
      <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold">
        {i + 1}
      </div>

      <h3 className="font-semibold mb-2 text-teal-600 dark:text-teal-400">
        {s.title}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        {s.desc}
      </p>
    </div>
  ))}
</div>
      </div>
      
     


      {/* REQUIREMENTS */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">What You'll Need</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {requirements.map((r, i) => (
            <div
              key={i}
              className="bg-yellow-50 dark:bg-yellow-900/20 border dark:border-yellow-800 rounded-lg p-4 relative"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500 rounded-l-lg"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300 pl-2">
                {r}
              </p>
            </div>
          ))}
        </div>
      </div>

  <RequestForm requestType="support" />
    </div>
  );
}