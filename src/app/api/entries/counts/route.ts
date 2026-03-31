import { getEntryCounts } from '@/lib/entry-counts'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { byCity, byType, total } = await getEntryCounts()

    return NextResponse.json({
      byCity,
      byType,
      total,
    })
  } catch (error) {
    console.error('Entries counts API failed:', error)
    return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 })
  }
}
