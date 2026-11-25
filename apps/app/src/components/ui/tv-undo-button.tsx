import { useTranslation } from "react-i18next";
import type { StyleProp, ViewStyle } from "react-native";

import { Button } from "@/components/ui/button";
import type { UndoToastController } from "@/hooks/use-undo-toast";
import { isTV } from "@/lib/platform/is-tv";

type TvUndoButtonProps = {
  /** The screen's `useUndoToast()` controller. */
  controller: Pick<UndoToastController, "undoAvailable" | "undo">;
  /**
   * Take D-pad focus when it appears — use it after a removal, where the
   * focused row disappears and focus would otherwise land anywhere.
   */
  preferredFocus?: boolean;
  size?: "sm" | "md";
  /** What Undo reverts (e.g. the toast's message) — tells it apart from other Undo buttons. */
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * TV half of "act + toast with **Undo**" (design-system § Toasts: TV toasts take
 * no focus, so the action lives on the page). Renders an Undo button while the
 * latest `useUndoToast` change can still be undone; nothing on phone / web,
 * where the toast carries the action.
 */
export function TvUndoButton({
  controller,
  preferredFocus,
  size,
  accessibilityHint,
  style,
}: TvUndoButtonProps) {
  const { t } = useTranslation();
  if (!isTV() || !controller.undoAvailable) return null;
  return (
    <Button
      label={t("uiFeedback.undo")}
      variant="secondary"
      size={size}
      icon={{ ios: "arrow.uturn.backward", android: "undo", web: "undo" }}
      accessibilityHint={accessibilityHint}
      onPress={() => controller.undo()}
      preferredFocus={preferredFocus}
      style={style}
    />
  );
}
