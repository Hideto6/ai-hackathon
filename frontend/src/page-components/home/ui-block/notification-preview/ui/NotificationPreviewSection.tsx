import type { NewsEntity } from "@/entities/news/model/types";
import { BellRing } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/ui/card";

interface NotificationPreviewSectionProps {
  article: NewsEntity;
}

export function NotificationPreviewSection({
  article,
}: NotificationPreviewSectionProps) {
  return (
    <section className="px-4 pt-4">
      <Card className="border-none bg-[linear-gradient(135deg,theme(colors.zinc.900),theme(colors.zinc.700))] text-white ring-0">
        <CardHeader className="gap-3">
          <div className="flex items-center gap-2 text-xs text-white/70">
            <BellRing className="size-4" />
            おじさん構文通知プレビュー
          </div>
          <CardTitle className="text-lg font-semibold text-white">
            {article.notificationHook}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-1 text-sm text-white/75">
          開いたら3枚で背景と自分ごと化まで追えます。
        </CardContent>
      </Card>
    </section>
  );
}
