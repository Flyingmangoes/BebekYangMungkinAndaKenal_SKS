import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Heart,
  Info,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'

export function Phq9IntroPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleStartAssessment = () => {
    setIsLoading(true)
    window.setTimeout(() => {
      setIsLoading(false)
      navigate('/phq-9/assessment')
    }, 150)
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Top Context Ribbon */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 transition-colors hover:text-pelan-700"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Kembali ke Artikel</span>
        </button>
        <Chip tone="outline">
          Langkah Awal Kawan
        </Chip>
      </div>

      {/* Header Section */}
      <div className="flex flex-col gap-3">
        <Chip tone="clay" icon={Sparkles} className="self-start">
          Self-Assessment Singkat • PHQ-9
        </Chip>
        <h1 className="font-serif text-3xl font-medium leading-tight text-ink-900 lg:text-4xl">
          Kenali Gambaran Kondisimu
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-ink-500 lg:text-[15px]">
          Beberapa pertanyaan berikut membantu memberikan gambaran awal tentang apa yang mungkin
          sedang kamu rasakan dalam 2 pekan terakhir. Jawab dengan santai, sesuai keadaanmu.
        </p>
      </div>

      {/* Visual Card */}
      <Card tone="muted" className="flex items-center gap-4 p-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-pelan-100">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4DHGTDvzt5HkeH20hOY26nQXm8UadUbiDfbppcvPtDiTiX-SlEWoxC7sYeVkWJdggm4voXO9FdBeOfIqzF-eJ8lpRax2QRHp28kiWYiP4Y38UqF-wiXdK9Zxx7wgStTFCtLSx_X3Kk5YablPJ8YtJqgQo_7MhPAzT6SEy-RRCao1m0ObqvmUFMeOop2sl9klPOMkpAWXGJY5P2aRPfCl9i1_zLwOXqHrV21i5yY7_ajKHVrfoIE3GgQ"
            alt="Ilustrasi seseorang menikmati teh dengan tenang"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[11px] font-semibold tracking-wider text-pelan-700 uppercase">
            Refleksi Nyaman
          </span>
          <h2 className="font-serif text-lg font-medium text-ink-900 truncate">
            Napas dulu sejenak
          </h2>
          <p className="text-xs text-ink-500 line-clamp-2">
            Ambil posisi rileks, siapkan minuman favoritmu, dan mari check-in dengan dirimu sendiri.
          </p>
        </div>
      </Card>

      {/* Key Information Cards */}
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="flex items-start gap-3 p-4 transition-transform active:scale-[0.99]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-200 text-ink-700">
            <Clock size={20} aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-semibold text-ink-900">Durasi: 2–3 Menit</h3>
            <p className="text-xs leading-relaxed text-ink-500">
              Hanya 9 pertanyaan singkat yang bisa kamu selesaikan dengan santai tanpa terburu-buru.
            </p>
          </div>
        </Card>

        <Card className="flex items-start gap-3 p-4 transition-transform active:scale-[0.99]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pelan-100 text-pelan-700">
            <Heart size={20} aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-semibold text-ink-900">Gak Ada Jawaban Salah</h3>
            <p className="text-xs leading-relaxed text-ink-500">
              Pilih apa yang paling mencerminkan keseharianmu tanpa takut dinilai atau dihakimi.
            </p>
          </div>
        </Card>

        <Card className="flex items-start gap-3 p-4 transition-transform active:scale-[0.99]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clay-100 text-clay-700">
            <ShieldCheck size={20} aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-semibold text-ink-900">Privasi & Keamanan</h3>
            <p className="text-xs leading-relaxed text-ink-500">
              Jawabanmu bersifat rahasia dan hanya dipakai untuk menyusun rekomendasi langkah kecil yang pas.
            </p>
          </div>
        </Card>
      </div>

      {/* Timeline Highlight Reminder */}
      <Card tone="muted" className="flex items-center gap-3 border-l-4 border-clay-500 bg-cream-100 p-4">
        <Calendar size={20} className="shrink-0 text-clay-600" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-ink-700">
          <span className="font-semibold">Fokuskan ingatanmu:</span> pikirkan apa yang kamu rasakan secara konsisten selama{' '}
          <span className="font-semibold underline decoration-clay-500 decoration-2 underline-offset-2">
            2 minggu terakhir
          </span>
          .
        </p>
      </Card>

      {/* Callout Box (Warning & Clarification) */}
      <Card tone="muted" className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-ink-900">
          <Info size={18} className="text-clay-600" aria-hidden="true" />
          <h4 className="text-xs font-semibold">Penting untuk Diketahui:</h4>
        </div>
        <p className="pl-6 text-xs leading-relaxed text-ink-500">
          Hasil kuesioner ini merupakan rangkuman self-assessment untuk eksplorasi diri,{' '}
          <span className="font-semibold text-ink-900">BUKAN diagnosis medis</span> atau pengganti
          konsultasi resmi dengan psikolog maupun psikiater profesional.
        </p>
      </Card>

      {/* Actions / CTA Section */}
      <div className="flex flex-col gap-2 pt-2">
        <Button
          size="md"
          iconRight={ArrowRight}
          onClick={handleStartAssessment}
          disabled={isLoading}
          className="w-full justify-center"
        >
          {isLoading ? 'Mempersiapkan...' : 'Mulai Kuesioner (9 Pertanyaan)'}
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="w-full justify-center"
        >
          Nanti Dulu, Kembali Membaca
        </Button>
      </div>

      {/* Footer Trust Stamp */}
      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-400">
        <ShieldCheck size={14} aria-hidden="true" />
        <span>
          Instrumen standar berbasis Patient Health Questionnaire-9 (PHQ-9) yang diadaptasi ramah untuk anak muda.
        </span>
      </p>
    </div>
  )
}