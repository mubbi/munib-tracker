import type { JannahAppLink, JannahHadithRef, JannahImportance, JannahQuranRef } from "./jannah";

/** Hub section grouping on the Learn Aqeedah screen. */
export type AqeedahSection = "intro" | "articles" | "tawheed" | "afterlife" | "signs" | "reference";

/** A self-contained topic within the Learn Aqeedah hub. */
export interface AqeedahTopic {
  id: string;
  section: AqeedahSection;
  title: string;
  summary: string;
  body: string[];
  importance?: JannahImportance;
  quran?: JannahQuranRef[];
  hadith?: JannahHadithRef[];
  /** Common misunderstandings — presented respectfully with correction. */
  misconceptions?: string[];
  actions?: string[];
  appLinks?: JannahAppLink[];
  disclaimer?: string;
}

/** Glossary term for aqeedah vocabulary. */
export interface AqeedahGlossaryTerm {
  id: string;
  term: string;
  transliteration?: string;
  definition: string;
}
