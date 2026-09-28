/**
 * Serves a merged pull request as a parsed diff.
 *
 * The site is an editor, so it should be able to show real code. These are
 * Athang's own merged PRs into CNCF projects, fetched from GitHub and parsed
 * into hunks here rather than in the browser.
 *
 * Merged diffs never change, so the upstream calls are cached for a week. The
 * repo is checked against the repos in live-stats.json: without that this
 * route would be an open proxy for arbitrary GitHub content.
 */

import { NextResponse } from 'next/server'
import baked from '@/lib/live-stats.json'

const WEEK = 604800
const MAX_FILES = 24
const MAX_LINES_PER_FILE = 500

const ALLOWED = new Set(baked.oss.map((o) => o.repo))

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
const headers: Record<string, string> = {
  accept: 'application/vnd.github+json',
  'user-agent': UA,
  ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
}

export type DiffLine = { t: 'add' | 'del' | 'ctx'; s: string; o?: number; n?: number }
export type DiffHunk = { header: string; lines: DiffLine[] }
export type DiffFile = {
  filename: string
  status: string
  additions: number
  deletions: number
  hunks: DiffHunk[]
  truncated: boolean
}

/** GitHub gives one patch per file, already starting at the first @@ header. */
function parsePatch(patch: string): { hunks: DiffHunk[]; truncated: boolean } {
  const hunks: DiffHunk[] = []
  let cur: DiffHunk | null = null
  let oldNo = 0
  let newNo = 0
  let count = 0
  let truncated = false

  for (const line of patch.split('\n')) {
    const m = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@(.*)$/.exec(line)
    if (m) {
      oldNo = Number(m[1])
      newNo = Number(m[2])
      cur = { header: m[3].trim(), lines: [] }
      hunks.push(cur)
      continue
    }
    if (!cur) continue
    if (line.startsWith('\\')) continue // "\ No newline at end of file"

    if (count++ >= MAX_LINES_PER_FILE) {
      truncated = true
      break
    }

    if (line.startsWith('+')) cur.lines.push({ t: 'add', s: line.slice(1), n: newNo++ })
    else if (line.startsWith('-')) cur.lines.push({ t: 'del', s: line.slice(1), o: oldNo++ })
    else cur.lines.push({ t: 'ctx', s: line.slice(1), o: oldNo++, n: newNo++ })
  }

  return { hunks, truncated }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const repo = searchParams.get('repo') ?? ''
  const number = Number(searchParams.get('number'))

  if (!ALLOWED.has(repo) || !Number.isInteger(number) || number <= 0) {
    return NextResponse.json({ error: 'Unknown pull request.' }, { status: 400 })
  }

  try {
    const [metaRes, filesRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${repo}/pulls/${number}`, { headers, next: { revalidate: WEEK } }),
      fetch(`https://api.github.com/repos/${repo}/pulls/${number}/files?per_page=${MAX_FILES}`, {
        headers,
        next: { revalidate: WEEK },
      }),
    ])
    if (!metaRes.ok || !filesRes.ok) {
      return NextResponse.json({ error: `GitHub returned ${metaRes.status}/${filesRes.status}.` }, { status: 502 })
    }

    const meta = await metaRes.json()
    const raw = await filesRes.json()

    const files: DiffFile[] = raw.map(
      (f: { filename: string; status: string; additions: number; deletions: number; patch?: string }) => {
        const { hunks, truncated } = f.patch ? parsePatch(f.patch) : { hunks: [], truncated: false }
        return {
          filename: f.filename,
          status: f.status,
          additions: f.additions,
          deletions: f.deletions,
          hunks,
          // A file with no patch is binary or too large for GitHub to inline.
          truncated: truncated || (!f.patch && f.additions + f.deletions > 0),
        }
      },
    )

    return NextResponse.json(
      {
        repo,
        number,
        title: meta.title,
        url: meta.html_url,
        merged: Boolean(meta.merged_at),
        mergedAt: meta.merged_at?.slice(0, 10) ?? null,
        additions: meta.additions,
        deletions: meta.deletions,
        changedFiles: meta.changed_files,
        files,
        filesTruncated: meta.changed_files > files.length,
      },
      { headers: { 'cache-control': `public, s-maxage=${WEEK}, stale-while-revalidate=${WEEK}` } },
    )
  } catch {
    return NextResponse.json({ error: 'Could not reach GitHub.' }, { status: 502 })
  }
}
