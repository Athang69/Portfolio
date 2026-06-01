'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { GraduationCap, Code, TrendUp, GitMerge } from '@phosphor-icons/react'
import { SectionHeader } from '@/components/ui/section-header'
import { STATS } from '@/lib/constants'

const iconMap = {
  GraduationCap,
  Code,
  TrendUp,
  GitMerge,
}

const terminalContent = [
  { line: '{', key: null, value: null },
  { line: null, key: '"name"', value: '"Athang Kali"', valueType: 'string' },
  { line: null, key: '"role"', value: '"Full Stack Developer"', valueType: 'string' },
  { line: null, key: '"degree"', value: '"B.Tech ECE"', valueType: 'string' },
  { line: null, key: '"institution"', value: '"SGGS Nanded"', valueType: 'string' },
  { line: null, key: '"year"', value: '"3rd Year (2023–27)"', valueType: 'string' },
  { line: null, key: '"cgpa"', value: '9.21', valueType: 'number' },
  { line: null, key: '"leetcode"', value: '"Top 14% · 1650+"', valueType: 'string' },
  { line: null, key: '"problems"', value: '450', valueType: 'number' },
  { line: null, key: '"open_source"', value: '6', valueType: 'number' },
  { line: null, key: '"location"', value: '"India"', valueType: 'string' },
  { line: null, key: '"available_for"', value: '[', valueType: 'array_start' },
  { line: null, key: null, value: '"Internships"', valueType: 'array_item', indent: true },
  { line: null, key: null, value: '"Open Source"', valueType: 'array_item', indent: true },
  { line: null, key: null, value: '"Freelance Projects"', valueType: 'array_item_last', indent: true },
  { line: '  ],', key: null, value: null },
  { line: null, key: '"status"', value: '"actively building"', valueType: 'status' },
  { line: '}', key: null, value: null },
]

function CountUpNumber({ target, suffix = '' }: { target: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  
  const numericPart = parseFloat(target.replace(/[^0-9.]/g, ''))
  const hasPlus = target.includes('+')

  useEffect(() => {
    if (!inView) return

    const duration = 2000
    const steps = 60
    const increment = numericPart / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= numericPart) {
        setCount(numericPart)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [inView, numericPart])

  const displayValue = Number.isInteger(numericPart) 
    ? Math.floor(count) 
    : count.toFixed(2)

  return (
    <span ref={ref} className="gradient-text font-display text-[40px] font-bold">
      {displayValue}{hasPlus && '+'}{suffix}
    </span>
  )
}

function TerminalCard() {
  const [visibleLines, setVisibleLines] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  useEffect(() => {
    if (!inView) return

    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= terminalContent.length) {
          clearInterval(timer)
          return prev
        }
        return prev + 1
      })
    }, 80)

    return () => clearInterval(timer)
  }, [inView])

  return (
    <div
      ref={ref}
      className="bg-surface border border-white/8 rounded-[14px] overflow-hidden"
    >
      {/* Terminal titlebar */}
      <div className="flex items-center gap-2 px-4 h-10 bg-elevated border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-2 font-mono text-xs text-[#52526E]">about.json</span>
      </div>

      {/* Terminal body */}
      <div className="p-5 font-mono text-[13px] leading-[1.7]">
        {terminalContent.slice(0, visibleLines).map((item, index) => (
          <div key={index} className={item.indent ? 'pl-6' : ''}>
            {item.line && <span className="text-white">{item.line}</span>}
            {item.key && (
              <>
                <span className="text-white">  </span>
                <span className="text-[#9B8FFF]">{item.key}</span>
                <span className="text-white">: </span>
              </>
            )}
            {item.value && (
              <span
                className={
                  item.valueType === 'number'
                    ? 'text-[#FAC775]'
                    : item.valueType === 'status'
                    ? 'text-[#22C55E]'
                    : 'text-[#50E3C2]'
                }
              >
                {item.value}
              </span>
            )}
            {item.key && item.valueType !== 'array_start' && index < terminalContent.length - 2 && (
              <span className="text-white">,</span>
            )}
          </div>
        ))}
        {visibleLines >= terminalContent.length && (
          <span className="inline-block w-2 h-4 bg-white animate-blink ml-0.5" />
        )}
      </div>
    </div>
  )
}

export function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-40 px-6">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader label="01 / About" title="Who I Am" className="mb-16" />

        {/* Two column layout */}
        <div className="grid lg:grid-cols-[55%_45%] gap-12 lg:gap-20 items-start">
          {/* Left column - Prose */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-sans text-[17px] text-[#F2F2FF] leading-[1.8] mb-6">
              I&apos;m a third-year Electronics and Telecommunication Engineering student who decided early
              on that the boundary between hardware and software is just a mindset. While my degree
              teaches me how signals travel through circuits, I spend my evenings building the systems
              that make those signals mean something.
            </p>
            <p className="font-sans text-[17px] text-[#F2F2FF] leading-[1.8] mb-6">
              I&apos;ve contributed to production-grade Kubernetes tools like Headlamp — not as a newcomer
              learning the ropes, but as someone who reads the codebase, identifies real bugs, and ships
              fixes that get merged. I believe the best way to learn is to build things that actually
              work in the world.
            </p>
            <p className="font-sans text-[17px] text-[#F2F2FF] leading-[1.8] mb-8">
              When I&apos;m not writing code, I&apos;m solving algorithmic problems on LeetCode (450+ problems,
              Top 14% globally) or studying how distributed systems behave under pressure. My CGPA of
              9.21 isn&apos;t just a number — it&apos;s proof that I don&apos;t choose between depth and breadth.
            </p>

            {/* Pull quote */}
            <blockquote className="border-l-2 border-violet-400 pl-5 mt-8">
              <p className="font-serif italic text-[22px] text-violet-300 leading-relaxed">
                &ldquo;I don&apos;t just write code that works. I write code worth reading.&rdquo;
              </p>
            </blockquote>

            {/* Fact chips */}
            <div className="flex flex-wrap gap-2.5 mt-7">
              {['Based in India', 'Open to Remote', 'Available 2025–2026'].map((chip) => (
                <span
                  key={chip}
                  className="px-3.5 py-1.5 bg-elevated border border-white/8 rounded-md font-mono text-xs text-[#9898B8]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right column - Terminal card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <TerminalCard />
          </motion.div>
        </div>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20"
        >
          {STATS.map((stat) => {
            const Icon = iconMap[stat.icon as keyof typeof iconMap]
            return (
              <div
                key={stat.label}
                className="p-6 bg-surface border border-white/5 rounded-xl transition-all duration-200 hover:border-violet-400/30 hover:bg-elevated group"
              >
                <Icon size={20} className="text-violet-400 mb-4" />
                <CountUpNumber target={stat.number} />
                <p className="font-sans text-[13px] text-[#52526E] font-medium mt-1">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
