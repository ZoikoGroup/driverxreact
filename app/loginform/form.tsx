"use client";
import { useState } from "react";

function Loginform() {

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)  => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact/api/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
const text = await res.text();
console.log(text);

let data;
try {
  data = JSON.parse(text);
} catch {
  alert("Server error ");
  return;
}

      if (res.ok) {
        alert("Message sent successfully ");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          message: "",
        });
      } else {
        alert("Error: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong ");
    }

    setLoading(false);
  };

  return (
    <div className="dark:bg-gray-900 flex flex-col lg:flex-row w-full">

      <div className="w-full lg:w-1/2 h-[300px] lg:h-auto">
        <img
          src="/images/image 232.png"
          alt="Map"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full lg:w-1/2 p-6 bg-teal-800 flex items-center px-20">
        <div className="w-full max-w-md">

          <h1 className="text-4xl font-bold text-white mb-4">
            Let’s Talk
          </h1>

          <p className="text-gray-200 text-sm mb-10">
            Fill up the form our team will get back to you within 24 Hours
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>

            <div className="flex gap-6">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-gray-200"
              />

              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-gray-200"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-gray-200"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-gray-200"
            />

            <button
              type="submit"
              disabled={loading}
              className="border border-white text-white px-8 py-3 rounded-md hover:bg-white hover:text-teal-800 transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Loginform;