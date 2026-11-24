import type { MiqatPoint } from "@munib-tracker/shared/types";
import { type MiqatProximity, nearestMiqat } from "@munib-tracker/shared/utils";
import * as Location from "expo-location";

import miqatData from "@/assets/data/miqat.json";
import { isTV } from "@/lib/platform/is-tv";

/**
 * The five miqats with Wikidata-sourced coordinates (`scripts/build-data/build-miqat.mjs`,
 * pinned revisions, CC0). Bundled — the land check works offline.
 */
export const MIQAT_POINTS: readonly MiqatPoint[] = miqatData.points as MiqatPoint[];

/** How long to wait for a GPS fix before falling back to the last known position. */
const FIX_TIMEOUT_MS = 10_000;

export type MiqatCheckResult =
  | { status: "ok"; proximity: MiqatProximity }
  | { status: "denied" }
  | { status: "unavailable" };

/**
 * Foreground "Approaching miqat" check for travel by land (NF-3.4). Asks for
 * foreground location only when `prompt` is true (a user tap); a silent re-check
 * only reads the current permission. Coordinates never leave the device and are
 * not stored. TV has no GPS — always "unavailable".
 */
export async function checkMiqatProximity(prompt: boolean): Promise<MiqatCheckResult> {
  if (isTV()) return { status: "unavailable" };
  try {
    const permission = prompt
      ? await Location.requestForegroundPermissionsAsync()
      : await Location.getForegroundPermissionsAsync();
    if (permission.status !== "granted") return { status: "denied" };
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<null>((resolve) => {
      timer = setTimeout(() => resolve(null), FIX_TIMEOUT_MS);
    });
    const fix = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      timeout,
    ]).finally(() => {
      if (timer) clearTimeout(timer);
    });
    const position = fix ?? (await Location.getLastKnownPositionAsync());
    if (!position) return { status: "unavailable" };
    const proximity = nearestMiqat(position.coords, MIQAT_POINTS);
    return proximity ? { status: "ok", proximity } : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}
