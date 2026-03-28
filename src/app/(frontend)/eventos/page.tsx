import type { Metadata } from 'next'
import { CalendarSection } from '@/components/sections/CalendarSection'
import { EventsHeroSection } from '@/components/sections/EventsHeroSection'

export const metadata: Metadata = {
  title: 'Eventos Tech en Sinaloa',
  description: 'Meetups, talleres, hackatones y conferencias tech en Sinaloa, México.',
}

export default function EventosPage() {
  return (
    <>
      <EventsHeroSection />
      <CalendarSection />
    </>
  )
}
