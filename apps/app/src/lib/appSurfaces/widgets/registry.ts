import type { WidgetInfo, WidgetRepresentation } from "react-native-android-widget";

import type { AppWidgetName } from "@/lib/appSurfaces/widgets/constants";
import {
  renderNextPrayerWidget,
  renderPrayerProgressWidget,
  renderPrayerScheduleWidget,
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
] as const;

export function getAppWidgetByName(name: string): AppWidgetDefinition | undefined {
  return APP_WIDGET_REGISTRY.find((widget) => widget.name === name);
}
