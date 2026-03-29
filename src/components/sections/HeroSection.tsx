import dynamic from 'next/dynamic'
import Link from 'next/link'
import { MapPin, Search, Plus } from 'lucide-react'
import { SINALOA_CITIES } from '@/config'

const SinaloaMap = dynamic(() => import('@/components/maps/SinaloaMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-elevated animate-pulse rounded-lg" />,
})

interface HeroSectionProps {
  cityCounts?: Record<string, number>
}

export function HeroSection({ cityCounts = {} }: HeroSectionProps) {
  return (
    <section id="hero" className="py-8 px-4">
      <div className="max-w-7xl lg:mx-auto flex flex-col lg:flex-row gap-16 items-center">
        {/* Left: Text content */}
        <div className="space-y-6 flex-1 flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-mono font-semibold text-accent tracking-wide">
              // SINALOA, MÉXICO
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-hero font-sans font-bold text-primary leading-[1.1] tracking-tight uppercase">
            Descubre el ecosistema<br />
            tecnológico de Sinaloa
          </h1>

          <p className="text-sm md:text-base font-mono text-muted leading-relaxed max-w-125">
            Un directorio completo de startups, consultorías tech, talento y
            comunidades construyendo el futuro en nuestro estado.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link
              href="/directorio"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-accent uppercase text-accent-foreground font-mono font-bold text-xs rounded hover:bg-accent/90 transition-colors"
            >
              <Search className="w-4 h-4" />
              Explorar directorio
            </Link>
            <Link
              href="/directorio/submit"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-card uppercase border border-border text-primary font-mono font-semibold text-xs rounded hover:border-accent/50 hover:text-accent transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar proyecto
            </Link>
          </div>
        </div>

        {/* Right: Hero Map Card */}
        <div className="hidden lg:block w-full lg:w-110 xl:w-125 shrink-0">
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-4 h-[45vh]">
            {/* Map header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-muted tracking-wide">
                // SINALOA.GEO
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-mono font-semibold text-accent">
                  [{SINALOA_CITIES.length} municipios]
                </span>
              </div>
            </div>

            {/* Map container */}
            <div className="flex-1 bg-elevated border border-border rounded overflow-hidden">
              <SinaloaMap compact linkOnClick cityCounts={cityCounts} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
