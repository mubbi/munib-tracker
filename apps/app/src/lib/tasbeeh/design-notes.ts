/**
 * "About this design" notes for the v2 tasbeeh designs (NF-3.19, D16). Each
 * reference is a corpus id (collection + hadith number exactly as the app's
 * hadith reader numbers it) verified in docs/proofs/tasbeeh-designs.md, with
 * the gradings that proof log records. No hadith text is typed here: the copy
 * paraphrases, and each link opens the hadith in the reader.
 */

import type { TasbeehDesignId } from "@munib-tracker/shared/types";

export interface DesignNoteRef {
  /** App hadith collection id (`/hadith/[collection]`). */
  collection: "abudawud" | "tirmidhi";
  /** Corpus number (Abu Dawud and Tirmidhi: same as the printed number). */
  number: number;
  /** i18n key for the link label, which names the gradings. */
  labelKey: string;
}

export interface DesignNote {
  titleKey: string;
  bodyKey: string;
  refs: readonly DesignNoteRef[];
}

export const TASBEEH_DESIGN_NOTES: Partial<Record<TasbeehDesignId, DesignNote>> = {
  // D16: the pebbles design always shows its evidence and the differing gradings.
  pebbles: {
    titleKey: "tasbeehDesigns.note.title",
    bodyKey: "tasbeehDesigns.note.pebbles.body",
    refs: [
      {
        collection: "tirmidhi",
        number: 3568,
        labelKey: "tasbeehDesigns.note.pebbles.tirmidhi3568",
      },
      {
        collection: "abudawud",
        number: 1500,
        labelKey: "tasbeehDesigns.note.pebbles.abudawud1500",
      },
      {
        collection: "abudawud",
        number: 1501,
        labelKey: "tasbeehDesigns.note.fingers.abudawud1501",
      },
    ],
  },
  // Abu Dawud 1501 first: graded hasan by every grader the corpus lists.
  fingers: {
    titleKey: "tasbeehDesigns.note.title",
    bodyKey: "tasbeehDesigns.note.fingers.body",
    refs: [
      {
        collection: "abudawud",
        number: 1501,
        labelKey: "tasbeehDesigns.note.fingers.abudawud1501",
      },
      {
        collection: "tirmidhi",
        number: 3583,
        labelKey: "tasbeehDesigns.note.fingers.tirmidhi3583",
      },
    ],
  },
};

export function designNoteFor(design: TasbeehDesignId): DesignNote | undefined {
  return TASBEEH_DESIGN_NOTES[design];
}
