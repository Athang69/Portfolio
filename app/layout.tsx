import type { Metadata, Viewport } from 'next'
import { Manrope, JetBrains_Mono, Instrument_Serif } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-instrument',
  display: 'swap',
})

// Using Syne as fallback for Clash Display
import { Syne } from 'next/font/google'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Athang Kali — Full Stack Developer & Open Source Contributor',
  description:
    'Third-year ECE student at SGGS Nanded. Full-stack developer (MERN), Kubernetes open-source contributor, LeetCode Top 14% (1650+, 400+ problems). CGPA 9.16.',
  keywords: [
    'Athang Kali',
    'Full Stack Developer',
    'MERN Stack',
    'React',
    'Node.js',
    'Kubernetes',
    'Open Source',
    'LeetCode',
    'ECE',
    'SGGS Nanded',
    'Portfolio',
  ],
  authors: [{ name: 'Athang Kali', url: 'https://athang-portfolio.vercel.app' }],
  openGraph: {
    type: 'website',
    url: 'https://athang-portfolio.vercel.app',
    title: 'Athang Kali — Full Stack Developer',
    description: 'ECE undergrad, MERN developer, Kubernetes contributor, LeetCode Top 14%.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@AthangKali',
    creator: '@AthangKali',
    title: 'Athang Kali — Full Stack Developer',
    description: 'ECE undergrad, MERN developer, Kubernetes contributor, LeetCode Top 14%.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#08080E',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} ${syne.variable} bg-void`}
    >
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-violet-400 focus:text-white focus:rounded-md"
        >
          Skip to main content
        </a>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
