import type { Href } from "expo-router";

import { getSurahByNumber } from "@/lib/quran-meta";

/**
 * Full-surah zikr remembrances — open the Qur'an surah reader (full tooling).
 */
const ZIKR_QURAN_FULL_SURAHS: Record<string, number> = {
  "before_sleep-sajdah": 32,
  "before_sleep-mulk": 67,
};

export type ZikrQuranRange = { surah: number; ayahFrom: number; ayahTo: number };

function fullSurahRange(surah: number): ZikrQuranRange {
  const meta = getSurahByNumber(surah);
  return { surah, ayahFrom: 1, ayahTo: meta?.ayahCount ?? 1 };
}

/**
 * Ayah-span remembrances — stay on zikr detail and render Qur'an ayah cards
 * (with recitation audio). Multi-surah entries (e.g. the three Quls) list one
 * range per surah so the UI can separate them.
 */
const ZIKR_QURAN_RANGES: Record<string, ZikrQuranRange[]> = {
  "before_sleep-ayat-kursi": [{ surah: 2, ayahFrom: 255, ayahTo: 255 }],
  "before_sleep-baqarah-end": [{ surah: 2, ayahFrom: 285, ayahTo: 286 }],
  "before_sleep-ikhlas": [fullSurahRange(112), fullSurahRange(113), fullSurahRange(114)],
};

/** Ayah spans for an embedded Qur'an card view, or `null`. */
export function zikrQuranRanges(zikrId: string | undefined | null): ZikrQuranRange[] | null {
  if (!zikrId) return null;
  return ZIKR_QURAN_RANGES[zikrId] ?? null;
}

/** @deprecated Prefer {@link zikrQuranRanges}; returns the first span only. */
export function zikrQuranRange(zikrId: string | undefined | null): ZikrQuranRange | null {
  return zikrQuranRanges(zikrId)?.[0] ?? null;
}

/** Full-surah Qur'an reader destination, or `null` when the zikr card / range view should stay. */
export function zikrQuranDestination(
  zikrId: string | undefined | null,
): { surah: number; ayah?: number } | null {
  if (!zikrId) return null;
  const surah = ZIKR_QURAN_FULL_SURAHS[zikrId];
  if (surah == null) return null;
  return { surah };
}

/** Qur'an reader href for a full-surah zikr, or `null`. */
export function zikrQuranHref(zikrId: string | undefined | null): Href | null {
  const dest = zikrQuranDestination(zikrId);
  if (!dest) return null;
  return {
    pathname: "/quran/[surah]",
    params: { surah: String(dest.surah) },
  } as Href;
}

/** Path string for continue / share links (`/quran/67`). */
export function zikrQuranPath(zikrId: string | undefined | null): string | null {
  const dest = zikrQuranDestination(zikrId);
  if (!dest) return null;
  return `/quran/${dest.surah}`;
}

/** Open a zikr: full-surah remembrances go to the Qur'an reader; others to zikr detail. */
export function pushZikrDetail(
  router: { push: (href: Href) => void },
  zikrId: string,
  options?: { prayer?: string },
): void {
  const quran = zikrQuranHref(zikrId);
  if (quran) {
    router.push(quran);
    return;
  }
  router.push({
    pathname: "/zikr/detail/[id]",
    params: options?.prayer ? { id: zikrId, prayer: options.prayer } : { id: zikrId },
  } as Href);
}
