export default function Blog2() {
  return (
    <div className="bg-[#f7f9f7] min-h-screen text-gray-800">

    
      {/* Title Banner */}
      <div className="bg-[#0f766e] text-white text-center py-4 font-semibold text-lg">
        The Connectivity Gap That’s Costing Your Time and Money
      </div>

      {/* Hero Image */}
      <div className="flex justify-center mt-6 px-6">
       <img src="/images/Frame 1707483089 (1).png"
        alt="Driver using phone"
        className="w-full max-w-[520px] h-[340px] object-cover rounded-3xl"
      />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        <section>
          <h2 className="font-semibold text-lg mb-2">
            When Your Connection Drops, Your Operations Stall
          </h2>
          <p className="text-sm leading-relaxed text-gray-600">
            Every moment of downtime impacts revenue and efficiency. Whether
            you manage fleets, delivery teams, or field operations, unreliable
            connectivity slows communication, tracking, and transactions.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">
            What Exactly is eSIM, and Why Is It a Game Changer?
          </h2>
          <p className="text-sm text-gray-600">
            eSIM is a digital SIM that allows remote activation without
            physical cards. It enables multi-carrier flexibility, faster
            deployment, and seamless switching between networks.
          </p>
        </section>

        {/* Feature Table */}
        <section>
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-teal-700 text-white">
              <tr>
                <th className="p-3 text-left">Connectivity Feature</th>
                <th className="p-3 text-left">Operational Benefit</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-t">
                <td className="p-3">Redundant Coverage</td>
                <td className="p-3">Automatic switching to stronger networks</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Ultra-Low Latency</td>
                <td className="p-3">Real-time tracking and data flow</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Instant Device Activation</td>
                <td className="p-3">Bring new devices online immediately</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">API-Optimized Data</td>
                <td className="p-3">Better integration with business systems</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* DriverX Advantage */}
        <section>
          <h2 className="font-semibold text-lg mb-2">DriverX Advantage</h2>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Multi-carrier redundancy</li>
            <li>Fast remote provisioning</li>
            <li>Reliable connectivity across regions</li>
            <li>Secure enterprise-grade infrastructure</li>
          </ul>
        </section>

        {/* Impact Table */}
        <section>
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-teal-700 text-white">
              <tr>
                <th className="p-3 text-left">Metric</th>
                <th className="p-3 text-left">Impact</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-t">
                <td className="p-3">Better Uptime</td>
                <td className="p-3">Less downtime and service loss</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Dispatch Efficiency</td>
                <td className="p-3">Faster communication and routing</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Customer Experience</td>
                <td className="p-3">More reliable service delivery</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Driver Retention</td>
                <td className="p-3">Happier drivers with stable tools</td>
              </tr>
            </tbody>
          </table>
        </section>

      </div>

      {/* CTA */}
      <div className="flex justify-center px-6 pb-12">
        <div className="bg-[#0f766e] text-white rounded-xl p-8 text-center max-w-3xl w-full">
          <h3 className="text-lg font-semibold mb-2">
            Want to future-proof your fleet with eSIM?
          </h3>
          <p className="text-sm mb-4 text-teal-100">
            DriverX Mobile delivers secure, reliable connectivity.
          </p>
          <button className="bg-white text-teal-700 px-6 py-2 rounded-full text-sm font-semibold">
            Talk to a Fleet Solutions Specialist
          </button>
        </div>
      </div>

    </div>
  );
}
