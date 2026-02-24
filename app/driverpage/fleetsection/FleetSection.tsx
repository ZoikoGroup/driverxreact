"use client";
import Image from "next/image";
import React from "react";
import Form from "../../loginform/form";

function FleetSection() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="bg-[#2f766c] py-20 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-12">

          {/* LEFT CONTENT */}
          <div className="text-white">
            <h2 className="text-4xl font-bold leading-tight">
              Keep Your Fleet on the <br />
              Move with Intelligent <br />
              Mobile
            </h2>

            <p className="mt-6 text-gray-200 max-w-lg dark:text-gray-400">
              Fast, reliable wireless connectivity combined with AI-powered
              fleet tools built to drive logistics success at scale.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="px-6 py-3 rounded-lg bg-white text-[#2f766c] font-semibold hover:bg-gray-100 transition dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                View Plans
              </button>

              <button className="px-6 py-3 rounded-lg border border-white text-white hover:bg-white hover:text-[#2f766c] transition dark:border-gray-500 dark:hover:bg-gray-800 dark:hover:text-white">
                Check Area Coverage
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div>
            <Image src="/images/man-by-fleet.png" alt="DHL" width={600} height={350} />
          </div>

        </div>
      </section>

      {/* ================= TRUSTED BY ================= */}
      <section className="bg-gray-100 py-12 border-b dark:bg-gray-950 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h3 className="font-semibold text-gray-800 dark:text-white">
            Trusted By
          </h3>

          <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">
            Trusted by leading logistics teams and mobility partners
          </p>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-10">
            <Image src="/images/Group.png" alt="DHL" width={100} height={40} />
            <Image src="/images/Swift_Transportation_logo 1.png" alt="Swift" width={100} height={40} />
            <Image src="/images/fedex-express-6.png" alt="FedEx" width={100} height={40} />
            <Image src="/images/image 231.png" alt="Award" width={80} height={60} />

            <div className="relative w-[120px] h-[40px]">
              <Image
                src="/images/Group (1).png"
                alt="XPO"
                width={120}
                height={40}
                className="absolute inset-0 dark:hidden"
              />

              <Image
                src="/images/dd.png"
                alt="XPO"
                width={120}
                height={40}
                className="absolute inset-0 hidden dark:block"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ================= KEY DIFFERENTIATORS ================= */}
      <section className="bg-gray-100 py-20 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Key Differentiators
          </h3>

          <p className="text-gray-500 mt-2 dark:text-gray-400">
            Discover the unique advantages of our services
          </p>

          <div className="mt-12 grid md:grid-cols-4 gap-8">

            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <div className="h-14 w-14 bg-[#2f766c] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl">
                <img src="/images/mynaui_mobile-signal-five.png" alt="Lyft" className="h-10 w-auto" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white">
                Multi-Line Discounts
              </h4>
              <p className="text-sm text-gray-600 mt-3 dark:text-gray-400">
                Scale your savings with bulk line plans tailored for fleet sizes
                of 10 to 1,000+.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <div className="h-14 w-14 bg-[#2f766c] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl">
                <img src="/images/ic_baseline-money-off.png" alt="Lyft" className="h-10 w-auto" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white">
                Fleet Dashboards
              </h4>
              <p className="text-sm text-gray-600 mt-3 dark:text-gray-400">
                Track data usage, line activations, and real-time route
                performance in one unified dashboard.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <div className="h-14 w-14 bg-[#2f766c] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl">
                <img src="/images/22.png" alt="Lyft" className="h-10 w-auto" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white">
                Automated Compliance
              </h4>
              <p className="text-sm text-gray-600 mt-3 dark:text-gray-400">
                Ensure your fleet stays audit-ready with automated reporting
                for data usage and documentation.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <div className="h-14 w-14 bg-[#2f766c] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl">
                <img src="/images/61.png" alt="Lyft" className="h-10 w-auto" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white">
                24/7 Enterprise Support
              </h4>
              <p className="text-sm text-gray-600 mt-3 dark:text-gray-400">
                Dedicated fleet support specialists available via phone,
                chat, or email.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Form />
      <br />
    </>
  );
}

export default FleetSection;