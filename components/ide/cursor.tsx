'use client'

import { useEffect, useRef } from 'react'

/**
 * Custom cursor: a precise dot that tracks the pointer exactly, trailed by a
 * ring that eases toward it. The ring grows and picks up the accent colour over
 * anything interactive, and collapses into a text beam over inputs.
 *
 * Disabled entirely for touch/coarse pointers and when the visitor has asked
 * for reduced motion, and the native cursor is only hidden once this is live,
 * so nobody is ever left without one.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || calm) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add('has-custom-cursor')

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf = 0
    let visible = false

    const INTERACTIVE = 'a, button, summary, [role="button"], input[type="submit"]'
    const TEXTUAL = 'input:not([type="submit"]), textarea, [contenteditable="true"]'

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY

      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }

      const el = e.target as Element | null
      const interactive = !!el?.closest?.(INTERACTIVE)
      const textual = !!el?.closest?.(TEXTUAL)

      ring.dataset.state = textual ? 'text' : interactive ? 'active' : 'idle'
      dot.dataset.state = textual ? 'text' : 'idle'
    }

    const hide = () => {
      visible = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    const press = (down: boolean) => () => {
      ring.dataset.pressed = down ? 'true' : 'false'
    }

    const tick = () => {
      // ease the ring toward the pointer; the dot stays exact
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', press(true))
    window.addEventListener('pointerup', press(false))
    document.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', press(true))
      window.removeEventListener('pointerup', press(false))
      document.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  )
}
