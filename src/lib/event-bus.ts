import type { TechEvent } from '../utils'

export const EVENT_DETAIL_EVENT = 'open-event-detail' as const

export function openEventDetail(event: TechEvent): void {
  window.dispatchEvent(new CustomEvent(EVENT_DETAIL_EVENT, { detail: event }))
}
