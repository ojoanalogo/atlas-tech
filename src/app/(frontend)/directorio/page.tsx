import type { Metadata } from 'next'
import DirectoryFilter from '@/components/entries/DirectoryFilter'
import { SINALOA_CITIES } from '@/config'

export const metadata: Metadata = {
  title: 'Directorio',
  description: 'Explora el directorio completo del ecosistema tecnológico de Sinaloa. Startups, consultorías, comunidades y talento tech.',
}

const staticCities = SINALOA_CITIES.map((m) => ({ id: m.id, name: m.name, count: 0 }))

export default function DirectoryPage() {
  return (
    <section className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <DirectoryFilter cities={staticCities} pageSize={18} />
      </div>
    </section>
  )
}
