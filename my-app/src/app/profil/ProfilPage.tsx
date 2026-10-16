import { ArrowRight, LifeBuoy } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { BADGES, PROFILE_SUMMARY, SETTING_GROUPS } from '@/app/profil/profilService'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Toggle } from '@/components/ui/Toggle'
import { CURRENT_USER } from '@/lib/userProfile'

function buildInitialSettings(): Record<string, boolean> {
  const initial: Record<string, boolean> = {}

  for (const group of SETTING_GROUPS) {
    for (const item of group.items) {
      initial[item.id] = item.defaultEnabled
    }
  }

  return initial
}

export function ProfilPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>(buildInitialSettings)

  function handleToggle(id: string, value: boolean) {
    setSettings((previous) => ({ ...previous, [id]: value }))
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        level="h1"
        eyebrow="Pengaturan"
        title="Profil"
        description="Atur ritme dan privasi dengan caramu sendiri. Semua pilihan bisa diubah kapan saja."
      />

      <Card className="flex flex-wrap items-center gap-4">
        <span
          aria-hidden="true"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-sand-100 font-serif text-2xl font-medium text-sand-500 ring-2 ring-pelan-200"
        >
          {CURRENT_USER.name.charAt(0).toUpperCase()}
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-2xl font-medium text-ink-900">{CURRENT_USER.fullName}</h2>
          <p className="text-xs text-ink-500">{PROFILE_SUMMARY.joinedLabel}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            <Chip tone="mint">{CURRENT_USER.modeLabel}</Chip>
            <Chip tone="neutral">{CURRENT_USER.locationLabel}</Chip>
          </div>
        </div>
      </Card>

      <div className="grid items-start gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-5">
          {SETTING_GROUPS.map((group) => (
            <Card key={group.id} as="section" className="flex flex-col gap-4">
              <h2 className="font-serif text-xl font-medium text-ink-900">{group.title}</h2>
              <ul className="flex flex-col gap-4">
                {group.items.map((item) => {
                  const Icon = item.icon

                  return (
                    <li key={item.id} className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cream-200 text-ink-700">
                          <Icon size={15} aria-hidden="true" />
                        </span>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-ink-900">{item.title}</p>
                          <p className="text-xs text-ink-500">{item.description}</p>
                        </div>
                      </div>
                      <Toggle
                        checked={settings[item.id] ?? false}
                        label={item.title}
                        onChange={(value) => {
                          handleToggle(item.id, value)
                        }}
                      />
                    </li>
                  )
                })}
              </ul>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          <Card as="section" className="flex flex-col gap-3">
            <Eyebrow>Koleksi badge santai</Eyebrow>
            <ul className="flex flex-col gap-3">
              {BADGES.map((badge) => {
                const Icon = badge.icon

                return (
                  <li key={badge.id} className="flex items-center gap-3 rounded-xl bg-cream-200/60 p-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pelan-100 text-pelan-700">
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-ink-900">{badge.title}</p>
                      <p className="text-[11px] text-ink-500">{badge.description}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>

          <Card tone="muted" as="section" className="flex flex-col gap-2">
            <Eyebrow>Prinsip SKS</Eyebrow>
            <ul className="flex flex-col gap-1.5 text-xs text-ink-700">
              {PROFILE_SUMMARY.statements.map((statement) => (
                <li key={statement}>• {statement}</li>
              ))}
            </ul>
          </Card>

          <Card tone="blush" as="section" className="flex flex-col gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-clay-600">
              <LifeBuoy size={15} aria-hidden="true" />
              Dukungan & komunitas
            </p>
            <p className="text-xs leading-relaxed text-ink-700">
              Butuh bicara dengan seseorang? Kontak konselor dan hotline darurat ada di Ruang Bantuan.
            </p>
            <Link
              to="/bantuan"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-900 hover:text-clay-600"
            >
              Buka Ruang Bantuan
              <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
