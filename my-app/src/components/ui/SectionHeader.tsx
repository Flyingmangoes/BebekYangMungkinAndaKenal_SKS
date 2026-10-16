import type { ReactNode } from 'react'

import { Eyebrow } from '@/components/ui/Eyebrow'
import type { EyebrowTone } from '@/components/ui/Eyebrow'
import { cn } from '@/lib/cn'

export interface SectionHeaderProps {
  title: string
  eyebrow?: string
  eyebrowTone?: EyebrowTone
  description?: string
  action?: ReactNode
  level?: 'h1' | 'h2'
  className?: string
}

export function SectionHeader({
  title,
  eyebrow,
  eyebrowTone = 'muted',
  description,
  action,
  level = 'h2',
  className,
}: SectionHeaderProps) {
  const Heading = level

  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="flex min-w-0 max-w-3xl flex-col gap-2">
        {eyebrow ? <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow> : null}
        <Heading
          className={cn(
            'font-serif font-medium leading-tight text-ink-900',
            level === 'h1' ? 'text-3xl lg:text-4xl' : 'text-2xl',
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p className="text-sm leading-relaxed text-ink-500 lg:text-[15px]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
