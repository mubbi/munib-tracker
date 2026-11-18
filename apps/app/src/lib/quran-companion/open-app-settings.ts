import { Linking, Platform } from "react-native";

/**
 * The OS app-settings page exists only on iOS and Android. React Native Web has
 * no `Linking.openSettings`, and calling it there throws synchronously — so
 * callers ask {@link canOpenAppSettings} first and on the web re-request the
 * microphone through the browser instead.
 */
export function canOpenAppSettings(): boolean {
  return (
    (Platform.OS === "ios" || Platform.OS === "android") &&
    typeof (Linking as { openSettings?: unknown }).openSettings === "function"
  );
}

/** Open the OS settings for this app. Returns false where that is not possible. Never throws. */
export async function openAppSettings(): Promise<boolean> {
  if (!canOpenAppSettings()) return false;
  try {
    await Linking.openSettings();
    return true;
  } catch {
    return false;
  }
}
