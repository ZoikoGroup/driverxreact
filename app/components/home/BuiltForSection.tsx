import React from "react";
import Image from "next/image";
import { Car, Package, Truck, Users, ChevronRight } from "lucide-react";

export default function BuiltForSection() {
  const cards = [
    {
      title: "Rideshare Drivers",
      image: "/images/home/1.png",
      icon: Car,
    },
    {
      title: "Delivery Pros",
      image: "/images/home/2.png",
      icon: Package,
    },
    {
      title: "Trucking & Logistics",
      image: "/images/home/3.png",
      icon: Truck,
    },
    {
      title: "Fleets & Businesses",
      image: "/images/home/4.png",
      icon: Users,
    },
  ] as const;

  return (
    <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 -mt-12 sm:-mt-16 lg:-mt-20 z-40">
      {/* Floating White Card Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Title Block */}
          <div className="lg:col-span-3 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-200 pb-6 lg:pb-0 lg:pr-6">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-500 mb-2">
              BUILT FOR
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A2E28] leading-tight">
              The People <br />
              Who Keep <br />
              America Moving.
            </h2>
            {/* Yellow Accent Underline */}
            <svg
              className="w-32 h-2.5 text-[#FACC15] mt-2"
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
                <a
                  key={idx}
                  href="#"
                  className="group relative h-36 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block"
                >
                  {/* Card Background Image */}
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Dark Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Bottom Bar Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2.5">
                      <IconComponent className="w-5 h-5 text-white shrink-0" />
                      <span className="text-sm font-bold tracking-tight">
                        {card.title}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/80 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
