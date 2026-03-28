import Link from 'next/link'
import { EntryBadge } from './EntryBadge'
import { Tag } from '@/components/ui/Tag'
import { getEntryUrl, getCityName, type AtlasEntryType } from '@/config'

interface EntryCardProps {
  slug: string
  name: string
  tagline?: string
  entryType: AtlasEntryType
  logo?: { url: string; alt?: string } | null
  coverImage?: { url: string; alt?: string } | null
  city: string
  tags?: Array<{ tag: string }> | string[]
}

export function EntryCard({ slug, name, tagline, entryType, logo, coverImage, city, tags }: EntryCardProps) {
  const href = getEntryUrl(entryType, slug)
  const displayTags = (tags || []).slice(0, 3).map((t) => (typeof t === 'string' ? t : t.tag))
  const coverUrl = typeof coverImage === 'object' && coverImage?.url ? coverImage.url : null
  const logoUrl = typeof logo === 'object' && logo?.url ? logo.url : null

  return (
    <Link href={href} className="group block bg-card/90 backdrop-blur-sm border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-colors">
      <div className="relative h-36 bg-elevated overflow-hidden">
        {coverUrl ? (
          <img src={coverUrl} alt={name} className="w-full h-full object-cover" loading="lazy" />
        ) : logoUrl ? (
          <div className="flex items-center justify-center h-full p-6">
            <img src={logoUrl} alt={name} className="max-h-20 max-w-[80%] object-contain" loading="lazy" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted text-3xl font-bold">{name.charAt(0)}</div>
        )}
        <div className="absolute top-2 left-2"><EntryBadge entryType={entryType} /></div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-primary text-sm line-clamp-1">{name}</h3>
        {tagline && <p className="text-muted text-xs mt-1 line-clamp-2">{tagline}</p>}
        <p className="text-muted text-2xs font-mono mt-2">{getCityName(city)}</p>
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {displayTags.map((tag) => <Tag key={tag} className="text-[10px]">{tag}</Tag>)}
          </div>
        )}
      </div>
    </Link>
  )
}
