import type { Href } from "expo-router";

import { passageFromRef } from "@/lib/recite-along/passages";

/** `/quran/passage` route params: `surah`, `from`, and optional `to` (defaults to `from`). */
export type QuranPassageParams = { surah?: string; from?: string; to?: string };

export type QuranPassageRange = { surah: number; from: number; to: number };

/**
 * Validated passage from the route params (clamped to the surah's ayahs), or
 * `null` when they name no real ayahs. The Sunnah-habit links push
 * `{ pathname: "/quran/passage", params: { surah, from, to } }`.
 */
export function parsePassageParams(params: QuranPassageParams): QuranPassageRange | null {
  const surah = Number(params.surah);
  const from = Number(params.from);
  const to = params.to != null && params.to !== "" ? Number(params.to) : from;
  if (!Number.isInteger(surah) || !Number.isInteger(from) || !Number.isInteger(to)) return null;
  const passage = passageFromRef({ surah, ayahFrom: from, ayahTo: to });
  if (!passage) return null;
  return { surah: passage.surah, from: passage.ayahStart, to: passage.ayahEnd };
}

/** The focused-passage screen for `surah:from–to` (`to` defaults to `from`). */
export function quranPassageHref(surah: number, from: number, to: number = from): Href {
  return {
    pathname: "/quran/passage",
    params: { surah: String(surah), from: String(from), to: String(to) },
  } as unknown as Href;
}

/** Player source path for a passage queue (Continue / mini-player return). */
export function quranPassageSourceHref({ surah, from, to }: QuranPassageRange): string {
  return `/quran/passage?surah=${surah}&from=${from}&to=${to}`;
}
