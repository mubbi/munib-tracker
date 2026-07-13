/** One event on the early Islamic history timeline (Rashidun-focused). */
export interface IslamicHistoryEvent {
  id: string;
  /** Approximate Common-Era year. */
  year: number;
  /** Hijri year when applicable. */
  ah?: number;
  title: string;
  body: string;
  location?: string;
  /** Era tag for filtering. */
  era: "prophetic-close" | "abu-bakr" | "umar" | "uthman" | "ali";
}
