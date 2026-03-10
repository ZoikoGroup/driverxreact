function Aboutus() {
  const features = [
    {
      title: "Tailored Connectivity for Professional Drivers",
      desc: "We offer highly customized mobile plans designed specifically for professional drivers and gig workers. With priority 5G access and real-time mobility insights.",
      icon: "/images/mynaui_mobile-signal-five.png",
    },
    {
      title: "Exclusive Offers & Elite Partnerships",
      desc: "Unlock DriverX exclusive deals and perks available through strategic carrier partnerships.",
      icon: "/images/ic_baseline-money-off.png",
    },
    {
      title: "First-Class Support, Seamless Experience",
      desc: "We pair top-tier technology with first-class human and AI-powered support. Available 24/7 through chat, phone, or email.",
      icon: "/images/22.png",
    },
    {
      title: "AI-Powered Efficiency & Profitability",
      desc: "Our platform leverages advanced AI analytics to boost income, improve fuel efficiency, and optimize driving hours.",
      icon: "/images/61.png",
    },
    {
      title: "A Connected Ecosystem for Total Productivity",
      desc: "DriverX is more than a carrier. It’s a complete career-focused ecosystem.",
      icon: "/images/Vector (3).png",
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-[#f6fbef] to-[#e9f7e8] dark:from-[#1e2421] dark:to-[#2b3a2f] py-12 md:py-16 px-4 md:px-6">

        {/* COMPANY OVERVIEW TEXT */}
        <div className="max-w-6xl mx-auto text-center mb-10 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-[#1e6f5c] mb-4 md:mb-6 dark:text-[#a0d9c8] tracking-wider">
            COMPANY OVERVIEW
          </h2>

          <p className="text-sm md:text-base text-gray-600 leading-relaxed dark:text-gray-400 px-2 md:px-0">
            As a wholly owned subsidiary of Zoiko Communications Group Inc., a global leader in wireless,
            IoT, and fintech solutions, we bring the unmatched scale, security, and innovation of a
            multinational powerhouse directly to the world of professional drivers.
          </p>
        </div>

        {/* TWO IMAGES SECTION */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 mb-12 md:mb-20">
          
          <div className="w-full md:w-2/3">
            <img
              src="/images/close-up-of-bus-driver-using-cell-phone-while-driv-2024-12-13-22-26-40-utc 1.png"
              alt="Driver"
              className="w-full h-64 md:h-[420px] object-cover rounded-3xl"
            />
          </div>

          <div className="w-full md:w-1/3">
            <img
              src="/images/man2 (2).png"
              alt="Charging"
              className="w-full h-64 md:h-[420px] object-cover rounded-3xl"
            />
          </div>

        </div>
      </section>
      <section className="bg-gray-100 dark:bg-gray-800 py-12 md:py-16 px-4 md:px-6">

        {/* DRIVERPLUS ADVANTAGE */}
        <div className="max-w-7xl mx-auto text-center mb-10 md:mb-14">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-wider dark:text-gray-200">
            THE DRIVERPLUS ADVANTAGE
          </h1>
        </div>

        {/* FEATURE CARDS TOP 3 */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-12">

          {features.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm text-center"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#1e6f5c] rounded-full flex items-center justify-center mx-auto mb-5 md:mb-6 shadow-md">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-6 h-6 md:w-7 md:h-7 object-contain"
                />
              </div>

              <h4 className="font-semibold mb-2 md:mb-3 text-gray-800 dark:text-gray-200">
                {item.title}
              </h4>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* BOTTOM 2 CARDS */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-24">

          {features.slice(3, 5).map((item, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm text-center"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#1e6f5c] rounded-full flex items-center justify-center mx-auto mb-5 md:mb-6 shadow-md">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-6 h-6 md:w-7 md:h-7 object-contain"
                />
              </div>

              <h4 className="font-semibold mb-2 md:mb-3 text-gray-800 dark:text-gray-200">
                {item.title}
              </h4>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
</section>
<section className="bg-white dark:bg-gray-900 py-12 md:py-16 px-4 md:px-6">
        {/* WHY CHOOSE US SECTION */}
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-16 md:mb-24">

          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Why Choose Us
            </h3>
            <p className="text-gray-600 leading-relaxed dark:text-gray-400">
              DriverX Mobile is your wireless network, your virtual personal assistant, your silent business partner — all in one powerful platform. Founded by Lennox McLeod, DriverX Mobile is the bold answer to decades of piecemeal solutions. We saw the gaps — and we built a fortress of strength, connectivity, and innovation around the professional driver. Where others offered pieces, we deliver the whole solution Unmatched, Unrivaled,  Uncompromising.
            </p>
          </div>

          <div className="w-full lg:w-1/2">
            <img
              src="/images/Mask group.png"
              alt="Taxi Driver"
              className="w-full h-64 sm:h-80 lg:h-auto object-cover rounded-3xl"
            />
          </div>

        </div>

      </section>
        {/* GREEN QUOTE SECTION */}
      <div className="bg-[#1e6f5c] dark:bg-gray-900 text-white py-12 md:py-20">

        {/* Inner content container */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-12 text-center md:text-left">

          {/* LEFT SIDE */}
          <div className="w-full md:w-1/2">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed">
              This is not an app. This is not a plan. This is a revolution for professional drivers.
            </h3>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full md:w-1/2">
            <p className="text-sm md:text-base opacity-90 leading-relaxed mb-4">
              Starting in the USA — and expanding across the world — DriverX Mobile is setting
              a new global benchmark. Our technology is built to empower drivers and redefine
              what commitment to the driver truly means.
            </p>

            <p className="font-semibold text-yellow-300">
              Lerence McLeod | Founder
            </p>
          </div>

        </div>
      </div>


    </>
  );
}

export default Aboutus;
