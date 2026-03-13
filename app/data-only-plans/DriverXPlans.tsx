"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getPlans() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/plans/`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("API returned error:", res.status);
      return [];
    }

    return await res.json();

  } catch (error) {
    console.error("Error fetching plans:", error);
    return [];
  }
}
export default function DriverXPlans() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const loadPlans = async () => {
      const data = await getPlans();
      setPlans(data);
    };

    loadPlans();
  }, []);

  return (
    <section className="w-full bg-gray-100 dark:bg-gray-900">

      {/* HEADER */}
      <div className="bg-[#2f6f66] text-white text-center py-4 text-lg font-semibold">
        DriverX Premium Data Plans Built For Drivers
      </div>

      {/* HERO */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-6 py-10 px-4">

        <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-xl max-w-md">
          <h2 className="font-semibold text-lg dark:text-white">
            Not Just a Data Plan
          </h2>

          <h3 className="font-bold text-xl mb-2 dark:text-white">
            Your Driver Business Advantage
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            High-speed connectivity for fleets, gig workers, and enterprise drivers.
          </p>
        </div>

        <Image
          src="/images/elderly-passenger-in-back-seat-showing-smartphone-2025-03-13-01-27-29-utc 1.png"
          alt="Driver"
          width={769}
          height={513}
          className="rounded-xl"
        />
      </div>

      {/* DATA PLANS */}
      <div className="max-w-5xl mx-auto px-4 pb-16">

        <h2 className="text-center text-2xl font-semibold mb-10 text-[#2f6f66] dark:text-white">
          Data-Only SIM Plans
        </h2>

        <div className="space-y-6">

          {plans.map((plan: any) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center"
            >

              <div className="space-y-2">

                <h3 className="font-semibold text-lg bg-[#2f6f66] text-white px-4 py-1 rounded-full inline-block">
                  {plan.name}
                </h3>

                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>✔ {plan.data_allowance}</li>
                  <li>✔ {plan.iot_access}</li>
                  <li>✔ {plan.hotspot}</li>
                  <li>✔ {plan.availability}</li>
                </ul>

              </div>

              <div className="text-center mt-4 md:mt-0">

                <h3 className="text-2xl font-bold dark:text-white">
                  ${plan.price}
                  <span className="text-sm text-gray-500"> /mo</span>
                </h3>

                <button className="mt-3 bg-[#2f6f66] text-white px-6 py-2 rounded-full hover:bg-[#255a53]">
                  Buy Plan
                </button>

              </div>

            </div>
          ))}

        </div>
      </div>

      {/* VOICE BOOST */}
      <div className="bg-gray-200 dark:bg-gray-800 py-14">

        <div className="max-w-4xl mx-auto text-center border border-gray-300 dark:border-gray-700 p-10 rounded-lg">

          <h3 className="text-lg font-semibold mb-2 dark:text-white">
            Voice Boost Top-Ups
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-8">
            Add voice and text capabilities to any data plan (30-day validity)
          </p>

          <div className="grid md:grid-cols-2 gap-8">

            {/* CARD 1 */}
            <div className="bg-white dark:bg-gray-900 border-l-4 border-yellow-400 p-6 rounded-xl shadow">

              <h4 className="font-semibold mb-2 dark:text-white">
                Voice Boost 500
              </h4>

              <p className="text-yellow-500 text-xl font-bold">$9</p>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                500 minutes + 500 texts
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Perfect for moderate voice and SMS needs
              </p>

              <button className="mt-4 bg-[#2f6f66] text-white px-6 py-2 rounded-full">
                Buy Top-Up
              </button>

            </div>

            {/* CARD 2 */}
            <div className="bg-white dark:bg-gray-900 border-l-4 border-yellow-400 p-6 rounded-xl shadow">

              <h4 className="font-semibold mb-2 dark:text-white">
                Voice Boost Max
              </h4>

              <p className="text-yellow-500 text-xl font-bold">$20</p>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Unlimited minutes + Unlimited texts
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Ideal for heavy voice use or multi-purpose SIMs
              </p>

              <button className="mt-4 bg-[#2f6f66] text-white px-6 py-2 rounded-full">
                Buy Top-Up
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* PREMIUM FEATURES */}
      <div className="bg-[#e7dfc2] dark:bg-gray-900 py-16">

        <div className="max-w-6xl mx-auto px-4">

          <h3 className="text-center text-2xl font-semibold mb-12 text-[#2f6f66] dark:text-white">
            Premium Features Across All Plans
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

            {[
              {
                title: "5G Ultra-Wideband Network",
                desc: "Nationwide 5G Ultra-Wideband coverage with automatic LTE fallback.",
              },
              {
                title: "IoT Optimisation Mode",
                desc: "Specially optimised for telematics, GPS tracking and sensors.",
              },
              {
                title: "Data Rollover",
                desc: "Unused data carries forward on Starter, Essential, and Pro tiers.",
              },
              {
                title: "Fleet Priority Support",
                desc: "24/7 enterprise-grade support for fleet operators.",
              },
              {
                title: "No Long-Term Contracts",
                desc: "Upgrade, downgrade or cancel your plan anytime.",
              },
              {
                title: "Driver-Focused Design",
                desc: "Built specifically for professional drivers and fleet operations.",
              },
            ].map((feature, i) => (

              <div key={i} className="flex gap-4 items-start">

                <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow">
                  ✔
                </div>

                <div>
                  <h4 className="font-semibold dark:text-white">
                    {feature.title}
                  </h4>

                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.desc}
                  </p>
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}