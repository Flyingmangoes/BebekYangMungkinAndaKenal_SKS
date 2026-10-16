import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { buttonClasses } from '@/lib/buttonStyles'
import type { ButtonSize, ButtonVariant } from '@/lib/buttonStyles'

export interface ButtonProps {
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: LucideIcon
  iconRight?: LucideIcon
  type?: 'button' | 'submit'
  disabled?: boolean
  fullWidth?: boolean
  ariaLabel?: string
  onClick?: () => void
  className?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  type = 'button',
  disabled = false,
  fullWidth = false,
  ariaLabel,
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      className={buttonClasses(variant, size, fullWidth, className)}
    >
      {Icon ? <Icon size={size === 'sm' ? 14 : 16} aria-hidden="true" /> : null}
      {children}
      {IconRight ? <IconRight size={size === 'sm' ? 14 : 16} aria-hidden="true" /> : null}
    </button>
  )
}
