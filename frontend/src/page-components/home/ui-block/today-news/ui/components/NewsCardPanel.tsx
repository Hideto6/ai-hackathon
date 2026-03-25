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
        <CardContent className="pt-0">
          <div className="overflow-hidden rounded-xl border border-dashed border-border bg-muted/40">
            <div className="grid aspect-[16/9] place-items-center px-4 text-center text-sm text-muted-foreground">
              {article.thumbnail.placeholderText}
            </div>
          </div>
        </CardContent>
        <CardHeader className="gap-3 pt-0">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="outline" className={theme.badgeClassName}>
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
