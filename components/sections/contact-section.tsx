'use client'

import { motion } from 'framer-motion'
import { Envelope, Phone, GithubLogo, LinkedinLogo, XLogo } from '@phosphor-icons/react'
import { SectionHeader } from '@/components/ui/section-header'
import { PERSONAL_INFO, SOCIAL_LINKS } from '@/lib/constants'

function LeetCodeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  )
}

const socialItems = [
  { icon: GithubLogo, label: 'GitHub', href: SOCIAL_LINKS.github, hoverBorder: 'hover:border-white/20', hoverIcon: 'group-hover:text-[#F2F2FF]' },
  { icon: LinkedinLogo, label: 'LinkedIn', href: SOCIAL_LINKS.linkedin, hoverBorder: 'hover:border-[#0A66C2]', hoverIcon: 'group-hover:text-[#0A66C2]' },
  { icon: LeetCodeIcon, label: 'LeetCode', href: SOCIAL_LINKS.leetcode, hoverBorder: 'hover:border-[#FFA116]', hoverIcon: 'group-hover:text-[#FFA116]', isCustomIcon: true },
  { icon: XLogo, label: 'Twitter', href: SOCIAL_LINKS.twitter, hoverBorder: 'hover:border-white/30', hoverIcon: 'group-hover:text-[#F2F2FF]' },
]

export function ContactSection() {
  return (
    <section id="contact" className="relative py-24 md:py-40 px-6">
      {/* Top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[200px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(124, 92, 252, 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-[640px] mx-auto text-center">
        <SectionHeader
          label="07 / Contact"
          title="Let's Build Something Great."
          className="mb-8 text-center [&>*]:mx-auto"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-lg text-[#9898B8] leading-[1.8] mb-6"
        >
          I&apos;m currently open to internship opportunities, open-source collaboration, and
          interesting freelance projects. If you&apos;re building something meaningful and think I
          can help — I&apos;d genuinely love to talk.
        </motion.p>

        {/* Availability chip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/25 bg-green-500/10 mb-12"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
          <span className="font-mono text-xs text-green-400 tracking-wide">
            Open to opportunities
          </span>
        </motion.div>

        {/* Contact cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="grid sm:grid-cols-2 gap-4 max-w-[560px] mx-auto mb-12"
        >
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="flex flex-col items-center gap-2 p-5 bg-surface border border-white/5 rounded-xl transition-all duration-200 hover:bg-elevated hover:border-violet-400/30 hover:-translate-y-1 group"
          >
            <Envelope size={24} className="text-violet-400" />
            <span className="font-mono text-xs text-[#52526E] uppercase">Email</span>
            <span className="font-sans text-[15px] text-[#F2F2FF] group-hover:text-violet-400 transition-colors">
              {PERSONAL_INFO.email}
            </span>
          </a>
          <a
            href={`tel:${PERSONAL_INFO.phone.replace(/\s/g, '')}`}
            className="flex flex-col items-center gap-2 p-5 bg-surface border border-white/5 rounded-xl transition-all duration-200 hover:bg-elevated hover:border-cyan-400/30 hover:-translate-y-1 group"
          >
            <Phone size={24} className="text-cyan-400" />
            <span className="font-mono text-xs text-[#52526E] uppercase">Phone</span>
            <span className="font-sans text-[15px] text-[#F2F2FF] group-hover:text-cyan-400 transition-colors">
              {PERSONAL_INFO.phone}
            </span>
          </a>
        </motion.div>

        {/* Social links grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-4 gap-3 max-w-[360px] mx-auto"
        >
          {socialItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className={`group flex flex-col items-center gap-2.5 p-5 bg-surface border border-white/5 rounded-xl transition-all duration-200 hover:bg-elevated ${item.hoverBorder}`}
            >
              {item.isCustomIcon ? (
                <item.icon className={`w-5 h-5 text-[#52526E] transition-colors ${item.hoverIcon}`} />
              ) : (
                <item.icon size={20} className={`text-[#52526E] transition-colors ${item.hoverIcon}`} />
              )}
              <span className="font-sans text-[13px] text-[#52526E]">{item.label}</span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
