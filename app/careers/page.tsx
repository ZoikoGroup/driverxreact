import CareersSection from "./careers";
import Openings from "./Openings";
import SearchSection from "./SearchSection";

export const metadata = {
  title: "Careers at DriverX Mobile | Join Our Innovation Team",
  description:
    "Join DriverX Mobile to build tech that powers gig and fleet drivers. Explore careers in software, IoT, ops, and more—startup energy, global support.",
};

export default function Careers() {
  return (
    <>
      <CareersSection />
      <Openings />
      <SearchSection />
    </>
  );
}