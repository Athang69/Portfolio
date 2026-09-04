'use client'

import { useMemo, useState } from 'react'
import { useSiteData } from '@/lib/use-site-data'
import {
  FILES, RESUME, WORKSPACE, PROJECT_LIST, SKILL_GROUPS, PUBLICATIONS,
  type FileId, type SiteData,
} from '@/lib/ide-data'
import { ChevronIcon, FileIcon, GitIcon, SparkIcon } from './icons'
import type { PanelId } from './chrome'

const FOLDERS: { key: 'src' | 'data'; label: string }[] = [
  { key: 'src', label: 'src' },
  { key: 'data', label: 'data' },
]

/* ============================================================= explorer */

function Explorer({
  active, onOpen, onAssistant,
}: {
  active: FileId | null
  onOpen: (id: FileId) => void
  onAssistant: () => void
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({ src: true, data: true })
  const rootFiles = FILES.filter((f) => f.folder === 'root')

  const row = (id: FileId, name: string, icon: string, depth: number) => (
    <button
      key={id}
      onClick={() => onOpen(id)}
      className={`flex w-full items-center gap-2 py-[5px] text-left text-[12px] transition ${
        active === id ? 'bg-accent/20 text-bright' : 'text-text/85 hover:bg-hover'
      }`}
      style={{ paddingLeft: 10 + depth * 14, paddingRight: 10 }}
    >
      <FileIcon kind={icon} />
      <span className="truncate">{name}</span>
    </button>
  )

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-2 scroll-thin">
        {FOLDERS.map((folder) => {
          const files = FILES.filter((f) => f.folder === folder.key)
          const isOpen = open[folder.key]
          return (
            <div key={folder.key}>
              <button
                onClick={() => setOpen((s) => ({ ...s, [folder.key]: !s[folder.key] }))}
                className="flex w-full items-center gap-1 px-2 py-[5px] text-[11px] font-semibold uppercase tracking-wide text-text/85 transition hover:bg-hover"
              >
                <ChevronIcon open={isOpen} />
                <span>{folder.label}</span>
                <span className="ml-auto text-[10px] text-dim">{files.length}</span>
              </button>
              {isOpen && files.map((f) => row(f.id, f.name, f.icon, 1))}
            </div>
          )
        })}

        <div className="mt-1 border-t border-line pt-1">
          {rootFiles.map((f) => row(f.id, f.name, f.icon, 0))}
          <a
            href={RESUME.href}
            download
            className="group flex w-full items-center gap-2 px-[10px] py-[5px] text-[12px] text-text/85 transition hover:bg-hover"
          >
            <FileIcon kind="pdf" />
            <span className="truncate">{RESUME.name}</span>
            <span className="ml-auto text-[11px] opacity-0 transition-opacity group-hover:opacity-100">⤓</span>
          </a>
        </div>
      </div>

      <div className="px-3 py-2">
        <button
          onClick={onAssistant}
          className="flex w-full items-center gap-2 rounded-md border border-accent/45 bg-accent/12 px-2.5 py-2 text-[12px] text-bright transition hover:bg-accent/25"
        >
          <span className="text-accent">
            <SparkIcon size={14} />
          </span>
          <span className="flex-1 text-left">Ask about Athang</span>
          <span className="rounded bg-accent/30 px-1 text-[9px] tracking-wide">AI</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 border-t border-line px-3 py-1.5 text-[11px] text-dim">
        <GitIcon size={13} />
        <span className="text-text">main</span>
        <span className="ml-auto text-green">↑1</span>
        <span className="text-orange">✦3</span>
      </div>
    </>
  )
}

/* =============================================================== search */

interface Hit { id: FileId; file: string; line: string; icon: string }

function buildIndex(oss: SiteData['oss']): Hit[] {
  const hits: Hit[] = []
  PROJECT_LIST.forEach((p) => hits.push({ id: 'projects', file: 'projects.tsx', line: `${p.title}: ${p.stack.join(', ')}`, icon: 'tsx' }))
  oss.forEach((o) => hits.push({ id: 'opensource', file: 'opensource.go', line: `${o.repo}, ${o.merged} merged pull requests`, icon: 'go' }))
  SKILL_GROUPS.forEach((g) => hits.push({ id: 'skills', file: 'skills.json', line: `"${g.group}": [${g.items.join(', ')}]`, icon: 'json' }))
  hits.push({ id: 'experience', file: 'experience.ts', line: 'Full Stack Developer Intern, Aeons Technologies', icon: 'ts' })
  hits.push({ id: 'experience', file: 'experience.ts', line: 'Open Source Contributor, CNCF Headlamp and KubeArmor', icon: 'ts' })
  hits.push({ id: 'about', file: 'about.md', line: 'B.Tech ECE, SGGS Nanded, CGPA 9.21', icon: 'md' })
  PUBLICATIONS.forEach((b) => hits.push({ id: 'publications', file: 'publications.bib', line: b.title, icon: 'bib' }))
  hits.push({ id: 'contact', file: 'contact.sh', line: 'athangkali21@gmail.com', icon: 'sh' })
  return hits
}

function Search({ onOpen }: { onOpen: (id: FileId) => void }) {
  const d = useSiteData()
  const [q, setQ] = useState('')
  const index = useMemo(() => buildIndex(d.oss), [d])
  const results = useMemo(
    () => (q.trim().length < 2 ? [] : index.filter((h) => h.line.toLowerCase().includes(q.toLowerCase()))),
    [q, index],
  )

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2 scroll-thin">
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the portfolio"
        className="w-full rounded border border-line bg-bg px-2 py-1.5 text-[12px] text-text outline-none transition placeholder:text-dim focus:border-accent"
      />
      {q.trim().length >= 2 && (
        <p className="mt-2 text-[11px] text-dim">
          {results.length} result{results.length === 1 ? '' : 's'} in {new Set(results.map((r) => r.file)).size} files
        </p>
      )}
      <div className="mt-2 space-y-1">
        {results.map((h, i) => (
          <button
            key={i}
            onClick={() => onOpen(h.id)}
            className="w-full rounded px-2 py-1.5 text-left transition hover:bg-hover"
          >
            <div className="flex items-center gap-1.5 text-[11px] text-dim">
              <FileIcon kind={h.icon} size={12} />
              {h.file}
            </div>
            <div className="mt-0.5 line-clamp-2 text-[11.5px] text-text">{h.line}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ======================================================= source control */

function Scm() {
  const changes = [
    { file: 'projects.tsx', tag: 'M', color: 'var(--orange)' },
    { file: 'opensource.go', tag: 'M', color: 'var(--orange)' },
    { file: 'skills.json', tag: 'U', color: 'var(--green)' },
  ]
  const log = [
    { hash: '4f10865', msg: 'refactor portfolio', when: 'today' },
    { hash: 'a2fb5e6', msg: 'OSS refactor', when: 'last week' },
    { hash: 'd79dcb6', msg: 'init commit', when: 'earlier' },
  ]
  return (
    <div className="flex-1 overflow-y-auto px-3 py-2 scroll-thin">
      <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-dim">Changes</div>
      {changes.map((c) => (
        <div key={c.file} className="flex items-center gap-2 rounded px-1 py-1 text-[12px] text-text hover:bg-hover">
          <span className="truncate">{c.file}</span>
          <span className="ml-auto font-bold" style={{ color: c.color }}>{c.tag}</span>
        </div>
      ))}
      <div className="mb-1 mt-4 text-[10px] uppercase tracking-[0.14em] text-dim">Commits</div>
      {log.map((l) => (
        <div key={l.hash} className="rounded px-1 py-1.5 hover:bg-hover">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-yellow">{l.hash}</span>
            <span className="text-dim">{l.when}</span>
          </div>
          <div className="text-[12px] text-text">{l.msg}</div>
        </div>
      ))}
    </div>
  )
}

/* ============================================================ run panel */

function Run({ onOpen }: { onOpen: (id: FileId) => void }) {
  const d = useSiteData()
  const configs: { label: string; sub: string; id: FileId }[] = [
    { label: 'Launch projects', sub: `${PROJECT_LIST.length} shipped`, id: 'projects' },
    { label: 'Launch open source', sub: `${d.totalMerged} merged pull requests`, id: 'opensource' },
    { label: 'Launch experience', sub: 'career timeline', id: 'experience' },
    { label: 'Launch contact', sub: 'get in touch', id: 'contact' },
  ]
  return (
    <div className="flex-1 overflow-y-auto px-3 py-2 scroll-thin">
      <div className="mb-1.5 text-[10px] uppercase tracking-[0.14em] text-dim">Run and Debug</div>
      {configs.map((c) => (
        <button
          key={c.id}
          onClick={() => onOpen(c.id)}
          className="flex w-full items-center gap-2 rounded px-2 py-2 text-left transition hover:bg-hover"
        >
          <span className="text-green">▶</span>
          <span className="flex-1">
            <span className="block text-[12px] text-text">{c.label}</span>
            <span className="block text-[10.5px] text-dim">{c.sub}</span>
          </span>
        </button>
      ))}
    </div>
  )
}

/* ========================================================== extensions */

function Extensions() {
  const d = useSiteData()
  const list = [
    { name: 'kubernetes-sigs.headlamp', pub: 'CNCF Kubernetes dashboard', installs: `${d.oss[0]?.merged ?? 0} merged`, color: 'var(--blue)' },
    { name: 'kubearmor.runtime-security', pub: 'CNCF runtime security', installs: `${d.oss[1]?.merged ?? 0} merged`, color: 'var(--green)' },
    { name: 'mern.full-stack', pub: 'React · Node · Mongo', installs: 'daily driver', color: 'var(--cyan)' },
    { name: 'golang.go', pub: 'Fiber · Redis', installs: 'in use', color: 'var(--cyan)' },
    { name: 'leetcode.dsa', pub: 'algorithms and DSA', installs: 'top percentile', color: 'var(--orange)' },
  ]
  return (
    <div className="flex-1 overflow-y-auto px-3 py-2 scroll-thin">
      <div className="mb-1.5 text-[10px] uppercase tracking-[0.14em] text-dim">Installed</div>
      {list.map((e) => (
        <div key={e.name} className="flex gap-2.5 rounded px-1.5 py-2 transition hover:bg-hover">
          <div
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded text-[13px] font-bold"
            style={{ background: `color-mix(in srgb, ${e.color} 20%, transparent)`, color: e.color }}
          >
            {e.name[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[12px] text-text">{e.name}</div>
            <div className="truncate text-[10.5px] text-dim">{e.pub}</div>
            <div className="text-[10px]" style={{ color: e.color }}>{e.installs}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ================================================================ shell */

const TITLES: Record<PanelId, string> = {
  explorer: WORKSPACE,
  search: 'Search',
  scm: 'Source Control',
  run: 'Run and Debug',
  extensions: 'Extensions',
}

export function Sidebar({
  panel, active, onOpen, onAssistant,
}: {
  panel: PanelId
  active: FileId | null
  onOpen: (id: FileId) => void
  onAssistant: () => void
}) {
  return (
    <aside className="area-side flex w-[240px] flex-col overflow-hidden border-r border-line bg-bg2 select-none">
      <div className="px-4 pb-1.5 pt-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-text/85">
        {TITLES[panel]}
      </div>
      {panel === 'explorer' && <Explorer active={active} onOpen={onOpen} onAssistant={onAssistant} />}
      {panel === 'search' && <Search onOpen={onOpen} />}
      {panel === 'scm' && <Scm />}
      {panel === 'run' && <Run onOpen={onOpen} />}
      {panel === 'extensions' && <Extensions />}
    </aside>
  )
}
