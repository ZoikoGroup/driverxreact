"use client";

const features = [
     {
    sectionTitle: "Using Cookies for a Better Experience",
    description:
      "DriverX Mobile uses cookies and similar technologies to personalize content, remember your preferences, and analyze site performance."
  },

  {
    sectionTitle: "Types of Cookies",
    items: [
      {
        subtitle: "Essential",
        text: "Required for secure sign-ins and transactions."
      },
      {
        subtitle: "Performance",
        text: "Helps us improve the site by seeing how you navigate."
      },
      {
        subtitle: "Marketing",
        text: "Shows you offers tailored to your interests."
      }
    ]
  },

  {
    sectionTitle: "Take Control",
    items: [
      {
        subtitle: "Cookie Dashboard",
        text: "Adjust your preferences anytime through our on-site Privacy Center."
      },
      {
        subtitle: "Browser Tools",
        text: "All major browsers let you block or delete cookies — note this may impact some site functions."
      }
    ]
  },

  {
    sectionTitle: "Opt Out of Targeted Ads",
    description:
      "DriverX Mobile participates in industry standards like NAI and DAA. Visit their portals to manage ad preferences globally. We also respect 'Do Not Track' signals."
  }
 
];

function Cookie() {
  return (
    <section className="bg-[#f8f9f7]">
      {/* Green Header Bar */}
      <div className="bg-[#1e5d57] py-6 text-center">
        <h1 className="text-white text-2xl md:text-3xl font-bold">
Cookie Preferences & Opt-Out
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

export default Cookie;
