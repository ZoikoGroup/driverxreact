import { Suspense } from "react";
import JobsPage from "./JobsPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading jobs...</div>}>
      <JobsPage />
    </Suspense>
  );
}