/** One actionable rite/step in the Hajj or Umrah journey, shown as a checklist row. */
export interface HajjGuideStep {
  /** Globally-unique id (used as the checklist key). */
  id: string;
  /** Short heading for the rite. */
  title: string;
  /** One or two concise sentences describing what to do. */
  body: string;
  /** Optional place the rite happens (e.g. "Mina", "Arafah"). */
  location?: string;
}

/** A phase of the pilgrimage grouping several ordered steps. */
export interface HajjGuideSection {
  id: string;
  /** Which pilgrimage this section belongs to ("prep" covers practical logistics, not rites). */
  kind: "umrah" | "hajj" | "prep";
  title: string;
  summary: string;
  /** Optional day label for Hajj phases (e.g. "8 Dhul-Hijjah"). */
  day?: string;
  steps: HajjGuideStep[];
}
