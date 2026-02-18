"use client";

const features = [
  {
    sectionTitle: "Unmatched Connectivity for America’s Drivers",
    description:
      "Your Data. Your Rights. Fully Protected. DriverX Mobile places your privacy at the heart of our operations. From gig drivers to enterprise fleet partners, we ensure your personal data is handled with respect and protected by the strongest global standards."
  },
  {
    sectionTitle: "Our Privacy Commitments:",
    items: [
      {
        subtitle: "GDPR (EU)",
        text: "We enforce data minimization, transparency, and secure international transfers to protect EU residents."
      },
      {
        subtitle: "CCPA & CPRA (California)",
        text: "California residents have clear rights to know, delete, or opt out of the sale or sharing of personal data."
      },
      {
        subtitle: "Privacy by Design",
        text: "Privacy safeguards are embedded into every product and process, not bolted on later."
      }
    ],
    description:
      "We maintain strict access controls, updated policies, and a dedicated compliance team to address data requests swiftly. With DriverX Mobile, your information is treated with the care it deserves — today and as privacy laws continue to evolve."
  }
];

function GDPR() {
  return (
    <section className="bg-[#f8f9f7]">
      {/* Header */}
      <div className="bg-[#1e5d57] py-6 text-center">
        <h1 className="text-white text-2xl md:text-3xl font-bold">
          Privacy & Data Protection Standards
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-gray-700">
        {features.map((section, i) => (
          <div key={i}>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {section.sectionTitle}
            </h2>

            {/* If section has NO items → description goes here */}
            {section.description && !section.items && (
              <p className="text-sm leading-relaxed">{section.description}</p>
            )}

            {/* Items list */}
            {section.items && (
              <ul className="mt-3 space-y-3 list-disc list-inside">
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

            {/* If section HAS items → description goes AFTER list */}
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

export default GDPR;
