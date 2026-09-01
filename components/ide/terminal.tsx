'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ABOUT, EXPERIENCE_LIST, FILES, HERO, LEETCODE, LINKS, OSS, PROJECT_LIST,
  PUBLICATIONS, RESUME, SKILL_GROUPS, TOTAL_MERGED, TOTAL_OPEN, WORKSPACE,
  type FileId,
} from '@/lib/ide-data'
import { CloseIcon } from './icons'

type Line = { text: string; tone?: 'dim' | 'green' | 'blue' | 'yellow' | 'red' | 'purple' }

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
        push({ text: `${TOTAL_MERGED} merged pull requests, ${TOTAL_OPEN} in review`, tone: 'green' })
        OSS.forEach((o) =>
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
        EXPERIENCE_LIST.forEach((e) =>
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
          { text: `LeetCode  ${LEETCODE.rating} rating, ${LEETCODE.solved} solved, top ${LEETCODE.topPercentage}%`, tone: 'dim' },
          { text: `OSS       ${TOTAL_MERGED} merged, ${TOTAL_OPEN} in review`, tone: 'dim' },
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
    <div className="flex h-[38%] min-h-[180px] shrink-0 flex-col border-t border-line bg-bg" onClick={() => inputRef.current?.focus()}>
      <div className="flex shrink-0 items-center gap-4 border-b border-line px-3 py-1.5 text-[11px]">
        <span className="border-b border-accent pb-1 text-text">TERMINAL</span>
        <span className="text-dim">PROBLEMS</span>
        <span className="text-dim">OUTPUT</span>
        <button onClick={onClose} aria-label="Close terminal" className="ml-auto rounded p-1 text-dim transition hover:bg-white/10 hover:text-text">
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
