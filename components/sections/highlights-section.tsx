'use client'

import { motion } from 'framer-motion'
import { GraduationCap } from '@phosphor-icons/react'
import { SectionHeader } from '@/components/ui/section-header'

function LeetCodeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  )
}

export function HighlightsSection() {
  return (
    <section className="py-24 md:py-40 px-6">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader label="07 / Highlights" title="By The Numbers" className="mb-16" />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Competitive Programming Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-surface border border-white/8 rounded-[20px] p-10 overflow-hidden"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(124, 92, 252, 0.06) 0%, transparent 70%)',
            }}
          >
            <LeetCodeIcon className="w-8 h-8 text-[#FFA116] mb-6" />
            
            <div className="gradient-text font-display text-[72px] font-extrabold leading-none">
              1650+
            </div>
            <p className="font-sans text-[14px] text-[#52526E] uppercase tracking-[0.1em] mt-2">
              LeetCode Rating
            </p>

            <div className="h-px bg-white/5 my-6" />

            <div className="mb-2">
              <span className="font-sans text-lg font-semibold text-[#F2F2FF]">450+ Problems</span>
              <span className="font-mono text-[13px] text-[#9898B8] ml-3">Top 14% Globally</span>
            </div>
            <p className="font-sans text-[13px] text-[#52526E]">
              Strong in Arrays, DP, Graphs, Binary Search, Trees
            </p>
          </motion.div>

          {/* Academic Excellence Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-surface border border-white/8 rounded-[20px] p-10 overflow-hidden"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.04) 0%, transparent 70%)',
            }}
          >
            <GraduationCap size={32} className="text-cyan-400 mb-6" />
            
            <div className="gradient-text font-display text-[72px] font-extrabold leading-none">
              9.21
            </div>
            <p className="font-sans text-[14px] text-[#52526E] uppercase tracking-[0.1em] mt-2">
              CGPA / 10
            </p>

            <div className="h-px bg-white/5 my-6" />

            <p className="font-sans text-lg font-semibold text-[#F2F2FF] mb-1">
              B.Tech Electronics & Telecom
            </p>
            <p className="font-sans text-[14px] text-[#9898B8] mb-1">
              SGGS Institute of Engineering, Nanded
            </p>
            <p className="font-mono text-[13px] text-[#52526E]">2023 – 2027</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
