import { useState, useEffect } from "react";
import type { TechEvent } from "../../utils";

interface Props {
  eventsByDate: Record<string, TechEvent[]>;
}

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

  // getDay() returns 0=Sun, we want 0=Mon
  let startWeekday = firstDay.getDay() - 1;
  if (startWeekday < 0) startWeekday = 6;

  return { daysInMonth, startWeekday };
}

export default function EventCalendar({ eventsByDate }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
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
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  // Navigate calendar when sidebar event is clicked
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

  // Collect days with events for mobile list view
  const daysWithEvents: {
    day: number;
    dateKey: string;
    events: TechEvent[];
  }[] = [];
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
          <svg
            className="w-4 h-4 text-[var(--color-primary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h3 className="text-lg font-sans font-bold text-[var(--color-primary)]">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg border border-border bg-card/90 hover:bg-[var(--color-elevated)] transition-colors"
          aria-label="Mes siguiente"
        >
          <svg
            className="w-4 h-4 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
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
              className="min-h-25 border-b border-r border-[var(--color-border)] bg-[var(--color-elevated)]/30"
            />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const key = toDateKey(year, month, day);
            const dayEvents = eventsByDate[key] ?? [];
            const isToday = day === todayKey;
            const overflow =
              dayEvents.length > MAX_PILLS ? dayEvents.length - MAX_PILLS : 0;

            return (
              <div
                key={day}
                className={`min-h-25 border-b border-r border-[var(--color-border)] p-1.5 ${
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
                  {dayEvents.slice(0, MAX_PILLS).map((ev) => (
                    <button
                      key={`${ev.date}-${ev.title}`}
                      onClick={() => window.dispatchEvent(new CustomEvent("open-event-detail", { detail: ev }))}
                      className="w-full text-left px-1.5 py-0.5 text-2xs font-sans font-medium rounded bg-[var(--color-accent)]/15 text-[var(--color-accent)] truncate hover:bg-[var(--color-accent)]/25 transition-colors cursor-pointer"
                      title={ev.title}
                    >
                      {ev.title}
                    </button>
                  ))}
                  {overflow > 0 && (
                    <span className="block text-2xs font-mono text-[var(--color-muted)] pl-1.5">
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
                {evs.map((ev) => (
                  <button
                    key={`${ev.date}-${ev.title}`}
                    onClick={() => window.dispatchEvent(new CustomEvent("open-event-detail", { detail: ev }))}
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

    </div>
  );
}
