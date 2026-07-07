import { reloadAppAsync } from "expo";
import { DevSettings, Platform } from "react-native";

/** Locales that read right-to-left and require an `I18nManager` layout flip. */
export const RTL_LOCALES = new Set(["ar", "ur"]);

/**
 * Reloads the native app so an `I18nManager.forceRTL` change takes effect.
 * Web callers should set `document.dir` instead — this is a no-op there.
 */
export async function reloadForLayoutDirectionChange(
  reason = "Layout direction changed",
): Promise<boolean> {
  if (Platform.OS === "web") return true;

  try {
    await reloadAppAsync(reason);
    return true;
  } catch {
    // Dev / edge builds — fall back to the RN dev reload API.
  }

  try {
    DevSettings.reload(reason);
    return true;
  } catch {
    return false;
  }
}
