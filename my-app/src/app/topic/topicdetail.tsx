import {
  ArrowLeft,
  ArrowRight,
  BatteryLow,
  Bookmark,
  BookmarkCheck,
  Check,
  X,
  Heart,
  Laptop,
  Lock,
  Share2,
  Clock3,
  Meh,
  Hourglass,
  BadgeCheck,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

type ToastMessage =
  | 'Artikel disimpan ke ruang bacamu'
  | 'Artikel dihapus dari simpanan'
  | 'Link tersalin ke papan klip'
  | 'Menyiapkan ruang hening...'
  | 'Santai, luangkan waktumu sesukamu.'

const article = {
  category: 'Capek Mental & Energi',
  readingTime: '4 Menit Baca',
  title: 'Burnout: Ketika Capek Bukan Cuma Soal Kurang Tidur',
  description:
    'Pernah ngerasa udah tidur 8 jam penuh, tapi pas bangun rasanya tetep lemes dan males ngadepin hari? Mungkin yang lelah bukan cuma ototmu, tapi baterai mentalmu.',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAV85sTu4rV8_oGc_KEeMrEVlBc4Spb3ri4AFPoKbGDnu-doNNBNiN9vjtQ_HIcfHtXQiWoHRN2QBdgfKhxGZ5KRWUvjOvRkbmcKRHgYPNBuQg5BKEOAcakizPA4ZMrAxq52ozrNUhYTMrTg0s0byM48u2rzp6YIpPgjE6JLWAqMQl6FHl-_7P0mqFzqTUN3vDsBM20h16IiUTrn7rqLwgrMbfbwxdRrMmPwrg9-9aQLEiUCbXNbIUj0g',
}

const dailySigns = [
  {
    icon: Laptop,
    text: 'Buka laptop rasanya berat banget, padahal kerjaan atau tugas yang nunggu sebenarnya biasa aja.',
  },
  {
    icon: Meh,
    text: 'Hal-hal yang biasanya bikin seneng kayak nonton serial favorit atau ngopi sore mendadak hambar dan hampa.',
  },
  {
    icon: Zap,
    text: 'Gampang emosi, gampang tersinggung, atau sensitif ke orang terdekat gara-gara hal sepele.',
  },
]

const commonTraps = [
  {
    icon: BadgeCheck,
    title: 'Perfeksionisme Halus',
    description:
      'Punya dorongan konstan: “Kalau ga beres sempurna sekarang, rasanya bersalah banget.”',
  },
  {
    icon: Hourglass,
    title: 'Batas yang Samar',
    description:
      'Susah membedakan antara waktu beneran istirahat dengan waktu standby untuk pekerjaan atau kuliah.',
  },
  {
    icon: BatteryLow,
    title: 'Selalu Bilang “Bisa”',
    description:
      'Terus mengiyakan ajakan atau tugas tambahan padahal kapasitas energimu udah sisa 10%.',
  },
]

const burnoutClarifications = [
  {
    type: 'negative',
    text: 'Bukan berarti masa depanmu berantakan atau gagal.',
  },
  {
    type: 'negative',
    text: 'Bukan berarti kamu harus langsung resign drastis atau putus sekolah.',
  },
  {
    type: 'positive',
    text: 'Ini cuma sinyal ramah dari diri sendiri yang perlu didengar baik-baik.',
  },
]

export function ArticleDetailPage() {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const showToast = (message: ToastMessage) => {
    setToast(message)

    window.setTimeout(() => {
      setToast(null)
    }, 2400)
  }

  const handleBookmark = () => {
    const nextValue = !isBookmarked

    setIsBookmarked(nextValue)

    showToast(
      nextValue
        ? 'Artikel disimpan ke ruang bacamu'
        : 'Artikel dihapus dari simpanan',
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: 'Bacaan menenangkan tentang burnout dan cara mendengarkan jeda.',
          url: window.location.href,
        })
      } catch {
        // User membatalkan share.
      }

      return
    }

    try {
      await navigator.clipboard.writeText(window.location.href)
      showToast('Link tersalin ke papan klip')
    } catch {
      showToast('Link tersalin ke papan klip')
    }
  }

  const handleGuidedStart = () => {
    showToast('Menyiapkan ruang hening...')
  }

  const handleDismiss = () => {
    showToast('Santai, luangkan waktumu sesukamu.')
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <main className="w-full">
        <div className="mx-auto flex w-full max-w-3xl flex-col px-margin pb-12">
          {/* Article utility bar */}
          <div className="flex items-center justify-between py-space-md">
            <Link
              to="/eksplorasi"
              className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5 text-on-surface transition-colors hover:bg-surface-container-high active:scale-95"
            >
              <ArrowLeft size={18} />
              <span className="text-xs font-bold">Explore</span>
            </Link>

            <div className="flex items-center gap-space-xs">
              <button
                type="button"
                aria-label="Simpan Artikel"
                aria-pressed={isBookmarked}
                onClick={handleBookmark}
                className={[
                  'flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-90',
                  isBookmarked
                    ? 'bg-primary-fixed text-on-primary-fixed'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high',
                ].join(' ')}
              >
                {isBookmarked ? (
                  <BookmarkCheck size={20} />
                ) : (
                  <Bookmark size={20} />
                )}
              </button>

              <button
                type="button"
                aria-label="Bagikan"
                onClick={handleShare}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface transition-all hover:bg-surface-container-high active:scale-90"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Hero */}
          <section className="flex flex-col gap-space-sm pb-space-lg pt-space-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary-fixed px-2.5 py-1 text-xs font-semibold text-on-secondary-fixed">
                {article.category}
              </span>

              <span className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant">
                <Clock3 size={14} />
                {article.readingTime}
              </span>
            </div>

            <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-on-surface">
              {article.title}
            </h1>

            <p className="text-base font-medium leading-relaxed text-on-surface-variant">
              {article.description}
            </p>
          </section>

          {/* Hero image */}
          <div className="mb-space-lg w-full overflow-hidden rounded-2xl shadow-sm">
            <img
              src={article.image}
              alt="Suasana pagi yang tenang dengan tempat tidur, teh hangat, dan tanaman indoor"
              className="h-52 w-full object-cover"
            />
          </div>

          {/* Section 1 */}
          <ArticleSection
            title="Gimana Rasanya di Keseharian?"
            dotClassName="bg-primary"
          >
            <div className="flex flex-col gap-space-sm">
              {dailySigns.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.text}
                    className="flex items-start gap-3.5 rounded-2xl bg-surface-container-low p-space-md"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-container-highest text-on-surface">
                      <Icon size={20} />
                    </div>

                    <p className="pt-1 text-sm leading-5.5 text-on-surface">
                      {item.text}
                    </p>
                  </div>
                )
              })}
            </div>
          </ArticleSection>

          {/* Pull quote */}
          <div className="relative mb-space-xl overflow-hidden rounded-2xl bg-surface-container p-space-lg">
            <div className="pointer-events-none absolute -bottom-4 -right-4 select-none text-surface-container-highest opacity-40">
              <span className="text-[100px]">“</span>
            </div>

            <div className="relative z-10 mb-space-sm flex items-center gap-2 text-primary">
              <Heart size={20} />

              <span className="text-xs font-semibold uppercase tracking-wider">
                Catatan Hangat
              </span>
            </div>

            <blockquote className="relative z-10 text-lg font-semibold leading-snug text-on-surface">
              “Burnout bukan tanda kamu lemah atau malas. Ini cara tubuh dan
              pikiranmu teriak minta jeda setelah dipaksa lari maraton terlalu
              lama.”
            </blockquote>
          </div>

          {/* Section 2 */}
          <ArticleSection
            title="Yang Sering Bikin Terjebak"
            dotClassName="bg-secondary"
          >
            <div className="grid grid-cols-1 gap-space-sm">
              {commonTraps.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="flex flex-col gap-1 rounded-2xl bg-surface-container-lowest p-space-md shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-secondary">
                      <Icon size={18} />

                      <span className="text-xs font-bold">
                        {item.title}
                      </span>
                    </div>

                    <p className="text-sm leading-5.5 text-on-surface-variant">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </ArticleSection>

          {/* Section 3 */}
          <ArticleSection
            title="Apa yang BUKAN Berarti Burnout?"
            dotClassName="bg-primary-container"
          >
            <div className="flex flex-col gap-space-sm rounded-2xl bg-surface-container-low p-space-md">
              {burnoutClarifications.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3"
                >
                  <div
                    className={[
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                      item.type === 'positive'
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : 'bg-surface-container-highest text-on-surface',
                    ].join(' ')}
                  >
                    {item.type === 'positive' ? (
                      <Check size={16} />
                    ) : (
                      <X size={16} />
                    )}
                  </div>

                  <p
                    className={[
                      'text-sm leading-5.5 text-on-surface',
                      item.type === 'positive' ? 'font-medium' : '',
                    ].join(' ')}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </ArticleSection>

          {/* Progress indicator */}
          <div className="my-space-sm flex w-full items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-outline-variant" />
            <span className="h-1.5 w-1.5 rounded-full bg-outline-variant" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="h-1.5 w-1.5 rounded-full bg-outline-variant" />
            <span className="h-1.5 w-1.5 rounded-full bg-outline-variant" />
          </div>

          {/* Guided CTA */}
          <section className="mt-space-md flex flex-col gap-space-md rounded-2xl bg-linear-to-b from-surface-container to-surface-container-high p-space-lg shadow-md">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-fixed px-3 py-1 text-xs font-semibold text-on-primary-fixed shadow-sm">
                <span>🌱</span>
                Ruang Jeda Dipandu
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-2xl font-bold leading-snug text-on-surface">
                Sedang mengalami ini sekarang?
              </h2>

              <p className="text-sm leading-relaxed text-on-surface-variant">
                Kalau kamu merasa tulisan ini cukup dekat dengan yang lagi kamu
                rasain, kita bisa mulai dari satu langkah kecil bareng-bareng.
                Tanpa diagnosis, tanpa tuntutan langsung sembuh.
              </p>
            </div>

            <div className="flex flex-col gap-space-sm pt-space-xs">
              <button
                type="button"
                onClick={handleGuidedStart}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-space-md py-3.5 text-sm font-bold text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-[0.98]"
              >
                <span>Bantu aku mulai (1-2 Menit)</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-full rounded-xl px-space-md py-2.5 text-center text-xs font-bold text-on-surface-variant transition-all hover:text-on-surface active:opacity-70"
              >
                Aku cuma mau baca dulu, makasih
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-space-xs text-on-surface-variant">
              <Lock size={14} />

              <span className="text-center text-xs">
                Aman & privat. Langkah kecil disesuaikan dengan energimu hari
                ini.
              </span>
            </div>
          </section>
        </div>
      </main>

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        className={[
          'fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-inverse-surface px-4 py-2 text-xs font-bold text-inverse-on-surface shadow-xl transition-all duration-300',
          toast
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-2 opacity-0',
        ].join(' ')}
      >
        <Check size={18} />
        <span>{toast ?? 'Tersimpan'}</span>
      </div>
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
    <section className="mb-space-xl flex flex-col gap-space-md">
      <div className="flex items-center gap-space-xs">
        <span className={`h-2 w-2 rounded-full ${dotClassName}`} />

        <h2 className="text-xl font-bold leading-7 text-on-surface">
          {title}
        </h2>
      </div>

      {children}
    </section>
  )
}