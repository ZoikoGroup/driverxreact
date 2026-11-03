"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  BarChart3,
  CalendarClock,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  HeartHandshake,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

const TABS = ["Login", "Register", "Reset Password"] as const;

const FEATURES = [
  {
    title: "Earn more",
    text: "Competitive fares and transparent pay.",
    icon: BarChart3,
  },
  {
    title: "Total flexibility",
    text: "Work when you want, where you want.",
    icon: CalendarClock,
  },
  {
    title: "Drive with confidence",
    text: "Verified riders and in-app safety tools.",
    icon: ShieldCheck,
  },
  {
    title: "24/7 driver support",
    text: "Real people, real help.",
    icon: HeartHandshake,
  },
] as const;

const STATS = [
  { value: "1M+", label: "Drivers worldwide", icon: Users },
  { value: "500+", label: "Cities and growing", icon: Globe },
  { value: "4.8/5", label: "Driver satisfaction", icon: Star },
] as const;

const FOOTER_LINKS = ["Privacy", "Terms", "Accessibility", "Help"] as const;

const INPUT_CLASS =
  "flex items-center rounded-lg border border-[#E3E8EE] bg-white px-4 py-3 focus-within:border-[#2F8C82] focus-within:ring-2 focus-within:ring-[#2F8C82]/20";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

function MicrosoftLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022" />
      <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00" />
      <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF" />
      <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" />
    </svg>
  );
}

export default function Login() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Login");
  const [show, setShow] = useState(false);

  return (
    <main className="grid min-h-screen w-full grid-cols-1 font-sans text-[#0B1B3F] lg:grid-cols-[52%_48%]">
      {/* ================= LEFT: image half ================= */}
      <section className="relative flex min-h-[820px] flex-col overflow-hidden px-6 py-8 sm:px-10 lg:min-h-screen lg:px-[58px]">
        <Image
          src="/images/auth/login.png"
          alt="Smiling driver standing beside a car at sunset with a city skyline behind"
          fill
          priority
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover object-center"
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link
            href="/"
            aria-label="DriverXmobile home"
            className="inline-block rounded-2xl bg-white px-3 py-2 shadow-lg"
          >
            <Image
              src="/images/logo.svg.png"
              alt="DriverXmobile"
              width={130}
              height={40}
              priority
              className="h-auto w-[130px]"
            />
          </Link>
        </div>

        {/* Headline + copy */}
        <div className="relative z-10 mt-24 lg:mt-[110px]">
          <h1 className="text-[44px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[52px] xl:text-[58px]">
            <span className="block text-[#0B1B3F]">Your drive.</span>
            <span className="block text-[#2E9150]">Greater opportunities.</span>
          </h1>
          <p className="mt-4 max-w-[480px] text-[13px] leading-relaxed text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.45)] sm:text-sm">
            The all-in-one platform for drivers. Flexible work. Fair earnings.
            Real support. On the road and in your corner.
          </p>
        </div>

        {/* Bottom: feature cards + stats */}
        <div className="relative z-10 mt-auto pt-10">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <li
                  key={f.title}
                  className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D9EBE8] text-[#2F8C82]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[12px] font-bold leading-tight text-[#0B1B3F]">
                      {f.title}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-snug text-[#4B5668]">
                      {f.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <ul className="mt-5 grid grid-cols-1 gap-4 rounded-xl bg-[#1B1F25]/75 px-5 py-4 text-white backdrop-blur-sm sm:grid-cols-3 sm:gap-0">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.label}
                  className={`flex items-center gap-3 ${
                    i !== 0 ? "sm:border-l sm:border-white/25 sm:pl-4" : ""
                  }`}
                >
                  <Icon
                    className="h-5 w-5 shrink-0"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-[17px] font-semibold leading-none">
                      {s.value}
                    </p>
                    <p className="mt-1 text-[10px] text-white/80">{s.label}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ================= RIGHT: form half ================= */}
      <section className="flex items-center justify-center bg-[#F3F6F9] px-4 py-8 sm:px-8 lg:px-[56px]">
        <div className="flex min-h-[570px] w-full max-w-[540px] flex-col rounded-[28px] bg-white px-6 pb-5 pt-0 shadow-[0_10px_40px_rgba(15,40,80,0.08)] lg:min-h-[calc(100vh-64px)] lg:max-h-[780px]">
          {/* Tabs */}
          <div role="tablist" className="grid grid-cols-3 pt-3">
            {TABS.map((t, i) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t)}
                  className={`relative px-2 py-3 text-[13px] font-medium transition-colors ${
                    active
                      ? "border-b-2 border-[#2F8C82] text-[#2F8C82]"
                      : "border-b border-transparent text-[#2A3550] hover:text-[#2F8C82]"
                  }`}
                >
                  {i === 2 && !active && tab !== "Register" && (
                    <span className="absolute left-0 top-1/2 h-4 w-px -translate-y-1/2 bg-[#E3E8EE]" />
                  )}
                  {t}
                </button>
              );
            })}
          </div>

          {/* Inner card */}
          <div className="mt-3 rounded-[22px] border border-[#EDF1F5] bg-white px-6 py-7 shadow-[0_4px_20px_rgba(15,40,80,0.05)]">
            <h2 className="text-[34px] font-extrabold leading-none tracking-[-0.02em] text-[#0B1B3F]">
              Welcome back!
            </h2>
            <p className="mt-2 text-[13px] text-[#5B6B8A]">
              Sign in to your DriverXmobile account.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex flex-col"
            >
              <label
                htmlFor="login-email"
                className="text-[12px] font-semibold text-[#0B1B3F]"
              >
                Email address
              </label>
              <div className={`${INPUT_CLASS} mt-1.5`}>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@company.com"
                  className="min-w-0 flex-1 bg-transparent text-[12px] text-[#0B1B3F] outline-none placeholder:text-[#8F9BB3]"
                />
              </div>

              <label
                htmlFor="login-password"
                className="mt-4 text-[12px] font-semibold text-[#0B1B3F]"
              >
                Password
              </label>
              <div className={`${INPUT_CLASS} mt-1.5`}>
                <input
                  id="login-password"
                  type={show ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="min-w-0 flex-1 bg-transparent text-[12px] text-[#0B1B3F] outline-none placeholder:text-[#8F9BB3]"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="text-[#3A4766]"
                >
                  {show ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-[11px] text-[#2A3550]">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-[#C9D1DD] accent-[#2F8C82]"
                  />
                  Remember me for 30 days
                </label>
                <Link
                  href="#"
                  className="text-[11px] font-medium text-[#2F8C82] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="mt-5 rounded-lg bg-[#2F8C82] py-3 text-[13px] font-semibold text-white shadow-[0_8px_16px_rgba(47,140,130,0.28)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F8C82]"
              >
                Log In
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-[#E3E8EE]" />
                <span className="text-[10px] text-[#6B7790]">
                  or continue with
                </span>
                <span className="h-px flex-1 bg-[#E3E8EE]" />
              </div>

              {/* Social buttons */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="flex w-full items-center rounded-lg border border-[#E3E8EE] bg-white px-4 py-2.5 text-[12px] font-medium text-[#0B1B3F] transition-colors hover:bg-[#F7F9FB]"
                >
                  <MicrosoftLogo />
                  <span className="flex-1 text-center">
                    Continue with Microsoft
                  </span>
                  <ChevronRight
                    className="h-3.5 w-3.5 text-[#6B7790]"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  className="flex w-full items-center rounded-lg border border-[#E3E8EE] bg-white px-4 py-2.5 text-[12px] font-medium text-[#0B1B3F] transition-colors hover:bg-[#F7F9FB]"
                >
                  <GoogleLogo />
                  <span className="flex-1 text-center">
                    Continue with Google
                  </span>
                  <ChevronRight
                    className="h-3.5 w-3.5 text-[#6B7790]"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <p className="mt-6 text-center text-[12px] text-[#3A4766]">
                New to DriverXmobile?{" "}
                <Link
                  href="#"
                  className="font-semibold text-[#2F8C82] hover:underline"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 px-2 pt-8 text-[10px] text-[#5B6B8A]">
            <ul className="flex items-center">
              {FOOTER_LINKS.map((l, i) => (
                <li key={l} className="flex items-center">
                  {i !== 0 && <span className="mx-2 text-[#9AA5BA]">•</span>}
                  <Link
                    href="#"
                    className="transition-colors hover:text-[#0B1B3F]"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
            <span>© 2026 DriverXmobile Inc.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
