import { glossaryTerms } from "@/entities/glossary-term/model/data";
import type { GlossaryTermEntity } from "@/entities/glossary-term/model/types";
import type { NewsEntity, NewsStoryCard } from "@/entities/news/model/types";
import {
  findHomeNewsById,
  homeDemoNewsItems,
} from "@/page-components/home/dummy-data/news";

export const demoNewsCards = homeDemoNewsItems;

function getHighlightedTerms(body: string): GlossaryTermEntity[] | undefined {
  const matchedTerms = glossaryTerms.filter((term) => body.includes(term.term));

  if (!matchedTerms.length) {
    return undefined;
  }

  return matchedTerms.sort((a, b) => b.term.length - a.term.length);
}

function attachGlossaryTerms(article: NewsEntity): NewsEntity {
  return {
    ...article,
    cards: article.cards.map(
      (card): NewsStoryCard => ({
        ...card,
        highlightedTerms: getHighlightedTerms(card.body),
      }),
    ),
  };
}

export function getNewsDetailModel(newsId: string) {
  const article = findHomeNewsById(newsId);

  if (!article) {
    return null;
  }

  return {
    article: attachGlossaryTerms(article),
    recommendations: homeDemoNewsItems
      .filter((candidate) => candidate.id !== newsId)
      .slice(0, 2),
  };
}
