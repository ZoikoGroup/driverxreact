import ActivationSection from "./ActivationSection";

export const metadata = {
  title: "Instant Activate Your eSIM or pSIM | DriverX Mobile",
  description:
    "DriverX offers instant activation for eSIM and pSIM. Stay connected with Tier-1 AT&T & T-Mobile coverage, no contracts, and smooth gig app support.",
};

export default function Page() {
  return (
    <div className="dark:bg-gray-900 dark:text-white">
      <ActivationSection />
    </div>
  );
}