import { Suspense } from "react";
import ApplyNow from "./applynow";



export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
    <ApplyNow/>
    </Suspense>
  );
}