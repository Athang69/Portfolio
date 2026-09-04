'use client'

/**
 * Shared live stats for the whole editor.
 *
 * Server rendering and the first client render both use the build time
 * snapshot, so hydration matches exactly. One fetch to /api/stats runs per
 * page load, no matter how many components subscribe, and every subscriber
 * re-renders together when it lands. If the fetch fails the baked snapshot
 * simply stays on screen.
 */

import { useSyncExternalStore } from 'react'
import { DEFAULTS, derive, type LiveStats, type SiteData } from './ide-data'

let current: SiteData = DEFAULTS
let started = false
const listeners = new Set<() => void>()

async function load() {
  try {
    const res = await fetch('/api/stats')
    if (!res.ok) return

    const data = (await res.json()) as LiveStats
    if (!data?.leetcode || !Array.isArray(data.oss) || data.oss.length === 0) return

    current = derive(data)
    for (const notify of listeners) notify()
  } catch {
    // Keep the baked snapshot. Stale numbers beat a broken pane.
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  if (!started) {
    started = true
    void load()
  }
  return () => {
    listeners.delete(onChange)
  }
}

export function useSiteData(): SiteData {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => DEFAULTS,
  )
}
