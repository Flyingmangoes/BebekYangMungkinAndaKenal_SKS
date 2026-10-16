import { MapPin, MessageCircleHeart, Wind } from 'lucide-react'

import { formatDateId, getGreeting } from '@/lib/dateGreeting'

export interface HeaderProps {
  userName: string
  energyLabel: string
  moodLabel: string
  locationLabel: string
  temperatureLabel: string
  now?: Date
  onBreathClick?: () => void
  onCompanionClick?: () => void
}

export function Header({
  userName,
  energyLabel,
  moodLabel,
  locationLabel,
  temperatureLabel,
  now = new Date(),
  onBreathClick,
  onCompanionClick,
}: HeaderProps) {
  const initial = userName.charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-20 border-b border-cream-300 bg-pelan-50 lg:bg-cream-100/90 lg:backdrop-blur">
      {/* Desktop */}
      <div className="hidden h-16 items-center justify-between gap-4 px-8 lg:flex">
        <div className="flex min-w-0 items-baseline gap-3">
          <h2 className="whitespace-nowrap font-serif text-lg font-medium text-ink-900">
            {formatDateId(now)}
          </h2>
          <span aria-hidden="true" className="text-ink-400">
            ·
          </span>
          <p className="truncate font-serif text-sm italic text-ink-500">
            {getGreeting(now)}, {userName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full bg-cream-200 px-3.5 py-1.5 text-xs font-semibold text-ink-700">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-pelan-600" />
            Energi: {energyLabel}
          </span>

          <button
            type="button"
            onClick={onBreathClick}
            className="flex items-center gap-2 rounded-full bg-pelan-100 px-3.5 py-1.5 text-xs font-semibold text-pelan-700 transition-colors hover:bg-pelan-200"
          >
            <Wind size={14} aria-hidden="true" />
            Tarik Napas Sejenak
          </button>

          <button
            type="button"
            onClick={onCompanionClick}
            aria-label="Buka teman refleksi"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-pelan-600 text-white transition-colors hover:bg-pelan-700"
          >
            <MessageCircleHeart size={18} aria-hidden="true" />
          </button>

          <span
            aria-label={`Akun ${userName}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sand-100 text-sm font-semibold text-sand-500 ring-2 ring-cream-50"
          >
            {initial}
          </span>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-200 font-serif text-lg font-medium text-pelan-600">
            K
          </span>
          <div className="flex flex-col">
            <p className="flex items-baseline gap-2 leading-tight">
              <span className="text-base font-semibold text-ink-900">Kawan</span>
              <span className="text-xs font-semibold text-pelan-600">+ {moodLabel}</span>
            </p>
            <p className="flex items-center gap-1 text-[11px] text-ink-500">
              <MapPin size={11} aria-hidden="true" />
              {locationLabel} • {temperatureLabel}
            </p>
          </div>
        </div>

        <span
          aria-label={`Akun ${userName}`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-sand-100 text-sm font-semibold text-sand-500 ring-2 ring-pelan-200"
        >
          {initial}
        </span>
      </div>
    </header>
  )
}
