"use client";

const features = [
  {
    sectionTitle: "Your Privacy. Our Priority.",
    description:
      "DriverX Mobile is committed to safeguarding your personal data with the same care we’d expect ourselves."
  },

  {
    sectionTitle: "What We Collect",
    items: [
      {
        subtitle: "Identity & Contact Data",
        text: "Name, billing/shipping address, email, phone."
      },
      {
        subtitle: "Usage Data",
        text: "Call logs, SMS records (metadata only), data usage volumes, device IMEI and IP."
      },
      {
        subtitle: "Location & Diagnostic Data",
        text: "Collected strictly to deliver and optimize services."
      }
    ]
  },

  {
    sectionTitle: "How We Use It",
    items: [
      { text: "To provision, maintain, and improve your mobile services." },
      { text: "To detect and prevent fraud." },
      { text: "To offer relevant promotions — you can opt out at any time." }
    ]
  },

  {
    sectionTitle: "Data Retention & Transfers",
    items: [
      {
        text: "We retain records for as long as legally necessary to comply with FCC, CCPA, and GDPR frameworks, or to fulfill operational needs — typically no more than 7 years."
      },
      {
        text: "Data may be processed outside your state or country under robust privacy agreements."
      }
    ]
  },

  {
    sectionTitle: "Your Rights",
    items: [
      { text: "Access, correction, deletion, or portability of your personal data." },
      { text: "Control marketing preferences directly from your account dashboard." }
    ]
  },

  {
    sectionTitle: "Security Measures",
    description:
      "Industry-grade encryption, restricted data center access, continuous monitoring — because protecting your information is non-negotiable."
  },

  {
    sectionTitle: "Questions?",
    description:
      "Contact our Privacy Team anytime at privacy@driverxmobile.com."
    }
];

function Privacy() {
  return (
    <section className="bg-[#f8f9f7]">
      {/* Green Header Bar */}
      <div className="bg-[#1e5d57] py-6 text-center">
        <h1 className="text-white text-2xl md:text-3xl font-bold">
   Privacy Policy
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

export default Privacy;
