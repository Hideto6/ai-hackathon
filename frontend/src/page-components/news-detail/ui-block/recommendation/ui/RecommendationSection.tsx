import Link from "next/link";

import type { NewsEntity } from "@/entities/news/model/types";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/ui/card";

interface RecommendationSectionProps {
  articles: NewsEntity[];
}

export function RecommendationSection({
  articles,
}: RecommendationSectionProps) {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold">関連して気にしたいニュース</h2>
        <p className="text-sm text-muted-foreground">
          つながりが見える2本だけに絞っています。
        </p>
      </div>
      <div className="space-y-3">
        {articles.map((article) => (
          <Link key={article.id} href={`/news/${article.id}`} className="block">
            <Card size="sm" className="transition-transform duration-150 hover:-translate-y-0.5">
              <CardHeader className="gap-2">
                <p className="text-xs text-muted-foreground">{article.category}</p>
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
