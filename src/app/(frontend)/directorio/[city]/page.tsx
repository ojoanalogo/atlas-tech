import type { Metadata } from 'next'
import { getPublishedEntries } from '@/lib/payload'
import { buildCityOptions } from '@/lib/utils'
import { ALL_CITY_IDS, getCityName } from '@/config'
import DirectoryFilter from '@/components/entries/DirectoryFilter'
import { DirectoryGrid } from '@/components/entries/DirectoryGrid'

export async function generateStaticParams() {
  return ALL_CITY_IDS.filter((id) => id !== 'global').map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const cityName = getCityName(city)
  return {
    title: `Directorio — ${cityName}`,
    description: `Empresas, startups, comunidades y talento tech en ${cityName}, Sinaloa.`,
  }
}

export default async function CityDirectoryPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const result = await getPublishedEntries()
  const entries = result.docs
  const cities = buildCityOptions(entries)

  return (
    <section className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <DirectoryFilter
          cities={cities}
          totalCount={entries.length}
          initialCity={city}
          pageSize={18}
        >
          <DirectoryGrid entries={entries} />
        </DirectoryFilter>
      </div>
    </section>
  )
}
