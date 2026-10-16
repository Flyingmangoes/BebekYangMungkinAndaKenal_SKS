import {
  ArrowRight,
  AtSign,
  CheckCircle,
  Eye,
  EyeOff,
  FileCheck,
  Lock,
  Loader2,
  Shield,
  ShieldCheck,
  Smile,
  Sparkles,
  User,
} from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { useAuth } from '@/lib/useAuth'

export function Phq9RegisterPage() {
  const navigate = useNavigate()
  const { setIsAuthenticated } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulasi proses registrasi dan verifikasi
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)

      setTimeout(() => {
        setIsAuthenticated(true)
        navigate('/')
      }, 800)
    }, 1200)
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Decorative Ambient Badge Glow */}
      <div className="my-2 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-1 h-16 w-16 animate-pulse rounded-full bg-pelan-300/50 blur-sm" />
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1XFFt7e3VfrW3s6wD9RGlCpMRi3EQN6tiJl2JkxH_CKl_Iim3zrK2YI0MnWF2ZRJYYnh-Y3EiBcsjFFJIIjd6_nKUBfpPpjevBvR8x1sX_DP_WQwb7i-1FIjWYBiFSaNRtNgi0g5DYosphNIgUgP4JwLYo77vGNdG6QfOLozVeognaBhKkrJUcv79RZMJILUCKxXe3-WdScPXJhgYJQW19EAIu2D2bmCLmmC0oyC26NWwjSipjPV1enoriS"
            alt="Kawan Santai Logo Badge"
            className="relative h-14 w-14 rounded-2xl bg-white p-1 shadow-sm object-contain"
          />
        </div>
      </div>

      {/* Motivational & Contextual Header */}
      <div className="flex flex-col items-center text-center">
        <Chip tone="clay" icon={Lock} className="mb-2">
          Langkah Terakhir • Simpan Hasil
        </Chip>
        <h1 className="font-serif text-2xl font-medium leading-tight text-ink-900 lg:text-3xl">
          Simpan hasil kuesionermu & mulai langkah kecilmu.
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
          Jawaban self-assessment kamu sudah tersimpan sementara. Buat akun agar kamu bisa melihat
          rangkuman dan rekomendasi micro-quest kapan saja.
        </p>
      </div>

      {/* Summary Preview Card */}
      <Card tone="muted" className="flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pelan-100 text-pelan-700 shadow-sm">
              <FileCheck size={22} aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <h2 className="text-sm font-semibold text-ink-900">Kuesioner 9 Pertanyaan Selesai</h2>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
                <ShieldCheck size={14} className="text-pelan-600" aria-hidden="true" />
                <span>Tersimpan aman & siap diolah</span>
              </p>
            </div>
          </div>
          <Chip tone="mint">
            9/9 Selesai
          </Chip>
        </div>

        {/* Teaser Score Reveal */}
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white/80 p-3 backdrop-blur-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold tracking-wider text-ink-500 uppercase">
              Hasil Penilaian PHQ-9
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-serif text-base font-semibold text-ink-900 filter blur-xs select-none opacity-70">
                Skor 14: Sedang
              </span>
              <Lock size={14} className="text-pelan-600" aria-hidden="true" />
            </div>
          </div>
          <p className="max-w-32.5 text-right text-xs leading-tight text-ink-500">
            Gambaran kondisimu siap dianalisis dan dipersonalisasi
          </p>
        </div>
      </Card>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Field 1: Nama Panggilan */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-name" className="flex items-center justify-between text-xs font-medium text-ink-900">
            <span>Nama Panggilan</span>
            <span className="text-ink-400">Biar lebih akrab</span>
          </label>
          <div className="relative flex items-center">
            <Smile size={18} className="absolute left-3.5 text-ink-400 pointer-events-none" aria-hidden="true" />
            <input
              id="reg-name"
              type="text"
              required
              placeholder="misal: Raya atau Danis"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 w-full rounded-xl bg-white pl-11 pr-4 text-sm text-ink-900 shadow-sm border border-cream-200/60 placeholder:text-ink-400 focus:border-pelan-500 focus:outline-none focus:ring-1 focus:ring-pelan-500"
            />
          </div>
        </div>

        {/* Field 2: Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-email" className="flex items-center justify-between text-xs font-medium text-ink-900">
            <span>Email Pribadi / Kampus</span>
            <span className="text-ink-400">Untuk simpan riwayat</span>
          </label>
          <div className="relative flex items-center">
            <AtSign size={18} className="absolute left-3.5 text-ink-400 pointer-events-none" aria-hidden="true" />
            <input
              id="reg-email"
              type="email"
              required
              placeholder="emailkamu@kampus.ac.id atau gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-12 w-full rounded-xl bg-white pl-11 pr-4 text-sm text-ink-900 shadow-sm border border-cream-200/60 placeholder:text-ink-400 focus:border-pelan-500 focus:outline-none focus:ring-1 focus:ring-pelan-500"
            />
          </div>
        </div>

        {/* Field 3: Kata Sandi */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-password" className="flex items-center justify-between text-xs font-medium text-ink-900">
            <span>Kata Sandi</span>
            <span className="text-ink-400">Min. 8 karakter</span>
          </label>
          <div className="relative flex items-center">
            <User size={18} className="absolute left-3.5 text-ink-400 pointer-events-none" aria-hidden="true" />
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              placeholder="Minimal 8 karakter aman"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="h-12 w-full rounded-xl bg-white pl-11 pr-11 text-sm text-ink-900 shadow-sm border border-cream-200/60 placeholder:text-ink-400 focus:border-pelan-500 focus:outline-none focus:ring-1 focus:ring-pelan-500"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2.5 flex h-8 w-8 items-center justify-center text-ink-400 hover:text-ink-900 transition-colors"
            >
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Privacy Promise Box */}
        <Card tone="muted" className="flex items-start gap-2.5 p-3">
          <Shield size={18} className="mt-0.5 shrink-0 text-pelan-600" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-ink-500">
            Data dan refleksi pribadimu terenkripsi. Kami tidak pernah membagikan jawabanmu kepada pihak ketiga.
          </p>
        </Card>

        {/* Primary Action Button */}
        <Button
          type="submit"
          size="md"
          disabled={isLoading || isSuccess}
          iconRight={!isLoading && !isSuccess ? ArrowRight : undefined}
          className="mt-2 w-full justify-center rounded-full py-3.5"
        >
          {isLoading && (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              <span>Menyimpan Hasil...</span>
            </>
          )}
          {isSuccess && (
            <>
              <CheckCircle size={18} aria-hidden="true" />
              <span>Akun Terverifikasi!</span>
            </>
          )}
          {!isLoading && !isSuccess && 'Buat Akun & Lihat Hasil'}
        </Button>
      </form>

      {/* Social / Fast Sign-in */}
      <div className="flex flex-col items-center gap-4 mt-2">
        <div className="relative flex w-full items-center justify-center">
          <div className="absolute h-px w-full bg-cream-200" />
          <span className="relative bg-cream-100/50 px-3 text-xs text-ink-400">
            atau daftar lebih cepat
          </span>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => {}}
          className="w-full justify-center rounded-full bg-white hover:bg-cream-100"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          <span>Lanjut dengan Google</span>
        </Button>
      </div>

      {/* Switch to Login Footer */}
      <div className="flex items-center justify-center text-center mt-2">
        <p className="text-sm text-ink-500">
          Sudah punya akun sebelumnya?{' '}
          <Link to="/login" className="font-semibold text-pelan-700 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>

      {/* Warm Footer Microcopy */}
      <div className="mt-4 flex justify-center border-t border-cream-200/60 pt-4">
        <p className="flex items-center gap-1.5 text-xs text-ink-400">
          <Sparkles size={14} className="text-clay-500" aria-hidden="true" />
          <span>Kawan Santai • Ruang teduh tanpa tuntutan</span>
        </p>
      </div>
    </div>
  )
}