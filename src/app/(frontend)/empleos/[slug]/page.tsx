import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getJobBySlug } from '@/lib/payload'
import { getCityName } from '@/config'
import { flattenArray } from '@/lib/utils'
import { Tag } from '@/components/ui/Tag'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { MapPin, Clock, Briefcase, ExternalLink as LinkIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const job = await getJobBySlug(slug)
  if (!job) return { title: 'Not Found' }
  return { title: `${job.title} — Empleos` }
}

const typeLabels: Record<string, string> = {
  'full-time': 'Tiempo completo',
  'part-time': 'Medio tiempo',
  contract: 'Contrato',
  freelance: 'Freelance',
  volunteer: 'Voluntariado',
}

const modalityLabels: Record<string, string> = {
  remote: 'Remoto',
  'in-person': 'Presencial',
  hybrid: 'Híbrido',
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const job = await getJobBySlug(slug)
  if (!job) notFound()

  const tags = flattenArray(job.tags as Array<{ tag: string }>, 'tag')
  const entryName = (job.entry as { name: string } | null)?.name

  return (
    <article className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <nav className="text-xs font-mono text-muted mb-6 uppercase">
          <a href="/" className="hover:text-accent transition-colors">Inicio</a>
          <span className="mx-2">/</span>
          <a href="/empleos" className="hover:text-accent transition-colors">Empleos</a>
          <span className="mx-2">/</span>
          <span className="text-primary">{job.title as string}</span>
        </nav>

        <h1 className="text-3xl font-bold text-primary mb-2">{job.title as string}</h1>
        {entryName && <p className="text-sm text-muted font-mono mb-4">Publicado por {entryName}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-card border border-border rounded-lg p-3">
            <p className="text-2xs font-mono text-muted uppercase">Tipo</p>
            <p className="text-sm text-primary font-medium flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{typeLabels[job.type as string] || job.type}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3">
            <p className="text-2xs font-mono text-muted uppercase">Modalidad</p>
            <p className="text-sm text-primary font-medium flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{modalityLabels[job.modality as string] || job.modality}</p>
          </div>
          {job.city && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Ubicación</p>
              <p className="text-sm text-primary font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{getCityName(job.city as string)}</p>
            </div>
          )}
          {job.compensation && (
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-2xs font-mono text-muted uppercase">Compensación</p>
              <p className="text-sm text-accent font-medium">{job.compensation as string}</p>
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-6">
            {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        )}

        <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
          <RichText data={job.description as any} />
        </div>

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 text-center">
          <p className="text-sm text-primary font-medium mb-3">Interesado en esta oportunidad?</p>
          <ExternalLink
            href={job.contactUrl as string}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground rounded-md text-sm font-mono font-medium hover:bg-accent/90 transition-colors"
          >
            <LinkIcon className="w-4 h-4" /> Aplicar
          </ExternalLink>
        </div>

        <p className="text-2xs text-muted font-mono mt-4 text-center">
          Esta oferta expira el {new Date(job.expiresAt as string).toLocaleDateString('es-MX', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      </div>
    </article>
  )
}
