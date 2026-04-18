'use client'

import { GithubLogo, LinkedinLogo } from '@phosphor-icons/react'
import { SOCIAL_LINKS } from '@/lib/constants'

function LeetCodeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left - Logo */}
          <div className="flex items-center gap-3">
            <span className="font-display text-[22px] font-bold gradient-text-brand">AK</span>
            <span className="font-sans text-[14px] text-[#52526E]">Athang Kali</span>
          </div>

          {/* Center - Copyright */}
          <p className="font-sans text-[13px] text-[#2E2E45]">
            Designed & built by Athang Kali <span className="text-violet-400">·</span> 2025
          </p>

          {/* Right - Social icons */}
          <div className="flex items-center gap-4">
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-[#2E2E45] hover:text-[#9898B8] transition-colors"
            >
              <GithubLogo size={16} />
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[#2E2E45] hover:text-[#9898B8] transition-colors"
            >
              <LinkedinLogo size={16} />
            </a>
            <a
              href={SOCIAL_LINKS.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LeetCode"
              className="text-[#2E2E45] hover:text-[#9898B8] transition-colors"
            >
              <LeetCodeIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom micro-line */}
        <p className="text-center font-mono text-[11px] text-[#2E2E45] tracking-wider mt-6 pt-6 border-t border-white/5">
          Built with Next.js · TypeScript · Tailwind CSS · Framer Motion · Deployed on Vercel
        </p>
      </div>
    </footer>
  )
}
