  "use client";

  import React from "react";

  const features = [
    "Fleet Managers & IT Leads",
    "Telematics & IoT OEMs",
    "Gig Platform Product Teams",
    "SaaS & Logistics Engineers",
    "Procurement & Commercial Directors",



  ];






  const experience = [
    { title: "Instant Activation", desc: "eSIM QR codes, pSIM deployment, auto-switching between carriers" },
    { title: "Fleet Control Dashboard", desc: "Provision, suspend, or reassign lines with real-time data" },
    { title: "Usage Intelligence", desc: "See SIM performance, driver data consumption, and zone analytics" },
    { title: "API & Platform Integration", desc: "Explore our provisioning, billing, and lifecycle APIs" },
    { title: "Multi-Network Resilience", desc: "Failover testing and network prioritization logic." },
  ];

  const goals = [
    {
      title: "Fleet Operators",
      desc: "Onboarding speed, device flexibility, centralized management",
    },
    {
      title: "Hardware Manufacturers",
      desc: "Embedded SIMs, logistics-ready shipping, QR activation flows",
    },
    {
      title: "Gig Platforms",
      desc: "User-driven onboarding, custom billing rules, uptime guarantees",
    },
    {
      title: "Enterprise SaaS",
      desc: "Scalable APIs, live diagnostics, telecom integration points",
    },
  ];

  export default function DemoSection() {
    return (
      <div className="bg-gray-100 py-10 px-4  dark:bg-gray-900 dark:text-white">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="bg-teal-700 text-white text-center py-8 rounded-md font-semibold">
            Book Your Strategic Demo
          </div>

          <p className="text-center text-sm  dark:bg-gray-900 dark:text-white text-gray-600 mt-2 mb-6">
            See how DriverX powers fleets, platforms, and connected devices at scale in just 20 minutes
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            {/* LEFT SIDE */}
            <div className="space-y-5">

              {/* Info Card */}
              <div className="bg-white p-5 rounded-lg shadow dark:border-l-neutral-800 dark:bg-gray-900 dark:text-white">
                <h3 className="font-semibold mb-2">See it. Deploy it. Scale it.</h3>
                <p className="text-sm text-gray-600 mb-3  dark:bg-gray-900 dark:text-white">
              DriverX isn't just a wireless provider — it's your connectivity engine. In this live demo, we'll show you how to activate, manage, and scale SIM and eSIM lines across thousands of devices — with the telecom-grade reliability and real-time control your operations demand.
                </p>

           <ul className="text-sm text-gray-700 space-y-3  dark:bg-gray-900 dark:text-white">
  {features.map((item, i) => (
    <li key={i} className="flex items-center gap-3">
      
      {/* Tick Circle */}
      <div className="w-5 h-5 flex items-center justify-center rounded-full bg-teal-700 shadow-sm">
        <span className="text-gray-200 text-xs">✓</span>
      </div>

      {/* Text */}
      <span>{item}</span>

    </li>
  ))}
</ul>
              </div>

              {/* Experience Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden  dark:bg-gray-900 dark:text-white">
                <div className="bg-black  dark:bg-gray-900 dark:text-white  text-white px-4 py-2 text-sm font-semibold">
                  What You’ll Experience
                </div>

                {experience.map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-2 text-sm border-t"
                  >
                    <div className="p-3 font-medium  dark:bg-gray-900 dark:text-white text-gray-800">
                      {item.title}
                    </div>
                    <div className="p-3 dark:bg-gray-900 dark:text-white text-gray-600">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* Highlight Goals */}
              <div className="bg-white p-5 rounded-lg shadow border-2 dark:bg-gray-900 dark:text-white border-blue-500">
                <h3 className="font-semibold mb-3">
                  Tailored To Your Deployment Goals
                </h3>

                <div className="space-y-3 text-sm dark:bg-gray-900 dark:text-white">
                  {goals.map((item, i) => (
                    <div key={i}>
                      <p className="font-medium dark:bg-gray-900 dark:text-white text-gray-800">{item.title}</p>
                      <p className="text-gray-600 dark:bg-gray-900 dark:text-white">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT SIDE FORM */}
              <div className=" dark:bg-gray-900 dark:text-white bg-white rounded-lg shadow border border-teal-200 text-gray-900">

                <div className="bg-teal-700 dark:bg-gray-900 dark:text-white text-white text-center py-5 rounded-t-lg text-sm font-semibold">
                  Book My Demo · See It Live
                </div>

                <form className="p-8 space-y-8 text-sm dark:bg-gray-900 dark:text-white  border-gray-200 ">

                  <div className="grid grid-cols-2 gap-8 space-5 dark:bg-gray-900 dark:text-white border-gray-200">
                    <input placeholder="Enter your First Name " className="input border-gray-200 dark:bg-gray-900 dark:text-white" />
                    <input placeholder=" Enter your  Last Name" className="input border-gray-200 dark:bg-gray-900 dark:text-white"  />
                  </div>

                  <input placeholder="Work Email *" className="input w-full dark:bg-gray-900 dark:text-white border-gray-200" />
                  <input placeholder=" Enter your Company Name" className="input w-full dark:bg-gray-900 dark:text-white border-gray-200" />

                <div className="grid grid-cols-2 gap-3">
      
      {/* Organization Type */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      <div className="w-full dark:bg-gray-900 dark:text-white border-gray-200">
        <label className="block text-xs font-medium mb-1">
          Organization Type <span className="text-red-500">*</span>
        </label>
        <select className="input w-full dark:bg-gray-900 border-gray-200 dark:text-white" >
          <option>Select Type</option>
          <option>Individual (Professional Driver / Owner-Operator)</option>
          <option>Business (Fleet Owner / Logistics Company / Enterprise Partner)</option>
        </select>
      </div>

      {/* Deployment Size */}
      <div className="w-full">
        <label className="block text-xs font-medium mb-1">
          Deployment Size <span className="text-red-500">*</span>
        </label>
        <select className="input w-full dark:bg-gray-900 dark:text-white">
          <option>Select Range</option>
          <option>0–20</option>
          <option>21–100</option>
          <option>101–500</option>
          <option>500+</option>
        </select>
      </div>

    </div>

    </div>
                  <input placeholder="Work Email" className="input w-full dark:bg-gray-900 dark:text-white" />

                  <div className="flex items-center gap-2 text-xs text-gray-600  dark:bg-gray-900 dark:text-white">
                    <input type="checkbox" />
                    <span>
                      Send me updates about DriverX products and industry insights
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-2 rounded-full font-semibold hover:bg-teal-700 transition"
                  >
                    Schedule My Demo Now
                  </button>

                </form>
              </div>
          </div>
        </div>

        {/* Tailwind reusable input class */}
        <style jsx>{`
          .input {
            @apply border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500;
          }
        `}</style>
      </div>
    );
  }