import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { AtlasEntryType } from '@/config'

export async function getPayloadClient() {
  return getPayload({ config })
}

export const getPublishedEntries = cache(async (limit = 200) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'entries',
    where: { _status: { equals: 'published' } },
    limit,
    sort: '-publishDate',
  })
})

export const getEntriesByType = cache(async (entryType: AtlasEntryType, limit = 200) => {
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
})

export const getEntryBySlug = cache(async (slug: string) => {
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
})

export const getFeaturedEntries = cache(async () => {
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
})

export const getPublishedNews = cache(async (limit = 20) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'news',
    where: { _status: { equals: 'published' } },
    limit,
    sort: '-publishDate',
  })
})

export const getNewsBySlug = cache(async (slug: string) => {
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
})

export const getActiveJobs = cache(async (limit = 50) => {
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
})

export const getJobBySlug = cache(async (slug: string) => {
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
})

export const getPublishedEvents = cache(async (limit = 100) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'events',
    where: { _status: { equals: 'published' } },
    limit,
    sort: 'date',
  })
})

export const getUpcomingEvents = cache(async (limit = 5) => {
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
})
