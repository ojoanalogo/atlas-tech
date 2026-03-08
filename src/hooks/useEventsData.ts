import { useState, useEffect, useCallback, useRef } from "react";
import { EVENTS_SHEET_CSV_URL } from "../config";
import { parseEventsCSV } from "../utils";
import type { TechEvent } from "../utils";

const CACHE_KEY = "atlas_events_csv";
const CACHE_TS_KEY = "atlas_events_csv_ts";
const STALE_MS = 60 * 60 * 1000; // 1 hour
const EVENTS_UPDATED_EVENT = "atlas-events-updated";

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
  // Track the last CSV this instance has parsed to avoid redundant re-parses
  const currentCsvRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // 1. Try to load from cache immediately
    const cachedCsv = localStorage.getItem(CACHE_KEY);
    const cachedTs = localStorage.getItem(CACHE_TS_KEY);
    const cacheAge = cachedTs ? Date.now() - Number(cachedTs) : Infinity;

    if (cachedCsv) {
      const parsed = parseEventsCSV(cachedCsv);
      currentCsvRef.current = cachedCsv;
      setEvents(parsed);
      setEventsByDate(groupByDate(parsed));
      setStatus("cached");
    }

    // Listen for updates dispatched by other islands in the same page
    const onUpdated = () => {
      const csv = localStorage.getItem(CACHE_KEY);
      if (csv && csv !== currentCsvRef.current) {
        currentCsvRef.current = csv;
        const parsed = parseEventsCSV(csv);
        setEvents(parsed);
        setEventsByDate(groupByDate(parsed));
        setStatus("fresh");
      }
    };
    window.addEventListener(EVENTS_UPDATED_EVENT, onUpdated);

    // Cache is fresh — no need to refetch, but keep listener alive
    if (cachedCsv && cacheAge < STALE_MS) {
      return () => {
        window.removeEventListener(EVENTS_UPDATED_EVENT, onUpdated);
      };
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
          currentCsvRef.current = freshCsv;
          const parsed = parseEventsCSV(freshCsv);
          setEvents(parsed);
          setEventsByDate(groupByDate(parsed));
          // Notify other islands on this page
          window.dispatchEvent(new Event(EVENTS_UPDATED_EVENT));
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
      window.removeEventListener(EVENTS_UPDATED_EVENT, onUpdated);
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
        currentCsvRef.current = freshCsv;
        const parsed = parseEventsCSV(freshCsv);
        setEvents(parsed);
        setEventsByDate(groupByDate(parsed));
        localStorage.setItem(CACHE_KEY, freshCsv);
        localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
        setStatus("fresh");
        // Notify other islands on this page
        window.dispatchEvent(new Event(EVENTS_UPDATED_EVENT));
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
