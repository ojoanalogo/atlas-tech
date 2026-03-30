import { useState, useEffect } from "react";
import { CalendarDays, Clock, MapPin, ArrowRight, RefreshCw, Ticket, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import EventTypeBadge from "./EventTypeBadge";
import type { TechEvent } from "@/hooks/useEventsData";
import { openEventDetail } from "@/lib/event-bus";

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

const PAGE_SIZE = 2;

export default function UpcomingEventsSidebar({
  events,
  status,
  refetch,
}: {
  events: TechEvent[];
  status: string;
  refetch: () => void;
}) {
  const [page, setPage] = useState(0);

  const todayStr = new Date().toISOString().slice(0, 10);
  const upcoming = events
    .filter((ev) => ev.date >= todayStr)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime),
    );

  const totalPages = Math.ceil(upcoming.length / PAGE_SIZE);
  const pageEvents = upcoming.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset to first page when events change
  useEffect(() => {
    setPage(0);
  }, [events.length]);

  return (
    <div className="lg:col-span-4 space-y-4 min-w-0">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays className="w-5 h-5 text-accent shrink-0" />
          <h2 className="text-xl md:text-2xl font-sans font-bold text-primary">
            Próximos eventos
          </h2>
          <button
            onClick={refetch}
            disabled={status === "loading"}
            className="ml-auto p-1.5 rounded-md text-muted hover:text-accent hover:bg-elevated transition-colors disabled:opacity-50"
            aria-label="Actualizar eventos"
            title="Actualizar eventos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${status === "loading" ? "animate-spin" : ""}`} />
          </button>
        </div>
        <p className="text-sm text-secondary pl-7">
          Lo que viene en el ecosistema tech de Sinaloa
        </p>
      </div>

      <div className="space-y-2">
        {events.length === 0 && status === "loading" ? (
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="h-32 bg-elevated animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 rounded bg-elevated animate-pulse" />
                <div className="flex gap-3">
                  <div className="h-3 w-16 rounded bg-elevated animate-pulse" />
                  <div className="h-3 w-14 rounded bg-elevated animate-pulse" />
                </div>
                <div className="h-3 w-24 rounded bg-elevated animate-pulse" />
              </div>
            </div>
          ))
        ) : pageEvents.length > 0 ? (
          pageEvents.map((ev, i) => (
            <button
              key={`${i}-${ev.date}-${ev.title}`}
              type="button"
              onClick={() => openEventDetail(ev)}
              aria-label={`Ver detalles: ${ev.title}`}
              className="block w-full text-left bg-card border border-border rounded-lg overflow-hidden transition-all duration-200 hover:border-accent/30 hover:shadow-xs group cursor-pointer"
            >
              {ev.image && (
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="p-4 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start flex-wrap gap-1.5">
                      <span className="text-sm font-sans font-semibold text-primary group-hover:text-accent transition-colors line-clamp-1">
                        {ev.title}
                      </span>
                      <EventTypeBadge isInPerson={ev.isInPerson} />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-xs text-muted font-mono">
                        <CalendarDays className="w-3 h-3 shrink-0" />
                        {formatDate(ev.date)}
                      </span>
                      {ev.startTime && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted font-mono">
                          <Clock className="w-3 h-3 shrink-0" />
                          {ev.startTime}
                          {ev.endTime ? `–${ev.endTime}` : ""}
                        </span>
                      )}
                      {ev.location && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted font-mono truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {ev.location}
                        </span>
                      )}
                    </div>
                    {ev.organizer && (
                      <p className="text-xs text-secondary mt-1">
                        {ev.organizer}
                      </p>
                    )}
                    {ev.registerUrl && (
                      <a
                        href={ev.registerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 mt-2 text-xs font-mono font-semibold px-3 py-1.5 rounded-md bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                      >
                        <Ticket className="w-3 h-3" />
                        Registrarse
                      </a>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0 mt-1 text-muted group-hover:text-accent transition-colors" />
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center space-y-3">
            <CalendarDays className="w-10 h-10 text-muted/50 mx-auto" />
            <p className="text-sm text-muted font-mono">
              Sin eventos próximos
            </p>
            <p className="text-xs text-secondary">
              ¿Conoces algún evento tech en Sinaloa? Ayúdanos a mantener el calendario actualizado.
            </p>
            <a
              href="mailto:alfonso@molecula.digital?subject=Sugerencia de evento para Tech Atlas"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-accent hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              Sugerir un evento
            </a>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2" aria-label="Paginación de eventos">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="p-2.5 rounded-lg border border-border text-muted hover:text-accent hover:bg-elevated transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-10 h-10 text-sm font-mono rounded-lg border transition-colors ${
                i === page
                  ? "bg-accent text-accent-foreground border-accent font-bold"
                  : "border-border text-muted hover:text-accent hover:bg-elevated"
              }`}
              aria-label={`Página ${i + 1}`}
              aria-current={i === page ? "page" : undefined}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages - 1}
            className="p-2.5 rounded-lg border border-border text-muted hover:text-accent hover:bg-elevated transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Página siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </nav>
      )}
    </div>
  );
}
