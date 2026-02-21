import { useState } from "react";

interface TechEvent {
  title: string;
  organizer: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  url: string;
  location: string;
  mapsUrl: string;
  isInPerson: boolean;
  calendarLink: string;
  meetLink: string;
}

interface Props {
  eventsByDate: Record<string, TechEvent[]>;
}

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const MAX_PILLS = 2;

function buildGoogleCalendarUrl(ev: TechEvent): string {
  const params = new URLSearchParams({ action: "TEMPLATE", text: ev.title });

  // date is YYYY-MM-DD, times are like "8:30" or "11:00"
  const dateClean = ev.date.replace(/-/g, "");

  if (ev.startTime) {
    const fmtTime = (t: string) => {
      const [h, m] = t.split(":");
      return h.padStart(2, "0") + (m ?? "00").padStart(2, "0") + "00";
    };
    const start = `${dateClean}T${fmtTime(ev.startTime)}`;
    const end = ev.endTime
      ? `${dateClean}T${fmtTime(ev.endTime)}`
      : `${dateClean}T${fmtTime(ev.startTime)}`;
    params.set("dates", `${start}/${end}`);
    // CDMX timezone
    params.set("ctz", "America/Mexico_City");
  } else {
    // All-day event: YYYYMMDD/YYYYMMDD (next day)
    const d = new Date(ev.date + "T00:00:00");
    d.setDate(d.getDate() + 1);
    const nextDay = d.toISOString().slice(0, 10).replace(/-/g, "");
    params.set("dates", `${dateClean}/${nextDay}`);
  }

  if (ev.description) params.set("details", ev.description);
  if (ev.location) params.set("location", ev.location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // getDay() returns 0=Sun, we want 0=Mon
  let startWeekday = firstDay.getDay() - 1;
  if (startWeekday < 0) startWeekday = 6;

  return { daysInMonth, startWeekday };
}

export default function EventCalendar({ eventsByDate }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedEvent, setSelectedEvent] = useState<TechEvent | null>(null);

  const { daysInMonth, startWeekday } = getMonthDays(year, month);

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
    setSelectedEvent(null);
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedEvent(null);
  }

  // Collect days with events for mobile list view
  const daysWithEvents: { day: number; dateKey: string; events: TechEvent[] }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const key = toDateKey(year, month, d);
    const evs = eventsByDate[key];
    if (evs && evs.length > 0) {
      daysWithEvents.push({ day: d, dateKey: key, events: evs });
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg border border-[var(--color-border)] bg-card/90 hover:bg-[var(--color-elevated)] transition-colors"
          aria-label="Mes anterior"
        >
          <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-sans font-bold text-[var(--color-primary)]">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg border border-[var(--color-border)] bg-card/90 hover:bg-[var(--color-elevated)] transition-colors"
          aria-label="Mes siguiente"
        >
          <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:block bg-card/90 backdrop-blur-sm border border-[var(--color-border)] rounded-lg overflow-hidden">
        {/* Weekday header */}
        <div className="grid grid-cols-7 border-b border-[var(--color-border)]">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-mono font-semibold uppercase tracking-wider text-[var(--color-muted)]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {/* Empty cells for offset */}
          {Array.from({ length: startWeekday }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="min-h-[100px] border-b border-r border-[var(--color-border)] bg-[var(--color-elevated)]/30"
            />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const key = toDateKey(year, month, day);
            const dayEvents = eventsByDate[key] ?? [];
            const isToday = day === todayKey;
            const overflow = dayEvents.length > MAX_PILLS ? dayEvents.length - MAX_PILLS : 0;

            return (
              <div
                key={day}
                className={`min-h-[100px] border-b border-r border-[var(--color-border)] p-1.5 ${
                  isToday ? "bg-[var(--color-accent)]/5" : ""
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 text-xs font-mono rounded-full ${
                    isToday
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-bold"
                      : "text-[var(--color-primary)]"
                  }`}
                >
                  {day}
                </span>

                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, MAX_PILLS).map((ev, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedEvent(ev)}
                      className="w-full text-left px-1.5 py-0.5 text-[10px] font-sans font-medium rounded bg-[var(--color-accent)]/15 text-[var(--color-accent)] truncate hover:bg-[var(--color-accent)]/25 transition-colors cursor-pointer"
                      title={ev.title}
                    >
                      {ev.title}
                    </button>
                  ))}
                  {overflow > 0 && (
                    <span className="block text-[10px] font-mono text-[var(--color-muted)] pl-1.5">
                      +{overflow} más
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile list view */}
      <div className="md:hidden space-y-3">
        {daysWithEvents.length > 0 ? (
          daysWithEvents.map(({ day, events: evs }) => (
            <div
              key={day}
              className="bg-card/90 backdrop-blur-sm border border-[var(--color-border)] rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 text-xs font-mono rounded-full ${
                    day === todayKey
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-bold"
                      : "bg-[var(--color-elevated)] text-[var(--color-primary)]"
                  }`}
                >
                  {day}
                </span>
                <span className="text-sm font-sans font-medium text-[var(--color-primary)]">
                  {new Date(year, month, day).toLocaleDateString("es-MX", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <div className="space-y-2">
                {evs.map((ev, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedEvent(ev)}
                    className="w-full text-left p-2 rounded-lg bg-[var(--color-elevated)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-colors"
                  >
                    <p className="text-sm font-sans font-medium text-[var(--color-accent)]">
                      {ev.title}
                    </p>
                    {(ev.startTime || ev.organizer) && (
                      <p className="text-xs font-mono text-[var(--color-muted)] mt-0.5">
                        {[
                          ev.startTime && ev.endTime
                            ? `${ev.startTime}–${ev.endTime}`
                            : ev.startTime || ev.endTime,
                          ev.organizer,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card/90 backdrop-blur-sm border border-[var(--color-border)] rounded-lg p-8 text-center">
            <p className="text-sm font-mono text-[var(--color-muted)]">
              Sin eventos este mes
            </p>
          </div>
        )}
      </div>

      {/* Event detail modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg max-w-md w-full p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-sans font-bold text-[var(--color-primary)] pr-4">
                {selectedEvent.title}
              </h4>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded hover:bg-[var(--color-elevated)] transition-colors shrink-0"
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2 text-sm">
              {(selectedEvent.organizer || selectedEvent.startTime) && (
                <p className="font-mono text-[var(--color-muted)]">
                  {[
                    selectedEvent.organizer,
                    selectedEvent.startTime && selectedEvent.endTime
                      ? `${selectedEvent.startTime}–${selectedEvent.endTime}`
                      : selectedEvent.startTime || selectedEvent.endTime,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}

              {selectedEvent.location && (
                <p className="text-[var(--color-secondary)]">
                  📍 {selectedEvent.location}
                  {selectedEvent.isInPerson && (
                    <span className="ml-2 inline-block text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                      Presencial
                    </span>
                  )}
                </p>
              )}

              {selectedEvent.description && (
                <p className="text-[var(--color-secondary)] whitespace-pre-line text-xs mt-2 max-h-40 overflow-y-auto">
                  {selectedEvent.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--color-border)] mt-3">
                {selectedEvent.url && (
                  <a
                    href={selectedEvent.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-lg bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:opacity-90 transition-opacity"
                  >
                    Sitio web
                  </a>
                )}
                {selectedEvent.mapsUrl && (
                  <a
                    href={selectedEvent.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-elevated)] transition-colors"
                  >
                    Google Maps
                  </a>
                )}
                <a
                  href={buildGoogleCalendarUrl(selectedEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-elevated)] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Agregar a calendario
                </a>
                {selectedEvent.meetLink && (
                  <a
                    href={selectedEvent.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-elevated)] transition-colors"
                  >
                    Meet/Zoom
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
