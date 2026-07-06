import { type MenuAction, MenuView } from "@expo/ui/community/menu";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { triggerHaptic } from "@/lib/haptics";

export type ContextMenuAction = {
  /** Stable id passed back to `onAction`. */
  id: string;
  title: string;
  /** SF Symbol name shown beside the label on iOS (ignored on Android's text menu). */
  systemIcon?: MenuAction["image"];
  /** Renders the action in a destructive (red) style. */
  destructive?: boolean;
  disabled?: boolean;
};

type ContextMenuProps = {
  actions: ContextMenuAction[];
  onAction: (id: string) => void;
  children: ReactNode;
  /** Menu title shown at the top (iOS only). */
  title?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Long-press context menu around any content — a native SwiftUI `ContextMenu` on
 * iOS and a Jetpack Compose dropdown on Android (via `@expo/ui`). Because it opens
 * on long-press, the wrapped child keeps its own tap/press behaviour, so this is
 * purely additive over an existing card/row. On web the menu has no touch
 * analogue, so `@expo/ui` simply renders `children` (a one-time dev warning aside)
 * and the child's normal tap still works.
 */
export function ContextMenu({ actions, onAction, children, title, style }: ContextMenuProps) {
  if (actions.length === 0) return <>{children}</>;

  return (
    <MenuView
      title={title}
      shouldOpenOnLongPress
      style={style}
      actions={actions.map((action) => ({
        id: action.id,
        title: action.title,
        image: action.systemIcon,
        attributes: { destructive: action.destructive, disabled: action.disabled },
      }))}
      onPressAction={({ nativeEvent }) => {
        triggerHaptic("selection");
        onAction(nativeEvent.event);
      }}
    >
      {children}
    </MenuView>
  );
}
