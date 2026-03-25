import { Bookmark } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/ui/button";

interface SaveActionSectionProps {
  isSaved: boolean;
  onToggleSaved: () => void;
}

export function SaveActionSection({
  isSaved,
  onToggleSaved,
}: SaveActionSectionProps) {
  return (
    <section className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/30 px-4 py-3">
      <div className="space-y-1">
        <p className="text-sm font-medium">あとで見返す</p>
        <p className="text-xs text-muted-foreground">
          接続前なので状態はこの画面内だけ保持します。
        </p>
      </div>
      <Button variant={isSaved ? "default" : "outline"} onClick={onToggleSaved}>
        <Bookmark className={isSaved ? "fill-current" : ""} />
        {isSaved ? "保存済み" : "保存する"}
      </Button>
    </section>
  );
}
