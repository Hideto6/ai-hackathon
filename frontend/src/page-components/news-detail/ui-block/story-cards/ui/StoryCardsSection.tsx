"use client";

import { useState } from "react";
import type { ReactNode } from "react";

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

export function StoryCardsSection({
  article,
  onSelectTerm,
}: StoryCardsSectionProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const currentCard = article.cards[currentCardIndex];
  const isFirstCard = currentCardIndex === 0;
  const isLastCard = currentCardIndex === article.cards.length - 1;

  const goPrev = () => {
    setCurrentCardIndex((current) => Math.max(current - 1, 0));
  };

  const goNext = () => {
    setCurrentCardIndex((current) =>
      Math.min(current + 1, article.cards.length - 1),
    );
  };

  const renderBody = (
    body: string,
    terms: GlossaryTermEntity[] | undefined,
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
                className="font-medium underline decoration-muted-foreground/60 underline-offset-4 transition-colors hover:text-foreground"
              >
                {term.term}
              </button>,
            );
          }

          return parts;
        });
      });
    }

    return <p>{segments}</p>;
  };

  return (
    <section className="space-y-4">
      <div className="flex gap-2">
        {article.cards.map((card, index) => (
          <div
            key={card.label}
            className="h-1 flex-1 overflow-hidden rounded-full bg-muted"
          >
            <div
              className={cn(
                "h-full bg-foreground transition-all",
                index <= currentCardIndex ? "w-full" : "w-0",
              )}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <Badge variant="outline">{article.category}</Badge>
        <span className="text-xs text-muted-foreground">
          {article.timestamp}
        </span>
      </div>
      <Card
        className="min-h-[320px] justify-between"
        onTouchStart={(event) => {
          setTouchEnd(null);
          setTouchStart(event.targetTouches[0]?.clientX ?? null);
        }}
        onTouchMove={(event) => {
          setTouchEnd(event.targetTouches[0]?.clientX ?? null);
        }}
        onTouchEnd={() => {
          if (touchStart === null || touchEnd === null) {
            return;
          }

          const distance = touchStart - touchEnd;

          if (distance > 50) {
            goNext();
          }

          if (distance < -50) {
            goPrev();
          }
        }}
      >
        <CardHeader className="gap-3">
          <p className="text-sm text-muted-foreground">{currentCard.label}</p>
          <CardTitle className="text-2xl leading-tight">
            {currentCard.headline}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-0 text-base leading-8 text-muted-foreground">
          {renderBody(currentCard.body, currentCard.highlightedTerms)}
        </CardContent>
        <CardContent className="flex items-center justify-between gap-3 pt-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={goPrev}
            disabled={isFirstCard}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goNext}
            disabled={isLastCard}
          >
            <ChevronRight className="size-5" />
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
