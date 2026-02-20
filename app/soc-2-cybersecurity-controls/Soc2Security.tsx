"use client";

const soc2Features = [
  {
    sectionTitle: "Enterprise-Grade Security — Independently Audited",
    description:
      "DriverX Mobile’s infrastructure is built on world-class cybersecurity practices and validated through rigorous SOC 2 audits."
  },
  {
    sectionTitle: "This means our systems are continually assessed across:",
    items: [
      {
        subtitle: "Security",
        text: "Blocking unauthorized access with advanced encryption, intrusion detection, and multi-factor authentication."
      },
      {
        subtitle: "Availability",
        text: "Keeping our network up and running, so your business operations never miss a beat."
      },
      {
        subtitle: "Confidentiality",
        text: "Protecting your sensitive information with strict access policies and continuous monitoring."
      }
    ],
    description:
      "We don’t just maintain certifications — we proactively strengthen our defenses with regular risk assessments, third-party penetration tests, and a 24/7 security operations center. With DriverX Mobile, you gain more than connectivity — you secure your operations with telecom-grade trust."
  }
];

function Soc2Security() {
  return (
    <section className="bg-[#f8f9f7]">
      {/* Header */}
      <div className="bg-[#1e5d57] py-6 text-center">
        <h1 className="text-white text-2xl md:text-3xl font-bold">
          SOC 2 Cybersecurity Controls
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-gray-700">
        {soc2Features.map((section, i) => (
          <div key={i}>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {section.sectionTitle}
            </h2>

            {/* Description before bullets */}
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

            {/* Description after bullets */}
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

export default Soc2Security;
