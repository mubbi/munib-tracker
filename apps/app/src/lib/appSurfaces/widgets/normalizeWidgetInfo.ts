import {
  ANDROID_WIDGET_DEFAULT_DP,
  type AppWidgetName,
  isAppWidgetName,
} from "@/lib/appSurfaces/widgets/constants";

/** Subset of react-native-android-widget WidgetInfo used for layout normalization. */
export type WidgetLayoutInfo = {
  widgetName: string;
  widgetId: number;
  width: number;
  height: number;
  screenInfo: {
    screenHeightDp: number;
    screenWidthDp: number;
    density: number;
    densityDpi: number;
  };
};

/** AppWidgetManager can report 0×0 dp before the first layout pass — that yields an empty widget bitmap. */
export function normalizeWidgetInfo<T extends WidgetLayoutInfo>(widgetInfo: T): T {
  if (widgetInfo.width > 0 && widgetInfo.height > 0) return widgetInfo;
  const fallback = isAppWidgetName(widgetInfo.widgetName)
    ? ANDROID_WIDGET_DEFAULT_DP[widgetInfo.widgetName as AppWidgetName]
    : ANDROID_WIDGET_DEFAULT_DP.NextPrayerWidget;
  return {
    ...widgetInfo,
    width: widgetInfo.width > 0 ? widgetInfo.width : fallback.width,
    height: widgetInfo.height > 0 ? widgetInfo.height : fallback.height,
  };
}
