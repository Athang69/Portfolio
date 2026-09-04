'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * The editor minimap. Real VS Code renders a scaled-down copy of the buffer;
 * here we abstract the pane into coloured bars whose widths are derived
 * deterministically from the pane id, so the shape is stable per file. A
 * viewport box tracks scroll position and the whole strip is clickable.
 */

/** Small deterministic PRNG so each pane keeps the same silhouette. */
function seeded(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return ((h >>> 0) % 1000) / 1000
  }
}

const INK = ['var(--text)', 'var(--blue)', 'var(--green)', 'var(--purple)', 'var(--orange)', 'var(--yellow)']

function buildLines(seed: string, count: number) {
  const rand = seeded(seed)
  const lines: { w: number; indent: number; color: string; blank: boolean }[] = []
  for (let i = 0; i < count; i++) {
    const r = rand()
    if (r < 0.14) {
      lines.push({ w: 0, indent: 0, color: '', blank: true })
      continue
    }
    lines.push({
      w: 22 + rand() * 62,
      indent: rand() < 0.55 ? 0 : rand() < 0.7 ? 5 : 10,
      color: INK[Math.floor(rand() * INK.length)],
      blank: false,
    })
  }
  return lines
}

export function Minimap({ scrollRef, paneId }: { scrollRef: RefObject<HTMLDivElement | null>; paneId: string }) {
  const [lines] = useState(() => buildLines(paneId, 180))
  const [box, setBox] = useState({ top: 0, height: 100 })
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const sync = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      if (scrollHeight <= clientHeight) {
        setBox({ top: 0, height: 100 })
        return
      }
      setBox({
        top: (scrollTop / scrollHeight) * 100,
        height: Math.max(8, (clientHeight / scrollHeight) * 100),
      })
    }

    sync()
    el.addEventListener('scroll', sync, { passive: true })
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', sync)
      ro.disconnect()
    }
  }, [scrollRef, paneId])

  const jump = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current
    const rail = railRef.current
    if (!el || !rail) return
    const rect = rail.getBoundingClientRect()
    const ratio = (e.clientY - rect.top) / rect.height
    el.scrollTo({ top: ratio * el.scrollHeight - el.clientHeight / 2, behavior: 'smooth' })
  }

  return (
    <div
      ref={railRef}
      onClick={jump}
      aria-hidden
      className="relative hidden w-[76px] shrink-0 cursor-pointer select-none overflow-hidden border-l border-line bg-bg py-2 xl:block"
    >
      <div className="flex flex-col gap-[2px] px-2">
        {lines.map((l, i) =>
          l.blank ? (
            <div key={i} className="h-[2px]" />
          ) : (
            <div
              key={i}
              className="h-[2px] rounded-[1px]"
              style={{ width: `${l.w}%`, marginLeft: `${l.indent}%`, background: l.color, opacity: 0.32 }}
            />
          ),
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 border-y border-white/10 bg-hover transition-[top] duration-75"
        style={{ top: `${box.top}%`, height: `${box.height}%` }}
      />
    </div>
  )
}
