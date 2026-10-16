import { useEffect, useState } from 'react'
import { Bookmark, Heart, Share2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { EKSPLORASI_HEADER, SAFE_NOTICE } from '@/app/eksplorasi/eksplorasiService'
import { ApiError, getArticles, updateArticleEngagement, type Article, type ArticleListResult } from '@/lib/api'
import { useAuth } from '@/lib/useAuth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { LinkButton } from '@/components/ui/LinkButton'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function EksplorasiPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<ArticleListResult | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [loadedPage, setLoadedPage] = useState<number | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isLoading = loadedPage !== page

  useEffect(() => {
    let active = true
    getArticles(page, 10)
      .then((data) => {
        if (!active) return
        setResult(data)
        setArticles(data.data)
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof ApiError ? error.message : 'Artikel belum dapat dimuat. Coba lagi.',
          )
        }
      })
      .finally(() => {
        if (active) setLoadedPage(page)
      })

    return () => {
      active = false
    }
  }, [page, retryCount])

  function changePage(nextPage: number) {
    setErrorMessage(null)
    setPage(nextPage)
  }

  async function handleEngagement(articleId: string, action: 'like' | 'save' | 'share') {
    setErrorMessage(null)
    try {
      const counts = await updateArticleEngagement(articleId, action)
      setArticles((current) =>
        current.map((article) => (article.articleId === articleId ? { ...article, ...counts } : article)),
      )
      if (action === 'save') {
        setSavedIds((current) => (current.includes(articleId) ? current : [...current, articleId]))
      }
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : 'Aksi artikel belum dapat disimpan.',
      )
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        level="h1"
        eyebrow={EKSPLORASI_HEADER.eyebrow}
        title={EKSPLORASI_HEADER.title}
        description={EKSPLORASI_HEADER.description}
      />

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-2xl font-medium text-ink-900">Eksplorasi Bacaan</h2>
            <p className="text-xs text-ink-500">
              Artikel dimuat dari pustaka SKS. Informasi yang ditampilkan mengikuti data yang disimpan backend.
            </p>
          </div>
          {result ? (
            <p className="text-[11px] text-ink-500">
              {result.meta.total} artikel • halaman {result.meta.page} dari {result.meta.totalPages}
            </p>
          ) : null}
        </div>

        {errorMessage ? (
          <Card className="flex flex-col items-start gap-3">
            <p role="alert" className="text-sm text-red-700">{errorMessage}</p>
            <Button
              variant="secondary"
              onClick={() => {
                setErrorMessage(null)
                setLoadedPage(null)
                setRetryCount((current) => current + 1)
              }}
            >
              Coba lagi
            </Button>
          </Card>
        ) : isLoading ? (
          <div className="grid gap-5 md:grid-cols-2" aria-busy="true">
            {Array.from({ length: 4 }, (_, index) => (
              <Card key={index} className="flex flex-col gap-3">
                <div className="h-44 animate-pulse rounded-xl bg-cream-200" />
                <div className="h-6 w-4/5 animate-pulse rounded bg-cream-200" />
                <div className="h-12 w-full animate-pulse rounded bg-cream-200" />
              </Card>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <Card tone="muted" className="text-center text-sm text-ink-500">
            Belum ada artikel yang dipublikasikan.
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {articles.map((article) => (
              <Card
                key={article.articleId}
                as="article"
                className="flex cursor-pointer flex-col gap-3 transition-shadow hover:shadow-md"
                onClick={(event) => {
                  if (event.target instanceof Element && event.target.closest('button')) return
                  void navigate(`/topic/detail?articleId=${encodeURIComponent(article.articleId)}`)
                }}
              >
                <img
                  src={article.thumbnailUrl}
                  alt=""
                  className="h-44 w-full rounded-xl object-cover"
                />
                <h3 className="font-serif text-lg font-medium leading-snug text-ink-900">
                  {article.articleTitle}
                </h3>
                <p className="text-xs leading-relaxed text-ink-500">{article.articleDescription}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-cream-200 pt-3">
                  <span className="text-[11px] text-ink-500">
                    {article.likeCounts} suka · {article.saveCounts} simpan · {article.sharedCounts} bagikan
                  </span>
                  {isAuthenticated ? (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        ariaLabel="Suka artikel"
                        icon={Heart}
                        onClick={() => void handleEngagement(article.articleId, 'like')}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        ariaLabel={savedIds.includes(article.articleId) ? 'Artikel tersimpan' : 'Simpan artikel'}
                        icon={Bookmark}
                        disabled={savedIds.includes(article.articleId)}
                        onClick={() => void handleEngagement(article.articleId, 'save')}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        ariaLabel="Bagikan artikel"
                        icon={Share2}
                        onClick={() => void handleEngagement(article.articleId, 'share')}
                      />
                    </div>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        )}

        {result && result.meta.totalPages > 1 ? (
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="secondary"
              disabled={page <= 1 || isLoading}
              onClick={() => changePage(Math.max(1, page - 1))}
            >
              Sebelumnya
            </Button>
            <span className="text-xs text-ink-500">{page} / {result.meta.totalPages}</span>
            <Button
              variant="secondary"
              disabled={page >= result.meta.totalPages || isLoading}
              onClick={() => changePage(page + 1)}
            >
              Berikutnya
            </Button>
          </div>
        ) : null}
      </section>

      <Card tone="blush" className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex max-w-3xl flex-col gap-1.5">
          <Eyebrow tone="clay">{SAFE_NOTICE.label}</Eyebrow>
          <p className="text-sm leading-relaxed text-ink-900">{SAFE_NOTICE.body}</p>
          <p className="text-[11px] text-ink-500">{SAFE_NOTICE.hotlineNote}</p>
        </div>
        <LinkButton to="/bantuan" variant="clay">Lihat Jalur Bantuan</LinkButton>
      </Card>
    </div>
  )
}
