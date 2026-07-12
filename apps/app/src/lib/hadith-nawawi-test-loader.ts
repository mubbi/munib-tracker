/** Jest-only — keeps `require(nawawi40.json)` out of the production hadith graph. */
import type { BundledHadithCollection } from "@/lib/hadith-bundled";

export function loadNawawiSyncForTests(): BundledHadithCollection {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest CJS
  return require("@/assets/data/hadith/nawawi40.json") as BundledHadithCollection;
}
