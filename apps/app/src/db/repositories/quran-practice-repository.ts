import { DB_KEYS } from "@/db/keys";
import { readJSON, updateJSON } from "@/db/store";
import { asPracticeHistory, EMPTY_HISTORY, normalizeHistory } from "@/lib/quran-companion/merge";
import type { PracticeHistory, PracticeSummary } from "@/lib/quran-companion/types";

/**
 * Practice session summaries (§10): the newest 30, plus a `clearedAt` marker so
 * "Delete practice history" survives sync. Counts and ayah numbers only — never
 * transcript text, never audio.
 */
export const QuranPracticeRepository = {
  async get(): Promise<PracticeHistory> {
    const raw = await readJSON<unknown>(DB_KEYS.quranPracticeSessions, null);
    // Unknown (newer) schema → treated as empty, and left untouched on disk.
    return asPracticeHistory(raw) ?? EMPTY_HISTORY;
  },

  async add(summary: PracticeSummary): Promise<PracticeHistory> {
    let result: PracticeHistory = EMPTY_HISTORY;
    await updateJSON<unknown>(DB_KEYS.quranPracticeSessions, null, (current) => {
      const history = asPracticeHistory(current);
      if (!history) return current;
      result = normalizeHistory({ ...history, items: [summary, ...history.items] });
      return result;
    });
    return result;
  },

  /** Remove summaries only. Hifz marks, the memorization map and the model stay. */
  async clear(now = new Date()): Promise<PracticeHistory> {
    let result: PracticeHistory = EMPTY_HISTORY;
    await updateJSON<unknown>(DB_KEYS.quranPracticeSessions, null, (current) => {
      const history = asPracticeHistory(current);
      if (!history) return current;
      result = { schemaVersion: 1, clearedAt: now.toISOString(), items: [] };
      return result;
    });
    return result;
  },
};
