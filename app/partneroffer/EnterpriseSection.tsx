"use client";
import Image from "next/image";
import Loginform from "../loginform/form";

export default function EnterpriseSection() {
  const serveCards = [
    "Nationwide Fleets & Courier Networks",
    "Gig & Mobility App Platforms (Delivery, Ride-Hail, Freelance)",
    "Telematics, GPS & IoT Hardware Manufacturers",
    "Automotive & EV Rental Companies",
    "SaaS & Logistics Tech Providers",
    "Telecom Distributors, MVNOs & White-Label Partners",
  ];

  const capabilities = [
    {
      title: "Multi-Network Coverage",
      outcome:
        "Resilient uptime with automatic switching across AT&T & T-Mobile",
    },
    {
      title: "Fleet-Optimized Plans",
      outcome:
        "Designed for high-frequency, app-heavy use — no waste",
    },
    {
      title: "ESIM & API Integration",
      outcome:
        "Instant provisioning, remote management, and scaling at speed",
    },
    {
      title: "Global-Ready Infrastructure",
      outcome:
        "Activate cross-border deployments with one platform",
    },
    {
      title: "Dedicated Enterprise Manager",
      outcome:
        "Direct point-of-contact for strategy, onboarding & support",
    },
  ];

  const steps = [
    "Your Use Case (Fleet, Hardware, Marketplace, Etc.)",
    "Regions Of Operation And Growth Targets",
    "Expected Volume (Devices, SIMs, ESIM Activations)",
    "Integration, Hardware, Or Reseller Needs",
    "KPIs You Care About Most: Uptime? Onboarding Time? Data Efficiency?",
  ];

  return (
    <>
      <br />

      <section className="w-full bg-[#f5f5f5] dark:bg-gray-950 transition-colors duration-300">

        {/* HERO */}
        <div className="bg-[#1f5f55] dark:bg-teal-900 py-20 text-center text-white font-semibold text-xl">
          Engineer The Future Of Mobility With DriverX
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <div className="rounded-xl overflow-hidden shadow-md dark:shadow-none">
            <Image
              src="/images/portrait-of-multi-cultural-freight-haulage-team-st-2024-10-22-13-29-16-utc 1.png"
              alt="Enterprise Mobility"
              width={1200}
              height={600}
              className="w-full h-[420px] object-cover"
            />
          </div>

          <h3 className="mt-6 text-lg font-semibold text-gray-800 dark:text-white">
            We Power the Infrastructure Behind Modern Mobility
          </h3>

          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            DriverX isn’t just another MVNO — we’re a telecom-grade platform built
            for speed, scale, and reliability. Whether you're scaling IoT
            devices, connecting thousands of vehicles, or building a gig
            marketplace, our infrastructure adapts to your growth in real-time.
          </p>
        </div>

        {/* WHO WE SERVE */}
        <div className="bg-[#1f5f55] dark:bg-teal-900 py-14 px-6 text-white text-center">
          <h2 className="text-xl font-semibold">Who We Serve</h2>
          <p className="text-sm opacity-80 mt-2">
            Enterprise-grade features designed for real-world
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
            {serveCards.map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg py-6 px-4 shadow-md dark:shadow-lg border dark:border-gray-800 font-medium transition-colors"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* CAPABILITIES TABLE */}
        <div className="max-w-6xl mx-auto px-6 py-14">
          <h2 className="text-center text-xl font-semibold mb-8 text-gray-800 dark:text-white">
            What You Get With DriverX Enterprise
          </h2>

          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-2 bg-[#1f5f55] dark:bg-teal-900 text-white font-semibold py-4 px-6">
              <div>Capability</div>
              <div>Outcome</div>
            </div>

            {capabilities.map((item, i) => (
              <div
                key={i}
                className={`grid grid-cols-2 px-6 py-4 transition-colors ${
                  i % 2 === 0
                    ? "bg-gray-100 dark:bg-gray-900"
                    : "bg-white dark:bg-gray-800"
                }`}
              >
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {item.title}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {item.outcome}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DEPLOYMENT STEPS */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <h2 className="text-center text-lg font-semibold text-gray-800 dark:text-white">
            Let’s Build Your Deployment Strategy
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">
            We begin every enterprise engagement with a tailored discovery session.
          </p>

          <div className="space-y-4 mt-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1f5f55] dark:bg-teal-700 text-white font-semibold text-sm">
                  {i + 1}
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-medium">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
      <Loginform />
    </>
  );
}