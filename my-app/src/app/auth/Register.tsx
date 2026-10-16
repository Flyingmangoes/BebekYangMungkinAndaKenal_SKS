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
import logo from '@/assets/logo.png'

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
    <div className="flex flex-col gap-6 pb-8 w-full max-w-lg mx-auto">
      {/* Decorative Ambient Badge Glow */}
      <div className="my-2 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-1 h-16 w-16 animate-pulse rounded-full bg-pelan-300/50 blur-sm" />
          <img
            src={logo}
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