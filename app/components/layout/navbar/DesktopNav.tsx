"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, User } from "lucide-react";
import { CTA, DROPDOWNS, LOGIN } from "./data";
import MegaPanel from "./MegaPanel";

export default function DesktopNav() {
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setActive(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const current = DROPDOWNS.find((d) => d.key === active) ?? null;

  return (
    <div onMouseLeave={() => setActive(null)} className="hidden lg:block">
      <div className="mx-auto flex h-[72px] max-w-[1368px] items-center justify-between px-8">
        <Link href="/" aria-label="DriverX Mobile home" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="DriverX Mobile"
            className="h-11 w-auto"
          />
        </Link>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-2">
            {DROPDOWNS.map((d) => {
              const open = active === d.key;
              return (
                <li key={d.key} onMouseEnter={() => setActive(d.key)}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`mega-${d.key}`}
                    onFocus={() => setActive(d.key)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                      open
                        ? "bg-[#FCD018] text-[#10263B]"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    {d.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href={LOGIN.href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#FCD018]"
          >
            <User className="h-4 w-4" aria-hidden="true" />
            {LOGIN.label}
          </Link>
          <Link
            href={CTA.href}
            className="inline-flex items-center gap-4 rounded-full bg-[#FCD018] py-2 pl-5 pr-2 text-sm font-bold text-[#10263B] hover:opacity-90"
          >
            {CTA.label}
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
              <ChevronDown className="h-4 w-4 -rotate-90" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>

      {current ? (
        <div className="absolute inset-x-0 top-full z-40 pt-[6px]">
          <MegaPanel
            item={current}
            id={`mega-${current.key}`}
            onClose={() => setActive(null)}
          />
        </div>
      ) : null}
    </div>
  );
}
