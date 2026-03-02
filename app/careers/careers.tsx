"use client";

import React from "react";

const features = [
  {
    title: "Culture of Innovation",
    description:
      "Thrive in an environment that fosters curiosity, embraces bold ideas, and invests in advanced research and development.",
    icon: "/images/streamline_ai-technology-spark-solid.png",
  },
  {
    title: "Growth Without Limits",
    description:
      "From internal mobility to certification sponsorship, mentorship, and hands-on learning – your growth here is never an afterthought.",
    icon: "/images/growth.png",
  },
  {
    title: "Impact, Not Hierarchy",
    description:
      "At DriverX, your contributions matter. You’ll work on projects that directly improve the lives and livelihoods of drivers and delivery professionals across the country.",
    icon: "/images/impact.png",
  },
  {
    title: "Global Backing, Agile Execution",
    description:
      "As part of the Zoiko Group Inc. ecosystem, we combine Fortune-grade infrastructure with the energy and agility of a startup.",
    icon: "/images/global.png",
  },
];

export default function CareersSection() {
  return (
    <section className="w-full">
      {/* HERO SECTION */}
      <div className="bg-[#2F6F64] text-white px-6 md:px-16 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div>
            <span className="inline-block bg-yellow-400 text-black font-semibold px-4 py-1 rounded-md mb-6">
              Careers
            </span>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
              Drive the Movement | Build What Moves the World
            </h1>

            <p className="text-gray-200 leading-relaxed text-base">
              At DriverX Mobile, we’re more than a telecom company – we’re an
              innovation engine built for the people who keep the world moving.
              From gig workers to fleet operators, our mission is to power
              productivity on the road – and it takes bold thinkers, builders,
              and doers to make that happen.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full">
            <img
          src="/images/Frame 1707483077.png"
              alt="Careers at DriverX"
              className="shadow-lg w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* WHY WORK WITH US SECTION */}
      <div className="bg-gray-100 px-6 md:px-16 py-16">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700">
            Why Work With Us
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="mb-4">
  <img
    src={item.icon}
    alt={item.title}
    className="w-10 h-10 object-contain"
  />
</div>

              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}