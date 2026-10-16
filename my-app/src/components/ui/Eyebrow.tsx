import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type EyebrowTone = 'clay' | 'muted' | 'mint'

export interface EyebrowProps {
  children: ReactNode
  tone?: EyebrowTone
  className?: string
}

const TONE_CLASSES: Record<EyebrowTone, string> = {
  clay: 'text-clay-500',
  muted: 'text-ink-500',
  mint: 'text-pelan-600',
}

export function Eyebrow({ children, tone = 'muted', className }: EyebrowProps) {
  return (
    <p
      className={cn(
        'text-[10px] font-semibold uppercase tracking-[0.14em]',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </p>
  )
}
