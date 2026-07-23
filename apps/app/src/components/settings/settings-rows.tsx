import { SymbolView } from "expo-symbols";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward, useIsRTL } from "@/lib/rtl";

export function SettingsRow({
  icon,
  title,
  subtitle,
  value,
  onPress,
  preferredFocus,
}: {
  icon: AppIcon;
  title: string;
  subtitle?: string;
  value?: string;
  onPress: () => void;
  /** TV: request initial D-pad focus on this row. */
  preferredFocus?: boolean;
}) {
  const { colors } = useThemeTokens();
  const rtl = useIsRTL();
  const chevron = useChevronForward();
  const tv = isTV();
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      {...(preferredFocus && tv ? { hasTVPreferredFocus: true } : {})}
      style={[styles.row, tv && styles.rowTv, { backgroundColor: colors.muted }]}
    >
      <IconWell icon={icon} well={tv ? 48 : undefined} size={tv ? 22 : undefined} />
      <View style={styles.body}>
        <ThemedText type="small" style={tv ? { fontSize: TvLayout.bodyFontSize } : undefined}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {value ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {value}
        </ThemedText>
      ) : null}
      <SymbolView
        key={rtl ? "chevron-rtl" : "chevron-ltr"}
        name={chevron}
        size={tv ? 20 : 16}
        tintColor={colors.mutedForeground}
      />
    </PressableScale>
  );
}

export const ToggleRow = memo(
  function ToggleRow({
    icon,
    title,
    subtitle,
    value,
    disabled,
    onValueChange,
  }: {
    icon?: AppIcon;
    title: string;
    subtitle?: string;
    value: boolean;
    disabled?: boolean;
    onValueChange: (value: boolean) => void;
  }) {
    const { colors } = useThemeTokens();
    const tv = isTV();

    return (
      <View
        style={[
          styles.row,
          tv && styles.rowTv,
          { backgroundColor: colors.muted, opacity: disabled ? 0.5 : 1 },
        ]}
      >
        {icon ? (
          <IconWell icon={icon} well={tv ? 48 : undefined} size={tv ? 22 : undefined} />
        ) : null}
        <View style={styles.body}>
          <ThemedText type="small" style={tv ? { fontSize: TvLayout.bodyFontSize } : undefined}>
            {title}
          </ThemedText>
          {subtitle ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {subtitle}
            </ThemedText>
          ) : null}
        </View>
        <ThemedSwitch
          value={value}
          disabled={disabled}
          onValueChange={onValueChange}
          accessibilityLabel={title}
        />
      </View>
    );
  },
  (prev, next) =>
    prev.value === next.value &&
    prev.disabled === next.disabled &&
    prev.title === next.title &&
    prev.subtitle === next.subtitle &&
    prev.icon === next.icon,
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    minHeight: 56,
  },
  rowTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.lg,
  },
  body: {
    flex: 1,
    gap: 2,
  },
});
