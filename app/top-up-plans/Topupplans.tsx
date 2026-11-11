"use client";

// ===== OLD TOP-UP PAGE (commented out, replaced by new Figma design) =====
// "use client";
// 
// import Image from "next/image";
// import SingleCatPlansSection from "../components/SingleCatPlansSection";
// 
// const Topupplans = () => {
//   return (
//     <div className="dark:bg-gray-800">
//       {/* TOP TITLE BAR */}
//       <div className="bg-teal-800 py-8">
//         <h2 className="text-white text-center font-bold text-2xl">
//           DriverX Topup Plans
//         </h2>
//       </div>
// 
//       {/* HERO SECTION */}
//      <section className="mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-2 dark:bg-gray-800">
//      <div className="grid items-center gap-10 md:grid-cols-2 rounded-3xl overflow-hidden">
//           
//           {/* LEFT CONTENT */}
//            <div className="bg-[#f6fbef] dark:bg-gray-800 p-5 md:py-2 flex flex-col justify-center">
//           <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:bg-gray-800 dark:text-white leading-snug max-w-sm md:max-w-none">
//            Topup Plans Designed for Fleets, 
//            <br />Teams & Professional Operations
//             </h3>
// 
//             <p className="mt-6 text-gray-600 text-lg max-w-md  dark:bg-gray-800 dark:text-white">
//             Scale your transportation, logistics, or field service operation with plans crafted to maximize uptime, lower costs, and keep your entire team connected on America’s most reliable Tier-1 network.
//          </p>
//           </div>
// 
//           {/* RIGHT IMAGE */}
//           <div className="relative h-[350px] md:h-full">
//             <Image
//               src="/images/pair-of-excited-ladies-in-car-holding-hands-2024-10-18-17-35-44-utc 1.png" 
//               alt="Driver advantage"
//               fill
//               className="object-cover rounded-3xl"
//               priority
//             />
//           </div>
//         </div>
//       </section>
// <SingleCatPlansSection cat="data-only-plans" heading="Topup Plans Designed for Fleets"/>
// 
// {/* why choose us banners */}
// 
// 
// <div className="mx-auto max-w-7xl px-6 dark:bg-gray-800 dark:text-white">
//   <div className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-2 items-start">
// 
//     {/* LEFT: Image */}
//     <div>
//       <img
//         src="/images/Frame 1707483045.png"
//         alt="DriverX city scene"
//         className="rounded-2xl w-full object-cover"
//       />
//     </div>
// 
//     {/* RIGHT: Content */}
//     <div className="space-y-6  dark:bg-gray-800 dark:text-white">
//       <h3 className="text-2xl font-bold text-gray-900  dark:bg-gray-800 dark:text-white">
//         Why Choose DriverX Mobile?
//       </h3>
// 
//       <div className="space-y-4">
//         <div className="flex items-start gap-4">
//           <span className="mt-1 w-6 h-6 rounded-full bg-teal-600 text-white
//                            flex items-center justify-center text-sm font-bold">
//             ✓
//           </span>
//           <p className="text-gray-800  dark:bg-gray-800 dark:text-white">
//             <strong>99.99%</strong> Uptime on America’s Leading Tier-1 Network
//           </p>
//         </div>
// 
//         <div className="flex items-start gap-4  dark:bg-gray-800 dark:text-white">
//           <span className="mt-1 w-6 h-6 rounded-full bg-teal-600 text-white
//                            flex items-center justify-center text-sm font-bold">
//             ✓
//           </span>
//           <p className="text-gray-700  dark:bg-gray-800 dark:text-white">
//             FCC Compliant • Encrypted & Secure
//           </p>
//         </div>
// 
//         <div className="flex items-start gap-4  dark:bg-gray-800 dark:text-white">
//           <span className="mt-1 w-6 h-6 rounded-full bg-teal-600 text-white
//                            flex items-center justify-center text-sm font-bold">
//             ✓
//           </span>
//           <p className="text-gray-700  dark:bg-gray-800 dark:text-white">
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
// <div className="w-full dark:bg-gray-800 dark:text-white">
//   <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-2 items-center px-6">
// 
//     {/* LEFT: Content */}
//     <div className="max-w-lg">
//       <h3 className="text-2xl font-bold  dark:bg-gray-800 dark:text-white text-gray-900 mb-3">
//         Coverage, Features & Control
//       </h3>
// 
//       <p className="text-gray-900 font-medium mb-4  dark:bg-gray-800 dark:text-white">
//         Your phone. Your plan. Your way.
//       </p>
// 
//       <p className="text-gray-600 leading-relaxed  dark:bg-gray-800 dark:text-white">
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
// 
//     </div>
//   );
// };
// 
// export default Topupplans;
// ===== NEW TOP-UP PAGE (Figma design) =====
import { useState } from "react";
import Link from "next/link";
import {
  RefreshCw, Layers, Users, ArrowRight, User, Smartphone, ListChecks,
  CreditCard, Lock, Info, ChevronRight, LifeBuoy, MapPin, MessageSquare,
  CheckCircle2, Plus, Minus,
} from "lucide-react";
import SingleCatPlansSection from "../components/SingleCatPlansSection";

const tabs = [
  { label: "Prepaid", href: "/prepaid-plans" },
  { label: "Postpaid", href: "/postpaid-plans" },
  { label: "Data-Only", href: "/data-only-plans" },
  { label: "Business", href: "/business-plans" },
  { label: "Top-Ups", href: "/top-up-plans", active: true },
  { label: "IoT & Connected Vehicles", href: "/iot-connected-vehicles" },
];

const actions = [
  { icon: RefreshCw, title: "Renew My Plan", desc: "Restart service for your selected line.", href: "/login" },
  { icon: Layers, title: "Add an Extra", desc: "See eligible top-ups and account add-ons.", href: "#topup-plans" },
  { icon: Users, title: "Manage My Lines", desc: "Review status, renewal dates and payment details.", href: "/dashboard" },
];

const steps = [
  { icon: User, label: "Sign in" },
  { icon: Smartphone, label: "Select line" },
  { icon: ListChecks, label: "Review eligible options" },
  { icon: CreditCard, label: "Confirm total" },
  { icon: Lock, label: "Pay securely" },
];

const driverPoints = [
  { icon: Smartphone, title: "Review your line", desc: "See your current plan and renewal date." },
  { icon: Layers, title: "See charges before payment", desc: "Review eligible add-ons, charges and total." },
  { icon: Lock, title: "Secure checkout", desc: "A simple, protected payment experience." },
  { icon: CheckCircle2, title: "Get confirmation after purchase", desc: "Receive a purchase confirmation for your records." },
];

const help = [
  { icon: LifeBuoy, title: "Need help?", desc: "Get answers to common questions.", href: "/faqs-self-service" },
  { icon: MapPin, title: "Check coverage", desc: "See service in your area.", href: "/network-coverage-performance" },
  { icon: MessageSquare, title: "Chat with support", desc: "Get help from our support team.", href: "/24-7-driver-support" },
];

const faqs = [
  { q: "Can I refill a prepaid plan?", a: "Yes. Sign in, select your line and choose an eligible top-up to refill your prepaid plan." },
  { q: "Which plans support Voice Boost add-ons?", a: "Availability depends on your plan. Eligible options are shown after you sign in and select your line." },
  { q: "When does a top-up begin?", a: "Timing is confirmed at checkout, before you pay." },
  { q: "Will taxes or fees apply?", a: "Prices, taxes and fees are confirmed after sign-in and shown in your total before purchase." },
];

const Topupplans = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="bg-[#f1f6f4] dark:bg-gray-900 text-[#0f2133] dark:text-white">
      {/* HERO */}
      <section className="bg-[#0f2133] overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-8 grid md:grid-cols-2 items-center">
          <div className="py-14 md:py-24">
            <p className="text-[#f5c518] font-bold tracking-wide text-sm">TOP-UPS &amp; REFILLS</p>
            <h1 className="mt-4 text-white font-extrabold text-4xl md:text-5xl leading-tight">
              Stay connected.<br />Keep moving.
            </h1>
            <p className="mt-4 text-white/90 max-w-sm">
              Renew plans or add eligible services without interrupting your workday.
            </p>
          </div>
          <div className="relative h-[260px] md:h-[360px] md:mt-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/new/image (44).png" alt="Driver checking phone beside a van" className="w-full h-full object-cover object-top" />
            <div className="hidden md:block absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#0f2133] to-transparent" />
          </div>
        </div>
      </section>

      {/* TABS */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <ul className="mx-auto max-w-7xl px-4 flex justify-start md:justify-center overflow-x-auto">
          {tabs.map((t, i) => (
            <li key={t.label} className="flex items-center shrink-0">
              {i > 0 && <span className="h-4 w-px bg-gray-300" />}
              <Link
                href={t.href}
                className={`block px-5 py-4 text-sm font-semibold border-b-2 ${
                  t.active ? "text-[#1d5c52] border-[#1d5c52]" : "border-transparent hover:text-[#1d5c52]"
                }`}
              >
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* CHOOSE */}
        <h2 className="pt-10 text-3xl font-extrabold">Choose what you need today.</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Renew your service, add eligible extras, or manage your lines in one place.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {actions.map(({ icon: Icon, title, desc, href }) => (
            <Link key={title} href={href} className="flex items-center gap-4 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#e3efec] text-[#1d5c52]">
                <Icon size={26} />
              </span>
              <span className="flex-1 border-l border-gray-200 pl-4">
                <span className="block font-bold">{title}</span>
                <span className="block text-xs text-gray-500 dark:text-gray-300 mt-1">{desc}</span>
              </span>
              <ArrowRight size={18} className="text-[#1d5c52]" />
            </Link>
          ))}
        </div>

        {/* STEPS */}
        <div className="mt-4 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row lg:items-center gap-4">
          <ol className="flex flex-1 flex-wrap items-center justify-around gap-3">
            {steps.map(({ icon: Icon, label }, i) => (
              <li key={label} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-2 text-center text-xs font-bold w-24">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e3efec] text-[#1d5c52]">
                    <Icon size={18} />
                  </span>
                  {label}
                </div>
                {i < steps.length - 1 && <ChevronRight size={16} className="hidden sm:block text-gray-500" />}
              </li>
            ))}
          </ol>
          <div className="flex items-start gap-2 rounded-lg bg-[#e3efec] dark:bg-gray-700 p-3 text-xs font-medium lg:w-72">
            <Info size={16} className="mt-0.5 shrink-0 text-[#1d5c52]" />
            Prices, taxes, eligibility and timing are confirmed after sign-in.
          </div>
        </div>
      </div>

      {/* PLANS (unchanged from the previous top-up page) */}
      <div id="topup-plans" className="mt-6">
        <SingleCatPlansSection cat="data-only-plans" heading="Topup Plans Designed for Fleets" />
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* BUILT FOR DRIVERS */}
        <section className="mt-10 rounded-2xl bg-gradient-to-r from-[#0f2133] from-50% to-[#1f7164] p-6 md:p-8 text-white">
          <h2 className="text-2xl md:text-3xl font-extrabold">Built for drivers. Ready when you are.</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {driverPoints.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`flex gap-3 ${i > 0 ? "lg:border-l lg:border-white/20 lg:pl-5" : ""}`}>
                <Icon size={26} className="shrink-0 text-[#f5c518]" />
                <div>
                  <p className="font-bold text-sm">{title}</p>
                  <p className="mt-1 text-xs text-white/75">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* HELP STRIP */}
      <section className="mt-8 bg-[#e3efec] dark:bg-gray-800">
        <div className="mx-auto max-w-6xl grid md:grid-cols-3 md:divide-x divide-white">
          {help.map(({ icon: Icon, title, desc, href }) => (
            <Link key={title} href={href} className="flex items-center gap-4 px-6 md:px-8 py-5">
              <Icon size={26} className="text-[#1d5c52]" />
              <span className="flex-1">
                <span className="block font-bold text-[#1d5c52]">{title}</span>
                <span className="block text-xs text-gray-600 dark:text-gray-300">{desc}</span>
              </span>
              <ArrowRight size={18} className="text-[#1d5c52]" />
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 md:px-8 py-10">
        <h2 className="text-3xl font-extrabold">Frequently asked questions</h2>
        <div className="mt-5 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold"
                aria-expanded={open === i}
              >
                {f.q}
                {open === i ? <Minus size={16} /> : <Plus size={16} />}
              </button>
              {open === i && <p className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-300">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Topupplans;
