'use client'

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  memo,
} from "react";
import { geoIdentity, geoPath } from "d3-geo";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  type LucideIcon,
  Rocket,
  Code,
  Users,
  Cpu,
  Lightbulb,
  Globe,
  Terminal,
  Building2,
  Wifi,
  BrainCircuit,
  Blocks,
  Handshake,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Lock,
  Unlock,
} from "lucide-react";

const TOPO_URL = "/topo/Sinaloa_municipios.json";

const ACCENT = "var(--color-accent)";

const PATTERN_ICONS: LucideIcon[] = [
  Rocket,
  Code,
  Users,
  Cpu,
  Lightbulb,
  Globe,
  Terminal,
  Building2,
  Wifi,
  BrainCircuit,
  Blocks,
  Handshake,
];

const CELL = 64;
const COLS = 4;
const ROWS = PATTERN_ICONS.length / COLS;

const BG_COLS = 12;
const BG_ROWS = 10;

const IconPatternBg = React.memo(function IconPatternBg() {
  let iconIdx = 0;
  const cells: React.ReactNode[] = [];

  for (let row = 0; row < BG_ROWS; row++) {
    for (let col = 0; col < BG_COLS; col++) {
      // Checkerboard: offset odd rows by one
      const isIcon = (col + row) % 2 === 0;
      if (isIcon) {
        const Icon = PATTERN_ICONS[iconIdx % PATTERN_ICONS.length];
        iconIdx++;
        cells.push(
          <div
            key={`${row}-${col}`}
            className="flex items-center justify-center"
          >
            <Icon size={20} strokeWidth={1.5} className="text-accent" />
          </div>,
        );
      } else {
        cells.push(<div key={`${row}-${col}`} />);
      }
    }
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity: 0.08 }}
      aria-hidden="true"
    >
      <div
        className="w-full h-full"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BG_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${BG_ROWS}, 1fr)`,
        }}
      >
        {cells}
      </div>
    </div>
  );
});

/** Captures geographies into a ref via useEffect instead of during render. */
function GeographiesCapture({
  geographies,
  geographiesRef,
}: {
  geographies: MapGeography[];
  geographiesRef: React.MutableRefObject<MapGeography[]>;
}) {
  useEffect(() => {
    geographiesRef.current = geographies;
  }, [geographies, geographiesRef]);
  return null;
}

const DRAG_THRESHOLD = 5; // px – ignore clicks if pointer moved more than this

// Pre-projected TopoJSON bounding box (Mexican CRS, meters)
const BOUNDS = {
  minX: 1758069.925,
  maxX: 2154354.388,
  minY: 1165418.1,
  maxY: 1679049.332,
};

/** GeoJSON feature shape returned by react-simple-maps Geographies. */
interface MapGeography {
  type: string;
  geometry: Record<string, unknown>;
  properties: Record<string, unknown>;
  rsmKey?: string;
}

interface CityCounts {
  [name: string]: number;
}

interface SinaloaMapProps {
  compact?: boolean;
  cityCounts?: CityCounts;
  /** When true, clicking a city opens /directorio/{id} in a new tab instead of showing a popup. */
  linkOnClick?: boolean;
  /** Externally selected city id to highlight on the map. */
  selectedCity?: string | null;
}

interface TooltipState {
  x: number;
  y: number;
  name: string;
  count: number;
}

interface PopupState {
  x: number;
  y: number;
  id: string;
  name: string;
  count: number;
}

function createProjection(width: number, height: number, padding: number) {
  return geoIdentity()
    .reflectY(true)
    .fitExtent(
      [
        [padding, padding],
        [width - padding, height - padding],
      ],
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [BOUNDS.minX, BOUNDS.minY],
              [BOUNDS.maxX, BOUNDS.minY],
              [BOUNDS.maxX, BOUNDS.maxY],
              [BOUNDS.minX, BOUNDS.maxY],
              [BOUNDS.minX, BOUNDS.minY],
            ],
          ],
        },
        properties: {},
      },
    );
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function SinaloaMap({
  compact = false,
  cityCounts = {},
  linkOnClick = false,
  selectedCity = null,
}: SinaloaMapProps) {
  const width = compact ? 380 : 800;
  const height = compact ? 450 : 800;
  const padding = compact ? 5 : 40;

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [interactionEnabled, setInteractionEnabled] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const translateStart = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const geographiesRef = useRef<MapGeography[]>([]);

  const projection = useMemo(
    () => createProjection(width, height, padding),
    [width, height, padding],
  );
  const pathGenerator = useMemo(
    () => geoPath(projection as any),
    [projection],
  );

  // Compute pan boundaries based on current scale
  const getMaxTranslate = useCallback(
    (s: number) => {
      const overflow = (s - 1) / 2;
      return {
        maxX: overflow * width,
        maxY: overflow * height,
      };
    },
    [width, height],
  );

  const constrainTranslate = useCallback(
    (x: number, y: number, s: number) => {
      const { maxX, maxY } = getMaxTranslate(s);
      return {
        x: clamp(x, -maxX, maxX),
        y: clamp(y, -maxY, maxY),
      };
    },
    [getMaxTranslate],
  );

  // Drag handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      didDrag.current = false;
      if (!interactionEnabled) return;
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      translateStart.current = { ...translate };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [translate, interactionEnabled],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
        didDrag.current = true;
      }
      setTranslate(
        constrainTranslate(
          translateStart.current.x + dx,
          translateStart.current.y + dy,
          scale,
        ),
      );
    },
    [isDragging, scale, constrainTranslate],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const showHint = useCallback((msg: string) => {
    setHint(msg);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(null), 2000);
  }, []);

  // On mobile, show hint when user tries to pinch while locked
  const handleMapTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!interactionEnabled && !compact && e.touches.length >= 2) {
        showHint("Desbloquea el mapa para interactuar");
      }
    },
    [interactionEnabled, compact, showHint],
  );

  // Wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!interactionEnabled) return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      setScale((s) => {
        const newScale = clamp(s * factor, 0.5, 6);
        setTranslate((t) => constrainTranslate(t.x, t.y, newScale));
        return newScale;
      });
    },
    [constrainTranslate, interactionEnabled],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Close popup on outside click
  useEffect(() => {
    if (!popup) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-map-popup]")) return;
      setPopup(null);
    };
    window.addEventListener("click", handleClickOutside, { capture: true });
    return () =>
      window.removeEventListener("click", handleClickOutside, {
        capture: true,
      });
  }, [popup]);

  const handleZoomIn = useCallback(() => {
    setScale((s) => {
      const newScale = Math.min(s * 1.4, 6);
      setTranslate((t) => constrainTranslate(t.x, t.y, newScale));
      return newScale;
    });
  }, [constrainTranslate]);

  const handleZoomOut = useCallback(() => {
    setScale((s) => {
      const newScale = Math.max(s / 1.4, 0.5);
      setTranslate((t) => constrainTranslate(t.x, t.y, newScale));
      return newScale;
    });
  }, [constrainTranslate]);

  const handleReset = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  // Tooltip handlers
  const handleMouseEnter = useCallback(
    (geo: any, e: React.MouseEvent) => {
      if (popup) return;
      const name: string | undefined = geo.properties?.name;
      const id: string | undefined = geo.properties?.id;
      if (!name) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const count = id ? cityCounts[id] || 0 : 0;
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        name,
        count,
      });
    },
    [cityCounts, popup],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!tooltip || popup) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setTooltip((prev) =>
        prev
          ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top }
          : null,
      );
    },
    [tooltip, popup],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // Open popup at a geography's centroid
  const openPopupForGeo = useCallback(
    (geo: any) => {
      const id: string | undefined = geo.properties?.id;
      const name: string | undefined = geo.properties?.name;
      if (!id || !name) return;

      const centroid = pathGenerator.centroid(geo);
      if (!centroid || isNaN(centroid[0])) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const svgEl = containerRef.current?.querySelector("svg");
      if (!svgEl) return;
      const svgRect = svgEl.getBoundingClientRect();
      const scaleX = svgRect.width / width;
      const scaleY = svgRect.height / height;
      const px =
        centroid[0] * scaleX * scale +
        translate.x +
        (rect.width - svgRect.width * scale) / 2;
      const py =
        centroid[1] * scaleY * scale +
        translate.y +
        (rect.height - svgRect.height * scale) / 2;

      const count = cityCounts[id] || 0;
      setTooltip(null);
      setPopup({ x: px, y: py, id, name, count });
    },
    [cityCounts, pathGenerator, scale, translate, width, height],
  );

  // Click handler
  const handleGeoClick = useCallback(
    (geo: any) => {
      if (didDrag.current) return;
      if (linkOnClick) {
        const id = geo.properties?.id;
        if (id) window.open(`/directorio/${id}`, "_blank", "noopener");
        return;
      }
      if (compact) return;
      openPopupForGeo(geo);
    },
    [compact, linkOnClick, openPopupForGeo],
  );

  // Sync sidebar selection → map popup
  const openPopupRef = useRef(openPopupForGeo);
  openPopupRef.current = openPopupForGeo;

  useEffect(() => {
    if (!selectedCity || compact) {
      setPopup(null);
      return;
    }
    const geo = geographiesRef.current.find(
      (g) => g.properties?.id === selectedCity,
    );
    if (geo) {
      openPopupRef.current(geo);
    } else {
      setPopup(null);
    }
  }, [selectedCity, compact]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        cursor: !interactionEnabled
          ? "default"
          : isDragging
            ? "grabbing"
            : "grab",
        touchAction: interactionEnabled ? "none" : "auto",
      }}
      onTouchStart={handleMapTouchStart}
    >
      <div
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.2s ease-out",
          width: "100%",
          height: "100%",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <ComposableMap
          width={width}
          height={height}
          projection={projection as any}
          projectionConfig={{}}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={TOPO_URL}>
            {({ geographies }) => {
              return (
                <>
                <GeographiesCapture geographies={geographies} geographiesRef={geographiesRef} />
                {geographies.map((geo) => {
                  const geoId = geo.properties?.id as string | undefined;
                  const isHighlighted =
                    (popup && popup.id === geoId) ||
                    (selectedCity && selectedCity === geoId);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleGeoClick(geo)}
                      onMouseEnter={(e) => handleMouseEnter(geo, e)}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: ACCENT,
                          fillOpacity: isHighlighted ? 0.15 : 0.05,
                          stroke: ACCENT,
                          strokeWidth: isHighlighted ? 1.4 : 1,
                          strokeOpacity: isHighlighted ? 1 : 0.6,
                          outline: "none",
                        },
                        hover: {
                          fill: ACCENT,
                          fillOpacity: 0.2,
                          stroke: ACCENT,
                          strokeWidth: 1.4,
                          strokeOpacity: 1,
                          outline: "none",
                          cursor: isDragging ? "grabbing" : "pointer",
                        },
                        pressed: {
                          fill: ACCENT,
                          fillOpacity: 0.3,
                          stroke: ACCENT,
                          strokeWidth: 1.4,
                          strokeOpacity: 1,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })}
              </>
              );
            }}
          </Geographies>
        </ComposableMap>
      </div>

      {/* Hover tooltip (hidden when popup is open) */}
      {tooltip && !popup && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x + 12,
            top: tooltip.y - 10,
            pointerEvents: "none",
            zIndex: 10,
          }}
          className="bg-[var(--color-elevated)] border border-[var(--color-border)] rounded px-2.5 py-1.5 shadow-lg"
        >
          <div className="text-xs font-mono font-semibold text-accent">
            {tooltip.name}
          </div>
          {tooltip.count > 0 && (
            <div className="text-2xs font-mono text-[var(--color-muted)]">
              {tooltip.count} {tooltip.count === 1 ? "proyecto" : "proyectos"}
            </div>
          )}
        </div>
      )}

      {/* Click popup */}
      {popup && (
        <div
          data-map-popup
          style={{
            position: "absolute",
            left: clamp(
              popup.x - 100,
              8,
              (containerRef.current?.offsetWidth ?? 800) - 208,
            ),
            top: clamp(
              popup.y - 120,
              8,
              (containerRef.current?.offsetHeight ?? 800) - 8,
            ),
            zIndex: 20,
            width: 200,
          }}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-[var(--color-border)] flex items-center justify-between">
            <span className="text-sm font-mono font-bold text-accent">
              {popup.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPopup(null);
              }}
              className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors text-xs leading-none"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          {popup.count > 0 ? (
            <div className="px-3 py-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--color-muted)]">
                  Proyectos
                </span>
                <span className="text-xs font-mono font-bold text-[var(--color-primary)]">
                  {popup.count}
                </span>
              </div>
              <a
                href={`/directorio/${popup.id}`}
                className="block w-full text-center text-xs font-mono font-semibold px-3 py-1.5 rounded bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
              >
                VER COMUNIDAD →
              </a>
            </div>
          ) : (
            <div className="px-3 py-2.5 space-y-2 text-center">
              <p className="text-xs text-[var(--color-muted)] font-mono">
                Aún no hay registros
              </p>
              <a
                href="/directorio/submit"
                className="block w-full text-center text-xs font-mono font-semibold px-3 py-1.5 rounded border border-dashed border-accent/40 text-accent hover:bg-accent/10 transition-colors"
              >
                REGISTRAR →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Interaction hint (mobile pinch while locked) */}
      {hint && !compact && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="px-4 py-2.5 rounded-lg bg-black/70 text-white text-sm font-mono shadow-lg">
            {hint}
          </div>
        </div>
      )}

      {/* Locked banner */}
      {!interactionEnabled && !compact && (
        <button
          type="button"
          onClick={() => setInteractionEnabled(true)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-card)]/90 border border-[var(--color-border)] shadow-lg text-xs font-mono text-[var(--color-muted)] hover:text-accent hover:border-accent transition-colors cursor-pointer backdrop-blur-sm"
        >
          <Lock size={12} />
          Toca para interactuar
        </button>
      )}

      {/* Zoom controls */}
      {!compact && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
          <button
            onClick={() => setInteractionEnabled((v) => !v)}
            className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
              interactionEnabled
                ? "bg-accent text-[var(--color-accent-foreground)] border-accent"
                : "bg-[var(--color-elevated)] border-[var(--color-border)] text-[var(--color-muted)] hover:text-accent hover:border-accent"
            }`}
            aria-label={
              interactionEnabled ? "Bloquear mapa" : "Desbloquear mapa"
            }
            title={
              interactionEnabled ? "Bloquear pan/zoom" : "Desbloquear pan/zoom"
            }
          >
            {interactionEnabled ? <Unlock size={16} /> : <Lock size={16} />}
          </button>
          <button
            onClick={handleZoomIn}
            disabled={!interactionEnabled}
            className="w-9 h-9 rounded-lg bg-[var(--color-elevated)] border border-[var(--color-border)] text-[var(--color-primary)] hover:text-accent hover:border-accent disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center justify-center"
            aria-label="Acercar"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleZoomOut}
            disabled={!interactionEnabled}
            className="w-9 h-9 rounded-lg bg-[var(--color-elevated)] border border-[var(--color-border)] text-[var(--color-primary)] hover:text-accent hover:border-accent disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center justify-center"
            aria-label="Alejar"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={handleReset}
            disabled={!interactionEnabled}
            className="w-9 h-9 rounded-lg bg-[var(--color-elevated)] border border-[var(--color-border)] text-[var(--color-primary)] hover:text-accent hover:border-accent disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center justify-center"
            aria-label="Resetear zoom"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
