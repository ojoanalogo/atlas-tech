'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { EntryBadge } from '@/components/entries/EntryBadge'
import { getCityName, type AtlasEntryType } from '@/config'
import { Clock, CheckCircle, XCircle, Pencil } from 'lucide-react'

interface Entry {
  id: string
  name: string
  entryType: AtlasEntryType
  city: string
  slug: string
  _status: 'draft' | 'published'
  moderationNote?: string
  updatedAt: string
}

export function MyEntries() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/entries')
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.docs || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse h-20 bg-elevated rounded-lg" />

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted mb-4">No tienes proyectos registrados.</p>
        <Link href="/directorio/submit" className="text-sm font-mono text-accent hover:underline">
          Agregar proyecto
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <EntryBadge entryType={entry.entryType} />
                {entry._status === 'published' ? (
                  <span className="flex items-center gap-1 text-2xs font-mono text-green-600">
                    <CheckCircle className="w-3 h-3" /> Publicado
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-2xs font-mono text-amber-600">
                    <Clock className="w-3 h-3" /> Pendiente
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-primary text-sm">{entry.name}</h3>
              <p className="text-2xs text-muted font-mono">{getCityName(entry.city)}</p>
              {entry.moderationNote && entry._status === 'draft' && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400 flex items-start gap-1">
                  <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  {entry.moderationNote}
                </div>
              )}
            </div>
            <Link
              href={`/dashboard/entries/${entry.id}`}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary rounded-md hover:bg-elevated transition-colors"
            >
              <Pencil className="w-3 h-3" /> Editar
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
