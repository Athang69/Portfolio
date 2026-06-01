'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/section-header'
import { EXPERIENCE } from '@/lib/constants'
import { ArrowSquareOut } from '@phosphor-icons/react'

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 md:py-40 px-6">
      <div className="max-w-[800px] mx-auto">
        <SectionHeader label="05 / Experience" title="Work Experience" className="mb-16" />

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-surface border border-white/8 rounded-2xl p-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
            <div>
              <h3 className="font-sans text-[22px] font-bold text-[#F2F2FF] mb-1">
                {EXPERIENCE.company}
              </h3>
              <p className="font-sans text-base font-medium text-violet-300 mb-2">
                {EXPERIENCE.role}
              </p>
              <span className="inline-flex px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded text-green-500 font-mono text-[11px]">
                {EXPERIENCE.type}
              </span>
            </div>
            <div className="text-right">
              <p className="font-mono text-[13px] text-[#52526E]">{EXPERIENCE.dateRange}</p>
              <p className="font-mono text-[11px] text-[#2E2E45] mt-1">{EXPERIENCE.duration}</p>
              <div className="mt-2 flex items-center justify-end gap-2">
                <span className="font-mono text-[13px] text-[#52526E]">Certificate</span>
                <a
                  href="https://drive.google.com/file/d/1Elxi4uv47QLZAEnGCjGRs3Ow731NBdCi/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${EXPERIENCE.company} internship certificate`}
                  className="text-[#52526E] hover:text-violet-400 transition-colors"
                >
                  <ArrowSquareOut size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5 my-5" />

          {/* Responsibilities */}
          <ul className="space-y-3.5">
            {EXPERIENCE.responsibilities.map((responsibility, index) => (
              <li key={index} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-2" />
                <p className="font-sans text-[15px] text-[#9898B8] leading-[1.7]">
                  {responsibility}
                </p>
              </li>
            ))}
          </ul>

          {/* Skills used */}
          <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-white/5">
            {EXPERIENCE.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 bg-violet-400/6 border border-violet-400/15 rounded text-violet-300 font-mono text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.article>
      </div>
    </section>
  )
}
