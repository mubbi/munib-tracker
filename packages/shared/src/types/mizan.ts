import type { JannahHadithRef, JannahQuranRef } from "./jannah";

/**
 * Evidence-category chips for deeds described with Scale / virtue language.
 * Labels come from narration wording — not a divine leaderboard.
 */
export type MizanDeedCategory =
  | "heavy-on-scale"
  | "fills-the-scale"
  | "best-beloved"
  | "equal-reward";

/** One deed card on the Last Day “heavy on the Scale” topic. */
export interface MizanDeedItem {
  id: string;
  title: string;
  /** Optional Arabic phrase shown on the card (script stays untranslated). */
  arabic?: string;
  category: MizanDeedCategory;
  summary: string;
  quran?: JannahQuranRef;
  hadith?: JannahHadithRef;
}

/** One item on the Jahannam destructive-sins list (mūbiqāt, bankrupt, etc.). */
export interface DestructiveSinItem {
  id: string;
  title: string;
  summary: string;
  /** Display order (1–7 for the seven; higher for related panels). */
  order: number;
  /** In-app lesson route when a major-sin page exists. */
  route?: string;
  /** Visual kind for the Mizan kit. */
  kind?: "mubiqah" | "bankrupt" | "note";
}

/** Virtue tile on the Jannah good-character mosaic. */
export interface CharacterTraitItem {
  id: string;
  title: string;
  summary: string;
  /** Key mapped to an AppIcon in the product UI. */
  iconKey: string;
  quran?: JannahQuranRef;
  hadith?: JannahHadithRef;
}

/** Opposite quality that undermines good character. */
export interface CharacterDestroyerItem {
  id: string;
  title: string;
  route?: string;
}
