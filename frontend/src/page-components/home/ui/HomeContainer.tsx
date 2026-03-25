"use client";

import { useMemo, useState } from "react";

import type { NewsCategory } from "@/entities/news/model/types";
import type { HomeCategory, HomeTab } from "@/page-components/home/model/types";
import {
  homeCategories,
  homeDemoNewsItems,
} from "@/page-components/home/dummy-data/news";
import { HeroSection } from "@/page-components/home/ui-block/hero/ui/HeroSection";
import { NotificationPreviewSection } from "@/page-components/home/ui-block/notification-preview/ui/NotificationPreviewSection";
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
  const [enabledCategories, setEnabledCategories] = useState<NewsCategory[]>(
    defaultEnabledCategories,
  );
  const [notificationCategories, setNotificationCategories] = useState<
    NewsCategory[]
  >(defaultNotificationCategories);

  const visibleArticles = useMemo(() => {
    const enabled = homeDemoNewsItems.filter((article) =>
      enabledCategories.includes(article.category),
    );

    if (selectedCategory === "すべて") {
      return enabled;
    }

    return enabled.filter((article) => article.category === selectedCategory);
  }, [enabledCategories, selectedCategory]);

  const handleToggleCategory = (category: NewsCategory) => {
    setEnabledCategories((current) => {
      if (current.includes(category)) {
        return current.length === 1
          ? current
          : current.filter((item) => item !== category);
      }

      return [...current, category];
    });
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

  const featuredArticle = visibleArticles[0] ?? homeDemoNewsItems[0];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background shadow-sm">
        <HeroSection />
        {activeTab === "home" ? (
          <>
            <NotificationPreviewSection article={featuredArticle} />
            <TodayNewsSection
              categories={homeCategories}
              selectedCategory={selectedCategory}
              articles={visibleArticles}
              onSelectCategory={setSelectedCategory}
            />
          </>
        ) : (
          <SettingsSection
            enabledCategories={enabledCategories}
            notificationCategories={notificationCategories}
            selectableCategories={homeCategories.filter(
              (category): category is NewsCategory => category !== "すべて",
            )}
            onToggleCategory={handleToggleCategory}
            onToggleNotificationCategory={handleToggleNotificationCategory}
          />
        )}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
