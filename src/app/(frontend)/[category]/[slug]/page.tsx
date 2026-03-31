import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getEntryBySlug, getPublishedEntries } from '@/lib/payload'
import { buildTrackedUrl, flattenArray, safeJsonLd } from '@/lib/utils'
import {
  ENTRY_TYPE_CONFIG,
  ENTRY_TYPE_LABELS,
  URL_CATEGORY_MAP,
  CATEGORY_URL_MAP,
  getCityName,
  SITE_URL,
  type AtlasEntryType,
} from '@/config'
import { extractImageUrl } from '@/lib/format'
import { EntryBadge } from '@/components/entries/EntryBadge'
import { EntryCard } from '@/components/entries/EntryCard'
import { Tag } from '@/components/ui/Tag'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import ShareButton from '@/components/ui/ShareButton'
import { ExternalLink } from '@/components/ui/ExternalLink'
import {
  Globe,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Building2,
  Building,
  Clock,
  Monitor,
  UserCheck,
  Target,
  LayoutList,
  Link as LinkIcon,
  Briefcase,
  GraduationCap,
  BadgeCheck,
  ExternalLink as ExternalLinkIcon,
  Send,
  Mail,
  MessageCircle,
  Info,
  Wrench,
  Cpu,
  Cog,
  Tag as TagIcon,
} from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { LucideIcon } from 'lucide-react'

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

/* ------------------------------------------------------------------ */
/*  Social icon SVGs (not available in lucide-react)                  */
/* ------------------------------------------------------------------ */

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8504.6165 19.0872.321 18.2143.12 16.9366.0667 15.6588.0107 15.2479-.0022 11.9999.0009 8.7519.0037 8.3424.0177 7.0689.0827l.0012-.0003zm-.2073 2.3102c1.2568-.0567 1.6334-.0689 4.8492-.0625 3.2157.0063 3.5906.021 4.8495.0827 1.1644.0531 1.7975.2479 2.2183.4117.5576.2168.9556.4758 1.3742.8943.4184.4185.6776.8162.8945 1.3741.1636.4202.3583 1.0537.4113 2.2179.0624 1.2589.0762 1.6338.0825 4.8492.0063 3.2155-.0059 3.5906-.0684 4.8495-.0618 1.1646-.252 1.7977-.4156 2.218-.2167.5579-.4756.9558-.8942 1.3742-.4182.4188-.816.6778-1.3741.8944-.4202.1636-1.0539.3584-2.2185.4116-1.2585.0623-1.6332.0764-4.8494.0827-3.2161.0062-3.5907-.006-4.8497-.0685-1.1644-.0618-1.7977-.252-2.2178-.4156-.558-.2167-.9562-.4756-1.3742-.8943-.4185-.4182-.6778-.816-.8944-1.3742-.1637-.4202-.3585-1.0539-.4117-2.2181-.0623-1.2588-.0764-1.6334-.0826-4.8495-.0062-3.216.0061-3.5907.0685-4.8495.0617-1.1644.252-1.7976.4155-2.2178.2168-.558.4757-.9562.8943-1.3742.4185-.4185.8162-.6778 1.3742-.8944.4203-.1636 1.0539-.3584 2.218-.4117zm9.9233 3.3544a1.4348 1.4348 0 1 0 0 2.8695 1.4348 1.4348 0 0 0 0-2.8695zm-6.7253 1.7197a4.862 4.862 0 1 0 .001 9.7235 4.862 4.862 0 0 0-.001-9.7235zm0 2.139a2.7232 2.7232 0 1 1 0 5.4464 2.7232 2.7232 0 0 1 0-5.4464z" />
    </svg>
  )
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Helper: render link icon by key                                   */
/* ------------------------------------------------------------------ */

function SocialLinkIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case 'globe':
      return <Globe className={className} />
    case 'x':
      return <XIcon className={className} />
    case 'linkedin':
      return <LinkedInIcon className={className} />
    case 'github':
      return <GitHubIcon className={className} />
    case 'instagram':
      return <InstagramIcon className={className} />
    case 'youtube':
      return <YouTubeIcon className={className} />
    case 'discord':
      return <MessageCircle className={className} />
    case 'telegram':
      return <Send className={className} />
    case 'mail':
      return <Mail className={className} />
    default:
      return <Globe className={className} />
  }
}

/* ------------------------------------------------------------------ */
/*  Icon map for entry-type icons in details sidebar                  */
/* ------------------------------------------------------------------ */

const entryTypeIconMap: Record<string, LucideIcon> = {
  rocket: Target, // Rocket not in lucide-react as same name; reuse Target
  briefcase: Briefcase,
  users: Users,
  user: UserCheck,
  microscope: Cpu,
}

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

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

  const coverUrl = extractImageUrl(entry.coverImage)
  const logoUrl = extractImageUrl(entry.logo)
  const isStartupLike = ['startup', 'business', 'consultory', 'research-center'].includes(
    entry.entryType as string,
  )

  const entryIcon = ENTRY_TYPE_CONFIG[entry.entryType as AtlasEntryType]?.icon
  const EntryIcon = entryTypeIconMap[entryIcon] ?? Target

  /* ---------- Details for sidebar ---------- */
  const details: { label: string; value: string | number | undefined; Icon: LucideIcon; ValueIcon?: LucideIcon }[] = [
    { label: 'Categoria', value: ENTRY_TYPE_LABELS[entry.entryType as string], Icon: TagIcon, ValueIcon: EntryIcon },
    { label: 'Fundada', value: entry.foundedYear as number | undefined, Icon: Calendar },
    { label: 'Equipo', value: entry.teamSize as string | undefined, Icon: Users },
    { label: 'Etapa', value: entry.stage as string | undefined, Icon: TrendingUp },
    { label: 'Sector', value: entry.sector as string | undefined, Icon: Building2 },
    { label: 'Miembros', value: entry.memberCount as number | undefined, Icon: Users },
    { label: 'Frecuencia', value: entry.meetupFrequency as string | undefined, Icon: Clock },
    { label: 'Plataforma', value: entry.platform as string | undefined, Icon: Monitor },
    { label: 'Rol', value: entry.role as string | undefined, Icon: UserCheck },
    { label: 'Empresa', value: entry.company as string | undefined, Icon: Building },
    { label: 'Modelo', value: entry.businessModel as string | undefined, Icon: Target },
  ].filter((d) => d.value !== undefined) as { label: string; value: string | number; Icon: LucideIcon; ValueIcon?: LucideIcon }[]

  /* ---------- Links for sidebar ---------- */
  const track = (url: string | undefined) =>
    url ? buildTrackedUrl(url, entry.slug as string) : undefined

  const links: { label: string; url: string | undefined; icon: string }[] = [
    { label: 'Sitio web', url: track(entry.website as string | undefined), icon: 'globe' },
    {
      label: 'X',
      url: track(entry.x ? `https://x.com/${entry.x}` : undefined),
      icon: 'x',
    },
    {
      label: 'LinkedIn',
      url: track(
        entry.linkedin
          ? String(entry.linkedin).startsWith('http')
            ? String(entry.linkedin)
            : `https://linkedin.com/in/${entry.linkedin}`
          : undefined,
      ),
      icon: 'linkedin',
    },
    {
      label: 'GitHub',
      url: track(entry.github ? `https://github.com/${entry.github}` : undefined),
      icon: 'github',
    },
    {
      label: 'Instagram',
      url: track(entry.instagram ? `https://instagram.com/${entry.instagram}` : undefined),
      icon: 'instagram',
    },
    {
      label: 'YouTube',
      url: track(
        entry.youtube
          ? String(entry.youtube).startsWith('http')
            ? String(entry.youtube)
            : `https://youtube.com/@${entry.youtube}`
          : undefined,
      ),
      icon: 'youtube',
    },
    { label: 'Discord', url: track(entry.discord as string | undefined), icon: 'discord' },
    { label: 'Telegram', url: track(entry.telegram as string | undefined), icon: 'telegram' },
    { label: 'Portafolio', url: track(entry.portfolio as string | undefined), icon: 'globe' },
    {
      label: 'Email',
      url: entry.email ? `mailto:${entry.email}` : undefined,
      icon: 'mail',
    },
  ].filter((l) => l.url !== undefined) as { label: string; url: string; icon: string }[]

  /* ---------- Layout mode ---------- */
  const isCompactLayout = links.length === 0 && !coverUrl

  const pageUrl = `${SITE_URL}/${config.slug}/${entry.slug}`

  return (
    <article className="max-w-7xl mx-auto px-4 py-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: safeJsonLd({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Directorio', item: `${SITE_URL}/directorio` },
            { '@type': 'ListItem', position: 3, name: config.labelPlural, item: `${SITE_URL}/${config.slug}` },
            { '@type': 'ListItem', position: 4, name: entry.name },
          ],
        }),
      }} />
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Directorio', href: '/directorio' },
        { label: config.labelPlural, href: `/${config.slug}` },
        { label: entry.name as string },
      ]} />

      {/* Two-layout mode: compact (single column) vs full (grid with sidebar) */}
      <div
        className={
          isCompactLayout
            ? 'max-w-3xl mx-auto'
            : 'grid lg:grid-cols-[1fr_20rem] gap-8'
        }
      >
        {/* ============================================================ */}
        {/*  Main column                                                 */}
        {/* ============================================================ */}
        <div className="space-y-8">
          {/* Cover image with aspect-video */}
          {coverUrl && (
            <div className="relative">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-elevated">
                <Image
                  src={coverUrl}
                  alt={entry.name as string}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority
                />
              </div>
              {/* Logo overlapping cover at bottom-left */}
              {logoUrl && (
                <div className="absolute -bottom-7 left-5">
                  <Image
                    src={logoUrl}
                    alt={`${entry.name as string} logo`}
                    width={56}
                    height={56}
                    className="object-contain rounded-xl border-4 border-card bg-card shadow-lg"
                  />
                </div>
              )}
            </div>
          )}

          {/* Header */}
          <div className={coverUrl && logoUrl ? 'space-y-4 pt-4' : 'space-y-4'}>
            <div className="flex items-center gap-3">
              {/* Logo inline when no cover image */}
              {!coverUrl && logoUrl && (
                <Image
                  src={logoUrl}
                  alt={entry.name as string}
                  width={56}
                  height={56}
                  className="object-contain rounded-xl border border-border bg-card shadow-sm shrink-0"
                />
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <EntryBadge entryType={entry.entryType as AtlasEntryType} />
                  {entry.verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-accent">
                      <BadgeCheck className="w-3 h-3" />
                      Verificado
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-sans font-bold text-primary">
                  {entry.name as string}
                </h1>
              </div>
            </div>

            {entry.tagline && (
              <p className="text-lg text-secondary">{entry.tagline as string}</p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {entry.website && (
                <ExternalLink
                  href={track(entry.website as string)!}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground font-mono font-semibold text-sm rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Visitar sitio
                  <ExternalLinkIcon className="w-4 h-4" />
                </ExternalLink>
              )}
              {/* Hiring badge */}
              {isStartupLike && entry.hiring && (
                entry.hiringUrl ? (
                  <ExternalLink
                    href={entry.hiringUrl as string}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono font-semibold text-sm rounded-lg hover:bg-emerald-500/20 transition-colors"
                  >
                    <Briefcase className="w-4 h-4" />
                    Contratando
                  </ExternalLink>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono font-semibold text-sm rounded-lg">
                    <Briefcase className="w-4 h-4" />
                    Contratando
                  </span>
                )
              )}
              {/* Available for hire badge */}
              {entry.availableForHire && (
                <span className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono font-semibold text-sm rounded-lg">
                  <UserCheck className="w-4 h-4" />
                  Disponible
                </span>
              )}
              {/* Available for mentoring badge */}
              {entry.availableForMentoring && (
                <span className="inline-flex items-center gap-2 px-4 py-2 border border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono font-semibold text-sm rounded-lg">
                  <GraduationCap className="w-4 h-4" />
                  Mentoria
                </span>
              )}
              <ShareButton
                title={`${entry.name as string} | Tech Atlas`}
                url={pageUrl}
              />
            </div>

            {/* Compact layout: inline details strip */}
            {isCompactLayout && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-secondary">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  {entry.city === 'global' ? 'Global' : getCityName(entry.city as string)}
                  {entry.state ? `, ${entry.state as string}` : ''}
                </span>
                {details
                  .filter((d) => d.label !== 'Categoria')
                  .map((detail) => (
                    <span key={detail.label} className="inline-flex items-center gap-1.5">
                      <detail.Icon className="w-3.5 h-3.5 text-accent" />
                      {detail.label}:{' '}
                      <span className="font-mono text-primary">{detail.value}</span>
                    </span>
                  ))}
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-secondary hover:text-accent transition-colors"
                  >
                    <SocialLinkIcon icon={link.icon} className="w-3.5 h-3.5" />
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* About / Body */}
          {entry.body && (
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6">
              <h2 className="font-mono text-xs text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-accent" />
                Acerca de
              </h2>
              <div className="prose prose-sm dark:prose-invert prose-p:text-secondary prose-headings:text-primary prose-a:text-accent max-w-none">
                <RichText data={entry.body as any} />
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6">
              <h2 className="font-mono text-xs text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-accent" />
                Etiquetas
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2 py-1 rounded bg-accent/10 text-accent border border-accent/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills (person type) */}
          {skills.length > 0 && (
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6">
              <h2 className="font-mono text-xs text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-accent" />
                Habilidades
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-mono px-2 py-1 rounded bg-accent/10 text-accent border border-accent/20"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {services.length > 0 && (
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6">
              <h2 className="font-mono text-xs text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <Cog className="w-4 h-4 text-accent" />
                Servicios
              </h2>
              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-mono px-2 py-1 rounded bg-elevated text-secondary border border-border"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6">
              <h2 className="font-mono text-xs text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent" />
                Tecnologias
              </h2>
              <div className="flex flex-wrap gap-2">
                {technologies.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono px-2 py-1 rounded bg-elevated text-secondary border border-border"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Focus areas (community) — blue color coding */}
          {focusAreas.length > 0 && (
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6">
              <h2 className="font-mono text-xs text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                Areas de enfoque
              </h2>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((a) => (
                  <span
                    key={a}
                    className="text-xs font-mono px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/*  Sidebar (only in full layout)                               */}
        {/* ============================================================ */}
        {!isCompactLayout && (
          <div className="space-y-4">
            {/* Details card */}
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-5">
              <h2 className="font-mono text-xs text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <LayoutList className="w-4 h-4 text-accent" />
                Detalles
              </h2>
              <div className="space-y-3">
                {/* Location always shown */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted" />
                    Ubicacion
                  </span>
                  <span className="text-sm font-mono text-primary">
                    {entry.city === 'global' ? 'Global' : getCityName(entry.city as string)}
                    {entry.state ? `, ${entry.state as string}` : ''}
                  </span>
                </div>
                {details.map((detail) => (
                  <div key={detail.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted flex items-center gap-1.5">
                      <detail.Icon className="w-3.5 h-3.5 text-muted" />
                      {detail.label}
                    </span>
                    <span className="text-sm font-mono text-primary flex items-center gap-1.5">
                      {detail.ValueIcon && (
                        <detail.ValueIcon className="w-3.5 h-3.5 text-accent" />
                      )}
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links card */}
            {links.length > 0 && (
              <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-5">
                <h2 className="font-mono text-xs text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-accent" />
                  Enlaces
                </h2>
                <div className="space-y-2">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors"
                    >
                      <SocialLinkIcon icon={link.icon} className="w-4 h-4" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-primary mb-4">Mira mas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((s) => (
              <EntryCard
                key={String(s.id)}
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
    </article>
  )
}
