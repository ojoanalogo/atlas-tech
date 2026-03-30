'use client'

import Link from 'next/link'
import { getCityName, JOB_TYPE_LABELS, MODALITY_LABELS } from '@/config'
import { timeAgo, expirationLabel } from '@/lib/utils'
import { Clock, CheckCircle, XCircle, Briefcase, ExternalLink, Plus } from 'lucide-react'
import { useUserResource } from '@/hooks/useUserResource'

interface Job {
  id: string
  title: string
  type: string
  modality: string
  city?: string
  slug: string
  _status: 'draft' | 'published'
  moderationNote?: string
  expiresAt: string
  updatedAt: string
}

export function MyJobs() {
  const { data: jobs, loading } = useUserResource<Job>('/api/user/jobs')

  if (loading) return <div className="animate-pulse h-20 bg-elevated rounded-lg" />

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted mb-4">No has publicado empleos.</p>
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-medium border border-border text-primary rounded-md hover:bg-elevated transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Publicar empleo
        </Link>
      </div>
    )
  }

  const activeCount = jobs.filter((j) => j._status === 'published' && new Date(j.expiresAt) >= new Date()).length
  const expiredCount = jobs.filter((j) => j._status === 'published' && new Date(j.expiresAt) < new Date()).length

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex gap-3">
        <div className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-center">
          <div className="text-lg font-bold text-accent">{activeCount}</div>
          <div className="text-2xs font-mono text-muted uppercase">Activos</div>
        </div>
        <div className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-center">
          <div className="text-lg font-bold text-muted">{expiredCount}</div>
          <div className="text-2xs font-mono text-muted uppercase">Expirados</div>
        </div>
      </div>

      {/* Job cards */}
      {jobs.map((job) => {
        const isExpired = new Date(job.expiresAt) < new Date()
        return (
          <div
            key={job.id}
            className={`bg-card border border-border rounded-lg p-4 ${isExpired ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="w-9 h-9 rounded-lg bg-elevated border border-border flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-muted" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {job._status === 'published' && !isExpired ? (
                    <span className="flex items-center gap-1 text-2xs font-mono text-accent">
                      <CheckCircle className="w-3 h-3" /> Activo
                    </span>
                  ) : job._status === 'published' && isExpired ? (
                    <span className="flex items-center gap-1 text-2xs font-mono text-muted">
                      <Clock className="w-3 h-3" /> Expirado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-2xs font-mono text-secondary">
                      <Clock className="w-3 h-3" /> Pendiente
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-primary text-sm">{job.title}</h3>
                <p className="text-2xs text-muted font-mono">
                  {JOB_TYPE_LABELS[job.type] || job.type}
                  {job.modality && ` · ${MODALITY_LABELS[job.modality] || job.modality}`}
                  {job.city && ` · ${getCityName(job.city)}`}
                </p>
                <p className="text-2xs text-muted font-mono mt-1">
                  {expirationLabel(job.expiresAt)}
                </p>
                {job.moderationNote && job._status === 'draft' && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400 flex items-start gap-1">
                    <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {job.moderationNote}
                  </div>
                )}
              </div>

              {/* Actions */}
              {job._status === 'published' && !isExpired && (
                <Link
                  href={`/empleos/${job.slug}`}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary border border-border rounded-md hover:bg-elevated transition-colors shrink-0"
                >
                  <ExternalLink className="w-3 h-3" /> Ver
                </Link>
              )}
            </div>
          </div>
        )
      })}

      {/* Bottom action */}
      <div className="text-center pt-2">
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-medium border border-border text-primary rounded-md hover:bg-elevated transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Publicar empleo
        </Link>
      </div>
    </div>
  )
}
