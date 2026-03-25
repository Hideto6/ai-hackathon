'use client'

import { Category, categories } from '@/lib/news-data'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface SettingsViewProps {
  selectedCategories: Category[]
  onToggleCategory: (category: Category) => void
}

export function SettingsView({ selectedCategories, onToggleCategory }: SettingsViewProps) {
  const selectableCategories = categories.filter(c => c !== 'すべて')

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-background border-b border-border px-4 py-4">
        <h1 className="text-lg font-bold text-foreground">設定</h1>
      </header>

      <main className="px-4 py-6">
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            表示するカテゴリー
          </h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {selectableCategories.map((category, index) => {
              const isSelected = selectedCategories.includes(category)
              const isLast = index === selectableCategories.length - 1
              
              return (
                <button
                  key={category}
                  onClick={() => onToggleCategory(category)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50',
                    !isLast && 'border-b border-border'
                  )}
                >
                  <span className="text-foreground">{category}</span>
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                      isSelected
                        ? 'bg-foreground border-foreground'
                        : 'border-muted-foreground'
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-background" strokeWidth={3} />}
                  </div>
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            選択したカテゴリーのニュースがホームに表示されます。
          </p>
        </section>
      </main>
    </div>
  )
}
