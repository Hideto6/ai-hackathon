import type { GlossaryTermEntity } from "@/entities/glossary-term/model/types";

export type NewsCategory =
  | "国際"
  | "政治"
  | "経済"
  | "テクノロジー"
  | "社会";

export interface NewsStoryCard {
  id?: string | number;
  label: string;
  headline: string;
  body: string;
  highlightedTerms?: GlossaryTermEntity[];
}

export interface NewsEntity {
  id: string;
  category: NewsCategory;
  headline: string;
  timestamp: string;
  notificationHook: string;
  cards: NewsStoryCard[];
  isSaved?: boolean;
}
