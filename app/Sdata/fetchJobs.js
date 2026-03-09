const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchJobs({ query = "", location = "" } = {}) {
  try {

    const params = new URLSearchParams();

    if (query) params.append("q", query);
    if (location) params.append("location", location);

    const url = `${API_BASE}/?${params.toString()}`;

    console.log("Fetching:", url);

    const res = await fetch(url);

    if (!res.ok) throw new Error("Failed to fetch jobs");

    return await res.json();

  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}