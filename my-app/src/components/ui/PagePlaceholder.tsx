import { Sparkles } from 'lucide-react'

export interface PagePlaceholderProps {
  title: string
  description: string
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <section className="flex flex-col items-start gap-3 rounded-3xl border border-dashed border-cream-300 bg-cream-50 p-8">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pelan-100 text-pelan-600">
        <Sparkles size={18} aria-hidden="true" />
      </span>
      <h1 className="font-serif text-3xl font-medium text-ink-900">{title}</h1>
      <p className="max-w-xl text-sm text-ink-500">{description}</p>
    </section>
  )
}
