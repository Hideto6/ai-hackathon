"use client";

import { useMemo, useState } from "react";

import type { NewsCategory } from "@/entities/news/model/types";
import type { HomeCategory, HomeTab } from "@/page-components/home/model/types";
import {
  homeCategories,
  homeDemoNewsItems,
  setHomeNewsSaved,
} from "@/page-components/home/dummy-data/news";
import { HeroSection } from "@/page-components/home/ui-block/hero/ui/HeroSection";
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
  const [activeTab, setActiveTab] = useState<HomeTab>("home");
  const [selectedCategory, setSelectedCategory] =
    useState<HomeCategory>("すべて");
  const [articles, setArticles] = useState(homeDemoNewsItems);
  const [enabledCategories] = useState<NewsCategory[]>(
    defaultEnabledCategories,
  );
  const [notificationCategories, setNotificationCategories] = useState<
    NewsCategory[]
  >(defaultNotificationCategories);

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
        return current.length === 1
          ? current
          : current.filter((item) => item !== category);
      }

      return [...current, category];
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background shadow-sm">
        <HeroSection />
        {activeTab === "home" ? (
          <TodayNewsSection
            categories={homeCategories}
            selectedCategory={selectedCategory}
            articles={visibleArticles}
            onSelectCategory={setSelectedCategory}
            onToggleSaved={handleToggleSaved}
          />
        ) : (
          <SettingsSection
            notificationCategories={notificationCategories}
            selectableCategories={homeCategories.filter(
              (category): category is NewsCategory =>
                category !== "すべて" && category !== "保存済み"
            )}
            onToggleNotificationCategory={handleToggleNotificationCategory}
          />
        )}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
