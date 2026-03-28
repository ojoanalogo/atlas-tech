import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getNewsBySlug, getPublishedNews } from '@/lib/payload'
import { SectionHeading } from '@/components/ui/SectionHeading'

export async function generateStaticParams() {
  const result = await getPublishedNews()
  return result.docs.map((article) => ({ slug: article.slug as string }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getNewsBySlug(slug)
  if (!article) return { title: 'Not Found' }
  return {
    title: article.title as string,
    description: (article.excerpt as string) || undefined,
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getNewsBySlug(slug)
  if (!article) notFound()

  const coverUrl = (article.coverImage as { url: string } | null)?.url
  const authorName = (article.author as { displayName?: string; email: string } | null)?.displayName || (article.author as { email: string } | null)?.email

  return (
    <article className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <nav className="text-xs font-mono text-muted mb-6 uppercase">
          <a href="/" className="hover:text-accent transition-colors">Inicio</a>
          <span className="mx-2">/</span>
          <a href="/noticias" className="hover:text-accent transition-colors">Noticias</a>
          <span className="mx-2">/</span>
          <span className="text-primary">{article.title as string}</span>
        </nav>

        {coverUrl && (
          <div className="rounded-lg overflow-hidden mb-6 h-64">
            <img src={coverUrl} alt={article.title as string} className="w-full h-full object-cover" />
          </div>
        )}

        <SectionHeading>
          {new Date(article.publishDate as string).toLocaleDateString('es-MX', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
          {authorName && ` — ${authorName}`}
        </SectionHeading>

        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">{article.title as string}</h1>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <RichText data={article.body as any} />
        </div>
      </div>
    </article>
  )
}
