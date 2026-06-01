'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowDown, DownloadSimple, GithubLogo, LinkedinLogo, XLogo } from '@phosphor-icons/react'
import { ParticleField } from './particle-field'
import { Typewriter } from '@/components/ui/typewriter'
import { PERSONAL_INFO, SOCIAL_LINKS, TYPING_PHRASES } from '@/lib/constants'

const socialLinks = [
  { icon: GithubLogo, href: SOCIAL_LINKS.github, label: 'GitHub', hoverColor: 'hover:text-[#F2F2FF]' },
  { icon: LinkedinLogo, href: SOCIAL_LINKS.linkedin, label: 'LinkedIn', hoverColor: 'hover:text-[#0A66C2]' },
  { icon: XLogo, href: SOCIAL_LINKS.twitter, label: 'Twitter', hoverColor: 'hover:text-[#F2F2FF]' },
]

// Custom LeetCode icon since Phosphor doesn't have one
function LeetCodeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
} as unknown as Variants

export function HeroSection() {
  return (
    <section className="relative min-h-svh flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-void">
        <ParticleField />
        {/* Gradient blobs */}
        <div
          className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-12 blur-[120px] animate-float"
          style={{ background: 'rgba(124, 92, 252, 0.12)' }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-8 blur-[100px] animate-float"
          style={{ background: 'rgba(0, 212, 255, 0.08)', animationDelay: '-3s' }}
        />
      </div>

      {/* Decorative background text */}
      <div
        className="absolute bottom-[-20px] right-[-40px] pointer-events-none select-none font-display font-extrabold tracking-tighter"
        style={{
          fontSize: 'clamp(120px, 18vw, 220px)',
          color: 'rgba(124, 92, 252, 0.025)',
        }}
        aria-hidden="true"
      >
        ENGINEER
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[800px]"
        >
          {/* Availability pill */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-400/25 bg-violet-400/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
              <span className="font-mono text-xs text-violet-300 tracking-wide">
                Available for Internships & Collaboration
              </span>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="font-display font-bold tracking-[-0.04em] leading-[0.95] mb-6"
            style={{
              fontSize: 'clamp(72px, 11vw, 128px)',
              textShadow: '0 0 80px rgba(124, 92, 252, 0.3)',
            }}
          >
            <span className="gradient-text">{PERSONAL_INFO.name}</span>
          </motion.h1>

          {/* Typing animation */}
          <motion.div
            variants={itemVariants}
            className="text-xl md:text-2xl mb-6"
          >
            <span className="font-sans font-light text-[#9898B8]">I build </span>
            <Typewriter
              phrases={TYPING_PHRASES}
              className="font-sans font-semibold text-violet-300"
            />
          </motion.div>

          {/* Bio */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-base text-[#9898B8] leading-relaxed max-w-[520px] mb-10"
          >
            ECE undergrad · {PERSONAL_INFO.shortInstitution} · CGPA {PERSONAL_INFO.cgpa} · Building real things, one commit at a time.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-lg font-sans font-semibold text-[15px] text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #7C5CFC 0%, #00D4FF 100%)',
                boxShadow: '0 0 40px rgba(124, 92, 252, 0.35)',
              }}
            >
              View My Work
              <ArrowDown size={18} weight="bold" />
            </a>
            <a
              href="https://drive.google.com/file/d/1tQvHSrPWQOZgSgfuAZ1Ni0firVFBJLTa/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-lg font-sans font-medium text-[15px] text-[#F2F2FF] border border-white/12 bg-transparent transition-all duration-200 hover:bg-white/[0.04] hover:border-white/20 active:scale-[0.98]"
            >
              <DownloadSimple size={18} className="text-[#9898B8]" />
              Download Resume
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${PERSONAL_INFO.name}'s ${social.label} profile`}
                className={`text-[#52526E] transition-all duration-200 hover:-translate-y-0.5 ${social.hoverColor}`}
              >
                <social.icon size={20} weight="regular" />
              </a>
            ))}
            <a
              href={SOCIAL_LINKS.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${PERSONAL_INFO.name}'s LeetCode profile`}
              className="text-[#52526E] transition-all duration-200 hover:-translate-y-0.5 hover:text-[#FFA116]"
            >
              <LeetCodeIcon className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[11px] text-[#2E2E45] uppercase tracking-[0.15em]">
          scroll
        </span>
        <div className="relative w-[1px] h-12 bg-[#2E2E45] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-violet-400 animate-scroll-line" />
        </div>
      </motion.div>
    </section>
  )
}
