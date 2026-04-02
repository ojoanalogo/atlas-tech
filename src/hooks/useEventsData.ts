'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Event, Media } from '@/payload-types'

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

function getImageUrl(image: Event['image']): string | null {
  if (typeof image === 'object' && image !== null && (image as Media).url) {
    return (image as Media).url ?? null
  }
  return null
}

function eventDocToTechEvent(doc: Event): TechEvent {
  return {
    id: String(doc.id),
    title: doc.title,
    organizer: doc.organizer || '',
    date: (doc.date || '').split('T')[0],
    startTime: doc.startTime || '',
    endTime: doc.endTime || '',
    description: '',
    url: doc.url || '',
    location: doc.location || '',
    mapsUrl: doc.mapsUrl || '',
    modality: doc.modality || 'in-person',
    isInPerson: doc.modality === 'in-person',
    meetLink: doc.meetLink || '',
    image: getImageUrl(doc.image),
    registerUrl: doc.registerUrl || '',
  }
}

export function useEventsData(): UseEventsDataResult {
  const [events, setEvents] = useState<TechEvent[]>([])
  const [eventsByDate, setEventsByDate] = useState<Record<string, TechEvent[]>>({})
  const [status, setStatus] = useState<Status>('loading')

  const fetchEvents = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await fetch('/api/directory/events?limit=200')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: { docs: Event[] } = await res.json()
      const docs: TechEvent[] = (data.docs || []).map(eventDocToTechEvent)
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
