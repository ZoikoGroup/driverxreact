"use client";

import Image from "next/image";



const benefits = [
  { title: "Fuel & Service Discounts", icon: "⛽" },
  { title: "Free Device Health & Security Checks", icon: "❤️" },
  { title: "Priority Data for Navigation & Gig Apps", icon: "📊" },
  { title: "Cash-Back Perks through DriverX", icon: "💰" },
  { title: "24/7 U.S.-Based Driver Support", icon: "🎧" },
];
const plans = [
  {
    name: "DriverX Starter 5",
    subtitle: "Weekend drivers, part-time workers, casual users",
    price: 16,
    features: [
      "5GB High-Speed Data (Unlimited 2G thereafter)",
      "1GB Mobile Hotspot",
      "Unlimited Talk & Text (U.S. only)",
      "Free International Calls & Texts (to 100+ countries)",
    ],
  },
  {
    name: "DriverX Cruise 15",
    subtitle: "Regular gig drivers and steady users",
    price: 38,
    features: [
      "15GB High-Speed Data (Unlimited 2G thereafter)",
      "5GB Mobile Hotspot",
      "Unlimited Talk & Text (US, Canada, Mexico)",
      "Free International Calls & Texts (to 100+ countries)",
    ],
  },
  {
    name: "DriverX Power 25",
    subtitle: "Power users, multi-app user drivers",
    price: 57,
    features: [
      "25GB High-Speed Data (Unlimited 2G thereafter)",
      "15GB Mobile Hotspot",
      "Unlimited Talk & Text (US, Canada, Mexico)",
      "International Calls + Roaming",
    ],
  },
  {
    name: "DriverX Unlimited",
    subtitle: "Full-time gig drivers, constant travelers",
    price: 70,
    features: [
      "35GB High-Speed Data (Unlimited 2G thereafter)",
      "20GB Mobile Hotspot",
      "Unlimited Talk & Text (US, Canada, Mexico)",
      "International Calls (220+ countries)",
    ],
  },
];

const Prepaidplans = () => {
  return (
    <>
      {/* TOP TITLE BAR */}
      <div className="bg-teal-800 py-12">
        <h2 className="text-white text-center font-bold text-5xl">
          DriverX Prepaid Plans
        </h2>
      </div>

      {/* HERO SECTION */}
      <section className="mx-auto max-w-7xl px-8 py-20">
        <div className="grid items-center gap-10 md:grid-cols-2 rounded-3xl overflow-hidden">
          
          {/* LEFT CONTENT */}
          <div className="bg-[#f6fbef] p-12 h-full flex flex-col justify-center">
            <h3 className="text-4xl font-bold text-gray-900 leading-tight">
              Not Just a Plan <br />
              Your Driver Business Advantage
            </h3>

            <p className="mt-6 text-gray-600 text-lg max-w-md">
              Power your earnings with exclusive benefits, unbeatable
              connectivity, and driver-first savings that keep more money
              in your pocket.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative h-[350px] md:h-full">
            <Image
              src="/images/pair-of-excited-ladies-in-car-holding-hands-2024-10-18-17-35-44-utc 1.png" // 👈 put your image here
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
    Benefits of DriverX Prepaid Plans
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
        src="/images/Frame 1707483045.png"
        alt="DriverX city scene"
        className="rounded-2xl w-full object-cover"
      />
    </div>

    {/* RIGHT: Content */}
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">
        Why Choose DriverX Mobile?
      </h3>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <span className="mt-1 w-6 h-6 rounded-full bg-teal-600 text-white
                           flex items-center justify-center text-sm font-bold">
            ✓
          </span>
          <p className="text-gray-800">
            <strong>99.99%</strong> Uptime on America’s Leading Tier-1 Network
          </p>
        </div>

        <div className="flex items-start gap-4">
          <span className="mt-1 w-6 h-6 rounded-full bg-teal-600 text-white
                           flex items-center justify-center text-sm font-bold">
            ✓
          </span>
          <p className="text-gray-700">
            FCC Compliant • Encrypted & Secure
          </p>
        </div>

        <div className="flex items-start gap-4">
          <span className="mt-1 w-6 h-6 rounded-full bg-teal-600 text-white
                           flex items-center justify-center text-sm font-bold">
            ✓
          </span>
          <p className="text-gray-700">
            14-Day Money-Back Guarantee
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
        Join thousands of professional drivers keeping more of their
        earnings with DriverX Mobile. Get exclusive deals, seamless
        support, and a network built for the road.
      </p>
    </div>

    {/* RIGHT: Image */}
    <div className="flex justify-end">
      <img
     src="/images/driver.png"
        alt="Driver using phone"
        className="w-full max-w-[520px] h-[340px] object-cover rounded-3xl"
      />
    </div>

  </div>
</div>



    </>
  );
};

export default Prepaidplans;