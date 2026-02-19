"use client";

import Image from "next/image";



const benefits = [
  {
    title: "Centralized Billing & Easy Management Dashboard",
    icon: "🧾",
  },
  {
    title: "Shared Data Pools for Fleets",
    icon: "↕️",
  },
  {
    title: "Free SIM Swap & Device Swap Programs",
    icon: "📱",
  },
  {
    title: "Exclusive Maintenance & Fuel Partnerships",
    icon: "🤝",
  },
  {
    title: "24/7 Dedicated Business Concierge Line",
    icon: "🎧",
  },
];

const plans = [
  {
    name: "DriverX Fleet 10",
    subtitle: "For startups, local operators, and small fleets",
    price: 28,
    features: [
      "10GB High-Speed Data (Unlimited 2G thereafter)",
      "5GB Mobile Hotspot",
      "Unlimited Talk & Text (U.S., Canada, Mexico only)",
      "Optional GPS tracking and usage monitoring (through the DriverX portal)",
    ],
    cta: "Buy Plan",
  },
  {
    name: "DriverX Fleet 25",
    subtitle:
      "For expanding teams that need extra power, flexibility, and management tools to support daily operations",
    price: 58,
    features: [
      "25GB High-Speed Data (Unlimited 2G thereafter)",
      "10GB Mobile Hotspot",
      "Unlimited Talk & Text (Across North America)",
      "Full access to the DriverX Portal (Fleet Management Portal with standard GPS tracking)",
    ],
    cta: "Buy Plan",
  },
  {
    name: "DriverX Fleet Unlimited",
    subtitle:
      "For fleets that need worry-free data access and premium-grade support",
    price: 110,
    features: [
      "Unlimited High-Speed Data",
      "15GB Mobile Hotspot",
      "Unlimited Talk & Text (U.S., Canada, Mexico only)",
      "GPS Tracking and full telematics integration (to 30+ countries)",
    ],
    cta: "Buy Plan",
  },
  {
    name: "DriverX Enterprise Custom",
    subtitle:
      "For organizations with 50+ lines, DriverX offers fully customizable solutions packages",
    price: null,
    priceNote: "Packages typically start around $400 per month",
    features: [
      "Custom data selection",
      "Shared mobile hotspot pools across fleets",
      "Integration with GPS, telematics, and driver behavior",
      "Account management with quarterly business reviews",
    ],
    cta: "Enquire Plan",
  },
];


const Buisinessplans = () => {
  return (
    <>
      {/* TOP TITLE BAR */}
      <div className="bg-teal-800 py-12">
        <h2 className="text-white text-center font-bold text-5xl">
          DriverX Buisiness Plans
        </h2>
      </div>

      {/* HERO SECTION */}
      <section className="mx-auto max-w-7xl px-8 py-20">
        <div className="grid items-center gap-10 md:grid-cols-2 rounded-3xl overflow-hidden">
          
          {/* LEFT CONTENT */}
          <div className="bg-[#f6fbef] p-12 h-full flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-gray-900 leading-tight">
           Business Plans Designed for Fleets, 
           <br />Teams & Professional Operations
            </h3>

            <p className="mt-6 text-gray-600 text-lg max-w-md">
            Scale your transportation, logistics, or field service operation with plans crafted to maximize uptime, lower costs, and keep your entire team connected on America’s most reliable Tier-1 network.
         </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative h-[350px] md:h-full">
            <Image
              src="/images/man2.png" 
              alt="Driver advantage"
              fill
              className="object-cover rounded-3xl"
              priority
            />
          </div>
        </div>
      </section>
<div className="mx-auto max-w-7xl px-6 py-16 space-y-8">
  {plans.map((plan, index) => (
    <div
      key={index}
      className="flex flex-col lg:flex-row items-center justify-between gap-8 rounded-2xl border bg-white p-8 shadow-sm"
    >
      {/* LEFT SIDE */}
      <div className="flex-1">
        {/* Title + subtitle */}
        <div className="flex flex-col gap-2">
          <span className="inline-block w-fit rounded-full bg-teal-800 px-4 py-1 text-white font-semibold">
            {plan.name}
          </span>

          <p className="text-gray-600 font-medium">
            {plan.subtitle}
          </p>
        </div>

        {/* Features */}
        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-xs text-white">
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT SIDE (Price box) */}
      <div className="w-full lg:w-[300px] rounded-xl border p-6 text-center">
        <p className="text-4xl font-bold">
          ${plan.price}
          <span className="text-lg font-normal text-gray-500"> /mo</span>
        </p>

        <button className="mt-6 w-full rounded-full bg-teal-500 py-3 font-semibold text-white hover:bg-teal-600 transition">
          Buy Plan
        </button>
      </div>
    </div>
  ))}
</div>

<section className="relative bg-gradient-to-br from-teal-800 to-teal-600 py-20">
  <h2 className="mb-16 text-center text-3xl font-bold text-black">
    Benefits of DriverX Post-paid Plans
  </h2>

  <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20 relative">
    {benefits.map((item, index) => (
      <div
        key={index}
        className="group relative flex flex-col items-center"
      >
        {/* ICON */}
        <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl shadow-lg transition group-hover:bg-yellow-400">
          {item.icon}
        </div>

        {/* CARD */}
        <div className="mt-[-20px] w-full rounded-xl bg-teal-900 px-6 py-8 text-center text-white transition group-hover:bg-yellow-400 group-hover:text-black">
          <p className="font-semibold leading-snug">
            {item.title}
          </p>
        </div>

     
      </div>
    ))}
  </div>
</section>
<br />
<br />

{/* why choose us banners */}


<div className="mx-auto max-w-7xl px-6 py-20">
  <div className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-16 items-start">

    {/* LEFT: Image */}
    <div>
      <img
        src="/images/Group 1597883061.png"
        alt="DriverX city scene"
        className="w-full rounded-2xl object-cover"
      />
    </div>

    {/* RIGHT: Content */}
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">
        Why Choose DriverX Mobile?
      </h3>

      <div className="space-y-4">

        <div className="flex items-start gap-4">
          <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
            ✓
          </span>
          <p className="text-gray-800">
            Credit-friendly plans with low deposit options
          </p>
        </div>

        <div className="flex items-start gap-4">
          <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
            ✓
          </span>
          <p className="text-gray-700">
            PCI & FCC Compliant • Encrypted billing
          </p>
        </div>

        <div className="flex items-start gap-4">
          <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
            ✓
          </span>
          <p className="text-gray-700">
            Flexible spend caps and no overage shocks
          </p>
        </div>

        <div className="flex items-start gap-4">
          <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
            ✓
          </span>
          <p className="text-gray-800">
            Built-in perks that lower your total cost of driving
          </p>
        </div>

      </div>
    </div>

  </div>
</div>



<div className="w-full py-20">
  <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center px-6">

    {/* LEFT: Content */}
    <div className="max-w-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Coverage, Features & Control
      </h3>

      <p className="text-gray-900 font-medium mb-4">
        Your phone. Your plan. Your way.
      </p>

      <p className="text-gray-600 leading-relaxed">
       
Professional drivers trust DriverX Mobile for unmatched connectivity, exclusive cash-back perks, and support designed for the road. It’s more than a plan — it’s your business partner.
      </p>
    </div>

    {/* RIGHT: Image */}
    <div className="flex justify-end">
      <img
     src="/images/Group 1597883060.png"
        alt="Driver using phone"
        className="w-full max-w-[520px] h-[340px] object-cover rounded-3xl"
      />
    </div>

  </div>
</div>



    </>
  );
};

export default Buisinessplans;