import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Heart,
  Info,
  Sprout,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ApiError, getPh9Questions, type Ph9Question } from '@/lib/api'
import { getPh9Draft, savePh9Answer } from '@/lib/ph9Draft'
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
  const [questions, setQuestions] = useState<Ph9Question[]>([])
  const [answers, setAnswers] = useState(getPh9Draft)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const totalQuestions = 9
  const progressPercent = (currentQuestion / totalQuestions) * 100
  const question = questions.find((item) => item.questionIndex === currentQuestion)
  const selectedVal =
    answers.find((answer) => answer.questionId === question?.questionId)?.answerValue ?? null

  useEffect(() => {
    let active = true
    getPh9Questions('id')
      .then(({ questions: fetchedQuestions }) => {
        if (active) setQuestions(fetchedQuestions)
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof ApiError ? error.message : 'Tidak dapat memuat pertanyaan. Coba lagi.',
          )
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  function handleAnswer(value: number) {
    if (!question) return
    const answer = { questionId: question.questionId, answerValue: value }
    savePh9Answer(answer)
    setAnswers((current) => [
      ...current.filter((item) => item.questionId !== question.questionId),
      answer,
    ])
  }

  const handleNext = () => {
    if (selectedVal === null || !question) return

    if (currentQuestion === totalQuestions) {
      navigate('/register')
      return
    }

    navigate(`/phq-9/question/${currentQuestion + 1}`)
  }

  const handlePrevious = () => {
    navigate(-1)
  }

  if (isLoading || errorMessage || !question) {
    return (
      <Card className="mx-auto flex w-full max-w-xl flex-col gap-3 p-5">
        {isLoading ? (
          <p role="status" className="text-sm text-ink-500">Memuat pertanyaan...</p>
        ) : errorMessage ? (
          <>
            <p role="alert" className="text-sm text-red-700">{errorMessage}</p>
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
              className="self-start"
            >
              Coba lagi
            </Button>
          </>
        ) : (
          <p role="alert" className="text-sm text-red-700">
            Pertanyaan PHQ-9 nomor {currentQuestion} tidak tersedia dari server.
          </p>
        )}
      </Card>
    )
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
          {question.questionBody}
        </h1>
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
              onClick={() => handleAnswer(option.val)}
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