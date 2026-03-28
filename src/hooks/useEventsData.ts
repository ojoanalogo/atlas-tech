'use client'

import { useState, useEffect, useCallback } from 'react'

export interface TechEvent {
  id: string
  title: string
  organizer: string
  date: string
  startTime: string
  endTime: string
  description: string
  url: string
  location: string
  mapsUrl: string
  modality: string
  isInPerson: boolean
  meetLink: string
  image?: string | null
  registerUrl: string
}

type Status = 'loading' | 'fresh' | 'error'

export interface UseEventsDataResult {
  events: TechEvent[]
  eventsByDate: Record<string, TechEvent[]>
  status: Status
  refetch: () => void
}

function groupByDate(events: TechEvent[]): Record<string, TechEvent[]> {
  const map: Record<string, TechEvent[]> = {}
  for (const ev of events) {
    const dateKey = ev.date?.split('T')[0]
    if (!dateKey) continue
    if (!map[dateKey]) map[dateKey] = []
    map[dateKey].push(ev)
  }
  return map
}

export function useEventsData(): UseEventsDataResult {
  const [events, setEvents] = useState<TechEvent[]>([])
  const [eventsByDate, setEventsByDate] = useState<Record<string, TechEvent[]>>({})
  const [status, setStatus] = useState<Status>('loading')

  const fetchEvents = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await fetch('/api/events?limit=200')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const docs: TechEvent[] = (data.docs || []).map((doc: Record<string, unknown>) => {
        const imageField = doc.image as { url?: string } | string | null | undefined
        let imageUrl: string | null = null
        if (typeof imageField === 'string') {
          imageUrl = imageField
        } else if (imageField && typeof imageField === 'object' && 'url' in imageField) {
          imageUrl = (imageField as { url: string }).url
        }

        return {
          id: doc.id as string,
          title: doc.title as string,
          organizer: (doc.organizer as string) || '',
          date: (doc.date as string) || '',
          startTime: (doc.startTime as string) || '',
          endTime: (doc.endTime as string) || '',
          description: '',
          url: (doc.url as string) || '',
          location: (doc.location as string) || '',
          mapsUrl: (doc.mapsUrl as string) || '',
          modality: (doc.modality as string) || 'in-person',
          isInPerson: (doc.modality as string) === 'in-person',
          meetLink: (doc.meetLink as string) || '',
          image: imageUrl,
          registerUrl: (doc.registerUrl as string) || '',
        }
      })
      setEvents(docs)
      setEventsByDate(groupByDate(docs))
      setStatus('fresh')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  return { events, eventsByDate, status, refetch: fetchEvents }
}
