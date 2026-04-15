"use client";
import Image from "next/image";

export default function VisionSection() {
  const ecosystems = [
    ["Asset Tracking", "Fleet visibility, cargo containers, delivery vans"],
    ["In-Vehicle Telematics", "OBD-II units, dashcams, engine diagnostics"],
    ["Retail & POS", "Mobile checkout, kiosks, vending machines"],
    ["Smart Logistics", "Inventory sensors, environmental monitoring, route optimization"],
    ["Field Workforces", "Tablets, connected laptops, rugged mobile devices"],
  ];

  const features = [
    {
      title: "Shared Data Pools",
      desc: "Reduce costs by balancing usage across devices",
    },
    {
      title: "Network Resilience",
      desc: "Avoid downtime with Tier-1 failover",
    },
    {
      title: "Full eSIM/pSIM Flexibility",
      desc: "Preload into hardware or activate instantly at scale",
    },
    {
      title: "Developer APIs",
      desc: "Automate provisioning, recycling, and diagnostic",
    },
    {
      title: "Predictable, Scalable Billing",
      desc: "Clear usage-based pricing with device-level visibility",
    },
    {
      title: "OEM-Ready Options",
      desc: "White-label capabilities for hardware bundling or resale",
    },
  ];

const plans = [
  {
    category: "Fleet OEM",
    name: "1GB/Device/Month",
    desc: "Auto-activate per unit, multi-region coverage",
    color: "border-t-4 border-pink-500",
  },
  {
    category: "MedTech",
    name: "5GB Shared Pool/100 Devices",
    desc: "European fallback with HIPAA-compliant VPN",
    color: "border-t-4 border-green-500",
  },
  {
    category: "Retail Kiosks",
    name: "Low-Speed Unlimited",
    desc: "Heartbeat pings only (always-on connectivity)",
    color: "border-t-4 border-yellow-400",
  },
  {
    category: "Courier Network",
    name: "1–10GB Tiered/Device",
    desc: "GPS + real-time video uploads",
    color: "border-t-4 border-purple-500",
  },
];

  const smarterPoints = [
    "Bulk-activate thousands of SIMs in minutes",
    "Embed activation flows into your platform with REST API endpoints",
    "Monitor usage by device, project, or geography in a single dashboard",
    "Enforce security policies and metadata tagging at scale",
  ];

  return (
    <>
      <section className="w-full bg-[#f5f5f5] dark:bg-gray-900 transition-colors duration-300">

        {/* HERO */}
        <div className="bg-[#1f5f55] dark:bg-teal-900 py-16 text-center text-white font-semibold text-4xl">
          Scale Your IoT Vision Without Limits
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">

          {/* LEFT */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Build, Test, and Scale Without Lock-In
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">
              Whether you're launching a new hardware product, managing thousands of connected devices, or embedding SIMs into enterprise-grade solutions, DriverX provides the flexibility and reliability to help you grow-without being tied down to inflexible contracts or single-network restrictions
            </p>
            <div className="flex gap-3">
              <button className="bg-teal-600 text-white px-5 py-2 rounded-full text-sm font-medium">
                <a href="/request-a-demo">Book an IoT Strategy Session</a>
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="rounded-xl overflow-hidden shadow-md">
            <Image
              src="/images/20209 1.png"
              alt="IoT Network"
              width={800}
              height={600}
              className="w-full h-[250px] object-cover"
            />
          </div>
        </div>

        {/* WHO WE POWER */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Who We Power
          </h3>

          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-2 bg-[#1f5f55] dark:bg-teal-900 text-white font-semibold py-4 px-6">
              <div>IoT Category</div>
              <div>Applications</div>
            </div>

            {ecosystems.map((item, i) => (
              <div
                key={i}
                className={`grid grid-cols-2 px-6 py-4 ${
                  i % 2 === 0
                    ? "bg-gray-100 dark:bg-gray-900"
                    : "bg-white dark:bg-gray-800"
                }`}
              >
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {item[0]}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {item[1]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES — now 6 cards in 3-col grid */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-white mb-6">
       What Sets DriverX IoT Apart
          </h3>
    <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
  Enterprise-grade features designed for real-world IoT deployments
</p>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((item, i) => (
              <div
                key={i}
               className="
      bg-gray-100 dark:bg-gray-800 
      border border-gray-200 dark:border-gray-700 
      rounded-lg p-5 shadow-sm 
      transition-all duration-300

      hover:bg-white dark:hover:bg-gray-900
      hover:shadow-lg 
      hover:-translate-y-1 
      hover:border-t-4 hover:border-yellow-400
    "
              >
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                  {item.title}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SMARTER PROVISIONING BANNER */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="bg-[#1f5f55] dark:bg-teal-900 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1">
              <h3 className="font-semibold mb-3">
                Smarter Provisioning | Easier Management.
              </h3>
              <ul className="text-sm space-y-1.5 opacity-90">
                {smarterPoints.map((point, i) => (
                  <li key={i}>{"-> "}{point}</li>
                ))}
              </ul>
            </div>

            <div className="w-100 h-75 rounded flex items-center justify-center shrink-0 overflow-hidden">
              <Image
                src="/images/cuate.png"
                alt="Provisioning"
                width={400}
                height={200}
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>
        </div>

        {/* SAMPLE CUSTOM PLAN STRUCTURES */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Sample Custom Plan Structures
          </h3>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            Pricing structures designed for your specific IoT use case.
          </p>

        <div className="grid md:grid-cols-2 gap-5">
  {plans.map((item, i) => (
    <div
      key={i}
      className={`bg-white dark:bg-gray-900 ${item.color} border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm`}
    >
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
        {item.category}
      </p>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        {item.desc}
      </p>

      <p className="text-sm font-bold text-teal-600 dark:text-teal-400">
        {item.name}
      </p>
    </div>
  ))}
</div>
        </div>

        {/* CTA */}
        <div className="max-w-5xl mx-auto px-6 pb-16 text-center">
          <div className="bg-[#1f5f55] dark:bg-teal-900 text-white rounded-xl p-6">
            <h3 className="font-semibold mb-2">
              Let's Design Your IoT Roadmap
            </h3>
            <p className="text-sm mb-4 opacity-90">
              Work with our IoT solutions architects to define the exact model for your IoT business model
            </p>

            <div className="flex justify-center gap-3">
         
              <button className="border border-white px-5 py-2 rounded-full text-sm">
                  <a href="/request-a-demo">Request a Custom Quote</a>
                  
              </button>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}