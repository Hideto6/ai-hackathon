"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import type { GlossaryTermEntity } from "@/entities/glossary-term/model/types";
import { getNewsDetailModel } from "@/page-components/news-detail/dummy-data/news";
import { GlossaryPopoverSection } from "@/page-components/news-detail/ui-block/glossary-popover/ui/GlossaryPopoverSection";
import { RecommendationSection } from "@/page-components/news-detail/ui-block/recommendation/ui/RecommendationSection";
import { StoryCardsSkeleton } from "@/page-components/news-detail/ui-block/story-cards/skeleton/StoryCardsSkeleton";
import { StoryCardsSection } from "@/page-components/news-detail/ui-block/story-cards/ui/StoryCardsSection";
import { ArrowLeft, Bookmark } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/ui/button";

export function NewsDetailContainer() {
  const router = useRouter();
  const params = useParams<{ newsId: string }>();
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTermEntity | null>(null);
  const detail = useMemo(() => getNewsDetailModel(params.newsId), [params.newsId]);
  const [isSaved, setIsSaved] = useState(detail?.article.isSaved ?? false);
  const [isReadingComplete, setIsReadingComplete] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const recommendationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (recommendationTimerRef.current !== null) {
        window.clearTimeout(recommendationTimerRef.current);
      }
    };
  }, []);

  const handleCompletionChange = (completed: boolean) => {
    if (recommendationTimerRef.current !== null) {
      window.clearTimeout(recommendationTimerRef.current);
      recommendationTimerRef.current = null;
    }

    if (!completed) {
      setIsReadingComplete(false);
      setShowRecommendations(false);
      return;
    }

    setIsReadingComplete(true);
    recommendationTimerRef.current = window.setTimeout(() => {
      setShowRecommendations(true);
    }, 260);
  };

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
        <div className="mb-4 flex items-center justify-between gap-3">
          <Button variant="ghost" className="px-0" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
            戻る
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsSaved((current) => !current)}
            className="rounded-full"
          >
            <Bookmark className={isSaved ? "fill-current" : ""} />
            <span className="sr-only">{isSaved ? "保存済み" : "保存する"}</span>
          </Button>
        </div>
        {!detail ? (
          <StoryCardsSkeleton />
        ) : (
          <div className="relative flex flex-1 flex-col justify-center pb-10">
            <div
              className={
                isReadingComplete
                  ? "pointer-events-none opacity-0 transition-all duration-300"
                  : "opacity-100 transition-all duration-300"
              }
            >
              <StoryCardsSection
                article={detail.article}
                onSelectTerm={setSelectedTerm}
                onCompletionChange={handleCompletionChange}
              />
            </div>
            <div
              className={
                showRecommendations
                  ? "absolute inset-x-4 top-[72px] bottom-10 flex items-center justify-center"
                  : "pointer-events-none absolute inset-x-4 top-[72px] bottom-10 flex items-center justify-center"
              }
            >
              <RecommendationSection
                articles={detail.recommendations}
                visible={showRecommendations}
              />
            </div>
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
