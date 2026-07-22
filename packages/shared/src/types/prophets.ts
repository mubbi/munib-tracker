import type { JannahAppLink, JannahHadithRef, JannahImportance, JannahQuranRef } from "./jannah";

/** Hub section grouping on the Learn the Prophets screen. */
export type ProphetsSection = "context" | "prophets" | "themes" | "evidence";

/** Structured biography card for an individual prophet topic. */
export interface ProphetsProfile {
  nation?: string;
  location?: string;
  era?: string;
  mission?: string;
  challenges?: string[];
  miracles?: string[];
  majorEvents?: string[];
  lessons?: string[];
  facts?: string[];
}

/** A self-contained topic within the Learn the Prophets hub. */
export interface ProphetsTopic {
  id: string;
  section: ProphetsSection;
  title: string;
  summary: string;
  body: string[];
  importance?: JannahImportance;
  profile?: ProphetsProfile;
  quran?: JannahQuranRef[];
  hadith?: JannahHadithRef[];
  actions?: string[];
  appLinks?: JannahAppLink[];
  disclaimer?: string;
}

/** One milestone on the prophets timeline. */
export interface ProphetsTimelineEvent {
  id: string;
  era: string;
  title: string;
  body: string;
  prophetId?: string;
}

/**
 * How firmly a genealogy edge is established.
 * - `quran` — relationship stated in the Qur'an
 * - `authentic-hadith` — stated in graded authentic hadith
 * - `classical-history` — widely reported in sirah / history; not a Qur'anic verse
 * Uncertain or Isra'iliyyat-only links must not appear as firm edges.
 */
export type ProphetsGenealogyCertainty = "quran" | "authentic-hadith" | "classical-history";

/** A person node on the prophets family tree (may or may not be a prophet topic). */
export interface ProphetsGenealogyNode {
  id: string;
  /** Display name (English source). */
  name: string;
  /** When set, links to `/prophets/[topic]` bio. */
  prophetId?: string;
  /** Parent node id when a sourced parent→child edge exists. */
  parentId?: string | null;
  /**
   * Sibling of another node when the texts affirm brotherhood but not a shared
   * named parent on this tree (e.g. Musa and Harun).
   */
  siblingOf?: string;
  /** How the parent / sibling link is established. */
  certainty: ProphetsGenealogyCertainty;
  /** Short sourced note — cite Qur'an/hadith/sirah; never invent lineages. */
  relationNote: string;
  /** Primary citations shown in the UI. */
  sources: string[];
  /** Branch grouping for expand/collapse UI. */
  branch: ProphetsGenealogyBranch;
}

export type ProphetsGenealogyBranch =
  | "adam-nuh"
  | "ibrahim"
  | "israel"
  | "musa"
  | "dawud"
  | "zakariyya"
  | "isa"
  | "muhammad";
