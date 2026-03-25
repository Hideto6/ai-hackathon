import { findHomeNewsById, homeDemoNewsItems } from "@/page-components/home/dummy-data/news";

export const demoNewsCards = homeDemoNewsItems;

export function getNewsDetailModel(newsId: string) {
  const article = findHomeNewsById(newsId);

  if (!article) {
    return null;
  }

  return {
    article,
    recommendations: homeDemoNewsItems
      .filter((candidate) => candidate.id !== newsId)
      .slice(0, 2),
  };
}
