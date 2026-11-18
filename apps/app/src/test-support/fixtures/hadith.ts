import type { HadithItem } from "@munib-tracker/shared/types";

/** Riyad as-Salihin 368 unless overridden. */
export function buildHadithItem(overrides: Partial<HadithItem> = {}): HadithItem {
  return {
    id: "riyad_assalihin:368",
    collection: "riyad_assalihin",
    number: "368",
    arabic: "حديث",
    english: "Whoever prays the two cool prayers will enter Paradise.",
    reference: "Riyad as-Salihin 368",
    ...overrides,
  };
}
