import { useEffect, useState } from "react";
import { AppState } from "react-native";

import { type AppIconPreference, isAppIconModuleAvailable, syncAppIcon } from "@/lib/app-icon";
import { hijriAdjustmentSignature } from "@/lib/hijri-adjustment";
import { runWhenIdle } from "@/lib/run-when-idle";
import { useSetting } from "@/lib/settings/use-setting";
import { useStore } from "@/stores/create-store";
import { devicePreferencesStore } from "@/stores/device-preferences-store";
import { locationStore, useLocation } from "@/stores/location-store";
import { usePreferences, usePreferencesReady } from "@/stores/preferences-store";

/** Settings id of the launcher icon choice (`lib/settings/defs/appearance.ts`). */
const APP_ICON_SETTING = "appearance.appIcon";

/**
 * Keeps the launcher icon in line with Settings › Appearance › App icon (NF-2.23b).
 * Renders nothing; a no-op wherever the native module is missing (web, TV, Expo Go,
 * older binaries).
 *
 * It syncs once every store the Hijri date depends on has hydrated — so a cold
 * start never computes "today" on the seeded default location and flips the icon
 * (on iOS: shows the system alert) for the wrong day — and again on each return to
 * the foreground, which is when a season boundary is crossed in practice.
 */
export function AppIconHost() {
  if (!isAppIconModuleAvailable()) return null;
  return <AppIconSync />;
}

function AppIconSync() {
  const { value } = useSetting<AppIconPreference>(APP_ICON_SETTING);
  const prefsReady = usePreferencesReady();
  const deviceReady = useStore(devicePreferencesStore, (s) => s.isReady);
  const locationReady = useStore(locationStore, (s) => s.isReady);
  const location = useLocation();
  const hijriKey = hijriAdjustmentSignature(usePreferences().hijriAdjustment);
  const [foregrounds, setForegrounds] = useState(0);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") setForegrounds((n) => n + 1);
    });
    return () => sub.remove();
  }, []);

  const ready = prefsReady && deviceReady && locationReady;
  const { timeZone, latitude, longitude } = location;

  useEffect(() => {
    if (!ready) return;
    // The Hijri observer (latitude/longitude) and corrections (hijriKey) feed
    // `gregorianToHijri` through module state; they are deps so a change re-syncs.
    void latitude;
    void longitude;
    void hijriKey;
    void foregrounds;
    const task = runWhenIdle(() => {
      void syncAppIcon(value, { timeZone });
    });
    return () => task.cancel();
  }, [ready, value, timeZone, latitude, longitude, hijriKey, foregrounds]);

  return null;
}
