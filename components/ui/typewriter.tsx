'use client'

import { useState, useEffect, useCallback } from 'react'

interface TypewriterProps {
  phrases: string[]
  typeSpeed?: number
  deleteSpeed?: number
  holdTime?: number
  pauseTime?: number
  className?: string
}

export function Typewriter({
  phrases,
  typeSpeed = 60,
  deleteSpeed = 30,
  holdTime = 2200,
  pauseTime = 400,
  className = '',
}: TypewriterProps) {
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const tick = useCallback(() => {
    const phrase = phrases[currentPhrase]

    if (isDeleting) {
      setCurrentText(phrase.substring(0, currentText.length - 1))
    } else {
      setCurrentText(phrase.substring(0, currentText.length + 1))
    }
  }, [currentPhrase, currentText, isDeleting, phrases])

  useEffect(() => {
    const phrase = phrases[currentPhrase]

    let timeout: NodeJS.Timeout

    if (!isDeleting && currentText === phrase) {
      // Finished typing, wait then start deleting
      timeout = setTimeout(() => setIsDeleting(true), holdTime)
    } else if (isDeleting && currentText === '') {
      // Finished deleting, move to next phrase
      setIsDeleting(false)
      setCurrentPhrase((prev) => (prev + 1) % phrases.length)
      timeout = setTimeout(tick, pauseTime)
    } else {
      // Continue typing or deleting
      timeout = setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed)
    }

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentPhrase, phrases, tick, typeSpeed, deleteSpeed, holdTime, pauseTime])

  return (
    <span className={className} aria-live="polite">
      {currentText}
      <span className="inline-block w-[2px] h-[1em] bg-violet-400 ml-1 animate-blink align-middle" />
    </span>
  )
}
