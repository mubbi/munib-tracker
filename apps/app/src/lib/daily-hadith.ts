import type { HadithItem } from "@munib-tracker/shared/types";
import { addDays } from "@munib-tracker/shared/utils";

import { getBundledCollection } from "@/lib/hadith";

/**
 * Daily hadith series (NF-2.10). A deterministic once-per-day pick from Imam
 * al-Nawawi's Forty — concise, widely-taught, authentic ahadith that suit a daily
 * habit. The pick is a pure function of the calendar date, so the home card, the
 * archive, and any notification all agree on "today's hadith" without storing
 * anything.
 */
const POOL: HadithItem[] = getBundledCollection("nawawi40")?.items ?? [];

export function dailyHadithPoolSize(): number {
  return POOL.length;
}

/** Integer day number (days since the Unix epoch) for a YYYY-MM-DD date. */
export function dayNumber(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.floor(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1) / 86_400_000);
}

/** A well-mixing 32-bit integer hash so consecutive days don't walk the list in order. */
function hashDay(n: number): number {
  let x = n | 0;
  x = Math.imul(x ^ (x >>> 16), 2246822519);
  x = Math.imul(x ^ (x >>> 13), 3266489917);
  x ^= x >>> 16;
  return x >>> 0;
}

/** Deterministic pool index for a given day. */
export function dailyHadithIndex(dateStr: string, poolSize: number = POOL.length): number {
  if (poolSize <= 0) return 0;
  return hashDay(dayNumber(dateStr)) % poolSize;
}

/** Today's (or a given day's) hadith, or undefined if the pool is empty. */
export function dailyHadith(dateStr: string): HadithItem | undefined {
  if (POOL.length === 0) return undefined;
  return POOL[dailyHadithIndex(dateStr)];
}

/** The last `count` days of picks, newest first — the archive feed. */
export function recentDailyHadith(
  today: string,
  count: number,
): { date: string; hadith: HadithItem }[] {
  const out: { date: string; hadith: HadithItem }[] = [];
  for (let i = 0; i < count; i += 1) {
    const date = addDays(today, -i);
    const hadith = dailyHadith(date);
    if (hadith) out.push({ date, hadith });
  }
  return out;
}
