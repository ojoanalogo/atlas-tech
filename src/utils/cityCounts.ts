import type { CollectionEntry } from "astro:content";
import { SINALOA_CITIES } from "../config";

export interface CityOption {
  id: string;
  name: string;
  count: number;
}

/**
 * Compute per-city entry counts from a list of atlas entries.
 * Returns a Record mapping city ID to the number of entries in that city.
 */
export function computeCityCounts(
  entries: CollectionEntry<"atlas">[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    const city = entry.data.city;
    counts[city] = (counts[city] || 0) + 1;
  }
  return counts;
}

/**
 * Build a CityOption[] array suitable for the DirectoryFilter component.
 * Includes "Global" at the front if any entries have city === "global".
 */
export function buildCityOptions(
  entries: CollectionEntry<"atlas">[],
): CityOption[] {
  const cityCounts = computeCityCounts(entries);
  const globalCount = cityCounts["global"] || 0;

  return [
    ...(globalCount > 0
      ? [{ id: "global", name: "Global", count: globalCount }]
      : []),
    ...SINALOA_CITIES.map((m) => ({
      id: m.id,
      name: m.name,
      count: cityCounts[m.id] || 0,
    })),
  ];
}
