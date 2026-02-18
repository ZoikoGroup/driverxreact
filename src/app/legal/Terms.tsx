"use client";

const features = [
  {
    sectionTitle: "Overview",
    description:
      "These Terms of Service (“Terms”) form a binding contract between you (“Customer”) and DriverX Mobile. By activating, using, or paying for our services, you acknowledge these obligations and protections."
  },

  {
    sectionTitle: "Your Commitments",
    items: [
      {
        text: "Use our services responsibly and legally, in line with federal, state, and local laws."
      },
      {
        text: "Maintain the confidentiality of your account credentials and promptly report any unauthorized use."
      }
    ]
  },

  {
    sectionTitle: "Our Commitments",
    items: [
      {
        text: "Deliver mobile connectivity through Tier-1 network partners under rigorous quality and uptime standards."
      },
      {
        text: "Provide advance notice of material changes to these Terms or service conditions."
      }
    ]
  },

  {
    sectionTitle: "Network Management & Fair Use",
    items: [
      {
        text: "To ensure optimal performance for all users, DriverX Mobile may manage network traffic or limit heavy data usage under defined policies — always compliant with net neutrality rules and regulatory standards."
      }
    ]
  },

  {
    sectionTitle: "Billing & Remedies",
    items: [
      {
        text: "Invoices reflect your chosen plans, usage, taxes, and applicable payments. Non-payment may lead to service suspension or contract termination."
      },
      {
        text: "DriverX Mobile reserves the right to adjust, suspend, or terminate services in the event of policy breaches, fraud, or abuse."
      }
    ]
  },

  {
    sectionTitle: "Arbitration & Dispute Resolution",
    items: [
      {
        text: "Any disputes shall be resolved via binding individual arbitration, waiving the right to jury trials or class actions, under the laws of your billing state."
      }
    ]
  },

  {
    sectionTitle: "Intellectual Property",
    items: [
      {
        text: "All DriverX Mobile content — trademarks, technology, platforms — remain our sole property or that of our licensors."
      }
    ]
  },

  {
    sectionTitle: "Revisions to These Terms",
    items: [
      {
        text: "Terms may be updated to reflect changes in law, technology, or business needs. Continued use of services indicates acceptance."
      }
    ]
  },

  {
    sectionTitle: "Contact",
    description:
      "For legal inquiries, contact our Compliance Team at legal@driverxmobile.com."
  }
];


function Terms() {
  return (
    <section className="bg-[#f8f9f7]">
      {/* Green Header Bar */}
      <div className="bg-[#1e5d57] py-6 text-center">
        <h1 className="text-white text-2xl md:text-3xl font-bold">
Terms of Service & Legal
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

export default Terms;
