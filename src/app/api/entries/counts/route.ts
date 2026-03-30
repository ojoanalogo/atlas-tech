import { getPayloadClient } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'entries',
      where: { _status: { equals: 'published' } },
      limit: 0,
      pagination: false,
    })

    const byCity: Record<string, number> = {}
    const byType: Record<string, number> = {}

    for (const doc of result.docs) {
      const city = doc.city as string
      const type = doc.entryType as string
      byCity[city] = (byCity[city] || 0) + 1
      byType[type] = (byType[type] || 0) + 1
    }

    return NextResponse.json({
      byCity,
      byType,
      total: result.totalDocs,
    })
  } catch (error) {
    console.error('Entries counts API failed:', error)
    return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 })
  }
}
