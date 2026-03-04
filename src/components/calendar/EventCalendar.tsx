import { useState, useEffect } from "react";
import { CalendarDays, Clock, MapPin, ArrowRight, RefreshCw, Ticket, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { useEventsData } from "../../hooks/useEventsData";
import type { TechEvent } from "../../utils";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const MAX_PILLS = 2;

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  let startWeekday = firstDay.getDay() - 1;
  if (startWeekday < 0) startWeekday = 6;

  return { daysInMonth, startWeekday };
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

function openEventDetail(ev: TechEvent) {
  window.dispatchEvent(new CustomEvent("open-event-detail", { detail: ev }));
}

function EventTypeBadge({ isInPerson }: { isInPerson: boolean }) {
  return (
    <span
      className={`text-2xs font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded whitespace-nowrap ${
        isInPerson
          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
      }`}
    >
      {isInPerson ? "Presencial" : "Virtual"}
    </span>
  );
}

const PAGE_SIZE = 2;

function UpcomingEventsSidebar({
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

export { UpcomingEventsSidebar };

export default function EventCalendar({ calendarOnly = false }: { calendarOnly?: boolean }) {
  const { events, eventsByDate, status, refetch } = useEventsData();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const { daysInMonth, startWeekday } = getMonthDays(year, month);

  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth();

  const today = new Date();
  const todayKey =
    today.getFullYear() === year && today.getMonth() === month
      ? today.getDate()
      : -1;

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  function jumpToCurrentMonth() {
    const n = new Date();
    setYear(n.getFullYear());
    setMonth(n.getMonth());
  }

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.date) {
        const [y, m] = (detail.date as string).split("-").map(Number);
        if (y && m) {
          setYear(y);
          setMonth(m - 1);
        }
      }
    };
    window.addEventListener("open-event-detail", handler);
    return () => window.removeEventListener("open-event-detail", handler);
  }, []);

  const isLoading = status === "loading" && events.length === 0;

  function MonthNav({ className = "" }: { className?: string }) {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg border border-border bg-card hover:bg-elevated transition-colors"
          aria-label="Mes anterior"
        >
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-sans font-bold text-primary">
            {MONTH_NAMES[month]} {year}
          </h3>
          {!isCurrentMonth && (
            <button
              onClick={jumpToCurrentMonth}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-sans font-medium rounded-md border border-border bg-card hover:bg-elevated text-accent transition-colors"
              aria-label="Saltar a mes actual"
            >
              <CalendarDays className="w-3 h-3" />
              Hoy
            </button>
          )}
        </div>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg border border-border bg-card hover:bg-elevated transition-colors"
          aria-label="Mes siguiente"
        >
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={`grid ${calendarOnly ? "" : "lg:grid-cols-9"} gap-4 overflow-hidden`}>
      {/* Left column — desktop only */}
      <div className={`hidden md:block ${calendarOnly ? "" : "lg:col-span-5"} min-w-0`}>
        {/* Desktop calendar */}
        <div className="bg-card border border-border rounded-lg p-4">
          <MonthNav className="mb-4" />

          {isLoading ? (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-7 border-b border-border">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="py-2 text-center text-xs font-mono font-semibold uppercase tracking-wider text-muted">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="min-h-25 border-b border-r border-border p-1.5">
                    <div className="w-6 h-6 rounded-full bg-elevated animate-pulse" />
                    {i % 7 === 2 && <div className="mt-2 h-4 w-4/5 rounded bg-elevated animate-pulse" />}
                    {i % 7 === 5 && <div className="mt-2 h-4 w-3/5 rounded bg-elevated animate-pulse" />}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-card backdrop-blur-sm border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-7 border-b border-border">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="py-2 text-center text-xs font-mono font-semibold uppercase tracking-wider text-muted">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {Array.from({ length: startWeekday }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-25 border-b border-r border-border bg-elevated/30" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const key = toDateKey(year, month, day);
                  const dayEvents = eventsByDate[key] ?? [];
                  const isToday = day === todayKey;
                  const overflow = dayEvents.length > MAX_PILLS ? dayEvents.length - MAX_PILLS : 0;

                  return (
                    <div
                      key={day}
                      className={`min-h-25 border-b border-r border-border p-1.5 ${isToday ? "bg-accent/5" : ""}`}
                    >
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 text-xs font-mono rounded-full ${
                          isToday
                            ? "bg-accent text-accent-foreground font-bold"
                            : "text-primary"
                        }`}
                      >
                        {day}
                      </span>

                      <div className="mt-1 space-y-0.5">
                        {dayEvents.slice(0, MAX_PILLS).map((ev, i) => (
                          <button
                            key={`${i}-${ev.date}-${ev.title}`}
                            onClick={() => openEventDetail(ev)}
                            className="w-full text-left px-1.5 py-0.5 text-2xs font-sans font-medium rounded bg-accent/15 text-accent truncate hover:bg-accent/25 transition-colors cursor-pointer"
                            title={ev.title}
                          >
                            {ev.title}
                          </button>
                        ))}
                        {overflow > 0 && (
                          <span className="block text-2xs font-mono text-muted pl-1.5">
                            +{overflow} más
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Right: Upcoming events sidebar */}
      {!calendarOnly && (
        <UpcomingEventsSidebar events={events} status={status} refetch={refetch} />
      )}
    </div>
  );
}
