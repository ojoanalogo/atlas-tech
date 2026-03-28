import { EntryCard } from './EntryCard'

interface DirectoryGridProps {
  entries: Array<Record<string, unknown>>
}

export function DirectoryGrid({ entries }: DirectoryGridProps) {
  return (
    <div id="entries-grid" className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {entries.map((entry) => (
        <div
          key={entry.id as string}
          className="entry-item"
          data-type={entry.entryType as string}
          data-city={entry.city as string}
          data-name={(entry.name as string).toLowerCase()}
          data-date={entry.publishDate ? (entry.publishDate as string).slice(0, 10) : ''}
        >
          <EntryCard
            slug={entry.slug as string}
            name={entry.name as string}
            tagline={entry.tagline as string | undefined}
            entryType={entry.entryType as any}
            logo={entry.logo as any}
            coverImage={entry.coverImage as any}
            city={entry.city as string}
            tags={entry.tags as any}
          />
        </div>
      ))}
    </div>
  )
}
