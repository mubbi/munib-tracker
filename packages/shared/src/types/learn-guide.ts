import type { JannahAppLink, JannahHadithRef, JannahQuranRef } from "./jannah";

/** Shared educational topic shape for new Learn guides (eid, ruqyah, finance, …). */
export interface LearnGuideTopic {
  id: string;
  section: string;
  title: string;
  summary: string;
  body: string[];
  quran?: JannahQuranRef[];
  hadith?: JannahHadithRef[];
  actions?: string[];
  appLinks?: JannahAppLink[];
  /** Bundled dua id — shown inline via the duas catalog when set. */
  duaId?: string;
  disclaimer?: string;
  /** School-specific practice note (e.g. Eid takbir counts). */
  madhhabNote?: string;
}
