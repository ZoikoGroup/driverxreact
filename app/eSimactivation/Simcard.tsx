"use client";
import { useState } from "react";

function Simcard() {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <section className="w-full py-20 bg-gradient-to-r from-yellow-50 via-green-50 to-green-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto px-4">

        {/* Dynamic Heading */}
        <h1 className="text-4xl font-bold text-center mb-10 dark:text-white">
          {selectedOption === "port" ? "SIM Port Form" : "SIM Activation Form"}
        </h1>

        <div className="bg-[#fffdf5] dark:bg-gray-900 border-4 border-teal-700 dark:border-teal-500 rounded-xl p-8 shadow-sm">
          <form className="space-y-6">

            {/* NAME + EMAIL */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium dark:text-gray-200">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your Full Name"
                  className="input"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium dark:text-gray-200">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter Email used for eSIM QR and activation info"
                  className="input"
                />
              </div>
            </div>

            {/* NUMBER OPTION */}
            <div>
              <label className="block mb-2 font-medium dark:text-gray-200">
                Number Option
              </label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="input"
              >
                <option value="">Select Option</option>
                <option value="new">I want new GoLite mobile number</option>
                <option value="port">Transfer existing mobile number to GoLite</option>
              </select>
            </div>

            {/* ---------------- PORT FORM ---------------- */}
            {selectedOption === "port" && (
              <>
                <div>
                  <label className="block mb-2 font-medium dark:text-gray-200">
                    Current Carrier Name<span className="text-red-500">*</span>
                  </label>
                  <input placeholder="Enter Carrier Name" className="input" />
                </div>

                <div className="space-y-3 pt-4">
                  <label className="flex gap-3 dark:text-gray-300">
                    <input type="checkbox" className="checkbox" />
                    <span>
                      I agree to the{" "}
                      <a href="#" className="text-teal-600 dark:text-teal-400 underline">
                        terms & conditions
                      </a>{" "}
                      of GoLite Mobile
                    </span>
                  </label>

                  <label className="flex gap-3 dark:text-gray-300">
                    <input type="checkbox" className="checkbox" />
                    <span>
                      I authorize GoLite Mobile to transfer my number and understand
                      that my current service will be canceled upon successful port-in.
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* ---------------- ACTIVATION FORM ---------------- */}
            {selectedOption === "new" && (
              <>
                <div>
                  <label className="block mb-2 font-medium dark:text-gray-200">
                    Activation Code{" "}
                    <span className="italic text-sm">
                      (send to email Address)
                    </span>
                  </label>
                  <input placeholder="Enter Activation Code" className="input" />
                </div>

                <div className="pt-4">
                  <label className="flex gap-3 dark:text-gray-300">
                    <input type="checkbox" className="checkbox" />
                    <span>
                      I agree to the{" "}
                      <a href="#" className="text-teal-600 dark:text-teal-400 underline">
                        terms & conditions
                      </a>{" "}
                      and authorize eSIM activation
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* BUTTON */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="px-20 py-3 bg-teal-700 text-white rounded-md font-semibold hover:bg-teal-800 transition dark:bg-teal-600 dark:hover:bg-teal-500"
              >
                {selectedOption === "port" ? "Submit Request" : "Activate Your SIM"}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Reusable styles */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #111827;
        }

        .input:focus {
          outline: none;
          border-color: #0d9488;
        }

        .checkbox {
          width: 18px;
          height: 18px;
          accent-color: #0f766e;
          margin-top: 3px;
        }

        :global(.dark) .input {
          background: #111827;
          border: 1px solid #374151;
          color: #f9fafb;
        }
      `}</style>
    </section>
  );
}

export default Simcard;
