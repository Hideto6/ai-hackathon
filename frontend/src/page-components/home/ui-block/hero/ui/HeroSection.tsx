import type { HomeTab } from "@/page-components/home/model/types";
import { Badge } from "@/shared/ui/shadcn/ui/badge";

interface HeroSectionProps {
  activeTab: HomeTab;
}

export function HeroSection({ activeTab }: HeroSectionProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 px-4 py-4 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            30秒で入口だけつかむニュース
          </p>
          <h1 className="text-xl font-semibold tracking-tight">じじいにゅーす</h1>
        </div>
        <Badge variant="outline">
          {activeTab === "home" ? "ホーム" : "設定"}
        </Badge>
      </div>
    </header>
  );
}
