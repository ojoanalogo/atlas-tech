import React from "react";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export interface PopupState {
  x: number;
  y: number;
  id: string;
  name: string;
  count: number;
}

interface MapPopupProps {
  popup: PopupState;
  containerWidth: number;
  containerHeight: number;
  onClose: () => void;
}

export default function MapPopup({
  popup,
  containerWidth,
  containerHeight,
  onClose,
}: MapPopupProps) {
  return (
    <div
      data-map-popup
      style={{
        position: "absolute",
        left: clamp(popup.x - 100, 8, containerWidth - 208),
        top: clamp(popup.y - 120, 8, containerHeight - 8),
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
            onClose();
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
  );
}
