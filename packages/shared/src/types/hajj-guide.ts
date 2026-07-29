/** One actionable rite on a Hajj or Umrah checklist. */
export interface PilgrimageChecklistItem {
  /** Globally-unique id (used as the checklist persistence key). */
  id: string;
  /** Short heading for the rite. */
  title: string;
  /** Concise hint describing what to do. */
  hint: string;
  /** Optional place the rite happens (e.g. "Mina", "Arafah"). */
  location?: string;
  /** Optional day label for Hajj phases (e.g. "8 Dhul-Hijjah"). */
  day?: string;
}

/** @deprecated Prefer PilgrimageChecklistItem — kept for transitional imports. */
export type HajjGuideStep = PilgrimageChecklistItem;

/** @deprecated Learn topics use LearnGuideTopic; checklist sections are flat item lists. */
export interface HajjGuideSection {
  id: string;
  kind: "umrah" | "hajj" | "prep";
  title: string;
  summary: string;
  day?: string;
  steps: PilgrimageChecklistItem[];
}
