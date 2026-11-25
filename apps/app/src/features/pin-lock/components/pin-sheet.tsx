import type { ReactNode } from "react";
import { StyleSheet } from "react-native";

import { Sheet } from "@/components/ui/sheet";

type PinSheetProps = {
  visible: boolean;
  /** Back (Android), Escape (web) and the VoiceOver escape gesture. */
  onClose: () => void;
  /** Names the modal surface for assistive tech (the visible title lives in `PinShell`). */
  accessibilityLabel: string;
  children: ReactNode;
};

/**
 * Set / verify PIN surfaces on the shared fullscreen `Sheet` (P7-02): one scrim,
 * z-order and `accessibilityViewIsModal`, with Back / Escape routed to
 * `onClose`. `PinShell` draws its own close button and safe-area padding, so
 * the sheet's header and padding are switched off.
 */
export function PinSheet({ visible, onClose, accessibilityLabel, children }: PinSheetProps) {
  return (
    <Sheet
      visible={visible}
      variant="fullscreen"
      onClose={onClose}
      accessibilityLabel={accessibilityLabel}
      showCloseButton={false}
      contentStyle={styles.bare}
    >
      {children}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  bare: { paddingTop: 0, paddingBottom: 0, paddingHorizontal: 0 },
});
