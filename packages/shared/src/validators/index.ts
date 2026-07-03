import { OBLIGATORY_PRAYER_SET, SUNNAH_PRAYER_SET, ZIKR_CATEGORY_SET } from "../constants/index";
import type {
  ObligatoryPrayer,
  PrayerId,
  PrayerStatus,
  SunnahPrayer,
  ZikrCategoryId,
} from "../types/index";

const PRAYER_STATUSES: ReadonlySet<string> = new Set<PrayerStatus>([
  "pending",
  "completed",
  "missed",
  "delayed",
  "qaza",
]);

export function isObligatoryPrayer(value: string): value is ObligatoryPrayer {
  return OBLIGATORY_PRAYER_SET.has(value);
}

export function isSunnahPrayer(value: string): value is SunnahPrayer {
  return SUNNAH_PRAYER_SET.has(value);
}

export function isPrayerId(value: string): value is PrayerId {
  return OBLIGATORY_PRAYER_SET.has(value) || SUNNAH_PRAYER_SET.has(value);
}

export function isPrayerStatus(value: string): value is PrayerStatus {
  return PRAYER_STATUSES.has(value);
}

export function isZikrCategoryId(value: string): value is ZikrCategoryId {
  return ZIKR_CATEGORY_SET.has(value);
}
