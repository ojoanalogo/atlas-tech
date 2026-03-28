import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-helpers'
import { getPayloadClient } from '@/lib/payload'

export async function GET() {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'entries',
    where: { owner: { equals: session.user.id } },
    limit: 50,
    sort: '-updatedAt',
    draft: true,
  })

  return NextResponse.json(result)
}
