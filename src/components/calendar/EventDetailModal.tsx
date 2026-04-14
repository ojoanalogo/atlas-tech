'use client'

import { useState, useEffect, useRef, useCallback } from "react";
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
  Maximize2,
} from "lucide-react";
import type { TechEvent } from "@/hooks/useEventsData";
import { EVENT_DETAIL_EVENT } from "@/lib/event-bus";

export default function EventDetailModal() {
  const [event, setEvent] = useState<TechEvent | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.title) setEvent(detail as TechEvent);
    };
    window.addEventListener(EVENT_DETAIL_EVENT, handler);
    return () => window.removeEventListener(EVENT_DETAIL_EVENT, handler);
  }, []);

  useEffect(() => {
    if (event && contentRef.current) {
      contentRef.current.focus();
    }
  }, [event]);

  const close = useCallback(() => {
    setEvent(null);
    setShowFullImage(false);
  }, []);

  if (!event) return null;

  const hasImage = !!event.image;
  const hasActions = !!(event.registerUrl || event.url || event.mapsUrl || event.meetLink);

  if (showFullImage && hasImage) {
    return createPortal(
      <div
        className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out"
        onClick={() => setShowFullImage(false)}
      >
        <button
          onClick={() => setShowFullImage(false)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Cerrar imagen"
        >
          <X size={20} className="text-white" />
        </button>
        <img
          src={event.image!}
          alt={event.title}
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        />
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={close}
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        className="bg-card border border-border rounded-xl w-full max-w-lg shadow-2xl overflow-hidden outline-none max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image banner — blur backdrop fills dead space for any aspect ratio */}
        {hasImage && (
          <div className="relative h-48 overflow-hidden shrink-0 bg-black/10">
            <img
              src={event.image!}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40"
            />
            <img
              src={event.image!}
              alt={event.title}
              className="relative z-10 w-full h-full object-contain"
            />
            <button
              onClick={() => setShowFullImage(true)}
              className="absolute bottom-2 right-2 z-20 inline-flex items-center gap-1.5 text-2xs font-mono px-2 py-1 rounded-md bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
            >
              <Maximize2 size={11} />
              Ver imagen
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 min-h-0">
          {/* Header */}
          <div className="px-5 pt-5 pb-3 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-lg font-sans font-bold text-primary">
                {event.title}
              </h4>
              <button
                onClick={close}
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
          <div className="px-5 pb-5 space-y-3">
            {event.location && (
              <div className="flex items-start gap-2 text-sm text-secondary">
                <MapPin size={14} className="shrink-0 mt-0.5 text-muted" />
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
              <p className="text-secondary whitespace-pre-line text-xs leading-relaxed">
                {event.description}
              </p>
            )}
          </div>
        </div>

        {/* Sticky footer — always visible regardless of content length */}
        {(hasActions || true) && (
          <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2 px-5 py-4 border-t border-border shrink-0">
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
        )}
      </div>
    </div>,
    document.body,
  );
}
