export type ObligatoryPrayer = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha" | "witr";

export type SunnahPrayer = "tahajjud" | "ishraq" | "duha" | "tahiyyatul_masjid" | "hajat_istikhara";

export type PrayerId = ObligatoryPrayer | SunnahPrayer;

export type PrayerStatus = "pending" | "completed" | "missed" | "delayed" | "qaza";

export type PrayerLogSource = "manual" | "bulk_import" | "sync";

export interface PrayerLog {
  id: string;
  prayerId: PrayerId;
  /** ISO date YYYY-MM-DD (user's local calendar day) */
  date: string;
  status: PrayerStatus;
  notes?: string;
  /** ISO datetime */
  updatedAt: string;
  source: PrayerLogSource;
}
