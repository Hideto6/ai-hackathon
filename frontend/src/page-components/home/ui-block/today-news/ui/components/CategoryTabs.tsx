"use client";

import { useEffect, useRef } from "react";

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

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto border-b px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {categories.map((category) => {
        const isSelected = category === selectedCategory;

        return (
          <button
            key={category}
            ref={isSelected ? selectedRef : null}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors",
              isSelected
                ? "border-foreground bg-foreground text-background"
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
