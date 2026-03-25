"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { newsCategoryTheme } from "@/entities/news/model/category-theme";
import type { NewsEntity } from "@/entities/news/model/types";
import { Search, ArrowRight } from "lucide-react";

import { Badge } from "@/shared/ui/shadcn/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/shared/ui/shadcn/ui/card";
import { cn } from "@/shared/ui/shadcn/lib/utils";

interface SearchSectionProps {
  articles: NewsEntity[];
  query: string;
  onQueryChange: (query: string) => void;
}

function searchArticles(articles: NewsEntity[], query: string): NewsEntity[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  return articles.filter((article) => {
    if (article.headline.toLowerCase().includes(normalizedQuery)) return true;
    if (article.category.toLowerCase().includes(normalizedQuery)) return true;

    for (const card of article.cards) {
      if (card.headline.toLowerCase().includes(normalizedQuery)) return true;
      if (card.body.toLowerCase().includes(normalizedQuery)) return true;
    }

    return false;
  });
}

export function SearchSection({
  articles,
  query,
  onQueryChange,
}: SearchSectionProps) {
  const results = useMemo(() => searchArticles(articles, query), [articles, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <section className="flex flex-1 flex-col gap-4 px-4 pb-24 pt-4">
      {/* 検索バー */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="キーワードで記事を検索..."
          className="h-11 w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 text-sm text-black placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* 検索結果 */}
      {!hasQuery ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
          <Search className="size-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            キーワードを入力してください
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            該当する記事が見つかりませんでした
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {results.length}件の記事が見つかりました
          </p>
          {results.map((article) => {
            const theme = newsCategoryTheme[article.category];
            const thumbnailImageUrl = article.thumbnail?.imageUrl;

            return (
              <Link key={article.id} href={`/news/${article.id}`} className="block">
                <Card className="relative gap-3 overflow-hidden transition-transform duration-150 hover:-translate-y-0.5">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 w-1.5",
                      theme.lineClassName,
                    )}
                  />
                  <CardContent className="pt-0">
                    <div className="overflow-hidden rounded-xl border border-dashed border-border bg-muted/40">
                      {thumbnailImageUrl ? (
                        <div className="relative aspect-[16/9]">
                          <Image
                            src={thumbnailImageUrl}
                            alt={article.thumbnail.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="grid aspect-[16/9] place-items-center px-4 text-center text-sm text-muted-foreground">
                          {article.thumbnail?.placeholderText ??
                            "画像を配置してください"}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardHeader className="gap-3 pt-0">
                    <div className="flex items-center justify-between gap-3">
                      <Badge
                        variant="outline"
                        className={theme.badgeClassName}
                      >
                        {article.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {article.timestamp}
                      </span>
                    </div>
                    <CardTitle className="text-base font-semibold leading-relaxed">
                      {article.headline}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="justify-end gap-2 py-3">
                    <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                      開く
                      <ArrowRight className="size-4" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
