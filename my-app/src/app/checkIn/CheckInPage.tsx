import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import type { ChangeEvent } from 'react'

import { ENERGY_OPTIONS } from '@/app/quest/questService'
import type { EnergyLevel } from '@/app/quest/questService'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { LinkButton } from '@/components/ui/LinkButton'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/cn'
import { MOOD_OPTIONS } from '@/lib/moods'
import type { MoodId } from '@/lib/moods'

type CheckInStep = 0 | 1 | 2

const STEP_TITLES: Record<CheckInStep, string> = {
  0: 'Apa yang paling terasa dominan di ragamu?',
  1: 'Seberapa besar energimu saat ini?',
  2: 'Ada yang ingin kamu tambahkan?',
}

export function CheckInPage() {
  const [step, setStep] = useState<CheckInStep>(0)
  const [mood, setMood] = useState<MoodId | null>(null)
  const [energy, setEnergy] = useState<EnergyLevel | null>(null)
  const [note, setNote] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  function handleNoteChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setNote(event.target.value)
  }

  function goNext() {
    if (step === 0) setStep(1)
    if (step === 1) setStep(2)
  }

  function goBack() {
    if (step === 2) setStep(1)
    if (step === 1) setStep(0)
  }

  if (isSaved) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-5">
        <Card tone="mint" className="flex flex-col items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-pelan-700">
            <Check size={18} aria-hidden="true" />
          </span>
          <h1 className="font-serif text-3xl font-medium text-ink-900">Terima kasih sudah berhenti sejenak.</h1>
          <p className="text-sm leading-relaxed text-ink-700">
            Check-in-mu tersimpan di perangkat ini. Tidak ada nilai, tidak ada target. Kalau mau,
            kami punya satu quest kecil yang sesuai dengan energimu.
          </p>
          <div className="flex flex-wrap gap-3">
            <LinkButton to="/quest" iconRight={ArrowRight}>
              Lihat Quest Hari Ini
            </LinkButton>
            <LinkButton to="/" variant="secondary">
              Kembali ke Beranda
            </LinkButton>
          </div>
        </Card>
      </div>
    )
  }

  const canContinue = step === 0 ? mood !== null : step === 1 ? energy !== null : true

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <SectionHeader
        level="h1"
        eyebrow={`Langkah check-in ${step + 1} dari 3`}
        eyebrowTone="clay"
        title={STEP_TITLES[step]}
        description="Tidak ada jawaban yang salah. Kamu boleh melewati langkah mana pun."
      />

      <div className="flex gap-2" role="presentation">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={cn('h-1.5 flex-1 rounded-full', index <= step ? 'bg-pelan-600' : 'bg-cream-300')}
          />
        ))}
      </div>

      <Card className="flex flex-col gap-4">
        {step === 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {MOOD_OPTIONS.map((option) => {
              const isSelected = option.id === mood

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setMood(option.id)
                  }}
                  className={cn(
                    'flex flex-col items-start gap-1.5 rounded-xl p-4 text-left transition-colors',
                    isSelected ? 'bg-pelan-100 ring-1 ring-pelan-300' : 'bg-cream-200/70 hover:bg-cream-200',
                  )}
                >
                  <span className="text-xl" aria-hidden="true">
                    {option.emoji}
                  </span>
                  <span className="text-sm font-semibold text-ink-900">{option.label}</span>
                  <span className="text-[11px] text-ink-500">{option.hint}</span>
                </button>
              )
            })}
          </div>
        ) : null}

        {step === 1 ? (
          <div className="flex flex-col gap-3">
            {ENERGY_OPTIONS.map((option) => {
              const isSelected = option.id === energy

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setEnergy(option.id)
                  }}
                  className={cn(
                    'flex flex-col items-start gap-1 rounded-xl p-4 text-left transition-colors',
                    isSelected ? 'bg-pelan-100 ring-1 ring-pelan-300' : 'bg-cream-200/70 hover:bg-cream-200',
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                    <span aria-hidden="true">{option.emoji}</span>
                    {option.label}
                  </span>
                  <span className="text-xs text-ink-500">{option.description}</span>
                </button>
              )
            })}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="flex flex-col gap-2">
            <Eyebrow>Catatan singkat (opsional)</Eyebrow>
            <label htmlFor="check-in-note" className="sr-only">
              Catatan singkat
            </label>
            <textarea
              id="check-in-note"
              rows={4}
              value={note}
              onChange={handleNoteChange}
              placeholder="Tulis satu atau dua kalimat, atau biarkan kosong."
              className="w-full resize-none rounded-xl bg-cream-200/60 p-3 text-sm text-ink-900 ring-1 ring-cream-300 placeholder:text-ink-400 focus:outline-2 focus:outline-pelan-500"
            />
          </div>
        ) : null}
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" icon={ArrowLeft} onClick={goBack} disabled={step === 0}>
          Kembali
        </Button>
        {step < 2 ? (
          <Button iconRight={ArrowRight} onClick={goNext} disabled={!canContinue}>
            Lanjut
          </Button>
        ) : (
          <Button
            icon={Check}
            onClick={() => {
              setIsSaved(true)
            }}
          >
            Simpan Check-In
          </Button>
        )}
      </div>
    </div>
  )
}
