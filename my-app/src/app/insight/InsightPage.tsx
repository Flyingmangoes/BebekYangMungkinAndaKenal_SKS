import {
  ArrowRight,
  CalendarDays,
  Check,
  Compass,
  Eye,
  Heart,
  Lightbulb,
  Lock,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'

import {
  ARCHIVE_QUOTE,
  DISPLAY_OPTIONS,
  GOOD_THINGS,
  INSIGHT_HEADER,
  MAIN_OBSERVATION,
  NEXT_WEEK_EXPERIMENT,
  QUEST_FITS,
  QUEST_FIT_TIP,
  WEEK_DAYS,
  WEEK_NOTE,
} from '@/app/insight/insightService'
import type { DisplayOptionId } from '@/app/insight/insightService'
import { Artwork } from '@/components/ui/Artwork'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Toggle } from '@/components/ui/Toggle'
import { cn } from '@/lib/cn'

export function InsightPage() {
  const [isHistoryVisible, setIsHistoryVisible] = useState(true)
  const [displayOption, setDisplayOption] = useState<DisplayOptionId>('hide-streak')
  const [experimentAnswer, setExperimentAnswer] = useState<'accepted' | 'later' | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        level="h1"
        eyebrow={INSIGHT_HEADER.eyebrow}
        title={INSIGHT_HEADER.title}
        description={INSIGHT_HEADER.description}
        action={<Chip tone="neutral" className="font-normal italic">{INSIGHT_HEADER.badge}</Chip>}
      />

      {/* Temuan utama */}
      <Card tone="mint" as="section" className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-pelan-700">
          <Sparkles size={18} aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <Eyebrow tone="mint">{MAIN_OBSERVATION.label}</Eyebrow>
          <p className="font-serif text-lg leading-snug text-ink-900 lg:text-xl">
            “{MAIN_OBSERVATION.quote}”
          </p>
          <p className="text-xs text-ink-500">{MAIN_OBSERVATION.note}</p>
        </div>
      </Card>

      {/* Ritme pekan */}
      <Card as="section" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-xl font-medium text-ink-900">Ritme Pekan Ini</h2>
            <p className="text-xs text-ink-500">Arus energi dan suasana hati yang kamu tandai tiap petang</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-ink-500">
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-pelan-300" />
              Teduh
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-clay-200" />
              Perlu Rehat
            </span>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {WEEK_DAYS.map((day) => {
            const Icon = day.icon
            const isHeavy = day.tone === 'heavy'

            return (
              <li
                key={day.id}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl p-3 text-center',
                  isHeavy ? 'bg-clay-100 ring-1 ring-clay-200/70' : 'bg-cream-200/60',
                )}
              >
                <span className="text-[10px] text-ink-500">{day.dateLabel}</span>
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg',
                    isHeavy ? 'bg-white text-clay-500' : 'bg-pelan-100 text-pelan-700',
                  )}
                >
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className={cn('text-xs font-semibold', isHeavy ? 'text-clay-600' : 'text-ink-900')}>
                  {day.mood}
                </span>
                <span className="rounded-md bg-white/80 px-1.5 py-0.5 text-[9px] text-ink-500">{day.note}</span>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-cream-200/60 px-4 py-3 text-xs text-ink-700">
          <p className="flex items-center gap-2">
            <Heart size={13} className="text-pelan-600" aria-hidden="true" />
            {WEEK_NOTE}
          </p>
          <span className="text-[11px] italic text-ink-500">Tidak perlu dipaksakan cerita</span>
        </div>
      </Card>

      {/* Jenis quest + Hal yang berjalan baik */}
      <section className="grid items-start gap-5 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-serif text-xl font-medium text-ink-900">Jenis Quest yang Paling Cocok</h2>
            <SlidersHorizontal size={16} className="text-ink-400" aria-hidden="true" />
          </div>
          <p className="text-xs text-ink-500">Observasi kenyamanan menyelesaikan jeda mikro pekan ini</p>

          <ul className="flex flex-col gap-4">
            {QUEST_FITS.map((fit) => (
              <li key={fit.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-ink-900">{fit.label}</span>
                  <span className="text-xs text-ink-500">{fit.resultLabel}</span>
                </div>
                <ProgressBar value={fit.value} label={`${fit.label}: ${fit.resultLabel}`} tone={fit.tone} />
                <p className="text-[11px] text-ink-500">{fit.note}</p>
              </li>
            ))}
          </ul>

          <p className="flex items-start gap-2 rounded-xl bg-cream-200/60 p-3 text-xs text-ink-700">
            <Lightbulb size={14} className="mt-0.5 shrink-0 text-sand-500" aria-hidden="true" />
            {QUEST_FIT_TIP}
          </p>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 font-serif text-xl font-medium text-ink-900">
              <Heart size={16} aria-hidden="true" />
              Hal yang Berjalan Baik
            </h2>
            <p className="text-xs text-ink-500">Kemenangan-kemenangan kecil yang sering luput diapresiasi</p>
            <ul className="flex flex-col gap-2">
              {GOOD_THINGS.map((thing) => (
                <li
                  key={thing.id}
                  className={cn(
                    'flex items-start gap-3 rounded-xl p-3',
                    thing.isHighlighted ? 'bg-pelan-100' : 'bg-cream-200/60',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-pelan-700"
                  >
                    <Check size={11} />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-semibold text-ink-900">{thing.title}</p>
                    <p className="text-[11px] text-ink-500">{thing.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="flex items-center gap-4">
            <Artwork variant="window" icon={Compass} className="h-20 w-20 shrink-0 min-h-0" />
            <div className="flex flex-col gap-1">
              <Eyebrow>{ARCHIVE_QUOTE.label}</Eyebrow>
              <p className="font-serif text-lg italic text-ink-900">“{ARCHIVE_QUOTE.quote}”</p>
              <p className="text-[11px] text-ink-500">{ARCHIVE_QUOTE.note}</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Eksperimen + tampilan */}
      <section className="grid items-start gap-5 lg:grid-cols-2">
        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-serif text-xl font-medium text-ink-900">
              <Compass size={16} className="text-clay-500" aria-hidden="true" />
              Coba di Minggu Depan
            </h2>
            <Chip tone="clay">{NEXT_WEEK_EXPERIMENT.badge}</Chip>
          </div>
          <p className="font-serif text-lg leading-snug text-ink-900">“{NEXT_WEEK_EXPERIMENT.question}”</p>
          <p className="text-xs leading-relaxed text-ink-500">{NEXT_WEEK_EXPERIMENT.body}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              icon={Check}
              disabled={experimentAnswer === 'accepted'}
              onClick={() => {
                setExperimentAnswer('accepted')
              }}
            >
              {experimentAnswer === 'accepted' ? 'Pengingat disiapkan' : 'Boleh, ingatkan pelan-pelan'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setExperimentAnswer('later')
              }}
            >
              Minggu depan saja
            </Button>
          </div>
          <p className="text-xs italic text-ink-500" aria-live="polite">
            {experimentAnswer === 'accepted'
              ? 'Baik, kami akan mengingatkan dengan lembut jam 16:00.'
              : experimentAnswer === 'later'
                ? 'Tidak apa-apa. Ide ini akan menunggu sampai kamu siap.'
                : ''}
          </p>
        </Card>

        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-serif text-xl font-medium text-ink-900">
              <Eye size={16} aria-hidden="true" />
              Tampilan & Metrik
            </h2>
            <span className="text-[11px] text-ink-500">Anti-Kecemasan</span>
          </div>
          <p className="text-xs text-ink-500">
            Kamu punya kendali penuh atas seberapa banyak angka atau riwayat yang ingin kamu lihat.
          </p>

          <div className="flex items-center justify-between gap-3 rounded-xl bg-cream-200/60 p-3">
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-ink-900">Tampilkan Riwayat Hari</p>
              <p className="text-[11px] text-ink-500">
                Saat ini: {isHistoryVisible ? 'Aktif secara santai (tanpa streak angka)' : 'Disembunyikan'}
              </p>
            </div>
            <Toggle checked={isHistoryVisible} label="Tampilkan riwayat hari" onChange={setIsHistoryVisible} />
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
              Opsi tampilan beranda
            </legend>
            {DISPLAY_OPTIONS.map((option) => (
              <label key={option.id} className="flex cursor-pointer items-center gap-3 text-xs text-ink-700">
                <input
                  type="radio"
                  name="display-option"
                  value={option.id}
                  checked={displayOption === option.id}
                  onChange={() => {
                    setDisplayOption(option.id)
                  }}
                  className="h-4 w-4 accent-pelan-700"
                />
                {option.label}
              </label>
            ))}
          </fieldset>
        </Card>
      </section>

      {/* Arsip */}
      <Card tone="muted" className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink-700">
            <CalendarDays size={16} aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-ink-900">Ingin melihat siklus minggu sebelumnya?</p>
            <p className="flex items-center gap-1.5 text-[11px] text-ink-500">
              <Lock size={10} aria-hidden="true" />
              Observasi 11 – 17 Oktober tersimpan rapi tanpa penilaian performa.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" iconRight={ArrowRight}>
          Lihat Arsip Pekan Lalu
        </Button>
      </Card>
    </div>
  )
}
