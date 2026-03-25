import { newsData } from "@/entities/news/model/data";
import type { NewsCategory, NewsEntity } from "@/entities/news/model/types";

export const homeCategories: Array<"すべて" | "保存済み" | NewsCategory> = [
  "すべて",
  "国際",
  "政治",
  "経済",
  "テクノロジー",
  "社会",
  "保存済み",
];
export const homeDemoNewsItems: NewsEntity[] = newsData;

export function findHomeNewsById(newsId: string) {
  return homeDemoNewsItems.find((article) => article.id === newsId) ?? null;
}

export function setHomeNewsSaved(newsId: string, saved: boolean) {
  const item = homeDemoNewsItems.find((article) => article.id === newsId) ?? null;
  if (!item) return null;
  item.isSaved = saved;
  return item;
}
