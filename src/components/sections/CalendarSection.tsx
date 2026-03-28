'use client'

import EventCalendar from '@/components/calendar/EventCalendar'
import EventDetailModal from '@/components/calendar/EventDetailModal'
import AddToCalendarButton from '@/components/calendar/AddToCalendarButton'

export function CalendarSection() {
  return (
    <section id="calendario" className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <EventCalendar />
      </div>
      <EventDetailModal />
      <AddToCalendarButton />
    </section>
  )
}
