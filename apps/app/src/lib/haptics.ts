import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Semantic haptic vocabulary for the app. Impact styles are for touch/press
 * feedback; `selection` for moving between discrete options; and the
 * success/warning/error notifications for meaningful outcomes (e.g. completing
 * an act of worship).
 *
 * **All app haptics must go through {@link triggerHaptic}** — do not import
 * `expo-haptics` elsewhere. PressableScale, IconButton, Button, and direct
 * call sites all funnel here so the Settings → Haptic feedback toggle applies
 * app-wide.
 */
export type HapticFeedback =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error";

// Haptics are a native-only nicety. Guard so web (and any unsupported platform)
// simply no-ops instead of throwing.
const supported = Platform.OS === "ios" || Platform.OS === "android";

/** Synced from user preferences — see preferences-store subscription. */
let hapticsEnabled = true;

/** Keeps the module flag aligned with persisted preferences. */
export function syncHapticsEnabled(enabled: boolean): void {
  hapticsEnabled = enabled;
}

export function isHapticsEnabled(): boolean {
  return supported && hapticsEnabled;
}

/**
 * Fire a haptic. Fire-and-forget and fully guarded — a haptic must never delay
 * or crash the interaction that triggered it.
 */
export function triggerHaptic(type: HapticFeedback = "light"): void {
  if (!isHapticsEnabled()) return;
  try {
    switch (type) {
      case "light":
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "selection":
        void Haptics.selectionAsync();
        break;
      case "success":
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case "warning":
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case "error":
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  } catch {
    // Best-effort: never let a missing/failed haptic break the tap.
  }
}
