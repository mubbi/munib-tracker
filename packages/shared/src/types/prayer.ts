/** The five daily fard prayers. */
export type ObligatoryPrayer = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

/** Witr — sunnah mu'akkadah (wajib in the Hanafi madhhab), tracked separately from fard. */
export type WitrPrayer = "witr";

/** Prayers that can accrue qaza counters (five fard plus Witr for optional make-up tracking). */
export type QazaPrayer = ObligatoryPrayer | WitrPrayer;

export type SunnahPrayer = "tahajjud" | "ishraq" | "duha" | "tahiyyatul_masjid" | "hajat_istikhara";

export type PrayerId = ObligatoryPrayer | WitrPrayer | SunnahPrayer;

export type PrayerStatus = "pending" | "completed" | "missed" | "delayed" | "qaza";

export type PrayerLogSource = "manual" | "bulk_import" | "sync";

export interface PrayerLog {
  id: string;
  prayerId: PrayerId;
  /** ISO date YYYY-MM-DD (user's local calendar day) */
  date: string;
  status: PrayerStatus;
  notes?: string;
  /** When true, leaving "missed" decrements the linked qaza debt once. */
  qazaDebtAdded?: boolean;
  /** ISO datetime */
  updatedAt: string;
  source: PrayerLogSource;
}
