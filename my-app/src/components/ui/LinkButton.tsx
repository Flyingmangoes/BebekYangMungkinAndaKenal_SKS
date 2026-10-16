import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { buttonClasses } from '@/lib/buttonStyles'
import type { ButtonSize, ButtonVariant } from '@/lib/buttonStyles'

export interface LinkButtonProps {
  to: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: LucideIcon
  iconRight?: LucideIcon
  fullWidth?: boolean
  className?: string
}

export function LinkButton({
  to,
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  fullWidth = false,
  className,
}: LinkButtonProps) {
  return (
    <Link to={to} className={buttonClasses(variant, size, fullWidth, className)}>
      {Icon ? <Icon size={size === 'sm' ? 14 : 16} aria-hidden="true" /> : null}
      {children}
      {IconRight ? <IconRight size={size === 'sm' ? 14 : 16} aria-hidden="true" /> : null}
    </Link>
  )
}
