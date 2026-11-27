import { type PrivateMasjidTimes, sanitizePrivateMasjidTimes } from "@munib-tracker/shared/masjid";
import type { Href } from "expo-router";

import { requestIqamahReschedule } from "@/lib/masjid/home-masjid";
import { homeMasjidTimesActions, homeMasjidTimesStore } from "@/stores/home-masjid-times-store";

/**
 * NF-3.12 on-device timetable OCR (D3) plugs in here without touching the
 * masjid screens:
 *
 * 1. {@link TIMETABLE_IMPORT_ROUTE} is the OCR route; the "Your times" editor
 *    shows an "Import from a photo" button that opens it with `?masjid=<key>`.
 * 2. The OCR flow saves the reviewed result with {@link saveImportedTimetable}
 *    — the same private `home_masjid_times` blob the manual editor writes,
 *    labelled "Your times" and never sent anywhere but the user's own sync.
 */
export const TIMETABLE_IMPORT_ROUTE: Href | null = "/masjids/import" as Href;

type ImportedTimes = Pick<PrivateMasjidTimes, "daily" | "monthly" | "jumuah">;

/**
 * Pure merge of an import into the existing private times: a daily sheet
 * replaces the daily times; a monthly sheet adds / replaces only its own dates
 * (other months stay); Jumu'ah is replaced only when the sheet had Jumu'ah.
 */
export function mergeImportedTimes(
  existing: PrivateMasjidTimes | null | undefined,
  imported: ImportedTimes,
): ImportedTimes {
  const out: ImportedTimes = {};
  const daily = imported.daily ?? existing?.daily;
  if (daily) out.daily = daily;
  if (existing?.monthly || imported.monthly) {
    out.monthly = { ...existing?.monthly, ...imported.monthly };
  }
  const jumuah = imported.jumuah?.length ? imported.jumuah : existing?.jumuah;
  if (jumuah?.length) out.jumuah = jumuah;
  return out;
}

export async function saveImportedTimetable(
  masjidKey: string,
  times: ImportedTimes,
): Promise<boolean> {
  if (!homeMasjidTimesStore.getState().isReady) await homeMasjidTimesStore.getState().load();
  const merged = mergeImportedTimes(homeMasjidTimesStore.getState().times[masjidKey], times);
  const clean = sanitizePrivateMasjidTimes({
    ...merged,
    origin: "ocr",
    updatedAt: new Date().toISOString(),
  });
  if (!clean) return false;
  const { updatedAt: _updatedAt, ...rest } = clean;
  await homeMasjidTimesActions.save(masjidKey, rest);
  requestIqamahReschedule();
  return true;
}
