import type { TechEvent } from '@/hooks/useEventsData'

export const EVENT_DETAIL_EVENT = 'open-event-detail' as const

export function openEventDetail(event: TechEvent): void {
  window.dispatchEvent(new CustomEvent(EVENT_DETAIL_EVENT, { detail: event }))
}
