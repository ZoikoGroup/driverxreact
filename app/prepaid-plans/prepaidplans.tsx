"use client";

// ===== OLD PREPAID PAGE (commented out, replaced by new Figma design below) =====
// "use client";
// 
// import Image from "next/image";
// import SingleCatPlansSection from "../components/SingleCatPlansSection";
// 
// 
// const benefits = [
//   { title: "Fuel & Service Discounts", icon: "⛽" },
//   { title: "Free Device Health & Security Checks", icon: "❤️" },
//   { title: "Priority Data for Navigation & Gig Apps", icon: "📊" },
//   { title: "Cash-Back Perks through DriverX", icon: "💰" },
//   { title: "24/7 U.S.-Based Driver Support", icon: "🎧" },
// ];
// 
// 
// const Prepaidplans = () => {
//   return (
//     <>
//       {/* TOP TITLE BAR */}
//      <div className="bg-teal-800 py-5 md:py-8">
//   <h2 className="text-white text-center font-bold text-2xl md:text-4xl">
//     DriverX Prepaid Plans
//   </h2>
// </div>
// 
//       {/* HERO SECTION */}
//      <section className="mx-auto max-w-7xl px-4 md:px-8 py-2 md:py-2">
//   
//         <div className="grid items-center gap-8 md:grid-cols-2 rounded-3xl overflow-hidden">
//           
//           {/* LEFT CONTENT */}
//          <div className="bg-[#f6fbef] dark:bg-gray-900 p-5 md:py-5 flex flex-col justify-center">
//   
//   <h3 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug max-w-sm md:max-w-none">
//     Not Just a Plan
//     <span className="block mt-1">
//       Your Driver Business Advantage
//     </span>
//   </h3>
// 
//   <p className="mt-4 md:mt-6 text-sm md:text-lg text-gray-600 dark:text-white max-w-md">
//     Power your earnings with exclusive benefits, unbeatable
//     connectivity, and driver-first savings that keep more money
//     in your pocket.
//   </p>
// 
// </div>
// 
//           {/* RIGHT IMAGE */}
//           <div className="relative h-[350px] md:h-full">
//             <Image
//               src="/images/pair-of-excited-ladies-in-car-holding-hands-2024-10-18-17-35-44-utc 1.png" // 👈 put your image here
//               alt="Driver advantage"
//               fill
//               className="object-cover rounded-3xl"
//               priority
//             />
//           </div>
//         </div>
//       </section>
//       
//       <SingleCatPlansSection cat="prepaid-plans"/>
//     
// 
// <section className="relative bg-gradient-to-br from-teal-800 to-teal-600 py-8">
//   <h2 className="mb-16 text-center text-3xl font-bold  dark:text-white
//  text-black">
//     Benefits of DriverX Prepaid Plans
//   </h2>
// 
//   <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20 relative">
//     {benefits.map((item, index) => (
//       <div
//         key={index}
//         className="group relative flex flex-col items-center"
//       >
//         {/* ICON */}
//         <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full dark:text-white
//  bg-white text-3xl shadow-lg transition group-hover:bg-yellow-400">
//           {item.icon}
//         </div>
// 
//         {/* CARD */}
//         <div className="mt-[-20px] w-full rounded-xl bg-teal-900 px-6 py-8 text-center    dark:text-white text-white transition group-hover:bg-yellow-400 group-hover:text-black">
//           <p className="font-semibold leading-snug">
//             {item.title}
//           </p>
//         </div>
// 
//      
//       </div>
//     ))}
//   </div>
// </section>
// <br />
// <br />
// 
// {/* why choose us banners */}
// 
//    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
//         <div className="relative rounded-xl overflow-hidden shadow">
// 
//     {/* LEFT: Image */}
//     <div>
//       <img
//         src="/images/Frame 1707483045.png"
//         alt="DriverX city scene"
//         className="w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover object-center"
//             
//       />
//     </div>
// 
//     {/* RIGHT: Content */}
//     <div className="space-y-6">
//       <h3 className="text-2xl font-bold  dark:text-white
//  text-gray-900">
//         Why Choose DriverX Mobile?
//       </h3>
// 
//       <div className="space-y-6">
//         <div className="flex items-start gap-4">
//           <span className="mt-1 w-6 h-6 rounded-full bg-teal-600 text-white
//                            flex items-center justify-center text-sm font-bold">
//             ✓
//           </span>
//           <p className="text-gray-800  dark:text-white
// ">
//             <strong>99.99%</strong> Uptime on America’s Leading Tier-1 Network
//           </p>
//         </div>
// 
//         <div className="flex items-start gap-6">
//           <span className="mt-1 w-6 h-6 rounded-full bg-teal-600 text-white
//                            flex items-center justify-center text-sm font-bold">
//             ✓
//           </span>
//           <p className="text-gray-700  dark:text-white
// ">
//             FCC Compliant • Encrypted & Secure
//           </p>
//         </div>
// 
//         <div className="flex items-start gap-6">
//           <span className="mt-1 w-6 h-6 rounded-full bg-teal-600 text-white
//                            flex items-center justify-center text-sm font-bold">
//             ✓
//           </span>
//           <p className= "  dark:text-white text-gray-700">
//             14-Day Money-Back Guarantee
//           </p>
//         </div>
//       </div>
//     </div>
// 
//   </div>
// </div>
// 
// 
// <div className="w-full py-8">
//   <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center px-6">
// 
//     {/* LEFT: Content */}
//     <div className="max-w-lg">
//       <h2 className="text-4xl font-bold  dark:text-white
//  text-gray-900 mb-3">
//         Coverage, Features & Control
//       </h2>
// 
//       <p className= "  dark:text-white text-gray-900 font-medium mb-4">
//         Your phone. Your plan. Your way.
//       </p>
// 
//       <p className=" dark:text-white
//  text-gray-600 leading-relaxed">
//         Join thousands of professional drivers keeping more of their
//         earnings with DriverX Mobile. Get exclusive deals, seamless
//         support, and a network built for the road.
//       </p>
//     </div>
// 
//     {/* RIGHT: Image */}
//     <div className="flex justify-end">
//       <img
//      src="/images/driver.png"
//         alt="Driver using phone"
//         className="w-full max-w-[520px] h-[340px] object-cover rounded-3xl"
//       />
//     </div>
// 
//   </div>
// </div>
// 
// 
// 
//     </>
//   );
// };
// 
// export default Prepaidplans;
// ===== NEW PREPAID PAGE (Figma design) =====
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SingleCatPlansSection from "../components/SingleCatPlansSection";

const tabs = [
  { label: "Prepaid", href: "/prepaid-plans", active: true },
  { label: "Postpaid", href: "/postpaid-plans" },
  { label: "Data-Only", href: "/data-only-plans" },
  { label: "Business", href: "/business-plans" },
  { label: "Top-Ups", href: "/top-up-plans" },
  { label: "IoT & Connected Vehicles", href: "/iot-connected-vehicles" },
];

const links = [
  { label: "Check coverage", href: "/network-coverage-performance" },
  { label: "Check phone compatibility", href: "/compare-plans" },
  { label: "Talk to our team", href: "/contact-enterprise-sales" },
];

const Prepaidplans = () => {
  return (
    <div className={`bg-[#f1f6f4] dark:bg-gray-900 text-[#0f2133] dark:text-white`}>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="bg-[#0f2133] overflow-hidden min-h-[256px] relative">
        {/* Background image: right half */}
        <div className="absolute inset-y-0 right-0 w-[56%] hidden md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/new/image (46).png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient fade from dark left */}
          <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#0f2133] to-transparent" />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-8 py-10 flex flex-col justify-center min-h-[256px]">
          <p className="text-[#f5c518] font-extrabold tracking-widest text-xl uppercase leading-9">
            Prepaid plans
          </p>
          <h1 className="mt-1.5 text-white font-extrabold text-5xl leading-[1.05] tracking-tight max-w-[640px]">
            Plan ahead. Keep moving.
          </h1>
          <p className="mt-3 text-[#e8eeec] text-xl font-normal leading-7 max-w-[452px]">
            Pay upfront. Choose the data and hotspot allowance<br className="hidden md:block" /> that fits your workday.
          </p>
        </div>
      </section>

      {/* ── TABS ──────────────────────────────────────────────────────── */}
      <nav className="bg-white dark:bg-gray-800 border-b border-[#b2d8d1]">
        <ul className="mx-auto max-w-[1440px] flex justify-start overflow-x-auto">
          {tabs.map((t, i) => (
            <li key={t.label} className="flex items-center shrink-0">
              {i > 0 && <span className="h-5 w-px bg-[#aac8d3] self-center" />}
              <Link
                href={t.href}
                className={`relative block px-7 py-3 text-xl leading-8 min-h-14 flex items-center ${
                  t.active
                    ? "text-[#1d6c5c] font-extrabold after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[5px] after:bg-[#1d6c5c] after:rounded-t-[5px]"
                    : "text-[#0f2133] font-semibold hover:text-[#1d6c5c]"
                }`}
              >
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── PLANS SECTION ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1280px] px-4 md:px-0 pt-8 pb-4 flex flex-col gap-5">

        {/* Heading row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[#0f2133] dark:text-white text-5xl font-extrabold leading-10 tracking-tight">
            Four plans. A clear choice.
          </h2>
          {/* Compare all plans */}
          <Link
            href="/compare-plans"
            className="min-h-11 px-5 py-1.5 bg-white rounded-[10px] outline outline-2 outline-[#1d6c5c] flex items-center justify-center"
          >
            <span className="text-[#1d6c5c] text-lg font-bold leading-7">Compare all plans</span>
          </Link>
        </div>

        {/* Plan cards grid (4-col on large) */}
        <SingleCatPlansSection cat="prepaid-plans" />

        {/* ── INFO BAND ─────────────────────────────────────────────────── */}
        <div className="px-7 pt-7 pb-5 bg-[#e8f1ee] rounded-2xl flex flex-wrap items-center gap-8">
          <h3 className="text-[#0f2133] text-4xl font-extrabold leading-9 tracking-tight pr-8 border-r border-[#89c8bb] self-stretch flex items-center max-w-[530px]">
            Clear on data. Clear on your choice.
          </h3>
          <div className="flex-1 flex flex-col gap-1 min-w-[260px]">
            <p className="text-[#0f2133] text-base font-normal leading-7">
              All four plans continue at 2G speeds after the high-speed allowance is used.<br />
              DriverX Unlimited includes 35 GB of high-speed data.
            </p>
            <p className="text-[#3a5a6e] text-sm font-normal leading-6">
              International destinations and roaming terms vary by plan.
            </p>
          </div>
        </div>

        {/* ── FOOTER LINKS ──────────────────────────────────────────────── */}
        <div className="py-2.5 flex flex-wrap items-center justify-center gap-0">
          {links.map((l, i) => (
            <div key={l.label} className="flex items-center">
              {i > 0 && <span className="h-6 w-px bg-[#aac8d3] mx-8" />}
              <Link
                href={l.href}
                className="inline-flex items-center gap-1 text-base font-bold text-[#1d6c5c] underline leading-7"
              >
                {l.label} <ArrowUpRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Prepaidplans;
