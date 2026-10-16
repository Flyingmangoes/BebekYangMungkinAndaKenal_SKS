import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'clay'
export type ButtonSize = 'sm' | 'md'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-pelan-600 text-white hover:bg-pelan-700 shadow-sm',
  secondary: 'bg-cream-200 text-ink-900 hover:bg-cream-300',
  outline: 'bg-white text-ink-900 ring-1 ring-cream-300 hover:bg-cream-50',
  ghost: 'bg-transparent text-ink-500 hover:text-ink-900 hover:bg-cream-200/70',
  clay: 'bg-clay-600 text-white hover:bg-clay-500 shadow-sm',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
}

export function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  extra?: string,
): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pelan-500',
    'disabled:cursor-not-allowed disabled:opacity-60',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && 'w-full',
    extra,
  )
}
