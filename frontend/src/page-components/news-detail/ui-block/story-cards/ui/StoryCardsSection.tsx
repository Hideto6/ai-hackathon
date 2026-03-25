"use client";

import { useState } from "react";
import { Fragment } from "react";
import { newsCategoryTheme } from "@/entities/news/model/category-theme";
import type { GlossaryTermEntity } from "@/entities/glossary-term/model/types";
import type { StoryCardsSectionProps } from "@/page-components/news-detail/model/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/shared/ui/shadcn/ui/badge";
import { Button } from "@/shared/ui/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/ui/card";
import { cn } from "@/shared/ui/shadcn/lib/utils";

function getInteractiveSegments(
  text: string,
  terms: GlossaryTermEntity[] | undefined
): Array<string | GlossaryTermEntity> {
  if (!terms?.length) {
    return [text];
  }

  const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
  const segments: Array<string | GlossaryTermEntity> = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    const matchedTerm = sortedTerms.find((term) =>
      text.startsWith(term.term, currentIndex)
    );

    if (!matchedTerm) {
      let nextIndex = currentIndex + 1;
      while (
        nextIndex < text.length &&
        !sortedTerms.some((term) => text.startsWith(term.term, nextIndex))
      ) {
        nextIndex += 1;
      }
      segments.push(text.slice(currentIndex, nextIndex));
      currentIndex = nextIndex;
      continue;
    }

    segments.push(matchedTerm);
    currentIndex += matchedTerm.term.length;
  }

  return segments;
}

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
  const theme = newsCategoryTheme[article.category];

  const resetDrag = () => {
    setStartX(null);
    setDragX(0);
    setIsDragging(false);
  };

  const completeStory = (direction: "left" | "right") => {
    setIsDragging(false);
    setDragX(direction === "right" ? 420 : -420);

    window.setTimeout(() => {
      onCompletionChange(true);
      resetDrag();
    }, 180);
  };

  const goPrev = () => {
    setCurrentCardIndex((current) => Math.max(current - 1, 0));
    onCompletionChange(false);
    resetDrag();
  };

  const goNext = () => {
    if (isLastCard) {
      completeStory("left");
      return;
    }

    setCurrentCardIndex((current) =>
      Math.min(current + 1, article.cards.length - 1)
    );
    onCompletionChange(false);
    resetDrag();
  };

  const finishSwipe = (direction: "left" | "right") => {
    if (isLastCard) {
      completeStory(direction);
      return;
    }

    setIsDragging(false);
    setDragX(direction === "right" ? 420 : -420);

    window.setTimeout(() => {
      setCurrentCardIndex((current) =>
        Math.min(current + 1, article.cards.length - 1)
      );
      onCompletionChange(false);
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

  const renderInteractiveText = (
    text: string,
    terms: GlossaryTermEntity[] | undefined
  ) => {
    const segments = getInteractiveSegments(text, terms);

    return segments.map((segment, index) => {
      if (typeof segment === "string") {
        return (
          <Fragment key={`${segment}-${index}`}>{segment}</Fragment>
        );
      }

      return (
        <button
          key={`${segment.id}-${index}`}
          type="button"
          onClick={() => onSelectTerm(segment)}
          data-term-trigger="true"
          className="rounded-md bg-primary/10 px-1.5 py-0.5 font-medium text-foreground underline decoration-primary/50 underline-offset-4 transition-colors hover:bg-primary/15"
        >
          {segment.term}
        </button>
      );
    });
  };

  return (
    <section className="flex flex-1 flex-col justify-center space-y-5">
      <div className="flex gap-2">
        {article.cards.map((card, index) => (
          <div
            key={card.label}
            className="h-1 flex-1 overflow-hidden rounded-full bg-muted"
          >
            <div
              className={cn(
                "h-full transition-all",
                index <= currentCardIndex ? theme.lineClassName : "bg-foreground/15"
              )}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Badge variant="outline" className={theme.badgeClassName}>
          {article.category}
        </Badge>
        <span className="text-xs text-muted-foreground">{article.timestamp}</span>
      </div>

      <div className="relative mx-auto h-[500px] w-full max-w-[360px]">
        {visibleCards
          .map((card, stackIndex) => {
            const isTopCard = stackIndex === 0;
            const stackOffset = stackIndex * 12;
            const stackScale = 1 - stackIndex * 0.04;
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
                        if (target.closest("[data-term-trigger='true']")) return;
                        handleDragStart(event.clientX);
                      }
                    : undefined
                }
                onMouseMove={
                  isTopCard ? (event) => handleDragMove(event.clientX) : undefined
                }
                onMouseUp={isTopCard ? handleDragEnd : undefined}
                onMouseLeave={isTopCard && isDragging ? handleDragEnd : undefined}
                onTouchStart={
                  isTopCard
                    ? (event) => {
                        const target = event.target as HTMLElement;
                        if (target.closest("[data-term-trigger='true']")) return;
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
                <CardHeader className="gap-3 pt-6">
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <CardTitle className="text-[1.9rem] leading-tight">
                    {renderInteractiveText(
                      card.headline,
                      card.headlineHighlightedTerms
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-0 text-lg leading-8 text-muted-foreground">
                  <p>{renderInteractiveText(card.body, card.highlightedTerms)}</p>
                </CardContent>
              </Card>
            );
          })
          .reverse()}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={goPrev}
          disabled={isFirstCard}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          {currentCardIndex + 1} / {article.cards.length}
        </p>
        <Button type="button" variant="ghost" size="icon" onClick={goNext}>
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </section>
  );
}
