'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/section-header'
import { OPEN_SOURCE } from '@/lib/constants'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

function ContributionCard({ contribution, index }: { contribution: typeof OPEN_SOURCE[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-surface border border-white/8 border-l-[3px] border-l-violet-400 rounded-r-xl p-5 transition-all duration-200 hover:bg-elevated hover:border-l-violet-300 hover:translate-x-1"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <a
          href={`https://github.com/${contribution.repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[13px] text-cyan-400 hover:underline"
        >
          {contribution.repo}
        </a>
        <span className="px-2 py-0.5 border border-white/8 rounded text-[#52526E] font-mono text-[11px]">
          {contribution.tag}
        </span>
      </div>

      {/* Description */}
      <p className="font-sans text-[14px] text-[#9898B8] leading-relaxed mb-3">
        {contribution.description}
      </p>

      {/* PR chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        <TooltipProvider delayDuration={0}>
          {contribution.prs.map((pr) => (
            <Tooltip key={pr.number}>
              <TooltipTrigger asChild>
                <a
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-violet-400/8 border border-violet-400/20 rounded-md font-mono text-xs text-violet-300 transition-colors hover:bg-violet-400/15"
                >
                  PR {pr.number}
                </a>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-overlay border-white/8 text-[#9898B8] font-sans text-xs">
                {pr.tooltip}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Summary */}
      <p className="font-sans text-[13px] text-[#52526E]">{contribution.summary}</p>
    </motion.div>
  )
}

export function OpenSourceSection() {
  return (
    <section id="opensource" className="py-24 md:py-40 px-6 bg-surface">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          label="04 / Open Source"
          title="Contributing to the Ecosystem"
          subtitle="Real contributions to real production projects. Not tutorial repos — actual Kubernetes-ecosystem tools used by engineers worldwide."
          className="mb-16"
        />

        <div className="grid lg:grid-cols-[40%_60%] gap-12 lg:gap-16">
          {/* Left column - Intro */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-sans text-xl font-semibold text-[#F2F2FF] mb-6">
              I don&apos;t just use open-source tools. I improve them.
            </p>
            <p className="font-sans text-[15px] text-[#9898B8] leading-[1.8] mb-4">
              Contributing to the Kubernetes ecosystem as a third-year undergraduate isn&apos;t something
              that happens by accident. It requires understanding complex codebases, navigating real
              CI pipelines, writing test coverage, and communicating clearly with maintainers across
              time zones.
            </p>
            <p className="font-sans text-[15px] text-[#9898B8] leading-[1.8] mb-8">
              Every PR I&apos;ve merged represents hours of reading documentation, tracing bugs through
              unfamiliar code, and iterating based on reviewer feedback. It&apos;s the closest thing to a
              real engineering job — and I treat it that way.
            </p>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <span className="font-display text-4xl font-bold gradient-text">12+</span>
                <p className="font-sans text-[13px] text-[#52526E] mt-1">Merged PRs</p>
              </div>
              <div>
                <span className="font-display text-4xl font-bold gradient-text">3</span>
                <p className="font-sans text-[13px] text-[#52526E] mt-1">Projects Contributed</p>
              </div>
            </div>
          </motion.div>

          {/* Right column - Contribution cards */}
          <div className="space-y-4">
            {OPEN_SOURCE.map((contribution, index) => (
              <ContributionCard key={contribution.repo} contribution={contribution} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
