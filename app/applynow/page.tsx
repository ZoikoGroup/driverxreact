import { Suspense } from "react";
import ApplyNow from "./applynow";

export const metadata = {
  alternates: {
    canonical: "https://driverxmobile.com/applynow",
  },
};

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
    <ApplyNow/>
    </Suspense>
  );
}