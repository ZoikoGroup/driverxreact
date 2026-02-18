export default function Accessibility() {
  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Header Section */}
      <div className="bg-teal-700 py-6">
        <h1 className="text-center text-white text-2xl md:text-3xl font-semibold">
          Accessibility & Language Options
        </h1>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800 space-y-8">

        {/* Digital Accessibility */}
        <div>
          <h2 className="font-semibold mb-2">
            Digital Accessibility That Drives Inclusion
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>ADA & WCAG 2.1 AA compliant interfaces</li>
            <li>Full screen reader compatibility</li>
            <li>Keyboard and voice navigation</li>
            <li>High-contrast and large-font modes</li>
            <li>TDD/TTY support for hearing-impaired users</li>
          </ul>
          <p className="mt-3 text-gray-700">
            We conduct regular audits to ensure accessibility standards are met or exceeded 
            across our website, mobile apps, and fleet portals.
          </p>
        </div>

        {/* Language Support */}
        <div>
          <h2 className="font-semibold mb-2">
            Support That Speaks Your Language:
          </h2>
          <p className="text-gray-700">
            DriverX Mobile serves a diverse community of gig drivers, fleet operators, 
            and delivery professionals across America. Our multilingual customer service 
            ensures every customer feels heard – in their preferred language.
          </p>
        </div>

        {/* Supported Languages */}
        <div>
          <h2 className="font-semibold mb-2">
            Languages Currently Supported:
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>English</li>
            <li>Spanish</li>
            <li>Haitian Creole</li>
            <li>Mandarin</li>
            <li>Tagalog</li>
            <li>Vietnamese</li>
            <li>Arabic</li>
          </ul>
          <p className="mt-3 text-gray-700">
            Additional languages available upon request
          </p>
        </div>

        {/* Support Channels */}
        <div>
          <h2 className="font-semibold mb-2">
            Support is available in these languages across:
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Our 24/7 customer service line</li>
            <li>WhatsApp and live chat</li>
            <li>SIM activation guides and onboarding</li>
            <li>Mobile app settings and fleet account portals</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="font-semibold mb-2">
            Need Help or Language Assistance?
          </h2>
          <p className="text-gray-700">
            If you need help using any of our services or want support in another language, 
            our Accessibility Team is here to help.
          </p>
          <p className="mt-3 font-semibold">
            Call us: 800-399-0087
          </p>
          <p className="font-semibold">
            Email: access@driverxmobile.com
          </p>
        </div>

      </div>
    </div>
  );
}
