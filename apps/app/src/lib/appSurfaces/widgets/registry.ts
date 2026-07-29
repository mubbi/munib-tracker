import type { WidgetInfo, WidgetRepresentation } from "react-native-android-widget";

import type { AppWidgetName } from "@/lib/appSurfaces/widgets/constants";
import {
  renderDailyHadithWidget,
  renderHijriDateWidget,
  renderJumuahWidget,
  renderKhatmProgressWidget,
  renderNextPrayerWidget,
  renderPrayerProgressWidget,
  renderPrayerScheduleWidget,
  renderQazaDebtWidget,
  renderQiblaBearingWidget,
  renderRamadanWidget,
  renderSalahStreakWidget,
  renderTasbeehGlanceWidget,
} from "@/lib/appSurfaces/widgets/renderers/allWidgets";

export type AppWidgetDefinition = {
  name: AppWidgetName;
  render: (info: WidgetInfo) => Promise<WidgetRepresentation> | WidgetRepresentation;
};

/**
 * Home-screen widget registry. Add a renderer here and mirror the name in
 * lib/appSurfaces/widgets/constants.ts + plugins/homeScreenSurfaces.cjs.
 */
export const APP_WIDGET_REGISTRY: readonly AppWidgetDefinition[] = [
  { name: "NextPrayerWidget", render: renderNextPrayerWidget },
  { name: "PrayerScheduleWidget", render: renderPrayerScheduleWidget },
  { name: "PrayerProgressWidget", render: renderPrayerProgressWidget },
  { name: "SalahStreakWidget", render: renderSalahStreakWidget },
  { name: "QazaDebtWidget", render: renderQazaDebtWidget },
  { name: "RamadanWidget", render: renderRamadanWidget },
  { name: "KhatmProgressWidget", render: renderKhatmProgressWidget },
  { name: "DailyHadithWidget", render: renderDailyHadithWidget },
  { name: "HijriDateWidget", render: renderHijriDateWidget },
  { name: "QiblaBearingWidget", render: renderQiblaBearingWidget },
  { name: "TasbeehGlanceWidget", render: renderTasbeehGlanceWidget },
  { name: "JumuahWidget", render: renderJumuahWidget },
] as const;

export function getAppWidgetByName(name: string): AppWidgetDefinition | undefined {
  return APP_WIDGET_REGISTRY.find((widget) => widget.name === name);
}
