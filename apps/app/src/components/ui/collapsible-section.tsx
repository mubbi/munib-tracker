import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { type ReactNode, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type CollapsibleSectionProps = {
  title: string;
  icon?: SymbolViewProps["name"];
  defaultOpen?: boolean;
  /** Controlled open state — when set, parent owns expand/collapse. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Where the press target lives:
   * - `header` (default) — title row only
   * - `none` — no pressable; parent (e.g. Card `onPress`) handles taps so ripple can cover the full card
   */
  pressableArea?: "header" | "none";
  children: ReactNode;
};

/**
 * A section that expands/collapses in place, styled to match `SectionHeader` so
 * collapsible cards read the same as static ones — no nested box or indent.
 */
export function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  pressableArea = "header",
  children,
}: CollapsibleSectionProps) {
  const { colors } = useThemeTokens();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!controlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const toggle = () => setOpen(!open);

  const headerRow = (
    <>
      <View style={styles.left}>
        {icon ? <IconWell icon={icon} well={28} radius={9} size={14} /> : null}
        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>
      </View>
      <SymbolView
        name={{ ios: "chevron.down", android: "keyboard_arrow_down", web: "keyboard_arrow_down" }}
        size={16}
        tintColor={colors.mutedForeground}
        style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
      />
    </>
  );

  const body = open ? (
    <Animated.View entering={FadeIn.duration(180)}>{children}</Animated.View>
  ) : null;

  if (pressableArea === "none") {
    return (
      <View>
        <View style={styles.header}>{headerRow}</View>
        {body}
      </View>
    );
  }

  return (
    <View>
      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded: open }}
        scaleTo={0.995}
        onPress={toggle}
        style={styles.header}
      >
        {headerRow}
      </PressableScale>
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  title: {
    flex: 1,
  },
});
