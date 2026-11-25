import type { Href } from "expo-router";

import { passageForPreset } from "@/lib/quran-companion/passage";

/**
 * Routes recite-to-find opens. Kept here so the verse detector, Qur'an search
 * and universal search all deep-link the same way.
 */

/** `?mode=recite` on the verse detector / Qur'an search opens the Recite tab. */
export const RECITE_MODE_PARAM = "recite";

/** Verse detector, opened straight on the Recite tab (universal search shortcut). */
export function reciteToFindHref(): Href {
  return { pathname: "/verse-detector", params: { mode: RECITE_MODE_PARAM } };
}

/** The reader, scrolled to the found ayah. */
export function readerHref(surah: number, ayah: number): Href {
  return { pathname: "/quran/[surah]", params: { surah: String(surah), ayah: String(ayah) } };
}

/**
 * "Practise from here": the practice session for the found passage, or the next
 * five ayahs when one ayah was found. The session's default mode applies.
 */
export function practiceFromHereHref(surah: number, ayah: number, ayahEnd = ayah): Href | null {
  const passage =
    ayahEnd > ayah ? { surah, ayahStart: ayah, ayahEnd } : passageForPreset("next5", surah, ayah);
  if (!passage) return null;
  return {
    pathname: "/quran/practice/session",
    params: {
      surah: String(passage.surah),
      from: String(passage.ayahStart),
      to: String(passage.ayahEnd),
      source: "hub",
    },
  } as unknown as Href;
}
