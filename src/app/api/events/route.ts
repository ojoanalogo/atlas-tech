import { getPayloadClient } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'events',
    where: { _status: { equals: 'published' } },
    limit: parseInt(searchParams.get('limit') || '200'),
    sort: searchParams.get('sort') || 'date',
  })
  return NextResponse.json(result)
}
