import type { NewsEntity } from "@/entities/news/model/types";
import { NewsCardPanel } from "@/page-components/home/ui-block/today-news/ui/components/NewsCardPanel";

interface RecommendationSectionProps {
  articles: NewsEntity[];
  visible: boolean;
}

export function RecommendationSection({
  articles,
  visible,
}: RecommendationSectionProps) {
  return (
    <section
      className={
        visible
          ? "mx-auto flex w-full max-w-[360px] flex-col justify-center space-y-4 translate-y-0 opacity-100 transition-all duration-500 ease-out"
          : "pointer-events-none mx-auto flex w-full max-w-[360px] flex-col justify-center space-y-4 translate-y-4 opacity-0 transition-all duration-300 ease-out"
      }
    >
      <div className="space-y-1">
        <h2 className="text-sm font-semibold">関連したニュース</h2>
      </div>
      <div className="space-y-3">
        {articles.map((article) => (
          <NewsCardPanel
            key={article.id}
            article={article}
            onToggleSaved={() => {}}
            showSaveButton={false}
          />
        ))}
      </div>
    </section>
  );
}
