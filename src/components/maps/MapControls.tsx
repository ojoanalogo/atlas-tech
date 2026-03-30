import React from "react";
import { ZoomIn, ZoomOut, RotateCcw, Lock, Unlock } from "lucide-react";

interface MapControlsProps {
  interactionEnabled: boolean;
  onToggleLock: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export default function MapControls({
  interactionEnabled,
  onToggleLock,
  onZoomIn,
  onZoomOut,
  onReset,
}: MapControlsProps) {
  return (
    <>
      {/* Locked banner */}
      {!interactionEnabled && (
        <button
          type="button"
          onClick={() => onToggleLock()}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-card)]/90 border border-[var(--color-border)] shadow-lg text-xs font-mono text-[var(--color-muted)] hover:text-accent hover:border-accent transition-colors cursor-pointer backdrop-blur-sm"
        >
          <Lock size={12} />
          Toca para interactuar
        </button>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
        <button
          onClick={onToggleLock}
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
          onClick={onZoomIn}
          disabled={!interactionEnabled}
          className="w-9 h-9 rounded-lg bg-[var(--color-elevated)] border border-[var(--color-border)] text-[var(--color-primary)] hover:text-accent hover:border-accent disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center justify-center"
          aria-label="Acercar"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={onZoomOut}
          disabled={!interactionEnabled}
          className="w-9 h-9 rounded-lg bg-[var(--color-elevated)] border border-[var(--color-border)] text-[var(--color-primary)] hover:text-accent hover:border-accent disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center justify-center"
          aria-label="Alejar"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={onReset}
          disabled={!interactionEnabled}
          className="w-9 h-9 rounded-lg bg-[var(--color-elevated)] border border-[var(--color-border)] text-[var(--color-primary)] hover:text-accent hover:border-accent disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center justify-center"
          aria-label="Resetear zoom"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </>
  );
}
