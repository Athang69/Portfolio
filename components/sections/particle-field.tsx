'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  isPulsar: boolean
  pulsePhase: number
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>(0)

  const initParticles = useCallback((width: number, height: number) => {
    const isMobile = width < 768
    const count = isMobile ? 800 : 3000
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      const isPulsar = i < (isMobile ? 2 : 5)
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: isPulsar ? 3 : 1,
        color: Math.random() > 0.3 ? '#7C5CFC' : '#00D4FF',
        alpha: isPulsar ? 0.8 : Math.random() * 0.4 + 0.2,
        isPulsar,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    }

    particlesRef.current = particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas.width, canvas.height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    let rotation = 0
    const isMobile = window.innerWidth < 768

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      rotation += 0.0003
      const time = Date.now() * 0.001

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Mouse parallax (desktop only)
      const parallaxX = isMobile ? 0 : (mouseRef.current.x - centerX) * 0.02
      const parallaxY = isMobile ? 0 : (mouseRef.current.y - centerY) * 0.02

      particlesRef.current.forEach((p) => {
        // Update position with slow drift
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Apply rotation around center
        const dx = p.x - centerX
        const dy = p.y - centerY
        const cos = Math.cos(rotation)
        const sin = Math.sin(rotation)
        const rotatedX = centerX + dx * cos - dy * sin
        const rotatedY = centerY + dx * sin + dy * cos

        // Apply parallax
        const finalX = rotatedX - parallaxX * (p.z / 1000)
        const finalY = rotatedY - parallaxY * (p.z / 1000)

        // Calculate size based on depth
        const scale = 1 - p.z / 2000
        let size = p.size * scale

        // Pulse effect for pulsars
        if (p.isPulsar) {
          size = p.size * (1 + Math.sin(time * 2 + p.pulsePhase) * 0.3)
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(finalX, finalY, Math.max(0.5, size), 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha * scale
        ctx.fill()
      })

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initParticles])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
