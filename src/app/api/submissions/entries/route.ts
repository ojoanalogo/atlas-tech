import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-helpers'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const payload = await getPayloadClient()

  if (!body.entryType || !body.name || !body.city) {
    return NextResponse.json(
      { error: 'Missing required fields: entryType, name, city' },
      { status: 400 },
    )
  }

  try {
    const entry = await payload.create({
      collection: 'entries',
      data: {
        ...body,
        owner: session.user.id,
        _status: 'draft',
      },
    })
    return NextResponse.json({ success: true, id: entry.id })
  } catch (error) {
    console.error('Entry submission failed:', error)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, ...updates } = body

  if (!id) {
    return NextResponse.json({ error: 'Missing entry ID' }, { status: 400 })
  }

  const payload = await getPayloadClient()

  const existing = await payload.findByID({ collection: 'entries', id })
  if (!existing || existing.owner !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await payload.update({
      collection: 'entries',
      id,
      data: {
        ...updates,
        _status: 'draft',
      },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Entry update failed:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
