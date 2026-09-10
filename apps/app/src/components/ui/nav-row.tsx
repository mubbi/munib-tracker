import { SymbolView } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward, useIsRTL } from "@/lib/rtl";

type NavRowProps = {
  icon: AppIcon;
  label: string;
  /** Optional trailing count pill. */
  count?: number;
  /** Optional string badge (takes precedence over `count`), e.g. "3/14" or "Done". */
  badge?: string;
  /** Success tint when today's remaining work in this destination is finished. */
  completed?: boolean;
  onPress: () => void;
  /** TV: request initial D-pad focus on this row. */
  preferredFocus?: boolean;
};

/** A tappable navigation row: icon well + label + optional count + chevron. */
export function NavRow({
  icon,
  label,
  count,
  badge,
  completed,
  onPress,
  preferredFocus,
}: NavRowProps) {
  const { colors, tokens } = useThemeTokens();
  const rtl = useIsRTL();
  const chevron = useChevronForward();
  const tv = isTV();
  const trailing = badge ?? (count != null ? String(count) : undefined);
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={trailing ? `${label}, ${trailing}` : label}
      onPress={onPress}
      {...(preferredFocus && tv ? { hasTVPreferredFocus: true } : {})}
      style={[styles.row, tv && styles.rowTv, { backgroundColor: colors.muted }]}
    >
      <IconWell icon={icon} well={tv ? 48 : undefined} size={tv ? 22 : undefined} />
      <ThemedText type="small" style={[styles.label, tv && { fontSize: TvLayout.bodyFontSize }]}>
        {label}
      </ThemedText>
      {trailing ? (
        <View
          style={[
            styles.countBadge,
            {
              backgroundColor: completed ? tokens.status.success.soft : tokens.accentSoft,
            },
          ]}
        >
          <ThemedText
            type="caption"
            style={[
              styles.countText,
              { color: completed ? tokens.status.success.color : colors.mutedForeground },
            ]}
          >
            {trailing}
          </ThemedText>
        </View>
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

const COUNT_SIZE = 24;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.two + 4,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    minHeight: 52,
  },
  rowTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.lg,
  },
  label: {
    flex: 1,
  },
  countBadge: {
    minWidth: COUNT_SIZE,
    height: COUNT_SIZE,
    paddingHorizontal: Spacing.one + 2,
    borderRadius: COUNT_SIZE / 2,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    alignSelf: "center",
  },
  countText: {
    fontSize: 12,
    lineHeight: 14,
    textAlign: "center",
  },
});
