import type { CollectionEntry } from "astro:content";
import type { AtlasEntryType } from "../config";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TechEvent {
  title: string;
  organizer: string;
  date: string; // YYYY-MM-DD
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

/**
 * Parse a CSV string from the Google Sheet into TechEvent[].
 * Handles quoted fields with newlines, commas, and escaped quotes.
 */
export function parseEventsCSV(csv: string): TechEvent[] {
  const rows = parseCSVRows(csv);
  if (rows.length < 2) return [];

  // Skip header row
  const events: TechEvent[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    // Pad short rows — missing trailing columns become empty strings
    while (row.length < 12) row.push("");

    const rawDate = row[2].trim(); // M/DD/YYYY format
    if (!rawDate) continue;

    const dateParts = rawDate.split("/");
    if (dateParts.length !== 3) continue;

    const [month, day, year] = dateParts;
    const dateKey = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    const title = row[0].trim();
    // Skip rows with no title and no date — likely empty trailing rows
    if (!title) continue;

    events.push({
      title,
      organizer: row[1].trim(),
      date: dateKey,
      startTime: row[3].trim(),
      endTime: row[4].trim(),
      description: row[5].trim(),
      url: row[6].trim(),
      location: row[7].trim(),
      mapsUrl: row[8].trim(),
      isInPerson: row[9].trim().toLowerCase() === "presencial",
      calendarLink: row[10].trim(),
      meetLink: row[11].trim(),
    });
  }

  return events;
}

function parseCSVRows(csv: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < csv.length) {
    const ch = csv[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < csv.length && csv[i + 1] === '"') {
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          i++;
        }
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ",") {
        current.push(field);
        field = "";
        i++;
      } else if (ch === "\n" || (ch === "\r" && csv[i + 1] === "\n")) {
        current.push(field);
        field = "";
        rows.push(current);
        current = [];
        i += ch === "\r" ? 2 : 1;
      } else if (ch === "\r") {
        current.push(field);
        field = "";
        rows.push(current);
        current = [];
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }

  // Push last field/row
  if (field || current.length > 0) {
    current.push(field);
    rows.push(current);
  }

  return rows;
}

export function filterAtlasByType(
  entries: CollectionEntry<"atlas">[],
  type: AtlasEntryType,
) {
  return entries.filter((entry) => entry.data.entryType === type);
}

export function groupByMunicipality(
  entries: CollectionEntry<"atlas">[],
): Record<string, number> {
  return entries.reduce(
    (acc, entry) => {
      const municipality = entry.data.municipality;
      acc[municipality] = (acc[municipality] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

export function getFeaturedEntries(entries: CollectionEntry<"atlas">[]) {
  return entries
    .filter((entry) => entry.data.featured)
    .sort((a, b) => a.data.name.localeCompare(b.data.name));
}

export function countByTypeAndMunicipality(
  entries: CollectionEntry<"atlas">[],
): Record<string, Record<AtlasEntryType, number>> {
  return entries.reduce(
    (acc, entry) => {
      const mun = entry.data.municipality;
      const type = entry.data.entryType;
      if (!acc[mun]) {
        acc[mun] = {
          startup: 0,
          community: 0,
          business: 0,
          consultory: 0,
          person: 0,
        };
      }
      acc[mun][type] = (acc[mun][type] || 0) + 1;
      return acc;
    },
    {} as Record<string, Record<AtlasEntryType, number>>,
  );
}

export function countByType(
  entries: CollectionEntry<"atlas">[],
): Record<AtlasEntryType, number> {
  return entries.reduce(
    (acc, entry) => {
      const type = entry.data.entryType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {
      startup: 0,
      community: 0,
      business: 0,
      consultory: 0,
      person: 0,
    } as Record<AtlasEntryType, number>,
  );
}
