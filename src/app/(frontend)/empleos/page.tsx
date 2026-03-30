import type { Metadata } from 'next'
import { SectionHeading } from '@/components/ui/SectionHeading'
import EmpleosContent from './EmpleosContent'

export const metadata: Metadata = {
  title: 'Empleos',
  description: 'Ofertas de empleo y oportunidades en el ecosistema tech de Sinaloa.',
}

export default function EmpleosPage() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading>Empleos</SectionHeading>
        <h1 className="text-3xl font-bold text-primary mb-2">Bolsa de trabajo</h1>
        <p className="text-secondary text-sm mb-8">Oportunidades en el ecosistema tech de Sinaloa.</p>
        <EmpleosContent />
      </div>
    </section>
  )
}
