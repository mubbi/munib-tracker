import { type KhatmPlan, QURAN_TOTAL_AYAHS } from "@/lib/khatm";

/**
 * D72: practice → personal khatm counts each ayah once per khatm cycle. The khatm
 * blob (`DB_KEYS.khatm`, blob entity `khatm`) carries an additive, optional
 * `practiceCredited` record of the ayahs practice already credited to the running
 * plan; older clients ignore it. A new cycle — `start`, `setUnit` or `clear` —
 * drops it, and a record whose `cycle` key doesn't match the plan is ignored.
 *
 * `ayahs` holds global ayah numbers (1…6236, mushaf order) as sorted, merged
 * ranges: `"1-7,255,1201-1230"`. Practice credits contiguous passages, so the
 * string stays short; the worst case is bounded by the 6236 ayahs.
 */
export type KhatmPracticeCredited = {
  /** {@link khatmCycleKey} of the plan the ayahs were credited to. */
  cycle: string;
  /** Global ayah numbers as sorted ranges ({@link encodeAyahRanges}). */
  ayahs: string;
};

/** Identifies one khatm cycle: the plan's start date, length and unit. */
export function khatmCycleKey(plan: KhatmPlan, unit: "ayah" | "page"): string {
  return `${plan.startDate}|${plan.days}|${unit}`;
}

function isGlobalAyah(n: number): boolean {
  return Number.isInteger(n) && n >= 1 && n <= QURAN_TOTAL_AYAHS;
}

/** Global ayah numbers → `"a-b,c,…"` (sorted, de-duplicated, invalid numbers dropped). */
export function encodeAyahRanges(ayahs: Iterable<number>): string {
  const sorted = [...new Set(ayahs)].filter(isGlobalAyah).sort((a, b) => a - b);
  const parts: string[] = [];
  let i = 0;
  while (i < sorted.length) {
    const start = sorted[i];
    let end = start;
    while (i + 1 < sorted.length && sorted[i + 1] === end + 1) {
      i += 1;
      end = sorted[i];
    }
    parts.push(start === end ? String(start) : `${start}-${end}`);
    i += 1;
  }
  return parts.join(",");
}

/** `"a-b,c,…"` → the set of global ayah numbers. Tolerant: bad parts are skipped. */
export function decodeAyahRanges(raw: unknown): Set<number> {
  const out = new Set<number>();
  if (typeof raw !== "string" || raw.length === 0) return out;
  for (const part of raw.split(",")) {
    const m = /^(\d{1,4})(?:-(\d{1,4}))?$/.exec(part.trim());
    if (!m) continue;
    const from = Number(m[1]);
    const to = m[2] != null ? Number(m[2]) : from;
    const lo = Math.max(1, Math.min(from, to));
    const hi = Math.min(QURAN_TOTAL_AYAHS, Math.max(from, to));
    for (let g = lo; g <= hi; g++) out.add(g);
  }
  return out;
}

/** A stored `practiceCredited` value, or `undefined` when missing or malformed. */
export function sanitizePracticeCredited(raw: unknown): KhatmPracticeCredited | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const { cycle, ayahs } = raw as Partial<KhatmPracticeCredited>;
  if (typeof cycle !== "string" || typeof ayahs !== "string") return undefined;
  return { cycle, ayahs };
}

/** Ayahs practice already credited to the plan's current cycle (empty for another cycle). */
export function creditedAyahsForCycle(
  record: KhatmPracticeCredited | undefined,
  cycle: string,
): Set<number> {
  if (!record || record.cycle !== cycle) return new Set();
  return decodeAyahRanges(record.ayahs);
}
