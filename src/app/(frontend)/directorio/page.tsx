import type { Metadata } from 'next'
import { getPublishedEntries } from '@/lib/payload'
import { buildCityOptions } from '@/lib/utils'
import DirectoryFilter from '@/components/entries/DirectoryFilter'

export const metadata: Metadata = {
  title: 'Directorio',
  description: 'Explora el directorio completo del ecosistema tecnológico de Sinaloa. Startups, consultorías, comunidades y talento tech.',
}

export default async function DirectoryPage() {
  const result = await getPublishedEntries()
  const entries = result.docs
  const cities = buildCityOptions(entries)

  return (
    <section className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <DirectoryFilter entries={entries} cities={cities} pageSize={18} />
      </div>
    </section>
  )
}
