'use client'

import { useEffect, useRef, useState } from 'react'
import { FILES, RESUME, WORKSPACE, type FileId } from '@/lib/ide-data'
import {
  ChevronIcon, CloseIcon, ExplorerIcon, ExtensionsIcon, FileIcon, GearIcon,
  GitIcon, RunIcon, SearchIcon, SparkIcon,
} from './icons'

export const THEMES = [
  { id: 'default', name: 'Athang Dark', glyph: '🟣' },
  { id: 'tokyo-night', name: 'Tokyo Night', glyph: '🌃' },
  { id: 'catppuccin', name: 'Catppuccin', glyph: '🐱' },
  { id: 'nord', name: 'Nord', glyph: '🧊' },
  { id: 'gruvbox', name: 'Gruvbox', glyph: '🔥' },
  { id: 'dracula', name: 'Dracula', glyph: '🧛' },
] as const

export type ThemeId = (typeof THEMES)[number]['id']

/* ============================================================ title bar */

export function TitleBar({ onPalette }: { onPalette: () => void }) {
  const [quip, setQuip] = useState('')

  const nope = () => {
    const lines = [
      "you can't close a portfolio 🙂",
      'nice try, this window is load bearing',
      'Ctrl+W is not going to save you here',
    ]
    setQuip(lines[Math.floor(Math.random() * lines.length)])
    setTimeout(() => setQuip(''), 2400)
  }

  const fullscreen = () =>
    document.fullscreenElement ? document.exitFullscreen?.() : document.documentElement.requestFullscreen?.()

  const dots = [
    { c: '#ff5f57', g: '✕', gc: '#8b0000', fn: nope, t: 'Close' },
    { c: '#febc2e', g: '−', gc: '#7a5000', fn: nope, t: 'Minimize' },
    { c: '#28c840', g: '⤢', gc: '#005c00', fn: fullscreen, t: 'Fullscreen' },
  ]

  return (
    <div className="area-title flex select-none items-center gap-2 border-b border-black/60 bg-title px-3">
      <div className="group flex gap-[7px]">
        {dots.map((d) => (
          <button
            key={d.t}
            onClick={d.fn}
            title={d.t}
            aria-label={d.t}
            className="relative h-3 w-3 rounded-full transition hover:brightness-110"
            style={{ background: d.c }}
          >
            <span
              className="absolute inset-0 flex items-center justify-center text-[8px] font-bold opacity-0 transition-opacity group-hover:opacity-100"
              style={{ color: d.gc }}
            >
              {d.g}
            </span>
          </button>
        ))}
      </div>

      <span className="text-[10px] text-dim transition-opacity duration-300" style={{ opacity: quip ? 1 : 0 }}>
        {quip}
      </span>

      <button
        onClick={onPalette}
        className="mx-auto flex max-w-sm flex-1 items-center justify-center gap-2 rounded border border-line/70 bg-bg2/70 py-[3px] text-[11px] text-dim transition hover:bg-bg3"
      >
        <SearchIcon size={11} />
        <span>
          {WORKSPACE} <span className="text-dim/60">:</span> portfolio
        </span>
        <span className="ml-1 hidden gap-1 sm:flex">
          <kbd className="rounded bg-white/10 px-1 py-px text-[9px]">Ctrl</kbd>
          <kbd className="rounded bg-white/10 px-1 py-px text-[9px]">K</kbd>
        </span>
      </button>

      <div className="w-16" />
    </div>
  )
}

/* ============================================================= menu bar */

const MENUS: Record<string, { label: string; hint?: string; action?: string }[]> = {
  File: [
    { label: 'Open home.tsx', hint: 'Ctrl+1', action: 'home' },
    { label: 'Open README.md', hint: 'Ctrl+8', action: 'readme' },
    { label: 'Download Résumé', hint: '⤓', action: 'resume' },
  ],
  Edit: [
    { label: 'Find in portfolio', hint: 'Ctrl+K', action: 'palette' },
    { label: 'Close all tabs', hint: 'Ctrl+W', action: 'closeall' },
  ],
  View: [
    { label: 'Toggle Sidebar', hint: 'Ctrl+B', action: 'sidebar' },
    { label: 'Toggle Terminal', hint: 'Ctrl+`', action: 'terminal' },
    { label: 'Command Palette', hint: 'Ctrl+K', action: 'palette' },
  ],
  Go: FILES.map((f) => ({ label: f.name, action: f.id })),
  Run: [
    { label: 'Run: open source contributions', action: 'opensource' },
    { label: 'Run: projects', action: 'projects' },
  ],
  Terminal: [{ label: 'New Terminal', hint: 'Ctrl+`', action: 'terminal' }],
  Help: [
    { label: 'Keyboard Shortcuts', hint: 'Ctrl+/', action: 'shortcuts' },
    { label: 'GitHub', action: 'gh' },
    { label: 'LinkedIn', action: 'li' },
    { label: 'Email me', action: 'mail' },
  ],
}

export function MenuBar({ onAction }: { onAction: (a: string) => void }) {
  const [open, setOpen] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const away = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('mousedown', away)
    return () => document.removeEventListener('mousedown', away)
  }, [])

  return (
    <div ref={ref} className="area-menu flex items-center gap-0.5 border-b border-line bg-bg3 px-2">
      {Object.entries(MENUS).map(([name, items]) => (
        <div key={name} className="relative">
          <button
            onClick={() => setOpen(open === name ? null : name)}
            onMouseEnter={() => open && setOpen(name)}
            className={`rounded px-2 py-0.5 text-[11px] transition ${open === name ? 'bg-white/10 text-bright' : 'text-text hover:bg-white/[0.07]'}`}
          >
            {name}
          </button>
          {open === name && (
            <div className="anim-pop absolute left-0 top-full z-50 mt-1 min-w-[210px] rounded-md border border-line bg-bg3 py-1 shadow-2xl shadow-black/60">
              {items.map((it) => (
                <button
                  key={it.label}
                  onClick={() => {
                    it.action && onAction(it.action)
                    setOpen(null)
                  }}
                  className="flex w-full items-center justify-between gap-6 px-3 py-1 text-left text-[11px] text-text transition hover:bg-accent/25 hover:text-bright"
                >
                  <span>{it.label}</span>
                  {it.hint && <span className="text-[10px] text-dim">{it.hint}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ========================================================= activity bar */

export type PanelId = 'explorer' | 'search' | 'scm' | 'run' | 'extensions'

export function ActivityBar({
  panel, sidebarOpen, onPanel, onSettings,
}: {
  panel: PanelId
  sidebarOpen: boolean
  onPanel: (p: PanelId) => void
  onSettings: () => void
}) {
  const items: { id: PanelId; Icon: typeof ExplorerIcon; label: string; badge?: string }[] = [
    { id: 'explorer', Icon: ExplorerIcon, label: 'Explorer' },
    { id: 'search', Icon: SearchIcon, label: 'Search' },
    { id: 'scm', Icon: GitIcon, label: 'Source Control', badge: '3' },
    { id: 'run', Icon: RunIcon, label: 'Run & Debug' },
    { id: 'extensions', Icon: ExtensionsIcon, label: 'Extensions' },
  ]

  return (
    <div className="area-abar flex flex-col items-center gap-0.5 border-r border-line bg-bg4 pt-1">
      {items.map(({ id, Icon, label, badge }) => {
        const on = sidebarOpen && panel === id
        return (
          <button
            key={id}
            onClick={() => onPanel(id)}
            title={label}
            aria-label={label}
            className={`relative flex h-11 w-11 items-center justify-center rounded-md transition ${on ? 'abar-on text-bright' : 'text-dim hover:text-text'}`}
          >
            <Icon />
            {badge && (
              <span className="absolute bottom-1.5 right-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white">
                {badge}
              </span>
            )}
          </button>
        )
      })}
      <div className="flex-1" />
      <button
        onClick={onSettings}
        title="Color Theme"
        aria-label="Color Theme"
        className="mb-1 flex h-11 w-11 items-center justify-center rounded-md text-dim transition hover:text-text"
      >
        <GearIcon />
      </button>
    </div>
  )
}

/* ============================================================== tab bar */

export function TabBar({
  openIds, active, onSelect, onClose,
}: {
  openIds: FileId[]
  active: FileId
  onSelect: (id: FileId) => void
  onClose: (id: FileId) => void
}) {
  return (
    <div className="no-scroll flex h-[35px] shrink-0 overflow-x-auto border-b border-line bg-bg2">
      {openIds.map((id) => {
        const f = FILES.find((x) => x.id === id)!
        const on = id === active
        return (
          <div
            key={id}
            onClick={() => onSelect(id)}
            className={`group flex h-full min-w-[140px] cursor-pointer items-center gap-2 border-r border-line px-3 text-[12px] transition ${
              on ? 'tab-active bg-bg text-bright' : 'bg-bg2 text-dim hover:bg-bg3'
            }`}
          >
            <FileIcon kind={f.icon} size={14} />
            <span className="flex-1 truncate">{f.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose(id)
              }}
              aria-label={`Close ${f.name}`}
              className={`rounded p-0.5 transition hover:bg-white/15 ${on ? 'opacity-70' : 'opacity-0 group-hover:opacity-70'}`}
            >
              <CloseIcon />
            </button>
          </div>
        )
      })}
      <div className="flex-1 border-b border-line bg-bg2" />
    </div>
  )
}

/* =========================================================== breadcrumb */

export function Breadcrumb({ id }: { id: FileId }) {
  const f = FILES.find((x) => x.id === id)!
  const crumbs = f.folder === 'root' ? [WORKSPACE, f.name] : [WORKSPACE, f.folder, f.name]
  return (
    <div className="flex h-[26px] shrink-0 items-center gap-1.5 border-b border-line bg-bg px-4 text-[11px] text-dim">
      {crumbs.map((c, i) => (
        <span key={c} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-dim/50">›</span>}
          <span className={i === crumbs.length - 1 ? 'text-text' : ''}>{c}</span>
        </span>
      ))}
    </div>
  )
}

/* =========================================================== status bar */

export function StatusBar({
  file, themeId, onTheme, onTerminal, onAssistant,
}: {
  file: FileId
  themeId: ThemeId
  onTheme: () => void
  onTerminal: () => void
  onAssistant: () => void
}) {
  const [clock, setClock] = useState('')
  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))
    tick()
    const t = setInterval(tick, 30_000)
    return () => clearInterval(t)
  }, [])

  const lang = FILES.find((f) => f.id === file)!.lang
  const theme = THEMES.find((t) => t.id === themeId)!
  const cell = 'flex items-center gap-1.5 px-2 h-full transition hover:bg-white/20'

  return (
    <div className="area-status flex items-center bg-accent text-[11px] text-white">
      <button onClick={onTerminal} className={cell}>
        <span>⚠ 0</span>
        <span>✕ 0</span>
      </button>
      <span className={cell}>⎇ main</span>
      <span className={`${cell} hidden sm:flex`}>↻ athang-kali/portfolio</span>
      <div className="flex-1" />
      <button onClick={onAssistant} className={`${cell} hidden md:flex`}>
        ✦ Assistant
      </button>
      <span className={`${cell} hidden sm:flex`}>{lang}</span>
      <span className={`${cell} hidden lg:flex`}>UTF-8</span>
      <span className={`${cell} hidden lg:flex`}>LF</span>
      <button onClick={onTheme} className={cell}>
        {theme.glyph} {theme.name}
      </button>
      <span className={`${cell} hidden sm:flex`}>{clock}</span>
    </div>
  )
}

/* ========================================================= theme picker */

export function ThemePicker({
  themeId, onPick, onClose,
}: {
  themeId: ThemeId
  onPick: (t: ThemeId) => void
  onClose: () => void
}) {
  return (
    <div className="anim-fade fixed inset-0 z-[60] flex items-start justify-center bg-black/50 pt-24 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="anim-pop w-[min(460px,92vw)] overflow-hidden rounded-lg border border-line bg-bg3 shadow-2xl shadow-black/70"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-line px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-dim">
          Preferences: Color Theme
        </div>
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              onPick(t.id)
              onClose()
            }}
            className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-[12px] transition ${
              themeId === t.id ? 'bg-accent/25 text-bright' : 'text-text hover:bg-white/[0.06]'
            }`}
          >
            <span>{t.glyph}</span>
            <span className="flex-1">{t.name}</span>
            {themeId === t.id && <span className="text-[10px] text-dim">current</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export { FILES, RESUME, ChevronIcon, FileIcon, SparkIcon }
