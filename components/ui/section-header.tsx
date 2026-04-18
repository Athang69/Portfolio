'use client'

import { motion } from 'framer-motion'

interface SectionHeaderProps {
  label: string
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ label, title, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <span className="font-mono text-xs text-violet-400 uppercase tracking-[0.15em] mb-4 block">
        {label}
      </span>
      <h2
        className="font-display font-bold text-[#F2F2FF] tracking-tight"
        style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="font-sans text-[17px] text-[#9898B8] leading-relaxed max-w-[560px] mt-4">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
