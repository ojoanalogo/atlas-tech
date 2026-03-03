import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  Map,
  Video,
} from "lucide-react";
import type { TechEvent } from "../../utils";

export default function EventDetailModal() {
  const [event, setEvent] = useState<TechEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.title) setEvent(detail as TechEvent);
    };
    window.addEventListener("open-event-detail", handler);
    return () => window.removeEventListener("open-event-detail", handler);
  }, []);

  if (!event) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={() => setEvent(null)}
    >
      <div
        className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl max-w-lg w-full shadow-2xl overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-lg font-sans font-bold text-[var(--color-primary)]">
              {event.title}
            </h4>
            <button
              onClick={() => setEvent(null)}
              className="p-1.5 rounded-lg hover:bg-[var(--color-elevated)] transition-colors shrink-0"
              aria-label="Cerrar"
            >
              <X size={18} className="text-[var(--color-muted)]" />
            </button>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
            {event.organizer && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-muted)]">
                <Users size={12} />
                {event.organizer}
              </span>
            )}
            {(event.startTime || event.endTime) && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-muted)]">
                <Clock size={12} />
                {event.startTime && event.endTime
                  ? `${event.startTime}–${event.endTime}`
                  : event.startTime || event.endTime}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 pb-4 space-y-3">
          {event.location && (
            <div className="flex items-start gap-2 text-sm text-[var(--color-secondary)]">
              <MapPin
                size={14}
                className="shrink-0 mt-0.5 text-[var(--color-muted)]"
              />
              <span>
                {event.location}
                {event.isInPerson && (
                  <span className="ml-2 inline-block text-2xs font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                    Presencial
                  </span>
                )}
              </span>
            </div>
          )}

          {event.description && (
            <p className="text-[var(--color-secondary)] whitespace-pre-line text-xs max-h-40 overflow-y-auto leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-3 border-t border-[var(--color-border)]">
            {event.url && (
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:opacity-90 transition-opacity"
              >
                <ExternalLink size={13} />
                Sitio web
              </a>
            )}
            {event.mapsUrl && (
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-elevated)] transition-colors"
              >
                <Map size={13} />
                Google Maps
              </a>
            )}
            <div
              id="atcb-mount"
              data-event={JSON.stringify({
                name: event.title,
                description: event.description,
                startDate: event.date,
                startTime: event.startTime,
                endTime: event.endTime,
                location: event.location,
              })}
            />
            {event.meetLink && (
              <a
                href={event.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-elevated)] transition-colors"
              >
                <Video size={13} />
                Meet/Zoom
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
