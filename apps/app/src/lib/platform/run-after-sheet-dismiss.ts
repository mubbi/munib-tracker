import { InteractionManager, Platform } from "react-native";

/** Delay after a bottom sheet dismiss before presenting another system modal (picker, camera). */
const SHEET_DISMISS_MS = Platform.OS === "ios" ? 400 : 320;

/** Run `action` after the current sheet/modal has finished dismissing (required on native). */
export function runAfterSheetDismiss(action: () => void): void {
  if (Platform.OS === "ios" || Platform.OS === "android") {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(action, SHEET_DISMISS_MS);
    });
    return;
  }
  action();
}
