import type { PrayerId } from "@munib-tracker/shared/types";

/** Khushu (presence in prayer) rating scale — 1 (distracted) … 5 (deeply present). */
export const KHUSHU_MIN = 1;
export const KHUSHU_MAX = 5;

export interface KhushuEntry {
  id: string;
  /** YYYY-MM-DD the reflection is for. */
  date: string;
  prayerId: PrayerId;
  /** 1–5 self-rating of presence/focus. */
  rating: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

/** Mean rating across the entries, or null when there are none. */
export function averageRating(entries: KhushuEntry[]): number | null {
  if (entries.length === 0) return null;
  const sum = entries.reduce((total, entry) => total + entry.rating, 0);
  return sum / entries.length;
}

/** Groups entries by date, newest date first (entries within a date keep input order). */
export function groupByDate(entries: KhushuEntry[]): { date: string; entries: KhushuEntry[] }[] {
  const map = new Map<string, KhushuEntry[]>();
  for (const entry of entries) {
    const bucket = map.get(entry.date);
    if (bucket) bucket.push(entry);
    else map.set(entry.date, [entry]);
  }
  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, list]) => ({ date, entries: list }));
}

/** Clamps a raw rating into the valid 1–5 range. */
export function clampRating(rating: number): number {
  return Math.min(KHUSHU_MAX, Math.max(KHUSHU_MIN, Math.round(rating)));
}
