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
  children,
}: CollapsibleSectionProps) {
  const { colors } = useThemeTokens();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View>
      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded: open }}
        scaleTo={0.995}
        onPress={() => setOpen((value) => !value)}
        style={styles.header}
      >
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
      </PressableScale>

      {open ? <Animated.View entering={FadeIn.duration(180)}>{children}</Animated.View> : null}
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
