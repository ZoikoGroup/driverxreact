"use client";

import { CheckCircle, Handshake, Cpu, Medal } from "lucide-react";

export default function MissionValues() {
  const coreValues = [
    {
      title: "Driver-First Innovation",
      desc: "We build for drivers. Every plan, tool, and integration is created to solve real world problems for those behind the wheel.",
    },
    {
      title: "Integrity in Motion",
      desc: "Transparency and accountability define how we operate — with every customer, partner, and stakeholder.",
    },
    {
      title: "Uncompromising Connectivity",
      desc: "We believe reliable coverage should be universal. That's why we harness Tier-1 networks and cutting edge infrastructure.",
    },
    {
      title: "Intelligent Scalability",
      desc: "From single SIMs to enterprise grade fleet deployments, DriverX Mobile offers flexible solutions.",
    },
    {
      title: "Community & Belonging",
      desc: "We champion the often overlooked heroes of the economy — delivery workers, rideshare drivers, gig entrepreneurs.",
    },
    {
      title: "Privacy & Data Ethics",
      desc: "Your data is protected. Our systems are built with compliance and privacy as the foundation.",
    },
  ];

  return (
    <section className="bg-gray-100 dark:bg-gray-950">

      {/* Top Title */}
      <div className="bg-teal-700 text-white text-center py-3 font-semibold text-lg">
        Our Mission & Values
      </div>

      {/* Mission + Vision FULL WIDTH */}
      <div className="grid md:grid-cols-2 gap-10 py-16 px-6 md:px-16">

        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
            Our Mission
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mt-3">
            To deliver world-class mobile connectivity, intelligent digital
            solutions, and adaptive technologies that empower America’s
            mobile workforce — from independent drivers to enterprise fleets
            — to operate more efficiently, stay connected, and thrive on the
            road.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
            Our Vision
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mt-3">
            To redefine the mobile experience for the transportation and gig
            economy by building the most resilient, responsive, and
            intelligent connectivity platform — empowering every driver,
            everywhere.
          </p>
        </div>

      </div>

      {/* Centered Content */}
      <div className="max-w-6xl mx-auto px-6">

        {/* Main Image */}
        <div className="mt-4">
          <img
            src="/images/portrait-of-caucasian-delivery-man-delivering-pack-2025-03-26-12-22-14-utc 1.png"
            alt="Team"
            className="w-full rounded-lg"
          />
        </div>

        {/* Core Values + Side Image */}
        <div className="grid md:grid-cols-2 gap-12 mt-16">

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-6">
              Our Core Values
            </h3>

            <div className="space-y-6">
              {coreValues.map((value, index) => (
                <div key={index} className="flex gap-4">

                  <CheckCircle className="text-teal-600 mt-1" size={22} />

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-200">
                      {value.title}
                    </h4>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {value.desc}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div>
            <img
              src="/images/taking-applicant-vacancy 1.png"
              alt="Driver"
              className="rounded-xl w-full"
            />
          </div>

        </div>

        {/* Corporate Governance */}
        <div className="mt-20 text-center">

          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-8">
            Corporate Governance Our team
          </h3>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="border rounded-lg p-6 bg-white dark:bg-gray-900 hover:shadow-md transition">
              <Handshake className="mx-auto text-teal-700 mb-3" size={32} />
              <p className="font-medium text-gray-800 dark:text-gray-300">
                Purposeful Partnerships
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-white dark:bg-gray-900 hover:shadow-md transition">
              <Cpu className="mx-auto text-teal-700 mb-3" size={32} />
              <p className="font-medium text-gray-800 dark:text-gray-300">
                Inclusive Access
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-white dark:bg-gray-900 hover:shadow-md transition">
              <Medal className="mx-auto text-teal-700 mb-3" size={32} />
              <p className="font-medium text-gray-800 dark:text-gray-300">
                Sustainable Innovation
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}