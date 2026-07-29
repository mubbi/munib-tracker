import { requireOptionalNativeModule } from "expo";
import { Platform } from "react-native";

import type { ExternalCommand } from "./types";

interface ExternalCommandsNativeModule {
  enqueueCommand(json: string): Promise<void>;
  drainCommands(): Promise<string[]>;
  sendWidgetMarkBroadcast?(json: string): Promise<void>;
  pushWearSnapshot?(json: string): Promise<void>;
  pushWatchSnapshot?(json: string): Promise<void>;
  publishAndroidWidgetPreviews?(json: string): Promise<boolean>;
  updateOngoingNotification?(json: string): Promise<void>;
  cancelOngoingNotification?(): Promise<void>;
  applyOngoingPhasePayload?(json: string): Promise<void>;
  canPostPromotedNotifications?(): Promise<boolean>;
  openPromotedNotificationSettings?(): Promise<void>;
  activateWatchSession?(): Promise<void>;
  addListener?(event: "onCommandsAvailable", listener: () => void): { remove: () => void };
}

const nativeModule =
  Platform.OS === "web"
    ? null
    : requireOptionalNativeModule<ExternalCommandsNativeModule>("MunibExternalCommands");

export function isExternalCommandsSupported(): boolean {
  return nativeModule != null;
}

export async function nativeEnqueueCommand(command: ExternalCommand): Promise<void> {
  if (!nativeModule) return;
  try {
    await nativeModule.enqueueCommand(JSON.stringify(command));
  } catch {
    /* Expo Go / missing native build */
  }
}

export async function nativeDrainCommands(): Promise<ExternalCommand[]> {
  if (!nativeModule) return [];
  try {
    const rawItems = await nativeModule.drainCommands();
    const commands: ExternalCommand[] = [];
    for (const raw of rawItems) {
      try {
        commands.push(JSON.parse(raw) as ExternalCommand);
      } catch {
        /* skip malformed */
      }
    }
    return commands;
  } catch {
    return [];
  }
}

/**
 * Android home-screen widgets: re-sends the command as the real
 * `ACTION_MARK_CURRENT` / `ACTION_MARK_PRAYER` broadcast (handled by
 * `ExternalCommandReceiver`) from the widget's headless click task, instead of
 * opening the app via a deep link.
 */
export async function nativeSendWidgetMarkBroadcast(command: ExternalCommand): Promise<void> {
  if (!nativeModule?.sendWidgetMarkBroadcast) return;
  try {
    await nativeModule.sendWidgetMarkBroadcast(JSON.stringify(command));
  } catch {
    /* Expo Go / missing native build */
  }
}

export function subscribeNativeCommands(listener: () => void): () => void {
  if (!nativeModule?.addListener) return () => {};
  try {
    const sub = nativeModule.addListener("onCommandsAvailable", listener);
    return () => sub.remove();
  } catch {
    return () => {};
  }
}

export async function nativePushWearSnapshot(json: string): Promise<void> {
  if (!nativeModule?.pushWearSnapshot) return;
  try {
    await nativeModule.pushWearSnapshot(json);
  } catch {
    /* Wear API unavailable */
  }
}

export async function nativePushWatchSnapshot(json: string): Promise<void> {
  if (!nativeModule?.pushWatchSnapshot) return;
  try {
    await nativeModule.pushWatchSnapshot(json);
  } catch {
    /* WatchConnectivity unavailable */
  }
}

export async function nativeActivateWatchSession(): Promise<void> {
  if (!nativeModule?.activateWatchSession) return;
  try {
    await nativeModule.activateWatchSession();
  } catch {
    /* WatchConnectivity unavailable */
  }
}

/** Android 15+ personalized widget picker previews (rate-limited in native). */
export async function nativePublishAndroidWidgetPreviews(json: string): Promise<boolean> {
  if (Platform.OS !== "android" || !nativeModule?.publishAndroidWidgetPreviews) return false;
  try {
    return Boolean(await nativeModule.publishAndroidWidgetPreviews(json));
  } catch {
    return false;
  }
}

/**
 * Android counterpart to the iOS Live Activity (NF-1.19): starts or refreshes
 * the sticky "next Salah" ongoing notification from the latest widget
 * snapshot. No-ops off Android.
 */
export async function nativeUpdateOngoingNotification(json: string): Promise<void> {
  if (Platform.OS !== "android" || !nativeModule?.updateOngoingNotification) return;
  try {
    await nativeModule.updateOngoingNotification(json);
  } catch {
    /* Expo Go / missing native build */
  }
}

/** Cancels the ongoing "next Salah" notification (preference turned off). */
export async function nativeCancelOngoingNotification(): Promise<void> {
  if (Platform.OS !== "android" || !nativeModule?.cancelOngoingNotification) return;
  try {
    await nativeModule.cancelOngoingNotification();
  } catch {
    /* Expo Go / missing native build */
  }
}

/** Applies an Expo Push / alarm phase payload to the ongoing notification. */
export async function nativeApplyOngoingPhasePayload(json: string): Promise<void> {
  if (Platform.OS !== "android" || !nativeModule?.applyOngoingPhasePayload) return;
  try {
    await nativeModule.applyOngoingPhasePayload(json);
  } catch {
    /* Expo Go / missing native build */
  }
}

export async function nativeCanPostPromotedNotifications(): Promise<boolean> {
  if (Platform.OS !== "android" || !nativeModule?.canPostPromotedNotifications) return false;
  try {
    return Boolean(await nativeModule.canPostPromotedNotifications());
  } catch {
    return false;
  }
}

export async function nativeOpenPromotedNotificationSettings(): Promise<void> {
  if (Platform.OS !== "android" || !nativeModule?.openPromotedNotificationSettings) return;
  try {
    await nativeModule.openPromotedNotificationSettings();
  } catch {
    /* Expo Go / missing native build */
  }
}
