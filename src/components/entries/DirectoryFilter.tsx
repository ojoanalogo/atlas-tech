import { useState, useEffect, useCallback, type ReactNode } from "react";
import { SearchX } from "lucide-react";
import { CATEGORY_URL_MAP, type AtlasEntryType } from "../../config";

interface MunicipalityInfo {
  id: string;
  name: string;
  count: number;
}

interface Props {
  typeLabels: Record<string, string>;
  municipalities: MunicipalityInfo[];
  totalCount: number;
  initialType?: string;
  initialMunicipality?: string;
  children?: ReactNode;
}

function typeToPath(type: string): string {
  const slug = CATEGORY_URL_MAP[type as AtlasEntryType];
  return slug ? `/${slug}` : "/directorio";
}

export default function DirectoryFilter({
  typeLabels,
  municipalities,
  totalCount,
  initialType = "",
  initialMunicipality = "",
  children,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(totalCount);
  const activeType = initialType;
  const activeMunicipality = initialMunicipality;

  const applyDOMFilter = useCallback(
    (type: string, municipality: string, animate: boolean) => {
      const entries = document.querySelectorAll<HTMLElement>(".entry-item");
      const gridEl = document.getElementById("entries-grid");
      let count = 0;

      // Update visibility
      entries.forEach((el) => {
        const matchType = !type || el.dataset.type === type;
        const matchMun =
          !municipality || el.dataset.municipality === municipality;
        const visible = matchType && matchMun;
        el.classList.toggle("hidden", !visible);
        if (visible) count++;
      });

      // Staggered fade-in for visible items
      if (animate) {
        let idx = 0;
        entries.forEach((el) => {
          if (!el.classList.contains("hidden")) {
            el.classList.remove("animate-in");
            el.style.animationDelay = `${Math.min(idx * 40, 400)}ms`;
            void el.offsetHeight;
            el.classList.add("animate-in");
            idx++;
          } else {
            el.classList.remove("animate-in");
            el.style.animationDelay = "";
          }
        });
      }

      setVisibleCount(count);
      if (gridEl) gridEl.classList.toggle("hidden", count === 0);
    },
    [],
  );

  // Apply filter on mount
  useEffect(() => {
    applyDOMFilter(activeType, activeMunicipality, false);
  }, [applyDOMFilter, activeType, activeMunicipality]);

  // Update document title
  useEffect(() => {
    const munName = municipalities.find(
      (m) => m.id === activeMunicipality,
    )?.name;
    if (munName) {
      document.title = `${munName} — TECH_ATLAS`;
    } else if (activeType && typeLabels[activeType]) {
      document.title = `${typeLabels[activeType]} — TECH_ATLAS`;
    } else {
      document.title = "Directorio — TECH_ATLAS";
    }
  }, [activeType, activeMunicipality, municipalities, typeLabels]);

  function navigate(type: string, municipality: string) {
    if (type) {
      window.location.href = typeToPath(type);
    } else if (municipality) {
      window.location.href = `/directorio/${municipality}`;
    } else {
      window.location.href = "/directorio";
    }
  }

  function handleTypeClick(type: string) {
    const newType = type === activeType ? "" : type;
    navigate(newType, "");
  }

  function handleMunicipalityClick(id: string) {
    const newMun = id === activeMunicipality ? "" : id;
    navigate("", newMun);
  }

  function clearFilters() {
    navigate("", "");
  }

  const activeMunName = municipalities.find(
    (m) => m.id === activeMunicipality,
  )?.name;
  const activeTypeName = activeType ? typeLabels[activeType] : undefined;
  const heading = activeMunName || activeTypeName || "Ecosistema";

  const sortedMunicipalities = municipalities
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-xs font-mono text-muted mb-4">
        <a href="/" className="hover:text-accent transition-colors">
          INICIO
        </a>
        <span className="mx-2">/</span>
        {activeMunName || activeTypeName ? (
          <>
            <button
              onClick={clearFilters}
              className="hover:text-accent transition-colors cursor-pointer"
            >
              DIRECTORIO
            </button>
            <span className="mx-2">/</span>
            <span className="text-accent">
              {(activeMunName || activeTypeName || "").toUpperCase()}
            </span>
          </>
        ) : (
          <span className="text-primary">DIRECTORIO</span>
        )}
      </nav>

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-sans font-bold text-primary">
        {heading}
      </h1>
      <p className="mt-2 text-secondary mb-8">
        <span className="font-bold">{visibleCount}</span>{" "}
        {visibleCount === 1 ? "resultado" : "resultados"}{" "}
        {visibleCount === 1 ? "encontrado" : "encontrados"}
      </p>

      {/* Type filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/directorio"
          onClick={(e) => {
            e.preventDefault();
            clearFilters();
          }}
          className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors ${
            !activeType && !activeMunicipality
              ? "bg-accent/20 text-accent border-accent/30"
              : "bg-card/90 text-secondary border-border hover:border-accent/30"
          }`}
        >
          TODOS
        </a>
        {Object.entries(typeLabels).map(([type, label]) => (
          <a
            key={type}
            href={typeToPath(type)}
            onClick={(e) => {
              e.preventDefault();
              handleTypeClick(type);
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors ${
              activeType === type
                ? "bg-accent/20 text-accent border-accent/30"
                : "bg-card/90 text-secondary border-border hover:border-accent/30"
            }`}
          >
            {label.toUpperCase()}
          </a>
        ))}
      </div>

      {/* Main content with municipality sidebar */}
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Municipality sidebar */}
        <aside className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 h-fit lg:max-h-150 lg:overflow-y-auto order-2 lg:order-1">
          <h3 className="font-mono text-xs text-muted uppercase tracking-wider mb-3">
            Municipios
          </h3>
          <div className="space-y-1">
            {sortedMunicipalities.map((mun) => (
              <button
                key={mun.id}
                onClick={() => handleMunicipalityClick(mun.id)}
                className={`w-full flex items-center justify-between py-2 px-3 rounded text-left transition-colors cursor-pointer ${
                  activeMunicipality === mun.id
                    ? "bg-accent/10 border-l-2 border-accent"
                    : "hover:bg-elevated"
                }`}
              >
                <span
                  className={`text-sm ${
                    activeMunicipality === mun.id
                      ? "text-accent font-medium"
                      : "text-primary"
                  }`}
                >
                  {mun.name}
                </span>
                <span className="text-xs font-mono text-muted">
                  {mun.count}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Content area — Astro-rendered cards passed as children */}
        <div className="order-1 lg:order-2">
          {children}
          {visibleCount === 0 && (
            <div className="text-center py-20">
              <SearchX
                className="w-12 h-12 mx-auto mb-4 text-muted opacity-40"
                strokeWidth={1.5}
              />
              <p className="text-muted font-mono text-sm">
                No se encontraron resultados.
              </p>
              <p className="text-xs mt-2 opacity-60 text-muted">
                Intenta con otro filtro o categoría.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
