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
  Ticket,
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

  const hasImage = !!event.image;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={() => setEvent(null)}
    >
      <div
        className={`bg-card border border-border rounded-xl w-full shadow-2xl overflow-hidden ${hasImage ? "max-w-4xl md:min-h-80" : "max-w-lg"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={hasImage ? "md:grid md:grid-cols-5" : ""}>
          {/* Left column: image */}
          {hasImage && (
            <div className="md:col-span-2 bg-elevated">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
          )}

          {/* Right column: content */}
          <div className={`flex flex-col ${hasImage ? "md:col-span-3" : ""}`}>
            {/* Header */}
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-lg font-sans font-bold text-primary">
                  {event.title}
                </h4>
                <button
                  onClick={() => setEvent(null)}
                  className="p-1.5 rounded-lg hover:bg-elevated transition-colors shrink-0"
                  aria-label="Cerrar"
                >
                  <X size={18} className="text-muted" />
                </button>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                {event.organizer && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted">
                    <Users size={12} />
                    {event.organizer}
                  </span>
                )}
                {(event.startTime || event.endTime) && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted">
                    <Clock size={12} />
                    {event.startTime && event.endTime
                      ? `${event.startTime}–${event.endTime}`
                      : event.startTime || event.endTime}
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="px-5 space-y-3">
              {event.location && (
                <div className="flex items-start gap-2 text-sm text-secondary">
                  <MapPin
                    size={14}
                    className="shrink-0 mt-0.5 text-muted"
                  />
                  <span>
                    {event.location}
                    {event.isInPerson && (
                      <span className="ml-2 inline-block text-2xs font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/15 text-accent">
                        Presencial
                      </span>
                    )}
                  </span>
                </div>
              )}

              {event.description && (
                <p className="text-secondary whitespace-pre-line text-xs max-h-40 overflow-y-auto leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>

            {/* Spacer pushes actions to bottom */}
            <div className="grow" />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2 px-5 pt-3 pb-5 border-t border-border mt-3">
                {event.registerUrl && (
                  <a
                    href={event.registerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                  >
                    <Ticket size={13} />
                    Registrarse
                  </a>
                )}
                {event.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-2 rounded-lg border border-border text-primary hover:bg-elevated transition-colors"
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
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-2 rounded-lg border border-border text-primary hover:bg-elevated transition-colors"
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
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-2 rounded-lg border border-border text-primary hover:bg-elevated transition-colors"
                  >
                    <Video size={13} />
                    Meet/Zoom
                  </a>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
