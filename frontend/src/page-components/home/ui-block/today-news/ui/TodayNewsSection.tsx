import type { NewsEntity } from "@/entities/news/model/types";
import type { HomeCategory } from "@/page-components/home/model/types";

import { CategoryTabs } from "@/page-components/home/ui-block/today-news/ui/components/CategoryTabs";
import { NewsCardPanel } from "@/page-components/home/ui-block/today-news/ui/components/NewsCardPanel";

interface TodayNewsSectionProps {
  categories: HomeCategory[];
  selectedCategory: HomeCategory;
  articles: NewsEntity[];
  onSelectCategory: (category: HomeCategory) => void;
}

export function TodayNewsSection({
  categories,
  selectedCategory,
  articles,
  onSelectCategory,
}: TodayNewsSectionProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
      <div className="flex flex-col gap-3 px-4 py-4 pb-24">
        {articles.map((article) => (
          <NewsCardPanel key={article.id} article={article} />
        ))}
        {articles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
            このカテゴリに表示できるニュースはありません。
          </div>
        ) : null}
      </div>
    </section>
  );
}
