/** Hub grouping for a Journey to Jannah topic. */
export type JannahHub = "about" | "ranks" | "paths" | "warnings" | "supplication" | "promised";

/** How strongly the texts emphasize a deed — not a guaranteed rank. */
export type JannahImportance = "foundational" | "obligatory" | "highly-recommended" | "recommended";

import type { CharacterDestroyerItem, CharacterTraitItem } from "./mizan";

export interface JannahQuranRef {
  surah: number;
  ayahFrom: number;
  ayahTo?: number;
  /** Display label parsed by ReferenceLine, e.g. "Qur'an 3:133". */
  label: string;
  excerpt?: string;
}

export interface JannahHadithRef {
  collection: string;
  citation: string;
  grade?: "sahih" | "hasan" | "daif" | "scholarly-opinion";
  excerpt: string;
}

export interface JannahAppLink {
  label: string;
  route: string;
}

/** A self-contained educational topic (hub page or path deed). */
export interface JannahTopic {
  id: string;
  hub: JannahHub;
  title: string;
  summary: string;
  body: string[];
  importance?: JannahImportance;
  quran?: JannahQuranRef[];
  hadith?: JannahHadithRef[];
  actions?: string[];
  appLinks?: JannahAppLink[];
  disclaimer?: string;
  /** Virtue mosaic tiles for the good-character Mizan UI. */
  characterTraits?: CharacterTraitItem[];
  /** Opposite qualities with optional Jahannam lesson links. */
  characterDestroyers?: CharacterDestroyerItem[];
}

/** One of the gates of Paradise mentioned in authentic hadith. */
export interface JannahGate {
  id: string;
  name: string;
  deedSummary: string;
  hadith: JannahHadithRef[];
}

/** Curated Qur'an verse about Paradise for the verses browser. */
export interface JannahVerseEntry {
  id: string;
  theme: "description" | "reward" | "ranks" | "mercy" | "supplication";
  label: string;
  surah: number;
  ayahFrom: number;
  ayahTo?: number;
  excerpt: string;
}

/** Linked dua from the bundled Hisnul Muslim corpus. */
export interface JannahDuaEntry {
  id: string;
  context: string;
  duaId: string;
}

/** Person or group named in authentic texts regarding Paradise. */
export interface JannahPromisedEntry {
  id: string;
  name: string;
  summary: string;
  note?: string;
}
