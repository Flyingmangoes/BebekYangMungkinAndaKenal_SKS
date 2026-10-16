import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Heart,
  HeartHandshake,
  Lightbulb,
  Phone,
  Users,
} from 'lucide-react'
import { useState } from 'react'

import {
  ACCESS_BANNER,
  BANTUAN_HEADER,
  CLOSING,
  CRISIS_INTRO,
  FIRST_SESSION_TIPS,
  HOTLINES,
  MESSAGE_TEMPLATES,
  OFFICIAL_INTRO,
  OFFICIAL_SERVICES,
  PUSKESMAS,
  SMALL_RHYTHM,
  TEMPLATES_INTRO,
} from '@/app/bantuan/bantuanService'
import { Artwork } from '@/components/ui/Artwork'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { buttonClasses } from '@/lib/buttonStyles'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

export function BantuanPage() {
  const { copiedKey, copy } = useCopyToClipboard()
  const [isTipsOpen, setIsTipsOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        level="h1"
        eyebrow={BANTUAN_HEADER.eyebrow}
        eyebrowTone="clay"
        title={BANTUAN_HEADER.title}
        description={BANTUAN_HEADER.description}
      />

      <Card tone="muted" className="flex flex-wrap items-center justify-between gap-3 py-4 lg:py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-pelan-700">
            <HeartHandshake size={16} aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-ink-900">{ACCESS_BANNER.title}</p>
            <p className="text-xs text-ink-500">{ACCESS_BANNER.description}</p>
          </div>
        </div>
        <a
          href="#layanan-resmi"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-900 hover:text-pelan-700"
        >
          {ACCESS_BANNER.linkLabel}
          <ArrowRight size={12} aria-hidden="true" />
        </a>
      </Card>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_1.4fr]">
        {/* Kolom kiri */}
        <div className="flex flex-col gap-4">
          <Card as="section" className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-clay-500" />
              <h2 className="font-serif text-xl font-medium text-ink-900">{CRISIS_INTRO.title}</h2>
              <Chip tone="clay">{CRISIS_INTRO.badge}</Chip>
            </div>
            <p className="text-xs leading-relaxed text-ink-500">{CRISIS_INTRO.description}</p>

            <ul className="flex flex-col gap-3">
              {HOTLINES.map((hotline) => {
                const isCopied = copiedKey === hotline.id
                const isExternal = hotline.actionType === 'link'

                return (
                  <li key={hotline.id} className="flex flex-col gap-3 rounded-xl bg-cream-200/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-semibold text-ink-900">{hotline.name}</p>
                        <p className="text-[11px] text-ink-500">{hotline.description}</p>
                      </div>
                      <p className="shrink-0 text-right font-serif text-lg font-medium text-ink-900">
                        {hotline.displayNumber}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={hotline.href}
                        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className={buttonClasses(
                          hotline.isPrimary ? 'primary' : 'outline',
                          'sm',
                          false,
                          'flex-1',
                        )}
                      >
                        {isExternal ? (
                          <ExternalLink size={13} aria-hidden="true" />
                        ) : (
                          <Phone size={13} aria-hidden="true" />
                        )}
                        {hotline.actionLabel}
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          void copy(hotline.copyValue, hotline.id)
                        }}
                        className={buttonClasses('outline', 'sm', false)}
                      >
                        {isCopied ? (
                          <Check size={13} aria-hidden="true" />
                        ) : (
                          <Copy size={13} aria-hidden="true" />
                        )}
                        {isCopied ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>

            <p className="rounded-lg bg-clay-100 px-3 py-2 text-[11px] leading-relaxed text-clay-600">
              {CRISIS_INTRO.emergencyNote}
            </p>
          </Card>

          <Card as="aside" className="flex items-center gap-4 p-4 lg:p-4">
            <Artwork variant="cup" className="h-16 w-16 shrink-0 min-h-0" />
            <div className="flex flex-col gap-1">
              <Eyebrow tone="clay">{SMALL_RHYTHM.label}</Eyebrow>
              <p className="text-xs leading-relaxed text-ink-700">{SMALL_RHYTHM.text}</p>
            </div>
          </Card>
        </div>

        {/* Kolom kanan */}
        <div className="flex flex-col gap-4">
          <Card as="section" className="flex flex-col gap-4" >
            <div id="layanan-resmi" className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-serif text-xl font-medium text-ink-900">
                <Building2 size={17} aria-hidden="true" />
                {OFFICIAL_INTRO.title}
              </h2>
              <span className="text-[11px] text-ink-500">{OFFICIAL_INTRO.badge}</span>
            </div>
            <p className="text-xs leading-relaxed text-ink-500">{OFFICIAL_INTRO.description}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              {OFFICIAL_SERVICES.map((service) => (
                <div key={service.id} className="flex flex-col gap-2 rounded-xl bg-cream-200/60 p-4">
                  <Eyebrow tone="clay">{service.label}</Eyebrow>
                  <p className="font-serif text-lg font-medium leading-snug text-ink-900">{service.title}</p>
                  <p className="text-[11px] leading-relaxed text-ink-500">{service.description}</p>
                  {service.href && service.linkLabel ? (
                    <a
                      href={service.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-900 hover:text-pelan-700"
                    >
                      {service.linkLabel}
                      <ExternalLink size={11} aria-hidden="true" />
                    </a>
                  ) : null}
                  {service.note ? (
                    <p className="flex items-center gap-1.5 text-[11px] text-ink-500">
                      <Users size={11} aria-hidden="true" />
                      {service.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-pelan-100 p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pelan-700 text-white">
                <Building2 size={14} aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-ink-900">{PUSKESMAS.title}</p>
                <p className="text-xs leading-relaxed text-ink-700">{PUSKESMAS.description}</p>
              </div>
            </div>

            <div className="rounded-xl bg-cream-200/60">
              <button
                type="button"
                aria-expanded={isTipsOpen}
                onClick={() => {
                  setIsTipsOpen((previous) => !previous)
                }}
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-xs font-medium text-ink-900"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb size={13} className="text-sand-500" aria-hidden="true" />
                  Tips santai mempersiapkan sesi konseling pertamamu
                </span>
                {isTipsOpen ? (
                  <ChevronUp size={14} aria-hidden="true" />
                ) : (
                  <ChevronDown size={14} aria-hidden="true" />
                )}
              </button>
              {isTipsOpen ? (
                <ul className="flex flex-col gap-1.5 px-4 pb-4 text-xs text-ink-700">
                  {FIRST_SESSION_TIPS.map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                      <Check size={12} className="mt-0.5 shrink-0 text-pelan-600" aria-hidden="true" />
                      {tip}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Card>

          <Card as="section" className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 font-serif text-xl font-medium text-ink-900">
              <Users size={17} aria-hidden="true" />
              {TEMPLATES_INTRO.title}
            </h2>
            <p className="text-xs leading-relaxed text-ink-500">{TEMPLATES_INTRO.description}</p>

            <ul className="flex flex-col gap-3">
              {MESSAGE_TEMPLATES.map((template) => {
                const isCopied = copiedKey === template.id

                return (
                  <li key={template.id} className="flex flex-col gap-2 rounded-xl bg-cream-200/60 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <Eyebrow>{template.label}</Eyebrow>
                      <button
                        type="button"
                        onClick={() => {
                          void copy(template.text, template.id)
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-500 hover:text-ink-900"
                      >
                        {isCopied ? (
                          <Check size={11} aria-hidden="true" />
                        ) : (
                          <Copy size={11} aria-hidden="true" />
                        )}
                        {isCopied ? 'Tersalin' : 'Salin Teks'}
                      </button>
                    </div>
                    <p className="font-serif text-base italic leading-relaxed text-ink-700">
                      “{template.text}”
                    </p>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <Heart size={16} className="text-pelan-600" aria-hidden="true" />
        <p className="max-w-xl font-serif text-lg italic text-ink-700">“{CLOSING.quote}”</p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">{CLOSING.author}</p>
      </div>
    </div>
  )
}
