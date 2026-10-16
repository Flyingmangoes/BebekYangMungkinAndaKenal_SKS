import type { MouseEventHandler, ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type CardTone = 'default' | 'muted' | 'mint' | 'blush' | 'sand' | 'dark'

export interface CardProps {
  children: ReactNode
  tone?: CardTone
  as?: 'div' | 'section' | 'article' | 'aside'
  className?: string
  onClick?: MouseEventHandler<HTMLElement>
}

const TONE_CLASSES: Record<CardTone, string> = {
  default: 'bg-white/85 ring-1 ring-cream-300/70 shadow-[0_1px_2px_rgba(43,42,38,0.04)]',
  muted: 'bg-cream-200/70 ring-1 ring-cream-300/50',
  mint: 'bg-pelan-100 ring-1 ring-pelan-200/60',
  blush: 'bg-clay-100 ring-1 ring-clay-200/60',
  sand: 'bg-sand-100 ring-1 ring-sand-500/20',
  dark: 'bg-pelan-700 text-white',
}

export function Card({ children, tone = 'default', as: Tag = 'div', className, onClick }: CardProps) {
  return (
    <Tag className={cn('rounded-2xl p-5 lg:p-6', TONE_CLASSES[tone], className)} onClick={onClick}>
      {children}
    </Tag>
  )
}
