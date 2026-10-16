import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Heart,
  Info,
  Sprout,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { cn } from '@/lib/cn'

interface Option {
  val: number
  label: string
  sublabel: string
}

const PHQ_OPTIONS: Option[] = [
  {
    val: 0,
    label: 'Tidak pernah sama sekali',
    sublabel: '0 hari dalam 2 minggu',
  },
  {
    val: 1,
    label: 'Beberapa hari',
    sublabel: '1 - 6 hari dalam 2 minggu',
  },
  {
    val: 2,
    label: 'Lebih dari separuh waktu',
    sublabel: '7 - 11 hari dalam 2 minggu',
  },
  {
    val: 3,
    label: 'Hampir setiap hari',
    sublabel: '12 - 14 hari penuh',
  },
]

export function Phq9QuestionPage() {
  const navigate = useNavigate()
  const { questionNumber } = useParams<{ questionNumber: string }>()
  const parsedQuestion = Number(questionNumber)
  const currentQuestion =
    Number.isInteger(parsedQuestion) && parsedQuestion >= 1 && parsedQuestion <= 9
      ? parsedQuestion
      : 1
  const [selectedVal, setSelectedVal] = useState<number | null>(null)

  const totalQuestions = 9
  const progressPercent = (currentQuestion / totalQuestions) * 100

  const handleNext = () => {
    if (selectedVal === null) return

    if (currentQuestion === totalQuestions) {
      navigate('/register')
      return
    }

    navigate(`/phq-9/question/${currentQuestion + 1}`)
  }

  const handlePrevious = () => {
    navigate(-1)
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Progress & Context Header Bar */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-500">
            <Sprout size={16} className="text-pelan-600" aria-hidden="true" />
            <span>Self-Assessment PHQ-9</span>
          </div>
          <Chip tone="mint">
            Pertanyaan {currentQuestion} dari {totalQuestions}
          </Chip>
        </div>

        {/* Progress Track */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-cream-200">
          <div
            className="h-full rounded-full bg-pelan-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <Card className="flex flex-col gap-3 p-5">
        {/* Timeframe Chip */}
        <Chip tone="outline" icon={Calendar} className="self-start">
          Fokus 2 Pekan Terakhir
        </Chip>

        {/* Question Title */}
        <h1 className="font-serif text-xl font-medium leading-snug text-ink-900 lg:text-2xl">
          Kurang berminat atau kurang bergairah dalam melakukan hal-hal yang biasanya kamu sukai?
        </h1>

        {/* Everyday Context */}
        <p className="text-sm leading-relaxed text-ink-500">
          Misalnya hobi, ngobrol santai bareng teman, atau hal-hal kecil yang biasanya bikin kamu tersenyum tapi belakangan terasa hambar.
        </p>
      </Card>

      {/* Options Stack */}
      <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Pilihan frekuensi">
        {PHQ_OPTIONS.map((option) => {
          const isSelected = selectedVal === option.val

          return (
            <button
              key={option.val}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedVal(option.val)}
              className={cn(
                'flex w-full items-center justify-between rounded-xl p-4 text-left transition-all active:scale-[0.99]',
                isSelected
                  ? 'bg-pelan-100 ring-1 ring-pelan-300'
                  : 'bg-white hover:bg-cream-100/60 shadow-sm border border-cream-200/50',
              )}
            >
              <div className="flex flex-col pr-3">
                <span
                  className={cn(
                    'text-sm font-semibold transition-colors',
                    isSelected ? 'text-pelan-700' : 'text-ink-900',
                  )}
                >
                  {option.label}
                </span>
                <span className="text-xs text-ink-500">{option.sublabel}</span>
              </div>

              <div
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors',
                  isSelected
                    ? 'bg-pelan-600 text-white'
                    : 'bg-cream-200/80 text-transparent',
                )}
              >
                <Check size={14} aria-hidden="true" />
              </div>
            </button>
          )
        })}
      </div>

      {/* Supportive Reassurance Banner */}
      <Card tone="muted" className="flex items-start gap-3 p-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pelan-100 text-pelan-600">
          <Heart size={18} aria-hidden="true" />
        </span>
        <p className="text-xs leading-relaxed text-ink-500">
          Gak perlu overthinking pilihanmu. Pilih yang paling mendekati apa yang kamu alami tanpa rasa takut dihakimi.
        </p>
      </Card>

      {/* Bottom Actions */}
      <div className="flex items-center gap-3 pt-1">
        <Button
          variant="secondary"
          size="md"
          icon={ArrowLeft}
          onClick={handlePrevious}
          className="w-1/3 justify-center"
        >
          Sebelumnya
        </Button>
        <Button
          size="md"
          iconRight={ArrowRight}
          onClick={handleNext}
          disabled={selectedVal === null}
          className="flex-1 justify-center"
        >
          {currentQuestion === totalQuestions ? 'Lihat Ringkasan' : `Lanjut (Pertanyaan ${currentQuestion + 1})`}
        </Button>
      </div>

      {/* Clinical Disclaimer Footer */}
      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-400">
        <Info size={14} aria-hidden="true" />
        <span>Instrumen terstandar PHQ-9 • Bukan diagnosis klinis</span>
      </p>
    </div>
  )
}