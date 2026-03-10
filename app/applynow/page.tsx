import { Suspense } from "react";
import ApplyNow from "./applynow";



export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
    <ApplyNow/>
    </Suspense>
  );
}