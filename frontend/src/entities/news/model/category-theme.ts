import type { NewsCategory } from "./types";

export interface CategoryTheme {
  badgeClassName: string;
}

export const newsCategoryTheme: Record<NewsCategory, CategoryTheme> = {
  国際: {
    badgeClassName: "bg-blue-100 text-blue-700 border-blue-200",
  },
  政治: {
    badgeClassName: "bg-purple-100 text-purple-700 border-purple-200",
  },
  経済: {
    badgeClassName: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  テクノロジー: {
    badgeClassName: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  社会: {
    badgeClassName: "bg-orange-100 text-orange-700 border-orange-200",
  },
};
