"use client";

import React from "react";

const leaders = [
  {
    name: "Lennox McLeod",
    role: "Founder & Executive Chairman",
    image: "/images/lennox.jpg",
    description:
      "A visionary leader with over 30 years of executive experience across global business strategy, telecommunications, fintech, and enterprise governance. Lennox holds an MSc in Accounting, an LLB (Hons), and two international professional accountancy qualifications. As Founder and Executive Chairman of DriverX Mobile and the wider Zoiko Communications Group, he brings unmatched foresight, financial rigor, and purpose-driven innovation.",
  },
  {
    name: "Sophia Jennings",
    role: "Chief Executive Officer",
    image: "/images/Group 1597883024 (1).png",
    description:
      "A telecom industry veteran with over 20 years of experience in wireless network expansion, digital platform growth, and customer innovation. Sophia previously led enterprise strategy at a leading Tier-1 carrier and brings expertise in scaling purpose-built platforms for the mobility ecosystem.",
  },
  {
    name: "Dr. Anil Suresh",
    role: "Chief Technology Officer (CTO)",
    image: "/images/Group 1597883024 (2).png",
    description:
      "With a PhD in Computer Engineering and more than 25 years of experience in IoT, telematics, and cloud-native infrastructure, Dr. Suresh leads DriverX’s engineering and product innovation including the SIM provisioning engine and mobility integration APIs.",
  },
  {
    name: "Junior Taylor",
    role: "Chief Commercial Officer (CCO)",
    image: "/images/Group 1597883027.png",
    description:
      "A commercially astute leader with a strong track record in enterprise sales, telecom growth, and MVNO market development across the US and Europe. Junior drives partnerships with OEMs, logistics platforms, and fintech providers.",
  },
  {
    name: "Luis Martinez",
    role: "Chief Customer Experience Officer (CCXO)",
    image: "/images/Group 1597883024 (3).png",
    description:
      "An award-winning customer experience executive with nearly two decades in CX design, bilingual support, and service operations across telecom and digital finance ensuring every DriverX customer touchpoint reflects driver-first service.",
  },
];

export default function LeadershipSection() {
  return (
    <section className="w-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-300">

      {/* HEADER */}
      <div className="bg-teal-700 text-white text-center py-4 text-xl font-semibold">
        Leadership Team
      </div>

      {/* HERO IMAGE */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <img
          src="/images/Frame 1707483085.png"
          alt="Leadership Team"
          className="w-full rounded-lg object-cover"
        />
      </div>

      {/* INTRO TEXT */}
      <div className="max-w-5xl mx-auto text-center px-6 mb-14 text-sm md:text-base leading-relaxed">
        At DriverX Mobile, leadership is not just about operational excellence –
        it’s about purpose, people, and progress. Our executive team brings deep
        expertise across telecommunications, technology, logistics, customer
        operations, and commercial strategy. Together, we’re building a
        next-generation mobile platform that empowers the people who move
        America.
      </div>

      {/* TITLE */}
      <h2 className="text-center text-2xl md:text-3xl font-bold text-teal-700 mb-16">
        EXECUTIVE LEADERSHIP
      </h2>

      {/* LEADERS */}
      <div className="max-w-6xl mx-auto px-6 space-y-16 pb-16">
        {leaders.map((leader, index) => (
          <div
            key={leader.name}
            className={`grid md:grid-cols-2 gap-10 items-center ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* IMAGE */}
            <div className="flex justify-center">
              <img
                src={leader.image}
                alt={leader.name}
                className="w-56 h-56 object-cover rounded-md shadow-md"
              />
            </div>

            {/* TEXT */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                {leader.name}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {leader.role}
              </p>

              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {leader.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}