/** The five daily fard prayers. */
export type ObligatoryPrayer = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

/** Witr — sunnah mu'akkadah (wajib in the Hanafi madhhab), tracked separately from fard. */
export type WitrPrayer = "witr";

/** Prayers that can accrue qaza counters (five fard plus Witr for optional make-up tracking). */
export type QazaPrayer = ObligatoryPrayer | WitrPrayer;

/** Prayers that can scope after-salah adhkar: the five fard plus Witr (its own tab). */
export type AfterSalahPrayer = ObligatoryPrayer | WitrPrayer;

export type SunnahPrayer = "tahajjud" | "ishraq" | "duha" | "tahiyyatul_masjid" | "hajat_istikhara";

/**
 * The sunnah mu'akkadah rawatib attached to the fard (NF-3.1). Stored as their
 * own prayer ids on `PrayerLog` (plan §1 lock) — they never accrue qaza and never
 * count toward fard totals, streaks or perfect days.
 */
export type RawatibPrayer =
  | "fajr_before" // 2 — mu'akkadah (all)
  | "dhuhr_before" // 2 or 4 — preset-dependent
  | "dhuhr_after" // 2
  | "maghrib_after" // 2
  | "isha_after"; // 2

/** Optional ghayr mu'akkadah extras the user can switch on (D8). */
export type RawatibExtraPrayer =
  | "asr_before" // 4 (or 2)
  | "maghrib_before" // 2
  | "isha_before" // 2 or 4
  | "dhuhr_after_extra"; // +2 (making 4 after Dhuhr)

/** Any rawatib row (mu'akkadah or extra). */
export type RawatibId = RawatibPrayer | RawatibExtraPrayer;

export type PrayerId = ObligatoryPrayer | WitrPrayer | SunnahPrayer | RawatibId;

export type PrayerStatus = "pending" | "completed" | "missed" | "delayed" | "qaza";

export type PrayerLogSource = "manual" | "bulk_import" | "sync";

/** Jam' (combining) mode: advanced into the earlier time (taqdim) or delayed into the later (ta'khir). */
export type PrayerCombineMode = "taqdim" | "takhir";

/**
 * Why obligatory tracking is paused (streak frozen, no qaza prompt).
 * Multi-day periods (especially hayd) continue via `UserPreferences.activeExcusedReason`
 * until the user resumes; each calendar day still stores flags on prayer logs.
 * `nifas` = postnatal bleeding (NF-3.0a retrofit; its own maximum per school).
 */
export type ExcusedReason = "hayd" | "nifas" | "sick" | "travel";

/** Every excused reason, in picker order. */
export const EXCUSED_REASONS = [
  "hayd",
  "nifas",
  "sick",
  "travel",
] as const satisfies readonly ExcusedReason[];

export interface PrayerLog {
  id: string;
  prayerId: PrayerId;
  /** ISO date YYYY-MM-DD (user's local calendar day) */
  date: string;
  status: PrayerStatus;
  notes?: string;
  /** When true, leaving "missed" decrements the linked qaza debt once. */
  qazaDebtAdded?: boolean;
  /** Prayed in congregation (jama') — optional flag on a completed salah (NF-1.5). */
  isJama?: boolean;
  /**
   * Prayed combined (jam') with the paired fard — Dhuhr with Asr, Maghrib with
   * Isha — for travel or rain (NF-3.0a). Written on both logs of the pair.
   * Unrelated to `isJama` (congregation). Only offered when the user's school
   * allows combining; an existing flag is always shown and can be cleared.
   */
  combinedWith?: ObligatoryPrayer;
  /** `taqdim`: both in the earlier prayer's time; `takhir`: both in the later one's. */
  combineMode?: PrayerCombineMode;
  /**
   * The day is excused (hayd / illness / travel): obligatory tracking is paused,
   * the streak is frozen across it, and no qaza is prompted (NF-1.2, NF-1.4).
   * An active period auto-applies these flags on new calendar days until resume.
   */
  isExcused?: boolean;
  excusedReason?: ExcusedReason;
  /** Rak'at prayed for a sunnah with a variable count (e.g. `dhuhr_before` 2 | 4) — NF-3.1. */
  rakahs?: number;
  /** Sunnah prayed after its usual time (e.g. the Fajr sunnah after sunrise) — NF-3.1. */
  late?: boolean;
  /**
   * Prayed at the masjid (NF-3.11). Separate from `isJama` — congregation can
   * happen at home. Offered on obligatory prayers when a home masjid is set.
   */
  atMasjid?: boolean;
  /** OSM ref of that masjid (`node/123`, the home masjid when logged); cleared with `atMasjid`. */
  masjidId?: string;
  /** ISO datetime */
  updatedAt: string;
  source: PrayerLogSource;
}
