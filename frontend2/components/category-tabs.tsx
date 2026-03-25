'use client'

import { useRef, useEffect } from 'react'
import { Category, categories } from '@/lib/news-data'
import { cn } from '@/lib/utils'

interface CategoryTabsProps {
  selectedCategory: Category
  onSelectCategory: (category: Category) => void
}

export function CategoryTabs({ selectedCategory, onSelectCategory }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      const container = scrollRef.current
      const selected = selectedRef.current
      const containerRect = container.getBoundingClientRect()
      const selectedRect = selected.getBoundingClientRect()
      
      if (selectedRect.left < containerRect.left || selectedRect.right > containerRect.right) {
        selected.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [selectedCategory])

  return (
    <div 
      ref={scrollRef}
      className="flex gap-6 overflow-x-auto scrollbar-hide px-4 py-3 border-b border-border"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {categories.map((category) => {
        const isSelected = category === selectedCategory
        return (
          <button
            key={category}
            ref={isSelected ? selectedRef : null}
            onClick={() => onSelectCategory(category)}
            className={cn(
              'shrink-0 text-sm pb-1 transition-colors',
              isSelected
                ? 'font-bold text-foreground border-b-2 border-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
