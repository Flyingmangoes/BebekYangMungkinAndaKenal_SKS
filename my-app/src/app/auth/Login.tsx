import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Flower2,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { useAuth } from '@/lib/useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const { setIsAuthenticated } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulasi alur autentikasi login
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)

      setTimeout(() => {
        setIsAuthenticated(true)
        navigate('/')
      }, 800)
    }, 1000)
  }

  const handleGoogleSignIn = () => {
    setIsAuthenticated(true)
    navigate('/')
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Warm Top Hero Greeting */}
      <div className="flex flex-col items-start pt-2">
        <Chip tone="clay" icon={Flower2} className="mb-2">
          Kembali ke Ruang Tenang
        </Chip>
        <h1 className="font-serif text-2xl font-medium leading-tight text-ink-900 lg:text-3xl">
          Selamat datang kembali di Kawan Santai.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Napas pelan dulu sejenak. Masuk untuk melanjutkan kebiasaan baik dan jurnal harianmu.
        </p>
      </div>

      {/* Guest Assessment Contextual Banner */}
      <Card tone="blush" className="flex items-start gap-3 p-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-clay-200 text-clay-700">
          <RefreshCw size={18} aria-hidden="true" />
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-ink-900">Sinkronisasi Otomatis</span>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-500">
            Punya hasil kuesioner yang belum disimpan? Masuk sekarang akan otomatis menautkannya ke akunmu.
          </p>
        </div>
      </Card>

      {/* Main Form Container Card */}
      <Card className="flex flex-col gap-4 p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="flex items-center justify-between text-xs font-medium text-ink-900">
              <span>Alamat Email</span>
              <span className="text-ink-400">Pastikan aktif</span>
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3.5 text-ink-400 pointer-events-none" aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                required
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 w-full rounded-xl bg-cream-100/60 pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:bg-white focus:border-pelan-500 focus:outline-none focus:ring-1 focus:ring-pelan-500 transition-colors border border-transparent"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-xs font-medium text-ink-900">
              Kata Sandi
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-ink-400 pointer-events-none" aria-hidden="true" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Masukkan kata sandimu"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-12 w-full rounded-xl bg-cream-100/60 pl-11 pr-11 text-sm text-ink-900 placeholder:text-ink-400 focus:bg-white focus:border-pelan-500 focus:outline-none focus:ring-1 focus:ring-pelan-500 transition-colors border border-transparent"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 flex h-8 w-8 items-center justify-center text-ink-400 hover:text-ink-900 transition-colors"
              >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded text-pelan-600 focus:ring-0 accent-pelan-600 cursor-pointer"
              />
              <span className="text-xs text-ink-500">Ingat saya</span>
            </label>
            <Link to="/forgot-password" className="text-xs font-semibold text-pelan-700 hover:underline">
              Lupa sandi?
            </Link>
          </div>

          {/* Primary Action Button */}
          <Button
            type="submit"
            size="md"
            disabled={isLoading || isSuccess}
            iconRight={!isLoading && !isSuccess ? ArrowRight : undefined}
            className="mt-1 w-full justify-center"
          >
            {isLoading && (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                <span>Membuka pintu...</span>
              </>
            )}
            {isSuccess && (
              <>
                <CheckCircle size={18} aria-hidden="true" />
                <span>Selamat Datang!</span>
              </>
            )}
            {!isLoading && !isSuccess && 'Masuk ke Akun'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-1">
          <div className="h-px w-full bg-cream-200" />
          <span className="absolute bg-white px-3 text-xs text-ink-400">
            atau masuk dengan
          </span>
        </div>

        {/* Alternative Google Sign-In */}
        <Button
          variant="secondary"
          size="md"
          onClick={handleGoogleSignIn}
          className="w-full justify-center bg-cream-100/60 hover:bg-cream-200/50"
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
          <span>Masuk dengan Google</span>
        </Button>
      </Card>

      {/* Switch to Register Section */}
      <div className="text-center mt-2">
        <p className="text-sm text-ink-500">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-pelan-700 hover:underline">
            Buat akun sekarang
          </Link>
        </p>
      </div>

      {/* Grounding Peer Affirmation / Micro-Card */}
      <Card tone="muted" className="flex items-center justify-center gap-2 p-3 text-center">
        <ShieldCheck size={18} className="text-pelan-600 shrink-0" aria-hidden="true" />
        <span className="text-xs text-ink-500">
          Privasi terjaga • Ruang aman tanpa penilaian
        </span>
      </Card>
    </div>
  )
}