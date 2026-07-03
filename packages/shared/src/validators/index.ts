import { OBLIGATORY_PRAYERS, SUNNAH_PRAYERS, ZIKR_CATEGORY_IDS } from "../constants/index";
import type {
  ObligatoryPrayer,
  PrayerId,
  PrayerStatus,
  SunnahPrayer,
  TrackerCategory,
  ZikrCategoryId,
} from "../types/index";

const OBLIGATORY_SET = new Set<string>(OBLIGATORY_PRAYERS);
const SUNNAH_SET = new Set<string>(SUNNAH_PRAYERS);
const ZIKR_CATEGORY_SET = new Set<string>(ZIKR_CATEGORY_IDS);
const PRAYER_STATUSES = new Set<string>(["pending", "completed", "missed", "delayed", "qaza"]);

export function isTrackerCategory(value: string): value is TrackerCategory {
  return value === "salah" || value === "dhikr" || value === "qadha";
}

export function isObligatoryPrayer(value: string): value is ObligatoryPrayer {
  return OBLIGATORY_SET.has(value);
}

export function isSunnahPrayer(value: string): value is SunnahPrayer {
  return SUNNAH_SET.has(value);
}

export function isPrayerId(value: string): value is PrayerId {
  return OBLIGATORY_SET.has(value) || SUNNAH_SET.has(value);
}

export function isPrayerStatus(value: string): value is PrayerStatus {
  return PRAYER_STATUSES.has(value);
}

export function isZikrCategoryId(value: string): value is ZikrCategoryId {
  return ZIKR_CATEGORY_SET.has(value);
}
