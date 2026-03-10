"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchJobs } from "../Sdata/fetchJobs";

type Job = {
  id: number;
  title: string;
  location: string;
  shortDescription: string;
  technologies?: string[];
};

export default function SearchSection() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [results, setResults] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await fetchJobs({ query, location });
        setResults(data);
      } catch (err) {
        console.error("Job fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query, location]);

  function handleSearch() {
    const params = new URLSearchParams();
    if (query.trim()) params.append("q", query.trim());
    if (location) params.append("location", location);
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <section className="py-20 px-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-300">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-300 text-center mb-10">
        Check out our Open Positions to see where you fit in
      </h2>

      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Job title or technology (React, Java, etc.)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-base sm:text-lg text-gray-900 dark:text-gray-300 bg-white dark:bg-gray-800 flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="text-base sm:text-lg text-gray-900 dark:text-gray-300 bg-white dark:bg-gray-800 flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Locations</option>
          <option value="delhi">Delhi</option>
          <option value="mumbai">Mumbai</option>
          <option value="chandigarh">Chandigarh</option>
          <option value="bangalore">Bangalore</option>
          <option value="mohali">Mohali</option>
        </select>

        <button
          onClick={handleSearch}
          className="px-6 py-3 rounded-lg bg-teal-700 text-white hover:bg-teal-600 transition"
        >
          Search Jobs
        </button>
      </div>

      {/* RESULTS */}
      <div className="max-w-4xl mx-auto mt-12">
        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading...
          </p>
        )}

        {!loading && results.length === 0 && (query || location) && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No jobs found.
          </p>
        )}

        <ul className="grid sm:grid-cols-2 gap-6">
          {results.map((job) => (
            <li
              key={job.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-orange-500/10 transition"
            >
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-300">
                {job.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 capitalize">
                {job.location}
              </p>

              <p className="text-sm text-gray-700 dark:text-gray-300 mt-3">
                {job.shortDescription}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {job.technologies?.map((tech, index) => (
                  <span
                    key={index}
                    className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}