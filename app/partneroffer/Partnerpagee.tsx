"use client";
import React from "react";

function PartnerWithDriverX() {

  const whoWePartnerWith = [
    {
      title: "Fleet & Telematics",
      desc: "Software providers for vehicle tracking, dashcams, OBD-II, routing, safety",
      highlight: true,
    },
    {
      title: "Mobility & Gig Platforms",
      desc: "Rideshare, delivery, freelance, scooter/bike networks",
    },
    {
      title: "Vehicle Access & Rentals",
      desc: "Short-term rentals, EV operators, commercial vehicle providers",
    },
    {
      title: "Hardware & OEMs",
      desc: "IoT routers, SIM-embedded dashcams, asset trackers, mobility hardware",
    },
    {
      title: "Payments & Insurance",
      desc: "Gig-focused coverage, fuel cards, driver wallets, on-demand services",
    },
    {
      title: "Connectivity & Telecom Resellers",
      desc: "MVNOs, VARs, SIM provisioning platforms, enterprise IT vendors",
    },
  ];

  const partnershipTracks = [
    {
      number: 1,
      title: "Technology Integrator",
      desc: "Power your platform with embedded DriverX SIMs, eSIM APIs, or IoT bundles.",
    },
    {
      number: 2,
      title: "Reseller / VAR",
      desc: "Distribute white-label or co-branded connectivity to your customer base.",
    },
    {
      number: 3,
      title: "Hardware Partner",
      desc: "Bundle DriverX connectivity with telematics, routers, or mobility devices.",
    },
    {
      number: 4,
      title: "Affiliate / Referral",
      desc: "Promote DriverX and earn recurring revenue from plan activations.",
    },
    {
      number: 5,
      title: "Loyalty / Ecosystem Perks",
      desc: "Offer exclusive promotions to our user base — or vice versa.",
    },
  ];

  const capabilities = [
    {
      title: "Tier-1 Coverage",
      desc: "Nationwide & global coverage with premium network access",
      icon: "/images/vector14.png",
      alt: "Coverage Icon",
    },
    {
      title: "eSIM & pSIM",
      desc: "QR-ready, bulk deployable provisioning options",
      icon: "/images/Vector (9).png",
      alt: "eSIM Icon",
    },
    {
      title: "Developer APIs",
      desc: "For activation, usage tracking, and analytics",
      icon: "/images/Vector (10).png",
      alt: "API Icon",
    },
    {
      title: "Partner Success",
      desc: "Dedicated manager for your account",
      icon: "/images/Vector (11).png",
      alt: "Partner Icon",
    },
    {
      title: "Go-To-Market",
      desc: "Joint campaigns to accelerate growth",
      icon: "/images/Vector (12).png",
      alt: "Growth Icon",
    },
    {
      title: "Flexible Revenue",
      desc: "Revenue-share or wholesale models",
      icon: "/images/Vector (13).png",
      alt: "Revenue Icon",
    },
  ];

  const whyDriverX = [
    {
      title: "Gig-Economy Focused",
      desc: "Plans engineered for high-frequency, high-mobility usage.",
    },
    {
      title: "Instant Deployments",
      desc: "Activate in minutes via eSIM APIs or digital QR flows.",
    },
    {
      title: "Built For Scale",
      desc: "Handle 1 device or 100,000+ — fully scalable infrastructure.",
    },
    {
      title: "Secure, Trusted, Resilient",
      desc: "Backed by U.S. MVNA agreements and telecom-grade BSS.",
    },
    {
      title: "Ecosystem-Ready",
      desc: "Easily integrate with your platform, app, or device flow.",
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-200 transition-colors duration-300">

      {/* HERO */}
      <section className="bg-teal-700 text-white text-center py-16 px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Power The Platforms That Move The World
        </h1>
        <p className="max-w-3xl mx-auto text-sm md:text-base opacity-90">
          Where telecom meets logistics, mobility, and gig-tech.
        </p>
      </section>

      {/* INTRO */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Partner with DriverX
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
          We're not just a wireless provider, we're a connectivity engine for fleets,
          delivery networks, mobility apps, and IoT platforms.
        </p>

        <div className="flex justify-center gap-4">
          <button className="bg-teal-600 text-white px-6 py-2 rounded-full">
            Apply to Partner
          </button>
          <button className="border border-gray-400 dark:border-gray-600 px-6 py-2 rounded-full">
            Book Discovery Call
          </button>
        </div>
      </section>

      {/* WHO WE PARTNER WITH */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h3 className="text-center text-xl font-semibold mb-10">
          Who We Partner With
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {whoWePartnerWith.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border p-6 bg-yellow-50 dark:bg-gray-900 border-yellow-400 dark:border-gray-700"
            >
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNERSHIP TRACKS */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h3 className="text-center text-xl font-semibold mb-10">
          Partnership Tracks
        </h3>

        <div className="space-y-4">
          {partnershipTracks.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-6"
            >
              <div className="h-10 w-10 flex items-center justify-center bg-teal-600 text-white rounded-full font-bold">
                {item.number}
              </div>
              <div>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h3 className="text-center text-xl font-semibold mb-10">
          Everything You Need to Succeed
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {capabilities.map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-6 text-center"
            >
              <div className="flex justify-center mb-4">
                <img
                  src={item.icon}
                  alt={item.alt}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY DRIVER X */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h3 className="text-center text-2xl font-bold mb-10">
          Why DriverX?
        </h3>

        <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg divide-y dark:divide-gray-700">
          {whyDriverX.map((item, i) => (
            <div key={i} className="flex justify-between p-6">
              <h4 className="font-bold">{item.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-700 text-white text-center py-16 px-6 rounded-t-3xl">
        <h3 className="text-2xl font-semibold mb-4">
          Ready to Join the Network?
        </h3>
        <p className="mb-6 max-w-2xl mx-auto opacity-90">
          Be part of a fast-growing ecosystem of connected mobility leaders.
        </p>

        <div className="flex justify-center gap-4">
          <button className="bg-white text-teal-700 px-6 py-2 rounded-full font-medium">
            Apply to Become a Partner
          </button>
          <button className="border border-white px-6 py-2 rounded-full">
            Book a Discovery Call
          </button>
        </div>
      </section>
    </div>
  );
}

export default PartnerWithDriverX;