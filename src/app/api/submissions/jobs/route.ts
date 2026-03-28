import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-helpers'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  if (!body.title || !body.type || !body.modality || !body.contactUrl) {
    return NextResponse.json(
      { error: 'Missing required fields: title, type, modality, contactUrl' },
      { status: 400 },
    )
  }

  const payload = await getPayloadClient()

  try {
    const job = await payload.create({
      collection: 'jobs',
      data: {
        ...body,
        postedBy: session.user.id,
        _status: 'draft',
      },
    })
    return NextResponse.json({ success: true, id: job.id })
  } catch (error) {
    console.error('Job submission failed:', error)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
