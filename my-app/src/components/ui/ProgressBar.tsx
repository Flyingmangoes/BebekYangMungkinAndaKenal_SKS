import { cn } from '@/lib/cn'

export type ProgressTone = 'pelan' | 'sand' | 'muted'

export interface ProgressBarProps {
  value: number
  label: string
  tone?: ProgressTone
  className?: string
}

const FILL_CLASSES: Record<ProgressTone, string> = {
  pelan: 'bg-pelan-600',
  sand: 'bg-sand-500',
  muted: 'bg-ink-400',
}

export function ProgressBar({ value, label, tone = 'pelan', className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)))

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-cream-300', className)}
    >
      <div
        className={cn('h-full rounded-full transition-all', FILL_CLASSES[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
