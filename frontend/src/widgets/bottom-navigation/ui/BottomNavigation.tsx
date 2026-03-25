"use client";

import type { HomeTab } from "@/page-components/home/model/types";
import { Home, Search, Settings } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/ui/button";
import { cn } from "@/shared/ui/shadcn/lib/utils";

interface BottomNavigationProps {
  activeTab: HomeTab;
  onTabChange: (tab: HomeTab) => void;
}

export function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t bg-background/95 px-4 py-2 backdrop-blur">
      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "flex h-12 flex-col gap-1 rounded-xl",
            activeTab === "home" && "bg-muted text-foreground"
          )}
          onClick={() => onTabChange("home")}
        >
          <Home className="size-4" />
          <span className="text-xs">ホーム</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "flex h-12 flex-col gap-1 rounded-xl",
            activeTab === "search" && "bg-muted text-foreground"
          )}
          onClick={() => onTabChange("search")}
        >
          <Search className="size-4" />
          <span className="text-xs">検索</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "flex h-12 flex-col gap-1 rounded-xl",
            activeTab === "settings" && "bg-muted text-foreground"
          )}
          onClick={() => onTabChange("settings")}
        >
          <Settings className="size-4" />
          <span className="text-xs">設定</span>
        </Button>
      </div>
    </nav>
  );
}
