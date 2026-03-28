import { getPayload } from 'payload'
import config from '@payload-config'
import type { AtlasEntryType } from '@/config'

export async function getPayloadClient() {
  return getPayload({ config })
}

export async function getPublishedEntries(limit = 200) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'entries',
    where: { _status: { equals: 'published' } },
    limit,
    sort: '-publishDate',
  })
}

export async function getEntriesByType(entryType: AtlasEntryType, limit = 200) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'entries',
    where: {
      _status: { equals: 'published' },
      entryType: { equals: entryType },
    },
    limit,
    sort: '-publishDate',
  })
}

export async function getEntryBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'entries',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function getFeaturedEntries() {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'entries',
    where: {
      _status: { equals: 'published' },
      featured: { equals: true },
    },
    limit: 10,
    sort: 'name',
  })
}

export async function getPublishedNews(limit = 20) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'news',
    where: { _status: { equals: 'published' } },
    limit,
    sort: '-publishDate',
  })
}

export async function getNewsBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'news',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function getActiveJobs(limit = 50) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'jobs',
    where: {
      _status: { equals: 'published' },
      expiresAt: { greater_than: new Date().toISOString() },
    },
    limit,
    sort: '-createdAt',
  })
}

export async function getJobBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'jobs',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function getPublishedEvents(limit = 100) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'events',
    where: { _status: { equals: 'published' } },
    limit,
    sort: 'date',
  })
}

export async function getUpcomingEvents(limit = 5) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'events',
    where: {
      _status: { equals: 'published' },
      date: { greater_than_equal: new Date().toISOString().split('T')[0] },
    },
    limit,
    sort: 'date',
  })
}
