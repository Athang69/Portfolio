'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ABOUT, CNCF_CARD, EXPERIENCE_LIST, HERO, LEETCODE, LINKS, OSS, PROJECT_LIST,
  PUBLICATIONS, RESUME, SKILL_GROUPS, TOTAL_MERGED, TOTAL_OPEN, WORKSPACE,
  type FileId,
} from '@/lib/ide-data'
import { CloseIcon, SparkIcon } from './icons'

/**
 * A scripted assistant, not a language model. It matches your question
 * against a local knowledge base built from the same data the panes use,
 * so it always answers with facts that are actually on this site.
 */

interface Entry { keys: string[]; answer: string; open?: FileId }

const KB: Entry[] = [
  {
    keys: ['who', 'about', 'yourself', 'introduce', 'bio', 'athang'],
    answer: `${HERO.first} ${HERO.last}\n${HERO.roles.join(' · ')}\n\n${ABOUT.intro}`,
    open: 'about',
  },
  {
    keys: ['project', 'built', 'build', 'portfolio', 'work on', 'shipped'],
    answer:
      `${PROJECT_LIST.length} projects are documented here:\n\n` +
      PROJECT_LIST.map((p) => `${p.title}\n   ${p.stack.slice(0, 4).join(' · ')}`).join('\n\n') +
      `\n\nOpening projects.tsx for the full write-ups.`,
    open: 'projects',
  },
  {
    keys: ['open source', 'oss', 'kubernetes', 'contribut', 'pr', 'pull request', 'headlamp', 'kubearmor', 'cncf'],
    answer:
      `${TOTAL_MERGED} merged pull requests across CNCF projects, with ${TOTAL_OPEN} more in review:\n\n` +
      OSS.map((o) => `${o.repo}\n   ${o.merged} merged, ${o.open} in review (${o.tag})`).join('\n\n') +
      `\n\nThe CNCF contributor card counts ${CNCF_CARD.contributions} contributions across ${CNCF_CARD.repoCount} repositories.`,
    open: 'opensource',
  },
  {
    keys: ['experience', 'intern', 'job', 'career', 'worked', 'company', 'aeons'],
    answer:
      EXPERIENCE_LIST.map((e) => `${e.role} @ ${e.org}\n${e.period} · ${e.mode}\n${e.bullets[0]}`).join('\n\n'),
    open: 'experience',
  },
  {
    keys: ['skill', 'stack', 'tech', 'language', 'know', 'good at', 'tool'],
    answer:
      `The stack, grouped:\n\n` +
      SKILL_GROUPS.map((g) => `${g.group}: ${g.items.join(', ')}`).join('\n\n'),
    open: 'skills',
  },
  {
    keys: ['contact', 'reach', 'email', 'hire', 'talk', 'connect', 'linkedin'],
    answer:
      `Easiest is email: ${LINKS[0].value}.\n\n` +
      LINKS.map((l) => `${l.key.toLowerCase()}: ${l.value}`).join('\n'),
    open: 'contact',
  },
  {
    keys: ['education', 'college', 'university', 'study', 'degree', 'cgpa', 'sggs', 'gpa'],
    answer:
      ABOUT.education
        .map((e) => `${e.school}\n${e.degree}\n${e.period} · ${e.notes.join(' · ')}`)
        .join('\n\n'),
    open: 'about',
  },
  {
    keys: ['leetcode', 'dsa', 'algorithm', 'competitive', 'problem'],
    answer:
      `LeetCode: ${LEETCODE.rating} contest rating, ${LEETCODE.solved} problems solved across ${LEETCODE.contests} contests, currently in the top ${LEETCODE.topPercentage}% of users.\n\nBreakdown: ${LEETCODE.easy} easy, ${LEETCODE.medium} medium, ${LEETCODE.hard} hard.`,
    open: 'skills',
  },
  {
    keys: ['publication', 'paper', 'research', 'journal', 'ijedr', 'published'],
    answer:
      PUBLICATIONS.map((b) => `${b.title}\n\n${b.venue}\n${b.detail}\n${b.issn}`).join('\n\n'),
    open: 'publications',
  },
  {
    keys: ['resume', 'cv', 'download'],
    answer: `The résumé is in the explorer as ${RESUME.name}. Click it, or run resume in the terminal, to download.`,
  },
  {
    keys: ['theme', 'color', 'dark', 'look'],
    answer:
      'Six themes ship with this site: Athang Dark, Tokyo Night, Catppuccin, Nord, Gruvbox and Dracula.\n\nClick the theme name in the status bar, or press Ctrl+K and search for "theme".',
  },
  {
    keys: ['terminal', 'command', 'shell', 'cli'],
    answer:
      "There is a working terminal, opened with Ctrl+`. Try help, neofetch, oss, projects, or open skills.json.",
  },
  {
    keys: ['hire', 'available', 'internship', 'opportunit', 'open to'],
    answer:
      'Open to internships and full time roles in systems, cloud native and backend engineering.\n\nEmail is the fastest route: ' +
      LINKS[0].value,
    open: 'contact',
  },
]

const SUGGESTIONS = [
  'Who is Athang?',
  'What has he built?',
  'Tell me about the open source work',
  'What has he published?',
  "What's the tech stack?",
  'How do I get in touch?',
]

interface Msg { role: 'user' | 'bot'; text: string }

function answerFor(q: string): Entry | null {
  const s = q.toLowerCase()
  let best: { e: Entry; score: number } | null = null
  for (const e of KB) {
    const score = e.keys.reduce((n, k) => (s.includes(k) ? n + k.length : n), 0)
    if (score > 0 && (!best || score > best.score)) best = { e, score }
  }
  return best?.e ?? null
}

export function Assistant({ onClose, onOpen }: { onClose: () => void; onOpen: (id: FileId) => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  const ask = (q: string) => {
    if (!q.trim()) return
    setMsgs((m) => [...m, { role: 'user', text: q }])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const hit = answerFor(q)
      const text =
        hit?.answer ??
        "I only know what is on this site. Try asking about his projects, open source work, skills, experience, publications, education, or how to get in touch."
      setTyping(false)
      setMsgs((m) => [...m, { role: 'bot', text }])
      if (hit?.open) setTimeout(() => onOpen(hit.open!), 450)
    }, 480)
  }

  return (
    <aside className="flex w-[340px] shrink-0 flex-col overflow-hidden border-l border-line bg-bg2">
      <div className="flex shrink-0 items-center gap-2 border-b border-line px-3 py-2">
        <span className="text-accent"><SparkIcon size={15} /></span>
        <span className="text-[12px] text-bright">Ask about Athang</span>
        <button onClick={onClose} aria-label="Close assistant" className="ml-auto rounded p-1 text-dim transition hover:bg-white/10 hover:text-text">
          <CloseIcon />
        </button>
      </div>

      <div className="border-b border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-dim">
        workspace · {WORKSPACE}
      </div>

      <div ref={bodyRef} className="flex-1 overflow-y-auto px-3 py-3 scroll-thin">
        {msgs.length === 0 && (
          <div className="anim-fade">
            <p className="text-[13px] text-bright">Hi, I answer from this portfolio</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-dim">
              Scripted, not a language model. Every reply is pulled from the same data the editor panes render, so nothing here is invented.
            </p>
            <div className="mt-4 space-y-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="w-full rounded border border-line bg-bg/50 px-3 py-2 text-left text-[12px] text-text transition hover:border-accent hover:text-bright"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {msgs.map((m, i) => (
          <div key={i} className={`anim-rise mb-3 ${m.role === 'user' ? 'text-right' : ''}`}>
            <div
              className={`inline-block max-w-[92%] whitespace-pre-wrap rounded-lg px-3 py-2 text-left text-[12px] leading-relaxed ${
                m.role === 'user' ? 'bg-accent text-white' : 'border border-line bg-bg text-text'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="mb-3 inline-flex gap-1 rounded-lg border border-line bg-bg px-3 py-2.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-dim"
                style={{ animation: `blink 1.1s ${i * 0.18}s infinite` }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-line p-2.5">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ask(input)}
            placeholder="Ask about projects, skills, OSS…"
            aria-label="Ask the assistant"
            className="flex-1 rounded border border-line bg-bg px-2.5 py-1.5 text-[12px] text-text outline-none transition placeholder:text-dim/70 focus:border-accent"
          />
          <button
            onClick={() => ask(input)}
            aria-label="Send"
            className="rounded bg-accent px-3 text-[12px] text-white transition hover:brightness-110"
          >
            ↑
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-dim">Answers come from this site's own data.</p>
      </div>
    </aside>
  )
}
