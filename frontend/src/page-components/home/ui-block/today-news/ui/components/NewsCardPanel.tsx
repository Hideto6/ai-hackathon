import Link from "next/link";

import { newsCategoryTheme } from "@/entities/news/model/category-theme";
import type { NewsEntity } from "@/entities/news/model/types";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/shared/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/ui/card";
import { cn } from "@/shared/ui/shadcn/lib/utils";


interface NewsCardPanelProps {
  article: NewsEntity;
}

export function NewsCardPanel({ article }: NewsCardPanelProps) {
  const theme = newsCategoryTheme[article.category];

  return (
    <Link href={`/news/${article.id}`} className="block">
      <Card className="relative gap-3 overflow-hidden transition-transform duration-150 hover:-translate-y-0.5">
        <div className={cn("absolute inset-y-0 left-0 w-1.5", theme.lineClassName)} />
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="outline">{article.category}</Badge>
            <span className="text-xs text-muted-foreground">
              {article.timestamp}
            </span>
          </div>
          <CardTitle className="text-base font-semibold leading-relaxed">
            {article.headline}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm leading-6 text-muted-foreground">
          {article.cards[0]?.body}
        </CardContent>

        <CardFooter className="justify-end py-3">
          <div className="flex items-center gap-1 text-sm font-medium text-foreground">
            開く
            <ArrowRight className="size-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
