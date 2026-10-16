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
} from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { useAuth } from "@/lib/useAuth";

import logo  from "@/assets/logo.png"

export function LoginPage() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi alur autentikasi login
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsAuthenticated(true);
        navigate("/");
      }, 800);
    }, 1000);
  };

  return (
    <div className="flex  flex-col gap-5 pb-8 w-full max-w-md mx-auto">
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

      {/* Warm Top Hero Greeting */}
      <div className="flex flex-col items-start pt-2">
        <Chip tone="clay" icon={Flower2} className="mb-2">
          Kembali ke Ruang Tenang
        </Chip>
        <h1 className="font-serif text-2xl font-medium leading-tight text-ink-900 lg:text-3xl">
          Selamat datang kembali di Kawan Santai.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Napas pelan dulu sejenak. Masuk untuk melanjutkan kebiasaan baik dan
          jurnal harianmu.
        </p>
      </div>

      {/* Guest Assessment Contextual Banner */}
      <Card tone="blush" className="flex items-start gap-3 p-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-clay-200 text-clay-700">
          <RefreshCw size={18} aria-hidden="true" />
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-ink-900">
            Sinkronisasi Otomatis
          </span>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-500">
            Punya hasil kuesioner yang belum disimpan? Masuk sekarang akan
            otomatis menautkannya ke akunmu.
          </p>
        </div>
      </Card>

      {/* Main Form Container Card */}
      <Card className="flex flex-col gap-4 p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-email"
              className="flex items-center justify-between text-xs font-medium text-ink-900"
            >
              <span>Alamat Email</span>
              <span className="text-ink-400">Pastikan aktif</span>
            </label>
            <div className="relative flex items-center">
              <Mail
                size={18}
                className="absolute left-3.5 text-ink-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="login-email"
                type="email"
                required
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-12 w-full rounded-xl bg-cream-100/60 pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:bg-white focus:border-pelan-500 focus:outline-none focus:ring-1 focus:ring-pelan-500 transition-colors border border-transparent"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-password"
              className="text-xs font-medium text-ink-900"
            >
              Kata Sandi
            </label>
            <div className="relative flex items-center">
              <Lock
                size={18}
                className="absolute left-3.5 text-ink-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Masukkan kata sandimu"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="h-12 w-full rounded-xl bg-cream-100/60 pl-11 pr-11 text-sm text-ink-900 placeholder:text-ink-400 focus:bg-white focus:border-pelan-500 focus:outline-none focus:ring-1 focus:ring-pelan-500 transition-colors border border-transparent"
              />
              <button
                type="button"
                aria-label={
                  showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"
                }
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 flex h-8 w-8 items-center justify-center text-ink-400 hover:text-ink-900 transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
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
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-pelan-700 hover:underline"
            >
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
                <Loader2
                  size={18}
                  className="animate-spin"
                  aria-hidden="true"
                />
                <span>Membuka pintu...</span>
              </>
            )}
            {isSuccess && (
              <>
                <CheckCircle size={18} aria-hidden="true" />
                <span>Selamat Datang!</span>
              </>
            )}
            {!isLoading && !isSuccess && "Masuk ke Akun"}
          </Button>
        </form>

      </Card>

      {/* Switch to Register Section */}
      <div className="text-center mt-2">
        <p className="text-sm text-ink-500">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-semibold text-pelan-700 hover:underline"
          >
            Buat akun sekarang
          </Link>
        </p>
      </div>

      {/* Grounding Peer Affirmation / Micro-Card */}
      <Card
        tone="muted"
        className="flex items-center justify-center gap-2 p-3 text-center"
      >
        <ShieldCheck
          size={18}
          className="text-pelan-600 shrink-0"
          aria-hidden="true"
        />
        <span className="text-xs text-ink-500">
          Privasi terjaga • Ruang aman tanpa penilaian
        </span>
      </Card>
    </div>
  );
}
