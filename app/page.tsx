'use client'

import { useCallback, useEffect, useState } from 'react'
import { FILES, RESUME, type FileId, type TabId } from '@/lib/ide-data'
import {
  ActivityBar, Breadcrumb, MenuBar, StatusBar, TabBar, ThemePicker, TitleBar,
  preferredTheme, type PanelId, type ThemeId,
} from '@/components/ide/chrome'
import { Sidebar } from '@/components/ide/sidebar'
import { EditorPane } from '@/components/ide/panes'
import { Terminal } from '@/components/ide/terminal'
import { CommandPalette } from '@/components/ide/palette'
import { Assistant } from '@/components/ide/assistant'
import { ShortcutsModal } from '@/components/ide/shortcuts'
import { CustomCursor } from '@/components/ide/cursor'

const THEME_KEY = 'athang-portfolio-theme'

/** Shown when every tab is closed, the way a real editor does. */
function EmptyEditor({ onOpen, onShortcuts }: { onOpen: (id: FileId) => void; onShortcuts: () => void }) {
  const hints: [string, string, () => void][] = [
    ['Go to file', 'Ctrl P', () => onOpen('home')],
    ['Open projects', 'Ctrl 3', () => onOpen('projects')],
    ['Open source work', 'Ctrl 4', () => onOpen('opensource')],
    ['Keyboard shortcuts', 'Ctrl /', onShortcuts],
  ]
  return (
    <div className="anim-fade flex flex-1 flex-col items-center justify-center bg-bg px-6">
      <p className="display text-[clamp(1.6rem,3vw,2.2rem)] text-dim/40">athang-kali</p>
      <p className="mt-3 text-[12px] text-dim">No editors open</p>
      <div className="mt-9 space-y-2.5">
        {hints.map(([label, keys, run]) => (
          <button key={label} onClick={run} className="group flex w-[260px] items-baseline justify-between gap-6">
            <span className="text-[12.5px] text-accent transition group-hover:text-bright">{label}</span>
            <span className="flex gap-1">
              {keys.split(' ').map((k, i) => (
                <kbd key={i} className="rounded border border-line bg-bg2 px-1.5 py-0.5 text-[10.5px] text-dim">{k}</kbd>
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Page() {
  const [openIds, setOpenIds] = useState<TabId[]>(['home'])
  const [active, setActive] = useState<TabId>('home')
  const [panel, setPanel] = useState<PanelId>('explorer')
  const [sidebar, setSidebar] = useState(true)
  const [terminal, setTerminal] = useState(false)
  const [assistant, setAssistant] = useState(false)
  const [palette, setPalette] = useState(false)
  const [themePicker, setThemePicker] = useState(false)
  const [themeId, setThemeId] = useState<ThemeId>('default')
  const [shortcuts, setShortcuts] = useState(false)
  const [zoom, setZoom] = useState(0)

  /* ------------------------------------------------------------ theme */

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as ThemeId | null
    // No stored choice means a first visit, so follow the OS preference.
    setThemeId(saved ?? preferredTheme())
    // on phones the sidebar overlays the editor, so start with content visible
    if (window.innerWidth <= 860) setSidebar(false)
  }, [])

  useEffect(() => {
    const el = document.documentElement
    if (themeId === 'default') el.removeAttribute('data-theme')
    else el.setAttribute('data-theme', themeId)
    try { localStorage.setItem(THEME_KEY, themeId) } catch {}
  }, [themeId])

  /* ------------------------------------------------------- tab actions */

  const openFile = useCallback((id: TabId) => {
    setOpenIds((ids) => (ids.includes(id) ? ids : [...ids, id]))
    setActive(id)
    // on small screens the sidebar overlays the editor, so get out of the way
    if (window.innerWidth <= 860) setSidebar(false)
  }, [])

  const closeFile = useCallback((id: TabId) => {
    setOpenIds((ids) => {
      const next = ids.filter((x) => x !== id)
      setActive((cur) => (cur === id ? next[Math.max(0, ids.indexOf(id) - 1)] ?? cur : cur))
      return next
    })
  }, [])

  const downloadResume = () => {
    const a = document.createElement('a')
    a.href = RESUME.href
    a.download = RESUME.name
    a.click()
  }

  const onPanel = (p: PanelId) => {
    if (p === panel && sidebar) setSidebar(false)
    else { setPanel(p); setSidebar(true) }
  }

  const menuAction = (a: string) => {
    if (FILES.some((f) => f.id === a)) return openFile(a as FileId)
    switch (a) {
      case 'resume': return downloadResume()
      case 'palette': return setPalette(true)
      case 'sidebar': return setSidebar((s) => !s)
      case 'terminal': return setTerminal((s) => !s)
      case 'closeall': return setOpenIds([])
      case 'shortcuts': return setShortcuts(true)
      case 'gh': return void window.open('https://github.com/Athang69', '_blank')
      case 'li': return void window.open('https://www.linkedin.com/in/athang-kali-56341426a/', '_blank')
      case 'mail': window.location.href = 'mailto:athangkali21@gmail.com'
    }
  }

  /* -------------------------------------------------------- shortcuts */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey

      if (e.key === 'Escape') {
        setPalette(false)
        setThemePicker(false)
        setShortcuts(false)
        return
      }
      if (!mod) return

      if (e.key === 'k' || e.key === 'p') { e.preventDefault(); setPalette((s) => !s); return }
      if (e.key === 'b') { e.preventDefault(); setSidebar((s) => !s); return }
      if (e.key === '`') { e.preventDefault(); setTerminal((s) => !s); return }
      if (e.key === 'i' || (e.shiftKey && e.key.toLowerCase() === 'c')) {
        e.preventDefault()
        setAssistant((s) => !s)
        return
      }
      if (e.key === '/') { e.preventDefault(); setShortcuts((s) => !s); return }
      if (e.key === 'w') { e.preventDefault(); setActive((cur) => { closeFile(cur); return cur }); return }
      if (e.key === '=' || e.key === '+') { e.preventDefault(); setZoom((z) => Math.min(z + 1, 4)); return }
      if (e.key === '-') { e.preventDefault(); setZoom((z) => Math.max(z - 1, -2)); return }
      if (e.key === '0') { e.preventDefault(); setZoom(0); return }

      const n = Number(e.key)
      if (n >= 1 && n <= FILES.length) {
        e.preventDefault()
        openFile(FILES[n - 1].id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openFile, closeFile])

  /* ------------------------------------------------------------- view */

  return (
    <main className="ide-shell" data-sidebar={sidebar ? 'open' : 'closed'}>
      <CustomCursor />
      <TitleBar onPalette={() => setPalette(true)} />
      <MenuBar onAction={menuAction} />

      <ActivityBar
        panel={panel}
        sidebarOpen={sidebar}
        onPanel={onPanel}
        onSettings={() => setThemePicker(true)}
      />

      {sidebar && (
        <Sidebar
          panel={panel}
          active={openIds.length ? active : null}
          onOpen={openFile}
          onAssistant={() => setAssistant(true)}
        />
      )}

      <div className="area-main flex overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-bg">
          <TabBar openIds={openIds} active={active} onSelect={setActive} onClose={closeFile} />
          {openIds.length > 0 && <Breadcrumb id={active} />}
          <div
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
            style={{ fontSize: `${100 + zoom * 8}%` }}
          >
            {openIds.length > 0 ? (
              <EditorPane key={active} id={active} onOpen={openFile} />
            ) : (
              <EmptyEditor onOpen={openFile} onShortcuts={() => setShortcuts(true)} />
            )}
            {terminal && <Terminal onClose={() => setTerminal(false)} onOpen={openFile} />}
          </div>
        </div>

        {assistant && (
          <div className="hidden lg:flex">
            <Assistant onClose={() => setAssistant(false)} onOpen={openFile} />
          </div>
        )}
      </div>

      <StatusBar
        file={openIds.length ? active : 'home'}
        themeId={themeId}
        onTheme={() => setThemePicker(true)}
        onTerminal={() => setTerminal((s) => !s)}
        onAssistant={() => setAssistant((s) => !s)}
      />

      {palette && (
        <CommandPalette
          onClose={() => setPalette(false)}
          onOpen={openFile}
          onTheme={(t) => setThemeId(t as ThemeId)}
          onTerminal={() => setTerminal((s) => !s)}
          onAssistant={() => setAssistant(true)}
          onSidebar={() => setSidebar((s) => !s)}
          onShortcuts={() => setShortcuts(true)}
        />
      )}

      {themePicker && (
        <ThemePicker themeId={themeId} onPick={setThemeId} onClose={() => setThemePicker(false)} />
      )}

      {shortcuts && <ShortcutsModal onClose={() => setShortcuts(false)} />}

      {/* assistant becomes a full-screen sheet on narrow viewports */}
      {assistant && (
        <div className="fixed inset-0 z-[65] flex justify-end bg-black/50 lg:hidden" onClick={() => setAssistant(false)}>
          <div onClick={(e) => e.stopPropagation()} className="anim-pop flex h-full">
            <Assistant onClose={() => setAssistant(false)} onOpen={openFile} />
          </div>
        </div>
      )}
    </main>
  )
}
