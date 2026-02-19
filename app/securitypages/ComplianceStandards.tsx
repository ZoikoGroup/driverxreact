"use client";

const complianceFeatures = [
  {
    sectionTitle: "Keeping You Connected — and Compliant",
    description:
      "DriverX Mobile is engineered for the demanding needs of America’s professional drivers, gig economy operators, and fleet carriers, ensuring your telecom services align with critical safety and transportation regulations."
  },
  {
    sectionTitle: "Built for Your Industry:",
    items: [
      {
        subtitle: "E911",
        text: "All DriverX Mobile lines support Enhanced 911, automatically transmitting your location and callback details to emergency responders."
      },
      {
        subtitle: "DOT & FMCSA Aligned",
        text: "Our platform seamlessly integrates with your ELDs, GPS, and HOS trackers to support compliance with U.S. Department of Transportation (DOT) and Federal Motor Carrier Safety Administration (FMCSA) standards."
      }
    ],
    description:
      "From last-mile couriers to multi-state freight operators, we keep your teams connected, protected, and aligned with the rules that keep America moving safely."
  }
];

function E911 () {

  return (
    <section className="bg-[#f8f9f7]">
      {/* Header */}
      <div className="bg-[#1e5d57] py-6 text-center">
        <h1 className="text-white text-2xl md:text-3xl font-bold">
          E911, DOT & FMCSA Standards
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-gray-700">
        {complianceFeatures.map((section, i) => (
          <div key={i}>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {section.sectionTitle}
            </h2>

            {/* Description before list */}
            {section.description && !section.items && (
              <p className="text-sm leading-relaxed">{section.description}</p>
            )}

            {/* Bullet points */}
            {section.items && (
              <ul className="mt-3 space-y-3 list-disc list-inside">
                {section.items.map((item, j) => (
                  <li key={j} className="text-sm leading-relaxed">
                    <span className="font-semibold text-gray-900">
                      {item.subtitle}:{" "}
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>
            )}

            {/* Description after list */}
            {section.description && section.items && (
              <p className="mt-4 text-sm leading-relaxed text-gray-700">
                {section.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default E911 ;
