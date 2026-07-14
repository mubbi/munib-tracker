import { requireOptionalNativeModule } from "expo";
import { Platform } from "react-native";

import type { ExternalCommand } from "./types";

interface ExternalCommandsNativeModule {
  enqueueCommand(json: string): Promise<void>;
  drainCommands(): Promise<string[]>;
  pushWearSnapshot?(json: string): Promise<void>;
  pushWatchSnapshot?(json: string): Promise<void>;
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
