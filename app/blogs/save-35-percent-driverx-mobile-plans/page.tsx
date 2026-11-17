import Blog5 from "../Blog5";
import Link from "next/link";

const PAGE_URL = "https://driverxmobile.com/blogs/save-35-percent-driverx-mobile-plans";
const HERO_IMAGE =
  "https://driverxmobile.com/images/new/DriverX-branded%20delivery%20vans%20parked%20at%20a%20logistics%20depot%20at%20sunrise.png";

const TITLE = "Drive Smarter and Save More: Get 35% Off DriverX Mobile Plans for Three Months";
const DESCRIPTION =
  "Discover how eligible customers can save 35% on DriverX Mobile eligible driver-plan charges for the first three months, with a potential activation-fee waiver for qualifying new lines.";

export const metadata = {
  title: "Get 35% Off DriverX Mobile Driver Plans for Three Months",
  description: DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "DriverX Mobile",
    images: [
      {
        url: HERO_IMAGE,
        width: 836,
        height: 443,
        alt: "DriverX Mobile branded delivery vans parked at a logistics depot at sunrise",
      },
    ],
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": `${PAGE_URL}#article`,
      headline: TITLE,
      description: DESCRIPTION,
      image: {
        "@type": "ImageObject",
        url: HERO_IMAGE,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": PAGE_URL,
      },
      url: PAGE_URL,
      author: {
        "@type": "Organization",
        name: "DriverX Mobile",
        url: "https://driverxmobile.com/",
      },
      publisher: {
        "@type": "Organization",
        name: "DriverX Mobile",
        url: "https://driverxmobile.com/",
      },
      datePublished: "2026-11-17",
      dateModified: "2026-11-17",
      about: [
        { "@type": "Thing", name: "Driver Mobile Plans" },
        { "@type": "Thing", name: "Mobile Connectivity for Drivers" },
        { "@type": "Thing", name: "35% Mobile Plan Discount" },
      ],
      keywords: [
        "DriverX Mobile",
        "Driver Mobile Plans",
        "35% Mobile Plan Discount",
        "Rideshare Driver Mobile Plans",
        "Delivery Driver Connectivity",
        "Gig Worker Mobile Plans",
        "Fleet Connectivity Solutions",
      ],
      inLanguage: "en",
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the DriverX Mobile 35% introductory offer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "DriverX Mobile's promotional offer provides eligible customers with 35% off eligible driver-plan charges for the first three months.",
          },
        },
        {
          "@type": "Question",
          name: "How long does the DriverX Mobile discount last?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The introductory discount applies to eligible driver-plan charges during the first three months, subject to the applicable promotional terms.",
          },
        },
        {
          "@type": "Question",
          name: "Does DriverX Mobile waive activation fees?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Eligible new lines may qualify for an activation-fee waiver where commercially approved. Customers should confirm eligibility before activation.",
          },
        },
        {
          "@type": "Question",
          name: "Who can benefit from DriverX Mobile plans?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "DriverX Mobile offers solutions for gig workers, delivery drivers, rideshare professionals, fleet operators and other mobile professionals.",
          },
        },
        {
          "@type": "Question",
          name: "Can I explore different DriverX Mobile plans?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Customers can explore prepaid, postpaid, business and data-only options through the official plans page.",
          },
        },
        {
          "@type": "Question",
          name: "Why is mobile connectivity important for delivery drivers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Delivery drivers use mobile connectivity for navigation, order management, customer communication and accessing delivery applications.",
          },
        },
        {
          "@type": "Question",
          name: "Where can I find more information about DriverX Mobile?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Visit https://driverxmobile.com/ to explore its services, available plans and contact information.",
          },
        },
      ],
    },
  ],
};

export default function Save35PercentDriverXMobilePlansPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-[#0b544e] text-white py-2.5 px-4 sm:px-6 border-b border-teal-800/40">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
          <Link
            href="/blogs"
            className="text-teal-200 hover:text-white font-semibold inline-flex items-center gap-1.5 transition"
          >
            <span>←</span> Back to All Guides
          </Link>
          <span className="text-teal-300/80 uppercase tracking-wider text-[11px] font-medium hidden sm:inline">
            OFFERS &amp; SAVINGS
          </span>
        </div>
      </div>
      <Blog5 />
    </>
  );
}
