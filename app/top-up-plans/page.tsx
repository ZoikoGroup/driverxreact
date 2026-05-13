import Topupplans from "./Topupplans";

export const metadata = {
  title: "Best Mobile Phone Top-Up Plans for Drivers | DriverX Mobile",
  description:
    "Need more data? DriverX Top-Up Plans offer 3GB or 6GB of high-speed data starting at $8.99. Stackable, 30-day add-ons perfect for gig drivers on the go.",
  keywords: [
    "mobile phone top up plans",
    "DriverX top up plans",
    "data add-on plans",
    "mobile recharge add-ons",
  ],
};

export default function TopUpPlansPage() {
  return (
    <div className="dark:bg-gray-950">
      <Topupplans />
    </div>
  );
}