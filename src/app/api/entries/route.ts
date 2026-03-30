import { getPayloadClient } from '@/lib/payload'
import { NextResponse, type NextRequest } from 'next/server'

const SORT_MAP: Record<string, string> = {
  'name-asc': 'name',
  'name-desc': '-name',
  'date-desc': '-publishDate',
  'date-asc': 'publishDate',
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '18', 10)), 100)
    const sortKey = searchParams.get('sort') || 'date-desc'
    const sort = SORT_MAP[sortKey] || '-publishDate'
    const entryType = searchParams.get('entryType')
    const city = searchParams.get('city')

    const where: Record<string, unknown> = {
      _status: { equals: 'published' },
    }
    if (entryType) where.entryType = { equals: entryType }
    if (city) where.city = { equals: city }

    const payload = await getPayloadClient()
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
