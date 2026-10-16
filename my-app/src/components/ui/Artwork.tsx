import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type ArtworkVariant = 'lamp' | 'cafe' | 'journal' | 'plant' | 'cup' | 'window'

export interface ArtworkProps {
  variant: ArtworkVariant
  icon?: LucideIcon
  children?: ReactNode
  className?: string
}

const VARIANT_CLASSES: Record<ArtworkVariant, string> = {
  lamp: 'bg-gradient-to-br from-[#ecc98f] via-[#b98a56] to-[#5e4630]',
  cafe: 'bg-gradient-to-br from-[#56666f] via-[#8c7a66] to-[#2f2a26]',
  journal: 'bg-gradient-to-br from-[#e1d4bc] via-[#b59d78] to-[#6e5b43]',
  plant: 'bg-gradient-to-br from-[#f1e6d4] via-[#d2b999] to-[#9b7b58]',
  cup: 'bg-gradient-to-br from-[#d3dad7] via-[#8f9f9a] to-[#4d5b57]',
  window: 'bg-gradient-to-br from-[#f5e9d4] via-[#d8c0a0] to-[#a68563]',
}

export function Artwork({ variant, icon: Icon, children, className }: ArtworkProps) {
  return (
    <div
      role="presentation"
      className={cn(
        'relative flex min-h-40 items-center justify-center overflow-hidden rounded-xl',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {Icon ? <Icon size={56} strokeWidth={1.2} className="text-white/35" aria-hidden="true" /> : null}
      {children}
    </div>
  )
}
