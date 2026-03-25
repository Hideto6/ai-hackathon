import Image from "next/image";
import Link from "next/link";

import { newsCategoryTheme } from "@/entities/news/model/category-theme";
import type { NewsEntity } from "@/entities/news/model/types";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/shared/ui/shadcn/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/ui/card";

interface RecommendationSectionProps {
  articles: NewsEntity[];
  visible: boolean;
}

export function RecommendationSection({
  articles,
  visible,
}: RecommendationSectionProps) {
  return (
    <section
      className={
        visible
          ? "mx-auto flex w-full max-w-[360px] flex-col justify-center space-y-4 translate-y-0 opacity-100 transition-all duration-500 ease-out"
          : "pointer-events-none mx-auto flex w-full max-w-[360px] flex-col justify-center space-y-4 translate-y-4 opacity-0 transition-all duration-300 ease-out"
      }
    >
      <div className="space-y-1">
        <h2 className="text-sm font-semibold">関連して気にしたいニュース</h2>
      </div>
      <div className="space-y-3">
        {articles.map((article) => (
          <Link key={article.id} href={`/news/${article.id}`} className="block">
            <Card size="sm" className="transition-transform duration-150 hover:-translate-y-0.5">
              <div className="overflow-hidden rounded-t-xl border-b border-border bg-muted/40">
                {article.thumbnail.imageUrl ? (
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={article.thumbnail.imageUrl}
                      alt={article.thumbnail.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 360px"
                    />
                  </div>
                ) : (
                  <div className="grid aspect-[16/9] place-items-center px-4 text-center text-sm text-muted-foreground">
                    {article.thumbnail.placeholderText}
                  </div>
                )}
              </div>
              <CardHeader className="gap-2">
                <div>
                  <Badge
                    variant="outline"
                    className={newsCategoryTheme[article.category].badgeClassName}
                  >
                    {article.category}
                  </Badge>
                </div>
                <CardTitle className="text-sm leading-6">{article.headline}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-0 text-xs text-muted-foreground">
                <span>{article.timestamp}</span>
                <span className="flex items-center gap-1">
                  開く
                  <ArrowUpRight className="size-3.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
