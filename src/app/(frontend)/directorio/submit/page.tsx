import type { Metadata } from 'next'
import SubmitWizard from '@/components/forms/SubmitWizard'
import { SINALOA_CITIES } from '@/config'

export const metadata: Metadata = {
  title: 'Agregar Proyecto',
}

export default function SubmitPage() {
  const cities = [
    { id: 'global', name: 'Global (sin ubicación específica)' },
    ...SINALOA_CITIES.map((m) => ({ id: m.id, name: m.name })),
  ]

  return (
    <section className="py-4 px-4">
      <div className="max-w-2xl mx-auto">
        <nav className="text-xs font-mono text-muted mb-6 uppercase">
          <a href="/" className="hover:text-accent transition-colors">Inicio</a>
          <span className="mx-2">/</span>
          <a href="/directorio" className="hover:text-accent transition-colors">Directorio</a>
          <span className="mx-2">/</span>
          <span className="text-primary">Agregar proyecto</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-sans font-bold text-primary mb-2">Agregar proyecto</h1>
        <p className="text-secondary mb-8">
          Registra tu startup, consultora, comunidad o perfil en el directorio tech de Sinaloa.
        </p>

        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 md:p-8">
          <SubmitWizard cities={cities} />
        </div>
      </div>
    </section>
  )
}
