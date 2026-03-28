import type { Metadata } from 'next'
import { getPublishedEntries } from '@/lib/payload'
import { buildCityOptions } from '@/lib/utils'
import { ENTRY_TYPE_CONFIG, URL_CATEGORY_MAP, type AtlasEntryType } from '@/config'
import DirectoryFilter from '@/components/entries/DirectoryFilter'
import { DirectoryGrid } from '@/components/entries/DirectoryGrid'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return Object.values(ENTRY_TYPE_CONFIG).map((c) => ({ category: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const entryType = URL_CATEGORY_MAP[category]
  if (!entryType) return { title: 'Not Found' }
  return { title: ENTRY_TYPE_CONFIG[entryType].labelPlural }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const entryType = URL_CATEGORY_MAP[category] as AtlasEntryType | undefined
  if (!entryType) notFound()

  const result = await getPublishedEntries()
  const allEntries = result.docs
  const categoryEntries = allEntries.filter((e) => e.entryType === entryType)
  const cities = buildCityOptions(categoryEntries)

  const typeLabels: Record<string, string> = Object.fromEntries(
    Object.entries(ENTRY_TYPE_CONFIG).map(([k, v]) => [k, v.labelPlural]),
  )
  const typeIcons: Record<string, string> = Object.fromEntries(
    Object.entries(ENTRY_TYPE_CONFIG).map(([k, v]) => [k, v.icon]),
  )

  return (
    <section className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <DirectoryFilter
          typeLabels={typeLabels}
          typeIcons={typeIcons}
          cities={cities}
          totalCount={allEntries.length}
          initialType={entryType}
          pageSize={18}
        >
          <DirectoryGrid entries={allEntries} />
        </DirectoryFilter>
      </div>
    </section>
  )
}
