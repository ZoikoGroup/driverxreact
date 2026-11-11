"use client";

// ===== OLD POSTPAID PAGE (commented out, replaced by new Figma design below) =====
// import Image from "next/image";
// import SingleCatPlansSection from "../components/SingleCatPlansSection";
//
// const benefits = [
//   { title: "Exclusive DriverX Cash-Back & Rewards", icon: "💸" },
//   { title: "Free Device Upgrades & Financing Options", icon: "📱" },
//   { title: "Priority Data for Navigation & Gig Apps", icon: "📊" },
//   { title: "Monthly Usage Reports for Tax Deductions", icon: "📈" },
//   { title: "24/7 Driver Support & Roadside Assistance", icon: "🎧" },
// ];
//
// const Postpaidplans = () => {
//   return (
//     <>
//       {/* TOP TITLE BAR */}
//       <div className="bg-teal-800 py-8 ">
//         <h2 className="text-white text-center font-bold text-3xl  dark:text-white">
//           DriverX Post-paid Plans
//         </h2>
//       </div>
//
//       {/* HERO SECTION */}
//       <section className="mx-auto max-w-7xl px-4 md:px-8 py-2 md:py-2">
//         <div className="grid items-center gap-10 md:grid-cols-2 rounded-3xl overflow-hidden">
//           {/* LEFT CONTENT */}
//           <div className="bg-[#f6fbef] dark:bg-gray-900 p-5 md:py-2 flex flex-col justify-center">
//             <h3 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug max-w-sm md:max-w-none">
//               Postpaid Plans Built for Drivers <br />
//               Who Go the Extra Mile
//             </h3>
//             <p className="mt-4 md:mt-6 text-sm md:text-lg text-gray-600 dark:text-white max-w-md">
//               Enjoy the freedom to work first and pay later — with exclusive driver perks,
//               maximum reliability, and flexible credit-friendly options that keep your wheels
//               and business turning
//             </p>
//           </div>
//           {/* RIGHT IMAGE */}
//           <div className="relative h-[350px] md:h-full">
//             <Image
//               src="/images/man.png"
//               alt="Driver advantage"
//               fill
//               className="object-cover rounded-3xl"
//               priority
//             />
//           </div>
//         </div>
//       </section>
//
//       <SingleCatPlansSection cat="postpaid-plans" />
//
//       <section className="relative bg-gradient-to-br from-teal-800 to-teal-600 py-8">
//         <h2 className="mb-16 text-center text-3xl font-bold text-white">
//           Benefits of DriverX Post-paid Plans
//         </h2>
//         <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20 relative">
//           {benefits.map((item, index) => (
//             <div key={index} className="group relative flex flex-col items-center">
//               <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full dark:text-white bg-white text-3xl shadow-lg transition group-hover:bg-yellow-400">
//                 {item.icon}
//               </div>
//               <div className="mt-[-20px] w-full rounded-xl bg-teal-900 px-6 py-8 text-center dark:text-white text-white transition group-hover:bg-yellow-400 group-hover:text-black">
//                 <p className="font-semibold leading-snug">{item.title}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//       <br /><br />
//
//       {/* why choose us banners */}
//       <div className="mx-auto max-w-7xl px-6 py-8 dark:bg-gray-900 dark:text-white">
//         <div className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-16 items-start">
//           <div>
//             <img src="/images/Frame 1707483045 (1).png" alt="DriverX city scene" className="w-full rounded-2xl object-cover" />
//           </div>
//           <div className="space-y-6 dark:bg-gray-900 dark:text-white">
//             <h3 className="text-2xl font-bold dark:text-white text-gray-900">Why Choose DriverX Mobile?</h3>
//             <div className="space-y-4">
//               <div className="flex items-start gap-4">
//                 <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">✓</span>
//                 <p className="text-gray-800 dark:text-white">Credit-friendly plans with low deposit options</p>
//               </div>
//               <div className="flex items-start gap-4">
//                 <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">✓</span>
//                 <p className="text-gray-700 dark:text-white">PCI & FCC Compliant • Encrypted billing</p>
//               </div>
//               <div className="flex items-start gap-4">
//                 <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">✓</span>
//                 <p className="text-gray-700 dark:text-white">Flexible spend caps and no overage shocks</p>
//               </div>
//               <div className="flex items-start gap-4">
//                 <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">✓</span>
//                 <p className="text-gray-800 dark:text-white">Built-in perks that lower your total cost of driving</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//
//       <div className="w-full py-2">
//         <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-2 items-center px-6">
//           <div className="max-w-lg">
//             <h3 className="text-2xl font-bold dark:text-white text-gray-900 mb-2">Coverage, Features & Control</h3>
//             <p className="text-gray-900 dark:text-white font-medium mb-4">Your phone. Your plan. Your way.</p>
//             <p className="dark:text-white text-gray-600 leading-relaxed">
//               Professional drivers trust DriverX Mobile for unmatched connectivity, exclusive cash-back perks,
//               and support designed for the road. It&apos;s more than a plan — it&apos;s your business partner.
//             </p>
//           </div>
//           <div className="flex justify-end">
//             <img src="/images/Frame 1707483044.png" alt="Driver using phone" className="w-full max-w-[520px] h-[340px] object-cover rounded-3xl" />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
//
// export default Postpaidplans;

// ===== NEW POSTPAID PAGE (Figma design) =====
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SingleCatPlansSection from "../components/SingleCatPlansSection";

const tabs = [
  { label: "Prepaid", href: "/prepaid-plans" },
  { label: "Postpaid", href: "/postpaid-plans", active: true },
  { label: "Data-Only", href: "/data-only-plans" },
  { label: "Business", href: "/business-plans" },
  { label: "Top-Ups", href: "/top-up-plans" },
  { label: "IoT & Connected Vehicles", href: "/iot-connected-vehicles" },
];

const beforeYouSwitch = [
  { label: "Check coverage", href: "/network-coverage-performance" },
  { label: "Check phone compatibility", href: "/compare-plans" },
  { label: "Talk to our team", href: "/contact-enterprise-sales" },
];

const Postpaidplans = () => {
  return (
    <div className="bg-[#f1f6f4] dark:bg-gray-900 text-[#0f2133] dark:text-white">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="bg-[#0f2133] overflow-hidden min-h-[288px] relative">
        {/* Background image: right half */}
        <div className="absolute inset-y-0 right-0 w-[56%] hidden md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/new/image (48).png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient fade from dark left */}
          <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#0f2133] to-transparent" />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-8 py-10 flex flex-col justify-center min-h-[288px]">
          <p className="text-[#f5c518] font-extrabold tracking-widest text-xl uppercase leading-9">
            Postpaid plans
          </p>
          <h1 className="mt-1.5 text-white font-extrabold text-5xl leading-[1.05] tracking-tight max-w-[640px]">
            Work connected. Choose<br />confidently.
          </h1>
          <p className="mt-3 text-[#e8eeec] text-xl font-normal leading-7 max-w-[452px]">
            Monthly plans for the way you drive. Compare data,<br className="hidden md:block" /> hotspot and international features.
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
            A clearer choice for every workday.
          </h2>
          {/* Compare full features */}
          <Link
            href="/compare-plans"
            className="min-h-11 px-5 py-1.5 bg-white rounded-[10px] outline outline-2 outline-[#1d6c5c] flex items-center justify-center"
          >
            <span className="text-[#1d6c5c] text-lg font-bold leading-7">Compare full features</span>
          </Link>
        </div>

        {/* Plan cards — dynamic from API */}
        <SingleCatPlansSection cat="postpaid-plans" />

        {/* ── FOOTNOTE ──────────────────────────────────────────────────── */}
        <p className="text-[#3a5a6e] text-sm font-normal leading-6">
          *Review network management and usage terms. International destinations and allowances vary by plan.
        </p>

        {/* ── ENTERPRISE BAND ───────────────────────────────────────────── */}
        <div className="px-7 pt-9 pb-5 bg-[#e8f1ee] rounded-2xl flex flex-wrap items-center gap-8">
          {/* Label + name */}
          <div className="flex flex-col gap-0.5 min-w-[220px]">
            <span className="text-[#1d6c5c] text-base font-extrabold uppercase leading-6 tracking-wide">
              For fleets &amp; operators
            </span>
            <span className="text-[#0f2133] text-4xl font-extrabold leading-9 tracking-tight">
              DriverX Enterprise
            </span>
          </div>

          {/* Features list */}
          <div className="flex-1 pl-8 border-l border-[#89c8bb] min-w-[240px]">
            <p className="text-[#0f2133] text-base font-normal leading-6">
              Unlimited high-speed data • Fleet-wide talk &amp; text<br />
              50 GB hotspot • GPS tracking &amp; telematics
            </p>
          </div>

          {/* Price */}
          <div className="pl-7 border-l border-[#89c8bb]">
            <div className="flex items-baseline gap-1">
              <span className="text-[#0f2133] text-5xl font-extrabold leading-[48px]">$220</span>
              <span className="text-[#4a6a7a] text-xl font-normal leading-8">/mo</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-end gap-1.5">
            <Link
              href="/business-plans"
              className="min-h-11 px-5 py-1.5 rounded-[10px] outline outline-2 outline-[#1d6c5c] inline-flex items-center gap-2"
            >
              <span className="text-[#1d6c5c] text-lg font-bold leading-7">View Enterprise details</span>
              <ArrowUpRight size={16} className="text-[#1d6c5c]" />
            </Link>
            <Link
              href="/contact-enterprise-sales"
              className="text-[#1d6c5c] text-base font-bold underline leading-6 pt-1.5 pb-2"
            >
              Discuss your fleet requirements
            </Link>
          </div>
        </div>

        {/* ── BEFORE YOU SWITCH ─────────────────────────────────────────── */}
        <div className="pt-4 pb-2.5 flex flex-wrap items-center gap-0">
          <span className="text-[#0f2133] dark:text-white text-3xl font-extrabold leading-8 tracking-tight pr-2.5">
            Before you switch
          </span>
          {beforeYouSwitch.map((l, i) => (
            <div key={l.label} className="flex items-center">
              <span className="h-6 w-px bg-[#aac8d3] mx-8" />
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

export default Postpaidplans;
