"use client";

import Image from "next/image";
import SingleCatPlansSection from "../components/SingleCatPlansSection";

const Topupplans = () => {
  return (
    <>
      {/* TOP TITLE BAR */}
      <div className="bg-teal-800 py-12">
        <h2 className="text-white text-center font-bold text-5xl">
          DriverX Topup Plans
        </h2>
      </div>

      {/* HERO SECTION */}
      <section className="mx-auto max-w-7xl px-8 py-20">
        <div className="grid items-center gap-10 md:grid-cols-2 rounded-3xl overflow-hidden">
          
          {/* LEFT CONTENT */}
          <div className="bg-[#f6fbef] p-12 h-full flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-gray-900 leading-tight">
           Topup Plans Designed for Fleets, 
           <br />Teams & Professional Operations
            </h3>

            <p className="mt-6 text-gray-600 text-lg max-w-md">
            Scale your transportation, logistics, or field service operation with plans crafted to maximize uptime, lower costs, and keep your entire team connected on America’s most reliable Tier-1 network.
         </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative h-[350px] md:h-full">
            <Image
              src="/images/pair-of-excited-ladies-in-car-holding-hands-2024-10-18-17-35-44-utc 1.png" 
              alt="Driver advantage"
              fill
              className="object-cover rounded-3xl"
              priority
            />
          </div>
        </div>
      </section>
<SingleCatPlansSection cat="data-only-plans" heading="Topup Plans Designed for Fleets"/>


<br />
<br />

{/* why choose us banners */}


<div className="mx-auto max-w-7xl px-6 py-20">
  <div className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-16 items-start">

    {/* LEFT: Image */}
    <div>
      <img
        src="/images/Frame 1707483045.png"
        alt="DriverX city scene"
        className="rounded-2xl w-full object-cover"
      />
    </div>

    {/* RIGHT: Content */}
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">
        Why Choose DriverX Mobile?
      </h3>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <span className="mt-1 w-6 h-6 rounded-full bg-teal-600 text-white
                           flex items-center justify-center text-sm font-bold">
            ✓
          </span>
          <p className="text-gray-800">
            <strong>99.99%</strong> Uptime on America’s Leading Tier-1 Network
          </p>
        </div>

        <div className="flex items-start gap-4">
          <span className="mt-1 w-6 h-6 rounded-full bg-teal-600 text-white
                           flex items-center justify-center text-sm font-bold">
            ✓
          </span>
          <p className="text-gray-700">
            FCC Compliant • Encrypted & Secure
          </p>
        </div>

        <div className="flex items-start gap-4">
          <span className="mt-1 w-6 h-6 rounded-full bg-teal-600 text-white
                           flex items-center justify-center text-sm font-bold">
            ✓
          </span>
          <p className="text-gray-700">
            14-Day Money-Back Guarantee
          </p>
        </div>
      </div>
    </div>

  </div>
</div>


<div className="w-full py-20">
  <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center px-6">

    {/* LEFT: Content */}
    <div className="max-w-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Coverage, Features & Control
      </h3>

      <p className="text-gray-900 font-medium mb-4">
        Your phone. Your plan. Your way.
      </p>

      <p className="text-gray-600 leading-relaxed">
        Join thousands of professional drivers keeping more of their
        earnings with DriverX Mobile. Get exclusive deals, seamless
        support, and a network built for the road.
      </p>
    </div>

    {/* RIGHT: Image */}
    <div className="flex justify-end">
      <img
     src="/images/driver.png"
        alt="Driver using phone"
        className="w-full max-w-[520px] h-[340px] object-cover rounded-3xl"
      />
    </div>

  </div>
</div>




    </>
  );
};

export default Topupplans;