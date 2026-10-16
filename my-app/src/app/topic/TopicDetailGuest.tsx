import {
  ArrowLeft,
  ArrowRight,
  Bed,
  Bookmark,
  BookmarkCheck,
  Check,
  Coffee,
  X,
  Heart,
  Info,
  Laptop,
  Lock,
  Brain,
  Repeat,
  Clock3,
  Frown,
  Sprout,
  Timer,
  WandSparkles,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const article = {
  category: 'Kelelahan Mental & Energi',
  readingTime: '4 menit baca',
  title: 'Burnout: Ketika Capek Bukan Cuma Soal Kurang Tidur',
  reviewer: 'Ditinjau oleh Tim Konselor Sebaya',
  tone: 'Santai & Ringan',
  description:
    'Pernah ngerasa udah tidur 8 jam penuh, tapi pas bangun rasanya tetep lemes dan berat ngadepin hari? Mungkin yang lelah bukan cuma ototmu, tapi baterai mentalku.',
  heroImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB7qVJizpq7IFYV8X8egtElPoxnARXYgcvrd8PsF0zRFuWonlZNKg6B9XOq6FyFNvd3hmXK_21u-MMrJN257vovIUjTbSfKZcGz4iEy3t2Whx74oYa3XV8dM3IK7QMxP1UiNpNdYvDShHZ5bc2PcUbekmY7fcKHCTmDBKTPJSwmwliUzpMt5RCV0HTWmZllw8z1D1BxJc-QROA4iXrGpb_71sri1oycQB_AmzwgYKeQtOTIiPYvaLJBAA',
  microHabitImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDSqxmbq6Fau3YF2Sn1mUKalTIqjDvINFo6Ufqku2ZCXgsVbO9eWgXqvUr1V3BLphwAngQGj8nFIBnoszmc5DmeNL3uv6IRcweet3cdb2J0AduRJNxLc2oLQG1ZLRf5lWISUtaMbyk5USi3dd4_mjzpG2jDWCEFqd5_foo6fZs49Gh3FeTcXPjT6DsCKdXN9i-2ymby5s1OAUdFasFXKHPaKhSfHm2AHswzeyu8fd4jVUYgkiqAJewJ2g',
}

const dailyExperiences = [
  {
    icon: Laptop,
    iconClass: 'bg-surface-container text-primary',
    text: 'Buka laptop atau buku rasanya seberat angkat beban, padahal tugasnya standar.',
  },
  {
    icon: Coffee,
    iconClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
    text: 'Hal-hal yang biasanya bikin seneng (nonton, ngopi sore) mendadak hambar dan kosong.',
  },
  {
    icon: Frown,
    iconClass: 'bg-secondary-fixed text-secondary',
    text: 'Gampang baper, tersinggung, atau sinis sama obrolan kecil teman sekeliling.',
  },
]

const commonTraps = [
  {
    icon: Repeat,
    iconClass: 'text-secondary',
    title: 'Perfeksionisme Halus',
    description:
      'Rasa bersalah kalau gak produktif tiap menit. Menganggap istirahat adalah kemewahan yang harus dibayar lunas oleh capaian besar dulu.',
  },
  {
    icon: Bed,
    iconClass: 'text-tertiary',
    title: 'Batas yang Samar',
    description:
      'Belajar atau kerja dari kasur bikin otak bingung kapan waktu siap siaga dan kapan waktu istirahat seutuhnya.',
  },
]

export function TopicDetailPage() {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [readProgress, setReadProgress] = useState(0)
  const [isStarting, setIsStarting] = useState(false)
  const [isWelcome, setIsWelcome] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const documentElement = document.documentElement

      const docHeight =
        documentElement.scrollHeight - documentElement.clientHeight

      const scrolled =
        (documentElement.scrollTop / (docHeight || 1)) * 100

      setReadProgress(Math.min(scrolled, 100))
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleBookmark = () => {
    setIsBookmarked((previous) => !previous)
  }

  const handleStartQuest = () => {
    if (isStarting) return

    setIsStarting(true)

    window.setTimeout(() => {
      setIsStarting(false)
      setIsWelcome(true)

      window.setTimeout(() => {
        setIsWelcome(false)
      }, 1500)
    }, 700)
  }

  const handleReadMore = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <main className="flex w-full flex-1 flex-col">
        {/* Reading Progress */}
        <div className="sticky top-16 z-40 h-1 w-full bg-surface-container-high">
          <div
            className="h-1 bg-primary transition-[width] duration-150"
            style={{ width: `${readProgress}%` }}
          />
        </div>

        <div className="flex w-full flex-col gap-space-lg px-margin pb-space-xl pt-space-md">
          {/* Top Meta */}
          <div className="flex items-center justify-between">
            <Link
              to="/eksplorasi"
              className="inline-flex items-center gap-space-xs text-xs font-bold text-on-surface-variant transition-colors hover:text-primary"
            >
              <ArrowLeft size={18} />
              <span>Eksplor</span>
            </Link>

            <div className="flex items-center gap-space-md">
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant">
                <Clock3 size={14} className="text-primary" />
                {article.readingTime}
              </span>

              <button
                type="button"
                aria-label="Simpan Artikel"
                aria-pressed={isBookmarked}
                onClick={handleBookmark}
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                  isBookmarked
                    ? 'bg-secondary-fixed text-secondary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-secondary-fixed hover:text-secondary',
                ].join(' ')}
              >
                {isBookmarked ? (
                  <BookmarkCheck size={20} />
                ) : (
                  <Bookmark size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Title */}
          <header className="flex flex-col gap-space-sm">
            <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-secondary-fixed px-3 py-1 text-xs font-bold text-on-secondary-fixed">
              <Brain size={15} />
              {article.category}
            </div>

            <h1 className="text-[28px] font-extrabold leading-tight text-on-surface">
              {article.title}
            </h1>

            <div className="flex items-center gap-space-sm pt-space-xs">
              <span className="text-xs text-on-surface-variant">
                {article.reviewer}
              </span>

              <span className="h-1 w-1 rounded-full bg-outline-variant" />

              <span className="text-xs font-medium text-primary">
                {article.tone}
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="w-full overflow-hidden rounded-xl bg-surface-container-low shadow-sm">
            <img
              src={article.heroImage}
              alt="Ilustrasi suasana pagi yang tenang"
              className="h-48 w-full object-cover"
            />
          </div>

          {/* Intro */}
          <div className="rounded-xl bg-surface-container-low p-space-md shadow-sm">
            <p className="text-base font-medium leading-relaxed text-on-surface">
              {article.description}
            </p>
          </div>

          {/* Section 1 */}
          <ArticleSection
            title="Gimana Rasanya di Keseharian Mahasiswa & Pekerja Muda?"
            dotClassName="bg-secondary"
          >
            <div className="flex flex-col gap-space-sm">
              {dailyExperiences.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.text}
                    className="flex items-start gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}
                    >
                      <Icon size={20} />
                    </div>

                    <p className="self-center text-sm leading-5.5 text-on-surface">
                      {item.text}
                    </p>
                  </div>
                )
              })}
            </div>
          </ArticleSection>

          {/* Pull Quote */}
          <div className="relative overflow-hidden rounded-xl bg-primary-container p-space-lg text-on-primary-container shadow-md">
            <div className="pointer-events-none absolute -bottom-4 -right-4 select-none opacity-15">
              <span className="text-[110px]">“</span>
            </div>

            <div className="relative z-10 flex flex-col gap-space-sm">
              <Sprout size={28} className="text-tertiary-fixed" />

              <blockquote className="text-lg font-semibold italic leading-snug">
                “Burnout bukan tanda kamu malas atau lemah. Ini cara tubuh dan
                pikiranmu minta jeda darurat setelah dipaksa lari maraton terlalu
                lama.”
              </blockquote>

              <span className="pt-space-xs text-[11px] font-semibold uppercase tracking-wider text-on-primary-container/80">
                — Pengingat Hangat Hari Ini
              </span>
            </div>
          </div>

          {/* Section 3 */}
          <ArticleSection
            title="Yang Sering Bikin Kita Terjebak:"
            dotClassName="bg-tertiary"
          >
            <div className="grid grid-cols-1 gap-space-sm">
              {commonTraps.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="flex flex-col gap-1 rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
                  >
                    <div
                      className={`flex items-center gap-2 text-sm font-bold ${item.iconClass}`}
                    >
                      <Icon size={18} />
                      <span>{item.title}</span>
                    </div>

                    <p className="text-sm leading-5.5 text-on-surface-variant">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </ArticleSection>

          {/* Micro Habit */}
          <div className="flex w-full items-center gap-space-sm overflow-hidden rounded-xl bg-surface-container-low p-space-sm shadow-sm">
            <img
              src={article.microHabitImage}
              alt="Secangkir teh hangat dengan tanaman kecil"
              className="h-20 w-20 shrink-0 rounded-lg object-cover"
            />

            <div className="flex flex-col">
              <span className="text-xs font-bold text-primary">
                Micro-habit Hari Ini
              </span>

              <p className="text-xs leading-snug text-on-surface-variant">
                Coba tutup matamu selama 60 detik. Lepaskan genggaman tanganmu
                dan buang napas panjang.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <ArticleSection
            title="Apa yang BUKAN Berarti Burnout?"
            dotClassName="bg-primary"
          >
            <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md shadow-sm">
              <ClarificationItem type="negative">
                <strong>Bukan berarti masa depanmu hancur</strong> — ini fase
                transisi dan alarm tubuh, bukan vonis kemampuanmu.
              </ClarificationItem>

              <ClarificationItem type="positive">
                <strong>Bukan vonis seumur hidup</strong> — baterai yang habis
                selalu bisa diisi ulang perlahan dengan ritme yang lebih ramah
                buatmu.
              </ClarificationItem>
            </div>
          </ArticleSection>

          {/* Guided CTA */}
          <section className="mt-space-sm flex flex-col">
            <div className="relative flex flex-col gap-space-md overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-md">
              {/* Accent */}
              <div className="absolute left-0 right-0 top-0 h-1.5 bg-linear-to-r from-secondary to-tertiary" />

              {/* CTA Header */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold text-on-primary-fixed shadow-sm">
                  <span>🌱</span>
                  <span>Ruang Jeda Dipandu</span>
                </div>

                <span className="flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant">
                  <Timer size={14} />
                  2-3 Menit
                </span>
              </div>

              {/* CTA Content */}
              <div className="flex flex-col gap-space-xs">
                <h3 className="text-xl font-bold leading-snug text-on-surface">
                  Merasa ini cukup dekat dengan keadaanmu sekarang?
                </h3>

                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Kalau kamu ingin memahami keadaanmu lebih jauh dan butuh
                  langkah awal yang ramah energi, kamu bisa mulai dengan
                  self-assessment singkat.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="grid grid-cols-2 gap-2 py-1">
                <div className="flex items-center gap-2 rounded-lg bg-surface-container p-2.5">
                  <Heart size={18} className="text-primary" />

                  <span className="text-[11px] font-semibold text-on-surface">
                    Tanpa Dihakimi
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-surface-container p-2.5">
                  <WandSparkles size={18} className="text-tertiary" />

                  <span className="text-[11px] font-semibold text-on-surface">
                    Saran Realistis
                  </span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-space-xs rounded-lg bg-surface-container-high/60 p-space-sm">
                <Info className="mt-0.5 shrink-0 text-outline" size={18} />

                <p className="text-xs text-on-surface-variant">
                  Hasil ini bukan diagnosis medis, melainkan gambaran awal
                  untuk bantu pilihin langkah kecil yang realistis.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <button
                  type="button"
                  onClick={handleStartQuest}
                  disabled={isStarting || isWelcome}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-space-md py-3.5 text-sm font-bold text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-[0.99] disabled:cursor-default"
                >
                  {isStarting ? (
                    <>
                      <span>Menyiapkan Ruang...</span>
                      <span className="animate-spin">
                        <Repeat size={18} />
                      </span>
                    </>
                  ) : isWelcome ? (
                    <span>Selamat Datang 🌱</span>
                  ) : (
                    <>
                      <span>Bantu aku mulai (Kuesioner 2-3 Menit)</span>

                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReadMore}
                  className="w-full rounded-xl bg-surface-container px-space-md py-2.5 text-center text-xs font-bold text-on-surface transition-colors hover:bg-surface-container-high"
                >
                  Aku mau baca-baca dulu aja
                </button>
              </div>

              {/* Privacy */}
              <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] font-semibold text-on-surface-variant">
                <Lock size={15} className="text-primary" />

                <span>
                  Pribadi & aman. Jawabanmu tidak dipublikasikan ke siapapun.
                </span>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="flex flex-col items-center justify-center gap-space-xs py-space-md text-center">
            <span className="text-[24px]">🍵</span>

            <p className="text-xs font-bold text-on-surface">
              Tarik napas dulu, kamu udah berproses hebat hari ini.
            </p>

            <span className="text-xs text-on-surface-variant">
              Tim Ruang Tenang • Teman Berproses Kamu
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}

interface ArticleSectionProps {
  title: string
  dotClassName: string
  children: React.ReactNode
}

function ArticleSection({
  title,
  dotClassName,
  children,
}: ArticleSectionProps) {
  return (
    <section className="flex flex-col gap-space-md">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dotClassName}`} />

        <h2 className="text-lg font-semibold leading-6 text-on-surface">
          {title}
        </h2>
      </div>

      {children}
    </section>
  )
}

interface ClarificationItemProps {
  type: 'negative' | 'positive'
  children: React.ReactNode
}

function ClarificationItem({
  type,
  children,
}: ClarificationItemProps) {
  const isPositive = type === 'positive'

  return (
    <div className="flex items-start gap-space-sm">
      <div
        className={[
          'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
          isPositive
            ? 'bg-primary-fixed text-on-primary-fixed'
            : 'bg-error-container text-on-error-container',
        ].join(' ')}
      >
        {isPositive ? <Check size={16} /> : <X size={16} />}
      </div>

      <span className="text-sm leading-5.5 text-on-surface">
        {children}
      </span>
    </div>
  )
}