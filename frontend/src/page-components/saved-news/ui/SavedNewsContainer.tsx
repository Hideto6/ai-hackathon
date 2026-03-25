"use client";

import Link from "next/link";

import { useMemo } from "react";

import { homeDemoNewsItems } from "@/page-components/home/dummy-data/news";
import { useSavedNews } from "@/features/save-news/model/useSavedNews";
import { ArrowLeft, ArrowUpRight, BookmarkX } from "lucide-react";

import { Badge } from "@/shared/ui/shadcn/ui/badge";
import { Button } from "@/shared/ui/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/ui/card";

export function SavedNewsContainer() {
  const { savedIds, isSaved, toggleSaved } = useSavedNews();

  const savedArticles = useMemo(() => {
    return homeDemoNewsItems.filter((article) => isSaved(article.id));
  }, [isSaved, savedIds]);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background px-4 py-4">
        <header className="space-y-2 border-b pb-4">
          <Button asChild variant="ghost" className="px-0">
            <Link href="/">
              <ArrowLeft className="size-4" />
              ホームへ戻る
            </Link>
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">
            保存したニュース
          </h1>
          <p className="text-sm text-muted-foreground">
            あとで読み返したいニュースを一覧で確認できます。
          </p>
        </header>

        <section className="flex-1 space-y-3 py-4 pb-8">
          {savedArticles.length === 0 ? (
            <Card className="border-dashed bg-muted/30">
              <CardHeader>
                <CardTitle className="text-base">
                  保存済みニュースはまだありません。
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                ニュース詳細画面の「保存する」ボタンからいつでも追加できます。
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm">
                  <Link href="/">ニュースを見に行く</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            savedArticles.map((article) => (
              <Card key={article.id} className="gap-3">
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
                <CardFooter className="justify-between gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSaved(article.id)}
                  >
                    <BookmarkX className="size-3.5" />
                    保存解除
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/news/${article.id}`}>
                      開く
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
