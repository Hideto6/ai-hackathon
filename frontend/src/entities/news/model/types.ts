import type { GlossaryTermEntity } from "@/entities/glossary-term/model/types";

export type NewsCategory =
  | "国際"
  | "政治"
  | "経済"
  | "テクノロジー"
  | "社会";

export interface NewsStoryCard {
  label: string;
  headline: string;
  body: string;
  highlightedTerms?: GlossaryTermEntity[];
}

export interface NewsThumbnail {
  imageUrl?: string;
  alt: string;
  placeholderText: string;
}

export interface NewsEntity {
  id: string;
  category: NewsCategory;
  headline: string;
  timestamp: string;
  notificationHook: string;
  thumbnail: NewsThumbnail;
  cards: NewsStoryCard[];
  isSaved?: boolean;
}
