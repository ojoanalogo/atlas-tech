import { getPayloadClient } from '@/lib/payload'
import { db } from '@/db'
import { sql } from 'drizzle-orm'
import { NextResponse, type NextRequest } from 'next/server'
import { withRateLimit } from '@/lib/rate-limit'
import type { Where } from 'payload'

const SORT_MAP: Record<string, string> = {
  'name-asc': 'name',
  'name-desc': '-name',
  'date-desc': '-publishDate',
  'date-asc': 'publishDate',
}

export async function GET(request: NextRequest) {
  const limited = withRateLimit(request, { limit: 60, windowMs: 60 * 1000, keyPrefix: 'api-entries' })
  if (limited) return limited

  try {
    const { searchParams } = request.nextUrl
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '18', 10)), 100)
    const sortKey = searchParams.get('sort') || 'date-desc'
    const sort = SORT_MAP[sortKey] || '-publishDate'
    const entryType = searchParams.get('entryType')
    const city = searchParams.get('city')

    const where: Where = {
      _status: { equals: 'published' },
    }
    if (entryType) where.entryType = { equals: entryType }
    if (city) where.city = { equals: city }

    const payload = await getPayloadClient()

    // Random sort: use SQL ORDER BY RANDOM() for efficiency
    if (sortKey === 'random') {
      const conditions = [sql`_status = 'published'`]
      if (entryType) conditions.push(sql`entry_type = ${entryType}`)
      if (city) conditions.push(sql`city = ${city}`)

      const whereClause = sql.join(conditions, sql` AND `)

      const result = await db.execute<{ id: number }>(
        sql`SELECT id FROM payload.entries WHERE ${whereClause} ORDER BY RANDOM() LIMIT ${limit}`
      )

      const ids = result.rows.map((r) => r.id)

      if (ids.length === 0) {
        return NextResponse.json({
          docs: [],
          totalDocs: 0,
          totalPages: 1,
          page: 1,
          hasNextPage: false,
          hasPrevPage: false,
        })
      }

      // Fetch full documents by IDs via Payload
      const fullResult = await payload.find({
        collection: 'entries',
        where: { id: { in: ids } },
        limit: ids.length,
        pagination: false,
      })

      return NextResponse.json({
        docs: fullResult.docs,
        totalDocs: fullResult.docs.length,
        totalPages: 1,
        page: 1,
        hasNextPage: false,
        hasPrevPage: false,
      })
    }

    const result = await payload.find({
      collection: 'entries',
      where,
      page,
      limit,
      sort,
    })

    return NextResponse.json({
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    })
  } catch (error) {
    console.error('Entries API failed:', error)
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
  }
}
