/**
 * Live stats endpoint.
 *
 * lib/live-stats.json is written at build time, so without this route the
 * LeetCode and pull request counts would freeze until the next deploy. The
 * client fetches this on mount and swaps the numbers in.
 *
 * The response is cached for TTL seconds, so LeetCode and GitHub see at most
 * one round of calls per window no matter how much traffic arrives. Any
 * source that fails falls back to its build time value, so this endpoint
 * always returns a complete, well formed payload.
 */

import { NextResponse } from 'next/server'
import type { LiveStats } from '@/lib/ide-data'
import rawBaked from '@/lib/live-stats.json'

const baked: LiveStats = rawBaked

const TTL = 1800

export const revalidate = 1800

const LEETCODE_USER = 'AthangOP'
const GITHUB_USER = 'Athang69'
const REPOS = baked.oss.map((o) => o.repo)

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36'

type Leetcode = LiveStats['leetcode']
type Repo = LiveStats['oss'][number]

/* ------------------------------------------------------------- leetcode */

const LC_QUERY = `
query userStats($u: String!) {
  matchedUser(username: $u) {
    username
    profile { ranking }
    submitStats { acSubmissionNum { difficulty count } }
  }
  userContestRanking(username: $u) {
    rating
    globalRanking
    totalParticipants
    topPercentage
    attendedContestsCount
  }
}`

async function fetchLeetCode(): Promise<Leetcode | null> {
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        referer: `https://leetcode.com/u/${LEETCODE_USER}/`,
        'user-agent': UA,
      },
      body: JSON.stringify({ query: LC_QUERY, variables: { u: LEETCODE_USER } }),
      next: { revalidate: TTL },
    })
    if (!res.ok) return null

    const { data, errors } = await res.json()
    if (errors?.length || !data?.matchedUser) return null

    const by: Record<string, number> = Object.fromEntries(
      data.matchedUser.submitStats.acSubmissionNum.map(
        (d: { difficulty: string; count: number }) => [d.difficulty.toLowerCase(), d.count],
      ),
    )
    const c = data.userContestRanking

    return {
      username: data.matchedUser.username,
      solved: by.all ?? 0,
      easy: by.easy ?? 0,
      medium: by.medium ?? 0,
      hard: by.hard ?? 0,
      ranking: data.matchedUser.profile?.ranking ?? baked.leetcode.ranking,
      rating: c ? Math.round(c.rating) : baked.leetcode.rating,
      globalRanking: c?.globalRanking ?? baked.leetcode.globalRanking,
      totalParticipants: c?.totalParticipants ?? baked.leetcode.totalParticipants,
      topPercentage: c?.topPercentage ?? baked.leetcode.topPercentage,
      contests: c?.attendedContestsCount ?? baked.leetcode.contests,
    }
  } catch {
    return null
  }
}

/* --------------------------------------------------------------- github */

const ghHeaders: Record<string, string> = {
  accept: 'application/vnd.github+json',
  'user-agent': UA,
  ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
}

async function ghSearch(q: string) {
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=100`
  const res = await fetch(url, { headers: ghHeaders, next: { revalidate: TTL } })
  if (!res.ok) throw new Error(`github ${res.status}`)
  return res.json()
}

async function fetchRepo(repo: string): Promise<Repo | null> {
  try {
    const [merged, open] = await Promise.all([
      ghSearch(`repo:${repo} author:${GITHUB_USER} is:pr is:merged`),
      ghSearch(`repo:${repo} author:${GITHUB_USER} is:pr is:open`),
    ])

    type Raw = { number: number; title: string; html_url: string; pull_request?: { merged_at?: string } }
    const shape = (p: Raw) => ({
      number: p.number,
      title: p.title,
      url: p.html_url,
      mergedAt: p.pull_request?.merged_at?.slice(0, 10) ?? null,
    })
    const byNewest = (a: { number: number }, b: { number: number }) => b.number - a.number

    const prs = merged.items.map(shape).sort(byNewest)
    const openPrs = open.items.map(shape).sort(byNewest)

    const dates = prs.map((p: { mergedAt: string | null }) => p.mergedAt).filter(Boolean) as string[]

    return {
      repo,
      merged: merged.total_count,
      open: open.total_count,
      firstMerged: dates.length ? dates.reduce((a, b) => (a < b ? a : b)) : null,
      lastMerged: dates.length ? dates.reduce((a, b) => (a > b ? a : b)) : null,
      prs,
      openPrs,
    }
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ GET */

export async function GET() {
  const [leetcode, repos] = await Promise.all([
    fetchLeetCode(),
    Promise.all(REPOS.map(fetchRepo)),
  ])

  const oss = repos.map((r, i) => r ?? baked.oss[i])
  const fresh = [leetcode !== null, ...repos.map((r) => r !== null)]

  return NextResponse.json(
    {
      generatedAt: new Date().toISOString(),
      leetcode: leetcode ?? baked.leetcode,
      oss,
      totalMerged: oss.reduce((n, o) => n + o.merged, 0),
      totalOpen: oss.reduce((n, o) => n + o.open, 0),
      sources: {
        leetcode: leetcode ? 'live' : 'baked',
        ...Object.fromEntries(REPOS.map((r, i) => [r, repos[i] ? 'live' : 'baked'])),
      },
      complete: fresh.every(Boolean),
    },
    { headers: { 'cache-control': `public, s-maxage=${TTL}, stale-while-revalidate=86400` } },
  )
}
