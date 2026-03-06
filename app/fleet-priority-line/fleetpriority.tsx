"use client";
import Image from "next/image";

export default function FleetPriorityLine() {
  return (
    <section className="w-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      {/* ================= HEADER BAR ================= */}
      <div className="bg-[#1f6f63] dark:bg-teal-800 text-white text-center py-4 text-xl font-semibold transition-colors duration-300">
        DriverX Fleet Priority Line
      </div>

      {/* ================= SUPPORT SECTION ================= */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-center text-sm tracking-widest font-semibold text-gray-500 dark:text-gray-400 mb-10 transition-colors duration-300">
          ENTERPRISE-GRADE SUPPORT
        </h3>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg p-6 text-center transition-colors duration-300">
            <div className="w-12 h-12 mx-auto bg-[#1f6f63] dark:bg-teal-600 text-white rounded-full flex items-center justify-center text-xl mb-4">
              <Image
                src="/images/mynaui_mobile-signal-five.png"
                alt="Connection Icon"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              24/7/365 Dedicated Hotline
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Skip long queues. Direct access to real-time fleet support whenever you need it.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg p-6 text-center transition-colors duration-300">
            <div className="w-12 h-12 mx-auto bg-[#1f6f63] dark:bg-teal-600 text-white rounded-full flex items-center justify-center text-xl mb-4">
              <Image
                src="/images/ic_baseline-money-off.png"
                alt="Connection Icon"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Instant Issue Resolution
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              All requests are routed to our Tier 1 Fleet Support Desk for immediate handling.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg p-6 text-center transition-colors duration-300">
            <div className="w-12 h-12 mx-auto bg-[#1f6f63] dark:bg-teal-600 text-white rounded-full flex items-center justify-center text-xl mb-4">
              <Image
                src="/images/22.png"
                alt="Connection Icon"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Assigned Fleet Success Manager
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              One point of contact to manage all your fleet needs.
            </p>
          </div>
        </div>

        {/* Bottom 2 Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg p-6 text-center transition-colors duration-300">
            <div className="w-12 h-12 mx-auto bg-[#1f6f63] dark:bg-teal-600 text-white rounded-full flex items-center justify-center text-xl mb-4">
              <Image
                src="/images/61.png"
                alt="Connection Icon"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              IoT & Telematics Integration
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Connect your SIMs, GPS trackers, ELDs, dash cams, and more seamlessly.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg p-6 text-center transition-colors duration-300">
            <div className="w-12 h-12 mx-auto bg-[#1f6f63] dark:bg-teal-600 text-white rounded-full flex items-center justify-center text-xl mb-4">
              <Image
                src="/images/Vector (3).png"
                alt="Connection Icon"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Bulk SIM Activation & Priority Shipping
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Get pre-configured SIMs delivered fast to your fleet.
            </p>
          </div>
        </div>
      </div>

      {/* ================= MONITORING SECTION ================= */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-[#f4e5a4] dark:bg-yellow-900/30 rounded-2xl overflow-hidden grid md:grid-cols-2 items-center shadow-md dark:shadow-lg transition-colors duration-300">
          
          <div className="relative h-72 md:h-full">
            <img
              src="/images/female-driver-using-smartphone-in-the-car-2025-03-15-23-52-12-utc 1.png"
              alt="Fleet monitoring"
              className="object-cover"
            />
          </div>

          <div className="p-8">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
              REAL-TIME MONITORING & ALERTS
            </h3>
            <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">
              Stay informed with proactive notifications and uptime reports including:
            </p>
            <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
              <li>✔ Service Disruptions or Outages</li>
              <li>✔ Compliance-Related Changes</li>
              <li>✔ Usage Anomalies Across Your Fleet</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= WHO QUALIFIES ================= */}
      <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden">
        <Image
          src="/images/Group 1597883092.png"
          alt="Fleet trucks"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#1f6f63]/95 via-[#1f6f63]/85 to-transparent dark:from-black/90 dark:via-black/70 transition-colors duration-300"></div>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="max-w-xl text-white">
              <h3 className="text-3xl md:text-4xl font-semibold mb-8">
                Who Qualifies?
              </h3>

              <ul className="space-y-4 text-base md:text-lg leading-relaxed">
                <li>• The Fleet Priority Line is available to:</li>
                <li>• Fleets with 50+ Active Lines</li>
                <li>• Rideshare, Delivery, or Logistics Businesses</li>
                <li>• Commercial Vehicle Rental and Leasing Firms</li>
                <li>• Partners integrating DriverX Mobile into Telematics Platforms</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}