import type { Metadata } from 'next'
import { getPublishedEntries, getFeaturedEntries } from '@/lib/payload'
import { countByType, groupByCity, countByTypeAndCity } from '@/lib/utils'
import { FAQS, SITE_URL, SITE_DESCRIPTION } from '@/config'

import { HeroSection } from '@/components/sections/HeroSection'
import { CategorySection } from '@/components/sections/CategorySection'
import { FeaturedSection } from '@/components/sections/FeaturedSection'
import MapSection from '@/components/sections/MapSection'
import { CalendarSection } from '@/components/sections/CalendarSection'
import { FaqSection } from '@/components/sections/FaqSection'
import { CombinedCtaSection } from '@/components/sections/CombinedCtaSection'
import UpcomingEventsStrip from '@/components/calendar/UpcomingEventsStrip'

export const metadata: Metadata = {
  title: 'Tech Atlas — Ecosistema Tech de Sinaloa',
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Tech Atlas — Ecosistema Tech de Sinaloa',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/og.jpg` }],
  },
  twitter: { card: 'summary_large_image' },
}

export default async function HomePage() {
  const [entriesResult, featuredResult] = await Promise.all([
    getPublishedEntries(),
    getFeaturedEntries(),
  ])

  const allEntries = entriesResult.docs
  const counts = countByType(allEntries)
  const cityCounts = groupByCity(allEntries)
  const cityTypeCounts = countByTypeAndCity(allEntries)
  const featured = featuredResult.docs

  const totalEntries = Math.floor(allEntries.length / 5) * 5
  const homeDescription = `Explora ${totalEntries}+ startups, consultorías, comunidades y talento tech en Sinaloa.`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Tech Atlas',
            url: SITE_URL,
            logo: `${SITE_URL}/android-chrome-512x512.png`,
            description: homeDescription,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SiteNavigationElement',
            name: ['Startups', 'Consultorías', 'Comunidades', 'Centros de Investigación', 'Personas', 'Eventos', 'Directorio'],
            url: [
              `${SITE_URL}/startups`,
              `${SITE_URL}/consultoras`,
              `${SITE_URL}/comunidades`,
              `${SITE_URL}/centros-de-investigacion`,
              `${SITE_URL}/personas`,
              `${SITE_URL}/eventos`,
              `${SITE_URL}/directorio`,
            ],
          }),
        }}
      />

      <HeroSection cityCounts={cityCounts} />

      <section className="py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <UpcomingEventsStrip />
        </div>
      </section>

      <CategorySection counts={counts} />
      <FeaturedSection entries={featured} />
      <MapSection cityCounts={cityCounts} cityTypeCounts={cityTypeCounts} />
      <CalendarSection />
      <FaqSection />
      <CombinedCtaSection />
    </>
  )
}
