 function Blog1() {
  return (
    <div className="bg-[#f7f9f7] min-h-screen text-gray-800">

    

      {/* Title Banner */}
      <div className="bg-[#0f766e] text-white text-center py-4 font-semibold text-lg">
        Why Smart Fleets And Gig Platforms Are Moving Fast On eSIM
      </div>

      {/* Hero Image */}
      <div className="flex justify-center mt-6 px-6">
         <img
     src="/images/Frame 1707483089.png"
        alt="Driver using phone"
        className="w-full max-w-[520px] h-[340px] object-cover rounded-3xl"
      />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        <section>
          <h2 className="font-semibold text-lg mb-2">
            Connectivity Isn’t Just Changing — It’s Evolving
          </h2>
          <p className="text-sm leading-relaxed text-gray-600">
            Modern fleet and gig platforms depend on seamless, reliable connectivity.
            Physical SIM cards can’t keep up with the speed of deployment required today.
            eSIM technology is enabling faster, smarter, and more scalable solutions.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">
            Why Smart Fleets Are Switching
          </h2>
          <p className="text-sm text-gray-600">
            eSIM delivers centralized control, remote provisioning, and stronger security
            without the need to handle physical cards.
          </p>
        </section>

        {/* Use Case Table */}
        <section>
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-teal-700 text-white">
              <tr>
                <th className="p-3 text-left">Operational Use Case</th>
                <th className="p-3 text-left">Impact</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-t">
                <td className="p-3">Instant Provisioning</td>
                <td className="p-3">Deploy new devices in minutes</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Multi-Carrier Support</td>
                <td className="p-3">Automatic switching for best signal</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Hardware Flexibility</td>
                <td className="p-3">Works across devices and platforms</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Global Expansion</td>
                <td className="p-3">No physical SIM logistics</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Features List */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            DriverX eSIM Platform Advantages
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Centralized SIM lifecycle management</li>
            <li>Fast remote activation</li>
            <li>Multi-network connectivity</li>
            <li>Secure enterprise-grade control</li>
          </ul>
        </section>

        {/* Why eSIM */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Why the Shift Matters Now</h2>
          <p className="text-sm text-gray-600">
            With IoT growth and digital fleet transformation, scalable connectivity
            infrastructure is essential for operational success.
          </p>
        </section>
      </div>

      {/* CTA Section */}
      <div className="flex justify-center px-6 pb-12">
        <div className="bg-[#0f766e] text-white rounded-xl p-8 text-center max-w-3xl w-full">
          <h3 className="text-lg font-semibold mb-2">
            Want to future-proof your fleet with eSIM?
          </h3>
          <p className="text-sm mb-4 text-teal-100">
            Unlock secure, flexible, and scalable connectivity today.
          </p>
          <button className="bg-white text-teal-700 px-6 py-2 rounded-full text-sm font-semibold">
            Talk to a Fleet Specialist
          </button>
        </div>
      </div>

    </div>
  );
}
export default Blog1;