"use client";

import React, { useState } from "react";

const SimActivationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    numberOption: "new",
    imei: "",
    simSerial: "",
    agree: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-green-200 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
          SIM Activation Form
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg space-y-8"
        >
          <div className="grid md:grid-cols-2 gap-8">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your Full Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email used for eSIM QR and activation info"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            {/* Number Option */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">
                Number Option
              </label>
              <select
                name="numberOption"
                value={formData.numberOption}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
              >
                <option value="new">I want new DriverX mobile number</option>
                <option value="port">Port my existing number</option>
              </select>
            </div>

            {/* IMEI */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                IMEI Number
              </label>
              <p className="text-xs text-gray-500 mb-2">
                (Find this by dialing *#06# on your phone)
              </p>
              <input
                type="text"
                name="imei"
                value={formData.imei}
                onChange={handleChange}
                placeholder="Enter IMEI Number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            {/* SIM Serial */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                SIM Serial Number
              </label>
              <p className="text-xs text-gray-500 mb-2">
                (Available on SIM Card Pack)
              </p>
              <input
                type="text"
                name="simSerial"
                value={formData.simSerial}
                onChange={handleChange}
                placeholder="Enter 19-digit SIM serial number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="w-5 h-5 text-teal-600 rounded focus:ring-teal-600"
            />
            <span className="text-sm">
              I agree to the{" "}
              <a href="#" className="text-teal-700 font-semibold hover:underline">
                terms & conditions
              </a>{" "}
              and authorize pSIM activation
            </span>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-10 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 transition duration-300"
            >
              Activate Your SIM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimActivationForm;