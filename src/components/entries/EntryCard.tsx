import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { EntryBadge } from './EntryBadge'
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
    <Link href={href} className="group flex flex-col h-full bg-card/90 backdrop-blur-sm border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-colors">
      <div className="relative h-36 bg-elevated overflow-hidden">
        {coverUrl ? (
          <Image src={coverUrl} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" />
        ) : logoUrl ? (
          <div className="flex items-center justify-center h-full p-6 bg-accent">
            <Image src={logoUrl} alt={name} width={80} height={80} className="max-h-20 max-w-[80%] object-contain" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-accent text-elevated text-5xl font-mono font-bold">{name.charAt(0)}</div>
        )}
        {coverUrl && logoUrl && (
          <div className="absolute bottom-2 right-2 border border-border rounded-md bg-card p-0.5">
            <Image src={logoUrl} alt={`${name} logo`} width={40} height={40} className="w-10 h-10 object-contain" />
          </div>
        )}
        <div className="absolute top-2 left-2"><EntryBadge entryType={entryType} /></div>
      </div>
      <div className="p-4 space-y-2 flex-1 flex flex-col">
        <h3 className="font-semibold text-primary text-sm group-hover:text-accent transition-colors">{name}</h3>
        {tagline && <p className="text-secondary text-sm mt-1 line-clamp-2">{tagline}</p>}
        <p className="text-muted text-2xs font-mono mt-2 flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0" />{getCityName(city)}</p>
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {displayTags.map((tag) => <span key={tag} className="text-2xs font-mono px-1.5 py-0.5 rounded bg-elevated text-muted">{tag}</span>)}
          </div>
        )}
      </div>
    </Link>
  )
}
