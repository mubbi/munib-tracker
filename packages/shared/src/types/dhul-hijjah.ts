/**
 * Dhul-Hijjah mode (NF-3.3) — the ten days, Arafah, Eid al-Adha and Tashriq.
 * Persisted per Hijri year (`DhulHijjahStore`), synced as blob entity `dhul_hijjah`.
 */

export type UdhiyahAnimal = "sheep" | "goat" | "cow_share" | "camel_share" | "cow" | "camel";

export type UdhiyahStatus = "planned" | "arranged" | "slaughtered" | "distributed";

export interface UdhiyahPlan {
  animal: UdhiyahAnimal;
  /** Number of 1/7 shares (cow/camel share only). */
  shares?: number;
  via: "self" | "agency";
  /** Names it is offered on behalf of (kept on the device / synced; never in notifications). */
  onBehalfOf?: string[];
  status: UdhiyahStatus;
}

export interface DhulHijjahState {
  hijriYear: number;
  /** "I intend udhiyah" — `since` is the ISO instant the intention was set. */
  intendsUdhiyah?: { since: string } | null;
  udhiyah?: UdhiyahPlan;
  /** `${itemId}::${YYYY-MM-DD}` → true. */
  dailyChecks: Record<string, true>;
  /** `${YYYY-MM-DD}::${prayer}` → true (Takbir al-Tashriq said after that fard). */
  tashriq: Record<string, true>;
  /**
   * Per-key ISO instant of the last tick / untick (`dailyChecks` / `tashriq`
   * keys; a stamp without a value is an untick). Sync keeps the newest write
   * per key. Absent on data written before stamps existed (treated as oldest).
   */
  dailyStamps?: Record<string, string>;
  tashriqStamps?: Record<string, string>;
  /** ISO instant of the last edit to the scalar fields (intention / planner) — sync LWW. */
  updatedAt?: string;
}

/** Hijri year (as a string key) → that year's state. */
export type DhulHijjahStore = Record<string, DhulHijjahState>;
