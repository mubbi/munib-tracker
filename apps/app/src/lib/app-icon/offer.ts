import { gregorianToHijri } from "@/lib/hijri";
import { getDevicePreference, setDevicePreferences } from "@/stores/device-preferences-store";

import { type AppIconId, type AppIconPreference, seasonalAppIconForHijri } from "./icons";
import { defaultAppIconPreference } from "./preference";

/** A pending "use seasonal icons?" offer for the season showing now. */
export interface AppIconOffer {
  id: AppIconId;
  /** `<icon>:<hijriYear>` — answering Ramadan 1448 never hides Ramadan 1449. */
  key: string;
}

/** Offer key for one occurrence of a season. */
export function appIconOfferKey(id: AppIconId, hijriYear: number): string {
  return `${id}:${hijriYear}`;
}

/**
 * D75: where seasonal icons are opt-in (Android — some launchers drop the home-screen
 * shortcut on an alias swap), the home screen offers them once per season. No offer
 * once the user has made any choice in Settings, outside a season, or for a season
 * already answered on this device.
 */
export function pendingAppIconOffer(input: {
  stored: AppIconPreference | undefined;
  seen: readonly string[] | undefined;
  date: Date;
  timeZone?: string;
  os?: string;
}): AppIconOffer | null {
  if (input.stored !== undefined) return null;
  if (defaultAppIconPreference(input.os) !== "classic") return null;
  const hijri = gregorianToHijri(input.date, input.timeZone);
  const id = seasonalAppIconForHijri(hijri.month, hijri.day);
  if (!id) return null;
  const key = appIconOfferKey(id, hijri.year);
  return input.seen?.includes(key) ? null : { id, key };
}

/** "Not now": hide this season's offer on this device. */
export async function dismissAppIconOffer(key: string): Promise<void> {
  const seen = getDevicePreference("appIconOffersSeen") ?? [];
  if (seen.includes(key)) return;
  // Keep the list short: a season key is only ever compared with the current year's.
  await setDevicePreferences({ appIconOffersSeen: [...seen, key].slice(-20) });
}
