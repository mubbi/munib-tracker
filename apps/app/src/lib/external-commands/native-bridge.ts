import { requireOptionalNativeModule } from "expo";
import { Platform } from "react-native";

import type { ExternalCommand } from "./types";

interface ExternalCommandsNativeModule {
  enqueueCommand(json: string): Promise<void>;
  drainCommands(): Promise<string[]>;
  peekCommands?(): Promise<string[]>;
  scheduleWidgetRefresh?(timesMs: number[]): Promise<void>;
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

type AsyncMethodName = Exclude<keyof ExternalCommandsNativeModule, "addListener">;

const nativeModule =
  Platform.OS === "web"
    ? null
    : requireOptionalNativeModule<ExternalCommandsNativeModule>("MunibExternalCommands");

/**
 * Calls an optional native method, returning `fallback` when the module / method
 * is missing (web, Expo Go, TV, an older native build) or the call rejects.
 * Every bridge function goes through here so a native failure never reaches JS.
 */
async function callNative<M extends AsyncMethodName, R>(
  method: M,
  args: Parameters<NonNullable<ExternalCommandsNativeModule[M]>>,
  fallback: R,
  options: { androidOnly?: boolean } = {},
): Promise<Awaited<ReturnType<NonNullable<ExternalCommandsNativeModule[M]>>> | R> {
  if (options.androidOnly && Platform.OS !== "android") return fallback;
  const fn = nativeModule?.[method] as
    | ((...a: typeof args) => ReturnType<NonNullable<ExternalCommandsNativeModule[M]>>)
    | undefined;
  if (!fn) return fallback;
  try {
    return await fn.apply(nativeModule, args);
  } catch {
    return fallback;
  }
}

export function isExternalCommandsSupported(): boolean {
  return nativeModule != null;
}

export async function nativeEnqueueCommand(command: ExternalCommand): Promise<void> {
  await callNative("enqueueCommand", [JSON.stringify(command)], undefined);
}

function parseCommands(rawItems: readonly string[]): ExternalCommand[] {
  const commands: ExternalCommand[] = [];
  for (const raw of rawItems) {
    try {
      commands.push(JSON.parse(raw) as ExternalCommand);
    } catch {
      /* skip malformed */
    }
  }
  return commands;
}

export async function nativeDrainCommands(): Promise<ExternalCommand[]> {
  return parseCommands(await callNative("drainCommands", [], [] as string[]));
}

/**
 * Reads the native queue without draining it, so Android widgets (headless JS)
 * can show a queued mark as done before the app applies it.
 */
export async function nativePeekCommands(): Promise<ExternalCommand[]> {
  return parseCommands(await callNative("peekCommands", [], [] as string[]));
}

/**
 * Android: arms inexact (or exact, when allowed) alarms that redraw every
 * home-screen widget at the given instants (each Adhan, adhkar windows,
 * midnight) — `updatePeriodMillis` alone is 30 minutes at best.
 */
export async function nativeScheduleWidgetRefresh(timesMs: readonly number[]): Promise<void> {
  await callNative("scheduleWidgetRefresh", [[...timesMs]], undefined, { androidOnly: true });
}

/**
 * "Reset app data": drops any widget / Siri / Wear command still queued
 * natively (iOS App Group, Android prefs) so it can't re-apply after the wipe.
 */
export async function clearPendingExternalCommands(): Promise<void> {
  await nativeDrainCommands();
}

/**
 * Android home-screen widgets: re-sends the command as the real
 * `ACTION_MARK_CURRENT` / `ACTION_MARK_PRAYER` broadcast (handled by
 * `ExternalCommandReceiver`) from the widget's headless click task, instead of
 * opening the app via a deep link.
 */
export async function nativeSendWidgetMarkBroadcast(command: ExternalCommand): Promise<void> {
  await callNative("sendWidgetMarkBroadcast", [JSON.stringify(command)], undefined);
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

/** Wear OS Data Layer snapshot (Android; no-op without Play Services). */
export async function nativePushWearSnapshot(json: string): Promise<void> {
  await callNative("pushWearSnapshot", [json], undefined);
}

/** Apple Watch snapshot over WatchConnectivity (iOS). */
export async function nativePushWatchSnapshot(json: string): Promise<void> {
  await callNative("pushWatchSnapshot", [json], undefined);
}

export async function nativeActivateWatchSession(): Promise<void> {
  await callNative("activateWatchSession", [], undefined);
}

/** Android 15+ personalized widget picker previews (rate-limited in native). */
export async function nativePublishAndroidWidgetPreviews(json: string): Promise<boolean> {
  return Boolean(
    await callNative("publishAndroidWidgetPreviews", [json], false, { androidOnly: true }),
  );
}

/**
 * Android counterpart to the iOS Live Activity (NF-1.19): starts or refreshes
 * the sticky "next Salah" ongoing notification from the latest widget
 * snapshot. No-ops off Android.
 */
export async function nativeUpdateOngoingNotification(json: string): Promise<void> {
  await callNative("updateOngoingNotification", [json], undefined, { androidOnly: true });
}

/** Cancels the ongoing "next Salah" notification (preference turned off). */
export async function nativeCancelOngoingNotification(): Promise<void> {
  await callNative("cancelOngoingNotification", [], undefined, { androidOnly: true });
}

/** Applies an Expo Push / alarm phase payload to the ongoing notification. */
export async function nativeApplyOngoingPhasePayload(json: string): Promise<void> {
  await callNative("applyOngoingPhasePayload", [json], undefined, { androidOnly: true });
}

export async function nativeCanPostPromotedNotifications(): Promise<boolean> {
  return Boolean(
    await callNative("canPostPromotedNotifications", [], false, { androidOnly: true }),
  );
}

export async function nativeOpenPromotedNotificationSettings(): Promise<void> {
  await callNative("openPromotedNotificationSettings", [], undefined, { androidOnly: true });
}
