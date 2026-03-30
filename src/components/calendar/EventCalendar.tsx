'use client'

import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { useEventsData } from "@/hooks/useEventsData";
import { openEventDetail, EVENT_DETAIL_EVENT } from "@/lib/event-bus";
import UpcomingEventsSidebar from "./UpcomingEventsSidebar";

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

export default function EventCalendar() {
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
    window.addEventListener(EVENT_DETAIL_EVENT, handler);
    return () => window.removeEventListener(EVENT_DETAIL_EVENT, handler);
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
    <div className="grid lg:grid-cols-9 gap-4 overflow-hidden">
      {/* Left column — desktop only */}
      <div className="hidden md:block lg:col-span-5 min-w-0">
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
                        {dayEvents.slice(0, MAX_PILLS).map((ev, j) => (
                          <button
                            key={`${j}-${ev.date}-${ev.title}`}
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
      <UpcomingEventsSidebar events={events} status={status} refetch={refetch} />
    </div>
  );
}
