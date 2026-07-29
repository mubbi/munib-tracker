import type { ObligatoryPrayer } from "@munib-tracker/shared/types";

import { locationStore } from "@/stores/location-store";
import { trackerStore } from "@/stores/tracker-store";

import { isObligatoryPrayerId, resolveMarkableObligatoryPrayer } from "./resolve-markable-prayer";
import type { CommandResult, ExternalCommand } from "./types";

export type HandleExternalCommandOptions = {
  /** When true, skip execution (pin lock) but do not treat as failure. */
  defer?: boolean;
  now?: Date;
};

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
