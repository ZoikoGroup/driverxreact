"use client";
import Image from "next/image";

const features = [
  {
    icon: "/images/mynaui_mobile-signal-five.png",
    title: "Nationwide Tier-1 Network Performance",
    desc: "Always-on LTE and 5G data connectivity optimized for real-time telemetry, geofencing, fuel analytics, and dashcam video sync.."
  },
  {
    icon: "/images/ic_baseline-money-off.png",
    title: "Zero-Touch SIM & eSIM Provisioning",
    desc: "Activate, assign, and manage thousands of devices at once using our cloud-based control portal — with full lifecycle visibility and remote SIM updates.."
  },
  {
    icon: "/images/22.png",
    title: "Telematics-Ready Architecture",
    desc: "Seamless compatibility with OBD-II, CAN bus, ELDs, in-vehicle modems, diagnostics sensors, and edge-processing gateways."
  },
  {
    icon: "/images/61.png",
    title: "Secure, Isolated Device-Level Control",
    desc: "Encrypted data transport, device binding, and over-the-air (OTA) patching integrity compliant with FMCSA, DOT, and ISO standards"
  },
  {
    icon: "/images/61.png",
    title: "Smart Diagnostics & Predictive Monitoring",
    desc: "Driver behavior scoring, fuel waste analytics, maintenance alerts, and multi-asset health monitoring — all in real time."
  },
  {
    icon: "/images/Vector (3).png",
    title: "Platform-Agnostic Integration",
    desc: "Built to interface with all major telematics and IoT platforms — no lock-in, no proprietary constraints.."
  }
];

export default function TelematicsIntegration() {
  return (
    <section className="w-full bg-[#f3f4f6] py-12">

      {/* Header */}
      <div className="bg-[#1f6f63] py-3 text-center">
        <span className="bg-[#f4a300] text-black text-sm font-semibold px-4 py-1 rounded">
          DriverX Telematics & IoT Integrations
        </span>
      </div>

      {/* Intro */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
          Real-Time Visibility | Zero Downtime | Scalable Intelligence
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed max-w-4xl">
         DriverX Mobile is the connectivity backbone behind today’s most advanced telematics, fleet management, and IoT deployments. From smart vehicle systems to connected asset tracking, we provide enterprise-grade mobile infrastructure designed to support mission-critical applications — at scale, and without fail. 

Whether you operate commercial fleets, manage field equipment, or embed edge sensors into logistics workflows, our mobile solutions ensure your data moves with speed, integrity, and control — across all environments and endpoints
        </p>
      </div>

      {/* Image Section */}
      <div className="max-w-6xl mx-auto px-6 pb-14">
        <div className="relative rounded-xl overflow-hidden shadow">

          <Image
            src="/images/iot.png"
            alt="IoT Fleet"
            width={1400}
            height={500}
            className="w-full h-[400px] object-cover"
            priority
          />

          <div className="absolute bottom-6 right-6 bg-[#7dc9b2] p-6 rounded-lg shadow-lg w-[280px]">
            <h4 className="font-semibold mb-3 text-sm">
              Built for Scale | Trusted Across Industries
            </h4>
            <ul className="space-y-2 text-xs">
              <li>● Logistics & Freight</li>
              <li>● Construction & Heavy Equipment</li>
              <li>● Emergency Services</li>
              <li>● Asset Management</li>
              <li>● Automotive OEM & Fleet Providers</li>
            </ul>
          </div>

        </div>
      </div>

    <div className="grid md:grid-cols-3 gap-6">
  {features.map((item, index) => (
    <div
      key={index}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition text-center"
    >
      <div className="w-14 h-14 mx-auto mb-4 bg-[#1f6f63] rounded-full flex items-center justify-center">
        <Image
          src={item.icon}
          alt={item.title}
          width={26}
          height={26}
          className="object-contain"
        />
      </div>

      <h4 className="font-semibold text-sm mb-2">
        {item.title}
      </h4>

      <p className="text-xs text-gray-600 leading-relaxed">
        {item.desc}
      </p>
    </div>
  ))}
</div>

<div className="relative bg-[#1f6f63] py-16 px-6 overflow-hidden">

  {/* Dotted Pattern Overlay */}
  <div className="absolute inset-0 opacity-20 pointer-events-none">
    <div className="w-semi h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:18px_18px]" />
  </div>

  {/* Content */}
  <div className="relative max-w-5xl mx-auto text-center text-white">

    <h2 className="text-2xl md:text-3xl font-semibold mb-6">
  Make Every Asset Intelligent | Every Operation Smarter
    </h2>

    <p className="text-sm md:text-base opacity-90 mb-10 max-w-3xl mx-auto leading-relaxed">
     Make Every Asset Intelligent | Every Operation Smarter
Whether you’re powering an AI-enabled fleet or deploying next-gen sensors across your logistics infrastructure, DriverX Mobile delivers secure, reliable, and intelligent mobile connectivity that scales with your ambitions.
    </p>

    <div className="flex flex-wrap justify-center gap-4">

      <button className="bg-white text-[#1f6f63] px-6 py-3 rounded-full text-sm font-medium shadow hover:scale-105 transition">
        Explore Custom IoT Plans
      </button>

      <button className="bg-white text-[#1f6f63] px-6 py-3 rounded-full text-sm font-medium shadow hover:scale-105 transition">
        Schedule an Enterprise Demo
      </button>

      <button className="bg-white text-[#1f6f63] px-6 py-3 rounded-full text-sm font-medium shadow hover:scale-105 transition">
        Talk to a Solutions Architect
      </button>

    </div>
  </div>
</div>

    </section>
  );
}