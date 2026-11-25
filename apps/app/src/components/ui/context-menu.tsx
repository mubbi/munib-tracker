import { type MenuAction, MenuView } from "@expo/ui/community/menu";
import { type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Control, Opacity, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";

export type ContextMenuAction = {
  /** Stable id passed back to `onAction`. */
  id: string;
  title: string;
  /** SF Symbol name shown beside the label on iOS (ignored off iOS). */
  systemIcon?: MenuAction["image"];
  /** Renders the action in a destructive (red) style. */
  destructive?: boolean;
  disabled?: boolean;
};

type ContextMenuProps = {
  actions: ContextMenuAction[];
  onAction: (id: string) => void;
  children: ReactNode;
  /** Menu title: shown at the top on iOS, and as the sheet heading elsewhere (default "More actions"). */
  title?: string;
  style?: StyleProp<ViewStyle>;
  /**
   * Off iOS, a visible "More actions" button under the content that opens the same sheet.
   * `auto` (default) shows it only while a screen reader is running, so TalkBack / VoiceOver
   * users never need the long-press; `always` suits cards with no other visible entry point;
   * `never` hides it. Ignored on iOS (native menu) and TV (screens expose real buttons).
   */
  trigger?: "auto" | "always" | "never";
};

/** Whether VoiceOver / TalkBack is running. Web reports `true` unconditionally, so it is ignored there. */
function useScreenReaderEnabled() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (Platform.OS === "web") return;
    let active = true;
    AccessibilityInfo.isScreenReaderEnabled()
      .then((value) => {
        if (active) setEnabled(value);
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener("screenReaderChanged", setEnabled);
    return () => {
      active = false;
      subscription?.remove?.();
    };
  }, []);
  return enabled;
}

type WebKeyEvent = {
  key?: string;
  shiftKey?: boolean;
  preventDefault?: () => void;
  nativeEvent?: { key?: string; shiftKey?: boolean };
};

/**
 * Android / web: the same actions in a bottom `Sheet`. Reachable by long-press (touch),
 * secondary click or the Menu key / Shift+F10 (web keyboard), and — without any gesture —
 * through the "More actions" button that appears for screen-reader users (or `trigger="always"`).
 */
function SheetContextMenu({
  actions,
  onAction,
  children,
  title,
  style,
  trigger = "auto",
}: ContextMenuProps) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const [open, setOpen] = useState(false);
  const screenReader = useScreenReaderEnabled();
  const showTrigger = trigger === "always" || (trigger === "auto" && screenReader);
  const heading = title ?? t("common.moreActions");

  const openMenu = () => {
    triggerHaptic("selection");
    setOpen(true);
  };
  const webHandlers =
    Platform.OS === "web"
      ? ({
          onContextMenu: (event: WebKeyEvent) => {
            event.preventDefault?.();
            openMenu();
          },
          onKeyDown: (event: WebKeyEvent) => {
            const key = event.key ?? event.nativeEvent?.key;
            const shift = event.shiftKey ?? event.nativeEvent?.shiftKey;
            if (key === "ContextMenu" || (key === "F10" && shift)) {
              event.preventDefault?.();
              openMenu();
            }
          },
        } as object)
      : null;

  return (
    <View style={style} {...webHandlers}>
      {/* Not itself a screen-reader stop: nested controls keep their own focus. */}
      <Pressable accessible={false} focusable={false} onLongPress={openMenu} delayLongPress={450}>
        {children}
      </Pressable>
      {showTrigger ? (
        <View style={styles.trigger}>
          <IconButton
            name={{ ios: "ellipsis.circle", android: "more_horiz", web: "more_horiz" }}
            accessibilityLabel={heading}
            onPress={openMenu}
          />
        </View>
      ) : null}
      <Sheet visible={open} onClose={() => setOpen(false)} variant="bottom" title={heading} solid>
        <View style={styles.list}>
          {actions.map((action) => (
            <PressableScale
              key={action.id}
              role="button"
              accessibilityLabel={action.title}
              accessibilityState={{ disabled: Boolean(action.disabled) }}
              disabled={action.disabled}
              haptic="selection"
              onPress={() => {
                setOpen(false);
                onAction(action.id);
              }}
              style={[styles.item, action.disabled && styles.disabled]}
            >
              <ThemedText
                weight="medium"
                style={action.destructive ? { color: tokens.status.danger.text } : undefined}
              >
                {action.title}
              </ThemedText>
            </PressableScale>
          ))}
        </View>
      </Sheet>
    </View>
  );
}

/**
 * Long-press context menu around any content — a native SwiftUI `ContextMenu` on iOS (via
 * `@expo/ui`), and the same actions in a bottom `Sheet` on Android and web (long-press,
 * secondary click, Menu key / Shift+F10, or the screen-reader "More actions" button — see
 * `trigger`). TV renders children only: long-press is undiscoverable on a remote, so screens
 * expose the same actions as focusable buttons.
 *
 * On Android, `@expo/ui`'s `MenuView` wraps children in a parent `Pressable` that swallows
 * nested touchables, which is why the sheet is used there instead of a Compose dropdown.
 *
 * iOS caveat: `MenuView` hosts children in SwiftUI `Host matchContents` /
 * `fixedSize`, which can collapse nested flex rows (e.g. PressableScale previews)
 * to intrinsic width. Prefer wrapping compact triggers, not full-width home cards.
 */
export function ContextMenu(props: ContextMenuProps) {
  const { actions, onAction, children, title, style } = props;
  if (actions.length === 0 || isTV()) return <>{children}</>;
  if (Platform.OS !== "ios") return <SheetContextMenu {...props} />;

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

const styles = StyleSheet.create({
  trigger: { alignItems: "flex-end" },
  list: { gap: Spacing.one },
  item: {
    justifyContent: "center",
    minHeight: Control.row,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
  },
  disabled: { opacity: Opacity.disabled },
});
