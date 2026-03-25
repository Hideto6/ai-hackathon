import type { GlossaryTermEntity } from "@/entities/glossary-term/model/types";
import type { NewsEntity } from "@/entities/news/model/types";

export interface NewsDetailModel {
  article: NewsEntity;
  recommendations: NewsEntity[];
}

export interface StoryCardsSectionProps {
  article: NewsEntity;
  onSelectTerm: (term: GlossaryTermEntity) => void;
}
