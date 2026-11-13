import Image from "next/image";
import Link from "next/link";
import type { ReactNode, SVGProps } from "react";

/* ------------------------------------------------------------------ */
/* Shared class names for auth forms                                   */
/* ------------------------------------------------------------------ */

export const authLabel =
  "block text-[13px] font-semibold text-[#1f2d3d] dark:text-gray-200 mb-1.5";

export const authInput =
  "w-full h-11 px-3.5 rounded-lg border border-[#d9e1e7] bg-white text-sm text-[#1f2d3d] placeholder:text-[#a3afba] outline-none transition focus:border-[#2f8a80] focus:ring-2 focus:ring-[#2f8a80]/20 dark:bg-gray-900 dark:border-gray-700 dark:text-white";

export const authInputError =
  "w-full h-11 px-3.5 rounded-lg border border-red-400 bg-red-50 text-sm text-[#1f2d3d] placeholder:text-red-300 outline-none transition focus:ring-2 focus:ring-red-200";

export const authPrimaryBtn =
  "w-full h-11 rounded-lg bg-[#2f8a80] text-white text-[15px] font-semibold shadow-[0_8px_18px_rgba(47,138,128,0.28)] transition hover:bg-[#277469] disabled:opacity-60 disabled:cursor-not-allowed";

export const authSocialBtn =
  "w-full h-12 flex items-center gap-3 px-4 rounded-lg border border-[#d9e1e7] bg-white text-sm font-medium text-[#1f2d3d] transition hover:border-[#2f8a80] hover:bg-[#f6faf9] dark:bg-gray-900 dark:border-gray-700 dark:text-white";

export const authLink = "font-semibold text-[#2f8a80] hover:text-[#1f6b62]";

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

type IconProps = SVGProps<SVGSVGElement>;
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ChartIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 20v-6M12 20V9M18 20V4" />
  </svg>
);
const CalendarClockIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M20 11V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5M16 2v4M8 2v4M4 10h16" />
    <circle cx="17" cy="17" r="4" />
    <path d="M17 15.5V17l1 1" />
  </svg>
);
const ShieldIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const UsersIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const GlobeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const StarIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
  </svg>
);
export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={2} {...p}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);
export const EyeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const EyeOffIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.4 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19M6.6 6.6C3.9 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6M3 3l18 18M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);
export const GoogleIcon = (p: IconProps) => (
  <svg viewBox="0 0 48 48" aria-hidden {...p}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.73 1.22 9.23 3.6l6.85-6.85C35.9 2.43 30.36 0 24 0 14.64 0 6.4 5.48 2.6 13.44l7.98 6.2C12.5 13.1 17.8 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24c0-1.6-.14-3.13-.4-4.6H24v9.2h12.7c-.55 2.96-2.2 5.46-4.7 7.13l7.28 5.67C43.96 37.2 46.5 31.1 46.5 24z" />
    <path fill="#FBBC05" d="M10.58 28.36A14.5 14.5 0 019.5 24c0-1.52.26-2.98.72-4.36l-7.98-6.2A23.94 23.94 0 000 24c0 3.9.94 7.58 2.6 10.56l7.98-6.2z" />
    <path fill="#34A853" d="M24 48c6.36 0 11.9-2.1 15.87-5.7l-7.28-5.67c-2.02 1.36-4.6 2.17-8.6 2.17-6.2 0-11.5-3.6-13.42-8.86l-7.98 6.2C6.4 42.52 14.64 48 24 48z" />
  </svg>
);
export const FacebookIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="#1877F2" aria-hidden {...p}>
    <path d="M22 12.073C22 6.503 17.523 2 12 2S2 6.503 2 12.073c0 5.022 3.657 9.184 8.438 9.928v-7.026H7.898v-2.902h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.902h-2.33V22c4.78-.744 8.437-4.906 8.437-9.927z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

export function PasswordToggle({
  shown,
  onToggle,
}: {
  shown: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? "Hide password" : "Show password"}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5b6b79] hover:text-[#1f2d3d] dark:text-gray-400"
    >
      {shown ? <EyeOffIcon className="w-[18px] h-[18px]" /> : <EyeIcon className="w-[18px] h-[18px]" />}
    </button>
  );
}

export function AuthDivider({ label = "or continue with" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-[#e3e8ec] dark:bg-gray-700" />
      <span className="text-xs text-[#8a97a3]">{label}</span>
      <div className="flex-1 h-px bg-[#e3e8ec] dark:bg-gray-700" />
    </div>
  );
}

export function AuthAlert({ type, children }: { type: "error" | "success"; children: ReactNode }) {
  return (
    <p
      role={type === "error" ? "alert" : "status"}
      className={`rounded-lg px-3 py-2 text-sm ${
        type === "error"
          ? "bg-red-50 text-red-600 border border-red-200"
          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
      }`}
    >
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

const FEATURES = [
  { icon: ChartIcon, title: "Earn more", text: "Competitive fares and transparent pay." },
  { icon: CalendarClockIcon, title: "Total flexibility", text: "Work when you want, where you want." },
  { icon: ShieldIcon, title: "Drive with confidence", text: "Verified riders and in-app safety tools." },
  { icon: UsersIcon, title: "24/7 driver support", text: "Real people, real help." },
];

const STATS = [
  { icon: UsersIcon, value: "1M+", label: "Drivers worldwide" },
  { icon: GlobeIcon, value: "500+", label: "Cities and growing" },
  { icon: StarIcon, value: "4.8/5", label: "Driver satisfaction" },
];

const TABS = [
  { id: "login", label: "Login", href: "/login" },
  { id: "register", label: "Register", href: "/register" },
  { id: "reset", label: "Reset Password", href: "/forgot-password" },
] as const;

const FOOTER_LINKS = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-of-service-legal" },
  { label: "Accessibility", href: "/accessibility-language-options" },
  { label: "Help", href: "/faqs-self-service" },
];

export type AuthTab = (typeof TABS)[number]["id"];

export default function AuthShell({
  activeTab,
  children,
}: {
  activeTab: AuthTab;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-[#f2f6f9] lg:grid-cols-[52%_48%] dark:bg-gray-950">
      {/* ---------------- LEFT: hero panel ---------------- */}
      <aside className="relative hidden lg:flex flex-col overflow-hidden px-12 xl:px-14 py-10 text-white">
        <Image
          src="/images/login/login.webp"
          alt="Smiling driver leaning on his car in front of a city skyline at sunset"
          fill
          priority
          sizes="52vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,22,38,0.35)_0%,rgba(10,22,38,0.12)_55%,rgba(10,22,38,0)_100%),linear-gradient(0deg,rgba(10,22,38,0.55)_0%,rgba(10,22,38,0)_45%)]"
        />

        <div className="relative flex flex-1 flex-col">
          <Link
            href="/"
            className="inline-flex w-fit items-center rounded-2xl bg-white px-4 py-2.5 shadow-lg"
          >
            <Image src="/images/Logo.svg.png" alt="DriverX Mobile" width={120} height={34} priority />
          </Link>

          <div className="mt-auto">
            <h1 className="text-[44px] xl:text-[52px] font-extrabold leading-[1.02] tracking-tight [text-shadow:0_2px_18px_rgba(255,255,255,0.35)]">
              <span className="block text-[#10294a]">Your drive</span>
              <span className="block text-[#2f8f4e]">Greater opportunities</span>
            </h1>
            <p className="mt-4 max-w-[430px] text-[15px] leading-6 text-white/95 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
              The all-in-one platform for drivers. Flexible work, fair earnings.
              Real support. On the road and in your corner.
            </p>

            <ul className="mt-8 grid max-w-[440px] grid-cols-2 gap-3.5">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="flex items-start gap-3 rounded-2xl bg-white/95 p-3.5 text-[#1f2d3d] shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e3f1ee] text-[#2f8a80]">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span>
                    <span className="block text-[13px] font-bold leading-4">{title}</span>
                    <span className="mt-1 block text-[11px] leading-[14px] text-[#5b6b79]">{text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-10 flex w-fit items-center divide-x divide-white/25 rounded-2xl bg-[#0c1a2b]/55 px-2 py-3 backdrop-blur-md">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3 px-4">
                  <Icon className="h-5 w-5 shrink-0 text-white" />
                  <div>
                    <dt className="sr-only">{label}</dt>
                    <dd className="text-[16px] font-extrabold leading-5">{value}</dd>
                    <dd className="text-[11px] leading-4 text-white/80">{label}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </aside>

      {/* ---------------- RIGHT: form card ---------------- */}
      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-[460px] rounded-[22px] bg-white px-4 pt-3 pb-5 shadow-[0_20px_60px_rgba(16,41,74,0.08)] sm:px-5 dark:bg-gray-900">
          {/* Mobile logo */}
          <Link href="/" className="mb-3 mt-2 flex justify-center lg:hidden">
            <Image src="/images/Logo.svg.png" alt="DriverX Mobile" width={120} height={34} />
          </Link>

          {/* Tabs */}
          <nav aria-label="Account" className="grid grid-cols-3 text-center">
            {TABS.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={`border-b-2 px-2 py-2.5 text-[13px] font-medium transition ${
                    active
                      ? "border-[#2f8a80] text-[#2f8a80]"
                      : "border-transparent text-[#1f2d3d] hover:text-[#2f8a80] dark:text-gray-300"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          {/* Inner card */}
          <div className="mt-1 rounded-2xl border border-[#edf1f4] px-5 py-7 sm:px-6 dark:border-gray-800">
            {children}
          </div>

          {/* Footer */}
          <footer className="mt-12 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-[#6b7a87] dark:text-gray-400">
            {FOOTER_LINKS.map((l) => (
              <span key={l.href} className="flex items-center gap-2">
                <Link href={l.href} className="hover:text-[#2f8a80]">
                  {l.label}
                </Link>
                <span aria-hidden>•</span>
              </span>
            ))}
            <span>© 2026 DriverXmobile Inc.</span>
          </footer>
        </div>
      </section>
    </div>
  );
}

/** Heading block used at the top of each auth form. */
export function AuthHeading({ title, subtitle }: { title: string; subtitle: ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-[32px] font-extrabold leading-tight tracking-tight text-[#10294a] dark:text-white">
        {title}
      </h2>
      <p className="mt-1.5 text-sm text-[#6b7a87] dark:text-gray-400">{subtitle}</p>
    </div>
  );
}
