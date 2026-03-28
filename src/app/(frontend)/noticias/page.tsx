import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedNews } from '@/lib/payload'
import { SectionHeading } from '@/components/ui/SectionHeading'

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Noticias del ecosistema tecnológico de Sinaloa.',
}

export default async function NoticiasPage() {
  const result = await getPublishedNews()
  const articles = result.docs

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading>Noticias</SectionHeading>
        <h1 className="text-3xl font-bold text-primary mb-8">Noticias del ecosistema tech</h1>

        {articles.length === 0 && (
          <p className="text-muted text-sm">No hay noticias publicadas aún.</p>
        )}

        <div className="space-y-6">
          {articles.map((article) => {
            const coverUrl = (article.coverImage as { url: string } | null)?.url
            return (
              <Link
                key={article.id}
                href={`/noticias/${article.slug}`}
                className="block bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row">
                  {coverUrl && (
                    <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0">
                      <img src={coverUrl} alt={article.title as string} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="p-4 flex-1">
                    <p className="text-2xs font-mono text-muted mb-1">
                      {new Date(article.publishDate as string).toLocaleDateString('es-MX', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                    <h2 className="text-lg font-semibold text-primary mb-1">{article.title as string}</h2>
                    {article.excerpt && (
                      <p className="text-sm text-secondary line-clamp-2">{article.excerpt as string}</p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
