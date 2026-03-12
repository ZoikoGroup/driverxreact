"use client";
import Link from "next/link";

const jobs = [
  { title: "Software Development", image: "/images/nimbus_marketing.png" },
  { title: "Customer Operations & Loyalty Lifecycle Management", image: "/images/material-symbols_factory-rounded.png" },
  { title: "IoT, SIM, & Telematics Engineering", image: "/images/nimbus_marketing (1).png" },
  { title: "Strategic Partnerships & B2B Sales", image: "/images/lsicon_management-filled.png" },
  { title: "Business Development Executives", image: "/images/lsicon_management-filled (1).png" },
  { title: "Analytics, Insights & Performance Strategy", image: "/images/lsicon_management-filled (2).png" },
];

export default function Openings() {
  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          At Zoiko Healthcare, your skills can thrive in a multitude of areas.
          We are continuously seeking bright minds across 123 functions such as
        </p>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-between hover:shadow-lg hover:shadow-yellow-500/10 transition duration-300"
            >
              {/* Icon Box */}
              <div className="w-14 h-14 bg-yellow-500 rounded-lg flex items-center justify-center mb-6">
                <img
                  src={job.image}
                  alt={job.title}
                  className="w-7 h-7 object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-300 mb-6 text-center leading-snug">
                {job.title}
              </h3>

              {/* Button */}
              <Link
                href={{
                  pathname: "/applynow",
                  query: { position: job.title },
                }}
                className="px-5 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white transition"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}