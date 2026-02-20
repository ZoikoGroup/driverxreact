"use client";

import React from "react";
const participants = [
  {
    title: "Gig-Economy Apps",
    desc: "Rideshare, delivery, mobility platforms",
    img: "/images/Vector (4).png",
  },
  {
    title: "Fleet & Vehicle Rentals",
    desc: "Car, van, and scooter rentals with gig appeal",
    img: "/images/Vector (5).png",
  },
  {
    title: "Insurance & Financial Tools",
    desc: "On-demand coverage, driver banking, fuel cards",
    img: "/images/Vector (6).png",
  },
  {
    title: "Hardware Providers",
    desc: "Dashcams, routers, asset trackers, OBD devices",
    img: "/images/Vector (7).png",
  },
  {
    title: "Enterprise SaaS & Telematics",
    desc: "Fleet intelligence, route optimization, driver behavior analytics",
    img: "/images/ic_round-dashboard.png",
  },
];


 function PartnerProgram() {
  return (


    
    <section className="bg-[#f5f6f4] py-20">


        {/* ================= HERO SECTION ================= */}
<section className="bg-gradient-to-r from-[#1e6f5c] to-[#2a8a78] text-white py-6">

  <div className="max-w-6xl mx-auto text-center px-6">
    <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
      Drive Growth | Deliver Value |{" "}
      <span className="text-yellow-400 font-bold">
        Partner With DriverX
      </span>
    </h1>
  </div>

</section>


<section className="bg-[#f5f6f4] py-14">
  <div className="max-w-6xl mx-auto text-center px-6">

    <p className="text-gray-600 font-medium mb-8 max-w-3xl mx-auto">
      Join a high-performance ecosystem purpose-built for the fleet economy,
      gig drivers, delivery platforms, and intelligent vehicle systems.
    </p>

    <div className="rounded-xl overflow-hidden shadow-md">
      <img  
           src="/images/caucasian-businessman-making-a-handshake-together-2025-03-24-23-14-58-utc 1.png"
        className="w-full h-auto object-cover"
      />
    </div>

  </div>
</section>


      {/* ================= HEADER ================= */}
      <div className="max-w-6xl mx-auto text-center px-6">
        <h2 className="text-2xl font-semibold text-teal-700 mb-3">
          What Is The Partner Offer Program?
        </h2>
        <p className="text-gray-500 max-w-3xl mx-auto">
          DriverX Partner Offer is a no-cost collaboration platform where qualified
          partners can deliver exclusive benefits to thousands of active DriverX customers.
        </p>
      </div>


      {/* ================= 3 BENEFIT CARDS ================= */}
      <div className="max-w-6xl mx-auto mt-12 grid md:grid-cols-3 gap-6 px-6">

        {[
          {
            title: "Exclusive Benefits",
            desc: "Deliver exclusive benefits to thousands of active DriverX customers."
          },
          {
            title: "Co-Branded Promotions",
            desc: "Launch co-branded promotions to enhance visibility and usage."
          },
          {
            title: "Seamless Integration",
            desc: "Integrate into DriverX’s onboarding, activation, and loyalty workflows."
          }
        ].map((item, i) => (
          <div
            key={i}
            className="bg-[#f2efe9] border-l-4 border-yellow-400 rounded-lg p-6 shadow-sm"
          >
            <h3 className="font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">
              {item.desc}
            </p>
          </div>
        ))}
      </div>


      {/* ================= WHO CAN PARTICIPATE ================= */}
      <div className="max-w-6xl mx-auto mt-20 px-6 border-500 rounded-lg py-10 bg-white">

  <h3 className="text-center text-lg font-semibold mb-10">
    Who Can Participate?
  </h3>

  <div className="grid md:grid-cols-5 gap-6">

    {participants.map((item, i) => (
      <div
        key={i}
        className="bg-[#f5f6f4] border border-teal-300 rounded-lg p-5 text-center hover:shadow-md transition duration-300"
      >
        {/* Image */}
        <img
          src={item.img}
          alt={item.title}
          className="h-10 mx-auto mb-4 object-contain"
        />

        {/* Title */}
        <h4 className="font-semibold text-sm text-gray-800 mb-2">
          {item.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-gray-600">
          {item.desc}
        </p>
      </div>
    ))}

  </div>
</div>

      

      {/* ================= WHY EXTEND SECTION ================= */}
      <div className="max-w-6xl mx-auto mt-20 px-6">

        <h3 className="text-center text-lg font-semibold mb-8">
          Why Extend An Offer Via DriverX?
        </h3>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">

          <div className="grid grid-cols-2 bg-gray-100 text-sm font-semibold text-gray-700">
            <div className="p-4">Feature</div>
            <div className="p-4">Strategic Value</div>
          </div>

          {[
            ["National Coverage", "Instant access to our multi-network platform, from urban zones to last-mile routes"],
            ["Integrated eSIM Activation", "Partners can deploy global ready SIMs via API or QR onboarding"],
            ["Embedded Commerce", "Offers delivered within activation flow, plan management portals, and loyalty programs"],
            ["No Upfront Cost", "Pay-per-redemption model or mutual value exchange – tailored to you"],
            ["Cross-Promotional Reach", "Be featured across DriverX marketing, content, and user-facing materials"]
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-2 border-t text-sm">
              <div className="p-4 font-medium text-gray-700">{row[0]}</div>
              <div className="p-4 text-gray-600">{row[1]}</div>
            </div>
          ))}
        </div>
      </div>


      {/* ================= SAMPLE OFFERS ================= */}
      <div className="max-w-6xl mx-auto mt-20 px-6">

        <h3 className="text-center text-lg font-semibold mb-10">
          Sample Offer Types
        </h3>

        <div className="grid md:grid-cols-3 gap-6">

          {[
            {
              title: "Telematics App",
              desc: "Activate with DriverX and get 60 days of XYZ Pro free."
            },
            {
              title: "Vehicle Rental",
              desc: "10% off your first week when using a DriverX SIM."
            },
            {
              title: "Insurance Platform",
              desc: "Exclusive gig coverage rates for DriverX members."
            }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#f2efe9] border-l-4 border-yellow-400 rounded-lg p-6"
            >
              <h4 className="font-semibold text-gray-800 mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>


      {/* ================= HOW IT WORKS ================= */}
      <div className="max-w-6xl mx-auto mt-20 px-6 text-center">

        <h3 className="text-lg font-semibold mb-12">
          How It Works
        </h3>

        <div className="flex justify-between items-center relative">

          {[
            "Submit Your Offer",
            "Collaborate On Promotion",
            "Go Live",
            "Track Results"
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center w-1/4">
              <div className="h-10 w-10 bg-teal-600 text-white rounded-full flex items-center justify-center mb-3">
                {i + 1}
              </div>
              <p className="text-sm font-medium">{step}</p>
            </div>
          ))}

          <div className="absolute top-5 left-0 right-0 border-t border-dashed border-gray-400 -z-10"></div>
        </div>
      </div>


      {/* ================= FINAL CTA ================= */}
      <div className="mt-20 bg-[#1e6f5c] text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">

          <h3 className="text-2xl font-semibold mb-4">
            Let’s Drive Value Together
          </h3>

          <p className="text-sm opacity-90 mb-8">
            We’re actively onboarding partners across logistics, gig tech,
            mobility SaaS, and device ecosystems.
          </p>

          <div className="flex justify-center gap-4">
            <button className="bg-white text-teal-700 px-6 py-3 rounded-full font-semibold">
              Submit a Partner Offer
            </button>

            <button className="border border-white px-6 py-3 rounded-full font-semibold">
              Book a Call with Our Team
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}
export default PartnerProgram;