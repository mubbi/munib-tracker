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
