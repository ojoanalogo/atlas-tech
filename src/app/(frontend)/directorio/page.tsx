import type { Metadata } from 'next'
import { getPublishedEntries } from '@/lib/payload'
import { buildCityOptions } from '@/lib/utils'
import { ENTRY_TYPE_CONFIG } from '@/config'
import DirectoryFilter from '@/components/entries/DirectoryFilter'
import { DirectoryGrid } from '@/components/entries/DirectoryGrid'

export const metadata: Metadata = {
  title: 'Directorio',
}

export default async function DirectoryPage() {
  const result = await getPublishedEntries()
  const entries = result.docs
  const cities = buildCityOptions(entries)

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
          totalCount={entries.length}
          pageSize={18}
        >
          <DirectoryGrid entries={entries} />
        </DirectoryFilter>
      </div>
    </section>
  )
}
