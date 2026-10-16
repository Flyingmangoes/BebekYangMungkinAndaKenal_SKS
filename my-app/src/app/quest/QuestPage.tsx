import { Check, CheckCheck, Heart, Quote, RefreshCw, SkipForward } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LinkButton } from '@/components/ui/LinkButton'

import { ENERGY_OPTIONS } from '@/app/quest/questService'
import type { EnergyLevel } from '@/app/quest/questService'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/cn'
import {
  ApiError,
  createMission,
  getMissions,
  getQuestSuggestions,
  refreshQuestSuggestions,
  updateMission,
  type Mission,
  type QuestSuggestions,
} from '@/lib/api'
import { useAuth } from '@/lib/useAuth'

export function QuestPage() {
  const { isAuthenticated } = useAuth()
  const [energy, setEnergy] = useState<EnergyLevel>('rendah')
  const [suggestions, setSuggestions] = useState<QuestSuggestions | null>(null)
  const [missions, setMissions] = useState<Mission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [mission, setMission] = useState<Mission | null>(null)
  const [isDone, setIsDone] = useState(false)
  const [isSkipped, setIsSkipped] = useState(false)
  const energyKey = energy === 'rendah' ? 'low' : energy === 'sedang' ? 'medium' : 'high'
  const quest =
    suggestions?.kind === 'quests' ? suggestions.quests[energyKey][0] : undefined

  useEffect(() => {
    if (!isAuthenticated) return
    let active = true
    Promise.all([getQuestSuggestions('id'), getMissions()])
      .then(([currentSuggestions, currentMissions]) => {
        if (!active) return
        setSuggestions(currentSuggestions)
        setMissions(currentMissions)
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof ApiError
              ? error.message
              : 'Tidak dapat memuat quest dari server. Coba lagi.',
          )
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [isAuthenticated])

  function handleSelectEnergy(next: EnergyLevel) {
    setEnergy(next)
    setMission(null)
    setIsDone(false)
    setIsSkipped(false)
  }

  async function handleSwapQuest() {
    setIsRefreshing(true)
    setErrorMessage(null)
    try {
      const nextSuggestions = await refreshQuestSuggestions('id')
      setSuggestions(nextSuggestions)
      setMission(null)
      setIsDone(false)
      setIsSkipped(false)
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : 'Quest belum dapat diperbarui. Coba lagi.',
      )
    } finally {
      setIsRefreshing(false)
    }
  }

  async function handleCompleteQuest() {
    if (!quest || suggestions?.kind !== 'quests' || suggestions.source !== 'ai') return
    setIsSaving(true)
    setErrorMessage(null)
    try {
      const savedMission = mission ?? (await createMission(quest))
      setMission(savedMission)
      const completedMission = await updateMission(savedMission.questId, 100)
      setMission(completedMission)
      setMissions((current) => [
        completedMission,
        ...current.filter((item) => item.questId !== completedMission.questId),
      ])
      setIsDone(true)
      setIsSkipped(false)
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : 'Progress quest belum dapat disimpan. Coba lagi.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-4">
        <SectionHeader
          level="h1"
          title="Masuk untuk melihat quest"
          description="Quest personal dibuat dari hasil PHQ-9 dan akunmu."
        />
        <LinkButton to="/login">Masuk ke akun</LinkButton>
      </div>
    )
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
        {isLoading ? (
          <Card className="flex flex-col gap-5" aria-busy="true">
            <div className="h-6 w-40 animate-pulse rounded-full bg-cream-200" />
            <div className="h-9 w-3/4 animate-pulse rounded-lg bg-cream-200" />
            <div className="h-20 w-full animate-pulse rounded-xl bg-cream-200" />
          </Card>
        ) : errorMessage ? (
          <Card className="flex flex-col items-start gap-3">
            <p role="alert" className="text-sm text-red-700">
              {errorMessage}
            </p>
            {errorMessage.toLowerCase().includes('phq') ||
            errorMessage.toLowerCase().includes('ph9') ? (
              <LinkButton to="/phq-9">Mulai PHQ-9</LinkButton>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  setErrorMessage(null)
                  setIsLoading(true)
                  Promise.all([getQuestSuggestions('id'), getMissions()])
                    .then(([currentSuggestions, currentMissions]) => {
                      setSuggestions(currentSuggestions)
                      setMissions(currentMissions)
                    })
                    .catch((error: unknown) => {
                      setErrorMessage(
                        error instanceof ApiError ? error.message : 'Tidak dapat memuat quest.',
                      )
                    })
                    .finally(() => setIsLoading(false))
                }}
              >
                Coba lagi
              </Button>
            )}
          </Card>
        ) : suggestions?.kind === 'crisis' ? (
          <Card tone="blush" className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-medium text-ink-900">Cari dukungan sekarang</h2>
            <p className="text-sm leading-relaxed text-ink-700">
              Berdasarkan jawabanmu, rekomendasi quest tidak ditampilkan. Hubungi orang yang kamu
              percaya atau tenaga profesional untuk mendapatkan dukungan langsung.
            </p>
          </Card>
        ) : quest ? (
          <Card as="article" className="flex flex-col gap-5 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Chip tone="clay">
                {suggestions?.kind === 'quests' && suggestions.source === 'ai'
                  ? 'Rekomendasi personal'
                  : 'Rekomendasi alternatif'}
              </Chip>
              <Chip tone="outline">{ENERGY_OPTIONS.find((option) => option.id === energy)?.label}</Chip>
            </div>

            <h2 className="font-serif text-2xl font-medium leading-snug text-ink-900 lg:text-3xl">
              {quest.questTitle}
            </h2>
            <p className="text-sm leading-relaxed text-ink-500 lg:text-[15px]">
              {quest.questDescription}
            </p>

            {suggestions?.kind === 'quests' && suggestions.source === 'fallback' ? (
              <p className="rounded-lg bg-cream-200/70 p-3 text-xs text-ink-700">
                Quest alternatif ini bisa dicoba, tetapi backend hanya menyimpan quest yang dibuat AI.
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <Button
                icon={isDone ? CheckCheck : Check}
                onClick={handleCompleteQuest}
                disabled={
                  isDone ||
                  isSaving ||
                  suggestions?.kind !== 'quests' ||
                  suggestions.source !== 'ai'
                }
              >
                {isSaving ? 'Menyimpan...' : isDone ? 'Progress tersimpan' : 'Saya Coba Lakukan'}
              </Button>
              <Button
                variant="secondary"
                icon={RefreshCw}
                onClick={handleSwapQuest}
                disabled={isRefreshing}
              >
                {isRefreshing ? 'Memuat...' : 'Ganti Quest'}
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
                ? 'Progress quest tersimpan ke akunmu. Satu langkah kecil sudah cukup.'
                : isSkipped
                  ? 'Tidak apa-apa. Istirahat juga bagian dari perjalanan.'
                  : ''}
            </p>
          </Card>
        ) : (
          <Card tone="muted" className="text-sm text-ink-500">
            Belum ada quest yang tersedia. Selesaikan PHQ-9 untuk mendapatkan rekomendasi personal.
            <div className="mt-3">
              <LinkButton to="/phq-9">Mulai PHQ-9</LinkButton>
            </div>
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
              {missions.slice(0, 3).map((item) => (
                <li key={item.questId} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                      item.progress >= 100 ? 'bg-pelan-100 text-pelan-700' : 'bg-cream-200 text-ink-400',
                    )}
                  >
                    <Check size={11} />
                  </span>
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold text-ink-900">
                      {item.questTitle}
                    </p>
                    <p className="text-[11px] text-ink-500">{item.progress}% selesai</p>
                  </div>
                </li>
              ))}
            </ul>
            {missions.length === 0 ? (
              <p className="text-xs text-ink-500">Quest yang kamu simpan akan muncul di sini.</p>
            ) : null}
            <ProgressBar
              value={
                missions.length === 0
                  ? 0
                  : Math.round(
                      missions.reduce((total, item) => total + item.progress, 0) / missions.length,
                    )
              }
              label="Progress quest tersimpan"
              className="mt-1"
            />
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
