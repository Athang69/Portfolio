/** Hand-rolled SVGs so the whole shell ships without an icon dependency. */

type P = { className?: string; size?: number }

const box = (size = 16) => ({ width: size, height: size, viewBox: '0 0 16 16', fill: 'none' })

/* ----------------------------------------------------- file type icons */

export function FileIcon({ kind, size = 15 }: { kind: string; size?: number }) {
  switch (kind) {
    case 'tsx':
      return (
        <svg {...box(size)} aria-hidden>
          <circle cx="8" cy="8" r="1.5" fill="#61dafb" />
          <g stroke="#61dafb" strokeWidth="0.9" fill="none">
            <ellipse cx="8" cy="8" rx="6.6" ry="2.6" />
            <ellipse cx="8" cy="8" rx="6.6" ry="2.6" transform="rotate(60 8 8)" />
            <ellipse cx="8" cy="8" rx="6.6" ry="2.6" transform="rotate(120 8 8)" />
          </g>
        </svg>
      )
    case 'ts':
      return (
        <svg {...box(size)} aria-hidden>
          <rect x="1" y="1" width="14" height="14" rx="2" fill="#3178c6" />
          <text x="8" y="11.4" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" fontFamily="system-ui">TS</text>
        </svg>
      )
    case 'json':
      return (
        <svg {...box(size)} aria-hidden>
          <rect x="1" y="1" width="14" height="14" rx="2" fill="none" stroke="#f5c542" strokeWidth="1.1" />
          <text x="8" y="11.2" textAnchor="middle" fontSize="8" fontWeight="700" fill="#f5c542" fontFamily="monospace">{'{}'}</text>
        </svg>
      )
    case 'go':
      return (
        <svg {...box(size)} aria-hidden>
          <rect x="1" y="3" width="14" height="10" rx="2.5" fill="#00add8" />
          <text x="8" y="11" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff" fontFamily="system-ui">GO</text>
        </svg>
      )
    case 'sh':
      return (
        <svg {...box(size)} aria-hidden>
          <rect x="1" y="2" width="14" height="12" rx="2" fill="#2f3b45" stroke="#4caf50" strokeWidth="0.9" />
          <path d="M4 6l2.2 2L4 10" stroke="#4caf50" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 10.4h4" stroke="#4caf50" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    case 'md':
      return (
        <svg {...box(size)} aria-hidden>
          <rect x="0.7" y="3" width="14.6" height="10" rx="1.6" fill="none" stroke="#519aba" strokeWidth="1.1" />
          <path d="M3.2 10.6V5.9l2 2.4 2-2.4v4.7" stroke="#519aba" strokeWidth="1.1" fill="none" strokeLinejoin="round" />
          <path d="M10.4 5.9v3.1M10.4 10.6l-1.3-1.6M10.4 10.6l1.3-1.6" stroke="#519aba" strokeWidth="1.1" strokeLinecap="round" fill="none" />
        </svg>
      )
    case 'bib':
      return (
        <svg {...box(size)} aria-hidden>
          <rect x="1" y="2" width="14" height="12" rx="1.6" fill="none" stroke="#a78bfa" strokeWidth="1.1" />
          <path d="M4 5.4h4.4M4 8h8M4 10.6h6" stroke="#a78bfa" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      )
    case 'diff':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 3h5l3 3v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.1" className="text-dim" />
          <path d="M5.4 8.4h2.2M6.5 7.3v2.2" stroke="#3fb950" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M8.9 11.1h2.2" stroke="#f85149" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    case 'pdf':
      return (
        <svg {...box(size)} aria-hidden>
          <path d="M3 1.5h6.5L13 5v9.5H3z" fill="none" stroke="#f44747" strokeWidth="1.1" strokeLinejoin="round" />
          <path d="M9.4 1.6V5H13" fill="none" stroke="#f44747" strokeWidth="1.1" strokeLinejoin="round" />
          <text x="8" y="12.4" textAnchor="middle" fontSize="4.4" fontWeight="700" fill="#f44747" fontFamily="system-ui">PDF</text>
        </svg>
      )
    default:
      return (
        <svg {...box(size)} aria-hidden>
          <path d="M3.5 1.5h5L12.5 5.5v9h-9z" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      )
  }
}

/* --------------------------------------------------- activity bar icons */

const S = (p: P) => ({
  width: p.size ?? 22,
  height: p.size ?? 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: p.className,
})

export const ExplorerIcon = (p: P) => (
  <svg {...S(p)} aria-hidden>
    <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4L10 7h9.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
  </svg>
)

export const SearchIcon = (p: P) => (
  <svg {...S(p)} aria-hidden>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5 21 21" />
  </svg>
)

export const GitIcon = (p: P) => (
  <svg {...S(p)} aria-hidden>
    <circle cx="7" cy="5.5" r="2.5" />
    <circle cx="7" cy="18.5" r="2.5" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M7 8v8M17 11.5c0 3-3.5 3.2-6.4 4.2" />
  </svg>
)

export const RunIcon = (p: P) => (
  <svg {...S(p)} aria-hidden>
    <path d="M5 4.5 18 12 5 19.5z" />
  </svg>
)

export const ExtensionsIcon = (p: P) => (
  <svg {...S(p)} aria-hidden>
    <path d="M10 3.5h4v3a1.6 1.6 0 0 0 3.2 0v-.8h3.3v4h-.8a1.6 1.6 0 0 0 0 3.2h.8v4h-3.3v-.8a1.6 1.6 0 0 0-3.2 0v3h-4v-3a1.6 1.6 0 0 0-3.2 0v.8H3.5v-4h.8a1.6 1.6 0 0 0 0-3.2h-.8v-4h3.3v.8a1.6 1.6 0 0 0 3.2 0z" />
  </svg>
)

export const GearIcon = (p: P) => (
  <svg {...S(p)} aria-hidden>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.8v2.4M12 18.8v2.4M4.5 7.5l2 1.2M17.5 15.3l2 1.2M4.5 16.5l2-1.2M17.5 8.7l2-1.2" />
  </svg>
)

export const SparkIcon = (p: P) => (
  <svg {...S(p)} aria-hidden>
    <path d="M12 3.5 13.8 9 19.5 10.8 13.8 12.6 12 18.2 10.2 12.6 4.5 10.8 10.2 9z" />
    <path d="M18.5 3v3M20 4.5h-3" />
  </svg>
)

export const TerminalIcon = (p: P) => (
  <svg {...S(p)} aria-hidden>
    <path d="m5 8 3.5 3.5L5 15M11 16h7" />
  </svg>
)

export const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s ease' }}
    aria-hidden
  >
    <path d="m6 4 4 4-4 4" />
  </svg>
)

export const CloseIcon = ({ size = 12 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <path d="m4 4 8 8M12 4l-8 8" />
  </svg>
)

export const ExternalIcon = ({ size = 11 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6.5 3.5H3.5v9h9v-3M9.5 3.5h3v3M12.5 3.5 7 9" />
  </svg>
)
