"use client";

import { useEffect, useRef } from "react";

import { newsCategoryTheme } from "@/entities/news/model/category-theme";
import type { HomeCategory } from "@/page-components/home/model/types";
import { cn } from "@/shared/ui/shadcn/lib/utils";

interface CategoryTabsProps {
  categories: HomeCategory[];
  selectedCategory: HomeCategory;
  onSelectCategory: (category: HomeCategory) => void;
}

export function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (scrollRef.current && selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedCategory]);

  const orderedCategories = [
    ...categories.filter((category) => category === "すべて"),
    ...categories.filter((category) => category === "保存済み"),
    ...categories.filter(
      (category) => category !== "すべて" && category !== "保存済み"
    ),
  ];

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto border-b px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {orderedCategories.map((category) => {
        const isSelected = category === selectedCategory;
        const selectedClassName =
          category === "すべて"
            ? "border-foreground bg-foreground text-background"
            : category === "保存済み"
              ? "border-amber-300 bg-amber-100 text-amber-800"
              : newsCategoryTheme[category].badgeClassName;

        return (
          <button
            key={category}
            ref={isSelected ? selectedRef : null}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors",
              isSelected
                ? selectedClassName
                : "border-border bg-background text-muted-foreground hover:text-foreground"
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
