import { ALT, CONTENT_TYPE, SIZE, socialCard } from '@/lib/og-card'

export const alt = ALT
export const size = SIZE
export const contentType = CONTENT_TYPE

export default function TwitterImage() {
  return socialCard()
}
