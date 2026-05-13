import Postpaidplans from "./Postpaidplans";

export const metadata = {
  title: "Best Postpaid Phone Plans for Drivers | DriverX Mobile",
  description:
    "DriverX offers postpaid phone plans for drivers starting at $29/mo with data, hotspot, and international features. No contracts, 24/7 support.",
  keywords: ["postpaid phone plans", "DriverX postpaid plans", "mobile plans for drivers", "unlimited data plans"],
};

export default function PostpaidPlansPage() {
  return (
    <div className="dark:text-white dark:bg-gray-900">
      <Postpaidplans />
    </div>
  );
}