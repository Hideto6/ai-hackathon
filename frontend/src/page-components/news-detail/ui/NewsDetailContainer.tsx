"use client";

import { useEffect, useMemo, useState } from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import type { GlossaryTermEntity } from "@/entities/glossary-term/model/types";
import type { NewsEntity } from "@/entities/news/model/types";
import { getNewsDetailModel } from "@/page-components/news-detail/dummy-data/news";
import { setHomeNewsSaved, homeDemoNewsItems } from "@/page-components/home/dummy-data/news";
import { GlossaryPopoverSection } from "@/page-components/news-detail/ui-block/glossary-popover/ui/GlossaryPopoverSection";
import { RecommendationSection } from "@/page-components/news-detail/ui-block/recommendation/ui/RecommendationSection";
import { StoryCardsSkeleton } from "@/page-components/news-detail/ui-block/story-cards/skeleton/StoryCardsSkeleton";
import { StoryCardsSection } from "@/page-components/news-detail/ui-block/story-cards/ui/StoryCardsSection";
import { AiChatFab } from "@/features/ai-chat/ui/AiChatFab";
import { AiChatModal } from "@/features/ai-chat/ui/AiChatModal";
import { useChat } from "@/features/ai-chat/hooks/useChat";
import { ArrowLeft, Bookmark } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/ui/button";

function getRelatedArticles(currentArticle: NewsEntity, allArticles: NewsEntity[]): NewsEntity[] {
  // 今読んでいる記事のキーワードセットを作成
  const currentText = [
    currentArticle.headline,
    ...currentArticle.cards.map(c => c.headline + ' ' + c.body)
  ].join(' ');
  
  const stopWords = new Set(['は','が','を','に','の','で','と','も','や','へ','から','まで','より','た','て','し','する','ある','いる','なる','れる','られる','です','ます','ない','この','その','あの','どの']);
  
  const currentKeywords = new Set(
    currentText
      .replace(/[\u{1F300}-\u{1FFFF}]/gu, '') // 絵文字除去
      .replace(/[ｦ-ﾟ]/g, '') // 半角カタカナ除去
      .replace(/[^\u3040-\u30FF\u4E00-\u9FFF\uFF21-\uFF5A\uFF10-\uFF19a-zA-Z0-9]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 2 && !stopWords.has(w))
  );

  // 候補記事をスコアリング
  const scored = allArticles
    .filter(a => String(a.id) !== String(currentArticle.id))
    .map(candidate => {
      let score = 0;
      
      // カテゴリー一致: +3点
      if (candidate.category === currentArticle.category) score += 3;
      
      // headlineキーワード一致: +2点
      const headlineWords = candidate.headline
        .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
        .replace(/[ｦ-ﾟ]/g, '')
        .split(/\s+/)
        .filter(w => w.length >= 2);
      if (headlineWords.some(w => currentKeywords.has(w))) score += 2;
      
      // body キーワード一致: +1点
      const bodyText = candidate.cards.map(c => c.body).join(' ');
      const bodyWords = bodyText.split(/\s+/).filter(w => w.length >= 2);
      if (bodyWords.some(w => currentKeywords.has(w))) score += 1;
      
      return { article: candidate, score };
    })
    .sort((a, b) => b.score - a.score || a.article.id.localeCompare(b.article.id));

  return scored.slice(0, 2).map(s => s.article);
}

export function NewsDetailContainer() {
  const router = useRouter();
  const params = useParams<{ newsId: string }>();
  const searchParams = useSearchParams();
  const initCompleted = searchParams?.get("completed") === "true";

  const [selectedTerm, setSelectedTerm] = useState<GlossaryTermEntity | null>(null);
  const detail = useMemo(() => getNewsDetailModel(params.newsId), [params.newsId]);
  const [isSaved, setIsSaved] = useState(detail?.article.isSaved ?? false);
  const [isReadingComplete, setIsReadingComplete] = useState(initCompleted);
  const [showRecommendations, setShowRecommendations] = useState(initCompleted);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const relatedArticles = useMemo(() => {
    if (!detail) return [];
    return getRelatedArticles(detail.article, homeDemoNewsItems);
  }, [detail]);

  const { messages, isLoading: isChatLoading, sendMessage, resetChat } = useChat(
    detail?.article ?? { id: "", category: "国際" as const, headline: "", timestamp: "", notificationHook: "", thumbnail: { alt: "" }, cards: [] }
  );

  useEffect(() => {
    resetChat();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsChatOpen(false);

    // 別の記事やパラメータ付きで遷移してきた場合は、URLの状態に合わせて初期化・リセットする
    const isCompleted = searchParams?.get("completed") === "true";
    setIsReadingComplete(isCompleted);
    setShowRecommendations(isCompleted);
  }, [params.newsId, searchParams, resetChat]);

  const handleCompletionChange = (completed: boolean) => {
    if (!completed) {
      if (isReadingComplete) {
        setIsReadingComplete(false);
        setShowRecommendations(false);
        window.history.replaceState({}, "", `/news/${params.newsId}`);
      }
      return;
    }

    if (!isReadingComplete) {
      setIsReadingComplete(true);
      setShowRecommendations(true);
      window.history.replaceState({}, "", `/news/${params.newsId}?completed=true`);
    }
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
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-background px-4 py-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Button variant="ghost" className="px-0" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
            戻る
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsSaved((current) => {
                const next = !current;
                setHomeNewsSaved(params.newsId, next);
                return next;
              });
            }}
            className="rounded-full"
          >
            <Bookmark
              className={isSaved ? "fill-blue-600 text-blue-600" : "text-muted-foreground"}
            />
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
                  ? "absolute inset-x-0 top-0 bottom-0 flex flex-col overflow-y-auto px-1 pb-16 pt-2"
                  : "pointer-events-none absolute inset-x-0 top-0 bottom-0 flex flex-col overflow-y-auto px-1 pb-16 pt-2"
              }
            >
              <RecommendationSection
                articles={relatedArticles}
                visible={showRecommendations}
              />
            </div>
          </div>
        )}
        {detail && !isChatOpen && (
          <AiChatFab onClick={() => setIsChatOpen(true)} />
        )}
        {detail && (
          <AiChatModal
            open={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            messages={messages}
            isLoading={isChatLoading}
            onSendMessage={sendMessage}
          />
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
