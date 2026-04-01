import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-helpers'
import { db } from '@/db'
import { profiles } from '@/db/schema/profiles'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { withRateLimit } from '@/lib/rate-limit'

const profileSchema = z.object({
  title: z.string().max(100).optional().default(''),
  company: z.string().max(100).optional().default(''),
  phone: z.string().max(20).optional().default(''),
  website: z.string().url().max(200).or(z.literal('')).optional().default(''),
  linkedin: z.string().max(200).optional().default(''),
  x: z.string().max(200).optional().default(''),
  github: z.string().max(200).optional().default(''),
})

export async function GET() {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))

  return NextResponse.json({
    ...(profile ?? {}),
    name: session.user.name,
    email: session.user.email,
    photo: session.user.image,
  })
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const limited = withRateLimit(request, { limit: 20, windowMs: 15 * 60 * 1000, keyPrefix: 'user-profile' }, session.user.id)
  if (limited) return limited

  const body = await request.json()

  const parsed = profileSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 })
  }

  const validated = parsed.data

  const data = {
    userId: session.user.id,
    title: validated.title || null,
    company: validated.company || null,
    phone: validated.phone || null,
    website: validated.website || null,
    linkedin: validated.linkedin || null,
    x: validated.x || null,
    github: validated.github || null,
    updatedAt: new Date(),
  }

  const [profile] = await db
    .insert(profiles)
    .values({ ...data, createdAt: new Date() })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: data,
    })
    .returning()

  return NextResponse.json(profile)
}
