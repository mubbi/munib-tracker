import { DB_KEYS } from "@/db/keys";
import { readJSON, withKeyLock, writeJSON } from "@/db/store";
import {
  asRecitationTotals,
  creditRecitationTotals,
  EMPTY_RECITATION_TOTALS,
  type RecitationTotals,
} from "@/lib/quran-companion/recitation-totals";
import type { PracticeSummary } from "@/lib/quran-companion/types";

/**
 * D71 lifetime Recitation-track totals (see `lib/quran-companion/recitation-totals.ts`).
 * Device-credited, backed up, wiped on reset — never a sync entity.
 */
export const RecitationTotalsRepository = {
  async get(): Promise<RecitationTotals> {
    const raw = await readJSON<unknown>(DB_KEYS.recitationTotals, null);
    return asRecitationTotals(raw) ?? EMPTY_RECITATION_TOTALS;
  },

  /**
   * Credits the summaries not credited yet, once per session id (a repeat save,
   * re-open or synced copy of a counted session adds nothing). Writes only when
   * something new was credited.
   */
  async credit(summaries: Iterable<PracticeSummary | null | undefined>): Promise<RecitationTotals> {
    return withKeyLock(DB_KEYS.recitationTotals, async () => {
      const raw = await readJSON<unknown>(DB_KEYS.recitationTotals, null);
      const current = asRecitationTotals(raw) ?? EMPTY_RECITATION_TOTALS;
      const next = creditRecitationTotals(current, summaries);
      if (next !== current) await writeJSON(DB_KEYS.recitationTotals, next);
      return next;
    });
  },
};
