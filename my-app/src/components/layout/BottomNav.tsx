import { cn } from '@/lib/cn'
import { BOTTOM_NAV_ITEMS } from '@/lib/navItems'

export interface BottomNavProps {
  activePath: string
  onNavigate: (path: string) => void
}

export function BottomNav({ activePath, onNavigate }: BottomNavProps) {
  return (
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-pelan-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = item.path === activePath

          return (
            <li key={item.id}>
              <a
                href={item.path}
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate(item.path)
                }}
                className={cn(
                  'flex flex-col items-center gap-1 px-1 py-2 text-[11px] font-medium transition-colors',
                  isActive ? 'text-pelan-700' : 'text-ink-500',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-12 items-center justify-center rounded-full transition-colors',
                    isActive && 'bg-pelan-100',
                  )}
                >
                  <Icon size={18} aria-hidden="true" />
                </span>
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
