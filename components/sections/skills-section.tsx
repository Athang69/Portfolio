'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeader } from '@/components/ui/section-header'
import { SKILLS, SKILL_CATEGORIES } from '@/lib/constants'

const categoryColors: Record<string, string> = {
  Languages: 'hover:border-violet-400',
  Frontend: 'hover:border-cyan-400',
  Backend: 'hover:border-emerald-500',
  Database: 'hover:border-amber-500',
  DevOps: 'hover:border-red-500',
  Monitoring: 'hover:border-orange-500',
  'CS Core': 'hover:border-[#9898B8]',
  Process: 'hover:border-[#9898B8]',
}

export function SkillsSection() {
  const [activeFilter, setActiveFilter] = useState('All')

  const getFilteredSkills = () => {
    if (activeFilter === 'All') {
      return Object.entries(SKILLS).flatMap(([category, skills]) =>
        skills.map((skill) => ({ skill, category }))
      )
    }
    const skills = SKILLS[activeFilter as keyof typeof SKILLS]
    if (!skills) return []
    return skills.map((skill) => ({ skill, category: activeFilter }))
  }

  const filteredSkills = getFilteredSkills()

  return (
    <section id="skills" className="py-24 md:py-40 px-6 bg-surface">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader label="02 / Skills" title="Tech Stack" className="mb-12" />

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={`h-[34px] px-4 rounded-md font-sans text-[13px] font-medium transition-all duration-150 ${
                activeFilter === cat.key
                  ? 'bg-violet-400/15 border border-violet-400/60 text-violet-300'
                  : 'bg-transparent border border-white/8 text-[#52526E] hover:bg-elevated hover:text-[#9898B8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <motion.div
          layout
          className="flex flex-wrap gap-2"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map(({ skill, category }) => (
              <motion.div
                key={skill}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-2 px-4 py-2.5 bg-surface border border-white/5 rounded-lg transition-all duration-180 hover:bg-elevated hover:-translate-y-0.5 hover:text-white ${categoryColors[category] || ''}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    category === 'Languages'
                      ? 'bg-violet-400'
                      : category === 'Frontend'
                      ? 'bg-cyan-400'
                      : category === 'Backend'
                      ? 'bg-emerald-500'
                      : category === 'Database'
                      ? 'bg-amber-500'
                      : category === 'DevOps' || category === 'Monitoring'
                      ? 'bg-red-500'
                      : 'bg-[#9898B8]'
                  }`}
                />
                <span className="font-mono text-[13px] text-[#9898B8]">{skill}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
