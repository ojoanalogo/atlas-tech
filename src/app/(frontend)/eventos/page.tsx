import type { Metadata } from 'next'
import { CalendarSection } from '@/components/sections/CalendarSection'
import { EventsHeroSection } from '@/components/sections/EventsHeroSection'
import { SITE_URL } from '@/config'

export const metadata: Metadata = {
  title: 'Eventos Tech en Sinaloa',
  description: 'Meetups, talleres, hackatones y conferencias tech en Sinaloa, México.',
  alternates: { canonical: `${SITE_URL}/eventos` },
  openGraph: {
    title: 'Eventos Tech en Sinaloa',
    description: 'Meetups, talleres, hackatones y conferencias tech en Sinaloa, México.',
    url: `${SITE_URL}/eventos`,
  },
  twitter: { card: 'summary_large_image' },
}

export default function EventosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Eventos Tech en Sinaloa',
          description: 'Meetups, talleres, hackatones y conferencias tech en Sinaloa, México.',
          url: `${SITE_URL}/eventos`,
        }),
      }} />
      <EventsHeroSection />
      <CalendarSection />
    </>
  )
}
