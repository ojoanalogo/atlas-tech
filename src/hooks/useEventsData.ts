import { useState, useEffect, useCallback } from "react";
import { EVENTS_SHEET_CSV_URL } from "../config";
import { parseEventsCSV } from "../utils";
import type { TechEvent } from "../utils";

const CACHE_KEY = "atlas_events_csv";
const CACHE_TS_KEY = "atlas_events_csv_ts";
const STALE_MS = 60 * 60 * 1000; // 1 hour

type Status = "loading" | "cached" | "fresh" | "error";

export interface UseEventsDataResult {
  events: TechEvent[];
  eventsByDate: Record<string, TechEvent[]>;
  status: Status;
  refetch: () => void;
}

function groupByDate(events: TechEvent[]): Record<string, TechEvent[]> {
  const map: Record<string, TechEvent[]> = {};
  for (const ev of events) {
    if (!map[ev.date]) map[ev.date] = [];
    map[ev.date].push(ev);
  }
  return map;
}

export function useEventsData(): UseEventsDataResult {
  const [events, setEvents] = useState<TechEvent[]>([]);
  const [eventsByDate, setEventsByDate] = useState<Record<string, TechEvent[]>>(
    {},
  );
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    // 1. Try to load from cache immediately
    const cachedCsv = localStorage.getItem(CACHE_KEY);
    const cachedTs = localStorage.getItem(CACHE_TS_KEY);
    const cacheAge = cachedTs ? Date.now() - Number(cachedTs) : Infinity;

    if (cachedCsv) {
      const parsed = parseEventsCSV(cachedCsv);
      setEvents(parsed);
      setEventsByDate(groupByDate(parsed));
      setStatus("cached");

      // Cache is fresh — no need to refetch
      if (cacheAge < STALE_MS) {
        return;
      }
    }

    // 2. Fetch fresh data in background
    fetch(EVENTS_SHEET_CSV_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((freshCsv) => {
        if (cancelled) return;

        // Only update state if the CSV actually changed
        if (freshCsv !== cachedCsv) {
          const parsed = parseEventsCSV(freshCsv);
          setEvents(parsed);
          setEventsByDate(groupByDate(parsed));
        }

        localStorage.setItem(CACHE_KEY, freshCsv);
        localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
        setStatus("fresh");
      })
      .catch(() => {
        if (cancelled) return;
        // If we have cached data, keep showing it
        if (!cachedCsv) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const refetch = useCallback(() => {
    setStatus("loading");
    fetch(EVENTS_SHEET_CSV_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((freshCsv) => {
        const parsed = parseEventsCSV(freshCsv);
        setEvents(parsed);
        setEventsByDate(groupByDate(parsed));
        localStorage.setItem(CACHE_KEY, freshCsv);
        localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
        setStatus("fresh");
      })
      .catch(() => {
        if (events.length > 0) {
          setStatus("cached");
        } else {
          setStatus("error");
        }
      });
  }, [events.length]);

  return { events, eventsByDate, status, refetch };
}
