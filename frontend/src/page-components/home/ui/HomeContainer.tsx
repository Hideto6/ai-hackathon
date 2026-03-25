"use client";

import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import type { NewsCategory } from "@/entities/news/model/types";
import type { HomeCategory, HomeTab } from "@/page-components/home/model/types";
import {
  homeCategories,
  homeDemoNewsItems,
  setHomeNewsSaved,
} from "@/page-components/home/dummy-data/news";
import { HeroSection } from "@/page-components/home/ui-block/hero/ui/HeroSection";
import { SearchSection } from "@/page-components/home/ui-block/search/ui/SearchSection";
import { SettingsSection } from "@/page-components/home/ui-block/settings/ui/SettingsSection";
import { TodayNewsSection } from "@/page-components/home/ui-block/today-news/ui/TodayNewsSection";
import { BottomNavigation } from "@/widgets/bottom-navigation/ui/BottomNavigation";

const defaultEnabledCategories: NewsCategory[] = [
  "国際",
  "政治",
  "経済",
  "テクノロジー",
  "社会",
];

const defaultNotificationCategories: NewsCategory[] = [
  "国際",
  "政治",
  "経済",
  "テクノロジー",
  "社会",
];

export function HomeContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLから初期状態を取得
  const initialTab = (searchParams.get("tab") as HomeTab) || "home";
  const initialQuery = searchParams.get("q") || "";

  const [activeTab, setActiveTab] = useState<HomeTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const [selectedCategory, setSelectedCategory] =
    useState<HomeCategory>("すべて");
  const [articles, setArticles] = useState(homeDemoNewsItems);
  const [enabledCategories] = useState<NewsCategory[]>(
    defaultEnabledCategories,
  );
  const [notificationCategories, setNotificationCategories] = useState<
    NewsCategory[]
  >(defaultNotificationCategories);

  // 状態が変化した時にURLパラメータを更新
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab !== "home") params.set("tab", activeTab);
    if (searchQuery) params.set("q", searchQuery);

    const qs = params.toString();
    const url = qs ? `/?${qs}` : "/";

    // 履歴を残さずURLだけ更新（タブ切り替えや入力のたびに履歴が増えないように）
    window.history.replaceState(null, "", url);
  }, [activeTab, searchQuery]);

  const visibleArticles = useMemo(() => {
    const enabled = articles.filter((article) =>
      enabledCategories.includes(article.category),
    );

    if (selectedCategory === "すべて") {
      return enabled;
    }

    if (selectedCategory === "保存済み") {
      return articles.filter((article) => article.isSaved);
    }

    return enabled.filter((article) => article.category === selectedCategory);
  }, [articles, enabledCategories, selectedCategory]);

  const handleToggleSaved = (newsId: string, saved: boolean) => {
    setHomeNewsSaved(newsId, saved);
    setArticles((current) =>
      current.map((article) =>
        article.id === newsId ? { ...article, isSaved: saved } : article
      )
    );
  };

  const handleToggleNotificationCategory = (category: NewsCategory) => {
    setNotificationCategories((current) => {
      if (current.includes(category)) {
        if (current.length === 1) {
          toast.warning("通知カテゴリは最低1つ必要です", {
            description: "少なくとも1カテゴリは通知対象に残してください。",
          });
          return current;
        }

        toast.info(`${category} の通知をオフにしました`, {
          description: "設定はこの端末上で反映されています。",
        });
        return current.filter((item) => item !== category);
      }

      toast.success(`${category} の通知をオンにしました`, {
        description: "このカテゴリのポップアップ通知を受け取れます。",
      });
      return [...current, category];
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background shadow-sm">
        <HeroSection />
        {activeTab === "home" && (
          <TodayNewsSection
            categories={homeCategories}
            selectedCategory={selectedCategory}
            articles={visibleArticles}
            onSelectCategory={setSelectedCategory}
            onToggleSaved={handleToggleSaved}
          />
        )}
        {activeTab === "search" && (
          <SearchSection
            articles={articles}
            query={searchQuery}
            onQueryChange={setSearchQuery}
          />
        )}
        {activeTab === "settings" && (
          <SettingsSection
            notificationCategories={notificationCategories}
            selectableCategories={homeCategories.filter(
              (category): category is NewsCategory =>
                category !== "すべて" && category !== "保存済み"
            )}
            onToggleNotificationCategory={handleToggleNotificationCategory}
            sampleNotificationTitle={articles[0]?.headline ?? "テスト通知"}
          />
        )}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
