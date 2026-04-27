"use client";

import React, { useState } from "react";

const features = [
  "Fleet Managers & IT Leads",
  "Telematics & IoT OEMs",
  "Gig Platform Product Teams",
  "SaaS & Logistics Engineers",
  "Procurement & Commercial Directors",
];

const experience = [
  { title: "Instant Activation", desc: "eSIM QR codes, pSIM deployment, auto-switching between carriers" },
  { title: "Fleet Control Dashboard", desc: "Provision, suspend, or reassign lines with real-time data" },
  { title: "Usage Intelligence", desc: "See SIM performance, driver data consumption, and zone analytics" },
  { title: "API & Platform Integration", desc: "Explore our provisioning, billing, and lifecycle APIs" },
  { title: "Multi-Network Resilience", desc: "Failover testing and network prioritization logic." },
];

const goals = [
  { title: "Fleet Operators", desc: "Onboarding speed, device flexibility, centralized management" },
  { title: "Hardware Manufacturers", desc: "Embedded SIMs, logistics-ready shipping, QR activation flows" },
  { title: "Gig Platforms", desc: "User-driven onboarding, custom billing rules, uptime guarantees" },
  { title: "Enterprise SaaS", desc: "Scalable APIs, live diagnostics, telecom integration points" },
];

export default function DemoSection() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    orgType: "",
    deploymentSize: "",
    updates: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
<<<<<<< HEAD
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL+"/api/form/request-a-demo", {
=======
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL+"/api/form/request-a-demo/", {
>>>>>>> a757105104e8290c3c2b528d76ef612fc87cfd21
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({ firstName: "", lastName: "", email: "", company: "", orgType: "", deploymentSize: "", updates: false });
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="bg-gray-100 py-10 px-4 dark:bg-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-teal-700 text-white text-center py-8 rounded-md font-semibold text-lg">
          Book Your Strategic Demo
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2 mb-6">
          See how DriverX powers fleets, platforms, and connected devices at scale in just 20 minutes
        </p>

        <div className="grid md:grid-cols-2 gap-6 items-start">

          {/* LEFT SIDE */}
          <div className="space-y-5">

            {/* Info Card */}
            <div className="bg-white p-5 rounded-lg shadow dark:bg-gray-800 dark:text-white">
              <h3 className="font-semibold mb-2">See it. Deploy it. Scale it.</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                DriverX isn't just a wireless provider — it's your connectivity engine. In this live demo, we'll show you how to activate, manage, and scale SIM and eSIM lines across thousands of devices — with the telecom-grade reliability and real-time control your operations demand.
              </p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                {features.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-teal-700 flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Experience Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden dark:bg-gray-800">
              <div className="bg-gray-900 text-white px-4 py-2 text-sm font-semibold">
                What You'll Experience
              </div>
              {experience.map((item, i) => (
                <div key={i} className="grid grid-cols-2 text-sm border-t dark:border-gray-700">
                  <div className="p-3 font-medium text-gray-800 dark:text-white">{item.title}</div>
                  <div className="p-3 text-gray-600 dark:text-gray-400">{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Goals */}
            <div className="bg-white p-5 rounded-lg shadow border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="font-semibold mb-3 dark:text-white">Tailored To Your Deployment Goals</h3>
              <div className="space-y-3 text-sm">
                {goals.map((item, i) => (
                  <div key={i} className="flex gap-3 border-l-4 border-teal-500 pl-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{item.title}</p>
                      <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE — STICKY FORM */}

          <div className="sticky top-6 self-start space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-teal-200 dark:border-teal-900 text-gray-900 dark:text-white">

              <div className="bg-teal-700 px-6 py-4 text-center rounded-t-lg">
                <p className="text-white font-semibold text-sm tracking-wide">Book My Demo · See It Live</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">First name</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} type="text" placeholder="John"
                      className="w-full h-9 px-3 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 border border-gray-200 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Last name</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} type="text" placeholder="Smith"
                      className="w-full h-9 px-3 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 border border-gray-200 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Work email <span className="text-red-500">*</span></label>
                  <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="you@company.com" required
                    className="w-full h-9 px-3 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 border border-gray-200 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Company name</label>
                  <input name="company" value={form.company} onChange={handleChange} type="text" placeholder="Acme Corp"
                    className="w-full h-9 px-3 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 border border-gray-200 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition" />
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Organization type <span className="text-red-500">*</span></label>
                    <select name="orgType" value={form.orgType} onChange={handleChange} required
                      className="w-full h-9 px-3 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition appearance-none">
                      <option value="">Select type</option>
                      <option>Individual (Professional Driver / Owner-Operator)</option>
                      <option>Business (Fleet Owner / Logistics Company / Enterprise Partner)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Deployment size <span className="text-red-500">*</span></label>
                    <select name="deploymentSize" value={form.deploymentSize} onChange={handleChange} required
                      className="w-full h-9 px-3 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition appearance-none">
                      <option value="">Select range</option>
                      <option>0 – 20</option>
                      <option>21 – 100</option>
                      <option>101 – 500</option>
                      <option>500+</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex items-start gap-2.5">
                  <input type="checkbox" id="updates" name="updates" checked={form.updates} onChange={handleChange}
                    className="mt-0.5 w-4 h-4 accent-teal-600 cursor-pointer flex-shrink-0" />
                  <label htmlFor="updates" className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed cursor-pointer">
                    Send me updates about DriverX products and industry insights
                  </label>
                </div>

                {/* Error message */}
                {status === "error" && (
                  <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{errorMsg}</p>
                )}

                {/* Success message */}
                {status === "success" && (
                  <p className="text-xs text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-3 py-2 rounded-lg">
                    ✓ Demo booked! We'll be in touch shortly.
                  </p>
                )}

                <button type="submit" disabled={status === "loading"}
                  className="w-full h-10 bg-teal-700 hover:bg-teal-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-full transition-colors duration-150">
                  {status === "loading" ? "Submitting…" : "Schedule My Demo Now"}
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}