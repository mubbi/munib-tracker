import { type MenuAction, MenuView } from "@expo/ui/community/menu";
import type { ReactNode } from "react";
import { Platform, type StyleProp, type ViewStyle } from "react-native";

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
 * on long-press, the wrapped child keeps its own tap/press behaviour on iOS.
 *
 * On Android, `@expo/ui`'s `MenuView` wraps children in a parent `Pressable` that
 * swallows nested touchables (close buttons, row actions, etc.), so we render
 * `children` only there. On web there is no long-press menu analogue either.
 *
 * iOS caveat: `MenuView` hosts children in SwiftUI `Host matchContents` /
 * `fixedSize`, which can collapse nested flex rows (e.g. PressableScale previews)
 * to intrinsic width. Prefer wrapping compact triggers, not full-width home cards.
 */
export function ContextMenu({ actions, onAction, children, title, style }: ContextMenuProps) {
  if (actions.length === 0 || Platform.OS === "web" || Platform.OS === "android") {
    return <>{children}</>;
  }

  return (
    <MenuView
      title={title}
      shouldOpenOnLongPress
      style={[{ alignSelf: "stretch", width: "100%" }, style]}
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
