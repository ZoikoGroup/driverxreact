"use client";

const features = [
  {
    sectionTitle: "Unmatched Connectivity for America’s Drivers",
    description:
      "DriverX Mobile keeps you connected wherever the road leads—so you can earn more, worry less, and navigate with absolute confidence."
  },
  {
    sectionTitle: "America’s Premier Tier-1 Network",
    items: [
      {
        subtitle: "Nationwide Reach",
        text: "Our services run on a Tier-1 infrastructure that spans 99%+ of the U.S. population, with advanced geofencing to prioritize mobile data along major highways, logistics hubs, and urban centers."
      },
      {
        subtitle: "5G & LTE Excellence",
        text: "Experience best-in-class speeds through robust 5G rollouts in key markets, seamlessly transitioning to ultra-reliable LTE elsewhere—so your apps, maps, and transactions never skip a beat."
      },
      {
        subtitle: "Carrier-Grade Redundancy",
        text: "Multi-path failover systems, real-time traffic balancing, and industry-certified resilience ensure your connectivity holds strong under any condition."
      }
    ]
  },
  {
    sectionTitle: "Performance Benchmarks",
    items: [
      { text: "Guaranteed uptime commitments exceeding 99.9% under normal conditions." },
      { text: "Ultra-low latency, optimized for gig-economy and rideshare operations." },
      { text: "HD Voice and VoLTE, delivering crystal-clear calls even in high-traffic zones." }
    ]
  },
  {
    sectionTitle: "Cross-Border Operations",
    description:
      "Drive confidently into Mexico, Canada, or across global routes with our travel-ready plans—designed for long-haul truckers and international delivery professionals."
  },
  {
    sectionTitle: "Always Know Before You Go",
    items: [
      {
        subtitle: "Interactive Coverage Tools",
        text: "Plan your routes with pinpoint clarity using our dynamic signal heatmaps."
      },
      {
        subtitle: "Proactive Alerts",
        text: "Be instantly notified of maintenance windows or rare disruptions—so you’re always one step ahead."
      }
    ]
  },
  {
    sectionTitle: "A Promise You Can Bank On",
    description:
      "Our network adheres to rigorous telecom-grade SLAs, giving you the peace of mind only a Fortune 10-level commitment can deliver."
  }
];

function NetworkFeatures() {
  return (
    <section className="bg-[#f8f9f7]">
      {/* Green Header Bar */}
      <div className="bg-[#1e5d57] py-6 text-center">
        <h1 className="text-white text-2xl md:text-3xl font-bold">
          Network Coverage & Performance
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-gray-700">
        {features.map((section, i) => (
          <div key={i}>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {section.sectionTitle}
            </h2>

            {section.description && (
              <p className="text-sm leading-relaxed">{section.description}</p>
            )}

            {section.items && (
              <ul className="mt-3 space-y-2 list-disc list-inside">
                {section.items.map((item, j) => (
                  <li key={j} className="text-sm leading-relaxed">
                    {item.subtitle && (
                      <span className="font-semibold text-gray-900">
                        {item.subtitle}:{" "}
                      </span>
                    )}
                    {item.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default NetworkFeatures;
