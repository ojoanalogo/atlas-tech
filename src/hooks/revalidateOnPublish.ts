import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook } from 'payload'
import { ENTRY_TYPE_CONFIG, type AtlasEntryType } from '../config'

/**
 * Revalidate static pages when a document's publish status changes.
 * Attached to entries, news, and events collections.
 */
export const revalidateEntry: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  collection,
}) => {
  const wasPublished = previousDoc?._status === 'published'
  const isPublished = doc._status === 'published'

  // Only revalidate when publish status changes
  if (!wasPublished && !isPublished) return doc

  if (collection.slug === 'entries') {
    const entryType = doc.entryType as AtlasEntryType
    const categorySlug = ENTRY_TYPE_CONFIG[entryType]?.slug

    revalidatePath('/')
    revalidatePath('/directorio')
    if (categorySlug) {
      revalidatePath(`/${categorySlug}`)
      if (doc.slug) revalidatePath(`/${categorySlug}/${doc.slug}`)
    }
    if (doc.city) revalidatePath(`/directorio/${doc.city}`)
  }

  if (collection.slug === 'news') {
    revalidatePath('/')
    revalidatePath('/noticias')
    if (doc.slug) revalidatePath(`/noticias/${doc.slug}`)
  }

  if (collection.slug === 'events') {
    revalidatePath('/')
    revalidatePath('/eventos')
  }

  // Also revalidate by tag for more granular control
  revalidateTag(collection.slug)

  return doc
}
