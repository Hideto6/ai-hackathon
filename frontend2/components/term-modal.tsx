'use client'

import { useEffect, useState } from 'react'
import { HighlightedTerm } from '@/lib/news-data'
import { cn } from '@/lib/utils'

interface TermModalProps {
  term: HighlightedTerm | null
  onClose: () => void
}

export function TermModal({ term, onClose }: TermModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  useEffect(() => {
    if (term) {
      setIsVisible(true)
    }
  }, [term])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 200)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return
    const touchEnd = e.changedTouches[0].clientY
    const distance = touchEnd - touchStart
    
    if (distance > 50) {
      handleClose()
    }
    setTouchStart(null)
  }

  if (!term) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-foreground/20 transition-opacity duration-200 z-50',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        onClick={handleClose}
      />

      {/* Bottom sheet */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl shadow-xl z-50 transition-transform duration-200 ease-out',
          isVisible ? 'translate-y-0' : 'translate-y-full'
        )}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Content */}
        <div className="px-6 pb-10 pt-2">
          <h2 className="text-xl font-bold text-foreground mb-1">
            {term.term}
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({term.reading})
            </span>
          </h2>
          <p className="mt-4 text-foreground leading-relaxed">
            {term.description}
          </p>
        </div>
      </div>
    </>
  )
}
