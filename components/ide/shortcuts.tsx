'use client'

import { FILES } from '@/lib/ide-data'

const GROUPS: { title: string; rows: [string, string][] }[] = [
  {
    title: 'General',
    rows: [
      ['Ctrl K', 'Command palette'],
      ['Ctrl P', 'Command palette'],
      ['Ctrl /', 'Keyboard shortcuts'],
      ['Esc', 'Dismiss any overlay'],
    ],
  },
  {
    title: 'Panels',
    rows: [
      ['Ctrl B', 'Toggle sidebar'],
      ['Ctrl `', 'Toggle terminal'],
      ['Ctrl I', 'Toggle assistant'],
      ['Ctrl Shift C', 'Toggle assistant'],
    ],
  },
  {
    title: 'Editor',
    rows: [
      ['Ctrl 1 . . 9', 'Open the nth file'],
      ['Ctrl W', 'Close current tab'],
      ['Ctrl +', 'Increase text size'],
      ['Ctrl -', 'Decrease text size'],
      ['Ctrl 0', 'Reset text size'],
    ],
  },
  {
    title: 'Files',
    rows: FILES.slice(0, 5).map((f, i) => [`Ctrl ${i + 1}`, f.name] as [string, string]),
  },
]

export function ShortcutsModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="anim-fade fixed inset-0 z-[75] flex items-start justify-center bg-black/55 pt-[10vh] backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        className="anim-pop w-[min(700px,94vw)] overflow-hidden rounded-lg border border-line bg-bg3 shadow-2xl shadow-black/70"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <span className="text-[11px] uppercase tracking-[0.18em] text-dim">Keyboard Shortcuts</span>
          <button onClick={onClose} className="text-[11px] text-dim transition hover:text-text">
            esc
          </button>
        </div>

        <div className="grid max-h-[62vh] gap-x-10 gap-y-7 overflow-y-auto p-6 scroll-thin sm:grid-cols-2">
          {GROUPS.map((g) => (
            <section key={g.title}>
              <h3 className="mb-3 text-[10.5px] uppercase tracking-[0.18em] text-accent">{g.title}</h3>
              <div className="space-y-2">
                {g.rows.map(([keys, what]) => (
                  <div key={keys + what} className="flex items-baseline justify-between gap-4">
                    <span className="text-[12.5px] text-text/85">{what}</span>
                    <span className="flex shrink-0 gap-1">
                      {keys.split(' ').map((k, i) => (
                        <kbd
                          key={i}
                          className="rounded border border-line bg-bg px-1.5 py-0.5 text-[10.5px] text-dim"
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="border-t border-line px-5 py-3 text-[11px] text-dim">
          There is a working terminal too. Press Ctrl ` and type help.
        </p>
      </div>
    </div>
  )
}
