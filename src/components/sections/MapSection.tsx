import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  SINALOA_MUNICIPALITIES,
  ENTRY_TYPE_CONFIG,
  emptyTypeCounts,
} from "../../config";
import type { AtlasEntryType } from "../../config";
import SinaloaMap from "../maps/SinaloaMap";
import {
  MapPin,
  Rocket,
  Users,
  Briefcase,
  User,
  Globe,
  Search,
  ArrowRight,
  ChevronsDown,
  Plus,
  X,
} from "lucide-react";

type TypeCounts = Record<AtlasEntryType, number>;

interface MapSectionProps {
  municipalityCounts: Record<string, number>;
  municipalityTypeCounts: Record<string, TypeCounts>;
}

const EMPTY_TYPE_COUNTS: TypeCounts = emptyTypeCounts();

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// --- Sub-components ---

function StatsPlaceholder() {
  return (
    <div className="flex items-center gap-3 py-3 justify-center text-muted">
      <MapPin className="w-5 h-5" />
      <span className="text-sm font-mono">
        Selecciona un municipio de la lista
      </span>
    </div>
  );
}

function StatsContent({
  name,
  id,
  stats,
  onClose,
}: {
  name: string;
  id: string;
  stats: TypeCounts;
  onClose: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-sans font-bold text-primary text-lg">{name}</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-2 min-h-11 min-w-11 flex items-center justify-center rounded hover:bg-elevated transition-colors text-muted hover:text-primary"
          aria-label="Cerrar resumen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Rocket className="w-4 h-4 text-accent shrink-0" />}
          value={(stats.startup || 0) + (stats.business || 0)}
          label={ENTRY_TYPE_CONFIG.startup.labelPlural}
        />
        <StatCard
          icon={<Users className="w-4 h-4 text-accent shrink-0" />}
          value={stats.community || 0}
          label={ENTRY_TYPE_CONFIG.community.labelPlural}
        />
        <StatCard
          icon={<Briefcase className="w-4 h-4 text-accent shrink-0" />}
          value={stats.consultory || 0}
          label={ENTRY_TYPE_CONFIG.consultory.labelPlural}
        />
        <StatCard
          icon={<User className="w-4 h-4 text-accent shrink-0" />}
          value={stats.person || 0}
          label={ENTRY_TYPE_CONFIG.person.labelPlural}
        />
      </div>
      <a
        href={`/directorio/${id}`}
        className="mt-3 flex items-center justify-center gap-2 w-full text-center text-xs font-mono font-semibold px-3 py-3 min-h-11 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
      >
        VER COMUNIDAD
        <ArrowRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-elevated rounded-lg">
      {icon}
      <div>
        <div className="text-xl font-mono font-bold text-primary">{value}</div>
        <div className="text-2xs text-muted font-mono uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}

function StatsEmpty({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-sans font-bold text-primary text-lg">{name}</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-2 min-h-11 min-w-11 flex items-center justify-center rounded hover:bg-elevated transition-colors text-muted hover:text-primary"
          aria-label="Cerrar resumen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col items-center text-center py-4 space-y-3">
        <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center">
          <MapPin className="w-5 h-5 text-muted" />
        </div>
        <div>
          <p className="text-sm text-primary font-medium">
            Aún no hay registros
          </p>
          <p className="text-xs text-muted mt-1">
            Sé el primero en representar este municipio
          </p>
        </div>
        <a
          href="/directorio/submit"
          className="flex items-center justify-center gap-2 w-full text-center text-xs font-mono font-semibold px-3 py-3 min-h-11 rounded-lg border border-dashed border-accent/40 text-accent hover:bg-accent/10 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          REGISTRAR PERFIL/STARTUP
        </a>
      </div>
    </div>
  );
}

// --- Main component ---

export default function MapSection({
  municipalityCounts,
  municipalityTypeCounts,
}: MapSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Sort municipalities: ones with entries first, then alphabetically
  const { withRecords, withoutRecords } = useMemo(() => {
    const sorted = [...SINALOA_MUNICIPALITIES].sort((a, b) => {
      const countA = municipalityCounts[a.id] || 0;
      const countB = municipalityCounts[b.id] || 0;
      if (countA && !countB) return -1;
      if (!countA && countB) return 1;
      return a.name.localeCompare(b.name);
    });
    return {
      withRecords: sorted.filter((m) => (municipalityCounts[m.id] || 0) > 0),
      withoutRecords: sorted.filter((m) => !(municipalityCounts[m.id] || 0)),
    };
  }, [municipalityCounts]);

  // Filter by search
  const normalizedQuery = normalize(searchQuery.trim());
  const isSearching = normalizedQuery.length > 0;

  const filterMunicipality = useCallback(
    (name: string) => !isSearching || normalize(name).includes(normalizedQuery),
    [isSearching, normalizedQuery],
  );

  const filteredWithRecords = withRecords.filter((m) =>
    filterMunicipality(m.name),
  );
  const filteredWithoutRecords = withoutRecords.filter((m) =>
    filterMunicipality(m.name),
  );
  const totalVisible =
    filteredWithRecords.length + filteredWithoutRecords.length;

  // Scroll indicator
  const updateScrollIndicator = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
    const overflows = el.scrollHeight > el.clientHeight;
    setShowScrollIndicator(overflows && !atBottom);
  }, []);

  useEffect(() => {
    updateScrollIndicator();
  }, [searchQuery, updateScrollIndicator]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollIndicator);
    return () => el.removeEventListener("scroll", updateScrollIndicator);
  }, [updateScrollIndicator]);

  // Selected municipality data
  const selectedData = useMemo(() => {
    if (!selectedId) return null;
    const mun = SINALOA_MUNICIPALITIES.find((m) => m.id === selectedId);
    if (!mun) return null;
    const stats = municipalityTypeCounts[selectedId] || {
      ...EMPTY_TYPE_COUNTS,
    };
    const total = Object.values(stats).reduce((a, b) => a + b, 0);
    return { name: mun.name, id: selectedId, stats, total };
  }, [selectedId, municipalityTypeCounts]);

  const handleMunicipalityClick = useCallback(
    (id: string) => {
      if (selectedId === id) {
        setSelectedId(null);
      } else {
        setSelectedId(id);
        window.dispatchEvent(
          new CustomEvent("select-municipality", { detail: { id } }),
        );
      }
    },
    [selectedId],
  );

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  // Clear on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("[data-municipality]") &&
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

  const activeMunicipalityCount = Object.keys(municipalityCounts).length;

  return (
    <section id="map" className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-9 gap-4">
          {/* Left: Municipalities (4 cols) */}
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

            {/* Stats panel */}
            <div
              data-stats-panel
              className="bg-card border border-border rounded-lg p-4 transition-all duration-200"
            >
              {!selectedData && <StatsPlaceholder />}
              {selectedData && selectedData.total > 0 && (
                <StatsContent
                  name={selectedData.name}
                  id={selectedData.id}
                  stats={selectedData.stats}
                  onClose={clearSelection}
                />
              )}
              {selectedData && selectedData.total === 0 && (
                <StatsEmpty name={selectedData.name} onClose={clearSelection} />
              )}
            </div>

            {/* Municipality list */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              {/* Search */}
              <div className="relative" data-mun-search>
                <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar municipio..."
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-elevated border border-border rounded-lg text-primary placeholder:text-muted focus:outline-hidden focus:border-accent/50 transition-colors"
                />
              </div>

              {/* Mobile toggle */}
              <button
                type="button"
                onClick={() => setMobileListOpen((v) => !v)}
                className="w-full flex items-center justify-between min-h-11 lg:hidden"
              >
                <span className="font-mono text-xs text-muted uppercase tracking-wider">
                  Municipios
                </span>
                <svg
                  className={`w-4 h-4 text-muted transition-transform duration-200 ${mobileListOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* List */}
              <div
                className={`relative ${mobileListOpen ? "block" : "hidden"} lg:block`}
              >
                <div
                  ref={listRef}
                  className="space-y-0.5 lg:max-h-95 overflow-y-auto scrollbar-hide"
                >
                  {totalVisible === 0 && (
                    <p className="w-full text-center text-sm text-muted py-2 font-mono">
                      Sin resultados
                    </p>
                  )}

                  {filteredWithRecords.map((mun) => {
                    const count = municipalityCounts[mun.id] || 0;
                    return (
                      <MunicipalityButton
                        key={mun.id}
                        id={mun.id}
                        name={mun.name}
                        count={count}
                        isActive={selectedId === mun.id}
                        dimmed={false}
                        onClick={handleMunicipalityClick}
                      />
                    );
                  })}

                  {/* Separator */}
                  {!isSearching && filteredWithoutRecords.length > 0 && (
                    <div className="flex items-center gap-3 py-3 px-3">
                      <div className="flex-1 border-t border-border" />
                      <span className="text-2xs font-mono text-muted uppercase tracking-wider shrink-0">
                        Sin registros
                      </span>
                      <div className="flex-1 border-t border-border" />
                    </div>
                  )}

                  {filteredWithoutRecords.map((mun) => (
                    <MunicipalityButton
                      key={mun.id}
                      id={mun.id}
                      name={mun.name}
                      isActive={selectedId === mun.id}
                      dimmed
                      onClick={handleMunicipalityClick}
                    />
                  ))}

                  {/* CTA */}
                  {!isSearching && (
                    <div className="pt-3 mt-2 border-t border-border space-y-1.5">
                      <a
                        href="/directorio/submit"
                        className="flex items-center justify-center gap-2 w-full text-center text-xs font-mono font-semibold px-3 py-3 min-h-11 rounded-lg border border-dashed border-accent/40 text-accent hover:bg-accent/10 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        REGISTRAR PERFIL/STARTUP
                      </a>
                      <p className="text-2xs text-muted text-center font-mono">
                        Startups, personas, consultorías, comunidades y empresas
                      </p>
                    </div>
                  )}
                </div>

                {/* Scroll indicator */}
                <div
                  className={`absolute bottom-0 left-0 right-0 flex flex-col items-center pointer-events-none transition-opacity duration-300 ${showScrollIndicator ? "opacity-100" : "opacity-0"}`}
                >
                  <div className="h-12 w-full bg-gradient-to-t from-card to-transparent" />
                  <div className="-mt-2 flex items-center gap-1 text-muted animate-bounce">
                    <ChevronsDown className="w-4 h-4" />
                    <span className="text-2xs font-mono uppercase tracking-wider">
                      Más municipios
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
                      {activeMunicipalityCount} municipios
                    </span>
                  </div>
                </div>
                <p className="text-sm text-secondary pl-7">
                  Distribución del talento tech en Sinaloa
                </p>
              </div>
              <div className="flex-1 min-h-100 bg-elevated border border-border rounded-lg overflow-hidden">
                <SinaloaMap municipalityCounts={municipalityCounts} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Municipality button ---

function MunicipalityButton({
  id,
  name,
  count,
  isActive,
  dimmed,
  onClick,
}: {
  id: string;
  name: string;
  count?: number;
  isActive: boolean;
  dimmed: boolean;
  onClick: (id: string) => void;
}) {
  return (
    <button
      type="button"
      data-municipality={id}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id);
      }}
      className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all text-left cursor-pointer hover:bg-elevated ${
        isActive
          ? "bg-elevated border border-accent/30 shadow-xs"
          : dimmed
            ? "opacity-50 hover:opacity-100"
            : ""
      }`}
    >
      <MapPin className="w-4 h-4 text-muted shrink-0" />
      <span className="text-sm text-primary flex-1">{name}</span>
      {count != null && count > 0 && (
        <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}
