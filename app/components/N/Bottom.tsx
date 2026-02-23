"use client";

import { IconType } from "react-icons";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

/* =========================================================
   ✅ 1. ALL FOOTER LINKS LIVE HERE (EDIT ONLY THIS)
   ========================================================= */

const FOOTER_LINKS = [
  {
    title: "About Us",
    links: [
      { label: "Company Overview", href: "/about-us" },
      { label: "Our Mission & Values", href: "/about/mission-values" },
      { label: "Leadership Team", href: "/loginform" },
      { label: "Careers", href: "/about/careers" },
      { label: "Press & Media", href: "/about/press" },
    ],
  },
  {
    title: "Our Solutions",
    links: [
      { label: "Fleet & Logistics", href: "/driverpage/fleetsection" },
      { label: "Connectivity", href: "/solutions/connectivity" },
      { label: "Gig & Delivery Driver Plans", href: "/driverpage/gig" },
      { label: "Telematics & IoT", href: "/telematics-iot-integrations" },
      { label: "Integrations", href: "/solutions/integrations" },
      { label: "Become a DriverX Partner", href: "/become-a-driverx-partner" },
    ],
  },
  {
    title: "Support & Resources",
    links: [
      { label: "24/7 Driver Support", href: "/support/driver-support" },
      { label: "Fleet Priority Line", href: "/fleet-priority-line" },
      { label: "Coverage Maps", href: "/support/coverage" },
      { label: "FAQs & Self Service", href: "/support/faqs" },
      { label: "Accessibility & Language Options", href: "/accessibility-language-options"}
    ],
  },
  {
    title: "Security & Compliance",
    links: [
      { label: "PCI DSS Payments", href: "/pci-dss-payments" },
      { label: "GDPR, CCPA, CPRA", href: "/gdpr-ccpa-cpra-compliance" },
      { label: "E911, DOT & FMCSA", href: "/e911-dot-fmcsa-standards" },
      { label: "SOC 2 Cybersecurity Controls", href: "/soc-2-cybersecurity-controls" },
    ],
  },
  {
    title: "Trust & Transparency",
    links: [
      { label: "Network Coverage & Performance", href: "/network-coverage-performance" },
      { label: "Refund & Service Guarantees", href: "/refund-service-guarantees" },
      { label: "Terms of Service & Legal", href: "/terms-of-service-legal" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Cookie Preferences & Opt-Out", href: "cookie-preferences-opt-out" },
    ],
  },
];

/* =========================================================
   CONTACT STRIP DATA
   ========================================================= */

const CONTACT_ITEMS = [
  {
    id: 1,
    image: "/images/location-icon-footer.png",
    title: "Find Us",
    value: "418 Broadway, STE R, Albany, NY 12207",
  },
  {
    id: 2,
    image: "/images/email-icon-footer.png",
    title: "Mail us",
    value: "info@driverxmobile.com",
  },
  {
    id: 3,
    image: "/images/phone-icon-footer.png",
    title: "Contact us",
    value: "+1 (800) 399-0087",
  },
];

/* =========================================================
   TYPES
   ========================================================= */

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialIconProps {
  Icon: IconType;
}

/* =========================================================
   MAIN FOOTER
   ========================================================= */

const Bottom = () => {
  return (
    <footer className="w-full">
      {/* HEADER */}
      {/* ===== 0️⃣ GET IN TOUCH HEADER ===== */}
<div className="dark:bg-gray-900 bg-gray-100 py-10 text-center">
  <h2 className="text-4xl font-bold dark:text-teal-500 text-teal-800">
    Get in Touch
  </h2>
</div>
      {/* ===== 1️⃣ TOP CONTACT STRIP (UNCHANGED LOGIC) ===== */}
      <div className="bg-teal-800 dark:bg-teal-900 py-6">
        <div className="mx-auto max-w-6xl grid gap-8 px-6 sm:grid-cols-1 md:grid-cols-3 text-center">
          {CONTACT_ITEMS.map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              <Image
                src={item.image}
                alt={item.title}
                width={48}
                height={48}
                className="mb-3"
              />
              <h3 className="text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-white/90 max-w-xs">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 2️⃣ location-icon-footer + QR + SOCIAL ===== */}
      <div className="dark:bg-gray-900 bg-white border-t">
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
      <div className="bg-white dark:bg-gray-900 border-t">
        <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 sm:grid-cols-2 md:grid-cols-5 text-sm">
          {FOOTER_LINKS.map((section: FooterSection) => (
            <div key={section.title}>
              <h5 className="text-teal-700 font-semibold mb-4">
                {section.title}
              </h5>
              <ul className="space-y-2 dark:text-gray-300 text-gray-600">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-teal-700 transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="bg-teal-800 text-white text-sm text-center px-6 py-4">
        © 2025 DriverX Mobile. All rights reserved.
      </div>
    </footer>
  );
};

export default Bottom;

/* ---------- SMALL COMPONENTS ---------- */

interface FooterColumnProps {
  title: string;
  links: string[];
}

const FooterColumn = ({ title, links }: FooterColumnProps) => (
  <div>
    <h5 className="text-teal-700 dark:text-teal-500 font-semibold mb-4">{title}</h5>
    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
      {links.map((link, i) => (
        <li key={i} className="hover:text-teal-700 cursor-pointer">
          {link}
        </li>
      ))}
    </ul>
  </div>
);



interface SocialIconProps {
  Icon: IconType;
}

const SocialIcon = ({ Icon }: SocialIconProps) => (
  <div className="h-9 w-9 flex items-center justify-center rounded-full bg-teal-700 text-white hover:bg-teal-600 transition cursor-pointer">
    <Icon size={16} />
  </div>
);