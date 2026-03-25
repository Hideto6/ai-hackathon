"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import type { GlossaryTermEntity } from "@/entities/glossary-term/model/types";
import type { StoryCardsSectionProps } from "@/page-components/news-detail/model/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/shared/ui/shadcn/ui/badge";
import { Button } from "@/shared/ui/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/ui/card";
import { cn } from "@/shared/ui/shadcn/lib/utils";

export function StoryCardsSection({
  article,
  onSelectTerm,
  onCompletionChange,
}: StoryCardsSectionProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);

  const isFirstCard = currentCardIndex === 0;
  const isLastCard = currentCardIndex === article.cards.length - 1;
  const visibleCards = article.cards.slice(currentCardIndex, currentCardIndex + 3);

  const goPrev = () => {
    setCurrentCardIndex((current) => {
      const next = Math.max(current - 1, 0);
      onCompletionChange(next === article.cards.length - 1);
      return next;
    });
  };

  const goNext = () => {
    setCurrentCardIndex((current) => {
      const next = Math.min(current + 1, article.cards.length - 1);
      onCompletionChange(next === article.cards.length - 1);
      return next;
    });
  };

  const resetDrag = () => {
    setStartX(null);
    setDragX(0);
    setIsDragging(false);
  };

  const finishSwipe = (direction: "left" | "right") => {
    if (isLastCard) {
      resetDrag();
      return;
    }

    setIsDragging(false);
    setDragX(direction === "right" ? 420 : -420);

    window.setTimeout(() => {
      goNext();
      resetDrag();
    }, 180);
  };

  const handleDragStart = (clientX: number) => {
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (startX === null) {
      return;
    }

    setDragX(clientX - startX);
  };

  const handleDragEnd = () => {
    if (startX === null) {
      return;
    }

    if (Math.abs(dragX) > 90) {
      finishSwipe(dragX > 0 ? "right" : "left");
      return;
    }

    resetDrag();
  };

  const renderBody = (
    body: string,
    terms: GlossaryTermEntity[] | undefined
  ) => {
    if (!terms?.length) {
      return <p>{body}</p>;
    }

    let segments: Array<string | ReactNode> = [body];

    for (const term of terms) {
      segments = segments.flatMap((segment, index) => {
        if (typeof segment !== "string") {
          return [segment];
        }

        const fragments = segment.split(term.term);

        if (fragments.length === 1) {
          return [segment];
        }

        return fragments.flatMap((fragment, fragmentIndex) => {
          const parts: Array<string | ReactNode> = [];

          if (fragment) {
            parts.push(fragment);
          }

          if (fragmentIndex < fragments.length - 1) {
            parts.push(
              <button
                key={`${term.id}-${index}-${fragmentIndex}`}
                type="button"
                onClick={() => onSelectTerm(term)}
                data-term-trigger="true"
                className="font-medium underline decoration-muted-foreground/60 underline-offset-4 transition-colors hover:text-foreground"
              >
                {term.term}
              </button>
            );
          }

          return parts;
        });
      });
    }

    return <p>{segments}</p>;
  };

  return (
    <section className="flex flex-1 flex-col justify-center space-y-5">
      <div className="flex gap-2">
        {article.cards.map((card, index) => (
          <div key={card.label} className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full bg-foreground transition-all",
                index <= currentCardIndex ? "w-full" : "w-0"
              )}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <Badge variant="outline">{article.category}</Badge>
        <span className="text-xs text-muted-foreground">{article.timestamp}</span>
      </div>
      <div className="relative mx-auto h-[500px] w-full max-w-[360px]">
        {visibleCards
          .map((card, stackIndex) => {
            const isTopCard = stackIndex === 0;
            const stackOffset = stackIndex * 12;
            const stackScale = 1 - stackIndex * 0.04;
            const overlayOpacity = Math.min(Math.abs(dragX) / 120, 1);

            return (
              <Card
                key={`${card.label}-${currentCardIndex + stackIndex}`}
                className={cn(
                  "absolute inset-x-0 top-0 min-h-[440px] justify-between border border-zinc-300 bg-white shadow-[0_18px_44px_rgba(0,0,0,0.16)]",
                  isTopCard && "touch-none select-none",
                  !isTopCard && "pointer-events-none"
                )}
                style={{
                  zIndex: 30 - stackIndex,
                  transform: isTopCard
                    ? `translate3d(${dragX}px, 0, 0) rotate(${dragX / 18}deg)`
                    : `translate3d(0, ${stackOffset}px, 0) scale(${stackScale})`,
                  opacity: isTopCard ? 1 : 1 - stackIndex * 0.12,
                  transition: isDragging
                    ? "none"
                    : "transform 180ms ease, opacity 180ms ease",
                }}
                onMouseDown={
                  isTopCard
                    ? (event) => {
                        const target = event.target as HTMLElement;

                        if (target.closest("[data-term-trigger='true']")) {
                          return;
                        }

                        handleDragStart(event.clientX);
                      }
                    : undefined
                }
                onMouseMove={
                  isTopCard
                    ? (event) => handleDragMove(event.clientX)
                    : undefined
                }
                onMouseUp={isTopCard ? handleDragEnd : undefined}
                onMouseLeave={isTopCard && isDragging ? handleDragEnd : undefined}
                onTouchStart={
                  isTopCard
                    ? (event) => {
                        const target = event.target as HTMLElement;

                        if (target.closest("[data-term-trigger='true']")) {
                          return;
                        }

                        handleDragStart(event.touches[0]?.clientX ?? 0);
                      }
                    : undefined
                }
                onTouchMove={
                  isTopCard
                    ? (event) => handleDragMove(event.touches[0]?.clientX ?? 0)
                    : undefined
                }
                onTouchEnd={isTopCard ? handleDragEnd : undefined}
                onTouchCancel={isTopCard ? resetDrag : undefined}
              >
                {isTopCard ? (
                  <>
                    <div
                      className="pointer-events-none absolute left-4 top-4 rounded-md border border-emerald-500 px-3 py-1 text-xl font-bold text-emerald-500"
                      style={{ opacity: dragX > 0 ? overlayOpacity : 0 }}
                    >
                      なるほど
                    </div>
                    <div
                      className="pointer-events-none absolute right-4 top-4 rounded-md border border-rose-500 px-3 py-1 text-xl font-bold text-rose-500"
                      style={{ opacity: dragX < 0 ? overlayOpacity : 0 }}
                    >
                      つぎへ
                    </div>
                  </>
                ) : null}
                <CardHeader className="gap-3 pt-6">
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <CardTitle className="text-[1.9rem] leading-tight">
                    {card.headline}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-0 text-lg leading-8 text-muted-foreground">
                  {renderBody(card.body, card.highlightedTerms)}
                </CardContent>
                <CardContent className="pt-0 text-xs text-muted-foreground">
                  {isTopCard
                    ? isLastCard
                      ? "最後のカードです"
                      : "左右にスワイプしてカードを捲れます"
                    : "次に見えるカード"}
                </CardContent>
              </Card>
            );
          })
          .reverse()}
      </div>
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="icon" onClick={goPrev} disabled={isFirstCard}>
          <ChevronLeft className="size-5" />
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          {currentCardIndex + 1} / {article.cards.length}
        </p>
        <Button variant="ghost" size="icon" onClick={goNext} disabled={isLastCard}>
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </section>
  );
}
