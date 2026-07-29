/**
 * Jest-only sync loader for Riyad. Kept in a separate file so production Metro
 * does not statically embed the ~2 MB JSON into `hadith-bundled`.
 */
import type { BundledHadithCollection } from "./hadith-bundled";

export function loadRiyadSyncForTests(): BundledHadithCollection {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest CJS
  return require("@/assets/data/hadith/riyad-as-salihin.json") as BundledHadithCollection;
}
