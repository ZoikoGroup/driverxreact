"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
export default function Navbar() {
  const router = useRouter();
    const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {

    const updateCartCount = () => {

      try {

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

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
  const handleMouseEnter = (menu: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180); // smooth delay so user can move cursor
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
      { label: "Smartphones", href: "/shop/smartphones" },
      { label: "Accessories", href: "/shop/accessories" },
    ],
    Support: [
      { label: "24/7 Driver Support", href: "/support/driver-support" },
      { label: "DriverX Fleet Priority Line", href: "/fleet-priority-line" },
      { label: "Coverage Maps", href: "/support/coverage" },
      { label: "FAQs & Self Service", href: "/faqs-self-service" },
      { label: "Accessibility & Language Options", href: "/accessibility-language-options" },
    ],
  };

  return (
    <nav className="w-full border-b bg-white relative z-50  dark:bg-gray-900">
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
                <button className="text-gray-700 font-medium hover:text-black flex items-center gap-1  dark:text-gray-300">
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

            <Link href="/login" className="text-gray-600 hover:text-black dark:text-gray-300">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Button */}
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
        <div className="md:hidden bg-white border-t px-6 py-6 space-y-6">
          {Object.keys(menuData).map((menu) => (
            <div key={menu}>
              <p className="font-semibold text-gray-800 mb-2">{menu}</p>
              <div className="space-y-2 pl-4">
                {menuData[menu as keyof typeof menuData].map(
                  (item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="block text-gray-600 hover:text-black"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}

          <Link href="/login" className="block text-gray-700">
            Login
          </Link>

          <Link
            href="/signup"
            className="block bg-black text-white py-2 rounded-full text-center"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}