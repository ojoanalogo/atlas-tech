import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-helpers'
import { getPayloadClient } from '@/lib/payload'

/** Allowlisted fields that callers may set on job submissions */
const JOB_ALLOWED_FIELDS = [
  'title', 'slug', 'description', 'type', 'modality', 'city',
  'compensation', 'tags', 'contactUrl', 'entry', 'expiresAt',
] as const

function pickAllowedFields(body: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of JOB_ALLOWED_FIELDS) {
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

    if (!body.title || !body.type || !body.modality || !body.contactUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type, modality, contactUrl' },
        { status: 400 },
      )
    }

    const payload = await getPayloadClient()
    const data = pickAllowedFields(body)

    const job = await payload.create({
      collection: 'jobs',
      data: {
        ...data,
        postedBy: session.user.id,
        _status: 'draft',
      } as Parameters<typeof payload.create<'jobs'>>[0]['data'],
    })
    return NextResponse.json({ success: true, id: job.id })
  } catch (error) {
    console.error('Job submission failed:', error)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
