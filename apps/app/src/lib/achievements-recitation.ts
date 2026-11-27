import type { RecitationStats } from "@munib-tracker/shared/achievements";

import { QuranPracticeRepository } from "@/db/repositories/quran-practice-repository";
import { RecitationTotalsRepository } from "@/db/repositories/recitation-totals-repository";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { recitationStatsFrom } from "@/lib/quran-companion/recitation-totals";
import { practiceTotals } from "@/lib/statistics-practice";

/**
 * D71: the Recitation track's stats. Credits any stored practice row not counted
 * yet into the lifetime totals (this seeds a fresh device from its synced history,
 * and picks up rows synced from another device), then returns the larger of the
 * lifetime totals and the history's own sums — so the 30-row history cap never
 * lowers a milestone or Noor. `null` where practice is unavailable (TV), so
 * Achievements shows no Recitation card there.
 *
 * Load this module with `import()` (see `tracker-store`): it pulls the practice
 * reading-credit rules, which the home / achievements bundles must not carry.
 * Achievements stay derived — the totals are a backed-up, device-credited
 * counter, not a sync entity.
 */
export async function loadRecitationStats(): Promise<RecitationStats | null> {
  if (!isPracticeAvailable()) return null;
  const history = await QuranPracticeRepository.get();
  const totals = await RecitationTotalsRepository.credit(history.items);
  const { sessions, bestRevisionStreak, ayahsRecited } = practiceTotals(history);
  return recitationStatsFrom(totals, { sessions, bestRevisionStreak, ayahsRecited });
}
