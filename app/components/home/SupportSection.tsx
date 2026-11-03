import React from "react";
import Link from "next/link";
import {
  Search,
  Phone,
  Mail,
  LifeBuoy,
  Smartphone,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";

export default function SupportSection() {
  const supportCards = [
    {
      title: "Help Center",
      description: "Answers on plans, billing, coverage and setup.",
      icon: LifeBuoy,
      href: "/faqs-self-service",
      cardBg: "bg-white text-gray-900",
      iconBg: "bg-[#FACC15] text-[#0E2131]",
      arrowBg: "bg-[#E6F4EA] text-[#137333]",
      titleColor: "text-[#0E2131]",
      descColor: "text-gray-500",
    },
    {
      title: "Activate SIM / eSIM",
      description: "Step-by-step activation for new service.",
      icon: Smartphone,
      href: "/product/shop",
      cardBg: "bg-white text-gray-900",
      iconBg: "bg-[#FACC15] text-[#0E2131]",
      arrowBg: "bg-[#E6F4EA] text-[#137333]",
      titleColor: "text-[#0E2131]",
      descColor: "text-gray-500",
    },
    {
      title: "Billing & account",
      description: "Sign in to view bills, payments and plan details.",
      icon: CreditCard,
      href: "/dashboard",
      cardBg: "bg-white text-gray-900",
      iconBg: "bg-[#FACC15] text-[#0E2131]",
      arrowBg: "bg-[#E6F4EA] text-[#137333]",
      titleColor: "text-[#0E2131]",
      descColor: "text-gray-500",
    },
    {
      title: "Contact Support",
      description: "Email our team and we'll help you get back on the road.",
      icon: Mail,
      href: "/24-7-driver-support",
      cardBg: "bg-[#0A4138] text-white",
      iconBg: "bg-[#FACC15] text-[#0E2131]",
      arrowBg: "bg-white/10 text-white",
      titleColor: "text-white",
      descColor: "text-gray-200",
    },
  ] as const;

  return (
    <section className="relative w-full bg-[#132B40] py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Search Input, and Contact Details */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 text-[#FACC15] text-xs font-semibold tracking-wider uppercase mb-3">
              <span className="flex items-center gap-0.5">
                <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
                <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
              </span>
              <span>Support & self-service</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
              Support for the road ahead.
            </h2>

            {/* Subtitle */}
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-8 font-normal">
              Find what you need, from activation questions to account help.
            </p>

            {/* Search Input Bar */}
            <div className="mb-3">
              <div className="relative flex items-center bg-white rounded-full p-1.5 shadow-xl">
                <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
                <input
                  type="text"
                  placeholder='Search questions, like "eSIM"'
                  className="w-full bg-transparent border-0 px-3 py-2 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                <Link
                  href="/faqs-self-service"
                  className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#e3b810] text-[#0E2131] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm shrink-0"
                >
                  <span>Search</span>
                  <div className="w-5 h-5 rounded-full bg-white text-[#0E2131] flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </Link>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mb-8 font-medium">
              Searches the questions on this page.
            </p>

            {/* Contact Details */}
            <div className="space-y-3.5 pt-2">
              <a
                href="tel:+18003990087"
                className="flex items-center gap-3 text-xs sm:text-sm font-bold text-white hover:text-[#FACC15] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#FACC15] shrink-0" />
                <span>+1 (800) 399-0087</span>
              </a>

              <a
                href="mailto:info@driverxmobile.com"
                className="flex items-center gap-3 text-xs sm:text-sm font-bold text-white hover:text-[#FACC15] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#FACC15] shrink-0" />
                <span>info@driverxmobile.com</span>
              </a>
            </div>
          </div>

          {/* Right Column: 2x2 Support Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {supportCards.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <Link
                  key={idx}
                  href={card.href}
                  className={`group relative rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col justify-between min-h-[190px] transition-all duration-300 hover:-translate-y-1 block ${card.cardBg}`}
                >
                  {/* Top Bar with Icon and Arrow Button */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`p-3 rounded-xl flex items-center justify-center ${card.iconBg}`}
                    >
                      <IconComponent className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${card.arrowBg}`}
                    >
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3
                      className={`font-black text-lg sm:text-xl mb-1.5 tracking-tight ${card.titleColor}`}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed font-normal ${card.descColor}`}
                    >
                      {card.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
