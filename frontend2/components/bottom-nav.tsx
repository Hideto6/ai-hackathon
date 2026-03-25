'use client'

import { Home, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  activeTab: 'home' | 'settings'
  onTabChange: (tab: 'home' | 'settings') => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        <button
          onClick={() => onTabChange('home')}
          className={cn(
            'flex flex-col items-center gap-1 p-2 transition-colors',
            activeTab === 'home' ? 'text-foreground' : 'text-muted-foreground'
          )}
          aria-label="ホーム"
        >
          <Home className="w-6 h-6" strokeWidth={activeTab === 'home' ? 2.5 : 1.5} />
          <span className="text-xs">ホーム</span>
        </button>
        <button
          onClick={() => onTabChange('settings')}
          className={cn(
            'flex flex-col items-center gap-1 p-2 transition-colors',
            activeTab === 'settings' ? 'text-foreground' : 'text-muted-foreground'
          )}
          aria-label="設定"
        >
          <Settings className="w-6 h-6" strokeWidth={activeTab === 'settings' ? 2.5 : 1.5} />
          <span className="text-xs">設定</span>
        </button>
      </div>
    </nav>
  )
}
