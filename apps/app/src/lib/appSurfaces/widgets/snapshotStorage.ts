import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { WIDGET_APP_GROUP, WIDGET_SNAPSHOT_KEY } from "@/lib/appSurfaces/config";
import { EMPTY_WIDGET_SNAPSHOT, type WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";

export type { BuildWidgetSnapshotInput } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
export { buildWidgetSnapshot } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
export type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
export { EMPTY_WIDGET_SNAPSHOT } from "@/lib/appSurfaces/widgets/types";

async function writeIosSnapshot(json: string): Promise<void> {
  if (Platform.OS !== "ios") return;
  try {
    const { ExtensionStorage } = await import("@bacons/apple-targets/build/ExtensionStorage");
    const storage = new ExtensionStorage(WIDGET_APP_GROUP);
    storage.set(WIDGET_SNAPSHOT_KEY, json);
    ExtensionStorage.reloadWidget();
  } catch {
    /* ExtensionStorage unavailable in Expo Go. */
  }
}

function normalizeWidgetSnapshot(
  parsed: Partial<WidgetSnapshot> | null | undefined,
): WidgetSnapshot {
  if (parsed?.version !== 1) return EMPTY_WIDGET_SNAPSHOT;
  return {
    ...EMPTY_WIDGET_SNAPSHOT,
    ...parsed,
    version: 1,
    theme: { ...EMPTY_WIDGET_SNAPSHOT.theme, ...parsed.theme },
    nextPrayer: { ...EMPTY_WIDGET_SNAPSHOT.nextPrayer, ...parsed.nextPrayer },
    schedule: {
      ...EMPTY_WIDGET_SNAPSHOT.schedule,
      ...parsed.schedule,
      rows: parsed.schedule?.rows ?? [],
    },
    progress: { ...EMPTY_WIDGET_SNAPSHOT.progress, ...parsed.progress },
  };
}

export async function readWidgetSnapshot(): Promise<WidgetSnapshot> {
  try {
    const raw = await AsyncStorage.getItem(WIDGET_SNAPSHOT_KEY);
    if (!raw) return EMPTY_WIDGET_SNAPSHOT;
    return normalizeWidgetSnapshot(JSON.parse(raw) as Partial<WidgetSnapshot>);
  } catch {
    return EMPTY_WIDGET_SNAPSHOT;
  }
}

export async function writeWidgetSnapshot(snapshot: WidgetSnapshot): Promise<void> {
  const json = JSON.stringify(snapshot);
  await AsyncStorage.setItem(WIDGET_SNAPSHOT_KEY, json);
  await writeIosSnapshot(json);
}
