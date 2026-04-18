import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/sections/hero-section'
import { TickerStrip } from '@/components/sections/ticker-strip'
import { AboutSection } from '@/components/sections/about-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { OpenSourceSection } from '@/components/sections/opensource-section'
import { ExperienceSection } from '@/components/sections/experience-section'
import { HighlightsSection } from '@/components/sections/highlights-section'
import { ContactSection } from '@/components/sections/contact-section'

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <TickerStrip />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <OpenSourceSection />
        <ExperienceSection />
        <HighlightsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
