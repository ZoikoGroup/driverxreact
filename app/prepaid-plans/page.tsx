import Prepaidplans from "./prepaidplans";

export const metadata = {
  title: "Affordable Prepaid Phone Plans | DriverX Mobile",
  description:
    "DriverX offers prepaid phone plans made for gig and fleet drivers. Enjoy reliable coverage, fast data, and flexible pricing with no long-term commitment.",
  keywords: ["prepaid phone plans", "DriverX prepaid plans", "no contract mobile plans", "fleet mobile plans"],
};

export default function PrepaidPlansPage() {
  return (
    <div className="dark:bg-gray-900 dark:text-white">
      <Prepaidplans />
    </div>
  );
}