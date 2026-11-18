import { addDays, diffInDays, getLocalDateString } from "@munib-tracker/shared/utils";

import type { MemorizationRecord } from "./types";

export type DueItem = {
  key: string;
  surah: number;
  ayah: number;
  /** Days past due (0 = due today). Hifz-only rows are 0. */
  overdueDays: number;
  lapses: number;
  source: "memorization" | "hifz";
};

export type DueQueueInput = {
  records: Record<string, MemorizationRecord>;
  /** `surah:ayah` → hifz status (from the hifz store). */
  hifz: Record<string, "memorized" | "review">;
  includeHifzReview: boolean;
  today: string;
};

function parseKey(key: string): { surah: number; ayah: number } | null {
  const colon = key.indexOf(":");
  if (colon < 0) return null;
  const surah = Number(key.slice(0, colon));
  const ayah = Number(key.slice(colon + 1));
  if (!Number.isInteger(surah) || !Number.isInteger(ayah)) return null;
  if (surah < 1 || surah > 114 || ayah < 1) return null;
  return { surah, ayah };
}

/**
 * The due queue (§10):
 * 1. memorization rows with `nextReviewAt` today or earlier;
 * 2. with `includeHifzReview`, hifz `review` ayahs not already listed;
 * 3. overdue first, then lapses descending, then mushaf order (hifz-only = 0 lapses).
 */
export function buildDueQueue(input: DueQueueInput): DueItem[] {
  const items: DueItem[] = [];
  const seen = new Set<string>();
  for (const [key, record] of Object.entries(input.records)) {
    const pos = parseKey(key);
    if (!pos || !record?.nextReviewAt) continue;
    if (record.nextReviewAt > input.today) continue;
    seen.add(key);
    items.push({
      key,
      ...pos,
      overdueDays: Math.max(0, diffInDays(input.today, record.nextReviewAt)),
      lapses: record.lapses ?? 0,
      source: "memorization",
    });
  }
  if (input.includeHifzReview) {
    for (const [key, status] of Object.entries(input.hifz)) {
      if (status !== "review" || seen.has(key)) continue;
      // A hifz "review" ayah that has a memorization record not yet due stays out.
      if (input.records[key]) continue;
      const pos = parseKey(key);
      if (!pos) continue;
      items.push({ key, ...pos, overdueDays: 0, lapses: 0, source: "hifz" });
    }
  }
  return items.sort(
    (a, b) =>
      b.overdueDays - a.overdueDays || b.lapses - a.lapses || a.surah - b.surah || a.ayah - b.ayah,
  );
}

/** Today's sitting: the first `limit` rows, and how many remain for other days. */
export function todaysSitting(
  queue: DueItem[],
  limit: number,
): { items: DueItem[]; remaining: number } {
  return { items: queue.slice(0, limit), remaining: Math.max(0, queue.length - limit) };
}

/**
 * Due count per local day for the next `days` days (day key → count), used by the
 * revision reminder. A day counts everything due on or before it.
 */
export function dueCountsByDay(
  input: Omit<DueQueueInput, "today">,
  now: Date,
  days: number,
): Record<string, number> {
  const out: Record<string, number> = {};
  const start = getLocalDateString(now);
  for (let i = 0; i < days; i++) {
    const day = addDays(start, i);
    out[day] = buildDueQueue({ ...input, today: day }).length;
  }
  return out;
}
