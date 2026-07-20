import { OBLIGATORY_PRAYER_SET } from "@munib-tracker/shared/constants";
import type { ObligatoryPrayer, PrayerStatus } from "@munib-tracker/shared/types";

import type { StoredLocation } from "@/lib/location";
import { locationCalcExtras } from "@/lib/location";
import { nextPrayer, PRAYER_SLOT_ORDER } from "@/lib/prayer-times";

/**
 * Resolves which obligatory prayer to mark for "mark current" commands.
 *
 * Only the Salah whose window is active right now (via `nextPrayer().currentIndex`).
 * Never cascades to upcoming or earlier pending slots — a single Mark my Salah /
 * quick action / widget tap must complete at most one prayer.
 */
export function resolveMarkableObligatoryPrayer(
  location: StoredLocation,
  now: Date,
  prayerStatus: Record<string, PrayerStatus>,
): ObligatoryPrayer | null {
  const coords = { latitude: location.latitude, longitude: location.longitude };
  const next = nextPrayer(
    coords,
    now,
    location.method,
    location.madhab,
    location.timeZone,
    locationCalcExtras(location),
  );

  const trySlot = (index: number): ObligatoryPrayer | null => {
    if (index < 0 || index >= PRAYER_SLOT_ORDER.length) return null;
    const slot = PRAYER_SLOT_ORDER[index];
    if (!OBLIGATORY_PRAYER_SET.has(slot)) return null;
    if ((prayerStatus[slot] ?? "pending") !== "completed") return slot as ObligatoryPrayer;
    return null;
  };

  // During the sunrise marker, the active window is not a fard prayer — prefer Fajr if still pending.
  if (PRAYER_SLOT_ORDER[next.currentIndex] === "sunrise") {
    return trySlot(PRAYER_SLOT_ORDER.indexOf("fajr"));
  }

  return trySlot(next.currentIndex);
}

export function isObligatoryPrayerId(value: string): value is ObligatoryPrayer {
  return OBLIGATORY_PRAYER_SET.has(value);
}
