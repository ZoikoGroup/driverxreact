export default function MissionValues() {
  return (
    <section className="bg-[#f4f6f5] min-h-screen">

      {/* Header Bar */}
      <div className="bg-[#1f766d] text-white text-center py-5">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Our Mission & Values
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 bg-white p-6 shadow-sm border-l-4 border-[#1f766d]">
          <div>
            <h2 className="font-semibold text-lg mb-2">Our Mission</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              To deliver world-class mobile connectivity, intelligent digital
              solutions, and adaptive technologies that empower America’s
              mobile workforce — from independent drivers to enterprise fleets —
              to operate more efficiently, stay connected, and thrive on the road.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">Our Vision</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              To redefine the mobile experience for the transportation and gig
              economy by building the most resilient, responsive, and intelligent
              connectivity platform — empowering every driver, everywhere.
            </p>
          </div>
        </div>

        {/* Large Image */}
        <div>
          <img
             src="/images/portrait-of-caucasian-delivery-man-delivering-pack-2025-03-26-12-22-14-utc 1.png"
            alt="Team"
            className="w-full rounded shadow-md"
          />
        </div>

        {/* Core Values Section */}
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* Values List */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Our Core Values</h2>

            <div className="space-y-5 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold text-[#1f766d]">
                  ✅Driver-First Innovation
                </h3>
                <p>
                  We build for drivers. Every plan, tool, and integration is
                  created to solve real-world problems for those behind the wheel.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1f766d]">
                  ✅Integrity in Motion
                </h3>
                <p>
                  Transparency and accountability define how we operate —
                  with every customer, partner, and stakeholder.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1f766d]">
                 ✅ Uncompromising Connectivity
                </h3>
                <p>
                  We believe reliable coverage should be universal. That’s why
                  we harness Tier-1 networks and cutting-edge infrastructure.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1f766d]">
                  ✅Intelligent Scalability
                </h3>
                <p>
                  From single SIMs to enterprise-grade fleet deployments,
                  our solutions grow with your business.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1f766d]">
                 ✅ Community & Belonging
                </h3>
                <p>
                  We champion the often-overlooked heroes of the gig economy.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1f766d]">
                 ✅ Privacy & Data Ethics
                </h3>
                <p>
                  We respect the rights of every user. Your data is protected,
                  your privacy is sacred.
                </p>
              </div>
            </div>
          </div>

          {/* Side Image */}
          <div>
            <img
               src="/images/taking-applicant-vacancy 1.png"
              alt="Driver"
              className="w-full rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Corporate Governance */}
        <div>
          <h2 className="text-center text-xl font-semibold mb-8">
            Corporate Governance
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition">
              <div className="text-3xl mb-3"> 
                  <img
  src="/images/fa6-solid_handshake.png"
  alt="Purposeful Partnerships"
  className="w-12 h-12 mx-auto mb-4"
/>
            
            </div>
              <h3 className="font-semibold">Purposeful Partnerships</h3>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition">
              <div className="text-3xl mb-3"><img
  src="/images/Vector (2).png"
  alt="Purposeful Partnerships"
  className="w-12 h-12 mx-auto mb-4"
/></div>
              <h3 className="font-semibold">Inclusive Access</h3>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition">
              <div className="text-3xl mb-3"><img
  src="/images/material-symbols_social-leaderboard.png"
  alt="Purposeful Partnerships"
  className="w-12 h-12 mx-auto mb-4"
/></div>
              <h3 className="font-semibold">Sustainable Innovation</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Accent Bar */}
      <div className="h-3 bg-[#1f766d] mt-12"></div>

    </section>
  );
}
