"use client";

import React from "react";
import RequestForm from "../components/request-form/form";


const simTypes = [
  {
    type: "Physical SIM (pSIM)",
    ideal: "Any unlocked smartphone, tablet, M2M device",
    method: "Insert → Dial *611 or scan QR → Live in 60 seconds",
  },
  {
    type: "Embedded SIM (eSIM)",
    ideal: "eSIM-ready phones, tablets, wearables, IoT hardware",
    method: "Scan QR or use DriverX App → Instant provisioning",
  },
];

const activationMethods = [
  {
    name: "Self-Activation",
    features: "Quick activation via dial or scan",
    best: "Individual users",
  },
  {
    name: "Batch Activation",
    features: "Bulk-enable up to 10,000 SIMs in 1 click",
    best: "Fleets, BPOs, franchises",
  },
  {
    name: "API-Based Provisioning",
    features: "Automate SIM lifecycle in your own platform",
    best: "Platforms, SaaS, IoT providers",
  },
  {
    name: "Remote SIM Swap",
    features: "Switch from pSIM ⇄ eSIM instantly",
    best: "Distributed workforces or evolving hardware",
  },
];

const trustItems = [
  "Identity verification (eKYC) support",
  "SIM-level encryption and IP restrictions (optional)",
  "Aligned with FCC, GSMA, and international standards",
];

export default function ActivationSection() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10 dark:bg-gray-900 dark:text-white">
      
       <div className="bg-teal-700 text-white text-center py-4 text-xl font-semibold">
     Activate Your eSIM & pSIM
      </div>
      {/* Header */}
      <div className="text-center">
        <p className="text-teal-600 dark:text-teal-400 font-semibold">
          Instant Activation | Enterprise Precision
        </p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          From solo drivers to 10,000-device deployments, DriverX ensures your
          SIMs activate fast — and stay connected with Tier-1 performance.*
        </p>
      </div>

      {/* SIM Type Table */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          Activate Your Way : pSIM or eSIM
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="text-left px-4 py-2">SIM Type</th>
                <th className="text-left px-4 py-2">Ideal Use</th>
                <th className="text-left px-4 py-2">Activation Method</th>
              </tr>
            </thead>
            <tbody>
              {simTypes.map((item, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="px-4 py-3 text-teal-600 dark:text-teal-400 font-medium">
                    {item.type}
                  </td>
                  <td className="px-4 py-3">{item.ideal}</td>
                  <td className="px-4 py-3">{item.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Getting SIM */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Getting Your SIM</h2>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* eSIM */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border dark:border-yellow-800 rounded-lg p-5 relative">
            <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500 rounded-l-lg"></div>
            <h3 className="text-yellow-600 dark:text-yellow-400 font-semibold mb-2 pl-2">
              eSIM
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 pl-2">
              Delivered digitally via QR code, secure admin portal, or API
            </p>
          </div>

          {/* pSIM */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border dark:border-yellow-800 rounded-lg p-5 relative">
            <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500 rounded-l-lg"></div>
            <h3 className="text-yellow-600 dark:text-yellow-400 font-semibold mb-2 pl-2">
              pSIM
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 pl-2">
              Shipped activated or batch-ready to your team, warehouse, or
              drivers
            </p>
          </div>

        </div>
      </div>

      {/* Activation Methods */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          Activate Your Way : pSIM or eSIM
        </h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="text-left px-4 py-2">Method</th>
              <th className="text-left px-4 py-2">Features</th>
              <th className="text-left px-4 py-2">Best For</th>
            </tr>
          </thead>
          <tbody>
            {activationMethods.map((m, i) => (
              <tr
                key={i}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="px-4 py-3 text-teal-600 dark:text-teal-400 font-medium">
                  {m.name}
                </td>
                <td className="px-4 py-3">{m.features}</td>
                <td className="px-4 py-3">{m.best}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trust Section */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          Built with Trust, Security & Compliance
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/40 relative"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-teal-500 rounded-l-lg"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300 pl-2">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

     <h1 className="text-2xl text-center text-gray-900 dark:text-white max-w-xl mx-auto">
  Still having some Questions?
</h1>
  <RequestForm requestType="support" />
    </div>
  );
}