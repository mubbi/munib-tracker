import type { WidgetInfo } from "react-native-android-widget";

import { emptyWidgetSnapshot, type WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";

/** Android `WidgetInfo` (dp) for widget renderer / task-handler tests. */
export function buildWidgetInfo(overrides: Partial<WidgetInfo> = {}): WidgetInfo {
  return {
    widgetName: "NextPrayerWidget",
    widgetId: 1,
    width: 300,
    height: 160,
    screenInfo: { screenHeightDp: 800, screenWidthDp: 400, density: 2, densityDpi: 320 },
    ...overrides,
  } as WidgetInfo;
}

type SnapshotOverrides = {
  [K in keyof WidgetSnapshot]?: WidgetSnapshot[K] extends object
    ? Partial<WidgetSnapshot[K]>
    : WidgetSnapshot[K];
};

/** A valid widget snapshot; each section override is merged onto the empty default. */
export function buildWidgetSnapshot(overrides: SnapshotOverrides = {}): WidgetSnapshot {
  const base = emptyWidgetSnapshot() as unknown as Record<string, unknown>;
  const merged: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    const current = base[key];
    const mergeable =
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      current &&
      typeof current === "object";
    merged[key] = mergeable ? { ...(current as object), ...(value as object) } : value;
  }
  return merged as unknown as WidgetSnapshot;
}
