import { Suspense } from "react";
import { NewsDetailContainer } from "@/page-components/news-detail/ui/NewsDetailContainer";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted/30" />}>
      <NewsDetailContainer />
    </Suspense>
  );
}
