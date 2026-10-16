import { useEffect, useState } from 'react'
import { Heart, Lightbulb, Sparkles } from 'lucide-react'

import { ApiError, getInsight, type InsightResult } from '@/lib/api'
import { useAuth } from '@/lib/useAuth'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { LinkButton } from '@/components/ui/LinkButton'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function InsightPage() {
  const { isAuthenticated } = useAuth()
  const [result, setResult] = useState<InsightResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [needsPh9, setNeedsPh9] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return

    let active = true
    getInsight('id')
      .then((insight) => {
        if (active) setResult(insight)
      })
      .catch((error: unknown) => {
        if (!active) return
        if (error instanceof ApiError && error.status === 409) {
          setNeedsPh9(true)
        } else {
          setErrorMessage(
            error instanceof ApiError ? error.message : 'Insight belum dapat dimuat. Coba lagi.',
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

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        level="h1"
        eyebrow="Refleksi personal"
        title="Insight untukmu"
        description="Rangkuman dan saran berdasarkan hasil PHQ-9 terakhirmu."
        action={<Chip tone="neutral" className="font-normal italic">Bukan diagnosis klinis</Chip>}
      />

      {!isAuthenticated ? (
        <Card className="flex flex-col items-start gap-3">
          <p className="text-sm text-ink-700">Masuk untuk melihat insight personalmu.</p>
          <LinkButton to="/login">Masuk ke akun</LinkButton>
        </Card>
      ) : isLoading ? (
        <Card aria-busy="true" className="flex flex-col gap-3">
          <div className="h-5 w-40 animate-pulse rounded bg-cream-200" />
          <div className="h-16 w-full animate-pulse rounded bg-cream-200" />
        </Card>
      ) : needsPh9 ? (
        <Card className="flex flex-col items-start gap-3">
          <p className="text-sm text-ink-700">Selesaikan PHQ-9 untuk mendapatkan insight personal.</p>
          <LinkButton to="/phq-9">Mulai PHQ-9</LinkButton>
        </Card>
      ) : errorMessage ? (
        <Card className="flex flex-col items-start gap-3">
          <p role="alert" className="text-sm text-red-700">{errorMessage}</p>
          <button
            type="button"
            className="text-sm font-semibold text-pelan-700 underline"
            onClick={() => window.location.reload()}
          >
            Coba lagi
          </button>
        </Card>
      ) : result?.kind === 'crisis' ? (
        <Card tone="blush" className="flex flex-col gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-clay-700">
            <Heart size={18} aria-hidden="true" />
          </span>
          <h2 className="font-serif text-xl font-medium text-ink-900">Kamu tidak harus menghadapinya sendiri.</h2>
          <p className="text-sm leading-relaxed text-ink-700">
            Insight dan quest personal tidak ditampilkan berdasarkan jawabanmu. Pertimbangkan untuk
            segera menghubungi orang yang kamu percaya atau tenaga profesional agar mendapat dukungan langsung.
          </p>
        </Card>
      ) : result?.kind === 'insight' ? (
        <div className="flex flex-col gap-5">
          <Card tone="mint" className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-pelan-700">
              <Sparkles size={18} aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-2">
              <Chip tone="neutral" className="self-start">
                {result.source === 'ai' ? 'Insight personal' : 'Insight alternatif'}
              </Chip>
              <p className="font-serif text-lg leading-snug text-ink-900 lg:text-xl">
                {result.insight.summary}
              </p>
            </div>
          </Card>

          <Card className="flex flex-col gap-4">
            <h2 className="flex items-center gap-2 font-serif text-xl font-medium text-ink-900">
              <Lightbulb size={18} className="text-sand-500" aria-hidden="true" />
              Langkah kecil yang bisa dicoba
            </h2>
            <ul className="flex flex-col gap-3">
              {result.insight.tips.map((tip, index) => (
                <li key={`${index}-${tip}`} className="rounded-xl bg-cream-200/60 p-4 text-sm leading-relaxed text-ink-700">
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
