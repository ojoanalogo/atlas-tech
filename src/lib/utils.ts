import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SITE_URL, CITY_IDS, SINALOA_CITIES, emptyTypeCounts, type AtlasEntryType } from '@/config'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildTrackedUrl(url: string, slug: string, medium = 'directorio'): string {
  try {
    const u = new URL(url)
    u.searchParams.set('utm_source', new URL(SITE_URL).hostname)
    u.searchParams.set('utm_medium', medium)
    u.searchParams.set('utm_content', slug)
    return u.toString()
  } catch {
    return url
  }
}

/** Flatten Payload array fields: [{tag: "x"}, {tag: "y"}] → ["x", "y"] */
export function flattenArray<T>(arr: Array<Record<string, T>> | undefined | null, key: string): T[] {
  if (!arr) return []
  return arr.map((item) => item[key]).filter(Boolean)
}

export function groupByCity(entries: Array<{ city: string }>): Record<string, number> {
  const result: Record<string, number> = {}
  for (const entry of entries) {
    const city = entry.city
    if (city === 'global') {
      for (const id of CITY_IDS) {
        result[id] = (result[id] || 0) + 1
      }
    } else {
      result[city] = (result[city] || 0) + 1
    }
  }
  return result
}

export function countByType(entries: Array<{ entryType: string }>): Record<AtlasEntryType, number> {
  return entries.reduce(
    (acc, entry) => {
      const type = entry.entryType as AtlasEntryType
      acc[type] = (acc[type] || 0) + 1
      return acc
    },
    emptyTypeCounts(),
  )
}

export function countByTypeAndCity(
  entries: Array<{ city: string; entryType: string }>,
): Record<string, Record<AtlasEntryType, number>> {
  const result: Record<string, Record<AtlasEntryType, number>> = {}
  for (const entry of entries) {
    const city = entry.city
    const type = entry.entryType as AtlasEntryType
    if (city === 'global') {
      for (const id of CITY_IDS) {
        if (!result[id]) result[id] = emptyTypeCounts()
        result[id][type] = (result[id][type] || 0) + 1
      }
    } else {
      if (!result[city]) result[city] = emptyTypeCounts()
      result[city][type] = (result[city][type] || 0) + 1
    }
  }
  return result
}

export interface CityOption {
  id: string
  name: string
  count: number
}

export function buildCityOptions(entries: Array<{ city: string }>): CityOption[] {
  const counts: Record<string, number> = {}
  for (const entry of entries) {
    counts[entry.city] = (counts[entry.city] || 0) + 1
  }
  const globalCount = counts['global'] || 0
  return [
    ...(globalCount > 0 ? [{ id: 'global', name: 'Global', count: globalCount }] : []),
    ...SINALOA_CITIES.map((m) => ({
      id: m.id,
      name: m.name,
      count: counts[m.id] || 0,
    })),
  ]
}

/** Convert an ISO date string to a Spanish relative time string */
export function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return 'hace unos minutos'
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`
  if (diffDays < 30) return `hace ${diffDays} día${diffDays === 1 ? '' : 's'}`
  return new Date(dateStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Safely serialize data for JSON-LD script blocks, preventing XSS via </script> injection */
export function safeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** Convert an ISO expiration date to a Spanish countdown/elapsed string */
export function expirationLabel(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = then - now
  const diffDays = Math.floor(Math.abs(diffMs) / 86400000)

  if (diffMs > 0) return `Expira en ${diffDays} día${diffDays === 1 ? '' : 's'}`
  return `Expiró hace ${diffDays} día${diffDays === 1 ? '' : 's'}`
}
