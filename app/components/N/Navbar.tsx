"use client";

import Link from "next/link";
import Image from "next/image"; // import Image
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/">
            <Image
              src="/images/Logo.svg.png" // make sure this path is correct and inside /public folder
              alt="DriverX Logo"
              width={150} // adjust width
              height={40} // adjust height
              className="object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/solutions" className="text-gray-600 hover:text-gray-900">
             Solutions
            </Link>
            <Link href="/plans" className="text-gray-600 hover:text-gray-900">
             plans
            
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
             Partner offers
            </Link>
               <Link href="/shop" className="text-gray-600 hover:text-gray-900">
           Shop
            </Link>
               <Link href="/Support" className="text-gray-600 hover:text-gray-900">
             Support
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-4">
          <Link href="/plans" className="block text-gray-700">
            Plans
          </Link>
          <Link href="/support" className="block text-gray-700">
            Support
          </Link>
          <Link href="/about" className="block text-gray-700">
            About
          </Link>
          <Link href="/login" className="block text-gray-700">
            Login
          </Link>
          <Link
            href="/signup"
            className="block rounded-lg bg-black px-4 py-2 text-white text-center"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}