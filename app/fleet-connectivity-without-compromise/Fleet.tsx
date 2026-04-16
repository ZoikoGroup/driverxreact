"use client";

import React from "react";
import RequestForm from "../components/request-form/form";

const features = [
  {
    feature: "Unified Billing Dashboard",
    advantage: "Track usage, lines, and costs in one secure portal",
  },
  {
    feature: "Tiered & Pooled Plans",
    advantage: "Match plan types to usage behavior by vehicle or region",
  },
  {
    feature: "Fast eSIM & pSIM Deployment",
    advantage: "Activate on-the-spot or ship pre-provisioned SIM kits",
  },
  {
    feature: "Network Resilience",
    advantage: "Smart routing across AT&T and T-Mobile ensures uptime",
  },
  {
    feature: "Driver-Centric Optimization",
    advantage: "Built-in support for Waze, Uber, GPS, ELDs, and more",
  },
];

const bestFor = [
  "Logistics, courier & express delivery",
  "FMCG, purchasing, utility and service fleets",
  "Small, shared and transportation companies",
  "Government or public sector vehicles",
  "Mobile workforce & technician fleets",
];

const plans = [
  {
    type: "Small Fleet (0–50 vehicles)",
    tier: "5GB/device",
    config: "Includes mobile hotspot, GPS routing boost",
  },
  {
    type: "Midsize Ops (50–200 vehicles)",
    tier: "15–20GB pooled",
    config: "Dynamic allocation, monthly reporting",
  },
  {
    type: "Enterprise Fleets (200+)",
    tier: "Unlimited or tiered",
    config: "SLA-backed bandwidth, priority support",
  },
  {
    type: "EV/Telematics-Heavy",
    tier: "Custom IoT bundle",
    config: "Dual SIMs for telemetry + in-vehicle comms",
  },
];

export default function Fleet() {
  return (
    <div className="px-full bg-gray-100 dark:bg-gray-900 dark:text-white">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-teal-700 text-white text-center py-8 rounded-t-md font-semibold">
          Fleet Connectivity Without Compromise
        </div>


<br />
        {/* Hero */}
        <div className="bg-gradient-to-r from-green-200 to-yellow-300 text-center px-6 py-8 rounded-b-md shadow">
          <h2 className="text-lg font-bold mb-2   dark:text-teal-700">
            Optimize Every Route, Vehicle, and Minute
          </h2>
          <p className="text-sm text-teal-700 max-w-2xl mx-auto">
            DriverX Fleet Plans are engineered for real-world logistics — delivering the connectivity your vehicles, drivers, and systems rely on to operate at peak performance. From GPS reliability to diagnostic telemetry and dispatch integration, our plans are built for operational control and business scalability.
          </p>
        </div>

        {/* Features Table */}
        <div className="bg-white mt-6 p-5 rounded-lg shadow dark:bg-gray-900 dark:text-white">
          <h3 className="font-semibold mb-3 ">
            Why Leading Fleets Choose DriverX
          </h3>

          <div className="grid grid-cols-2 text-sm font-medium dark:bg-gray-900 dark:text-white text-gray-600 border-b pb-2">
            <span>Feature</span>
            <span>Business Advantage</span>
          </div>

          {features.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-2 text-sm py-2 border-b last:border-none"
            >
              <span className="font-medium dark:bg-gray-900 dark:text-white   text-gray-800">
                {item.feature}
              </span>
              <span className="text-gray-600 dark:bg-gray-900 dark:text-white">{item.advantage}</span>
            </div>
          ))}
        </div>

        {/* Best For */}
    {/* Best For */}
<div className="bg-white mt-6 p-5 rounded-lg shadow dark:bg-gray-900 dark:text-white">
  <h3 className="font-semibold mb-4">Best for:</h3>

  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 dark:bg-gray-900 dark:text-white">
    {bestFor.map((item, i) => (
      <div
        key={i}
        className="bg-[#E8E3D8] dark:bg-gray-700 dark:text-white  border-l-4 border-yellow-400 rounded-md px-4 py-3 text-sm *:  text-gray-800"
      >
        {item}
      </div>
    ))}
  </div>
</div>
        {/* Plans Table */}
        <div className="bg-white mt-6 p-5 rounded-lg shadow dark:bg-gray-900 dark:text-white">
          <h3 className="font-semibold mb-3">Sample Plan Profiles</h3>

          <div className="grid grid-cols-3 text-sm font-medium dark:bg-gray-900 dark:text-white text-gray-600 border-b pb-2">
            <span>Fleet Type</span>
            <span>Plan Tier</span>
            <span>Configuration</span>
          </div>

          {plans.map((plan, i) => (
            <div
              key={i}
              className="grid grid-cols-3 text-sm py-2 border-b last:border-none"
            >
              <span className="text-gray-800 dark:bg-gray-900 dark:text-white">{plan.type}</span>

              <span>
                <span className="bg-teal-100 dark:bg-teal-200 text-teal-700 px-2 py-1 rounded text-xs font-semibold">
                  {plan.tier}
                </span>
              </span>

              <span className="text-gray-600 dark:bg-gray-900 dark:text-white">{plan.config}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm dark:bg-gray-900 dark:text-white text-gray-600">
          <h4 className="font-semibold dark:bg-gray-900 dark:text-white text-gray-800 mb-1">
            Explore Without Risk
          </h4>
          <p>
     
Let our enterprise team evaluate your current telecom setup and design a better solution. 

          </p>
          <p className="text-xs mt-1">
          Most fleets reduce telecom waste by up to 28% with DriverX
          </p>
        </div>
      </div>
      <br />
      <br />
      <RequestForm requestType="Fleet Connectivity" />
    </div>
  );
}