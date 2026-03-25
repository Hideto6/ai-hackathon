import type { NewsCategory, NewsEntity } from "@/entities/news/model/types";

export type HomeTab = "home" | "settings";

export type HomeCategory = "すべて" | NewsCategory;

export type HomeNewsSummary = NewsEntity;
