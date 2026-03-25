import type { NewsCategory } from "@/entities/news/model/types";

export const newsCategoryTheme: Record<
  NewsCategory,
  {
    lineClassName: string;
    badgeClassName: string;
  }
> = {
  国際: {
    lineClassName: "bg-sky-500",
    badgeClassName: "border-sky-200 bg-sky-50 text-sky-700",
  },
  政治: {
    lineClassName: "bg-violet-500",
    badgeClassName: "border-violet-200 bg-violet-50 text-violet-700",
  },
  経済: {
    lineClassName: "bg-emerald-500",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  テクノロジー: {
    lineClassName: "bg-amber-500",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
  },
  社会: {
    lineClassName: "bg-rose-500",
    badgeClassName: "border-rose-200 bg-rose-50 text-rose-700",
  },
};
