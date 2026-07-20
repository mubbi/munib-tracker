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
    locale: parsed.locale ?? empty.locale,
    isRtl: parsed.isRtl ?? empty.isRtl,
    theme: { ...empty.theme, ...parsed.theme, followsSystem: parsed.theme?.followsSystem ?? true },
    nextPrayer: {
      ...empty.nextPrayer,
      ...parsed.nextPrayer,
      followingName: parsed.nextPrayer?.followingName ?? "",
      followingTime: parsed.nextPrayer?.followingTime ?? "",
      markLabel: parsed.nextPrayer?.markLabel ?? empty.nextPrayer.markLabel,
      accessibilityLabel:
        parsed.nextPrayer?.accessibilityLabel ?? empty.nextPrayer.accessibilityLabel,
    },
    schedule: {
      ...empty.schedule,
      ...parsed.schedule,
      rows: (parsed.schedule?.rows ?? []).map((row) => ({
        ...row,
        statusLabel: row.statusLabel ?? row.status,
      })),
      accessibilityLabel: parsed.schedule?.accessibilityLabel ?? empty.schedule.accessibilityLabel,
    },
    progress: {
      ...empty.progress,
      ...parsed.progress,
      markLabel: parsed.progress?.markLabel ?? empty.progress.markLabel,
      accessibilityLabel: parsed.progress?.accessibilityLabel ?? empty.progress.accessibilityLabel,
    },
    streak: {
      ...empty.streak,
      ...parsed.streak,
      accessibilityLabel: parsed.streak?.accessibilityLabel ?? empty.streak.accessibilityLabel,
    },
    qaza: {
      ...empty.qaza,
      ...parsed.qaza,
      accessibilityLabel: parsed.qaza?.accessibilityLabel ?? empty.qaza.accessibilityLabel,
    },
    ramadan: {
      ...empty.ramadan,
      ...parsed.ramadan,
      accessibilityLabel: parsed.ramadan?.accessibilityLabel ?? empty.ramadan.accessibilityLabel,
    },
    khatm: {
      ...empty.khatm,
      ...parsed.khatm,
      accessibilityLabel: parsed.khatm?.accessibilityLabel ?? empty.khatm.accessibilityLabel,
    },
    dailyHadith: {
      ...empty.dailyHadith,
      ...parsed.dailyHadith,
      accessibilityLabel:
        parsed.dailyHadith?.accessibilityLabel ?? empty.dailyHadith.accessibilityLabel,
    },
    hijriDate: {
      ...empty.hijriDate,
      ...parsed.hijriDate,
      accessibilityLabel:
        parsed.hijriDate?.accessibilityLabel ?? empty.hijriDate.accessibilityLabel,
    },
    qibla: {
      ...empty.qibla,
      ...parsed.qibla,
      accessibilityLabel: parsed.qibla?.accessibilityLabel ?? empty.qibla.accessibilityLabel,
    },
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
