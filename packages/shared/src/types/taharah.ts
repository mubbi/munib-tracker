import type { JannahAppLink, JannahHadithRef, JannahImportance, JannahQuranRef } from "./jannah";

/** Hub section grouping on the Learn Purification screen. */
export type TaharahSection =
  | "intro"
  | "water"
  | "wudu"
  | "ghusl"
  | "tayammum"
  | "najasah"
  | "exceptions"
  | "reference";

/** One ordered step within a procedural topic (wudu, ghusl, tayammum). */
export interface TaharahStep {
  title: string;
  body: string;
  arabic?: string;
  transliteration?: string;
  tip?: string;
}

/** A self-contained topic within the Learn Purification hub. */
export interface TaharahTopic {
  id: string;
  section: TaharahSection;
  title: string;
  summary: string;
  body: string[];
  steps?: TaharahStep[];
  importance?: JannahImportance;
  quran?: JannahQuranRef[];
  hadith?: JannahHadithRef[];
  actions?: string[];
  appLinks?: JannahAppLink[];
  disclaimer?: string;
}

/** One item on the daily taharah checklist. */
export interface TaharahChecklistItem {
  id: string;
  title: string;
  hint: string;
}
