"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, ChevronDown, User, LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // --- Auth state: reads from localStorage ---
  const [user, setUser] = useState<{ firstName: string } | null>(null);

  useEffect(() => {
    const readUser = () => {
      try {
        const stored = localStorage.getItem("driverx_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          const displayName = parsed.first_name || parsed.last_name || parsed.username || "User";
          setUser({ firstName: displayName });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    readUser();
    window.addEventListener("storage", readUser);
    window.addEventListener("driverx_auth", readUser); // same-tab login trigger
    return () => {
      window.removeEventListener("storage", readUser);
      window.removeEventListener("driverx_auth", readUser);
    };
  }, [pathname]); // re-run on every route change

  // --- Cart count ---
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("driverx_checkout") || "[]");
        if (!Array.isArray(cart)) { setCartCount(0); return; }
        const count = cart.reduce(
          (total, item) => total + Number(item?.formData?.priceQty ?? 1),
          0
        );
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("driverx_user");
    localStorage.removeItem("driverx_token");
    localStorage.removeItem("nextauth.message");
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
  };

  // --- Nav dropdown handlers ---
  const handleMouseEnter = (menu: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180);
  };

  const menuData = {
    Solutions: [
      { label: "Fleet & Logistics Connectivity", href: "/fleet-logistics-connectivity" },
      { label: "Gig & Delivery Driver Plans", href: "/gig-delivery-driver-plans" },
      { label: "Telematics & IoT Integrations", href: "/telematics-iot-integrations" },
      { label: "Become a DriverX Partner", href: "/become-a-driverx-partner" },
    ],
    Plans: [
      { label: "Prepaid Plans", href: "/prepaid-plans" },
      { label: "Postpaid Plans", href: "/postpaid-plans" },
      { label: "Data-Only Plans", href: "/data-only-plans" },
      { label: "Business Plans", href: "/business-plans" },
      { label: "Top-up Plans", href: "/top-up-plans" },
    ],
    "Partner Offers": [
      { label: "Partner with DriverX", href: "/partner-with-driverx" },
      { label: "Partner Offer Program", href: "/partner-offer-program" },
      { label: "Contact Enterprise Sales", href: "/contact-enterprise-sales" },
    ],
    Shop: [
      { label: "Smartphones", href: "/product/shop" },
      
    ],    
    Support: [
      { label: "24/7 Driver Support", href: "/24-7-driver-support" },
      { label: "DriverX Fleet Priority Line", href: "/fleet-priority-line" },
      { label: "Coverage Maps", href: "https://mvnoc.ai/coverage-map" },
      { label: "FAQs & Self Service", href: "/faqs-self-service" },
      { label: "Accessibility & Language Options", href: "/accessibility-language-options" },
    ],
  };

  return (
    <nav className="w-full border-b bg-white relative z-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/">
            <Image
              src="/images/Logo.svg.png"
              alt="DriverX Logo"
              width={150}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {Object.keys(menuData).map((menu) => (
              <div
                key={menu}
                className="relative"
                onMouseEnter={() => handleMouseEnter(menu)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="text-gray-700 font-medium hover:text-black flex items-center gap-1 dark:text-gray-300">
                  {menu} <span className="text-xs">▾</span>
                </button>

                {activeMenu === menu && (
                  <div
                    className="absolute left-0 mt-3 w-64 bg-[#2f7d73] text-white rounded-lg shadow-xl overflow-hidden"
                    onMouseEnter={() => handleMouseEnter(menu)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {menuData[menu as keyof typeof menuData].map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="block px-6 py-4 hover:bg-[#2a6f66] border-b border-[#3c8d83] last:border-none transition"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4 dark:text-white">
            {/* Cart */}
            <div
              className="relative cursor-pointer"
              onClick={() => router.push("/checkout")}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>

            {/* Auth: logged in vs logged out */}
            {user ? (
              /* ── User Dropdown ── */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition dark:border-gray-600 dark:hover:bg-gray-800"
                >
                  {/* Avatar circle */}
                  <span className="w-7 h-7 rounded-full bg-[#2f7d73] text-white text-sm font-semibold flex items-center justify-center select-none">
                    {user.firstName.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-gray-800 font-medium text-sm dark:text-gray-200">
                    {user.firstName}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown panel */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#2f7d73]" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition border-t border-gray-100 dark:border-gray-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── Guest ── */
              <>
                <Link href="/login" className="text-gray-600 hover:text-black dark:text-gray-300">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition"
                >
                 Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t px-6 py-6 space-y-6">
          {Object.keys(menuData).map((menu) => (
            <div key={menu}>
              <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{menu}</p>
              <div className="space-y-2 pl-4">
                {menuData[menu as keyof typeof menuData].map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block text-gray-600 hover:text-teal-400 dark:text-gray-200"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Mobile auth section */}
          {user ? (
            <div className="space-y-3 border-t pt-4">
              <p className="text-gray-800 dark:text-gray-200 font-semibold flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#2f7d73] text-white text-sm font-semibold flex items-center justify-center">
                  {user.firstName.charAt(0).toUpperCase()}
                </span>
                {user.firstName}
              </p>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-black dark:text-gray-400"
                onClick={() => setMobileOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4 text-[#2f7d73]" />
                Dashboard
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex items-center gap-2 text-red-500 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="block text-gray-700 dark:text-gray-300">
                Login
              </Link>
              <Link
                href="/register"
                className="block bg-black text-white py-2 rounded-full text-center"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}