import type { Metadata } from 'next'
import Link from 'next/link'
import { getActiveJobs } from '@/lib/payload'
import { getCityName, JOB_TYPE_LABELS, MODALITY_LABELS } from '@/config'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { flattenArray } from '@/lib/utils'
import { MapPin, Clock, Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Empleos',
  description: 'Ofertas de empleo y oportunidades en el ecosistema tech de Sinaloa.',
}

export const dynamic = 'force-dynamic'

export default async function EmpleosPage() {
  const result = await getActiveJobs()
  const jobs = result.docs

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading>Empleos</SectionHeading>
        <h1 className="text-3xl font-bold text-primary mb-2">Bolsa de trabajo</h1>
        <p className="text-secondary text-sm mb-8">Oportunidades en el ecosistema tech de Sinaloa.</p>

        {jobs.length === 0 && (
          <p className="text-muted text-sm">No hay ofertas de empleo activas.</p>
        )}

        <div className="space-y-4">
          {jobs.map((job) => {
            const tags = flattenArray(job.tags as Array<{ tag: string }>, 'tag')
            const entryName = (job.entry as { name: string } | null)?.name
            return (
              <Link
                key={job.id}
                href={`/empleos/${job.slug}`}
                className="block bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-base font-semibold text-primary">{job.title as string}</h2>
                    {entryName && <p className="text-xs text-muted font-mono mt-0.5">{entryName}</p>}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted font-mono">
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{JOB_TYPE_LABELS[job.type as string] || job.type}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{MODALITY_LABELS[job.modality as string] || job.modality}</span>
                      {job.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{getCityName(job.city as string)}</span>}
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tags.slice(0, 4).map((tag) => <Tag key={tag} className="text-[10px]">{tag}</Tag>)}
                      </div>
                    )}
                  </div>
                  {job.compensation && (
                    <span className="text-sm font-mono font-medium text-accent whitespace-nowrap">{job.compensation as string}</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
