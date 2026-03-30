import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-helpers'
import { getPayloadClient } from '@/lib/payload'

export async function GET() {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'jobs',
      where: { postedBy: { equals: session.user.id } },
      limit: 50,
      sort: '-updatedAt',
      draft: true,
      select: {
        title: true,
        type: true,
        modality: true,
        city: true,
        slug: true,
        _status: true,
        moderationNote: true,
        expiresAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('User jobs fetch failed:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}
