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
      <section className="bg-gradient-to-br from-[#f6fbef] to-[#e9f7e8] py-16 px-6">

        {/* COMPANY OVERVIEW TEXT */}
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-2xl font-bold text-[#1e6f5c] mb-6">
            COMPANY OVERVIEW
          </h2>

          <p className="text-gray-600 leading-relaxed">
            As a wholly owned subsidiary of Zoiko Communications Group Inc., a global leader in wireless,
            IoT, and fintech solutions, we bring the unmatched scale, security, and innovation of a
            multinational powerhouse directly to the world of professional drivers.
          </p>
        </div>

        {/* TWO IMAGES SECTION */}
        <div className="max-w-6xl mx-auto flex gap-6 mb-20">
          <div className="w-2/3">
            <img
              src="/images/close-up-of-bus-driver-using-cell-phone-while-driv-2024-12-13-22-26-40-utc 1.png"
              alt="Driver"
              className="w-full h-[420px] object-cover -3xl"
            />
          </div>

          <div className="w-1/3">
            <img
              src="/images/man2 (2).png"
              alt="Charging"
              className="w-full h-[420px] object-cover -3xl"
            />
          </div>
        </div>
              </section>

        {/* DRIVERPLUS ADVANTAGE */}
        <div className="max-w-8xl mx-auto text-center mb-14">
 <h1 className="text-4xl font-bold text-gray-800 tracking-wider">
            THE DRIVERPLUS ADVANTAGE
          </h1>
        </div>

        {/* FEATURE CARDS */}
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8 mb-12">

          {features.slice(0, 3).map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[#1e6f5c] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <h4 className="font-semibold mb-3 text-gray-800">
                {item.title}
              </h4>
              <p className="text-sm text-gray-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* BOTTOM 2 CARDS CENTERED */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8 mb-24">

          {features.slice(3, 5).map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[#1e6f5c] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <h4 className="font-semibold mb-3 text-gray-800">
                {item.title}
              </h4>
              <p className="text-sm text-gray-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* WHY CHOOSE US SECTION */}
        <div className="max-w-6xl mx-auto flex items-center gap-12 mb-24">

          <div className="w-1/2">
            <h3 className="text-2xl font-bold mb-4">Why Choose Us</h3>
            <p className="text-gray-600 leading-relaxed">
              DriverX Mobile is your wireless network, your virtual personal assistant,
              your silent business partner — all in one powerful platform.
            </p>
          </div>

          <div className="w-1/2">
            <img
              src="/images/Mask group.png"
              alt="Taxi Driver"
              className="w-full -3xl object-cover"
            />
          </div>

        </div>

        {/* GREEN QUOTE SECTION */}
<div className="bg-[#1e6f5c] text-white py-20">

  {/* Inner content container */}
  <div className="max-w-6xl mx-auto px-6 flex justify-between items-start gap-12">

    <div className="w-1/2">
      <h3 className="text-2xl font-semibold leading-relaxed">
        This is not an app. This is not a plan. This is a revolution for professional drivers.
      </h3>
    </div>

    <div className="w-1/2">
      <p className="text-sm opacity-90 leading-relaxed mb-4">
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
