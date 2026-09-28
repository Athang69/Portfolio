#!/usr/bin/env node
/**
 * Pulls live stats from LeetCode and GitHub into lib/live-stats.json.
 *
 *   node scripts/sync-stats.mjs
 *
 * Runs automatically before every build (see the "prebuild" script). If a
 * network call fails the existing JSON is kept, so a flaky API can never
 * break a deploy. Set GITHUB_TOKEN to raise the GitHub rate limit.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'lib', 'live-stats.json')

const LEETCODE_USER = 'AthangOP'
const GITHUB_USER = 'Athang69'
const REPOS = ['kubernetes-sigs/headlamp', 'headlamp-k8s/plugins', 'kubearmor/KubeArmor']

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36'

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

async function fetchLeetCode() {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      referer: `https://leetcode.com/u/${LEETCODE_USER}/`,
      'user-agent': UA,
    },
    body: JSON.stringify({ query: LC_QUERY, variables: { u: LEETCODE_USER } }),
  })
  if (!res.ok) throw new Error(`leetcode ${res.status}`)

  const { data, errors } = await res.json()
  if (errors?.length) throw new Error(errors[0].message)
  if (!data?.matchedUser) throw new Error('leetcode: user not found')

  const by = Object.fromEntries(
    data.matchedUser.submitStats.acSubmissionNum.map((d) => [d.difficulty.toLowerCase(), d.count]),
  )
  const c = data.userContestRanking

  return {
    username: data.matchedUser.username,
    solved: by.all ?? 0,
    easy: by.easy ?? 0,
    medium: by.medium ?? 0,
    hard: by.hard ?? 0,
    ranking: data.matchedUser.profile?.ranking ?? null,
    rating: c ? Math.round(c.rating) : null,
    globalRanking: c?.globalRanking ?? null,
    totalParticipants: c?.totalParticipants ?? null,
    topPercentage: c?.topPercentage ?? null,
    contests: c?.attendedContestsCount ?? null,
  }
}

/* --------------------------------------------------------------- github */

const ghHeaders = {
  accept: 'application/vnd.github+json',
  'user-agent': UA,
  ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
}

async function ghSearch(q) {
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=100`
  const res = await fetch(url, { headers: ghHeaders })
  if (!res.ok) throw new Error(`github ${res.status} for "${q}"`)
  return res.json()
}

// GitHub's search API is rate limited hard when unauthenticated; go gently.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchRepo(repo) {
  const merged = await ghSearch(`repo:${repo} author:${GITHUB_USER} is:pr is:merged`)
  await sleep(2500)
  const open = await ghSearch(`repo:${repo} author:${GITHUB_USER} is:pr is:open`)
  await sleep(2500)

  const shape = (p) => ({
    number: p.number,
    title: p.title,
    url: p.html_url,
    mergedAt: p.pull_request?.merged_at?.slice(0, 10) ?? null,
  })
  const byNewest = (a, b) => b.number - a.number

  const prs = merged.items.map(shape).sort(byNewest)
  // Open pull requests matter on their own: the Kyverno plugin work for the
  // LFX mentorship is all still in review.
  const openPrs = open.items.map(shape).sort(byNewest)

  return {
    repo,
    merged: merged.total_count,
    open: open.total_count,
    firstMerged: prs.reduce((m, p) => (p.mergedAt && (!m || p.mergedAt < m) ? p.mergedAt : m), null),
    lastMerged: prs.reduce((m, p) => (p.mergedAt && (!m || p.mergedAt > m) ? p.mergedAt : m), null),
    prs,
    openPrs,
  }
}

/* ----------------------------------------------------------------- main */

function loadExisting() {
  try { return JSON.parse(readFileSync(OUT, 'utf8')) } catch { return null }
}

const prev = loadExisting()
const next = { generatedAt: new Date().toISOString() }
let failures = 0

try {
  next.leetcode = await fetchLeetCode()
  console.log(`✓ leetcode  ${next.leetcode.solved} solved · ${next.leetcode.rating} rating · top ${next.leetcode.topPercentage}%`)
} catch (err) {
  failures++
  next.leetcode = prev?.leetcode ?? null
  console.warn(`✗ leetcode  ${err.message}, keeping previous value`)
}

next.oss = []
for (const repo of REPOS) {
  try {
    const data = await fetchRepo(repo)
    next.oss.push(data)
    console.log(`✓ ${repo}  ${data.merged} merged · ${data.open} open`)
  } catch (err) {
    failures++
    const old = prev?.oss?.find((o) => o.repo === repo)
    if (old) next.oss.push(old)
    console.warn(`✗ ${repo}  ${err.message}, keeping previous value`)
  }
}

next.totalMerged = next.oss.reduce((n, o) => n + o.merged, 0)
next.totalOpen = next.oss.reduce((n, o) => n + o.open, 0)

if (!next.leetcode && next.oss.length === 0) {
  console.error('Nothing fetched and no previous data, leaving the file untouched.')
  process.exit(prev ? 0 : 1)
}

writeFileSync(OUT, JSON.stringify(next, null, 2) + '\n')
console.log(`\nwrote lib/live-stats.json: ${next.totalMerged} merged, ${next.totalOpen} open${failures ? ` (${failures} source(s) fell back)` : ''}`)
