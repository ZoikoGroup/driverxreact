import { Audience } from "./components/Audience";
import { Faq } from "./components/Faq";
import { fontVariables } from "./components/fonts";
import { HowItWorks } from "./components/HowItWorks";
import { Included } from "./components/Included";
import { OfferConditions } from "./components/OfferConditions";
import { Pricing } from "./components/Pricing";
import { DowntimeSplit } from "./components/DowntimeSplit";
import { Hero } from "./components/Hero";
import { NewsletterSignup } from "./components/NewsletterSignup";

export const metadata = {
  title: "Black Friday Mobile Deals: Save Up to 40% | DriverX Mobile",
  description:
    "Save up to 40% on DriverX Mobile Black Friday deals. Explore flexible wireless plans, reliable connectivity and exclusive offers for drivers and businesses.",
  alternates: {
    canonical: "https://driverxmobile.com/black-friday",
  },
  openGraph: {
    title: "Black Friday Mobile Deals: Save Up to 40% | DriverX Mobile",
    description:
      "Save up to 40% on DriverX Mobile Black Friday deals. Explore flexible wireless plans, reliable connectivity and exclusive offers for drivers and businesses.",
    url: "https://driverxmobile.com/black-friday",
    siteName: "DriverX Mobile",
    type: "website",
  },
};

export default function BlackFridayPage() {
  return (
    <main
      id="main"
      className={`${fontVariables} overflow-x-clip bg-[#0c1a2b] font-[family-name:var(--font-public-sans)] text-[#edf2f5]`}
    >
      <Hero />
      <Pricing />
      <HowItWorks />
      <Audience />
      <DowntimeSplit />
      <Included />
      <OfferConditions />
      <Faq />
      <NewsletterSignup />
    </main>
  );
}
