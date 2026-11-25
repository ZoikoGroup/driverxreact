"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import type { AuthUser } from "./useAuthUser";

type Props = { user: AuthUser; onLogout: () => void };

/** Desktop navbar: user name button with My Account / Log out dropdown. */
export default function UserMenu({ user, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const initial = user.name.trim().charAt(0).toUpperCase() || "U";
  const firstName = user.name.trim().split(/\s+/)[0] || "Account";

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        title={user.name}
        className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-white hover:text-[#FCD018]"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FCD018] text-xs font-bold text-[#10263B]">
          {initial}
        </span>
        <span className="max-w-[90px] truncate">{firstName}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-xl border border-white/10 bg-white py-1 text-[#10263B] shadow-xl"
        >
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-bold">{user.name}</p>
            {user.email && <p className="truncate text-xs text-gray-500">{user.email}</p>}
          </div>
          <Link
            role="menuitem"
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            My Account
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
