"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { newsCategoryTheme } from "@/entities/news/model/category-theme";
import type { NewsEntity } from "@/entities/news/model/types";
import { ArrowUpRight, Bookmark } from "lucide-react";

import { Badge } from "@/shared/ui/shadcn/ui/badge";
import { Button } from "@/shared/ui/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/ui/card";
import { cn } from "@/shared/ui/shadcn/lib/utils";

interface NewsCardPanelProps {
  article: NewsEntity;
  onToggleSaved: (newsId: string, saved: boolean) => void;
  showSaveButton?: boolean;
  eagerImage?: boolean;
  saveButtonPosition?: "footer" | "header";
}

export function NewsCardPanel({
  article,
  onToggleSaved,
  showSaveButton = true,
  eagerImage = false,
  saveButtonPosition = "header",
}: NewsCardPanelProps) {
  const [isSaved, setIsSaved] = useState(article.isSaved ?? false);
  const theme = newsCategoryTheme[article.category] ?? {
    lineClassName: "bg-gray-500",
    badgeClassName: "border-gray-200 bg-gray-50 text-gray-700",
  };
  const thumbnailImageUrl = article.thumbnail?.imageUrl;
  const showHeaderSaveButton = showSaveButton && saveButtonPosition === "header";
  const showFooterSaveButton = showSaveButton && saveButtonPosition === "footer";
  const saveButton = showSaveButton ? (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("pointer-events-auto size-12", isSaved && "text-blue-600")}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const next = !isSaved;
        setIsSaved(next);
        onToggleSaved(article.id, next);
      }}
    >
      <Bookmark className={cn("size-6", isSaved && "fill-blue-600 text-blue-600")} />
      <span className="sr-only">{isSaved ? "保存済み" : "保存する"}</span>
    </Button>
  ) : null;

  return (
    <Card className="relative flex flex-col gap-3 overflow-hidden transition-transform duration-150 hover:-translate-y-0.5">
      <Link
        href={`/news/${article.id}`}
        aria-label={`${article.headline} を開く`}
        className="absolute inset-0 z-10 rounded-[inherit]"
      />
      <div className={cn("absolute inset-y-0 left-0 w-1.5", theme.lineClassName)} />
      <CardContent className="pointer-events-none pt-0">
        <div className="overflow-hidden rounded-xl bg-muted/40">
          {thumbnailImageUrl ? (
            <div className="relative aspect-[16/9]">
              <Image
                src={thumbnailImageUrl}
                alt={article.thumbnail.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={eagerImage}
              />
            </div>
          ) : (
            <div className="aspect-[16/9]" />
          )}
        </div>
      </CardContent>
      <CardHeader className="pointer-events-none gap-3 pt-0">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline" className={theme.badgeClassName}>
            {article.category}
          </Badge>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{article.timestamp}</span>
            {showHeaderSaveButton ? saveButton : null}
          </div>
        </div>
        <CardTitle className="text-base font-semibold leading-relaxed">
          {article.headline}
        </CardTitle>
      </CardHeader>
      <CardContent className="pointer-events-none pt-0 pb-1">
        <div
          className={cn(
            "relative z-20 flex items-center pt-3",
            showFooterSaveButton ? "justify-between" : "justify-start"
          )}
        >
        {showFooterSaveButton ? saveButton : null}
        <span className="pointer-events-none flex items-center gap-1 text-sm font-medium text-foreground">
          開く
          <ArrowUpRight className="size-4" />
        </span>
        </div>
      </CardContent>
    </Card>
  );
}
