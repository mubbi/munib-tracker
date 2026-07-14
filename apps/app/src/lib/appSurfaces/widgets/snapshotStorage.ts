import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { WIDGET_APP_GROUP, WIDGET_SNAPSHOT_KEY } from "@/lib/appSurfaces/config";
import { emptyWidgetSnapshot, type WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";

export type { BuildWidgetSnapshotInput } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
export { buildWidgetSnapshot } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
export type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
export { emptyWidgetSnapshot } from "@/lib/appSurfaces/widgets/types";

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
  try {
    const { nativePushWatchSnapshot } = await import("@/lib/external-commands/native-bridge");
    await nativePushWatchSnapshot(json);
  } catch {
    /* WatchConnectivity unavailable in Expo Go. */
  }
}

function normalizeWidgetSnapshot(
  parsed: Partial<WidgetSnapshot> | null | undefined,
): WidgetSnapshot {
  const empty = emptyWidgetSnapshot();
  if (parsed?.version !== 1) return empty;
  return {
    ...empty,
    ...parsed,
    version: 1,
    theme: { ...empty.theme, ...parsed.theme },
    nextPrayer: { ...empty.nextPrayer, ...parsed.nextPrayer },
    schedule: {
      ...empty.schedule,
      ...parsed.schedule,
      rows: parsed.schedule?.rows ?? [],
    },
    progress: { ...empty.progress, ...parsed.progress },
  };
}

export async function readWidgetSnapshot(): Promise<WidgetSnapshot> {
  try {
    const raw = await AsyncStorage.getItem(WIDGET_SNAPSHOT_KEY);
    if (!raw) return emptyWidgetSnapshot();
    return normalizeWidgetSnapshot(JSON.parse(raw) as Partial<WidgetSnapshot>);
  } catch {
    return emptyWidgetSnapshot();
  }
}

export async function writeWidgetSnapshot(snapshot: WidgetSnapshot): Promise<void> {
  const json = JSON.stringify(snapshot);
  await AsyncStorage.setItem(WIDGET_SNAPSHOT_KEY, json);
  await writeIosSnapshot(json);
}
