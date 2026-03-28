import { useState, useEffect, useCallback, type ReactNode } from "react";
import {
  SearchX,
  Rocket,
  Briefcase,
  Users,
  User,
  LayoutGrid,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import {
  CATEGORY_URL_MAP,
  DEFAULT_PAGINATION,
  type AtlasEntryType,
} from "../../config";

interface CityInfo {
  id: string;
  name: string;
  count: number;
}

type SortOption = "name-asc" | "name-desc" | "date-desc" | "date-asc";

const DEFAULT_SORT: SortOption = "date-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "date-desc", label: "Más recientes" },
  { value: "date-asc", label: "Más antiguos" },
  { value: "name-asc", label: "Nombre A–Z" },
  { value: "name-desc", label: "Nombre Z–A" },
];

interface Props {
  typeLabels: Record<string, string>;
  typeIcons: Record<string, string>;
  cities: CityInfo[];
  totalCount: number;
  initialType?: string;
  initialCity?: string;
  pageSize?: number;
  children?: ReactNode;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  rocket: Rocket,
  briefcase: Briefcase,
  users: Users,
  user: User,
};

function typeToPath(type: string): string {
  const slug = CATEGORY_URL_MAP[type as AtlasEntryType];
  return slug ? `/${slug}` : "/directorio";
}

function getParamFromURL(key: string): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(key) ?? "";
}

function getPageFromURL(): number {
  const n = parseInt(getParamFromURL("page"), 10);
  return n > 0 ? n : 1;
}

function getSortFromURL(): SortOption {
  const s = getParamFromURL("sort");
  return SORT_OPTIONS.some((o) => o.value === s)
    ? (s as SortOption)
    : DEFAULT_SORT;
}

/** Build URL with page + sort params. SSR-safe. */
function buildURL(page: number, sort: SortOption): string {
  if (typeof window === "undefined") {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (sort !== DEFAULT_SORT) params.set("sort", sort);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }
  const url = new URL(window.location.href);
  if (page <= 1) url.searchParams.delete("page");
  else url.searchParams.set("page", String(page));
  if (sort === DEFAULT_SORT) url.searchParams.delete("sort");
  else url.searchParams.set("sort", sort);
  return url.pathname + url.search;
}

/* ── DOM sorting ── */
function sortDOMEntries(sort: SortOption) {
  const gridEl = document.getElementById("entries-grid");
  if (!gridEl) return;
  const items = Array.from(gridEl.querySelectorAll<HTMLElement>(".entry-item"));
  items.sort((a, b) => {
    if (sort === "name-asc" || sort === "name-desc") {
      const nameA = a.dataset.name ?? "";
      const nameB = b.dataset.name ?? "";
      return sort === "name-asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }
    // date sort — entries without dates go to the end
    const dateA = a.dataset.date ?? "";
    const dateB = b.dataset.date ?? "";
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return sort === "date-desc"
      ? dateB.localeCompare(dateA)
      : dateA.localeCompare(dateB);
  });
  // Re-append in new order (moves existing DOM nodes)
  for (const item of items) gridEl.appendChild(item);
}

/* ── Pagination ── */
function Pagination({
  currentPage,
  totalPages,
  sort,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  sort: SortOption;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const btn =
    "inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2 rounded text-sm font-mono transition-colors cursor-pointer";
  const active = "bg-accent/15 text-accent border border-accent/30";
  const inactive =
    "text-secondary hover:text-accent hover:bg-elevated border border-transparent";
  const disabled =
    "text-muted/40 pointer-events-none border border-transparent";

  return (
    <nav
      aria-label="Paginación"
      className="flex items-center justify-center gap-1 mt-8"
    >
      <a
        href={currentPage > 1 ? buildURL(currentPage - 1, sort) : undefined}
        onClick={(e) => {
          e.preventDefault();
          if (currentPage > 1) onPageChange(currentPage - 1);
        }}
        className={`${btn} ${currentPage <= 1 ? disabled : inactive}`}
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </a>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-muted text-sm">
            …
          </span>
        ) : (
          <a
            key={p}
            href={buildURL(p, sort)}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(p);
            }}
            className={`${btn} ${p === currentPage ? active : inactive}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </a>
        ),
      )}

      <a
        href={
          currentPage < totalPages ? buildURL(currentPage + 1, sort) : undefined
        }
        onClick={(e) => {
          e.preventDefault();
          if (currentPage < totalPages) onPageChange(currentPage + 1);
        }}
        className={`${btn} ${currentPage >= totalPages ? disabled : inactive}`}
        aria-label="Página siguiente"
      >
        <ChevronRight className="w-4 h-4" />
      </a>
    </nav>
  );
}

/* ── DirectoryFilter ── */
export default function DirectoryFilter({
  typeLabels,
  typeIcons,
  cities,
  totalCount,
  initialType = "",
  initialCity = "",
  pageSize = DEFAULT_PAGINATION,
  children,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState<SortOption>(DEFAULT_SORT);
  const [matchedCount, setMatchedCount] = useState(totalCount);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeType = initialType;
  const activeCity = initialCity;
  const isPaginated = pageSize > 0;

  // Read page + sort from URL on mount
  useEffect(() => {
    if (isPaginated) setCurrentPage(getPageFromURL());
    const sort = getSortFromURL();
    setCurrentSort(sort);
    sortDOMEntries(sort);
  }, [isPaginated]);

  const applyDOMFilter = useCallback(
    (
      type: string,
      city: string,
      page: number,
      size: number,
      animate: boolean,
    ) => {
      const entries = document.querySelectorAll<HTMLElement>(".entry-item");
      const gridEl = document.getElementById("entries-grid");
      let matched = 0;
      let displayed = 0;

      const start = size > 0 ? (page - 1) * size + 1 : 1;
      const end = size > 0 ? page * size : Infinity;

      entries.forEach((el) => {
        const matchType = !type || el.dataset.type === type;
        const matchCity = !city || el.dataset.city === city;

        if (matchType && matchCity) {
          matched++;
          if (matched >= start && matched <= end) {
            el.classList.remove("hidden");
            displayed++;
          } else {
            el.classList.add("hidden");
          }
        } else {
          el.classList.add("hidden");
        }
      });

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

      setMatchedCount(matched);
      if (gridEl) gridEl.classList.toggle("hidden", displayed === 0);
    },
    [],
  );

  useEffect(() => {
    applyDOMFilter(activeType, activeCity, currentPage, pageSize, false);
  }, [applyDOMFilter, activeType, activeCity, currentPage, pageSize]);

  useEffect(() => {
    const munName = cities.find((m) => m.id === activeCity)?.name;
    if (munName) {
      document.title = `${munName} | Tech Atlas`;
    } else if (activeType && typeLabels[activeType]) {
      document.title = `${typeLabels[activeType]} | Tech Atlas`;
    } else {
      document.title = "Directorio | Tech Atlas";
    }
  }, [activeType, activeCity, cities, typeLabels]);

  function navigate(type: string, city: string) {
    if (type) {
      window.location.href = typeToPath(type);
    } else if (city) {
      window.location.href = `/directorio/${city}`;
    } else {
      window.location.href = "/directorio";
    }
  }

  function handleTypeClick(type: string) {
    const newType = type === activeType ? "" : type;
    navigate(newType, "");
  }

  function handleCityClick(id: string) {
    const newMun = id === activeCity ? "" : id;
    navigate("", newMun);
  }

  function clearFilters() {
    navigate("", "");
  }

  function pushURL(page: number, sort: SortOption) {
    window.history.pushState({}, "", buildURL(page, sort));
  }

  function handlePageChange(page: number) {
    pushURL(page, currentSort);
    setCurrentPage(page);
    document
      .getElementById("directory-top")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSortChange(sort: SortOption) {
    setCurrentSort(sort);
    setCurrentPage(1);
    pushURL(1, sort);
    sortDOMEntries(sort);
    // Re-apply filter + pagination after DOM reorder
    requestAnimationFrame(() => {
      applyDOMFilter(activeType, activeCity, 1, pageSize, true);
    });
  }

  const totalPages = isPaginated
    ? Math.max(1, Math.ceil(matchedCount / pageSize))
    : 1;

  const activeCityName = cities.find((m) => m.id === activeCity)?.name;
  const activeTypeName = activeType ? typeLabels[activeType] : undefined;
  const heading = activeCityName || activeTypeName || "Ecosistema Sinaloa";

  const sortedCities = cities
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count);

  const rangeStart = isPaginated ? (currentPage - 1) * pageSize + 1 : 1;
  const rangeEnd = isPaginated
    ? Math.min(currentPage * pageSize, matchedCount)
    : matchedCount;

  /* ── Shared sidebar content ── */
  const sidebarContent = (
    <>
      {/* Category filters */}
      <div>
        <h3 className="font-mono text-xs text-muted uppercase tracking-wider mb-3">
          Categorías
        </h3>
        <div className="space-y-1">
          <a
            href="/directorio"
            onClick={(e) => {
              e.preventDefault();
              clearFilters();
            }}
            className={`w-full flex items-center gap-2.5 py-2 px-3 rounded text-left transition-colors ${
              !activeType && !activeCity
                ? "bg-accent/10 border-l-2 border-accent"
                : "hover:bg-elevated"
            }`}
          >
            <LayoutGrid
              className={`w-4 h-4 shrink-0 ${
                !activeType && !activeCity ? "text-accent" : "text-muted"
              }`}
            />
            <span
              className={`text-sm ${
                !activeType && !activeCity
                  ? "text-accent font-medium"
                  : "text-primary"
              }`}
            >
              Todos
            </span>
          </a>

          {Object.entries(typeLabels).map(([type, label]) => {
            const IconComponent = ICON_MAP[typeIcons[type]] || LayoutGrid;
            const isActive = activeType === type;
            return (
              <a
                key={type}
                href={typeToPath(type)}
                onClick={(e) => {
                  e.preventDefault();
                  handleTypeClick(type);
                }}
                className={`w-full flex items-center gap-2.5 py-2 px-3 rounded text-left transition-colors ${
                  isActive
                    ? "bg-accent/10 border-l-2 border-accent"
                    : "hover:bg-elevated"
                }`}
              >
                <IconComponent
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-accent" : "text-muted"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isActive ? "text-accent font-medium" : "text-primary"
                  }`}
                >
                  {label}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      <hr className="border-border" />

      {/* City filters */}
      <div>
        <h3 className="font-mono text-xs text-muted uppercase tracking-wider mb-3">
          Municipios
        </h3>
        <div className="space-y-1">
          {sortedCities.map((mun) => (
            <button
              key={mun.id}
              onClick={() => handleCityClick(mun.id)}
              className={`w-full flex items-center justify-between py-2 px-3 rounded text-left transition-colors cursor-pointer ${
                activeCity === mun.id
                  ? "bg-accent/10 border-l-2 border-accent"
                  : "hover:bg-elevated"
              }`}
            >
              <span
                className={`text-sm ${
                  activeCity === mun.id
                    ? "text-accent font-medium"
                    : "text-primary"
                }`}
              >
                {mun.name}
              </span>
              <span className="text-xs font-mono text-muted">{mun.count}</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-border" />

      {/* Sort options */}
      <div>
        <h3 className="font-mono text-xs text-muted uppercase tracking-wider mb-3">
          Ordenar
        </h3>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => {
            const isActive = currentSort === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSortChange(opt.value)}
                className={`w-full flex items-center gap-2.5 py-2 px-3 rounded text-left transition-colors cursor-pointer ${
                  isActive
                    ? "bg-accent/10 border-l-2 border-accent"
                    : "hover:bg-elevated"
                }`}
              >
                <ArrowUpDown
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-accent" : "text-muted"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isActive ? "text-accent font-medium" : "text-primary"
                  }`}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div id="directory-top">
      {/* Breadcrumb */}
      <nav className="text-xs font-mono text-muted mb-4">
        <a href="/" className="hover:text-accent transition-colors">
          INICIO
        </a>
        <span className="mx-2">/</span>
        {activeCityName || activeTypeName ? (
          <>
            <button
              onClick={clearFilters}
              className="hover:text-accent transition-colors cursor-pointer"
            >
              DIRECTORIO
            </button>
            <span className="mx-2">/</span>
            <span className="text-accent">
              {(activeCityName || activeTypeName || "").toUpperCase()}
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
      <p className="mt-2 text-secondary mb-6">
        {isPaginated && matchedCount > 0 ? (
          <>
            <span className="font-bold">
              {rangeStart}–{rangeEnd}
            </span>{" "}
            de <span className="font-bold">{matchedCount}</span>{" "}
            {matchedCount === 1 ? "resultado" : "resultados"}
          </>
        ) : (
          <>
            <span className="font-bold">{matchedCount}</span>{" "}
            {matchedCount === 1
              ? "resultado encontrado"
              : "resultados encontrados"}
          </>
        )}
      </p>

      {/* ── Mobile filter panel ── */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-card/90 backdrop-blur-sm border border-border rounded-lg text-sm font-mono text-primary cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted" />
            Filtros
            {(activeType || activeCity) && (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-accent/20 text-accent">
                1
              </span>
            )}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-muted transition-transform duration-250 ${
              mobileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className={`collapse-grid ${mobileOpen ? "open" : ""}`}>
          <div className="collapse-content">
            <div className="mt-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 space-y-4">
              {sidebarContent}
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop: sidebar + content grid ── */}
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 h-fit lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto space-y-4">
          {sidebarContent}
        </aside>

        {/* Content area */}
        <div>
          {children}

          {isPaginated && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              sort={currentSort}
              onPageChange={handlePageChange}
            />
          )}

          {matchedCount === 0 && (
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
