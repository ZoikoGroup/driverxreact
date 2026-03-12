"use client";

import React from "react";
import Image from "next/image";

const features = [
  {
    title: "Nationwide Coverage",
    description:
      "Consistent high-speed access in every zone urban streets, highways, suburbs, and delivery hot spots.",
    icon: "/images/mynaui_mobile-signal-five.png",
  },
  {
    title: "Unlimited Data with Hotspot Access",
    description:
      "Stream, navigate, accept orders, and run multiple apps — with dedicated hotspot support built in.",
    icon: "/images/ic_baseline-money-off.png",
  },
  {
    title: "Optimized for Gig Platforms",
    description:
      "Built for Uber, Lyft, DoorDash, Amazon Flex, Instacart, Grubhub, Shipt, and all major gig economy apps — zero lag, no throttling.",
    icon: "/images/22.png",
  },
  {
    title: "BYOD or DriverX-Optimized Devices",
    description:
      "Bring your own smartphone or upgrade to one of our affordable, high-performance devices built for the road.",
    icon: "/images/61.png",
  },
  {
    title: "Flexible Billing Options",
    description:
      "Choose from weekly, bi-weekly, or monthly billing — pay your way, when it suits you.",
    icon: "/images/61.png",
  },
  {
    title: "No Contracts | No Credit Checks | No Hassle",
    description:
      "Full freedom to pause, cancel, or restart anytime — no penalties, no lock-in.",
    icon: "/images/Vector (3).png",
  },
];

function Gig(){
  return (
    <section className="w-full dark:bg-gray-900 bg-gray-100 py-16">

      {/* FULL WIDTH TITLE */}
      <div className="w-full bg-[#2f6f66] dark:text-white text-white text-center py-5 text-xl font-semibold tracking-wide">
     DriverX Gig & Delivery Driver Plans
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* Hero Section */}
        <div className="mt-12">

          <h2 className="text-3xl font-semibold dark:text-white text-black mb-6">
            Built for Drivers | Powered by You
          </h2>

          <div className="max-w-4xl dark:text-white
          
          text-gray-600 space-y-4">
            <p>
              At DriverX Mobile, we know your mobile phone isn’t just a tool — it’s your office, your dispatch system, your income lifeline
            </p>

            <p>
              That’s why we designed driver-first mobile plans that deliver reliable 5G/4G LTE coverage, unlimited data options, and the flexibility you need — whether you’re navigating back-to-back food orders, ride pickups, or last-mile drop-offs. You work hard. You drive far. You deserve a wireless plan that works just as hard.
            </p>
          </div>

          {/* Main Image */}
          <div className="mt-10">
            <Image
              src="/images/Frame 1707483053 (1).png"
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
           Your Hustle Deserves Better Wireless
          </h3>

          <p className="mt-4  dark:text-white text-sm max-w-3xl mx-auto opacity-90 dark:bg-gray-900">
           You’re not a customer. You’re a business. DriverX Mobile was built for independent drivers like you — because you deserve plans that move as fast as you do.
          </p>

         
          <div className="flex flex-wrap justify-center gap-4 mt-8 ">

            <button className="bg-white text-[#2f6f66] px-6 py-2 rounded-md font-medium hover:opacity-90 transition">
          Compare Plans
            </button>

            <button className="border border-white px-6 py-2 rounded-md font-medium hover:bg-white hover:text-[#2f6f66] transition">
            Activate Your pSIM or eSIM
            </button>

            <button className="border border-white px-6 py-2 rounded-md font-medium hover:bg-white hover:text-[#2f6f66] transition">
             Join the DriverX Communityx
            </button>

          </div>
        </div>

      </div>
    </section>
  );

}
export default Gig;