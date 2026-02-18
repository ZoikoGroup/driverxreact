"use client";
import Image from "next/image";
import React from "react";



const mobileFeatures = [
  {   id:1,
     image: "/images/headphone.png",
    title: "Priority Line Support",
    description:
      "Direct access to live agents 24/7. No waiting, no automated systems when you need help most.",
    buttonText: "Buy plan",
    buttonLink: "/plan",
  },
    {id : 2,
     image: "/images/Briefcase.png",
    title: "Gig Worker Plans",
    description:
      "Affordable, flexible plans with no hidden fees. Designed specifically for your driving lifestyle.",
    buttonText: "Buy plan",
    buttonLink: "/plan",
  },
    { id:3,
     image: "/images/truck.png",
    title: "Fleet & IoT Ready",
    description:
      " Customizable solutions for logistics, rideshare, and delivery fleets with enterprise features.",
    buttonText: "Buy plan",
    buttonLink: "/plan",
  }
];

const Hero = () => {
  return (
    <>
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f6fbef] to-[#e9f7e8]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-16 md:grid-cols-2">

          {/* LEFT CONTENT */}
          <div>
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-1 text-sm font-semibold text-white">
               #1 Driver Mobile Network
            </span>

            {/* Heading */}
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
              Connectivity That <br />
              Works as{" "}
              <span className="text-teal-500">Hard as</span>{" "}
              <span className="text-teal-500">You Do</span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-lg text-gray-600">
              Designed for gig workers, fleet drivers, and mobile professionals
              who cant afford downtime.
            </p>

            {/* Features */}
            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3 text-gray-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white">
                  ✓
                </span>
                Reliable nationwide coverage
              </li>

              <li className="flex items-center gap-3 text-gray-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white">
                  ✓
                </span>
                Priority support 24/7
              </li>

              <li className="flex items-center gap-3 text-gray-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white">
                  ✓
                </span>
                Built for drivers, not just users
              </li>
            </ul>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="rounded-full bg-teal-500 px-8 py-3 font-semibold text-white shadow-lg hover:bg-teal-600 transition">
                View Plans
              </button>

              <button className="rounded-full border-2 border-teal-500 px-8 py-3 font-semibold text-teal-600 hover:bg-teal-50 transition">
                Explore Business Plans
              </button>
            </div>

            {/* Footer text */}
            <p className="mt-6 text-sm text-gray-500">
              Reliable nationwide coverage. Priority support. Built for drivers, not just users.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <Image
              src="/images/BannerDudle.png"
              alt="Driver using mobile with car"
              width={520}
              height={420}
              priority
              className="mx-auto"
            />
          </div>

        </div>
      </div>


      {/*
      
      <div className="mx-auto max-w-7xl px-6 py-20">


        <h2 className="text-center font-bold text-5xl">Why DriverX Mobile?</h2>
<br />

          <div className="grid gap-8 md:grid-cols-3">
    {mobileFeatures.map((item) => (
      <div
        key={item.id}
        className="rounded-2xl bg-white p-6 shadow-lg flex flex-col items-center"
>
        <Image
          src={item.image}
          alt={item.title}
          width={64}
          height={64}
          className="mb-4"
        />

        <h3 className="text-xl font-semibold text-gray-900">
          {item.title}
        </h3>

        <p className="mt-2 text-gray-600">
          {item.description}
        </p>

        <a
          href={item.buttonLink}
          className="mt-4 inline-block rounded-lg bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
        >
          {item.buttonText}
        </a>
      </div>
    ))}
  </div>




      </div>
      */}
    </section>

<section className="bg-gray-100 p-4;">

<p className="text-xl font-medium text-center p-4">Supporting professionals across rideshare, delivery, and mobility services such as Lyft, Uber, DoorDash, Cabify, Bolt, and beyond.</p>

 <div className="flex justify-center items-center space-x-6 p-6 bg-gray-100">
      <img src="/images/lyft-logo-1.png" alt="Lyft" className="h-12 w-auto" />
      <img src="/images/Uber_logo.png" alt="Uber" className="h-12 w-auto" />
      <img src="/images/DoorDash_Logo.png" alt="DoorDash" className="h-12 w-auto" />
      <img src="/images/Cabify_logo.png" alt="Cabify" className="h-12 w-auto" />
      <img src="/images/bolt-1.png" alt="Bolt" className="h-12 w-auto" />
    </div>


</section>
<section className="relative overflow-hidden 
bg-[linear-gradient(135deg,#e8dfc8_0%,#d7e2c9_45%,#c8d8c8_100%)] 
py-24">

  <div className="max-w-7xl mx-auto px-6 
                  flex items-center justify-between gap-16">

    {/* LEFT - Image */}
    <div className="w-1/2 flex justify-center">
      <img 
        src="/images/New Project 186 [ED072AB].png" 
        alt="Driver" 
        className="h-[420px] w-auto object-contain"
      />
    </div>

    {/* RIGHT - Text */}
    <div className="w-1/2 space-y-6">
      <h2 className="text-4xl font-bold text-gray-900 leading-tight">
        How we support our drivers all over the world
      </h2>

      <p className="text-gray-700 text-lg">
        We’re committed to empowering drivers globally with accessible,
        reliable, and flexible services tailored to their everyday needs—
        whether they’re on highways, in cities, or across borders.
      </p>

      <div className="flex gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 w-60">
          <h4 className="font-semibold">Google Play</h4>
          <p className="text-sm text-gray-500">4.9 / 5 rating</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 w-60">
          <h4 className="font-semibold">Apple</h4>
          <p className="text-sm text-gray-500">4.8 / 5 rating</p>
        </div>
      </div>
    </div>

  </div>
</section>


{/* SMART SERVICES SECTION */}
<section className="bg-gray-50 py-24">
  <div className="max-w-7xl mx-auto px-6 text-center">

    <h2 className="text-3xl font-bold text-gray-800 mb-16">
      Smarter Services for Smarter Drivers
    </h2>

    <div className="grid md:grid-cols-3 gap-12">

      {/* Card 1 */}
      <div className="flex flex-col items-center">
        <img
          src="/images/global-coverage-img1-228x300.png"
          alt="Global Coverage"
          className="h-40 mb-6"
        />
        <h3 className="font-semibold text-lg text-gray-900">
          Global Coverage
        </h3>
        <p className="text-gray-600 mt-3 max-w-xs">
          Access essential driver services anywhere you go, worldwide.
        </p>
      </div>

      {/* Card 2 */}
      <div className="flex flex-col items-center">
        <img
          src="/images/Group 1597883025.png"
          alt="Smart Savings"
          className="h-40 mb-6"
        />
        <h3 className="font-semibold text-lg text-gray-900">
          Smart Savings with AI
        </h3>
        <p className="text-gray-600 mt-3 max-w-xs">
          Our AI tracks usage and spending patterns to help cut costs without
          compromising essentials.
        </p>
      </div>

      {/* Card 3 */}
      <div className="flex flex-col items-center">
        <img
          src="/images/global-coverage-img1-228x300.png"
          alt="Vehicle Help"
          className="h-40  mb-6"
        />
        <h3 className="font-semibold text-lg text-gray-900">
          All-in-One Vehicle Help
        </h3>
        <p className="text-gray-600 mt-3 max-w-xs">
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

        <button className="bg-white text-[#1e5f4f] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
          Contact us
        </button>
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
{/* DRIVE TYPE SECTION */}
<section className="bg-gray-50 py-20">
  <div className="max-w-7xl mx-auto px-6 flex gap-8">

    {/* LEFT PANEL */}
    <div className="bg-[#2e7d6f] text-white p-10 rounded-2xl w-1/4">
      <h3 className="text-2xl font-bold mb-4">
        Choose Your <br /> Drive Type
      </h3>
      <p className="text-gray-200">
        Personalized plans for every kind of driver.
      </p>
    </div>

    {/* RIGHT CARDS */}
    <div className="flex-1 grid md:grid-cols-3 gap-8">

      {/* Card 1 */}
      <div className="bg-[#e8dfc8] rounded-xl p-6 text-center shadow-sm">
        <img
          src="/images/Freight-Drivers1.png"
          alt="Freight Drivers"
          className="h-40 mx-auto mb-6"
        />
        <p className="text-sm text-gray-600">Commercial & Logistics</p>
        <h4 className="text-lg font-bold mt-1">Freight Drivers</h4>
        <p className="text-gray-600 text-sm mt-2">
          Fast, reliable support for fleet, ride-hailing & logistics drivers.
        </p>

        <div className="mt-6">
          <button className="h-10 w-10 rounded-full bg-[#2e7d6f] text-white">
            →
          </button>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white border rounded-xl p-6 text-center shadow-sm">
        <img
          src="/images/gig-drives-img1.png"
          alt="Gig Drivers"
          className="h-40 mx-auto mb-6"
        />
        <p className="text-sm text-gray-600">Independent & part-time</p>
        <h4 className="text-lg font-bold mt-1">Gig Drivers</h4>
        <p className="text-gray-600 text-sm mt-2">
          Flexible options with no long term commitments.
        </p>

        <div className="mt-6">
          <button className="h-10 w-10 rounded-full bg-orange-400 text-white">
            →
          </button>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white border rounded-xl p-6 text-center shadow-sm">
        <img
          src="/images/daily-commuters-img1.png"
          alt="Daily Commuters"
          className="h-40 mx-auto mb-6"
        />
        <p className="text-sm text-gray-600">Independent & part-time</p>
        <h4 className="text-lg font-bold mt-1">Daily Commuters</h4>
        <p className="text-gray-600 text-sm mt-2">
          Affordable plans, quick help, and essential coverage.
        </p>

        <div className="mt-6">
          <button className="h-10 w-10 rounded-full bg-red-400 text-white">
            →
          </button>
        </div>
      </div>

    </div>
  </div>
</section>
{/* TRUSTED DRIVERS SECTION */}
<section className="bg-[#f3f2ea] py-24">
  <div className="max-w-7xl mx-auto px-6">

    <p className="text-center text-gray-500 mb-3">You will love it</p>

    <h2 className="text-center text-3xl font-bold mb-6">
      We Prominent Truly <span className="text-teal-600">Trusted drivers Solutions</span>
    </h2>

    <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
      It is a long established fact that a reader will be distracted by the readable content of a page when looking at layout.
    </p>

    <div className="flex items-center gap-16">

      {/* LEFT IMAGE */}
      <div className="w-1/2">
        <img
          src="/images/Group-1437254838.png"
          alt="Taxi Driver"
          className="w-full object-contain"
        />
      </div>

      {/* RIGHT STATS */}
      <div className="w-1/2 grid grid-cols-2 gap-10">

        <div>
          <h3 className="text-2xl font-bold text-teal-700">92%</h3>
          <p className="font-semibold">Satisfied Clients</p>
          <p className="text-sm text-gray-600 mt-2">
            Based on 500+ pilot drivers most loved the real time data alerts.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-teal-700">25M+</h3>
          <p className="font-semibold">Miles Optimized</p>
          <p className="text-sm text-gray-600 mt-2">
            AI tracks dead zones, suggests cheaper plans, and cuts signal drops.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-teal-700">70%</h3>
          <p className="font-semibold">Faster Activation</p>
          <p className="text-sm text-gray-600 mt-2">
            No store visits. Get a SIM ready eSIM in 3 mins.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-teal-700">35+</h3>
          <p className="font-semibold">Cities (Expanding Weekly)</p>
          <p className="text-sm text-gray-600 mt-2">
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