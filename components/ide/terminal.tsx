'use client'

import { useEffect, useRef, useState } from 'react'
import { useSiteData } from '@/lib/use-site-data'
import {
  ABOUT, EXPERIENCE_LIST, FILES, HERO, LEETCODE, LINKS, MENTORSHIP, OSS, PROJECT_LIST,
  PUBLICATIONS, RESUME, SKILL_GROUPS, TOTAL_MERGED, TOTAL_OPEN, WORKSPACE,
  type FileId,
} from '@/lib/ide-data'
import { CloseIcon } from './icons'

type Line = { text: string; tone?: 'dim' | 'green' | 'blue' | 'yellow' | 'red' | 'purple' }

/* ------------------------------------------------------------- resizing */

const HEIGHT_KEY = 'athang-portfolio-terminal-height'
const MIN_PANEL = 120
/** Never let the panel swallow the editor entirely. */
const MIN_EDITOR = 140
const DEFAULT_RATIO = 0.38

const clamp = (h: number, available: number) =>
  Math.round(Math.min(Math.max(h, MIN_PANEL), Math.max(MIN_PANEL, available - MIN_EDITOR)))

/**
 * Drag the top edge to resize, the way VS Code's panel works. The height is
 * kept in px and remembered across visits; it is re-clamped whenever the
 * window changes size so a tall panel cannot strand the editor off screen.
 */
function usePanelHeight(rootRef: React.RefObject<HTMLDivElement | null>) {
  const [height, setHeight] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)

  const available = () => rootRef.current?.parentElement?.clientHeight ?? 0

  useEffect(() => {
    const space = available()
    if (!space) return
    const saved = Number(localStorage.getItem(HEIGHT_KEY))
    setHeight(clamp(saved > 0 ? saved : space * DEFAULT_RATIO, space))

    const onResize = () => setHeight((h) => (h === null ? h : clamp(h, available())))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const commit = (h: number) => {
    setHeight(h)
    try { localStorage.setItem(HEIGHT_KEY, String(h)) } catch { /* private mode */ }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    e.preventDefault()
    const space = available()
    const startY = e.clientY
    const startH = rootRef.current?.offsetHeight ?? 0
    let latest = startH
    setDragging(true)

    const move = (ev: PointerEvent) => {
      latest = clamp(startH - (ev.clientY - startY), space)
      setHeight(latest)
    }
    const up = () => {
      setDragging(false)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      commit(latest)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  /** Keyboard resizing, so the panel is not mouse only. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 48 : 16
    if (e.key === 'ArrowUp') { e.preventDefault(); commit(clamp((height ?? 0) + step, available())) }
    if (e.key === 'ArrowDown') { e.preventDefault(); commit(clamp((height ?? 0) - step, available())) }
  }

  const reset = () => commit(clamp(available() * DEFAULT_RATIO, available()))

  return { height, dragging, onPointerDown, onKeyDown, reset }
}

const TONE: Record<string, string> = {
  dim: 'text-dim',
  green: 'text-green',
  blue: 'text-blue',
  yellow: 'text-yellow',
  red: 'text-red',
  purple: 'text-purple',
}

const BANNER = [
  '   _   _   _                     _  __     _ _ ',
  '  /_\\ | |_| |__  __ _ _ _  __ _ | |/ /__ _| (_)',
  " / _ \\|  _| ' \\/ _` | ' \\/ _` || ' </ _` | | |",
  '/_/ \\_\\\\__|_||_\\__,_|_||_\\__, ||_|\\_\\__,_|_|_|',
  '                         |___/                 ',
]

export function Terminal({ onClose, onOpen }: { onClose: () => void; onOpen: (id: FileId) => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const panel = usePanelHeight(rootRef)
  const [lines, setLines] = useState<Line[]>([
    { text: "Welcome. Type 'help' for the command list.", tone: 'green' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [lines])

  useEffect(() => { inputRef.current?.focus() }, [])

  const d = useSiteData()

  const push = (...l: Line[]) => setLines((s) => [...s, ...l])

  const run = (raw: string) => {
    const cmd = raw.trim()
    push({ text: `athang@portfolio:~$ ${cmd}` })
    if (!cmd) return

    setHistory((h) => [cmd, ...h])
    setHIdx(-1)

    const [head, ...rest] = cmd.split(/\s+/)
    const arg = rest.join(' ')

    switch (head.toLowerCase()) {
      case 'help':
        push(
          { text: 'Available commands', tone: 'green' },
          { text: '  help          this list' },
          { text: '  whoami        who you are talking to' },
          { text: '  ls            list workspace files' },
          { text: '  open <file>   open a file in the editor' },
          { text: '  cat <file>    print a file summary' },
          { text: '  projects      list shipped projects' },
          { text: '  oss           open source contributions' },
          { text: '  lfx           CNCF mentorship, 2026 Term 3' },
          { text: '  skills        the stack' },
          { text: '  experience    work history' },
          { text: '  contact       how to reach me' },
          { text: '  publications  peer reviewed work' },
          { text: '  resume        download the PDF' },
          { text: '  neofetch      system info' },
          { text: '  banner        ascii art' },
          { text: '  date          current time' },
          { text: '  clear         wipe the screen' },
          { text: '  exit          close the terminal' },
        )
        break

      case 'lfx':
      case 'mentorship':
        push(
          { text: `${MENTORSHIP.status} · ${MENTORSHIP.program} · CNCF ${MENTORSHIP.term}`, tone: 'green' },
          { text: MENTORSHIP.project },
          { text: `${MENTORSHIP.org} · ${MENTORSHIP.period}`, tone: 'dim' },
          { text: '' },
          ...MENTORSHIP.deliverables.map((d) => ({ text: '  ' + d, tone: 'dim' as const })),
        )
        break

      case 'whoami':
        push(
          { text: HERO.first + ' ' + HERO.last, tone: 'green' },
          { text: HERO.roles.join(' · '), tone: 'dim' },
          { text: '' },
          { text: HERO.summary },
        )
        break

      case 'ls':
        push(
          { text: 'src/    ' + FILES.filter((f) => f.folder === 'src').map((f) => f.name).join('  '), tone: 'blue' },
          { text: 'data/   ' + FILES.filter((f) => f.folder === 'data').map((f) => f.name).join('  '), tone: 'blue' },
          { text: './      README.md  ' + RESUME.name },
        )
        break

      case 'open': {
        const f = FILES.find((x) => x.name.toLowerCase() === arg.toLowerCase() || x.id === arg.toLowerCase())
        if (f) { onOpen(f.id); push({ text: `opening ${f.name}...`, tone: 'green' }) }
        else push({ text: `open: no such file: ${arg || '<none>'}`, tone: 'red' })
        break
      }

      case 'cat': {
        const f = FILES.find((x) => x.name.toLowerCase() === arg.toLowerCase() || x.id === arg.toLowerCase())
        if (!f) { push({ text: `cat: ${arg || '<none>'}: No such file or directory`, tone: 'red' }); break }
        onOpen(f.id)
        push({ text: `── ${f.name} (${f.lang}) ─ rendered in the editor above`, tone: 'purple' })
        break
      }

      case 'projects':
        PROJECT_LIST.forEach((p) =>
          push(
            { text: p.title, tone: 'green' },
            { text: `   ${p.stack.join(' · ')}`, tone: 'dim' },
          ),
        )
        push({ text: "run 'open projects.tsx' for the full detail", tone: 'dim' })
        break

      case 'oss':
        push({ text: `${d.totalMerged} merged pull requests, ${d.totalOpen} in review`, tone: 'green' })
        d.oss.forEach((o) =>
          push({ text: `  ${o.repo.padEnd(30)} ${o.merged} merged, ${o.open} open`, tone: 'blue' }),
        )
        break

      case 'papers':
      case 'publications':
        PUBLICATIONS.forEach((b) =>
          push({ text: b.title, tone: 'green' }, { text: `   ${b.venue}, ${b.detail}`, tone: 'dim' }),
        )
        break

      case 'skills':
        SKILL_GROUPS.forEach((g) =>
          push({ text: `${(g.group + ':').padEnd(28)} ${g.items.join(', ')}`, tone: 'dim' }),
        )
        break

      case 'experience':
        d.experience.forEach((e) =>
          push(
            { text: `${e.period}  ${e.role}`, tone: 'green' },
            { text: `   @ ${e.org} · ${e.mode}`, tone: 'dim' },
          ),
        )
        break

      case 'contact':
        LINKS.forEach((l) => push({ text: `${l.key.toLowerCase().padEnd(10)} ${l.value}`, tone: 'blue' }))
        break

      case 'resume': {
        const a = document.createElement('a')
        a.href = RESUME.href
        a.download = RESUME.name
        a.click()
        push({ text: `downloading ${RESUME.name}...`, tone: 'green' })
        break
      }

      case 'neofetch':
        push(
          { text: `athang@${WORKSPACE}`, tone: 'green' },
          { text: '─────────────────────────' },
          { text: `OS        Portfolio OS (Next.js 16)`, tone: 'dim' },
          { text: `Shell     react-shell 19.0`, tone: 'dim' },
          { text: `Uptime    ${ABOUT.education[0].period}`, tone: 'dim' },
          { text: `CGPA      9.21 / 10`, tone: 'dim' },
          { text: `LeetCode  ${d.leetcode.rating} rating, ${d.leetcode.solved} solved, top ${d.leetcode.topPercentage}%`, tone: 'dim' },
          { text: `OSS       ${d.totalMerged} merged, ${d.totalOpen} in review`, tone: 'dim' },
          { text: `LFX       ${MENTORSHIP.program}, CNCF ${MENTORSHIP.term}`, tone: 'dim' },
        )
        break

      case 'banner':
        BANNER.forEach((t) => push({ text: t, tone: 'purple' }))
        break

      case 'date':
        push({ text: new Date().toString() })
        break

      case 'pwd':
        push({ text: `/home/athang/${WORKSPACE}` })
        break

      case 'echo':
        push({ text: arg })
        break

      case 'sudo':
        push({ text: 'athang is not in the sudoers file. This incident will be reported. 🙂', tone: 'red' })
        break

      case 'clear':
        setLines([])
        break

      case 'exit':
        onClose()
        break

      default:
        push({ text: `command not found: ${head}. try 'help'.`, tone: 'red' })
    }
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { run(input); setInput('') }
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const n = Math.min(hIdx + 1, history.length - 1)
      if (n >= 0) { setHIdx(n); setInput(history[n]) }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const n = hIdx - 1
      setHIdx(n)
      setInput(n < 0 ? '' : history[n])
    }
  }

  return (
    <div
      ref={rootRef}
      style={panel.height === null ? undefined : { height: panel.height }}
      className={`relative flex shrink-0 flex-col border-t border-line bg-bg ${
        panel.height === null ? 'h-[38%] min-h-[180px]' : ''
      }`}
      onClick={() => inputRef.current?.focus()}
    >
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize terminal panel"
        tabIndex={0}
        onPointerDown={panel.onPointerDown}
        onKeyDown={panel.onKeyDown}
        onDoubleClick={panel.reset}
        title="Drag to resize. Double click to reset."
        className={`absolute inset-x-0 -top-1 z-10 h-2 cursor-ns-resize transition-colors focus:outline-none ${
          panel.dragging ? 'bg-accent' : 'hover:bg-accent/60 focus-visible:bg-accent/60'
        }`}
      />

      <div className="flex shrink-0 items-center gap-4 border-b border-line px-3 py-1.5 text-[11px]">
        <span className="border-b border-accent pb-1 text-text">TERMINAL</span>
        <span className="text-dim">PROBLEMS</span>
        <span className="text-dim">OUTPUT</span>
        <button onClick={onClose} aria-label="Close terminal" className="ml-auto rounded p-1 text-dim transition hover:bg-active hover:text-text">
          <CloseIcon />
        </button>
      </div>

      <div ref={bodyRef} className="flex-1 overflow-y-auto px-3 py-2 text-[12px] leading-[1.6] scroll-thin">
        {lines.map((l, i) => (
          <pre key={i} className={`whitespace-pre-wrap break-words font-mono ${l.tone ? TONE[l.tone] : 'text-text'}`}>
            {l.text || ' '}
          </pre>
        ))}
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-green">athang@portfolio</span>
          <span className="shrink-0 text-dim">:</span>
          <span className="shrink-0 text-blue">~</span>
          <span className="shrink-0 text-dim">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
            className="flex-1 bg-transparent font-mono text-[12px] text-text outline-none"
          />
        </div>
      </div>
    </div>
  )
}
