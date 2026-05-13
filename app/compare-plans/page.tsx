import DriverXPlans from "./DriverXPlans";

export const metadata = {
  title: "Compare All DriverX Plans | Gig, Fleet, Business & IoT",
  description:
    "Compare DriverX plans built for gig drivers, fleets, businesses, and IoT. Find the perfect plan with Tier-1 coverage, no contracts, and instant setup.",
};

export default function Page() {
  return (
    <div className="dark:bg-gray-900 dark:text-white">
      <DriverXPlans />
    </div>
  );
}