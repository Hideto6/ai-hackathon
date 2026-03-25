'use client'

import { NewsArticle } from '@/lib/news-data'

interface NewsCardProps {
  article: NewsArticle
  onClick: () => void
}

export function NewsCard({ article, onClick }: NewsCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <span className="text-xs text-muted-foreground">{article.category}</span>
      <h2 className="mt-2 text-base font-bold text-foreground leading-relaxed">
        {article.headline}
      </h2>
      <span className="mt-3 block text-xs text-muted-foreground">
        {article.timestamp}
      </span>
    </button>
  )
}
