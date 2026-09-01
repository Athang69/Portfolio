'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ABOUT, ALSO_KNOWN, CNCF_CARD, EXPERIENCE_LIST, HERO, HIGHLIGHTS, LEETCODE, LINKS, OSS,
  PROJECT_LIST, PUBLICATIONS, RESUME, SKILL_GROUPS, SYNCED_AT, TOTAL_MERGED,
  TOTAL_OPEN, type FileId,
} from '@/lib/ide-data'
import { ExternalIcon } from './icons'
import { Minimap } from './minimap'

/* ===================================================== shared pane shell */

/** Scroll offsets survive tab switches, the way a real editor remembers them. */
const scrollMemory = new Map<string, number>()

/**
 * One editor pane. A faint line-number gutter and a minimap keep the IDE
 * metaphor, while the content itself sits in a single reading column with a
 * comfortable measure.
 */
function Pane({ id, comment, children }: { id: FileId; comment: string; children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // reveal-on-scroll, scoped to this pane's scroll container
  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('shown')),
      { root, rootMargin: '0px 0px -6% 0px', threshold: 0.04 },
    )
    root.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // restore where this file was last left, and record it on the way out
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    // Wait for layout: on mount the pane has not been measured yet, so an
    // immediate assignment gets clamped to 0.
    const saved = scrollMemory.get(id) ?? 0
    let raf = 0
    if (saved > 0) {
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => {
          el.scrollTop = saved
        })
      })
    }

    // Record only from the scroll listener. Saving on cleanup would clobber the
    // stored offset with 0 under StrictMode's mount/unmount/mount cycle, before
    // the restore below has had a frame to run.
    const remember = () => scrollMemory.set(id, el.scrollTop)
    el.addEventListener('scroll', remember, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', remember)
    }
  }, [id])

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div ref={scrollRef} className="anim-fade relative flex-1 overflow-y-auto bg-bg scroll-thin">
        <div className="gutter pointer-events-none absolute inset-y-0 left-0 hidden w-[44px] overflow-hidden py-14 text-[11px] leading-[26px] md:block">
          {Array.from({ length: 260 }, (_, i) => (
            <div key={i} className="pr-4">{i + 1}</div>
          ))}
        </div>

        <div className="mx-auto w-full max-w-[880px] px-6 py-14 md:pl-[92px] md:pr-10">
          <p className="mb-10 text-[12px] text-gcm">{comment}</p>
          {children}
          <div className="h-24" />
        </div>
      </div>

      <Minimap scrollRef={scrollRef} paneId={id} />
    </div>
  )
}

function PageTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <header className="mb-14">
      <h1 className="display text-[clamp(2.1rem,4.6vw,3.1rem)] text-bright">{children}</h1>
      {sub && <p className="mt-3 text-[12.5px] leading-relaxed text-dim">{sub}</p>}
    </header>
  )
}

/** Small uppercase section label with a hairline running to the right. */
function Label({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-6 flex items-center gap-4 text-[10.5px] uppercase tracking-[0.24em] text-dim">
      <span className="whitespace-nowrap">{children}</span>
      <span className="h-px flex-1 bg-line" />
    </h2>
  )
}

/** Body copy. One measure, generous leading, nothing competing with it. */
function Body({ children }: { children: ReactNode }) {
  return <p className="text-[13.5px] leading-[1.85] text-text/85">{children}</p>
}

function Tags({ items }: { items: string[] }) {
  return (
    <p className="text-[11.5px] leading-relaxed text-dim">
      {items.map((s, i) => (
        <span key={s}>
          {i > 0 && <span className="text-dim/40"> · </span>}
          {s}
        </span>
      ))}
    </p>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((b) => (
        <li key={b} className="flex gap-3 text-[13px] leading-[1.8] text-text/80">
          <span className="mt-[9px] h-px w-3 shrink-0 bg-dim/60" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  )
}

function LinkOut({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-[12px] text-accent transition hover:text-bright"
    >
      {children}
      <ExternalIcon size={10} />
    </a>
  )
}

/* ============================================================== home.tsx */

function useTyped(words: string[]) {
  const [out, setOut] = useState('')
  const [i, setI] = useState(0)
  const [back, setBack] = useState(false)

  useEffect(() => {
    const word = words[i % words.length]
    if (!back && out === word) {
      const t = setTimeout(() => setBack(true), 1900)
      return () => clearTimeout(t)
    }
    if (back && out === '') {
      setBack(false)
      setI((n) => n + 1)
      return
    }
    const t = setTimeout(
      () => setOut(back ? word.slice(0, out.length - 1) : word.slice(0, out.length + 1)),
      back ? 26 : 58,
    )
    return () => clearTimeout(t)
  }, [out, back, i, words])

  return out
}

export function HomePane({ onOpen }: { onOpen: (id: FileId) => void }) {
  const typed = useTyped(HERO.typed)

  return (
    <Pane id="home" comment="// home.tsx">
      <p className="mb-4 text-[12px] uppercase tracking-[0.24em] text-dim">{HERO.affiliation}</p>

      <h1 className="display text-[clamp(2.8rem,7vw,4.6rem)] text-bright">
        {HERO.first} {HERO.last}
      </h1>

      <p className="mt-5 text-[13px] text-dim">
        {HERO.roles.map((r, i) => (
          <span key={r}>
            {i > 0 && <span className="text-dim/40"> · </span>}
            <span className="text-text">{r}</span>
          </span>
        ))}
      </p>

      <p className="mt-10 text-[13.5px] text-text">
        <span className="text-dim">Building </span>
        {typed}
        <span className="caret" />
      </p>

      <div className="mt-8 max-w-[68ch]">
        <Body>{HERO.summary}</Body>
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-accent">{HERO.seeking}</p>

      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
        <button onClick={() => onOpen('projects')} className="text-[12.5px] text-text underline decoration-line underline-offset-[6px] transition hover:text-bright hover:decoration-accent">
          View projects
        </button>
        <button onClick={() => onOpen('opensource')} className="text-[12.5px] text-text underline decoration-line underline-offset-[6px] transition hover:text-bright hover:decoration-accent">
          Open source work
        </button>
        <a href={RESUME.href} download className="text-[12.5px] text-text underline decoration-line underline-offset-[6px] transition hover:text-bright hover:decoration-accent">
          Download résumé
        </a>
      </div>

      <div className="reveal mt-20 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 sm:grid-cols-4">
        {HERO.stats.map((s) => (
          <div key={s.label}>
            <div className="display text-[1.75rem] leading-none text-bright">{s.value}</div>
            <div className="mt-2.5 text-[10.5px] uppercase tracking-[0.16em] text-dim">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="reveal mt-16">
        <Label>Elsewhere</Label>
        <div className="flex flex-wrap gap-x-7 gap-y-3">
          {LINKS.filter((l) => l.key !== 'Phone').map((l) => (
            <a key={l.key} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
               className="text-[12.5px] text-dim transition hover:text-bright">
              {l.key}
            </a>
          ))}
        </div>
      </div>
    </Pane>
  )
}

/* ============================================================== about.md */

export function AboutPane() {
  return (
    <Pane id="about" comment="<!-- about.md -->">
      <PageTitle sub="Background, current focus and record.">About</PageTitle>

      <div className="max-w-[68ch]">
        <Body>{ABOUT.intro}</Body>
      </div>

      <section className="reveal mt-16">
        <Label>Current focus</Label>
        <ul className="space-y-4">
          {ABOUT.focus.map((f) => (
            <li key={f.text} className="flex gap-5">
              <span className="w-5 shrink-0 pt-px text-[11px] tabular-nums text-dim/70">{f.icon}</span>
              <span className="text-[13px] leading-[1.8] text-text/85">{f.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="reveal mt-16">
        <Label>Education</Label>
        {ABOUT.education.map((e) => (
          <div key={e.school}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="text-[14px] text-bright">{e.school}</h3>
              <span className="text-[12px] text-dim">{e.period}</span>
            </div>
            <p className="mt-1.5 text-[12.5px] text-dim">{e.place}</p>
            <p className="mt-4 text-[13px] text-text/85">{e.degree}</p>
            <div className="mt-2 space-y-1">
              {e.notes.map((n) => (
                <p key={n} className="text-[12.5px] text-dim">{n}</p>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="reveal mt-16">
        <Label>Highlights</Label>
        <div className="space-y-7">
          {HIGHLIGHTS.map((h) => (
            <div key={h.label}>
              <p className="text-[13px] text-bright">
                {h.url ? <LinkOut href={h.url}>{h.label}</LinkOut> : h.label}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-text/75">{h.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </Pane>
  )
}

/* =========================================================== projects.tsx */

export function ProjectsPane() {
  return (
    <Pane id="projects" comment="// projects.tsx">
      <PageTitle sub="Selected work, designed and built end to end.">Projects</PageTitle>

      <div className="space-y-20">
        {PROJECT_LIST.map((p, i) => (
          <article key={p.title} className="reveal">
            <div className="mb-5 flex items-baseline gap-4">
              <span className="text-[11px] tabular-nums text-dim/70">{String(i + 1).padStart(2, '0')}</span>
              <Tags items={p.tags} />
            </div>

            <h3 className="display text-[1.6rem] leading-tight text-bright">{p.title}</h3>

            <div className="mt-5 max-w-[68ch]">
              <Body>{p.blurb}</Body>
            </div>

            <div className="mt-7">
              <Bullets items={p.bullets} />
            </div>

            <div className="mt-7 border-t border-line pt-5">
              <Tags items={p.stack} />
              <div className="mt-4 flex flex-wrap gap-x-7 gap-y-2">
                {p.github && <LinkOut href={p.github}>Source</LinkOut>}
                {p.live && <LinkOut href={p.live}>Live demo</LinkOut>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Pane>
  )
}

/** The CNCF contributor card, rendered natively so it sits in the site theme. */
function CncfCard() {
  const c = CNCF_CARD
  return (
    <section className="reveal mb-20 border border-line">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line px-6 py-4">
        <span className="text-[11px] uppercase tracking-[0.2em] text-accent">Cloud Native Computing Foundation</span>
        <span className="text-[11px] uppercase tracking-[0.2em] text-dim">Contributor Card</span>
      </div>

      <div className="px-6 py-7">
        <p className="text-[15px] text-bright">{c.handle}</p>

        <p className="mt-5 text-[13.5px] leading-relaxed text-text/85">
          <span className="display text-[1.5rem] text-bright">{c.contributions}</span>
          <span className="text-dim"> contributions to </span>
          <span className="display text-[1.5rem] text-bright">{c.repoCount}</span>
          <span className="text-dim"> repositories</span>
        </p>

        <div className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
          {c.counts.map((k) => (
            <div key={k.label}>
              <div className="text-[15px] tabular-nums text-bright">{k.value}</div>
              <div className="mt-1 text-[10.5px] uppercase tracking-[0.16em] text-dim">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-line pt-6">
          <p className="text-[10.5px] uppercase tracking-[0.18em] text-dim">First contribution</p>
          <a href={c.firstContribution.url} target="_blank" rel="noreferrer" className="group mt-3 block">
            <p className="text-[13px] text-text transition group-hover:text-bright">{c.firstContribution.repo}</p>
            <p className="mt-1.5 max-w-[60ch] text-[12.5px] leading-relaxed text-text/70">
              {c.firstContribution.title}
            </p>
            <p className="mt-1.5 text-[11.5px] text-dim">{c.firstContribution.date}</p>
          </a>
        </div>

        <div className="mt-8 grid gap-x-10 gap-y-6 border-t border-line pt-6 sm:grid-cols-2">
          <div>
            <p className="text-[10.5px] uppercase tracking-[0.18em] text-dim">Repositories</p>
            <p className="mt-2.5 text-[12.5px] text-text/85">{c.repos.join(' · ')}</p>
          </div>
          <div>
            <p className="text-[10.5px] uppercase tracking-[0.18em] text-dim">Years contributing</p>
            <p className="mt-2.5 text-[12.5px] text-text/85">{c.years.join(', ')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================================= opensource.go */

export function OpenSourcePane() {
  return (
    <Pane id="opensource" comment="// opensource.go">
      <PageTitle sub={`${TOTAL_MERGED} pull requests merged into CNCF projects, with ${TOTAL_OPEN} more in review.`}>
        Open Source
      </PageTitle>

      <CncfCard />

      <div className="space-y-20">
        {OSS.map((o) => (
          <section key={o.repo} className="reveal">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="text-[15px] text-bright">
                <a href={`https://github.com/${o.repo}`} target="_blank" rel="noreferrer" className="transition hover:text-accent">
                  {o.repo}
                </a>
              </h3>
              <span className="text-[11.5px] text-dim">
                {o.merged} merged{o.open > 0 && `, ${o.open} in review`}
              </span>
            </div>

            <p className="mt-2 text-[11.5px] uppercase tracking-[0.16em] text-dim/80">{o.tag}</p>

            <div className="mt-5 max-w-[68ch]">
              <Body>{o.blurb}</Body>
            </div>

            {o.wins.length > 0 && (
              <div className="mt-7">
                <Bullets items={o.wins} />
              </div>
            )}

            <details className="group mt-8 border-t border-line pt-5">
              <summary className="cursor-pointer list-none text-[12px] text-dim transition hover:text-text">
                <span className="group-open:hidden">Show all {o.merged} merged pull requests</span>
                <span className="hidden group-open:inline">Hide pull requests</span>
              </summary>
              <ul className="mt-5 space-y-3">
                {o.prs.map((pr) => (
                  <li key={pr.number}>
                    <a href={pr.url} target="_blank" rel="noreferrer" className="group/pr flex gap-4">
                      <span className="w-14 shrink-0 text-[11.5px] tabular-nums text-dim/70">#{pr.number}</span>
                      <span className="flex-1 text-[12.5px] leading-relaxed text-text/75 transition group-hover/pr:text-bright">
                        {pr.title}
                      </span>
                      <span className="hidden w-[76px] shrink-0 text-right text-[11px] tabular-nums text-dim/50 sm:block">
                        {pr.mergedAt}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <LinkOut href={o.allPrs}>All pull requests on GitHub</LinkOut>
              </div>
            </details>
          </section>
        ))}
      </div>

      <p className="mt-20 border-t border-line pt-5 text-[11px] text-dim/70">
        Pull request counts and listings sync directly from the GitHub API. Last updated {new Date(SYNCED_AT).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}.
      </p>
    </Pane>
  )
}

/* ========================================================= experience.ts */

export function ExperiencePane() {
  return (
    <Pane id="experience" comment="// experience.ts">
      <PageTitle sub="Open source work and professional engagements.">Experience</PageTitle>

      <div className="space-y-20">
        {EXPERIENCE_LIST.map((e) => (
          <section key={e.role + e.org} className="reveal">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="display text-[1.4rem] text-bright">{e.role}</h3>
              <span className="text-[12px] text-dim">{e.period}</span>
            </div>

            <p className="mt-2.5 text-[13px] text-text">
              {e.org}
              <span className="text-dim/50"> · </span>
              <span className="text-dim">{e.mode}</span>
            </p>

            <div className="mt-7">
              <Bullets items={e.bullets} />
            </div>

            <div className="mt-7 border-t border-line pt-5">
              <Tags items={e.stack} />
              {e.link && (
                <div className="mt-4">
                  <LinkOut href={e.link.url}>{e.link.label}</LinkOut>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </Pane>
  )
}

/* =========================================================== skills.json */

export function SkillsPane() {
  return (
    <Pane id="skills" comment="// skills.json">
      <PageTitle sub="Technologies I work with, grouped by domain.">Skills</PageTitle>

      <div className="space-y-12">
        {SKILL_GROUPS.map((g) => (
          <section key={g.group} className="reveal grid gap-x-10 gap-y-3 sm:grid-cols-[190px_1fr]">
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-dim">{g.group}</h3>
            <p className="text-[13px] leading-[2] text-text/85">
              {g.items.map((s, i) => (
                <span key={s}>
                  {i > 0 && <span className="text-dim/40"> · </span>}
                  {s}
                </span>
              ))}
            </p>
          </section>
        ))}
      </div>

      <section className="reveal mt-16 border-t border-line pt-10">
        <Label>Also familiar with</Label>
        <p className="text-[12.5px] leading-[2] text-dim">
          {ALSO_KNOWN.map((s, i) => (
            <span key={s}>
              {i > 0 && <span className="text-dim/40"> · </span>}
              {s}
            </span>
          ))}
        </p>
      </section>

      <section className="reveal mt-16">
        <Label>Problem solving</Label>
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
          {[
            { v: String(LEETCODE.solved), l: 'solved' },
            { v: String(LEETCODE.rating), l: 'rating' },
            { v: `${LEETCODE.topPercentage}%`, l: 'top percentile' },
            { v: String(LEETCODE.contests), l: 'contests' },
          ].map((s) => (
            <div key={s.l}>
              <div className="display text-[1.6rem] leading-none text-bright">{s.v}</div>
              <div className="mt-2.5 text-[10.5px] uppercase tracking-[0.16em] text-dim">{s.l}</div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[11px] text-dim/70">
          Synced from the LeetCode API on {new Date(SYNCED_AT).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}.
        </p>
      </section>
    </Pane>
  )
}

/* ====================================================== publications.bib */

export function PublicationsPane() {
  return (
    <Pane id="publications" comment="% publications.bib">
      <PageTitle sub="Peer reviewed research.">Publications</PageTitle>

      <div className="space-y-14">
        {PUBLICATIONS.map((p) => (
          <article key={p.key} className="reveal">
            <h3 className="max-w-[60ch] text-[15px] leading-[1.6] text-bright">{p.title}</h3>
            <p className="mt-4 text-[13px] text-text/85">{p.venue}</p>
            <p className="mt-1.5 text-[12.5px] text-dim">{p.detail}</p>
            <p className="mt-1.5 text-[12.5px] text-dim">{p.issn}</p>
            <div className="mt-5">
              <LinkOut href={p.url}>Read the paper</LinkOut>
            </div>
          </article>
        ))}
      </div>
    </Pane>
  )
}

/* ============================================================ contact.sh */

/**
 * Delivery is configured through env vars so the provider can change without
 * touching this file:
 *
 *   NEXT_PUBLIC_CONTACT_ENDPOINT   POST target (Formspree, Web3Forms, ...)
 *   NEXT_PUBLIC_WEB3FORMS_KEY      only for Web3Forms, sent as access_key
 *
 * With neither set the form degrades to a mailto: link, so it always works.
 */
const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY

type SendState = 'idle' | 'sending' | 'sent' | 'error'

export function ContactPane() {
  const [state, setState] = useState<SendState>('idle')
  const [error, setError] = useState('')
  const [draft, setDraft] = useState<Record<string, string> | null>(null)

  const mailtoFallback = (d: Record<string, string>) => {
    const subject = encodeURIComponent(d.subject || `Portfolio enquiry from ${d.name}`)
    const body = encodeURIComponent(`${d.message}\n\nFrom ${d.name} (${d.email})`)
    window.location.href = `mailto:athangkali21@gmail.com?subject=${subject}&body=${body}`
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>

    if (d.company) return // honeypot: a bot filled the hidden field

    setDraft(d)

    if (!CONTACT_ENDPOINT) {
      mailtoFallback(d)
      setState('sent')
      return
    }

    setState('sending')
    setError('')

    // Sent as FormData on purpose. A JSON content-type would trigger a CORS
    // preflight, and Web3Forms answers OPTIONS with a 403, so the request would
    // never leave the browser. multipart/form-data is a "simple" request and
    // skips the preflight entirely.
    const payload = new FormData()
    if (WEB3FORMS_KEY) payload.append('access_key', WEB3FORMS_KEY)
    payload.append('name', d.name)
    payload.append('email', d.email)
    payload.append('subject', d.subject || `Portfolio enquiry from ${d.name}`)
    payload.append('message', d.message)
    payload.append('from_name', 'athangkali.me')

    try {
      const res = await fetch(CONTACT_ENDPOINT, { method: 'POST', body: payload })
      const result = await res.json().catch(() => null)

      if (!res.ok || (result && result.success === false)) {
        throw new Error(result?.message || `Request failed with status ${res.status}`)
      }

      setState('sent')
      form.reset()
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const field =
    'w-full rounded border border-line bg-bg2/40 px-3 py-2.5 text-[13px] text-text outline-none transition placeholder:text-dim/45 focus:border-accent focus:bg-bg2/70'

  return (
    <Pane id="contact" comment="#!/bin/bash">
      <PageTitle sub="Open to engineering roles and interesting problems.">Contact</PageTitle>

      <div className="grid gap-x-16 gap-y-16 lg:grid-cols-[1fr_1.15fr]">
        <section className="reveal">
          <Label>Find me</Label>
          <div className="space-y-px">
            {LINKS.map((l) => (
              <a
                key={l.key}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="group flex items-baseline gap-4 rounded px-2 py-2.5 transition hover:bg-white/[0.035]"
              >
                <span className="w-[74px] shrink-0 text-[10.5px] uppercase tracking-[0.16em] text-dim">
                  {l.key}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-text transition group-hover:text-bright">
                  {l.value}
                </span>
                <span className="shrink-0 text-dim opacity-0 transition group-hover:opacity-100">
                  <ExternalIcon size={10} />
                </span>
              </a>
            ))}
          </div>

          <p className="mt-8 max-w-[40ch] text-[12px] leading-relaxed text-dim">
            Based in India, working remotely. I read everything that arrives and reply to most of it
            within a day or two.
          </p>
        </section>

        <section className="reveal">
          <Label>Send a message</Label>

          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[10.5px] uppercase tracking-[0.16em] text-dim">Name</span>
                <input required name="name" autoComplete="name" placeholder="Your name" className={field} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[10.5px] uppercase tracking-[0.16em] text-dim">Email</span>
                <input required type="email" name="email" autoComplete="email" placeholder="you@example.com" className={field} />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-[10.5px] uppercase tracking-[0.16em] text-dim">
                Subject <span className="tracking-normal text-dim/60">optional</span>
              </span>
              <input name="subject" placeholder="What is this about?" className={field} />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[10.5px] uppercase tracking-[0.16em] text-dim">Message</span>
              <textarea required name="message" rows={6} placeholder="Tell me what you are working on." className={`${field} resize-y`} />
            </label>

            {/* Honeypot: hidden from people, tempting to bots. */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="submit"
                disabled={state === 'sending'}
                className="rounded bg-accent px-5 py-2.5 text-[12.5px] font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {state === 'sending' ? 'Sending...' : 'Send message'}
              </button>

              {state === 'sent' && (
                <span className="anim-fade text-[12px] text-green">
                  {CONTACT_ENDPOINT ? 'Thanks, your message is on its way.' : 'Your mail client should be open now.'}
                </span>
              )}
              {state === 'error' && (
                <span className="anim-fade flex flex-wrap items-center gap-3 text-[12px] text-red">
                  Could not send.
                  <button
                    type="button"
                    onClick={() => draft && mailtoFallback(draft)}
                    className="text-accent underline decoration-line underline-offset-[5px] transition hover:text-bright hover:decoration-accent"
                  >
                    Send it by email instead
                  </button>
                </span>
              )}
            </div>

            {state === 'error' && error && (
              <p className="text-[11px] text-dim/80">Reason: {error}</p>
            )}

            {!CONTACT_ENDPOINT && (
              <p className="text-[11.5px] leading-relaxed text-dim">
                This opens your mail client addressed to my inbox. Set NEXT_PUBLIC_CONTACT_ENDPOINT to
                deliver messages straight to my inbox instead.
              </p>
            )}
          </form>
        </section>
      </div>
    </Pane>
  )
}

/* ============================================================= README.md */

export function ReadmePane() {
  const stack = [
    ['Languages', 'Go, C++, JavaScript, TypeScript, SQL, Shell, YAML, Python'],
    ['Cloud native', 'Kubernetes, eBPF, Docker, SLSA, OpenSSF Scorecard, GitHub Actions'],
    ['Web', 'Next.js, React.js, Node.js, Express.js, Tailwind CSS, REST APIs'],
    ['Data', 'PostgreSQL, MongoDB, MySQL, Redis, Prisma'],
    ['Observability', 'Prometheus, Grafana, Node Exporter'],
  ]

  return (
    <Pane id="readme" comment="# README.md">
      <h1 className="display text-[clamp(2.1rem,4.6vw,3.1rem)] text-bright">Athang Kali</h1>
      <p className="mt-4 text-[12.5px] text-dim">
        Systems engineer · Open source contributor · India
      </p>

      <div className="mt-12 max-w-[68ch]">
        <Body>{ABOUT.intro}</Body>
      </div>

      <section className="reveal mt-16">
        <Label>At a glance</Label>
        <div className="grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-4">
          {HERO.stats.map((s) => (
            <div key={s.label}>
              <div className="display text-[1.6rem] leading-none text-bright">{s.value}</div>
              <div className="mt-2.5 text-[10.5px] uppercase tracking-[0.16em] text-dim">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="reveal mt-16">
        <Label>Stack</Label>
        <div className="space-y-4">
          {stack.map(([k, v]) => (
            <div key={k} className="grid gap-x-10 gap-y-1 sm:grid-cols-[130px_1fr]">
              <span className="text-[11px] uppercase tracking-[0.16em] text-dim">{k}</span>
              <span className="text-[13px] leading-relaxed text-text/85">{v}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="reveal mt-16">
        <Label>Connect</Label>
        <div className="space-y-3">
          {LINKS.map((l) => (
            <div key={l.key} className="grid grid-cols-[110px_1fr] items-baseline gap-4">
              <span className="text-[11px] uppercase tracking-[0.16em] text-dim">{l.key}</span>
              <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                 className="text-[13px] text-text transition hover:text-accent">
                {l.value}
              </a>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-20 border-t border-line pt-5 text-[11px] text-dim/70">
        Built with Next.js and React. Statistics sync from the GitHub and LeetCode APIs.
      </p>
    </Pane>
  )
}

/* ================================================================ router */

export function EditorPane({ id, onOpen }: { id: FileId; onOpen: (id: FileId) => void }) {
  switch (id) {
    case 'home': return <HomePane onOpen={onOpen} />
    case 'about': return <AboutPane />
    case 'projects': return <ProjectsPane />
    case 'skills': return <SkillsPane />
    case 'experience': return <ExperiencePane />
    case 'opensource': return <OpenSourcePane />
    case 'publications': return <PublicationsPane />
    case 'contact': return <ContactPane />
    case 'readme': return <ReadmePane />
  }
}
