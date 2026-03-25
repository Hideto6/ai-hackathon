'use client'

import { useState, useMemo } from 'react'
import { Category, NewsArticle, newsArticles } from '@/lib/news-data'
import { CategoryTabs } from '@/components/category-tabs'
import { NewsCard } from '@/components/news-card'
import { BottomNav } from '@/components/bottom-nav'
import { ArticleViewer } from '@/components/article-viewer'
import { SettingsView } from '@/components/settings-view'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'settings'>('home')
  const [selectedCategory, setSelectedCategory] = useState<Category>('すべて')
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [enabledCategories, setEnabledCategories] = useState<Category[]>([
    '国際', '政治', '経済', 'テクノロジー', '社会'
  ])

  const filteredArticles = useMemo(() => {
    let articles = newsArticles.filter(article => 
      enabledCategories.includes(article.category)
    )
    
    if (selectedCategory !== 'すべて') {
      articles = articles.filter(article => article.category === selectedCategory)
    }
    
    return articles
  }, [selectedCategory, enabledCategories])

  const handleToggleCategory = (category: Category) => {
    if (category === 'すべて') return
    
    setEnabledCategories(prev => {
      if (prev.includes(category)) {
        if (prev.length === 1) return prev
        return prev.filter(c => c !== category)
      }
      return [...prev, category]
    })
  }

  if (activeTab === 'settings') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-background pb-20">
        <SettingsView
          selectedCategories={enabledCategories}
          onToggleCategory={handleToggleCategory}
        />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background px-4 py-4">
        <h1 className="text-xl font-bold text-foreground">じじいにゅーす</h1>
      </header>

      {/* Category tabs */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* News list */}
      <main className="px-4 py-4 pb-24">
        <div className="flex flex-col gap-4">
          {filteredArticles.map(article => (
            <NewsCard
              key={article.id}
              article={article}
              onClick={() => setSelectedArticle(article)}
            />
          ))}
          
          {filteredArticles.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>このカテゴリーのニュースはありません</p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Article viewer */}
      {selectedArticle && (
        <ArticleViewer
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  )
}
