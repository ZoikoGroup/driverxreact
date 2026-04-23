// app/components/request-form/form.tsx
"use client";

import { useState } from "react";

/**
 * Props for the reusable form.
 * `requestType` defaults to "support" if you don’t pass anything.
 */
type RequestFormProps = {
  requestType?: string;
};

/**
 * The component was called **Loginform** before – we rename it to
 * `RequestForm` because it now sends a *request* (support, account, …).
 */
export default function RequestForm({ requestType = "support" }: RequestFormProps) {
  /* -------------------------------------------------------------
   * 1️⃣ Local form state – we keep the hidden field in the same object
   * ------------------------------------------------------------- */
  const [formData, setFormData] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    message: string;
    request_type: string; // ← hidden field
  }>({
    first_name: "",
    last_name: "",
    email: "",
    message: "",
    request_type: requestType, // initialise with the prop value
  });

  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------------------
   * 2️⃣ Generic change handler – works for input & textarea
   * ------------------------------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* -------------------------------------------------------------
   * 3️⃣ Submit – send everything (including request_type) to DriverX
   * ------------------------------------------------------------- */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "https://api.driverxmobile.com/api/form/request-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // NOTE: the hidden field is already part of `formData`
          body: JSON.stringify(formData),
        }
      );

      const text = await res.text();
      console.log("Raw response:", text);

      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        alert("Server returned non‑JSON data.");
        return;
      }

      if (res.ok) {
        alert("Message sent successfully!");
        // Reset the form *but keep the request_type* unchanged
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          message: "",
          request_type: requestType,
        });
      } else {
        // Show the error object we just parsed
        alert("Error: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong – check the console.");
    }

    setLoading(false);
  };

  /* -------------------------------------------------------------
   * 4️⃣ UI – everything unchanged except for the hidden <input>
   * ------------------------------------------------------------- */
  return (
    <div className="dark:bg-gray-900 flex flex-col lg:flex-row w-full">
      {/* ----------------------------------------------------------------- */}
      {/* Left side – image (unchanged) */}
      {/* ----------------------------------------------------------------- */}
      <div className="w-full lg:w-1/2 h-[500px] lg:h-auto">
        <img
          src="/images/image 232.png"
          alt="Map"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Right side – form */}
      {/* ----------------------------------------------------------------- */}
<div className="w-full lg:w-1/2 p-6 md:p-8 bg-teal-800 flex items-center px-4 md:px-20">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">Let’s Talk</h1>

          <p className="text-gray-200 text-sm mb-10">
            Fill up the form – our team will get back to you within 24 hours
          </p>

          <form className="space-y-6 md:space-y-10" onSubmit={handleSubmit}>
            {/* ---- Hidden field – will be submitted automatically ---- */}
            <input
              type="hidden"
              name="request_type"
              value={formData.request_type}
            />

      <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 text-sm md:text-base"
                required
              />

              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 text-sm md:text-base"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-200 text-sm md:text-base"
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-200 text-sm md:text-base"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full border border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-teal-800 transition"
            >
              {loading ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
