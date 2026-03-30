'use client'

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from 'next/dynamic'
import {
  SINALOA_CITIES,
  emptyTypeCounts,
} from "@/config";
import type { AtlasEntryType } from "@/config";
import CityList from "@/components/maps/CityList";
import CityStats from "@/components/maps/CityStats";
import { MapPin, Globe } from "lucide-react";

const SinaloaMap = dynamic(() => import('@/components/maps/SinaloaMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-elevated animate-pulse rounded-lg" />,
});

type TypeCounts = Record<AtlasEntryType, number>;

interface MapSectionProps {
  cityCounts: Record<string, number>;
  cityTypeCounts: Record<string, TypeCounts>;
}

const EMPTY_TYPE_COUNTS: TypeCounts = emptyTypeCounts();

export default function MapSection({
  cityCounts,
  cityTypeCounts,
}: MapSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Selected city data
  const selectedData = useMemo(() => {
    if (!selectedId) return null;
    const mun = SINALOA_CITIES.find((m) => m.id === selectedId);
    if (!mun) return null;
    const stats = cityTypeCounts[selectedId] || {
      ...EMPTY_TYPE_COUNTS,
    };
    const total = Object.values(stats).reduce((a, b) => a + b, 0);
    return { name: mun.name, id: selectedId, stats, total };
  }, [selectedId, cityTypeCounts]);

  const handleCityClick = useCallback(
    (id: string) => {
      setSelectedId((prev) => (prev === id ? null : id));
    },
    [],
  );

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  // Clear on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("[data-city]") &&
        !target.closest("[data-stats-panel]") &&
        !target.closest("[data-map-popup]") &&
        !target.closest("[data-mun-search]")
      ) {
        setSelectedId(null);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const activeCityCount = Object.keys(cityCounts).length;

  return (
    <section id="map" className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-9 gap-4">
          {/* Left: Cities (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-accent" />
                <h2 className="text-xl md:text-2xl font-sans font-bold text-primary">
                  Mira por municipio
                </h2>
              </div>
              <p className="text-sm text-secondary pl-7">
                Selecciona un municipio para ver su ecosistema tech
              </p>
            </div>

            <CityStats selectedData={selectedData} onClose={clearSelection} />

            <CityList
              cities={SINALOA_CITIES}
              cityCounts={cityCounts}
              selectedCity={selectedId}
              onSelectCity={handleCityClick}
            />
          </div>

          {/* Right: Map (5 cols) */}
          <div className="lg:col-span-5 flex">
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col w-full">
              <div className="mb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-accent" />
                    <h2 className="text-lg font-sans font-bold text-primary">
                      Mapa del ecosistema
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-xs font-mono text-accent">
                      {activeCityCount} municipios
                    </span>
                  </div>
                </div>
                <p className="text-sm text-secondary pl-7">
                  Distribución del talento tech en Sinaloa
                </p>
              </div>
              <div className="flex-1 min-h-100 bg-elevated border border-border rounded-lg overflow-hidden">
                <SinaloaMap cityCounts={cityCounts} selectedCity={selectedId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
