import type { JannahAppLink, JannahHadithRef, JannahImportance, JannahQuranRef } from "./jannah";

/** Hub section grouping on the Battles in Islam screen. */
export type BattlesSection =
  | "context"
  | "battles"
  | "later"
  | "expeditions"
  | "wisdom"
  | "evidence";

/** Structured facts for a named battle topic — rendered as detail cards. */
export interface BattlesBattleDetails {
  location: string;
  modernLocation?: string;
  hijriDate?: string;
  gregorianYear?: number;
  muslimForces?: string;
  opposingForces?: string;
  muslimCommander?: string;
  opposingCommander?: string;
  weather?: string;
  outcome: string;
  keyEvents: string[];
  leadershipLesson: string;
  spiritualLesson: string;
  facts?: string[];
}

/** A self-contained topic within the Battles in Islam hub. */
export interface BattlesTopic {
  id: string;
  section: BattlesSection;
  title: string;
  summary: string;
  body: string[];
  importance?: JannahImportance;
  battleDetails?: BattlesBattleDetails;
  quran?: JannahQuranRef[];
  hadith?: JannahHadithRef[];
  actions?: string[];
  appLinks?: JannahAppLink[];
  disclaimer?: string;
}

/** One milestone on the battles timeline (610–632 CE focus). */
export interface BattlesTimelineEvent {
  id: string;
  year: number;
  ah?: number;
  title: string;
  body: string;
  location?: string;
  /** Links to a battle topic when applicable. */
  topicId?: string;
}

/** A companion or commander profile linked to battles. */
export interface BattlesFigure {
  id: string;
  name: string;
  epithet?: string;
  summary: string;
  role: string;
  battles: string[];
  lesson: string;
}

/** A concise lesson card tied to one battle or treaty. */
export interface BattlesLessonCard {
  id: string;
  battleId: string;
  battleTitle: string;
  lesson: string;
  detail: string;
}

/** Qur'an verse curated for a specific battle context. */
export interface BattlesVerse {
  id: string;
  battleId: string;
  surah: number;
  ayahFrom: number;
  ayahTo?: number;
  label: string;
  excerpt: string;
  context: string;
}

/** Glossary term for Islamic military history vocabulary. */
export interface BattlesGlossaryTerm {
  id: string;
  term: string;
  transliteration?: string;
  definition: string;
}
