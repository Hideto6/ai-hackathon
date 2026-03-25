import { Suspense } from "react";
import { HomeContainer } from "@/page-components/home/ui/HomeContainer";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted/30" />}>
      <HomeContainer />
    </Suspense>
  );
}
