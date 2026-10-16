import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type ChipTone = 'neutral' | 'mint' | 'clay' | 'sand' | 'dark' | 'outline'

export interface ChipProps {
  children: ReactNode
  tone?: ChipTone
  icon?: LucideIcon
  active?: boolean
  onClick?: () => void
  className?: string
}

const TONE_CLASSES: Record<ChipTone, string> = {
  neutral: 'bg-cream-200 text-ink-700',
  mint: 'bg-pelan-100 text-pelan-700',
  clay: 'bg-clay-100 text-clay-600',
  sand: 'bg-sand-100 text-sand-500',
  dark: 'bg-pelan-700 text-white',
  outline: 'bg-white text-ink-700 ring-1 ring-cream-300 hover:bg-cream-50',
}

export function Chip({
  children,
  tone = 'neutral',
  icon: Icon,
  active = false,
  onClick,
  className,
}: ChipProps) {
  const classes = cn(
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-colors',
    TONE_CLASSES[tone],
    onClick && 'cursor-pointer',
    className,
  )

  const content = (
    <>
      {Icon ? <Icon size={12} aria-hidden="true" /> : null}
      {children}
    </>
  )

  if (onClick) {
    return (
      <button type="button" aria-pressed={active} onClick={onClick} className={classes}>
        {content}
      </button>
    )
  }

  return <span className={classes}>{content}</span>
}
