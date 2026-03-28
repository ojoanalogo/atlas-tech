import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEntryBySlug, getPublishedEntries } from '@/lib/payload'
import { buildTrackedUrl, flattenArray } from '@/lib/utils'
import {
  ENTRY_TYPE_CONFIG,
  URL_CATEGORY_MAP,
  CATEGORY_URL_MAP,
  getCityName,
  SITE_URL,
  type AtlasEntryType,
} from '@/config'
import { EntryBadge } from '@/components/entries/EntryBadge'
import { EntryCard } from '@/components/entries/EntryCard'
import { Tag } from '@/components/ui/Tag'
import ShareButton from '@/components/ui/ShareButton'
import { ExternalLink } from '@/components/ui/ExternalLink'
import {
  Globe,
  MapPin,
  Calendar,
  Users2,
  Layers,
  Wrench,
  Code2,
  Briefcase,
  Link2,
} from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'

export async function generateStaticParams() {
  const result = await getPublishedEntries()
  return result.docs.map((entry) => ({
    category: CATEGORY_URL_MAP[entry.entryType as AtlasEntryType],
    slug: entry.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = await getEntryBySlug(slug)
  if (!entry) return { title: 'Not Found' }
  return {
    title: entry.name as string,
    description: (entry.tagline as string) || undefined,
  }
}

export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const entryType = URL_CATEGORY_MAP[category] as AtlasEntryType | undefined
  if (!entryType) notFound()

  const entry = await getEntryBySlug(slug)
  if (!entry || entry.entryType !== entryType) notFound()

  // Suggestion algorithm: same type > same city > random, max 3
  const allResult = await getPublishedEntries()
  const others = allResult.docs.filter((e) => e.id !== entry.id)
  const sameType = others.filter((e) => e.entryType === entry.entryType)
  const sameCity = others.filter((e) => e.city === entry.city)
  const suggestions: typeof others = []
  for (const e of sameType) {
    if (suggestions.length < 3 && !suggestions.includes(e)) suggestions.push(e)
  }
  for (const e of sameCity) {
    if (suggestions.length < 3 && !suggestions.includes(e)) suggestions.push(e)
  }
  for (const e of others) {
    if (suggestions.length < 3 && !suggestions.includes(e)) suggestions.push(e)
  }

  const config = ENTRY_TYPE_CONFIG[entry.entryType as AtlasEntryType]
  const tags = flattenArray(entry.tags as Array<{ tag: string }>, 'tag')
  const technologies = flattenArray(
    entry.technologies as Array<{ technology: string }>,
    'technology',
  )
  const services = flattenArray(entry.services as Array<{ service: string }>, 'service')
  const skills = flattenArray(entry.skills as Array<{ skill: string }>, 'skill')
  const focusAreas = flattenArray(entry.focusAreas as Array<{ area: string }>, 'area')

  const coverUrl = (entry.coverImage as { url: string } | null)?.url
  const logoUrl = (entry.logo as { url: string } | null)?.url
  const isStartupLike = ['startup', 'business', 'consultory'].includes(entry.entryType as string)

  return (
    <article className="py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs font-mono text-muted mb-6 uppercase">
          <a href="/" className="hover:text-accent transition-colors">
            Inicio
          </a>
          <span className="mx-2">/</span>
          <a href={`/${config.slug}`} className="hover:text-accent transition-colors">
            {config.labelPlural}
          </a>
          <span className="mx-2">/</span>
          <span className="text-primary">{entry.name as string}</span>
        </nav>

        {/* Cover image */}
        {coverUrl && (
          <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
            <img
              src={coverUrl}
              alt={entry.name as string}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={entry.name as string}
              className="w-16 h-16 rounded-lg object-contain border border-border bg-card p-1"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <EntryBadge entryType={entry.entryType as AtlasEntryType} />
              {entry.verified && (
                <span className="text-2xs font-mono text-accent">Verificado</span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              {entry.name as string}
            </h1>
            {entry.tagline && (
              <p className="text-secondary mt-1">{entry.tagline as string}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted font-mono">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {getCityName(entry.city as string)}
              </span>
              {entry.foundedYear && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {String(entry.foundedYear)}
                </span>
              )}
            </div>
          </div>
          <ShareButton
            url={`${SITE_URL}/${config.slug}/${entry.slug}`}
            title={entry.name as string}
          />
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2 mb-6">
          {entry.website && (
            <ExternalLink
              href={buildTrackedUrl(entry.website as string, entry.slug as string)}
              className="flex items-center gap-1 text-xs font-mono text-accent hover:underline"
            >
              <Globe className="w-3.5 h-3.5" /> Sitio web
            </ExternalLink>
          )}
          {entry.github && (
            <ExternalLink
              href={`https://github.com/${entry.github}`}
              className="flex items-center gap-1 text-xs font-mono text-accent hover:underline"
            >
              <Code2 className="w-3.5 h-3.5" /> GitHub
            </ExternalLink>
          )}
          {entry.linkedin && (
            <ExternalLink
              href={
                String(entry.linkedin).startsWith('http')
                  ? String(entry.linkedin)
                  : `https://linkedin.com/in/${entry.linkedin}`
              }
              className="flex items-center gap-1 text-xs font-mono text-accent hover:underline"
            >
              <Link2 className="w-3.5 h-3.5" /> LinkedIn
            </ExternalLink>
          )}
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {isStartupLike && entry.stage && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Etapa</p>
              <p className="text-sm text-primary font-medium">{entry.stage as string}</p>
            </div>
          )}
          {isStartupLike && entry.teamSize && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Equipo</p>
              <p className="text-sm text-primary font-medium flex items-center gap-1">
                <Users2 className="w-3.5 h-3.5" />
                {entry.teamSize as string}
              </p>
            </div>
          )}
          {isStartupLike && entry.sector && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Sector</p>
              <p className="text-sm text-primary font-medium">{entry.sector as string}</p>
            </div>
          )}
          {isStartupLike && entry.businessModel && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Modelo</p>
              <p className="text-sm text-primary font-medium">
                {entry.businessModel as string}
              </p>
            </div>
          )}
          {entry.entryType === 'community' && entry.meetupFrequency && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Frecuencia</p>
              <p className="text-sm text-primary font-medium">
                {entry.meetupFrequency as string}
              </p>
            </div>
          )}
          {entry.entryType === 'person' && entry.role && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Rol</p>
              <p className="text-sm text-primary font-medium">{entry.role as string}</p>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-6">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}

        {/* Technologies / Services / Skills / Focus Areas */}
        {technologies.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-mono text-muted mb-2 flex items-center gap-1">
              <Code2 className="w-3 h-3" /> Tecnologias
            </p>
            <div className="flex flex-wrap gap-1">
              {technologies.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        )}
        {services.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-mono text-muted mb-2 flex items-center gap-1">
              <Wrench className="w-3 h-3" /> Servicios
            </p>
            <div className="flex flex-wrap gap-1">
              {services.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </div>
        )}
        {skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-mono text-muted mb-2 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Habilidades
            </p>
            <div className="flex flex-wrap gap-1">
              {skills.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </div>
        )}
        {focusAreas.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-mono text-muted mb-2">Areas de enfoque</p>
            <div className="flex flex-wrap gap-1">
              {focusAreas.map((a) => (
                <Tag key={a}>{a}</Tag>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        {entry.body && (
          <div className="prose prose-sm dark:prose-invert max-w-none mt-8 mb-8">
            <RichText data={entry.body as any} />
          </div>
        )}

        {/* Hiring banner */}
        {isStartupLike && entry.hiring && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-8">
            <p className="text-sm font-medium text-accent flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Estamos contratando
            </p>
            {entry.hiringUrl && (
              <ExternalLink
                href={entry.hiringUrl as string}
                className="text-xs text-accent underline mt-1 inline-block"
              >
                Ver vacantes
              </ExternalLink>
            )}
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-primary mb-4">Mira mas</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((s) => (
                <EntryCard
                  key={s.id as string}
                  slug={s.slug as string}
                  name={s.name as string}
                  tagline={s.tagline as string | undefined}
                  entryType={s.entryType as AtlasEntryType}
                  logo={s.logo as any}
                  coverImage={s.coverImage as any}
                  city={s.city as string}
                  tags={s.tags as any}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
