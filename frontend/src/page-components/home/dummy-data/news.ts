import { newsData } from "@/entities/news/model/data";
import type { NewsCategory, NewsEntity } from "@/entities/news/model/types";

export const homeCategories: Array<"すべて" | NewsCategory> = [
  "すべて",
  "国際",
  "政治",
  "経済",
  "テクノロジー",
  "社会",
];

export const homeDemoNewsItems: NewsEntity[] = newsData;

export function findHomeNewsById(newsId: string) {
  return homeDemoNewsItems.find((article) => article.id === newsId) ?? null;
}
