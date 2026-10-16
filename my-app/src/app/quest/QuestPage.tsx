import { Check, CheckCheck, Heart, Quote, RefreshCw, SkipForward, Timer, Waves } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { LinkButton } from '@/components/ui/LinkButton'

import { ENERGY_OPTIONS, getQuestsByEnergy, STEP_TRAIL } from '@/app/quest/questService'
import type { EnergyLevel, QuestItem } from '@/app/quest/questService'
import { Artwork } from '@/components/ui/Artwork'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/cn'

export function QuestPage() {
  const [energy, setEnergy] = useState<EnergyLevel>('rendah')
  const [questIndex, setQuestIndex] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [isSkipped, setIsSkipped] = useState(false)
  const quests = useMemo(() => getQuestsByEnergy(energy), [energy])
  const quest = quests[questIndex % Math.max(quests.length, 1)]
  const [loadedQuest, setLoadedQuest] = useState<QuestItem | null>()

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setLoadedQuest(quest ?? null)
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [quest])

  function handleSelectEnergy(next: EnergyLevel) {
    setEnergy(next)
    setQuestIndex(0)
    setLoadedQuest(undefined)
    setIsDone(false)
    setIsSkipped(false)
  }

  function handleSwapQuest() {
    setQuestIndex((previous) => previous + 1)
    setLoadedQuest(undefined)
    setIsDone(false)
    setIsSkipped(false)
  }

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        level="h1"
        eyebrow="Edisi harian • Ritme tanpa tuntutan"
        title="Quest Adaptif Hari Ini"
        description="Satu aksi kecil yang realistis. Disesuaikan dengan kapasitas energimu saat ini."
        action={<Chip tone="outline" className="px-4 py-2 text-xs">Mode Pemulihan Tenang</Chip>}
      />

      {/* Pilih energi */}
      <section className="flex flex-col gap-3" aria-labelledby="energi-heading">
        <div className="flex items-center justify-between gap-3">
          <Eyebrow>Sesuaikan dengan energimu hari ini</Eyebrow>
          <span className="text-[11px] italic text-ink-500">Bisa diubah kapan saja</span>
        </div>
        <h2 id="energi-heading" className="sr-only">
          Pilih tingkat energi
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {ENERGY_OPTIONS.map((option) => {
            const isSelected = option.id === energy

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  handleSelectEnergy(option.id)
                }}
                className={cn(
                  'relative flex flex-col items-start gap-1.5 rounded-xl p-4 text-left transition-colors',
                  isSelected
                    ? 'bg-pelan-100 ring-1 ring-pelan-300'
                    : 'bg-cream-200/70 hover:bg-cream-200',
                )}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                  <span aria-hidden="true">{option.emoji}</span>
                  {option.label}
                </span>
                <span className="text-xs leading-relaxed text-ink-500">{option.description}</span>
                {isSelected ? (
                  <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-pelan-700 text-white">
                    <Check size={12} aria-hidden="true" />
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </section>

      {/* Quest utama + samping */}
      <section className="grid items-start gap-5 lg:grid-cols-[1.9fr_1fr]">
        {loadedQuest === undefined ? (
          <Card className="flex flex-col gap-5" aria-busy="true">
            <div className="h-6 w-40 animate-pulse rounded-full bg-cream-200" />
            <div className="h-9 w-3/4 animate-pulse rounded-lg bg-cream-200" />
            <div className="h-20 w-full animate-pulse rounded-xl bg-cream-200" />
            <div className="h-48 w-full animate-pulse rounded-2xl bg-cream-200" />
          </Card>
        ) : loadedQuest ? (
          <Card as="article" className="flex flex-col gap-5 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone="clay">{loadedQuest.tag}</Chip>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                  {loadedQuest.category}
                </span>
              </div>
              <Chip tone="outline" icon={Timer}>
                {loadedQuest.minutesLabel}
              </Chip>
            </div>

            <h2 className="font-serif text-2xl font-medium leading-snug text-ink-900 lg:text-3xl">
              {loadedQuest.title}
            </h2>
            <p className="text-sm leading-relaxed text-ink-500 lg:text-[15px]">{loadedQuest.body}</p>


              <div className="flex w-full items-end justify-between gap-3 text-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                    <Timer size={16} aria-hidden="true" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
                      {loadedQuest.timerLabel}
                    </span>
                    <span className="font-serif text-xl font-medium">{loadedQuest.estimatedTime}</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                  <Waves size={13} aria-hidden="true" />
                  {loadedQuest.soundLabel}
                </span>
              </div>
            

            <dl className="grid gap-3 rounded-xl bg-cream-200/60 p-4 text-xs sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <dt className="text-ink-500">Perkiraan Waktu</dt>
                <dd className="font-semibold text-ink-900">{loadedQuest.estimatedTime}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-ink-500">Tingkat Tekanan</dt>
                <dd className="flex items-center gap-1.5 font-semibold text-ink-900">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-pelan-500" />
                  {loadedQuest.pressureLabel}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-ink-500">Kategori Utama</dt>
                <dd className="font-semibold text-ink-900">{loadedQuest.mainCategory}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                icon={isDone ? CheckCheck : Check}
                onClick={() => {
                  setIsDone(true)
                  setIsSkipped(false)
                }}
                disabled={isDone}
              >
                {isDone ? 'Terima kasih sudah mencoba' : 'Saya Coba Lakukan'}
              </Button>
              <Button variant="secondary" icon={RefreshCw} onClick={handleSwapQuest}>
                Ganti Quest Lain
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={SkipForward}
                onClick={() => {
                  setIsSkipped(true)
                  setIsDone(false)
                }}
              >
                Lewati Hari Ini (Nggak Ada Masalah)
              </Button>
            </div>

            <p className="text-xs italic text-ink-500" aria-live="polite">
              {isDone
                ? 'Satu langkah kecil sudah cukup untuk hari ini.'
                : isSkipped
                  ? 'Tidak apa-apa. Istirahat juga bagian dari perjalanan.'
                  : ''}
            </p>
          </Card>
        ) : (
          <Card tone="muted" className="text-sm text-ink-500">
            Quest belum tersedia untuk energi ini. Coba pilih tingkat energi lain.
          </Card>
        )}

        <div className="flex flex-col gap-4">
          <Card tone="default" as="aside" className="flex flex-col gap-3">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-clay-500">
              <Heart size={12} aria-hidden="true" />
              Ruang aman
            </p>
            <h2 className="font-serif text-xl font-medium text-ink-900">
              Melewati quest bukan kegagalan.
            </h2>
            <p className="text-xs leading-relaxed text-ink-500">
              Di SKS, tidak ada counter streak yang patah, tidak ada skor yang berkurang.
              Tubuh dan pikiranmu yang paling tahu batas daya tampungnya. Menolak tugas ketika
              lelah adalah bentuk kesadaran diri.
            </p>
            <p className="rounded-lg bg-cream-200/70 px-3 py-2 text-xs italic text-ink-700">
              Istirahat juga merupakan sebuah tindakan.
            </p>
          </Card>

          <Card as="aside" className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <Eyebrow>Jejak langkah teduh</Eyebrow>
              <span className="text-[11px] text-ink-500">Pekan ini</span>
            </div>
            <ul className="flex flex-col gap-3">
              {STEP_TRAIL.map((step) => (
                <li key={step.id} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                      step.isDone ? 'bg-pelan-100 text-pelan-700' : 'bg-cream-200 text-ink-400',
                    )}
                  >
                    <Check size={11} />
                  </span>
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold text-ink-900">
                      {step.day}: {step.title}
                    </p>
                    <p className="text-[11px] text-ink-500">{step.note}</p>
                  </div>
                </li>
              ))}
            </ul>
            <ProgressBar value={66} label="Jejak langkah pekan ini" className="mt-1" />
          </Card>

          <Card tone="blush" as="aside" className="flex flex-col gap-1.5">
            <Quote size={14} className="text-clay-500" aria-hidden="true" />
            <p className="font-serif text-lg italic text-ink-900">“SKS juga tetap maju.”</p>
            <p className="text-[11px] text-ink-500">Pengingat harian untuk dirimu</p>
          </Card>
        </div>
      </section>

      <Card as="section" tone="mint" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-xl font-medium text-ink-900">
            Mau main game santai sejenak?
          </h2>
          <p className="text-sm leading-relaxed text-ink-500">
            Luangkan waktu sebentar untuk bermain dan menyegarkan pikiran.
          </p>
        </div>
        <LinkButton to="/game/little-moments" variant="secondary" icon={Heart}>
          Main Sekarang
        </LinkButton>
      </Card>
    </div>
  )
}
