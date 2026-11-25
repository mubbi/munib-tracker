import type { ObligatoryPrayer } from "@munib-tracker/shared/types";

import { computeLocationPrayerTimes, type StoredLocation } from "@/lib/location";
import { hasValidPrayerTimes } from "@/lib/prayer-times";
import { prayerDayAnchor } from "@/lib/timezone-anchor";
import { locationStore } from "@/stores/location-store";
import { trackerStore } from "@/stores/tracker-store";

import { isObligatoryPrayerId, resolveMarkableObligatoryPrayer } from "./resolve-markable-prayer";
import type { CommandResult, ExternalCommand } from "./types";

export type HandleExternalCommandOptions = {
  /** When true, skip execution (pin lock) but do not treat as failure. */
  defer?: boolean;
  now?: Date;
};

/**
 * True when `prayerId`'s Adhan today is still ahead of `now`. A named mark from
 * a widget row, Siri ("Mark Isha") or the watch must not log a Salah before its
 * time has begun. Unknown times (polar night, bad location) never block.
 */
function hasNotStarted(location: StoredLocation, prayerId: ObligatoryPrayer, now: Date): boolean {
  try {
    const times = computeLocationPrayerTimes(location, prayerDayAnchor(now, location.timeZone));
    if (!hasValidPrayerTimes(times)) return false;
    const at = times[prayerId];
    return at instanceof Date && now.getTime() < at.getTime();
  } catch {
    return false;
  }
}

export async function handleExternalCommand(
  command: ExternalCommand,
  options: HandleExternalCommandOptions = {},
): Promise<CommandResult | "deferred"> {
  if (options.defer) return "deferred";

  const tracker = trackerStore.getState();
  if (!tracker.isReady) {
    await tracker.load();
  }

  const locationState = locationStore.getState();
  if (!locationState.isReady) {
    await locationState.load();
  }

  const refreshedTracker = trackerStore.getState();
  if (!refreshedTracker.isReady) {
    return { ok: false, reason: "not_ready" };
  }

  if (refreshedTracker.excusedReason != null) {
    return { ok: false, reason: "excused" };
  }

  const location = locationStore.getState().location;
  const now = options.now ?? new Date();
  const today = refreshedTracker.date;

  let prayerId: ObligatoryPrayer | null = null;

  if (command.type === "mark-current-obligatory") {
    prayerId = resolveMarkableObligatoryPrayer(location, now, refreshedTracker.prayerStatus);
    if (!prayerId) return { ok: false, reason: "already_done" };
  } else if (command.type === "mark-prayer") {
    if (command.date !== today) {
      return { ok: false, reason: "invalid_date" };
    }
    if (!isObligatoryPrayerId(command.prayerId)) {
      return { ok: false, reason: "invalid_prayer" };
    }
    if (hasNotStarted(location, command.prayerId, now)) {
      return { ok: false, reason: "not_started" };
    }
    prayerId = command.prayerId;
  } else {
    return { ok: false, reason: "invalid_prayer" };
  }

  if (!prayerId) {
    return { ok: false, reason: "already_done" };
  }

  const currentStatus = refreshedTracker.prayerStatus[prayerId] ?? "pending";
  if (currentStatus === "completed") {
    return { ok: true, prayerId, alreadyCompleted: true };
  }

  await refreshedTracker.setPrayerStatus(prayerId, "completed");
  return { ok: true, prayerId };
}
