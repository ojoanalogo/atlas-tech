import { cache } from 'react'
import { db } from '@/db'
import { sql } from 'drizzle-orm'
import { CITY_IDS, emptyTypeCounts, type AtlasEntryType } from '@/config'

interface EntryCountRow {
  entry_type: string
  city: string
  count: number
}

export interface EntryCounts {
  byType: Record<string, number>
  byCity: Record<string, number>
  byCityAndType: Record<string, Record<AtlasEntryType, number>>
  total: number
}

export const getEntryCounts = cache(async (): Promise<EntryCounts> => {
  const result = await db.execute<EntryCountRow>(
    sql`SELECT entry_type, city, COUNT(*)::int AS count
        FROM payload.entries
        WHERE _status = 'published'
        GROUP BY entry_type, city`
  )

  const byType: Record<string, number> = { ...emptyTypeCounts() }
  const byCity: Record<string, number> = {}
  const byCityAndType: Record<string, Record<AtlasEntryType, number>> = {}
  let total = 0

  for (const row of result.rows) {
    const { entry_type, city, count } = row
    total += count

    // Aggregate by type
    byType[entry_type] = (byType[entry_type] || 0) + count

    // Aggregate by city, distributing "global" entries across all cities
    if (city === 'global') {
      for (const id of CITY_IDS) {
        byCity[id] = (byCity[id] || 0) + count
        if (!byCityAndType[id]) byCityAndType[id] = emptyTypeCounts()
        byCityAndType[id][entry_type as AtlasEntryType] =
          (byCityAndType[id][entry_type as AtlasEntryType] || 0) + count
      }
    } else {
      byCity[city] = (byCity[city] || 0) + count
      if (!byCityAndType[city]) byCityAndType[city] = emptyTypeCounts()
      byCityAndType[city][entry_type as AtlasEntryType] =
        (byCityAndType[city][entry_type as AtlasEntryType] || 0) + count
    }
  }

  return { byType, byCity, byCityAndType, total }
})
