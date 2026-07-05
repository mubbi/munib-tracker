import type { QazaPrayer } from "./prayer";

/** One ordered step within a salah-guide topic (e.g. a wudu step or salah posture). */
export interface SalahGuideStep {
  /** Short heading for the step. */
  title: string;
  /** One or two concise sentences describing the step. */
  body: string;
}

/** A self-contained guide topic (overview, wudu, how-to-pray, …). */
export interface SalahGuideTopic {
  id: string;
  title: string;
  summary: string;
  steps: SalahGuideStep[];
}

/** Rakat counts for one prayer — fard plus commonly-prayed sunnah around it. */
export interface PrayerRakatSummary {
  prayerId: QazaPrayer;
  fard: number;
  sunnahBefore: number;
  sunnahAfter: number;
  /** Extra note, e.g. Witr being wajib for Hanafis. */
  note?: string;
}
