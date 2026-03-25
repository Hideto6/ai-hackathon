'use client'

import { useState, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { NewsArticle, HighlightedTerm } from '@/lib/news-data'
import { cn } from '@/lib/utils'
import { TermModal } from './term-modal'

interface ArticleViewerProps {
  article: NewsArticle
  onClose: () => void
}

export function ArticleViewer({ article, onClose }: ArticleViewerProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [selectedTerm, setSelectedTerm] = useState<HighlightedTerm | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const totalCards = article.cards.length
  const currentCard = article.cards[currentCardIndex]

  const goToNext = useCallback(() => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1)
    }
  }, [currentCardIndex, totalCards])

  const goToPrev = useCallback(() => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1)
    }
  }, [currentCardIndex])

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrev()
    }
  }

  const renderBodyWithHighlights = (body: string, terms?: HighlightedTerm[]) => {
    if (!terms || terms.length === 0) {
      return <p className="text-foreground leading-relaxed">{body}</p>
    }

    let result: (string | JSX.Element)[] = [body]

    terms.forEach((term, termIndex) => {
      result = result.flatMap((part, partIndex) => {
        if (typeof part !== 'string') return part
        
        const parts = part.split(term.term)
        if (parts.length === 1) return part

        const elements: (string | JSX.Element)[] = []
        parts.forEach((segment, i) => {
          if (i > 0) {
            elements.push(
              <button
                key={`term-${termIndex}-${partIndex}-${i}`}
                onClick={() => setSelectedTerm(term)}
                className="underline decoration-muted-foreground/50 decoration-2 underline-offset-4 hover:decoration-foreground transition-colors"
              >
                {term.term}
              </button>
            )
          }
          if (segment) elements.push(segment)
        })
        return elements
      })
    })

    return <p className="text-foreground leading-relaxed">{result}</p>
  }

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-3 z-10">
        {article.cards.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 rounded-full bg-muted overflow-hidden"
          >
            <div
              className={cn(
                'h-full bg-foreground transition-all duration-300',
                index < currentCardIndex ? 'w-full' : index === currentCardIndex ? 'w-full' : 'w-0'
              )}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-12 right-4 z-10 p-2 rounded-full bg-muted/80 hover:bg-muted transition-colors"
        aria-label="閉じる"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Card content */}
      <div
        className="h-full flex flex-col justify-center px-6 pt-20 pb-24"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <span className="text-sm text-muted-foreground mb-3">
            {currentCard.label}
          </span>
          <h1 className="text-2xl font-bold text-foreground mb-6 leading-tight">
            {currentCard.headline}
          </h1>
          <div className="text-base">
            {renderBodyWithHighlights(currentCard.body, currentCard.highlightedTerms)}
          </div>
        </div>

        {/* Navigation hint and arrows */}
        <div className="flex items-center justify-between mt-auto">
          <button
            onClick={goToPrev}
            disabled={currentCardIndex === 0}
            className={cn(
              'p-2 rounded-full transition-colors',
              currentCardIndex === 0 ? 'text-muted' : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label="前のカード"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <span className="text-sm text-muted-foreground">
            {currentCardIndex < totalCards - 1 ? 'スワイプして次へ →' : '最後のカードです'}
          </span>
          
          <button
            onClick={goToNext}
            disabled={currentCardIndex === totalCards - 1}
            className={cn(
              'p-2 rounded-full transition-colors',
              currentCardIndex === totalCards - 1 ? 'text-muted' : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label="次のカード"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Term modal */}
      <TermModal
        term={selectedTerm}
        onClose={() => setSelectedTerm(null)}
      />
    </div>
  )
}
