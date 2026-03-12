"use client";

import React from "react";
import Image from "next/image";

const features = [
  {
    title: "Nationwide Coverage, Urban to Remote",
    description:
      "Uninterrupted 5G & LTE access across city routes, highways, and rural delivery zones.",
    icon: "/images/mynaui_mobile-signal-five.png",
  },
  {
    title: "Real-Time Location & Telematics Sync",
    description:
      "Compatible with leading fleet platforms and in-vehicle telematics systems.",
    icon: "/images/ic_baseline-money-off.png",
  },
  {
    title: "Multi-Device Flexibility",
    description:
      "Deploy SIMs and eSIMs across phones, tablets, OBD-II trackers, vehicle modems, and ruggedized devices.",
    icon: "/images/22.png",
  },
  {
    title: "Smart Billing & Data Control",
    description:
      "Pooled data plans, usage thresholds, and centralized billing for simplified fleet management.",
    icon: "/images/61.png",
  },
  {
    title: "Carrier-Grade Uptime and Network Security",
    description:
      "Backed by Tier-1 infrastructure with SLA-level reliability and secure device provisioning.",
    icon: "/images/61.png",
  },
  {
    title: "Zero-Friction Integration",
    description:
      "DriverX meshes seamlessly into your existing tools with developer-ready APIs.",
    icon: "/images/Vector (3).png",
  },
];

const FleetConnectivitySection = () => {
  return (
    <section className="w-full dark:bg-gray-900 bg-gray-100 py-16">

      {/* FULL WIDTH TITLE */}
      <div className="w-full bg-[#2f6f66] dark:text-white text-white text-center py-5 text-xl font-semibold tracking-wide">
        DriverX Fleet & Logistics Connectivity
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* Hero Section */}
        <div className="mt-12">

          <h2 className="text-3xl font-semibold dark:text-white text-black mb-6">
            Smart Mobility Infrastructure for Moving America
          </h2>

          <div className="max-w-4xl dark:text-white
          
          text-gray-600 space-y-4">
            <p>
              DriverX Mobile powers the connectivity backbone for logistics
              operators, freight haulers, courier fleets, and last-mile carriers
              nationwide — delivering the reliable, high-performance mobile
              network your drivers need to stay in control, compliant, and
              connected.
            </p>

            <p>
              Whether you’re managing a regional fleet or a national
              distribution network, our Tier-1 grade mobile data plans for fleets
              provide seamless coverage, integrated telemetry, and
              enterprise-class scalability — all tailored to the evolving
              demands of logistics and transportation.
            </p>
          </div>

          {/* Main Image */}
          <div className="mt-10">
            <Image
              src="/images/Frame 1707483053.png"
              alt="Fleet drivers"
              width={1200}
              height={600}
              className="w-full rounded-lg object-cover"
            />
          </div>

        </div>

        {/* Advantage Section */}
        <div className="mt-16">

          <h3 className="text-center text-sm font-semibold tracking-widest dark:text-white text-gray-500">
            THE DRIVERPLUS ADVANTAGE
          </h3>

          <div className="grid md:grid-cols-3 gap-8 mt-10">

            {features.map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center dark:bg-gray-900"
              >

                {/* Icon */}
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 bg-[#2f6f66] rounded-full flex items-center justify-center">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={26}
                      height={26}
                    />
                  </div>
                </div>

                {/* Title */}
                <h4 className="font-semibold dark:text-white dark:bg-gray-900 text-gray-900 text-base">
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-gray-500  dark:bg-gray-900 dark:text-white text-sm mt-3 leading-relaxed">
                  {item.description}
                </p>

              </div>
            ))}

          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-[#2f6f66] rounded-xl p-12 text-center  dark:bg-gray-900 dark:text-white text-white">

          <h3 className="text-2xl font-semibold dark:text-white">
            Put Your Fleet in Motion The Smart Way
          </h3>

          <p className="mt-4  dark:text-white text-sm max-w-3xl mx-auto opacity-90 dark:bg-gray-900">
            DriverX Mobile delivers the network performance, flexibility,
            and control modern fleets require to reduce downtime, enhance
            visibility, and move with precision.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">

            <button className="bg-white text-[#2f6f66] px-6 py-2 rounded-md font-medium hover:opacity-90 transition">
              Explore Fleet Plans
            </button>

            <button className="border border-white px-6 py-2 rounded-md font-medium hover:bg-white hover:text-[#2f6f66] transition">
              Request a Demo
            </button>

            <button className="border border-white px-6 py-2 rounded-md font-medium hover:bg-white hover:text-[#2f6f66] transition">
              Contact Enterprise Sales
            </button>

          </div>
        </div>

      </div>
    </section>
  );
};

export default FleetConnectivitySection;