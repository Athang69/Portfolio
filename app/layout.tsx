import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LEETCODE, MENTORSHIP, TOTAL_MERGED } from '@/lib/ide-data'
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

export const viewport: Viewport = {
  themeColor: '#16161f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${syne.variable}`}>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
