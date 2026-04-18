'use client'

import { TICKER_ITEMS } from '@/lib/constants'

export function TickerStrip() {
  // Duplicate items for seamless loop
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="w-full bg-surface border-y border-white/5 h-[52px] overflow-hidden">
      <div className="flex items-center h-full animate-ticker">
        {items.map((item, index) => (
          <div key={index} className="flex items-center shrink-0">
            <span className="text-violet-400 text-[8px] mx-5">◆</span>
            <span className="font-mono text-[13px] text-[#52526E] uppercase tracking-wider whitespace-nowrap">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
