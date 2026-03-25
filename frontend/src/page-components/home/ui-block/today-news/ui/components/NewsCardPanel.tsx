import Link from "next/link";

import type { NewsEntity } from "@/entities/news/model/types";
import { ArrowRight, Bookmark } from "lucide-react";

import { Badge } from "@/shared/ui/shadcn/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/shadcn/ui/card";

interface NewsCardPanelProps {
  article: NewsEntity;
}

export function NewsCardPanel({ article }: NewsCardPanelProps) {
  return (
    <Link href={`/news/${article.id}`} className="block">
      <Card className="gap-3 transition-transform duration-150 hover:-translate-y-0.5">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="outline">{article.category}</Badge>
            <span className="text-xs text-muted-foreground">{article.timestamp}</span>
          </div>
          <CardTitle className="text-base font-semibold leading-relaxed">
            {article.headline}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm leading-6 text-muted-foreground">
          {article.cards[0]?.body}
        </CardContent>
        <CardFooter className="justify-between py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {article.isSaved ? <Bookmark className="size-3.5 fill-current" /> : null}
            3カードで読む
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-foreground">
            開く
            <ArrowRight className="size-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
