'use client'

import { motion } from 'framer-motion'
import { GithubLogo, ArrowSquareOut } from '@phosphor-icons/react'
import { SectionHeader } from '@/components/ui/section-header'
import { PROJECTS } from '@/lib/constants'

interface ProjectCardProps {
  project: typeof PROJECTS[0]
  index: number
}

function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative bg-surface border border-white/8 rounded-2xl p-7 overflow-hidden transition-all duration-250 hover:border-violet-400/30 hover:bg-elevated hover:-translate-y-1 group ${
        project.featured ? 'lg:col-span-2' : ''
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{ background: 'linear-gradient(90deg, #7C5CFC 0%, #00D4FF 100%)' }}
      />

      {/* Card header */}
      <div className="flex items-start justify-between mb-4">
        <span className="font-mono text-xs text-[#2E2E45]">{project.number}</span>
        <div className="flex items-center gap-3">
          {project.featured && (
            <span className="px-2.5 py-1 bg-cyan-400/8 border border-cyan-400/20 rounded text-cyan-300 font-mono text-[11px]">
              Featured Project
            </span>
          )}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} source code on GitHub`}
            className="text-[#52526E] hover:text-violet-400 transition-colors"
          >
            <GithubLogo size={18} />
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} live demo`}
              className="text-[#52526E] hover:text-cyan-400 transition-colors"
            >
              <ArrowSquareOut size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-sans text-[22px] font-bold text-[#F2F2FF] group-hover:gradient-text-brand mb-3">
        {project.title}
      </h3>

      {/* Description */}
      <p className="font-sans text-[15px] text-[#9898B8] leading-[1.75] mb-4">
        {project.description}
      </p>

      {/* Highlights */}
      <ul className="space-y-2 mb-5">
        {project.highlights.slice(0, project.featured ? 5 : 3).map((highlight, i) => (
          <li key={i} className="flex items-start gap-2 text-[14px] text-[#52526E]">
            <span className="text-violet-400 mt-1">·</span>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 bg-violet-400/6 border border-violet-400/15 rounded text-violet-300 font-mono text-xs"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-3 pt-5 border-t border-white/5">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-sans text-[13px] font-medium text-[#52526E] hover:text-violet-400 transition-colors"
        >
          <GithubLogo size={16} />
          Source Code
        </a>
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-sans text-[13px] font-medium text-[#52526E] hover:text-cyan-400 transition-colors"
          >
            <ArrowSquareOut size={16} />
            Live Demo
          </a>
        )}
      </div>
    </motion.article>
  )
}

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 md:py-40 px-6">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          label="03 / Projects"
          title="Things I've Built"
          subtitle="Real systems with real data, deployed and working. Not just side projects — full applications with authentication, databases, APIs, and users."
          className="mb-16"
        />

        <div className="grid lg:grid-cols-2 gap-6">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
