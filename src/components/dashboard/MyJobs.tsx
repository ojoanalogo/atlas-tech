'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCityName, JOB_TYPE_LABELS } from '@/config'
import { Clock, CheckCircle, XCircle } from 'lucide-react'

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
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/jobs')
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.docs || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse h-20 bg-elevated rounded-lg" />

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted mb-4">No has publicado empleos.</p>
        <Link href="/dashboard/jobs/new" className="text-sm font-mono text-accent hover:underline">
          Publicar empleo
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => {
        const isExpired = new Date(job.expiresAt) < new Date()
        return (
          <div key={job.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {job._status === 'published' && !isExpired ? (
                    <span className="flex items-center gap-1 text-2xs font-mono text-green-600">
                      <CheckCircle className="w-3 h-3" /> Activo
                    </span>
                  ) : job._status === 'published' && isExpired ? (
                    <span className="flex items-center gap-1 text-2xs font-mono text-muted">
                      <Clock className="w-3 h-3" /> Expirado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-2xs font-mono text-amber-600">
                      <Clock className="w-3 h-3" /> Pendiente
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-primary text-sm">{job.title}</h3>
                <p className="text-2xs text-muted font-mono">
                  {JOB_TYPE_LABELS[job.type] || job.type}
                  {job.city && ` · ${getCityName(job.city)}`}
                </p>
                {job.moderationNote && job._status === 'draft' && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400 flex items-start gap-1">
                    <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {job.moderationNote}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
