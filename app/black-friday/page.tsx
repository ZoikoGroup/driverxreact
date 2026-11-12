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
