import {
  OBLIGATORY_PRAYER_SET,
  QAZA_PRAYER_SET,
  SUNNAH_PRAYER_SET,
  WITR_PRAYER,
  ZIKR_CATEGORY_SET,
} from "../constants/index";
import type {
  ObligatoryPrayer,
  PrayerId,
  PrayerStatus,
  QazaPrayer,
  SunnahPrayer,
  WitrPrayer,
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

export function isWitrPrayer(value: string): value is WitrPrayer {
  return value === WITR_PRAYER;
}

export function isQazaPrayer(value: string): value is QazaPrayer {
  return QAZA_PRAYER_SET.has(value);
}

export function isSunnahPrayer(value: string): value is SunnahPrayer {
  return SUNNAH_PRAYER_SET.has(value);
}

export function isPrayerId(value: string): value is PrayerId {
  return isObligatoryPrayer(value) || isWitrPrayer(value) || isSunnahPrayer(value);
}

export function isPrayerStatus(value: string): value is PrayerStatus {
  return PRAYER_STATUSES.has(value);
}

export function isZikrCategoryId(value: string): value is ZikrCategoryId {
  return ZIKR_CATEGORY_SET.has(value);
}
