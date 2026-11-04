"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { CTA, DROPDOWNS, LOGIN } from "./data";

type Props = { onNavigate: () => void };

export default function MobileNav({ onNavigate }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div
      id="mobile-nav"
      className="max-h-[calc(100vh-72px)] overflow-y-auto bg-[#0B1F2D] px-4 pb-6 pt-2 text-white lg:hidden"
    >
      <ul>
        {DROPDOWNS.map((d) => {
          const isOpen = open === d.key;
          return (
            <li key={d.key} className="border-b border-white/10">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : d.key)}
                className="flex w-full items-center justify-between py-3.5 text-left text-base font-semibold"
              >
                {d.label}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {isOpen ? (
                <ul className="pb-3">
                  {d.groups
                    .flatMap((g) => g.links)
                    .map((l) => (
                      <li key={`${d.key}-${l.title}`}>
                        <Link
                          href={l.href}
                          onClick={onNavigate}
                          className="block py-2 text-sm text-white/80"
                        >
                          {l.title}
                        </Link>
                      </li>
                    ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
      <div className="mt-5 flex items-center gap-5">
        <Link
          href={LOGIN.href}
          onClick={onNavigate}
          className="text-sm font-semibold"
        >
          {LOGIN.label}
        </Link>
        <Link
          href={CTA.href}
          onClick={onNavigate}
          className="rounded-full bg-[#FCD018] px-5 py-2.5 text-sm font-bold text-[#10263B]"
        >
          {CTA.label}
        </Link>
      </div>
    </div>
  );
}
