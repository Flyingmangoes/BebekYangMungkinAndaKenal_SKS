import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  Clock,
  Hourglass,
  Lock,
  RefreshCw,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getBerandaContent } from '@/app/beranda/berandaService'
import { Artwork } from '@/components/ui/Artwork'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { LinkButton } from '@/components/ui/LinkButton'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Sparkline } from '@/components/ui/Sparkline'
import { cn } from '@/lib/cn'
import { MOOD_OPTIONS } from '@/lib/moods'
import type { MoodId } from '@/lib/moods'
import { CURRENT_USER } from '@/lib/userProfile'

export function BerandaPage() {
  const content = getBerandaContent(CURRENT_USER.name)
  const [selectedMood, setSelectedMood] = useState<MoodId | null>('baik')
  const [isQuestSnoozed, setIsQuestSnoozed] = useState(false)
  const [isReadingSaved, setIsReadingSaved] = useState(false)
  const [isQuestLoading, setIsQuestLoading] = useState(true)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsQuestLoading(false)
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <section className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex max-w-2xl flex-col gap-3">
          <Chip tone="mint" className="self-start">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-pelan-500" />
            {content.heroBadge}
          </Chip>
          <h1 className="font-serif text-3xl font-medium leading-tight text-ink-900 lg:text-4xl">
            {content.heroTitle}
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-ink-900 lg:text-[15px]">
            {content.heroDescription}
          </p>
        </div>

        <Card tone="muted" className="flex items-center gap-3 py-3 lg:py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink-700">
            <Hourglass size={16} aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <Eyebrow>{content.breathLabel}</Eyebrow>
            <p className="text-sm font-semibold text-ink-900">{content.breathValue}</p>
          </div>
        </Card>
      </section>

      {/* Cek keadaan singkat */}
      <Card as="section" className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <Eyebrow tone="clay">Cek keadaan singkat</Eyebrow>
            <h2 className="font-serif text-xl font-medium text-ink-900 lg:text-2xl">
              Apa yang paling terasa dominan di ragamu?
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedMood(null)
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 transition-colors hover:text-ink-900"
          >
            Lewati tanpa memilih
            <ArrowRight size={12} aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = mood.id === selectedMood

            return (
              <button
                key={mood.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedMood(mood.id)
                }}
                className={cn(
                  'relative flex flex-col items-start gap-1.5 rounded-xl p-3.5 text-left transition-colors',
                  isSelected
                    ? 'bg-pelan-100 ring-1 ring-pelan-300'
                    : 'bg-cream-200/70 hover:bg-cream-200',
                )}
              >
                <span className="text-lg" aria-hidden="true">
                  {mood.emoji}
                </span>
                <span className="text-sm font-semibold text-ink-900">{mood.label}</span>
                <span className="text-[11px] text-ink-500">{mood.hint}</span>
                {isSelected ? (
                  <span className="absolute top-3 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-pelan-700 text-white">
                    <Check size={10} aria-hidden="true" />
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-500">
          <p className="flex items-center gap-1.5">
            <Lock size={11} aria-hidden="true" />
            Cukup pilih satu atau lewati jika belum siap berbagi. Penilaian ini privat dan
            tanpa target numerik.
          </p>
          <p className="italic">Tersimpan otomatis</p>
        </div>
      </Card>

      {/* Quest + Pola */}
      <section className="grid items-start gap-5 lg:grid-cols-[1.75fr_1fr]">
        {isQuestLoading ? (
          <Card className="flex flex-col gap-5 lg:p-8" aria-busy="true">
            <div className="h-6 w-48 animate-pulse rounded-full bg-cream-200" />
            <div className="h-9 w-3/4 animate-pulse rounded-lg bg-cream-200" />
            <div className="h-16 w-full animate-pulse rounded-xl bg-cream-200" />
            <div className="flex gap-3">
              <div className="h-10 w-32 animate-pulse rounded-full bg-cream-200" />
              <div className="h-10 w-24 animate-pulse rounded-full bg-cream-200" />
            </div>
          </Card>
        ) : (
        <Card className="flex flex-col gap-5 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="clay">{content.quest.tag}</Chip>
              <Chip tone="outline" icon={Clock}>
                {content.quest.durationLabel}
              </Chip>
              <Chip tone="mint" icon={Zap}>
                {content.quest.energyLabel}
              </Chip>
            </div>
            <span className="text-[11px] text-ink-400">{content.quest.questNumber}</span>
          </div>

          <h2 className="font-serif text-2xl font-medium leading-snug text-ink-900 lg:text-3xl">
            {content.quest.title}
          </h2>
          <p className="text-sm leading-relaxed text-ink-500">{content.quest.body}</p>

          <div className="flex flex-wrap items-center gap-3">
            <LinkButton to="/quest" icon={Check}>
              Mulai Sekarang
            </LinkButton>
            <Button
              variant="secondary"
              onClick={() => {
                setIsQuestSnoozed(true)
              }}
            >
              Nanti Saja
            </Button>
            <LinkButton to="/quest" variant="ghost" icon={RefreshCw} size="sm">
              Ganti Quest Sesuai Energiku
            </LinkButton>
          </div>

          <p className="text-xs italic text-ink-500" aria-live="polite">
            {isQuestSnoozed
              ? 'Oke, quest ini kami simpan untuk nanti. Tidak ada yang terlewat.'
              : content.quest.note}
          </p>
        </Card>
        )}

        <Card tone="muted" as="aside" className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <Eyebrow tone="mint">Pola teramati</Eyebrow>
            <span className="text-[11px] text-ink-500">{content.pattern.periodLabel}</span>
          </div>
          <h2 className="font-serif text-xl font-medium leading-snug text-ink-900">
            {content.pattern.title}
          </h2>
          <p className="text-sm italic leading-relaxed text-ink-500">“{content.pattern.quote}”</p>

          <div className="flex flex-col gap-2 rounded-xl bg-white p-3">
            <div className="flex items-start justify-between gap-2 text-[11px]">
              <span className="max-w-24 text-ink-500">{content.pattern.chartLabel}</span>
              <Chip tone="mint">{content.pattern.trendLabel}</Chip>
            </div>
            <Sparkline
              values={content.pattern.chartValues}
              ariaLabel="Grafik fluktuasi beban mental sore selama lima hari terakhir"
              className="h-14 w-full"
            />
            <div className="flex justify-between text-[10px] text-ink-500">
              {content.pattern.chartDays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>

          <Link
            to="/insight"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-900 hover:text-pelan-700"
          >
            Buka Analisis Pola Selengkapnya
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </Card>
      </section>

      {/* Bacaan singkat */}
      <section className="flex flex-col gap-4">
        <SectionHeader
          eyebrow="Bacaan singkat sore ini"
          eyebrowTone="clay"
          title="Pengetahuan tanpa penghakiman."
          action={
            <Link
              to="/eksplorasi"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-900"
            >
              Lihat Semua Arsip Esai
              <ArrowRight size={12} aria-hidden="true" />
            </Link>
          }
        />

        <Card as="article" className="grid gap-6 md:grid-cols-[1fr_1.15fr] md:items-center lg:p-6">
          <Artwork variant="lamp" className="min-h-56 md:min-h-72">
            <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-ink-900">
              {content.reading.badge}
            </span>
          </Artwork>

          <div className="flex flex-col gap-4">
            <p className="flex items-center gap-2 text-[11px] text-ink-500">
              <span className="font-semibold text-clay-500">{content.reading.category}</span>
              <span aria-hidden="true">•</span>
              {content.reading.readingTime}
            </p>
            <h3 className="font-serif text-2xl font-medium leading-snug text-ink-900 lg:text-3xl">
              {content.reading.title}
            </h3>
            <p className="text-sm leading-relaxed text-ink-500">{content.reading.excerpt}</p>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-[11px] text-ink-500">
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-pelan-100 text-[9px] font-bold text-pelan-700"
                >
                  {content.reading.authorInitials}
                </span>
                {content.reading.authorLabel}
              </p>
              <Button
                variant="secondary"
                size="sm"
                iconRight={isReadingSaved ? BookmarkCheck : Bookmark}
                onClick={() => {
                  setIsReadingSaved((previous) => !previous)
                }}
              >
                {isReadingSaved ? 'Tersimpan' : 'Simpan & Baca Nanti'}
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Penutup */}
      <Card tone="muted" className="flex flex-col items-center gap-2 py-8 text-center">
        <p className="max-w-xl font-serif text-lg italic text-ink-700">
          “{content.closingQuote}”
        </p>
        <p className="text-[11px] text-ink-500">{content.closingAuthor}</p>
      </Card>
    </div>
  )
}
