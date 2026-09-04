'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { FILES, RESUME, type FileId } from '@/lib/ide-data'
import { FileIcon } from './icons'
import { THEMES } from './chrome'

export interface Cmd {
  id: string
  label: string
  hint?: string
  group: string
  run: () => void
  icon?: string
}

export function CommandPalette({
  onClose, onOpen, onTheme, onTerminal, onAssistant, onSidebar, onShortcuts,
}: {
  onClose: () => void
  onOpen: (id: FileId) => void
  onTheme: (t: string) => void
  onTerminal: () => void
  onAssistant: () => void
  onSidebar: () => void
  onShortcuts: () => void
}) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const commands = useMemo<Cmd[]>(() => {
    const files: Cmd[] = FILES.map((f) => ({
      id: `file:${f.id}`,
      label: f.name,
      hint: f.folder === 'root' ? f.lang : `${f.folder}/ · ${f.lang}`,
      group: 'Files',
      icon: f.icon,
      run: () => onOpen(f.id),
    }))

    const actions: Cmd[] = [
      { id: 'a:terminal', label: 'View: Toggle Terminal', hint: 'Ctrl+`', group: 'Actions', run: onTerminal },
      { id: 'a:sidebar', label: 'View: Toggle Sidebar', hint: 'Ctrl+B', group: 'Actions', run: onSidebar },
      { id: 'a:assistant', label: 'Ask about Athang', hint: 'Ctrl+I', group: 'Actions', run: onAssistant },
      { id: 'a:keys', label: 'Help: Keyboard Shortcuts', hint: 'Ctrl+/', group: 'Actions', run: onShortcuts },
      {
        id: 'a:resume', label: 'Download Résumé (PDF)', group: 'Actions',
        run: () => { const a = document.createElement('a'); a.href = RESUME.href; a.download = RESUME.name; a.click() },
      },
      {
        id: 'a:github', label: 'Open GitHub profile', group: 'Actions',
        run: () => window.open('https://github.com/Athang69', '_blank'),
      },
      {
        id: 'a:linkedin', label: 'Open LinkedIn profile', group: 'Actions',
        run: () => window.open('https://www.linkedin.com/in/athang-kali-56341426a/', '_blank'),
      },
      {
        id: 'a:mail', label: 'Send me an email', group: 'Actions',
        run: () => { window.location.href = 'mailto:athangkali21@gmail.com' },
      },
    ]

    const themes: Cmd[] = THEMES.map((t) => ({
      id: `theme:${t.id}`,
      label: `Color Theme: ${t.name}`,
      hint: t.glyph,
      group: 'Themes',
      run: () => onTheme(t.id),
    }))

    return [...files, ...actions, ...themes]
  }, [onOpen, onTheme, onTerminal, onAssistant, onSidebar, onShortcuts])

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return commands
    return commands.filter((c) => (c.label + c.group + (c.hint ?? '')).toLowerCase().includes(s))
  }, [q, commands])

  useEffect(() => setSel(0), [q])

  useEffect(() => {
    listRef.current?.querySelector('[data-sel="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [sel])

  const key = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); results[sel]?.run(); onClose() }
    else if (e.key === 'Escape') onClose()
  }

  let lastGroup = ''

  return (
    <div className="anim-fade fixed inset-0 z-[70] flex items-start justify-center bg-black/50 pt-[12vh] backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="anim-pop w-[min(620px,94vw)] overflow-hidden rounded-lg border border-line bg-bg3 shadow-2xl shadow-black/70"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={key}
          placeholder="Type a file name, action or theme…"
          aria-label="Command palette"
          className="w-full border-b border-line bg-bg2 px-4 py-3 text-[13px] text-text outline-none placeholder:text-dim"
        />
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-1 scroll-thin">
          {results.length === 0 && <p className="px-4 py-6 text-center text-[12px] text-dim">No matching commands</p>}
          {results.map((c, i) => {
            const header = c.group !== lastGroup ? ((lastGroup = c.group), c.group) : null
            return (
              <div key={c.id}>
                {header && (
                  <div className="px-4 pb-1 pt-2 text-[10px] uppercase tracking-[0.14em] text-dim">{header}</div>
                )}
                <button
                  data-sel={i === sel}
                  onMouseEnter={() => setSel(i)}
                  onClick={() => { c.run(); onClose() }}
                  className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-[12.5px] transition ${
                    i === sel ? 'bg-accent/25 text-bright' : 'text-text hover:bg-hover'
                  }`}
                >
                  {c.icon ? <FileIcon kind={c.icon} size={14} /> : <span className="w-[14px] text-center text-dim">›</span>}
                  <span className="flex-1 truncate">{c.label}</span>
                  {c.hint && <span className="shrink-0 text-[10.5px] text-dim">{c.hint}</span>}
                </button>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-3 border-t border-line bg-bg2 px-4 py-1.5 text-[10px] text-dim">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc dismiss</span>
        </div>
      </div>
    </div>
  )
}
