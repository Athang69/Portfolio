"use client"

import { motion } from "framer-motion"
import { ArrowSquareOut } from "@phosphor-icons/react"
import { SectionHeader } from "@/components/ui/section-header"

export function PublicationsSection() {
  return (
    <section id="publications" className="py-24 md:py-40 px-6 bg-surface">
      <div className="max-w-[800px] mx-auto">
        <SectionHeader label="06 / Publications" title="Publications" className="mb-16" />

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-surface border border-white/8 rounded-2xl p-8"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-sans text-[16px] font-semibold text-[#F2F2FF]">
              Design and Development of a Collaborative Learning System for Interactive Two-Way Education
            </h3>
            <a
              href="https://rjwave.org/ijedr/viewpaperforall.php?paper=IJEDR2504276"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View publication"
              className="text-[#52526E] hover:text-cyan-400 transition-colors"
            >
              <ArrowSquareOut size={18} />
            </a>
          </div>

          <p className="font-sans text-[15px] text-[#9898B8] leading-[1.6] mb-3">
            IJEDR Vol.13 Issue 4, Nov 2025, pp.198–201, ISSN:2321-9939
          </p>

          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-[15px] text-[#52526E]">
              <span className="text-violet-400 mt-1">·</span>
              <span>
                Design and development of an interactive collaborative learning platform enabling two-way education and real-time student engagement.
              </span>
            </li>
          </ul>
        </motion.article>
      </div>
    </section>
  )
}
