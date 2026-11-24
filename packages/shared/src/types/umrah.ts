/**
 * Umrah mode (NF-3.4): a live, step-by-step companion during Umrah. Steps run in
 * a fixed order; the tawaf and sa'i steps carry a 7-round counter.
 */
export const UMRAH_STEPS = [
  "prepare",
  "miqat",
  "ihram",
  "talbiyah",
  "arrive_haram",
  "tawaf",
  "two_rakah_behind_maqam",
  "zamzam",
  "sai",
  "halq_taqsir",
  "complete",
] as const;

export type UmrahStep = (typeof UMRAH_STEPS)[number];

/** The two counted rites. */
export type UmrahRoundKind = "tawaf" | "sai";

/** How the pilgrim reaches the miqat: land (GPS proximity) or air (manual timer). */
export type UmrahTravelMode = "land" | "air";

/** Men choose halq (shaving, preferred) or taqsir; women shorten. */
export type UmrahHairChoice = "halq" | "taqsir";

export interface UmrahSession {
  id: string;
  /** ISO time the session was started. */
  startedAt: string;
  /** ISO time of the last change — per-session last-write-wins sync key. */
  updatedAt: string;
  step: UmrahStep;
  /** Completed tawaf circuits (0–7). */
  tawafLaps: number;
  /** Completed sa'i courses (0–7); Safa → Marwah is one. */
  saiLaps: number;
  /** ISO time each tawaf circuit was counted (length === `tawafLaps`) — per-lap timer. */
  tawafLapTimes?: string[];
  /** ISO time each sa'i course was counted (length === `saiLaps`). */
  saiLapTimes?: string[];
  travelMode?: UmrahTravelMode;
  /** Air: the user's own estimate of when the flight crosses the miqat (ISO). */
  flightMiqatAt?: string;
  hairChoice?: UmrahHairChoice;
  /** ISO time the session reached `complete`. */
  completedAt?: string;
  /** Tombstone so a removal propagates across devices. */
  deleted?: boolean;
  /** Every step entered, in order (the first entry is the start). */
  log: Array<{ step: UmrahStep; at: string }>;
}

/** Sessions by id — the `umrah_sessions` sync blob. */
export type UmrahSessionMap = Record<string, UmrahSession>;

/** One miqat point from the bundled dataset (`assets/data/miqat.json`, from Wikidata). */
export interface MiqatPoint {
  id: "dhul_hulayfah" | "al_juhfah" | "qarn_al_manazil" | "yalamlam" | "dhat_irq";
  /** Wikidata item the coordinates were read from (P625). */
  wikidata: string;
  latitude: number;
  longitude: number;
}
