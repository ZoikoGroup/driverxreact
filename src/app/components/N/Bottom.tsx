"use client";

import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

/* ---------- TOP CONTACT STRIP (YOUR CURRENT FOOTER) ---------- */

const Sitem = [
  {
    id: 1,
    image: "/images/location-icon-footer.png",
    Head: "Find Us",
    contact: "418 Broadway, STE R, Albany, NY 12207",
  },
  {
    id: 2,
    image: "/images/email-icon-footer.png",
    Head: "Mail us",
    contact: "info@driverxmobile.com",
  },
  {
    id: 3,
    image: "/images/phone-icon-footer.png",
    Head: "Contact us",
    contact: "+1 (800) 399-0087",
  },
];

const Bottom = () => {
  return (
    <footer className="w-full">
      {/* ===== 1️⃣ TOP CONTACT STRIP (UNCHANGED LOGIC) ===== */}
      <div className="bg-teal-800 py-6">
        <div className="mx-auto max-w-6xl grid gap-8 px-6 sm:grid-cols-1 md:grid-cols-3 text-center">
          {Sitem.map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              <Image
                src={item.image}
                alt={item.Head}
                width={48}
                height={48}
                className="mb-3"
              />
              <h3 className="text-lg font-semibold text-white">
                {item.Head}
              </h3>
              <p className="mt-1 text-sm text-white/90 max-w-xs">
                {item.contact}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 2️⃣ location-icon-footer + QR + SOCIAL ===== */}
      <div className="bg-white border-t">
        <div className="mx-auto max-w-7xl px-6 py-10 grid gap-10 md:grid-cols-3 items-center">
          {/* location-icon-footer */}
          <Image
            src="/images/Logo.svg.png"
            alt="DriverX Mobile"
            width={180}
            height={50}
          />

          {/* QR + App buttons */}
          <div className="flex items-center gap-6 justify-center">
            <div className="relative w-[190px] h-[190px]">
  <Image
    src="/images/Group 1597883013.png"
    alt="QR Code"
    fill
    className="border rounded-lg object-contain"
  />

  <Image
    src="/images/vector.png"
    alt="vector"
    width={30}
    height={30}
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  />
</div>

             
            <div className="flex flex-col gap-3">
              <Image
                src="/images/Group 691314729.png"
                alt="App Store"
                width={140}
                height={42}
              />
              <Image
                src="/images/Group 691314728.png"
                alt="Google Play"
                width={140}
                height={42}
              />
            </div>
          </div>

          {/* Social */}
          <div className="text-center md:text-right">
            <h4 className="text-teal-700 font-semibold mb-3">
              Connect With Us
            </h4>
            <div className="flex justify-center md:justify-end gap-3">
             <a href="https://www.facebook.com/DriverXMobile/"> <SocialIcon Icon={FaFacebookF} /></a>
             <a href="https://www.instagram.com/driverx_mobile/"> <SocialIcon Icon={FaInstagram} /></a>
         <a href="https://www.pinterest.com/driverx_mobile/">     <SocialIcon Icon={FaXTwitter} /></a>
        <a href="https://www.linkedin.com/uas/login?session_redirect=%2Fcompany%2F106760019%2F"> <SocialIcon Icon={FaLinkedinIn} /></a>
             <a href="https://www.youtube.com/@DriverXMobile"><SocialIcon Icon={FaYoutube} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 3️⃣ FOOTER LINKS ===== */}
      <div className="bg-white border-t">
        <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 sm:grid-cols-2 md:grid-cols-5 text-sm">
          <FooterColumn
            title="About Us"
            links={[
              "Company Overview",
              "Our Mission & Values",
              "Leadership Team",
              "Careers",
              "Press & Media",
            ]}
          />

          <FooterColumn
            title="Our Solutions"
            links={[
              "Fleet & Logistics",
              "Connectivity",
              "Gig & Delivery Driver Plans",
              "Telematics & IoT",
              "Integrations",
              "Become a DriverX Partner",
            ]}
          />

          <FooterColumn
            title="Support & Resources"
            links={[
              "24/7 Driver Support",
              "Fleet Priority Line",
              "Coverage Maps",
              "FAQs & Self Service",
              "Accessibility & Language Options",
            ]}
          />

          <FooterColumn
            title="Security & Compliance"
            links={[
              "PCI DSS Payments",
              "GDPR, CCPA, CPRA",
              "Compliance",
              "E911, DOT & FMCSA",
              "SOC 2 Cybersecurity Controls",
            ]}
          />

          <FooterColumn
            title="Trust & Transparency"
            links={[
              "Network Coverage & Performance",
              "Refund & Service Guarantees",
              "Terms of Service & Legal",
              "Privacy Policy",
              "Cookie Preferences & Opt-Out",
            ]}
          />
        </div>
      </div>

      {/* ===== 4️⃣ COPYRIGHT BAR ===== */}
      <div className="bg-teal-800 text-white text-sm text-center px-6 py-4">
        © 2025 DriverX Mobile. DriverX Mobile is a trading name for DriverX Mobile
        Inc., a wholly owned subsidiary of Zoiko Communications Group Inc. All
        rights reserved.
      </div>
    </footer>
  );
};

export default Bottom;

/* ---------- SMALL COMPONENTS ---------- */

const FooterColumn = ({ title, links }) => (
  <div>
    <h5 className="text-teal-700 font-semibold mb-4">{title}</h5>
    <ul className="space-y-2 text-gray-600">
      {links.map((link, i) => (
        <li key={i} className="hover:text-teal-700 cursor-pointer">
          {link}
        </li>
      ))}
    </ul>
  </div>
);

const SocialIcon = ({ Icon }) => (
  <div className="h-9 w-9 flex items-center justify-center rounded-full bg-teal-700 text-white hover:bg-teal-600 transition cursor-pointer">
    <Icon size={16} />
  </div>
);