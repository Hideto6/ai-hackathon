"use client";

import type { NewsCategory } from "@/entities/news/model/types";
import { Check } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/ui/card";
import { cn } from "@/shared/ui/shadcn/lib/utils";

interface SettingsSectionProps {
  enabledCategories: NewsCategory[];
  selectableCategories: NewsCategory[];
  onToggleCategory: (category: NewsCategory) => void;
}

export function SettingsSection({
  enabledCategories,
  selectableCategories,
  onToggleCategory,
}: SettingsSectionProps) {
  return (
    <section className="px-4 py-4 pb-24">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">表示するカテゴリー</CardTitle>
          <p className="text-sm text-muted-foreground">
            ホームで気になる分野だけを残せます。
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {selectableCategories.map((category) => {
            const checked = enabledCategories.includes(category);

            return (
              <button
                key={category}
                type="button"
                onClick={() => onToggleCategory(category)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left transition-colors",
                  checked
                    ? "border-foreground bg-muted/40"
                    : "border-border hover:bg-muted/30"
                )}
              >
                <span className="text-sm font-medium">{category}</span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  {checked ? "表示中" : "非表示"}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                      checked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background"
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
        最低1カテゴリは残すようにしています。今後ここに通知設定も追加できます。
      </p>
    </section>
  );
}
