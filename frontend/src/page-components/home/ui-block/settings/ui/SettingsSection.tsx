"use client";

import type { NewsCategory } from "@/entities/news/model/types";
import { Check } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/ui/card";
import { cn } from "@/shared/ui/shadcn/lib/utils";

interface SettingsSectionProps {
  enabledCategories: NewsCategory[];
  notificationCategories: NewsCategory[];
  selectableCategories: NewsCategory[];
  onToggleCategory: (category: NewsCategory) => void;
  onToggleNotificationCategory: (category: NewsCategory) => void;
}

export function SettingsSection({
  enabledCategories,
  notificationCategories,
  selectableCategories,
  onToggleCategory,
  onToggleNotificationCategory,
}: SettingsSectionProps) {
  return (
    <section className="px-4 py-4 pb-24">
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">通知するカテゴリー</CardTitle>
          <p className="text-sm text-muted-foreground">
            選んだカテゴリーだけ通知を受け取ります。
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {selectableCategories.map((category) => {
            const checked = notificationCategories.includes(category);

            return (
              <button
                key={`notification-${category}`}
                type="button"
                onClick={() => onToggleNotificationCategory(category)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left transition-colors",
                  checked
                    ? "border-foreground bg-muted/40"
                    : "border-border hover:bg-muted/30",
                )}
              >
                <span className="text-sm font-medium">{category}</span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  {checked ? "通知ON" : "通知OFF"}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                      checked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background",
                    )}
                  >
                    {checked ? <Check className="size-3" /> : null}
                  </span>
                </span>
              </button>
            );
          })}
        </CardContent>
      </Card>
      <p className="px-1 pt-3 text-xs leading-5 text-muted-foreground">
        表示・通知ともに、最低1カテゴリは残すようにしています。
      </p>
    </section>
  );
}
