import { DHUL_HIJJAH_ZIKR } from "@munib-tracker/shared/content/dhul-hijjah";
import type { ZikrItem } from "@munib-tracker/shared/types";

/**
 * Seasonal counter zikr ids (NF-3.3 Dhul-Hijjah takbir / tahlil / tahmid).
 * Each is a NEW id — so its daily tasbeeh count is its own — whose Arabic,
 * transliteration, translation and audio are copied from an existing bundled
 * adhkar item. Nothing is typed here. Resolved by `getZikrById` as a fallback,
 * so `/tasbeeh/<id>` works without adding the ids to any zikr list.
 */
const SEASONAL = new Map<string, { sourceId: string; target: number }>(
  DHUL_HIJJAH_ZIKR.map((z) => [z.id, { sourceId: z.sourceId, target: z.target }]),
);

export function isSeasonalZikrId(id: string): boolean {
  return SEASONAL.has(id);
}

export function deriveSeasonalZikr(id: string, corpus: readonly ZikrItem[]): ZikrItem | undefined {
  const entry = SEASONAL.get(id);
  if (!entry) return undefined;
  const source = corpus.find((item) => item.id === entry.sourceId);
  if (!source) return undefined;
  return { ...source, id, categoryId: "anytime", targetCount: entry.target };
}
