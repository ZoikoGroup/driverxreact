"use client";
import Link from "next/link";

const jobs = [
  { title: "Sales & Marketing", image: "/img/carrer/salesandmarketing.png" },
  { title: "Customer Support", image: "/img/carrer/customersupport.png" },
  { title: "Technology & Development", image: "/img/carrer/technologydevlopement.png" },
  { title: "Operations & Management", image: "/img/carrer/operationandmanagement.png" },
  { title: "Business Development", image: "/img/carrer/fieldsales.png" },
  { title: "Field Sales", image: "/img/carrer/fieldsales.png" },
];

export default function Openings() {
  return (
    <section className="max-w-6xl mx-auto py-12 px-6 text-center">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-12">
        Explore Current Openings
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <img src={job.image} alt={job.title} className="w-12 h-12 object-contain" />
            </div>

            <h3 className="font-semibold text-gray-900 mb-4">
              {job.title}
            </h3>

            <Link
              href={{
                pathname: "/applynow",
                query: { position: job.title },
              }}
              className="px-4 py-2 border border-orange-400 text-orange-500 rounded hover:bg-orange-50 transition inline-block"
            >
              Apply Now
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
