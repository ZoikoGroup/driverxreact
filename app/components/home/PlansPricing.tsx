import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, SignalHigh } from "lucide-react";

const AUDIENCES = [
  "Rideshare drivers",
  "Delivery professionals",
  "Truckers & logistics",
  "Fleets & businesses",
] as const;

const TABS = [
  { label: "Prepaid", href: "/prepaid-plans", active: true },
  { label: "Postpaid", href: "/postpaid-plans", active: false },
  { label: "Data-Only", href: "/data-only-plans", active: false },
  {
    label: "Business & Fleet",
    href: "/business-plans",
    active: false,
  },
] as const;

const PLANS = [
  {
    name: "DriverX Starter 5",
    tagline: "For lighter workweeks",
    price: "$16",
    data: "5 GB",
    thereafter: "Unlimited 2G data thereafter",
    features: [
      { text: "1 GB mobile hotspot", sub: null },
      { text: "Unlimited U.S. talk & text", sub: null },
      { text: "Calls & texts to 100+ countries", sub: null },
    ],
    cta: "Choose Starter 5",
    href: "/prepaid-plans",
    details: "/prepaid-plans",
    featured: false,
  },
  {
    name: "DriverX Cruise 15",
    tagline: "For regular gig drivers",
    price: "$38",
    data: "15 GB",
    thereafter: "Unlimited 2G data thereafter",
    features: [
      { text: "5 GB mobile hotspot", sub: null },
      { text: "Unlimited talk & text", sub: "U.S., Canada & Mexico" },
      { text: "Calls & texts to 100+ countries", sub: null },
    ],
    cta: "Choose Cruise 15",
    href: "/prepaid-plans",
    details: "/prepaid-plans",
    featured: false,
  },
  {
    name: "DriverX Power 25",
    tagline: "For multi-app workdays",
    price: "$57",
    data: "25 GB",
    thereafter: "Unlimited 2G data thereafter",
    features: [
      { text: "15 GB mobile hotspot", sub: null },
      { text: "Unlimited talk & text", sub: "U.S., Canada & Mexico" },
      { text: "International calls, texts & roaming", sub: null },
    ],
    cta: "Choose Power 25",
    href: "/prepaid-plans",
    details: "/prepaid-plans",
    featured: true,
  },
  {
    name: "DriverX Unlimited",
    tagline: "For full-time drivers",
    price: "$70",
    data: "35 GB",
    thereafter: "Unlimited 2G data thereafter",
    features: [
      { text: "20 GB mobile hotspot", sub: null },
      { text: "Unlimited talk & text", sub: "U.S., Canada & Mexico" },
      { text: "Calls & texts to 220+ countries", sub: null },
    ],
    cta: "Choose Unlimited",
    href: "/prepaid-plans",
    details: "/prepaid-plans",
    featured: false,
  },
] as const;

const FOOTER_LINKS = [
  { label: "Check coverage", href: "https://mvnoc.ai/coverage-map" },
  { label: "Get help choosing", href: "/faqs-self-service" },
] as const;

export default function PlansPricing() {
  return (
    <section className="w-full overflow-x-hidden bg-[#0f1f33] px-6 py-10 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1350px]">
        {/* Header */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-[#f9c80e]">
              <SignalHigh className="h-4 w-4" aria-hidden="true" />
              Plans &amp; pricing
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Built for your workday.
              <span className="block text-[#f9c80e]">
                Priced for your next move.
              </span>
            </h2>
            <p className="mt-4 text-base text-[#b8c4d4]">
              Compare real plans. Find your balance of data, hotspot and monthly
              cost.
            </p>
            <ul className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {AUDIENCES.map((audience, index) => (
                <li key={audience} className="flex items-center gap-4">
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-[#f9c80e]"
                    />
                  )}
                  {audience}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-[160px] w-full max-w-[420px] overflow-hidden rounded-3xl lg:h-[200px] lg:w-[400px] lg:shrink-0">
            <Image
              src="/images/home/14.png"
              alt="Smiling driver behind the wheel of a car"
              fill
              sizes="(min-width: 1024px) 240px, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Tabs */}
        <nav
          aria-label="Plan categories"
          className="mt-8 flex flex-wrap items-center gap-3 border-b border-white/10 pb-5"
        >
          {TABS.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={
                tab.active
                  ? "rounded-full bg-[#f9c80e] px-4 py-2 text-sm font-semibold text-[#0f1f33]"
                  : "rounded-full border border-white/10 bg-[#1d3250] px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              }
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Plans */}
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <li
              key={plan.name}
              className={
                plan.featured
                  ? "relative flex flex-col overflow-hidden rounded-xl border-2 border-[#1f6b5c] bg-white p-5 text-[#14233a] shadow-xl"
                  : "relative flex flex-col overflow-hidden rounded-xl bg-white p-5 text-[#14233a]"
              }
            >
              {plan.featured && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1.5 bg-[#f9c80e]"
                />
              )}

              <h3 className="mt-1 text-xl font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-[#5d6b80]">{plan.tagline}</p>

              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-sm text-[#5d6b80]">/mo</span>
              </p>

              <div className="mt-4 rounded-xl bg-[#e8f1ef] px-4 py-4 text-center">
                <p className="text-3xl font-bold text-[#1f6b5c]">{plan.data}</p>
                <p className="mt-1 text-sm font-semibold text-[#1f6b5c]">
                  high-speed data
                </p>
                <p className="mt-1 text-sm text-[#5d6b80]">{plan.thereafter}</p>
              </div>

              <ul className="mt-5 flex-1 space-y-3 border-t border-[#e3e8f0] pt-5">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#1f6b5c]"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm leading-5">{feature.text}</p>
                      {feature.sub && (
                        <p className="text-sm leading-5 text-[#5d6b80]">
                          {feature.sub}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={
                  plan.featured
                    ? "mt-6 flex items-center justify-between rounded-full bg-[#f9c80e] hover:bg-[#e3b810] py-2 pl-5 pr-2 text-sm font-semibold text-[#14233a] transition-colors"
                    : "mt-6 flex items-center justify-between rounded-full bg-[#1f5c4f] hover:bg-[#17483e] py-2 pl-5 pr-2 text-sm font-semibold text-white transition-colors"
                }
              >
                {plan.cta}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#14233a]">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>

              <Link
                href={plan.details}
                className="mt-4 text-center text-sm font-medium text-[#1f5c4f] hover:underline underline-offset-4"
              >
                View plan details
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer banner */}
        <div className="mt-8 flex flex-col gap-4 rounded-xl border border-white/10 bg-[#1a3350] px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-lg font-semibold">
            Your phone. Your number. Your next move.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-full border border-white hover:bg-white hover:text-[#0f1f33] px-5 py-2 text-sm font-semibold text-white transition-all duration-200"
              >
                {link.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
