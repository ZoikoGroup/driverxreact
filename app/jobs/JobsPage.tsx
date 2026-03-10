"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchJobs } from "../Sdata/fetchJobs";

type Job = {
  id: number;
  title: string;
  location: string;
  shortDescription: string;
  description?: string;
  technologies?: string[];
};

export default function JobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);

        const data = await fetchJobs({
          query: query.trim(),
          location: location.trim(),
        });

        setJobs(data);
      } catch (err) {
        console.error("Jobs fetch failed:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }

    // ✅ Always fetch jobs (fix for "All Locations")
    loadJobs();

  }, [query, location]);

  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-300 text-center mb-6">
        Job Openings
      </h1>

      <p className="text-lg text-center mb-12 text-gray-700 dark:text-gray-300">
        Showing{" "}
        <span className="font-semibold text-teal-700 dark:text-teal-400">
          {query || "All Roles"}
        </span>

        {location && (
          <>
            {" "}in{" "}
            <span className="capitalize font-semibold text-teal-700 dark:text-teal-400">
              {location}
            </span>
          </>
        )}
      </p>

      {loading && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading jobs...
        </p>
      )}

      {!loading && jobs.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-400">
          <img
            src="/images/Character.png"
            alt="No jobs"
            className="w-72 mx-auto mb-4"
          />
          <p>No jobs found for your selection.</p>
        </div>
      )}

      <ul className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              {job.title}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 capitalize">
              {job.location}
            </p>

            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
              {job.shortDescription}
            </p>

            {job.description && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {job.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {job.technologies?.map((tech, index) => (
                <span
                  key={index}
                  className="text-xs bg-orange-100 dark:bg-gray-800 text-teal-800 dark:text-gray-300 px-2 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>

            <button
              onClick={() =>
                router.push(`/applynow?position=${encodeURIComponent(job.title)}`)
              }
              className="mt-5 w-full py-2 border border-teal-700 text-teal-700 dark:text-teal-400 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition"
            >
              Apply Now
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}