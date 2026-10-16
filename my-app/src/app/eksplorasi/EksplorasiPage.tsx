import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  Clock,
  Coffee,
  ExternalLink,
  FileText,
  LifeBuoy,
  Share2,
  ShieldCheck,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import {
  ALL_TOPICS,
  EKSPLORASI_HEADER,
  FEATURED_ARTICLE,
  filterArticles,
  SAFE_NOTICE,
  TOPICS,
  TOTAL_NOTES,
} from '@/app/eksplorasi/eksplorasiService'
import type { Article } from '@/app/eksplorasi/eksplorasiService'
import { Artwork } from '@/components/ui/Artwork'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { LinkButton } from '@/components/ui/LinkButton'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function EksplorasiPage() {
  const navigate = useNavigate()
  const [activeTopic, setActiveTopic] = useState<string>(ALL_TOPICS)
  const [savedIds, setSavedIds] = useState<readonly string[]>([])
  const [loadedArticles, setLoadedArticles] = useState<readonly Article[]>()

  const articles = filterArticles(activeTopic)
  const isFeaturedVisible = activeTopic === ALL_TOPICS || activeTopic === FEATURED_ARTICLE.topic

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setLoadedArticles(filterArticles(activeTopic))
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [activeTopic])

  function toggleSaved(id: string) {
    setSavedIds((previous) =>
      previous.includes(id) ? previous.filter((savedId) => savedId !== id) : [...previous, id],
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        level="h1"
        eyebrow={EKSPLORASI_HEADER.eyebrow}
        title={EKSPLORASI_HEADER.title}
        description={EKSPLORASI_HEADER.description}
        action={
          <Card tone="muted" className="flex items-center gap-3 px-4 py-3 lg:px-4 lg:py-3">
            <Coffee size={16} className="text-ink-700" aria-hidden="true" />
            <div className="flex flex-col">
              <p className="text-xs font-semibold text-ink-900">{EKSPLORASI_HEADER.paceLabel}</p>
              <p className="text-[10px] text-ink-500">{EKSPLORASI_HEADER.paceHint}</p>
            </div>
          </Card>
        }
      />

      {/* Filter topik */}
      <div className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="group" aria-label="Filter topik">
        <div className="flex w-max gap-2 lg:w-auto lg:flex-wrap">
          {TOPICS.map((topic) => {
            const isActive = topic === activeTopic

            return (
              <Chip
                key={topic}
                tone={isActive ? 'dark' : 'outline'}
                active={isActive}
                className="px-4 py-2 text-xs font-medium"
                onClick={() => {
                  setActiveTopic(topic)
                }}
              >
                {topic}
              </Chip>
            )
          })}
        </div>
      </div>

      {/* Unggulan */}
      {isFeaturedVisible ? (
        <Card
          as="article"
          className="grid cursor-pointer gap-6 transition-shadow hover:shadow-md md:grid-cols-[1fr_1.3fr] md:items-center lg:p-8"
          onClick={(event) => {
            if (event.target instanceof Element && event.target.closest('button')) return
            void navigate('/topic/detail')
          }}
        >
          <Artwork variant="window" className="min-h-56 md:min-h-72">
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-ink-900">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-clay-500" />
              {FEATURED_ARTICLE.badge}
            </span>
          </Artwork>

          <div className="flex flex-col gap-3">
            <p className="flex flex-wrap items-center gap-2 text-[11px] text-ink-500">
              <Chip tone="clay">{FEATURED_ARTICLE.topic}</Chip>
              <span aria-hidden="true">•</span>
              {FEATURED_ARTICLE.readingTime}
            </p>
            <p className="flex items-center gap-1.5 text-[11px] text-ink-500">
              <ShieldCheck size={12} aria-hidden="true" />
              {FEATURED_ARTICLE.reviewedBy}
            </p>
            <h2 className="font-serif text-2xl font-medium leading-snug text-ink-900 lg:text-3xl">
              {FEATURED_ARTICLE.title}
            </h2>
            <p className="font-serif text-base italic leading-relaxed text-ink-500">
              “{FEATURED_ARTICLE.quote}”
            </p>

            <div className="flex flex-col gap-2 rounded-xl bg-cream-200/70 p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-ink-900">
                <FileText size={13} aria-hidden="true" />
                {FEATURED_ARTICLE.summaryTitle}
              </p>
              <ul className="flex flex-col gap-1.5">
                {FEATURED_ARTICLE.summaryPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-ink-700">
                    <Check size={12} className="mt-0.5 shrink-0 text-pelan-600" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button iconRight={ArrowRight}>Buka Esai Lengkap</Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  ariaLabel={savedIds.includes('featured') ? 'Hapus dari simpanan' : 'Simpan esai'}
                  icon={savedIds.includes('featured') ? BookmarkCheck : Bookmark}
                  onClick={() => {
                    toggleSaved('featured')
                  }}
                />
                <Button variant="ghost" size="sm" ariaLabel="Bagikan esai" icon={Share2} />
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Grid bacaan */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-2xl font-medium text-ink-900">Eksplorasi Bacaan Bernutrisi</h2>
            <p className="text-xs text-ink-500">
              Topik-topik yang sering luput dibicarakan, dikupas tanpa istilah media yang rumit.
            </p>
          </div>
          <p className="text-[11px] text-ink-500">
            Menampilkan {articles.length} dari {TOTAL_NOTES} catatan
          </p>
        </div>

        {!loadedArticles ? (
          <div className="grid gap-5 md:grid-cols-2" aria-busy="true">
            {Array.from({ length: 4 }, (_, index) => (
              <Card key={index} className="flex flex-col gap-3 p-3 lg:p-3">
                <div className="h-44 animate-pulse rounded-xl bg-cream-200" />
                <div className="flex flex-col gap-2 px-2 pb-2">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-cream-200" />
                  <div className="h-6 w-4/5 animate-pulse rounded bg-cream-200" />
                  <div className="h-10 w-full animate-pulse rounded bg-cream-200" />
                </div>
              </Card>
            ))}
          </div>
        ) : loadedArticles.length === 0 ? (
          <Card tone="muted" className="text-center text-sm text-ink-500">
            Belum ada esai untuk topik ini. Coba topik lain, atau kembali lagi nanti.
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {loadedArticles.map((article) => {
              const isSaved = savedIds.includes(article.id)

              return (
                <Card
                  key={article.id}
                  as="article"
                  className="flex cursor-pointer flex-col gap-3 p-3 transition-shadow hover:shadow-md lg:p-3"
                  onClick={(event) => {
                    if (event.target instanceof Element && event.target.closest('button')) return
                    void navigate('/topic/detail')
                  }}
                >
                  <Artwork variant={article.artwork} className="min-h-44">
                    <span className="absolute top-3 left-3 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-ink-900">
                      {article.topic}
                    </span>
                  </Artwork>
                  <div className="flex flex-col gap-2 px-2 pb-2">
                    <p className="flex flex-wrap items-center gap-1.5 text-[11px] text-ink-500">
                      <Clock size={11} aria-hidden="true" />
                      {article.readingTime}
                      <span aria-hidden="true">•</span>
                      {article.subtitle}
                    </p>
                    <h3 className="font-serif text-lg font-medium leading-snug text-ink-900">
                      {article.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-ink-500">{article.excerpt}</p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="flex items-center gap-2 text-[11px] text-ink-500">
                        <span
                          aria-hidden="true"
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-pelan-100 text-[9px] font-bold text-pelan-700"
                        >
                          {article.authorInitials}
                        </span>
                        {article.authorName}
                      </p>
                      <button
                        type="button"
                        aria-label={isSaved ? `Hapus ${article.title} dari simpanan` : `Simpan ${article.title}`}
                        onClick={() => {
                          toggleSaved(article.id)
                        }}
                        className="rounded-md p-1.5 text-ink-500 transition-colors hover:bg-cream-200 hover:text-ink-900"
                      >
                        {isSaved ? (
                          <BookmarkCheck size={15} aria-hidden="true" />
                        ) : (
                          <Bookmark size={15} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* Ruang aman */}
      <Card tone="blush" className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-clay-500">
            <LifeBuoy size={18} aria-hidden="true" />
          </span>
          <div className="flex max-w-3xl flex-col gap-1.5">
            <Eyebrow tone="clay">{SAFE_NOTICE.label}</Eyebrow>
            <p className="text-sm leading-relaxed text-ink-900">{SAFE_NOTICE.body}</p>
            <p className="text-[11px] text-ink-500">{SAFE_NOTICE.hotlineNote}</p>
          </div>
        </div>
        <LinkButton to="/bantuan" variant="clay" iconRight={ExternalLink}>
          Lihat Jalur Bantuan
        </LinkButton>
      </Card>
    </div>
  )
}
