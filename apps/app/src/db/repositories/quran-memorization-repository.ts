import { DB_KEYS } from "@/db/keys";
import { readJSON, updateJSON } from "@/db/store";
import { decodeMap, encodeRecord } from "@/lib/quran-companion/memorization-codec";
import { asMemorizationMap } from "@/lib/quran-companion/merge";
import type { MemorizationRecord, MemorizationRecords } from "@/lib/quran-companion/types";

/**
 * Per-ayah revision ladder (§10). Stored compactly (`memorization-codec.ts`) so
 * all 6,236 ayahs fit well under the safe AsyncStorage row size.
 */
export const QuranMemorizationRepository = {
  async getAll(): Promise<MemorizationRecords> {
    const raw = await readJSON<unknown>(DB_KEYS.quranMemorization, null);
    const map = asMemorizationMap(raw);
    return map ? decodeMap(map) : {};
  },

  /** Write several records at once (one take can touch every ayah in its range). */
  async upsert(records: Record<string, MemorizationRecord>): Promise<void> {
    if (!Object.keys(records).length) return;
    await updateJSON<unknown>(DB_KEYS.quranMemorization, null, (current) => {
      const map = asMemorizationMap(current);
      if (!map) return current; // newer schema: leave alone
      const next = { ...map.records };
      for (const [key, record] of Object.entries(records)) next[key] = encodeRecord(record);
      return { schemaVersion: 1, records: next };
    });
  },
};
