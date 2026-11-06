import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Car, Package, Truck, Users, ChevronRight } from "lucide-react";

export default function BuiltForSection() {
  const cards = [
    {
      title: "Rideshare Drivers",
      image: "/images/home/1.png",
      icon: Car,
      href: "/gig-drivers",
    },
    {
      title: "Delivery Pros",
      image: "/images/home/2.png",
      icon: Package,
      href: "/gig-delivery-driver-plans",
    },
    {
      title: "Trucking & Logistics",
      image: "/images/home/3.png",
      icon: Truck,
      href: "/fleet-logistics-connectivity",
    },
    {
      title: "Fleets & Businesses",
      image: "/images/home/4.png",
      icon: Users,
      href: "/business-plans",
    },
  ] as const;

  return (
    <section className="relative w-full bg-[#0E2131] pt-12 pb-12 px-4 sm:px-6 lg:px-12">
      {/* Floating White Card Container with negative top margin to overlap cleanly */}
      <div className="relative max-w-[1440px] mx-auto -mt-24 sm:-mt-28 lg:-mt-32 z-40">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/80 p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Title Block */}
            <div className="lg:col-span-3 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-8">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                BUILT FOR
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A2E28] leading-tight">
                The People <br />
                Who Keep <br />
                America Moving.
              </h2>

              {/* Yellow Accent Underline */}
              <svg
                className="w-32 h-2.5 text-[#FACC15] mt-3"
                viewBox="0 0 150 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 7C40 2 110 2 148 7"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Right Cards Grid */}
            <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cards.map((card, idx) => {
                const IconComponent = card.icon;
                return (
                  <Link
                    key={idx}
                    href={card.href}
                    className="group relative h-36 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block bg-gray-900"
                  >
                    {/* Card Background Image */}
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    {/* Bottom Bar Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between text-white z-10">
                      <div className="flex items-center gap-2.5">
                        <IconComponent className="w-5 h-5 text-white shrink-0" />
                        <span className="text-sm font-bold tracking-tight">
                          {card.title}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/80 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
