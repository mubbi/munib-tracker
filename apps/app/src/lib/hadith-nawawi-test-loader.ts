/** Jest-only — keeps `require(nawawi40.json)` out of the production hadith graph. */
import type { BundledHadithCollection } from "@/lib/hadith-bundled";

type SharhSidecar = Record<string, { sharhArabic?: string }>;

export function loadNawawiSyncForTests(): BundledHadithCollection {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest CJS
  const matn = require("@/assets/data/hadith/nawawi40.json") as BundledHadithCollection;
  let sharh: SharhSidecar = {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest CJS
    sharh = require("@/assets/data/hadith/nawawi40-sharh.json") as SharhSidecar;
  } catch {
    // Sidecar optional in older fixtures
  }
  return {
    ...matn,
    items: matn.items.map((item) => {
      const body = sharh[item.id]?.sharhArabic?.trim();
      if (!body || item.sharhArabic) return item;
      return { ...item, sharhArabic: body };
    }),
  };
}
