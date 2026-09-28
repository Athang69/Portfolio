import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ABOUT, HERO, LEETCODE, LINKS, MENTORSHIP, SKILL_GROUPS, TOTAL_MERGED } from '@/lib/ide-data'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const url = 'https://www.athangkali.me'
const description =
  `Systems engineer and CNCF contributor. LFX mentee for ${MENTORSHIP.term} on Headlamp Kyverno policy visualization. ${TOTAL_MERGED} merged pull requests across Headlamp and KubeArmor, LeetCode top ${LEETCODE.topPercentage}%.`

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: 'Athang Kali | Portfolio',
  description,
  keywords: [
    'Athang Kali', 'Full Stack Developer', 'MERN', 'React', 'Node.js', 'Go',
    'Kubernetes', 'Headlamp', 'KubeArmor', 'Kyverno', 'CNCF', 'LFX Mentorship',
    'Open Source', 'SGGS Nanded',
  ],
  authors: [{ name: 'Athang Kali', url }],
  openGraph: {
    type: 'website',
    url,
    title: 'Athang Kali, Systems Engineer and Open Source Contributor',
    description,
    siteName: 'Athang Kali',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@AthangKali',
    creator: '@AthangKali',
    title: 'Athang Kali, Systems Engineer',
    description,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

/**
 * schema.org Person, so search engines treat the site as an entity rather than
 * a loose page. Built from ide-data for the same reason everything else is:
 * one place to change a fact.
 */
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: `${HERO.first} ${HERO.last}`,
  url,
  jobTitle: HERO.roles[0],
  description: HERO.summary,
  email: `mailto:${LINKS[0].value}`,
  image: `${url}/opengraph-image`,
  sameAs: LINKS.filter((l) => l.href.startsWith('http') && l.href !== url).map((l) => l.href),
  knowsAbout: SKILL_GROUPS.flatMap((g) => g.items),
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: ABOUT.education[0].school,
    address: ABOUT.education[0].place,
  },
  memberOf: {
    '@type': 'Organization',
    name: 'Cloud Native Computing Foundation',
    url: 'https://www.cncf.io/',
  },
  award: `${MENTORSHIP.program} ${MENTORSHIP.term}: ${MENTORSHIP.project}`,
}

export const viewport: Viewport = {
  themeColor: '#16161f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${syne.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // Serialised from a literal we control, so there is no injection surface.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
