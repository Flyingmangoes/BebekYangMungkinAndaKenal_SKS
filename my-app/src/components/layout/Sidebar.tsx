import { LifeBuoy, SlidersHorizontal, Sprout } from 'lucide-react'

import { cn } from '@/lib/cn'
import { NAV_ITEMS } from '@/lib/navItems'

export interface SidebarProps {
  activePath: string
  onNavigate: (path: string) => void
  userFullName: string
  userModeLabel: string
  weekRhythmLabel: string
}

export function Sidebar({
  activePath,
  onNavigate,
  userFullName,
  userModeLabel,
  weekRhythmLabel,
}: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-cream-300 bg-cream-100 px-4 py-6 lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pelan-100 text-pelan-600">
          <Sprout size={20} aria-hidden="true" />
        </span>
        <div className="flex flex-col">
          <span className="font-serif text-xl font-medium leading-tight text-ink-900">
            SKS
          </span>
          <span className="text-[11px] italic leading-tight text-ink-500">
            Sesi Konsultasi Sehat
          </span>
        </div>
      </div>

      <nav aria-label="Navigasi utama" className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = item.path === activePath

          return (
            <a
              key={item.id}
              href={item.path}
              aria-current={isActive ? 'page' : undefined}
              onClick={(event) => {
                event.preventDefault()
                onNavigate(item.path)
              }}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-pelan-100 font-semibold text-pelan-700'
                  : 'font-medium text-ink-500 hover:bg-cream-200 hover:text-ink-900',
              )}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </a>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 rounded-xl bg-white/70 px-3 py-2 text-[11px] ring-1 ring-cream-300/70">
          <span className="font-medium uppercase tracking-wider text-ink-500">
            Ritme pekan ini
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-ink-900">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-pelan-500" />
            {weekRhythmLabel}
          </span>
        </div>

        <a
          href="/bantuan"
          onClick={(event) => {
            event.preventDefault()
            onNavigate('/bantuan')
          }}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs text-ink-500 transition-colors hover:bg-cream-200"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-clay-100 text-clay-500">
            <LifeBuoy size={14} aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="font-semibold text-ink-900">Butuh Bantuan?</span>
            <span className="text-[10px] leading-tight">Akses konselor & hotline darurat</span>
          </span>
        </a>

        <button
          type="button"
          onClick={() => {
            onNavigate('/profil')
          }}
          className="flex items-center gap-3 rounded-xl bg-white/70 px-3 py-2.5 text-left ring-1 ring-cream-300/70 transition-colors hover:bg-white"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-sand-100 text-xs font-semibold text-sand-500"
          >
            {userFullName.charAt(0).toUpperCase()}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-xs font-semibold text-ink-900">{userFullName}</span>
            <span className="truncate text-[10px] text-ink-500">{userModeLabel}</span>
          </span>
          <SlidersHorizontal size={14} className="text-ink-400" aria-hidden="true" />
        </button>
      </div>
    </aside>
  )
}