"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Spacer so page content starts below the fixed header */}
      <div className="h-[72px]" aria-hidden="true" />

      <header className="fixed inset-x-0 top-0 z-50 bg-[#0B1F2D] font-sans text-white">
        <DesktopNav />

        <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:hidden">
          <Link href="/" aria-label="DriverX Mobile home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="DriverX Mobile"
              className="h-10 w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? <MobileNav onNavigate={() => setOpen(false)} /> : null}
      </header>
    </>
  );
}
