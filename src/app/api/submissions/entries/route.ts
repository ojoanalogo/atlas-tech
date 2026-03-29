import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-helpers'
import { getPayloadClient } from '@/lib/payload'

/** Allowlisted fields that callers may set on entry submissions */
const ENTRY_ALLOWED_FIELDS = [
  'entryType', 'name', 'slug', 'tagline', 'city', 'state', 'country',
  'logo', 'coverImage', 'tags', 'website', 'x', 'instagram', 'linkedin',
  'github', 'youtube', 'publishDate', 'body', 'foundedYear', 'stage',
  'teamSize', 'sector', 'services', 'technologies', 'hiring', 'hiringUrl',
  'businessModel', 'memberCount', 'meetupFrequency', 'discord', 'telegram',
  'platform', 'focusAreas', 'role', 'company', 'skills', 'availableForHire',
  'availableForMentoring', 'email', 'portfolio',
] as const

function pickAllowedFields(body: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of ENTRY_ALLOWED_FIELDS) {
    if (key in body) {
      result[key] = body[key]
    }
  }
  return result
}

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    if (!body.entryType || !body.name || !body.city) {
      return NextResponse.json(
        { error: 'Missing required fields: entryType, name, city' },
        { status: 400 },
      )
    }

    const payload = await getPayloadClient()
    const data = pickAllowedFields(body)

    const entry = await payload.create({
      collection: 'entries',
      data: {
        ...data,
        owner: session.user.id,
        _status: 'draft',
      } as Parameters<typeof payload.create<'entries'>>[0]['data'],
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

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing entry ID' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    const existing = await payload.findByID({ collection: 'entries', id })
    if (!existing || existing.owner !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = pickAllowedFields(body)

    await payload.update({
      collection: 'entries',
      id,
      data: {
        ...data,
        _status: 'draft',
      } as Parameters<typeof payload.update<'entries'>>[0]['data'],
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Entry update failed:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
