import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { ENTRY_TYPE_CONFIG, type AtlasEntryType } from '@/config'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://atlas-sinaloa.tech'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/directorio`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/eventos`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/noticias`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/empleos`, changeFrequency: 'daily', priority: 0.7 },
  ]

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = Object.values(ENTRY_TYPE_CONFIG).map((c) => ({
    url: `${SITE_URL}/${c.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Entry detail pages
  const entries = await payload.find({
    collection: 'entries',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    select: { slug: true, entryType: true, updatedAt: true },
  })

  const entryPages: MetadataRoute.Sitemap = entries.docs.map((entry) => {
    const categorySlug = ENTRY_TYPE_CONFIG[entry.entryType as AtlasEntryType]?.slug
    return {
      url: `${SITE_URL}/${categorySlug}/${entry.slug}`,
      lastModified: entry.updatedAt ? new Date(entry.updatedAt) : undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  })

  // News articles
  const news = await payload.find({
    collection: 'news',
    where: { _status: { equals: 'published' } },
    limit: 500,
    select: { slug: true, updatedAt: true },
  })

  const newsPages: MetadataRoute.Sitemap = news.docs.map((article) => ({
    url: `${SITE_URL}/noticias/${article.slug}`,
    lastModified: article.updatedAt ? new Date(article.updatedAt) : undefined,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...categoryPages, ...entryPages, ...newsPages]
}
