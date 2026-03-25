"use client";

import { useMemo, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import type { GlossaryTermEntity } from "@/entities/glossary-term/model/types";
import { getNewsDetailModel } from "@/page-components/news-detail/dummy-data/news";
import { setHomeNewsSaved } from "@/page-components/home/dummy-data/news";
import { GlossaryPopoverSection } from "@/page-components/news-detail/ui-block/glossary-popover/ui/GlossaryPopoverSection";
import { RecommendationSection } from "@/page-components/news-detail/ui-block/recommendation/ui/RecommendationSection";
import { SaveActionSection } from "@/page-components/news-detail/ui-block/save-action/ui/SaveActionSection";
import { StoryCardsSkeleton } from "@/page-components/news-detail/ui-block/story-cards/skeleton/StoryCardsSkeleton";
import { StoryCardsSection } from "@/page-components/news-detail/ui-block/story-cards/ui/StoryCardsSection";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/ui/button";

export function NewsDetailContainer() {
  const router = useRouter();
  const params = useParams<{ newsId: string }>();
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTermEntity | null>(null);
  const detail = useMemo(() => getNewsDetailModel(params.newsId), [params.newsId]);
  const [isSaved, setIsSaved] = useState(detail?.article.isSaved ?? false);

  if (!detail) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-4">
        <p className="text-lg font-semibold">ニュースが見つかりませんでした。</p>
        <p className="text-sm text-muted-foreground">
          ダミーデータに存在しないため、一覧へ戻してください。
        </p>
        <Button onClick={() => router.push("/")}>ホームへ戻る</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background px-4 py-4">
        <div className="mb-4">
          <Button variant="ghost" className="px-0" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
            戻る
          </Button>
        </div>
        {!detail ? (
          <StoryCardsSkeleton />
        ) : (
          <div className="space-y-6 pb-10">
            <StoryCardsSection
              article={detail.article}
              onSelectTerm={setSelectedTerm}
            />
            <SaveActionSection
              isSaved={isSaved}
              onToggleSaved={() => {
                setIsSaved((current) => {
                  const next = !current;
                  setHomeNewsSaved(params.newsId, next);
                  return next;
                });
              }}
            />
            <RecommendationSection articles={detail.recommendations} />
          </div>
        )}
      </div>
      <GlossaryPopoverSection
        term={selectedTerm}
        open={selectedTerm !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTerm(null);
          }
        }}
      />
    </div>
  );
}
