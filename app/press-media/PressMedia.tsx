export default function PressMedia() {
  return (
    <section className="bg-[#f8faf7] dark:bg-gray-950 min-h-screen transition-colors duration-300">

      {/* Top Banner */}
      <div className="bg-[#0f766e] dark:bg-teal-900 text-white dark:text-gray-200 text-center py-5 transition-colors duration-300">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Press & Media
        </h1>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-6 py-12 text-gray-700 dark:text-gray-300 space-y-10 transition-colors duration-300">

        {/* Intro */}
        <div>
          <h2 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
            Welcome to the DriverX Mobile Media Room
          </h2>
          <p className="text-sm leading-relaxed">
            DriverX Mobile is redefining mobile connectivity for the gig economy,
            logistics fleets, and America’s mobile workforce. As a forward-moving
            wireless provider backed by Zoiko Communications Group and global
            partners, we provide journalists and partners with trusted access
            to updates, official assets, and leadership insights.
          </p>
        </div>

        {/* Recent Announcements */}
        <div>
          <h2 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
            Recent Announcements
          </h2>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li>DriverX launches nationwide fleet connectivity suite (July 2025)</li>
            <li>Zoiko Communications expands investment in DriverX (June 2025)</li>
            <li>DriverX unveils DriverX App: A Mobile Hub for America’s Drivers (March 2025)</li>
          </ul>
        </div>

        {/* Media Highlights */}
        <div>
          <h2 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
            Media Highlights
          </h2>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li>Telecom Weekly: DriverX building telecom layer for mobile professionals</li>
            <li>TechOnTrack Podcast: Interview with CEO Lance Mused</li>
            <li>Logistics Today: eSIM and IoT stack redefining fleet connectivity</li>
          </ul>
          <p className="text-sm mt-3">
            For media appearances, contact:
            <span className="font-medium text-teal-700 dark:text-teal-400">
              {" "}media@driverxmobile.com
            </span>
          </p>
        </div>

        {/* Press & Brand Assets */}
        <div>
          <h2 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
            Press & Brand Assets
          </h2>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li>Company overview and executive bios</li>
            <li>Leadership headshots (high-resolution)</li>
            <li>Approved logos (vertical, horizontal, monochrome)</li>
            <li>Screenshots of mobile platform & SIM interface</li>
            <li>Brand guidelines & color specifications</li>
          </ul>
        </div>

        {/* Editorial Image Library */}
        <div>
          <h2 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
            Editorial Image Library
          </h2>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li>Fleet vehicles and brand ambassadors</li>
            <li>Behind-the-scenes product demos</li>
            <li>Mobile app interface and platform visuals</li>
            <li>Leadership portraits and industry events</li>
          </ul>
        </div>

        {/* Speaking Engagements */}
        <div>
          <h2 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
            Speaking Engagements & Industry Panels
          </h2>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li>Telecommunications innovation</li>
            <li>Gig economy & workforce infrastructure</li>
            <li>Fleet logistics transformation</li>
            <li>Future of mobile-first platforms</li>
          </ul>
          <p className="text-sm mt-3">
            To request a speaker, email:
            <span className="font-medium text-teal-700 dark:text-teal-400">
              {" "}press@driverxmobile.com
            </span>
          </p>
        </div>

        {/* Contact Block */}
        <div className="bg-[#eef3f2] dark:bg-gray-900 border dark:border-gray-800 p-6 rounded-md transition-colors duration-300">
          <h2 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
            DriverX Mobile – Press Office
          </h2>
          <p className="text-sm">
            Albany | Sacramento | Austin | Springfield | Orlando | Delaware
          </p>
          <p className="text-sm mt-2">
            Tel: <span className="font-medium">(800) 399-0087</span>
          </p>
          <p className="text-sm">
            Email: <span className="font-medium">press@driverxmobile.com</span>
          </p>
          <p className="text-sm">
            Website: <span className="font-medium">www.driverxmobile.com</span>
          </p>
        </div>

      </div>
    </section>
  );
}