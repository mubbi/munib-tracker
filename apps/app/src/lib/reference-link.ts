import type { Href } from "expo-router";

import { getSurahByNumber, getSurahMeta } from "@/lib/quran";

/**
 * A source a `reference` string points to. Only Qur'an ayahs are linkable.
 *
 * Hadith references are deliberately NOT linked: our citations come from the
 * Hisnul Muslim compilation, which numbers hadith by the classical ʿAbd al-Bāqī
 * edition (e.g. "Muslim 591" = the after-salām dhikr), whereas the app's hadith
 * reader (fawazahmed0) uses a different numbering (its #591 is an unrelated
 * hadith; the same dhikr is #1334). The two schemes don't translate, so linking
 * a hadith number would open the wrong hadith. The citation stays as plain,
 * authentic text. A Qur'an ayah (surah:ayah) is a universal coordinate, so it
 * always resolves correctly.
 */
export type ReferenceTarget = { kind: "quran"; surah: number; ayah: number };

function foldName(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

let surahByName: Map<string, number> | null = null;
function getSurahByName(name: string): number | undefined {
  if (!surahByName) {
    surahByName = new Map();
    for (const surah of getSurahMeta()) {
      surahByName.set(foldName(surah.nameTransliteration), surah.number);
      surahByName.set(foldName(surah.nameEnglish), surah.number);
    }
  }
  return surahByName.get(foldName(name));
}

function quranTarget(surah: number, ayah: number): ReferenceTarget | null {
  const meta = getSurahByNumber(surah);
  if (!meta || !Number.isFinite(ayah) || ayah < 1 || ayah > meta.ayahCount) return null;
  return { kind: "quran", surah, ayah };
}

/**
 * Parse a `reference` string into a Qur'an deep-link target, or `null` when it
 * doesn't cite a resolvable ayah (the reference then stays plain text).
 */
export function parseReference(reference: string | undefined | null): ReferenceTarget | null {
  if (!reference) return null;

  // Qur'an by number: "Quran 2:255", "Qur'an 43:13".
  const byNumber = reference.match(/Qur['’ʼ]?an\s+(\d{1,3})\s*:\s*(\d{1,3})/i);
  if (byNumber) {
    const target = quranTarget(Number(byNumber[1]), Number(byNumber[2]));
    if (target) return target;
  }

  // Qur'an by surah name: "QS. Al-Baqarah: 255".
  const byName = reference.match(/QS\.?\s*([A-Za-z'’ -]+?)\s*:\s*(\d{1,3})/i);
  if (byName) {
    const surah = getSurahByName(byName[1].trim());
    if (surah) {
      const target = quranTarget(surah, Number(byName[2]));
      if (target) return target;
    }
  }

  return null;
}

/** Build the router target for a parsed reference (Qur'an reader at the ayah). */
export function referenceHref(target: ReferenceTarget): Href {
  return {
    pathname: "/quran/[surah]",
    params: { surah: String(target.surah), ayah: String(target.ayah) },
  } as Href;
}
