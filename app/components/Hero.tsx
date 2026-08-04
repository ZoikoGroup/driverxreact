"use client";
import Image from "next/image";
import React from "react";
import PlansSection from "./AllPlansSection";
import Link from "next/link";

const mobileFeatures = [
  {
    id: 1,
    image: "/images/headphone.png",
    title: "Priority Line Support",
    description:
      "Direct access to live agents 24/7. No waiting, no automated systems when you need help most.",
    buttonText: "Buy plan",
    buttonLink: "/plan",
  },
  {
    id: 2,
    image: "/images/Briefcase.png",
    title: "Gig Worker Plans",
    description:
      "Affordable, flexible plans with no hidden fees. Designed specifically for your driving lifestyle.",
    buttonText: "Buy plan",
    buttonLink: "/plan",
  },
  {
    id: 3,
    image: "/images/truck.png",
    title: "Fleet & IoT Ready",
    description:
      " Customizable solutions for logistics, rideshare, and delivery fleets with enterprise features.",
    buttonText: "Buy plan",
    buttonLink: "/plan",
  }
];
console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
const Hero = () => {
  return (
    <>
      <section className="relative overflow-hidden dark:bg-gradient-to-br dark:from-[#0c1a18] dark:to-[#0a1412] bg-gradient-to-br from-[#f6fbef] to-[#e9f7e8]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid items-center gap-10 md:gap-16 md:grid-cols-2">

            {/* Left Content */}
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-3 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                #1 Driver Mobile Network
              </span>

              <h1 className="mt-6 md:[.3rem]  md:text-3xl lg:text-4xl font-extrabold leading-tight text-gray-900 dark:text-white">
                Connectivity That <br />
                Works as <span className="text-teal-500">Hard as</span>{" "}
                <span className="text-teal-500">You Do</span>
              </h1>

              <p className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                Designed for gig workers, fleet drivers, and mobile professionals who can&apos;t afford downtime.
              </p>

              <ul className="mt-5 sm:mt-7 space-y-3 sm:space-y-4 text-left">
                {[
                  "Reliable nationwide coverage",
                  "Priority support 24/7",
                  "Built for drivers, not just users",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    <span className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white text-xs sm:text-sm">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-4">
                <a href="/plans" className="w-full sm:w-auto scroll-smooth">
                  <button className="w-full rounded-full bg-teal-500 px-8 py-3 font-semibold text-white shadow-lg hover:bg-teal-600 transition">
                    View Plans
                  </button>
                </a>
                <a href="/partner-with-driverx" className="w-full sm:w-auto">
                  <button className="w-full rounded-full border-2 border-teal-500 px-8 py-3 font-semibold text-teal-600 hover:bg-teal-50 transition">
                    Become a partner
                  </button>
                </a>
              </div>

              <p className="mt-3 text-sm text-gray-500 dark:text-gray-200 text-center md:text-left">
                Reliable nationwide coverage. Priority support. Built for drivers, not just users.
              </p>
            </div>

            {/* Right Image */}
            <div className="relative flex justify-center order-first md:order-last">
              <Image
                src="/images/BannerDudle.png"
                alt="Driver using mobile with car"
                width={520}
                height={420}
                className="mx-auto w-full max-w-[320px] sm:max-w-[420px] md:max-w-full"
              />
            </div>

          </div>
        </div>
      </section>

      <section className="bg-gray-100 dark:bg-gray-900 py-1 px-3">
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-200 text-center md:text-left">
          Supporting professionals across rideshare, delivery, and mobility services such as Lyft, Uber, DoorDash, Cabify, Bolt, and beyond.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-6 p-6 bg-gray-100 dark:bg-gray-900">
          <img src="/images/lyft-logo-1.png" alt="Lyft" className="h-8 sm:h-12 w-auto dark:hidden" />
          <img src="/images/lyft-logo-1_dark.png" alt="Lyft" className="h-8 sm:h-12 w-auto hidden dark:block" />

          <img src="/images/Uber_logo.png" alt="Uber" className="h-8 sm:h-12 w-auto dark:hidden" />
          <img src="/images/Uber_logo_dark.png" alt="Uber" className="h-8 sm:h-12 w-auto hidden dark:block" />

          <img src="/images/DoorDash_Logo.png" alt="DoorDash" className="h-8 sm:h-12 w-auto dark:hidden" />
          <img src="/images/DoorDash_Logo_dark.png" alt="DoorDash" className="h-8 sm:h-12 w-auto hidden dark:block" />

          <img src="/images/Cabify_logo.png" alt="Cabify" className="h-8 sm:h-12 w-auto dark:hidden" />
          <img src="/images/Cabify_logo_dark.png" alt="Cabify" className="h-8 sm:h-12 w-auto hidden dark:block" />

          <img src="/images/bolt-1.png" alt="Bolt" className="h-8 sm:h-12 w-auto dark:hidden" />
          <img src="/images/bolt-1_dark.png" alt="Bolt" className="h-8 sm:h-12 w-auto hidden dark:block" />
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-[linear-gradient(135deg,#e8dfc8_0%,#d7e2c9_55%,#c8d8c8_100%)] dark:bg-[linear-gradient(135deg,#1f2421_0%,#2b3a2f_55%,#1e2f2a_100%)] py-8 md:py-12">

        {/* 1. IMAGE: Pinned to left edge, but centered vertically and size-constrained */}
        <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-[85%] max-w-4xl z-2">
          <img
            src="/images/xshaped.png"
            alt="Driver using mobile"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* 2. CONTAINER: Standard centered container for the text */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 dark:text-white text-gray-900">
          <div className="flex justify-end">

            {/* 3. CONTENT: Takes up the right 50% */}
            <div className="w-full lg:w-[40%] flex flex-col justify-center space-y-3">

              <h2 className="text-2xl md:text-2xl font-bold dark:text-white text-gray-900 leading-tight">
                How we support our <br />
                drivers all over the world
              </h2>

              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-lg">
                We're committed to empowering drivers globally with accessible,
                reliable, and flexible services tailored to their everyday needs—
                whether they're on highways, in cities, or across borders.
              </p>

              {/* 4. STORE CARDS ROW */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">

                {/* Google Play Card */}
                <div className="flex items-center bg-white rounded-xl shadow-sm px-4 py-3 gap-4 border border-gray-100 min-w-[240px]">
                  <img
                    src="/images/playstore.png"
                    alt="Google Play QR"
                    className="w-160 h-160 object-contain border border-gray-200 rounded p-1"
                  />
                </div>

                {/* Apple Card */}
                <div className="flex items-center bg-white rounded-xl shadow-sm px-4 py-3 gap-4 border border-gray-100 min-w-[240px]">
                  <img
                    src="/images/appstore.png"
                    alt="Apple QR"
                    className="w-160 h-160 object-contain border border-gray-200 rounded p-1"
                  />
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SMART SERVICES SECTION */}
      <section className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-16">
            Smarter Services for Smarter Drivers
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="flex flex-col items-center">
              <img
                src="/images/global-coverage-img1-228x300.png"
                alt="Global Coverage"
                className="h-40"
              />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Global Coverage
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-xs">
                Access essential driver services anywhere you go, worldwide.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center">
              <img
                src="/images/Group 1597883025.png"
                alt="Smart Savings"
                className="h-30"
              />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Smart Savings with AI
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-xs">
                Our AI tracks usage and spending patterns to help cut costs without
                compromising essentials.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center">
              <img
                src="/images/global-coverage-img1-228x300.png"
                alt="Vehicle Help"
                className="h-40"
              />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                All-in-One Vehicle Help
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-xs">
                Repairs, insurance, legal, and finance services — all in one place.
              </p>
            </div>

          </div>
        </div>

        {/* CTA Banner */}
        <div className="max-w-6xl mx-auto px-6 mt-20">
          <div className="relative bg-[#1e5f4f] text-white rounded-3xl p-10 flex items-center justify-between overflow-hidden">

            {/* Left Content */}
            <div className="max-w-lg">
              <h3 className="text-2xl font-bold mb-4">
                Partner With Us to Serve Drivers Better
              </h3>
              <p className="text-gray-200 mb-6">
                If you offer finance, insurance, repair, garage, or legal services,
                let’s team up. Join our network and help drivers access smarter
                solutions via mobile.
              </p>

              <a href="/24-7-driver-support"> <button className="bg-white text-[#1e5f4f] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
                Contact us
              </button></a>
            </div>

            {/* Right Coin Image */}
            <div className="hidden md:block">
              <img
                src="/images/Group 1597882922.png"
                alt="Partner"
                className="h-50"
              />
            </div>

          </div>
        </div>
      </section>

      <div id="plans" className="scroll-smooth">
        <PlansSection />
      </div>

      {/* DRIVE TYPE SECTION */}
      <section className="bg-gray-50 py-8 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-8">

          {/* LEFT PANEL */}
          <div className="bg-[#2e7d6f] dark:bg-[rgb(23,69,61)] text-white p-10 rounded-2xl w-full md:w-1/4">
            <h3 className="text-2xl font-bold mb-4">
              Choose Your <br /> Drive Type
            </h3>
            <p className="text-gray-200">
              Personalized plans for every kind of driver.
            </p>
          </div>

          {/* RIGHT CARDS */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="bg-[#e8dfc8] dark:bg-[#787366] rounded-xl p-6 text-center shadow-sm">
              <img
                src="/images/Freight-Drivers1.png"
                alt="Freight Drivers"
                className="h-40 mx-auto mb-6"
              />
              <p className="text-sm text-gray-600 dark:text-gray-300">Commercial & Logistics</p>
              <h4 className="text-lg font-bold mt-1 text-gray-900 dark:text-white">Freight Drivers</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                Fast, reliable support for fleet, ride-hailing & logistics drivers.
              </p>
              <div className="mt-6">
                <Link href="/freight-drivers">
                  <button className="h-10 w-10 rounded-full bg-[#2e7d6f] text-white">
                    →
                  </button>
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-[#404040] border rounded-xl p-6 text-center shadow-sm">
              <img
                src="/images/gig-drives-img1.png"
                alt="Gig Drivers"
                className="h-40 mx-auto mb-6"
              />
              <p className="text-sm text-gray-600 dark:text-gray-300">Independent & part-time</p>
              <h4 className="text-lg font-bold mt-1 text-gray-900 dark:text-white">Gig Drivers</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                Flexible options with no long term commitments.
              </p>
              <div className="mt-6">
                <Link href="/gig-drivers">
                  <button className="h-10 w-10 rounded-full bg-[#d47910cc] text-white">
                    →
                  </button>
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-[#404040] border rounded-xl p-6 text-center shadow-sm">
              <img
                src="/images/daily-commuters-img1.png"
                alt="Daily Commuters"
                className="h-40 mx-auto mb-6"
              />
              <p className="text-sm text-gray-600 dark:text-gray-300">Independent & part-time</p>
              <h4 className="text-lg font-bold mt-1 text-gray-900 dark:text-white">Daily Commuters</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                Affordable plans, quick help, and essential coverage.
              </p>
              <div className="mt-6">
                <Link href="/daily-commuters">
                  <button className="h-10 w-10 rounded-full bg-[#bb3102] text-white">
                    →
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* TRUSTED DRIVERS SECTION */}
      <section className="bg-[#f3f2ea] dark:bg-[#393937] py-24">
        <div className="max-w-7xl mx-auto px-6">

          <p className="text-center text-gray-500 dark:text-gray-400 mb-3">You will love it</p>

          <h2 className="text-center text-3xl font-bold mb-6">
            We Prominent Truly <span className="text-teal-600 dark:text-teal-400">Trusted drivers Solutions</span>
          </h2>

          <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-16">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at layout.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

            {/* LEFT IMAGE */}
            <div className="w-full md:w-1/2">
              <img
                src="/images/Group-1437254838.png"
                alt="Taxi Driver"
                className="w-full object-contain"
              />
            </div>

            {/* RIGHT STATS */}
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-8 md:gap-10">

              <div>
                <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-400">92%</h3>
                <p className="font-semibold">Satisfied Clients</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Based on 500+ pilot drivers most loved the real time data alerts.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-400">25M+</h3>
                <p className="font-semibold">Miles Optimized</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  AI tracks dead zones, suggests cheaper plans, and cuts signal drops.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-400">70%</h3>
                <p className="font-semibold">Faster Activation</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  No store visits. Get a SIM ready eSIM in 3 mins.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-400">35+</h3>
                <p className="font-semibold">Cities (Expanding Weekly)</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Live in major markets like Houston, Atlanta & Miami.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

    </>

  );
};


export default Hero;