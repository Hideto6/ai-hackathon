import type { NewsCategory, NewsEntity } from "@/entities/news/model/types";

export type HomeTab = "home" | "search" | "settings";

export type HomeCategory = "すべて" | "保存済み" | NewsCategory;

export type HomeNewsSummary = NewsEntity;
