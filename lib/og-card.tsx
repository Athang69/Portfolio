/**
 * The shared social card, rendered to a PNG at build time by
 * app/opengraph-image.tsx and app/twitter-image.tsx.
 *
 * It reads from ide-data, so the numbers and the mentorship line can never
 * drift from the site itself. Fonts are committed under assets/ rather than
 * fetched, because Satori cannot parse woff2 and a build should not depend on
 * Google Fonts being reachable.
 */

import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { DEFAULTS, HERO, MENTORSHIP } from './ide-data'

export const SIZE = { width: 1200, height: 630 }
export const CONTENT_TYPE = 'image/png'
export const ALT = `${HERO.first} ${HERO.last}, ${HERO.roles.join(', ')}`

/* Default theme palette. Hardcoded because the CSS custom properties the site
   uses do not exist in the image renderer. */
const BG = '#16161f'
const LINE = '#2a2a38'
const TEXT = '#c9c9d4'
const DIM = '#8c8ca0'
const BRIGHT = '#f2f2ff'
const ACCENT = '#8669fc'

const font = (name: string) => readFileSync(join(process.cwd(), 'assets', name))

export function socialCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '66px 80px',
          background: BG,
          color: TEXT,
          fontFamily: 'JetBrains Mono',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 5, background: ACCENT }} />
        <div
          style={{
            position: 'absolute',
            top: -170,
            right: -170,
            width: 580,
            height: 580,
            borderRadius: 290,
            backgroundImage: `radial-gradient(circle, rgba(134,105,252,0.20), rgba(22,22,31,0) 65%)`,
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 19, letterSpacing: '0.26em', textTransform: 'uppercase', color: ACCENT }}>
            {HERO.affiliation}
          </div>

          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 104, lineHeight: 1, color: BRIGHT, marginTop: 24 }}>
            {`${HERO.first} ${HERO.last}`}
          </div>

          <div style={{ fontSize: 22, color: DIM, marginTop: 20 }}>{HERO.roles.join('   ·   ')}</div>

          <div style={{ display: 'flex', marginTop: 32 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: `1px solid rgba(134,105,252,0.45)`,
                padding: '11px 18px',
                fontSize: 16,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: ACCENT,
              }}
            >
              <div style={{ width: 9, height: 9, borderRadius: 5, background: ACCENT, marginRight: 12 }} />
              {`${MENTORSHIP.status} · ${MENTORSHIP.program} ${MENTORSHIP.term}`}
            </div>
          </div>

          <div style={{ fontSize: 21, color: TEXT, marginTop: 30, maxWidth: 900 }}>{HERO.seeking}</div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            borderTop: `1px solid ${LINE}`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: 'flex' }}>
            {DEFAULTS.stats.map((s) => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', marginRight: 64 }}>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 40, lineHeight: 1, color: BRIGHT }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 14, letterSpacing: '0.16em', textTransform: 'uppercase', color: DIM, marginTop: 10 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 20, color: DIM }}>athangkali.me</div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        { name: 'JetBrains Mono', data: font('JetBrainsMono-Regular.woff'), weight: 400, style: 'normal' },
        { name: 'Syne', data: font('Syne-ExtraBold.woff'), weight: 800, style: 'normal' },
      ],
    },
  )
}
