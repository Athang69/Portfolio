'use client'

/**
 * A merged pull request rendered as a diff, inside the editor.
 *
 * The rest of the site describes the open source work; this shows it. Patches
 * come from /api/diff already parsed into hunks, so this file only lays them
 * out.
 */

import { useEffect, useState } from 'react'
import { parseDiffId, type DiffId } from '@/lib/ide-data'
import { ExternalIcon } from './icons'

type Line = { t: 'add' | 'del' | 'ctx'; s: string; o?: number; n?: number }
type Hunk = { header: string; lines: Line[] }
type FileDiff = {
  filename: string
  status: string
  additions: number
  deletions: number
  hunks: Hunk[]
  truncated: boolean
}
type Diff = {
  repo: string
  number: number
  title: string
  url: string
  merged: boolean
  mergedAt: string | null
  additions: number
  deletions: number
  changedFiles: number
  files: FileDiff[]
  filesTruncated: boolean
}

/** Merged diffs are immutable, so one fetch per PR per session is plenty. */
const cache = new Map<string, Diff>()

function Stat({ add, del }: { add: number; del: number }) {
  return (
    <span className="tabular-nums">
      <span className="text-green">+{add}</span>
      <span className="text-dim"> / </span>
      <span className="text-red">-{del}</span>
    </span>
  )
}

function FileBlock({ file }: { file: FileDiff }) {
  return (
    <details open className="group border border-line">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 border-b border-line bg-bg2 px-4 py-2.5">
        <span className="font-mono text-[12px] text-text group-open:text-bright">{file.filename}</span>
        <span className="text-[11px] uppercase tracking-[0.14em] text-dim">{file.status}</span>
        <span className="ml-auto text-[11.5px]">
          <Stat add={file.additions} del={file.deletions} />
        </span>
      </summary>

      {file.hunks.length === 0 ? (
        <p className="px-4 py-4 text-[12px] text-dim">
          No inline patch for this file. GitHub omits binary and very large files.
        </p>
      ) : (
        <div className="overflow-x-auto">
          {file.hunks.map((h, hi) => (
            <div key={hi}>
              {/* --dim is tuned against --bg; this strip sits on --bg3, which is
                  lighter, so the hunk header uses --text to stay above 4.5:1. */}
              <div className="border-y border-line bg-bg3 px-4 py-1.5 font-mono text-[11px] text-text">
                {h.header || '…'}
              </div>
              <div className="font-mono text-[12px] leading-[1.7]">
                {h.lines.map((l, li) => (
                  <div
                    key={li}
                    className={`flex ${
                      l.t === 'add' ? 'bg-green/[0.10]' : l.t === 'del' ? 'bg-red/[0.10]' : ''
                    }`}
                  >
                    <span className="w-11 shrink-0 select-none px-2 text-right text-[10.5px] tabular-nums text-dim">
                      {l.o ?? ''}
                    </span>
                    <span className="w-11 shrink-0 select-none px-2 text-right text-[10.5px] tabular-nums text-dim">
                      {l.n ?? ''}
                    </span>
                    <span
                      className={`w-4 shrink-0 select-none text-center ${
                        l.t === 'add' ? 'text-green' : l.t === 'del' ? 'text-red' : 'text-dim'
                      }`}
                    >
                      {l.t === 'add' ? '+' : l.t === 'del' ? '-' : ' '}
                    </span>
                    <span className="whitespace-pre pr-6 text-text">{l.s || ' '}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {file.truncated && (
            <p className="border-t border-line px-4 py-3 text-[11.5px] text-dim">
              Truncated. Open the pull request on GitHub for the full patch.
            </p>
          )}
        </div>
      )}
    </details>
  )
}

export function DiffPane({ id }: { id: DiffId }) {
  const { repo, number } = parseDiffId(id)
  const [diff, setDiff] = useState<Diff | null>(cache.get(id) ?? null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cache.has(id)) return
    let live = true

    fetch(`/api/diff?repo=${encodeURIComponent(repo)}&number=${number}`)
      .then(async (r) => {
        const body = await r.json()
        if (!r.ok) throw new Error(body.error ?? `Request failed with ${r.status}.`)
        return body as Diff
      })
      .then((d) => {
        cache.set(id, d)
        if (live) setDiff(d)
      })
      .catch((e: Error) => live && setError(e.message))

    return () => {
      live = false
    }
  }, [id, repo, number])

  if (error) {
    return (
      <div className="px-6 py-14 md:px-10">
        <p className="text-[13px] text-text">This diff could not be loaded.</p>
        <p className="mt-2 max-w-[60ch] text-[12.5px] leading-relaxed text-dim">{error}</p>
        <a
          href={`https://github.com/${repo}/pull/${number}`}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] text-accent transition hover:text-bright"
        >
          Open #{number} on GitHub
          <ExternalIcon size={10} />
        </a>
      </div>
    )
  }

  if (!diff) {
    return (
      <div className="px-6 py-14 md:px-10">
        <div className="h-4 w-56 animate-pulse bg-bg3" />
        <div className="mt-4 h-3 w-80 animate-pulse bg-bg3" />
        <div className="mt-10 space-y-2">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="h-3 animate-pulse bg-bg3" style={{ width: `${88 - i * 6}%` }} />
          ))}
        </div>
        <p className="mt-10 text-[11.5px] text-dim">Fetching the patch from GitHub…</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-12 md:px-10">
      <header className="mb-10 border-b border-line pb-8">
        <p className="font-mono text-[11.5px] text-dim">
          {diff.repo} · #{diff.number}
        </p>
        <h1 className="mt-3 max-w-[60ch] text-[clamp(1.15rem,2.4vw,1.5rem)] leading-[1.4] text-bright">
          {diff.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11.5px]">
          <span className="border border-accent/40 px-2.5 py-1 uppercase tracking-[0.16em] text-accent">
            {diff.merged ? 'Merged' : 'Open'}
          </span>
          {diff.mergedAt && <span className="text-dim">{diff.mergedAt}</span>}
          <span className="text-dim">
            {diff.changedFiles} file{diff.changedFiles === 1 ? '' : 's'} changed
          </span>
          <Stat add={diff.additions} del={diff.deletions} />
          <a
            href={diff.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-accent transition hover:text-bright"
          >
            View on GitHub
            <ExternalIcon size={10} />
          </a>
        </div>
      </header>

      <div className="space-y-8">
        {diff.files.map((f) => (
          <FileBlock key={f.filename} file={f} />
        ))}
      </div>

      {diff.filesTruncated && (
        <p className="mt-8 border-t border-line pt-5 text-[11.5px] text-dim">
          Showing the first {diff.files.length} of {diff.changedFiles} changed files.
        </p>
      )}
    </div>
  )
}
