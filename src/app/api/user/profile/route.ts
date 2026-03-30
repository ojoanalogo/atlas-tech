import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-helpers'
import { db } from '@/db'
import { profiles } from '@/db/schema/profiles'
import { eq } from 'drizzle-orm'

export async function GET() {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  return NextResponse.json(profile)
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const data = {
    userId: session.user.id,
    name: body.name,
    title: body.title || null,
    company: body.company || null,
    email: body.email || null,
    phone: body.phone || null,
    website: body.website || null,
    photo: body.photo || null,
    linkedin: body.linkedin || null,
    x: body.x || null,
    github: body.github || null,
    updatedAt: new Date(),
  }

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
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
