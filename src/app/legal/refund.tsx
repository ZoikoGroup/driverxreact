"use client";

const features = [
  {
    sectionTitle: "Your Satisfaction, Guaranteed",
    description:
      "At DriverX Mobile, your business is our business - and we stand by our service with transparent guarantees that remove all guesswork"
  },
  {
    sectionTitle: "14-Day Risk-Free Trial",
    items: [
      {
        text: "Complete Peace of Mind:"
      },
      {
      
        text: "Try DriverX Mobile for 14 days from activation. If you’re not entirely satisfied, cancel and receive a full refund on your plan charges - no restocking fees, no complications"
      },
      {
        subtitle: "Device Returns:",
        text: "Eligible handsets and accessories can also be returned in like-new condition within this window, subject to standard inspection."

      }
    ]
  },
  {
    sectionTitle: "Service Reliability Credit",
    items: [
      { text: "If your service experiences an unscheduled outage exceeding our guaranteed thresholds (excluding acts of nature, misuse, or mandated maintenance), you may qualify for prorated credits or adjustments - aligned with FCC consumer fairness guidelines." }
      
    ]
  },
  {
    sectionTitle: "Industry-Leading Device Protection",
    description:
      "Every new device comes with a 12-month manufacturer warranty, and extended DriverX Protect plans are available for even greater assurance."

  },
  {
    sectionTitle: "How to Claim",
    items: [
      {
       
        text: "File any refund, credit, or warranty claim directly through the DriverX Mobile app, online portal, or by speaking to our expert support advisors - ensuring a streamlined, professional resolution every time"
      }
    ]
  },
  {
    sectionTitle: "Because Your Trust Drives Us",
    description:
      "DriverX Mobile was built for drivers - and we’ll always keep your satisfaction front and center with industry-best policies and unwavering integrity."
  }
];

function Refund() {
  return (
    <section className="bg-[#f8f9f7]">
      {/* Green Header Bar */}
      <div className="bg-[#1e5d57] py-6 text-center">
        <h1 className="text-white text-2xl md:text-3xl font-bold">
     Refund & Service Guarantees
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

export default Refund;
