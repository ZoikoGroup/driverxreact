"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  X,
  Menu,
  ChevronRight,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // --- Auth state ---
  const [user, setUser] = useState<{ firstName: string } | null>(null);

  useEffect(() => {
    const readUser = () => {
      try {
        const stored = localStorage.getItem("driverx_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          const displayName =
            parsed.first_name || parsed.last_name || parsed.username || "User";
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
    window.addEventListener("driverx_auth", readUser);
    return () => {
      window.removeEventListener("storage", readUser);
      window.removeEventListener("driverx_auth", readUser);
    };
  }, [pathname]);

  // --- Cart count ---
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(
          localStorage.getItem("driverx_checkout") || "[]"
        );
        if (!Array.isArray(cart)) {
          setCartCount(0);
          return;
        }
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
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("driverx_user");
    localStorage.removeItem("driverx_token");
    localStorage.removeItem("nextauth.message");
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
  };

  const handleMouseEnter = (menu: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180);
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  const menuData = {
    Solutions: [
      {
        label: "Fleet & Logistics Connectivity",
        href: "/fleet-logistics-connectivity",
      },
      { label: "Gig & Delivery Driver Plans", href: "/gig-delivery-driver-plans" },
      {
        label: "Telematics & IoT Integrations",
        href: "/telematics-iot-integrations",
      },
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
      { label: "Accessories", href: "/shop/accessories" },
    ],
    Support: [
      { label: "24/7 Driver Support", href: "/24-7-driver-support" },
      { label: "DriverX Fleet Priority Line", href: "/fleet-priority-line" },
      { label: "Coverage Maps", href: "https://mvnoc.ai/coverage-map" },
      { label: "FAQs & Self Service", href: "/faqs-self-service" },
      {
        label: "Accessibility & Language Options",
        href: "/accessibility-language-options",
      },
    ],
  };

  return (
    <>
      <nav className="w-full border-b bg-white relative z-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" onClick={closeMobile}>
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
                      {menuData[menu as keyof typeof menuData].map(
                        (item, index) => (
                          <Link
                            key={index}
                            href={item.href}
                            className="block px-6 py-4 hover:bg-[#2a6f66] border-b border-[#3c8d83] last:border-none transition"
                          >
                            {item.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
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

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition dark:border-gray-600 dark:hover:bg-gray-800"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#2f7d73] text-white text-sm font-semibold flex items-center justify-center select-none">
                      {user.firstName.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-gray-800 font-medium text-sm dark:text-gray-200">
                      {user.firstName}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

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
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-black dark:text-gray-300"
                  >
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

            {/* Mobile right: cart + hamburger */}
            <div className="md:hidden flex items-center gap-3">
              <div
                className="relative cursor-pointer"
                onClick={() => router.push("/checkout")}
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setMobileOpen(true)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Overlay ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[998] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobile}
      />

      {/* Slide-in drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm z-[999] bg-white dark:bg-gray-900 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <Link href="/" onClick={closeMobile}>
            <Image
              src="/images/Logo.svg.png"
              alt="DriverX Logo"
              width={120}
              height={32}
              className="object-contain"
            />
          </Link>
          <button
            onClick={closeMobile}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Drawer Body — scrollable */}
        <div className="flex-1 overflow-y-auto py-2">
          {Object.keys(menuData).map((menu) => (
            <div key={menu} className="border-b border-gray-100 dark:border-gray-800">
              {/* Section toggle */}
              <button
                onClick={() =>
                  setMobileExpanded(mobileExpanded === menu ? null : menu)
                }
                className="w-full flex items-center justify-between px-5 py-4 text-gray-800 dark:text-gray-200 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {menu}
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    mobileExpanded === menu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Sub-links */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  mobileExpanded === menu ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="bg-gray-50 dark:bg-gray-800/50 pb-1">
                  {menuData[menu as keyof typeof menuData].map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={closeMobile}
                      className="flex items-center gap-2 px-7 py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-[#2f7d73] dark:hover:text-[#4aada0] hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <ChevronRight className="w-3 h-3 text-[#2f7d73] flex-shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer — auth */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-5 space-y-3">
          {user ? (
            <>
              {/* User info */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-full bg-[#2f7d73] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {user.firstName.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {user.firstName}
                  </p>
                  <p className="text-xs text-gray-400">DriverX Member</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                onClick={closeMobile}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <LayoutDashboard className="w-4 h-4 text-[#2f7d73]" />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  closeMobile();
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeMobile}
                className="block w-full text-center py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={closeMobile}
                className="block w-full text-center py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}