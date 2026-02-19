"use client";

const features = [
  {
    sectionTitle: "PCI DSS Compliance — Secure Transactions You Can Trust",
    description:
      "At DriverX Mobile, your payment security is our highest priority. Every transaction on our platform is processed under the stringent requirements of PCI DSS Level 1, the world’s top standard for safeguarding cardholder data."
  },
  {
    sectionTitle: "What This Means for You:",
    items: [
      {
        subtitle: "End-to-End Encryption (E2EE)",
        text: "Your card details are encrypted from the moment you enter them, through every stage of transmission and storage."
      },
      {
        subtitle: "Tokenization",
        text: "Sensitive data is replaced by secure, unique tokens — your real card data never sits exposed in our systems."
      },
      {
        subtitle: "Certified Partners",
        text: "We partner only with PCI DSS Level 1–certified processors, ensuring every transaction meets the most rigorous global requirements.",
        description:
          "DriverX Mobile also undergoes regular vulnerability scans, penetration tests, and independent audits, keeping your payments secure and your trust intact. Whether you’re topping up, paying monthly, or managing fleet accounts, you’re transacting on infrastructure built to protect you."
      }
    ]
  }
];

function Pci() {
  return (
    <section className="bg-[#f8f9f7]">
      {/* Header */}
      <div className="bg-[#1e5d57] py-6 text-center">
        <h1 className="text-white text-2xl md:text-3xl font-bold">
          PCI DSS Security Standards
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
              <ul className="mt-3 space-y-3 list-disc list-inside">
                {section.items.map((item, j) => (
                  <li key={j} className="text-sm leading-relaxed">
                    {item.subtitle && (
                      <span className="font-semibold text-gray-900">
                        {item.subtitle}:{" "}
                      </span>
                    )}
                    {item.text}

                    {/* FIX — now this prints */}
                    {item.description && (
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    )}
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

export default Pci;
