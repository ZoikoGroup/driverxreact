
const API_BASE = "http://127.0.0.1:8000/jobs/api/";

export async function fetchJobs({ query = "", location = "" } = {}) {
  try {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (location) params.append("location", location);

    const res = await fetch(`${API_BASE}?${params.toString()}`);

    if (!res.ok) throw new Error("Failed to fetch jobs");

    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}