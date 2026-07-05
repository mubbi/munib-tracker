/** One milestone on the Seerah timeline of the Prophet Muhammad ﷺ. */
export interface SeerahEvent {
  /** Stable, unique id. */
  id: string;
  /** Approximate Common-Era year of the event. */
  year: number;
  /** Hijri year, for events on or after the Hijra. */
  ah?: number;
  title: string;
  /** One or two concise sentences describing the event. */
  body: string;
  /** Where the event took place, e.g. "Makkah", "Madinah". */
  location?: string;
}
