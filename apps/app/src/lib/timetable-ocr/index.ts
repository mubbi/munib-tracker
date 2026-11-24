import type { CalculatedTimesFn, TimetablePrayer } from "@munib-tracker/shared/timetable-parser";
import { Platform } from "react-native";

import { computeLocationPrayerTimes, type StoredLocation } from "@/lib/location";
import { deletePath } from "@/lib/native-file-store";
import { hasValidPrayerTimes } from "@/lib/prayer-times";
import { getZonedParts } from "@/lib/time";

/**
 * NF-3.12 timetable OCR glue (app side). Recognition is platform-split in
 * `./recognize` (native module / web WASM); parsing is the pure shared parser
 * (`@munib-tracker/shared/timetable-parser`). Nothing here talks to a server.
 */
export {
  type OcrAvailability,
  ocrAvailability,
  ocrDownloadAccepted,
  ocrDownloadBytes,
  recognizeImage,
} from "./recognize";

const PRAYER_KEYS: Array<
  [TimetablePrayer, "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha"]
> = [
  ["fajr", "fajr"],
  ["sunrise", "sunrise"],
  ["dhuhr", "dhuhr"],
  ["asr", "asr"],
  ["maghrib", "maghrib"],
  ["isha", "isha"],
];

function hhmm(date: Date, timeZone?: string): string {
  const parts = getZonedParts(date, timeZone);
  return `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}

/**
 * Calculated adhan times for the user's location (plan step 6 plausibility):
 * the parser flags adhan cells more than 20 min away and iqamahs outside
 * [adhan, adhan + 90]. Null location ⇒ no plausibility check.
 */
export function calculatedTimesFor(
  location: StoredLocation | null | undefined,
): CalculatedTimesFn | undefined {
  if (!location) return undefined;
  const cache = new Map<string, Partial<Record<TimetablePrayer, string>> | null>();
  return (dateKey) => {
    if (cache.has(dateKey)) return cache.get(dateKey);
    const [y, m, d] = dateKey.split("-").map(Number);
    let out: Partial<Record<TimetablePrayer, string>> | null = null;
    if (y && m && d) {
      const times = computeLocationPrayerTimes(location, new Date(y, m - 1, d, 12));
      if (hasValidPrayerTimes(times)) {
        out = {};
        for (const [key, field] of PRAYER_KEYS) out[key] = hhmm(times[field], location.timeZone);
      }
    }
    cache.set(dateKey, out);
    return out;
  };
}

/**
 * Deletes the app's copy of the picked photo (the picker copies it into the
 * cache). The user's own gallery original is never touched. Web blob/data URIs
 * are only revoked.
 */
export function discardPhoto(uri: string | null | undefined): void {
  if (!uri) return;
  try {
    if (Platform.OS === "web") {
      if (uri.startsWith("blob:")) URL.revokeObjectURL(uri);
      return;
    }
    if (uri.startsWith("file:")) deletePath(uri);
  } catch {
    /* already gone */
  }
}
