import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Car, Package, Truck, Users, Check, ArrowUpRight } from "lucide-react";

export default function DriveTypeSection() {
  const cards = [
    {
      title: "Rideshare drivers",
      image: "/images/home/1.png",
      icon: Car,
      iconBg: "bg-[#FACC15] text-[#0E2131]",
      cardBg: "bg-white text-gray-800",
      description:
        "Keep navigation, rider messages and calls running between trips.",
      bulletColor: "text-[#0E2131]",
      textColor: "text-gray-600",
      headingColor: "text-gray-900",
      ctaText: "Explore driver plans",
      ctaColor: "text-[#0E2131] hover:underline",
      href: "/gig-delivery-driver-plans",
      bullets: [
        "Plans for full-time and part-time driving",
        "Check coverage on your usual routes",
        "Bring your phone or choose eSIM",
      ],
    },
    {
      title: "Delivery professionals",
      image: "/images/home/2.png",
      icon: Package,
      iconBg: "bg-white text-[#0E2131]",
      cardBg: "bg-[#FACC15] text-[#0E2131]",
      description:
        "Stay reachable for order updates, customer contact and delivery photos.",
      bulletColor: "text-[#0E2131]",
      textColor: "text-[#0E2131]/90",
      headingColor: "text-white bg-[#0E2131]",
      ctaText: "Explore delivery plans",
      ctaColor: "text-[#0E2131] font-bold hover:underline",
      href: "/gig-delivery-driver-plans",
      bullets: [
        "Prepaid and postpaid options",
        "Top up when a busy week needs more",
        "Clear terms before you buy",
      ],
    },
    {
      title: "Truckers & logistics",
      image: "/images/home/3.png",
      icon: Truck,
      iconBg: "bg-[#FACC15] text-[#0E2131]",
      cardBg: "bg-white text-gray-800",
      description:
        "Connectivity for long hauls, dispatch check-ins and in-cab devices.",
      bulletColor: "text-[#0E2131]",
      textColor: "text-gray-600",
      headingColor: "text-gray-900",
      ctaText: "Explore logistics",
      ctaColor: "text-[#0E2131] hover:underline",
      href: "/fleet-logistics-connectivity",
      bullets: [
        "Voice and data-only lines",
        "Options for tablets and hotspots",
        "Telematics and IoT connectivity",
      ],
    },
    {
      title: "Fleets & businesses",
      image: "/images/home/4.png",
      icon: Users,
      iconBg: "bg-[#FACC15] text-[#0E2131]",
      cardBg: "bg-white text-gray-800",
      description:
        "Manage lines and devices for delivery teams, field crews and fleets.",
      bulletColor: "text-[#0E2131]",
      textColor: "text-gray-600",
      headingColor: "text-gray-900",
      ctaText: "Explore business plans",
      ctaColor: "text-[#0E2131] hover:underline",
      href: "/business-plans",
      bullets: [
        "Business plans for your team",
        "Help planning deployments",
        "A direct line to enterprise sales",
      ],
    },
  ] as const;

  return (
    <section className="relative w-full bg-[#0E2131] py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-[#FACC15] text-xs font-semibold tracking-wider uppercase mb-3">
            <span className="flex items-center gap-0.5">
              <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
              <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
            </span>
            <span>Choose your drive type</span>
            <span className="flex items-center gap-0.5">
              <span className="w-0.5 h-3 bg-[#FACC15] rounded-xs" />
              <span className="w-0.5 h-2 bg-[#FACC15] rounded-xs" />
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Built for the way you work.
          </h2>

          <p className="text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed font-normal">
            Start with your job, not with telecom jargon. Pick the work you do
            and we&apos;ll point you to the plans that fit it.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 ${card.cardBg}`}
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Title Bar with Icon */}
                  <div
                    className={`p-4 flex items-center justify-between ${card.headingColor}`}
                  >
                    <h3 className="font-bold text-base sm:text-lg tracking-tight">
                      {card.title}
                    </h3>
                    <div
                      className={`p-2 rounded-lg flex items-center justify-center ${card.iconBg}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <p
                      className={`text-xs sm:text-sm leading-relaxed mb-6 ${card.textColor}`}
                    >
                      {card.description}
                    </p>

                    {/* Bullet Points */}
                    <ul className="space-y-3 mb-8">
                      {card.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm"
                        >
                          <Check
                            className={`w-4 h-4 shrink-0 mt-0.5 ${card.bulletColor}`}
                          />
                          <span className={`font-medium ${card.textColor}`}>
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer CTA Link */}
                <div className="p-5 pt-0">
                  <Link
                    href={card.href}
                    className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-colors ${card.ctaColor}`}
                  >
                    <span>{card.ctaText}</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
