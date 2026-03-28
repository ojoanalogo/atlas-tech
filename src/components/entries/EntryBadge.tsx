import { cn } from '@/lib/utils'
import { ENTRY_TYPE_CONFIG, type AtlasEntryType } from '@/config'

interface EntryBadgeProps {
  entryType: AtlasEntryType
  className?: string
}

export function EntryBadge({ entryType, className }: EntryBadgeProps) {
  const config = ENTRY_TYPE_CONFIG[entryType]
  if (!config) return null
  return (
    <span className={cn('inline-flex items-center gap-1 text-2xs font-mono px-2 py-0.5 rounded-full border', config.badgeColor, className)}>
      {config.label}
    </span>
  )
}
