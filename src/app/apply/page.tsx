"use client";

import { useState } from "react";

export default function ApplyPage() {
  const [file, setFile] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert("Please upload your resume (PDF only)");
      return;
    }

    // Later: send to backend using FormData
    console.log("Submitting resume:", file.name);
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-xl px-10 py-8"
      >
        <h2 className="text-center text-2xl font-semibold mb-10">
          Application Form
        </h2>

        {/* INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              required
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Enter"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Enter"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number<span className="text-red-500">*</span>
            </label>
            <input
              required
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Enter"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Position You’re Applying For<span className="text-red-500">*</span>
            </label>
            <input
              required
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Enter"
            />
          </div>
        </div>

        {/* FILE UPLOAD */}
        <label className="block border border-dashed rounded-lg py-10 text-center cursor-pointer hover:bg-gray-50 transition">
          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={handleFileChange}
          />

          <p className="font-medium text-sm mb-1">Upload Resume</p>
          <p className="text-xs text-gray-500 mb-4">
            PDF only (max 5MB)
          </p>

          <div className="inline-block border px-4 py-2 text-xs rounded-md">
            Browse files
          </div>

          {file && (
            <p className="mt-4 text-sm text-green-600">
              Selected: {file.name}
            </p>
          )}
        </label>

        {/* SUBMIT */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="bg-teal-700 text-white px-20 py-3 rounded-md hover:bg-teal-800 transition"
          >
            Apply
          </button>
        </div>
      </form>
    </main>
  );
}
