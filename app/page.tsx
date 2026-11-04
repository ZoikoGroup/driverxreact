import {
  HeroSection,
  BuiltForSection,
  DriveTypeSection,
  PlansSection,
  CoverageSection,
  GetConnectedSection,
  DataOnlySection,
  OnTheMoveSection,
  BusinessFleetSection,
  PartnerBannerSection,
  DriverBenefitsSection,
  MyDriverXSection,
  WhyDriverXSection,
  SupportSection,
  FAQSection,
  ResourcesSection,
  NextSection,
} from "./components/home";
export const metadata = {
  title: "DriverX Mobile | AI-Powered Data Plans for Drivers",
  description:
    "DriverX Mobile offers the AI-Powered Data Plans for Drivers —prepaid, postpaid, business plans, and exclusive perks. Track your savings & stay connected 24/7.",
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BuiltForSection />
      <DriveTypeSection />
      <PlansSection />
      <CoverageSection />
      <GetConnectedSection />
      <DataOnlySection />
      <OnTheMoveSection />
      <BusinessFleetSection />
      <PartnerBannerSection />
      <DriverBenefitsSection />
      <MyDriverXSection />
      <WhyDriverXSection />
      <SupportSection />
      <FAQSection />
      <ResourcesSection />
      <NextSection />
    </main>
  );
}
