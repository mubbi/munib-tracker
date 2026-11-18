/**
 * Lightweight stand-in for `@/components/ui/sheet` — skips blur/glass/safe-area
 * plumbing so tests focus on the sheet's *content*. Renders children only when
 * `visible`, plus a `sheet-close` button that fires `onClose`.
 *
 *   jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
 */
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

type MockSheetProps = { visible: boolean; onClose: () => void; children: ReactNode };

function MockSheet({ visible, onClose, children }: MockSheetProps) {
  if (!visible) return null;
  return (
    <View testID="sheet">
      <Pressable testID="sheet-close" accessibilityRole="button" onPress={onClose} />
      {children}
    </View>
  );
}

export const sheetMock = { __esModule: true, Sheet: MockSheet };
