import { useEffect, useState } from 'react'
import { ArrowLeft, Bookmark, Heart, Share2 } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

import { ApiError, getArticle, updateArticleEngagement, type ArticleDetail } from '@/lib/api'
import { useAuth } from '@/lib/useAuth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { LinkButton } from '@/components/ui/LinkButton'

type EngagementAction = 'like' | 'save' | 'share'

export function ArticleDetailPage() {
  const [searchParams] = useSearchParams()
  const articleId = searchParams.get('articleId')
  const { isAuthenticated } = useAuth()
  const [loadedArticle, setLoadedArticle] = useState<{ id: string; article: ArticleDetail } | null>(null)
  const [loadedArticleId, setLoadedArticleId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isLoading = articleId !== null && loadedArticleId !== articleId
  const article = loadedArticle?.id === articleId ? loadedArticle.article : null

  useEffect(() => {
    if (!articleId) return

    let active = true
    getArticle(articleId)
      .then((detail) => {
        if (active) setLoadedArticle({ id: articleId, article: detail })
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof ApiError ? error.message : 'Artikel belum dapat dimuat. Coba lagi.',
          )
        }
      })
      .finally(() => {
        if (active) setLoadedArticleId(articleId)
      })

    return () => {
      active = false
    }
  }, [articleId])

  async function engage(action: EngagementAction): Promise<void> {
    if (!article) return
    setErrorMessage(null)
    try {
      const counts = await updateArticleEngagement(article.articleId, action)
      setLoadedArticle((current) =>
        current?.id === article.articleId
          ? { ...current, article: { ...current.article, ...counts } }
          : current,
      )
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : 'Aksi artikel belum dapat disimpan.',
      )
    }
  }

  async function shareArticle(): Promise<void> {
    if (!article) return
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.articleTitle,
          text: article.articleDescription,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
      }
      await engage('share')
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      setErrorMessage(error instanceof Error ? error.message : 'Artikel gagal dibagikan.')
    }
  }

  const error = articleId
    ? errorMessage
    : 'Pilih artikel dari halaman eksplorasi terlebih dahulu.'

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-8">
      <Link
        to="/eksplorasi"
        className="inline-flex items-center gap-1.5 self-start rounded-full bg-cream-200 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-cream-300"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Kembali ke eksplorasi
      </Link>

      {isLoading ? (
        <Card aria-busy="true" className="flex flex-col gap-3">
          <div className="h-56 animate-pulse rounded-xl bg-cream-200" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-cream-200" />
          <div className="h-20 w-full animate-pulse rounded bg-cream-200" />
        </Card>
      ) : error && !article ? (
        <Card className="flex flex-col items-start gap-3">
          <p role="alert" className="text-sm text-red-700">{error}</p>
          <LinkButton to="/eksplorasi">Kembali ke artikel</LinkButton>
        </Card>
      ) : article ? (
        <>
          {errorMessage ? (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}
          <article className="flex flex-col gap-5">
            <img
              src={article.thumbnailUrl}
              alt=""
              className="max-h-96 w-full rounded-2xl object-cover"
            />
            <div className="flex flex-col gap-3">
              <Chip tone="clay" className="self-start">
                Artikel SKS
              </Chip>
              <h1 className="font-serif text-3xl font-medium leading-tight text-ink-900">
                {article.articleTitle}
              </h1>
              <p className="text-base leading-relaxed text-ink-600">
                {article.articleDescription}
              </p>
              <p className="text-xs text-ink-500">
                Diterbitkan {new Date(article.createdAt).toLocaleDateString('id-ID')}
              </p>
            </div>

            {isAuthenticated ? (
              <div className="flex flex-wrap items-center gap-2 border-y border-cream-200 py-3">
                <Button variant="secondary" size="sm" icon={Heart} onClick={() => void engage('like')}>
                  Suka ({article.likeCounts})
                </Button>
                <Button variant="secondary" size="sm" icon={Bookmark} onClick={() => void engage('save')}>
                  Simpan ({article.saveCounts})
                </Button>
                <Button variant="secondary" size="sm" icon={Share2} onClick={() => void shareArticle()}>
                  Bagikan ({article.sharedCounts})
                </Button>
              </div>
            ) : (
              <Card tone="muted" className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-700">Masuk untuk menyukai, menyimpan, atau membagikan artikel.</p>
                <LinkButton to="/login">Masuk</LinkButton>
              </Card>
            )}

            <div className="whitespace-pre-wrap text-sm leading-7 text-ink-700">
              {article.articleBody?.content ?? 'Isi artikel belum tersedia.'}
            </div>
            {article.articleBody?.imageUrls.map((imageUrl) => (
              <img key={imageUrl} src={imageUrl} alt="" className="w-full rounded-xl object-cover" />
            ))}
          </article>
        </>
      ) : null}
    </div>
  )
}
