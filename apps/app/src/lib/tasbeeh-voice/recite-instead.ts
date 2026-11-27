import type { Passage } from "@/lib/quran-companion/types";
import { passageFromRef, wholeSurah } from "@/lib/recite-along/passages";
import { zikrQuranDestination, zikrQuranRanges } from "@/lib/zikr-quran";

/**
 * Qur'anic remembrances (Ayat al-Kursi, the last two ayahs of al-Baqarah, the
 * three Quls, al-Mulk …) are recited, not counted by voice: they are far longer
 * than one breath, so pause counting would miscount them (D68 / D69). Counters
 * and guided sessions offer "Recite along" for them instead — the on-device
 * practice session on the same ayahs. References only; the words are always
 * rendered from the bundled corpus by the practice screens.
 */
export function zikrRecitePassages(zikrId: string | null | undefined): Passage[] {
  const ranges = zikrQuranRanges(zikrId);
  if (ranges) {
    return ranges
      .map((range) =>
        passageFromRef({ surah: range.surah, ayahFrom: range.ayahFrom, ayahTo: range.ayahTo }),
      )
      .filter((p): p is Passage => p != null);
  }
  const full = zikrQuranDestination(zikrId);
  const passage = full ? wholeSurah(full.surah) : null;
  return passage ? [passage] : [];
}

/**
 * Ayat al-Kursi (2:255) — recited after each Salah (an-Nasa'i, as-Sunan al-Kubra;
 * declared sahih by Ibn Hibban per Ibn Hajar, Bulugh al-Maram — the dataset
 * reference on `after_prayer-ayat-al-kursi`).
 */
export const AYAT_AL_KURSI_PASSAGE: Passage = { surah: 2, ayahStart: 255, ayahEnd: 255 };

/** Surah al-Qadr (97:1–5) — the surah of Laylat al-Qadr. */
export const SURAH_AL_QADR_PASSAGE: Passage = { surah: 97, ayahStart: 1, ayahEnd: 5 };
