import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import { refreshRegisteredAndroidWidgets } from "@/lib/appSurfaces/widgets/androidTaskHandler";
import {
  buildWidgetSnapshot,
  writeWidgetSnapshot,
} from "@/lib/appSurfaces/widgets/snapshotStorage";
import { nativePushWearSnapshot } from "@/lib/external-commands/native-bridge";
import { syncLiveActivity } from "@/lib/live-activity";
import { toAppLocale } from "@/lib/locale-bcp47";
import { runWhenIdle } from "@/lib/run-when-idle";
import { useTheme } from "@/providers/theme-provider";
import { useLocation, useLocationStatus } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";
import { useDailySummary, useTodayPrayers } from "@/stores/tracker-store";

/** Longer than a typical theme toggle paint so native I/O never contends with UI. */
const WIDGET_SYNC_DEBOUNCE_MS = 750;

/** Refresh home-screen widget snapshot when prayer data or theme changes. */
export function useWidgetSnapshotSync(): void {
  const { t, i18n } = useTranslation();
  const { scheme, colors } = useTheme();
  const location = useLocation();
  const locationStatus = useLocationStatus();
  const { timeFormat, defaultCalendar, liveActivityEnabled } = usePreferences();
  const summary = useDailySummary();
  const { status: prayerStatus } = useTodayPrayers();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const locale = toAppLocale(i18n.language ?? "en");

  const sync = useCallback(async () => {
    if (Platform.OS === "web") return;
    const locationDenied = locationStatus === "denied";
    const snapshot = buildWidgetSnapshot({
      location: locationDenied ? null : location,
      locationDenied,
      locale,
      calendar: defaultCalendar,
      timeFormat,
      theme: { isDark: scheme === "dark", primaryColor: colors.accent },
      salahCompleted: summary.salahCompleted,
      salahTotal: summary.salahTotal,
      prayerStatus,
      t,
    });
    await writeWidgetSnapshot(snapshot);
    const snapshotJson = JSON.stringify(snapshot);
    await nativePushWearSnapshot(snapshotJson);
    await refreshRegisteredAndroidWidgets();
    await syncLiveActivity({ snapshot, enabled: liveActivityEnabled === true });
  }, [
    colors.accent,
    defaultCalendar,
    liveActivityEnabled,
    locale,
    location,
    locationStatus,
    prayerStatus,
    scheme,
    summary.salahCompleted,
    summary.salahTotal,
    t,
    timeFormat,
  ]);

  useEffect(() => {
    if (Platform.OS === "web") return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    let idleCancel: (() => void) | null = null;
    debounceRef.current = setTimeout(() => {
      const handle = runWhenIdle(() => {
        void sync();
      });
      idleCancel = handle.cancel;
    }, WIDGET_SYNC_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      idleCancel?.();
    };
  }, [sync]);
}
