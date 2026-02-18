export default function Blog3() {
  return (
    <div className="bg-[#f7f9f7] min-h-screen text-gray-800">


      {/* Title Banner */}
      <div className="bg-[#0f766e] text-white text-center py-4 font-semibold text-lg">
        The Infrastructure Edge That Keeps Fleets Moving
      </div>

      {/* Hero Image */}
      <div className="flex justify-center mt-6 px-6">
   
   <img src="/images/Frame 1707483089 (2).png"
        alt="Driver using phone"
        className="w-full max-w-[520px] h-[340px] object-cover rounded-3xl"
      />      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        <section>
          <h2 className="font-semibold text-lg mb-2">
            Mobility Is a Network System. Your Connectivity Should Be Too.
          </h2>
          <p className="text-sm leading-relaxed text-gray-600">
            Every route optimized, every GPS ping, every delivery confirmed —
            it runs on infrastructure. For modern fleets, connectivity is not
            just a SIM card, but a resilient system built across networks,
            clouds, and APIs.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">
            What Is “Telecom-Grade Infrastructure”?
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Tier-1 carrier agreements across multiple regions</li>
            <li>API-ready core systems for automation</li>
            <li>Secure lifecycle management</li>
            <li>Global device provisioning</li>
          </ul>
        </section>

        {/* Feature Table */}
        <section>
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-teal-700 text-white">
              <tr>
                <th className="p-3 text-left">Infrastructure Feature</th>
                <th className="p-3 text-left">Real-World Benefit</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-t">
                <td className="p-3">Multi-Network Redundancy</td>
                <td className="p-3">No dead zones = no lost jobs</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Self-Serve Line Management</td>
                <td className="p-3">Quicker fixes, faster scale</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">API Provisioning</td>
                <td className="p-3">Instant device deployment</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Secure Connectivity</td>
                <td className="p-3">Enterprise-grade protection</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Analytics & Reporting</td>
                <td className="p-3">Smarter decisions with real-time data</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">
            Built for Your Operations, Not Just Your Devices
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Direct carrier relationships</li>
            <li>Cloud-connected management tools</li>
            <li>Scalable architecture for fleet growth</li>
            <li>Integrated APIs for logistics systems</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">Case Study: California Fleet</h2>
          <p className="text-sm text-gray-600">
            A regional delivery team used DriverX infrastructure to cut
            downtime by 35%, boost routing accuracy, and achieve 99.9% uptime
            across devices.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">The Hidden Edge of DriverX</h2>
          <p className="text-sm text-gray-600">
            Most drivers never see telecom infrastructure — but they feel the
            difference every shift. With DriverX, your network works as hard as
            your fleet.
          </p>
        </section>

      </div>

      {/* CTA */}
      <div className="flex justify-center px-6 pb-12">
        <div className="bg-[#0f766e] text-white rounded-xl p-8 text-center max-w-3xl w-full">
          <h3 className="text-lg font-semibold mb-2">
            Ready to Build on Infrastructure That Moves With You?
          </h3>
          <p className="text-sm mb-4 text-teal-100">
            Telecom-grade connectivity built for enterprise mobility.
          </p>
          <button className="bg-white text-teal-700 px-6 py-2 rounded-full text-sm font-semibold">
            Talk to DriverX Enterprise Engineering
          </button>
        </div>
      </div>

    </div>
  );
}
