import { OBLIGATORY_PRAYER_SET, OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type { ObligatoryPrayer, PrayerStatus } from "@munib-tracker/shared/types";

import type { StoredLocation } from "@/lib/location";
import { locationCalcExtras } from "@/lib/location";
import { nextPrayer, PRAYER_SLOT_ORDER } from "@/lib/prayer-times";

/**
 * Resolves which obligatory prayer to mark for "mark current" commands.
 * Uses `nextPrayer().currentIndex` (active window), not countdown `id`.
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
    const fajrIdx = PRAYER_SLOT_ORDER.indexOf("fajr");
    const fajr = trySlot(fajrIdx);
    if (fajr) return fajr;
  }

  // Prefer the prayer whose window is active right now.
  const current = trySlot(next.currentIndex);
  if (current) return current;

  // Then the next upcoming obligatory slot today.
  for (let i = next.currentIndex + 1; i < PRAYER_SLOT_ORDER.length; i += 1) {
    const slot = trySlot(i);
    if (slot) return slot;
  }

  // Finally any earlier obligatory slot still pending (missed today).
  for (let i = next.currentIndex - 1; i >= 0; i -= 1) {
    const slot = trySlot(i);
    if (slot) return slot;
  }

  for (const id of OBLIGATORY_PRAYERS) {
    if ((prayerStatus[id] ?? "pending") !== "completed") return id;
  }

  return null;
}

export function isObligatoryPrayerId(value: string): value is ObligatoryPrayer {
  return OBLIGATORY_PRAYER_SET.has(value);
}
