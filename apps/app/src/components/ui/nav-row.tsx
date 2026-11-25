import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { NewBadge } from "@/components/ui/new-badge";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Control, IconSize, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward, useIsRTL } from "@/lib/rtl";

type NavRowProps = {
  icon: AppIcon;
  label: string;
  /** Second line under the label (muted). */
  subtitle?: string;
  /** Custom trailing content (replaces `badge` / `count`), e.g. a value or a switch-less status. */
  trailing?: ReactNode;
  /** `danger`: destructive row (sign out, delete) — title and well use the danger status. */
  tone?: "default" | "danger";
  /** Optional trailing count pill. */
  count?: number;
  /** Optional string badge (takes precedence over `count`), e.g. "3/14" or "Done". */
  badge?: string;
  /** Success tint when today's remaining work in this destination is finished. */
  completed?: boolean;
  onPress: () => void;
  /** TV: request initial D-pad focus on this row. */
  preferredFocus?: boolean;
  /** Show a "New" pill after the label (recently released features). */
  isNew?: boolean;
  /** Accessibility label suffix for the badge, e.g. "New". */
  newLabel?: string;
};

/** A tappable navigation row: icon well + label + optional count + chevron. */
export function NavRow({
  icon,
  label,
  subtitle,
  trailing: trailingNode,
  tone = "default",
  count,
  badge,
  completed,
  onPress,
  preferredFocus,
  isNew,
  newLabel,
}: NavRowProps) {
  const { colors, tokens } = useThemeTokens();
  const rtl = useIsRTL();
  const chevron = useChevronForward();
  const tv = isTV();
  const danger = tone === "danger";
  const trailing = badge ?? (count != null ? String(count) : undefined);
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={[
        label,
        isNew ? newLabel : undefined,
        subtitle,
        trailingNode ? undefined : trailing,
      ]
        .filter(Boolean)
        .join(", ")}
      onPress={onPress}
      {...(preferredFocus && tv ? { hasTVPreferredFocus: true } : {})}
      style={[
        styles.row,
        tv && styles.rowTv,
        { backgroundColor: colors.muted, borderColor: tokens.hairline },
      ]}
    >
      <IconWell
        icon={icon}
        well={tv ? 48 : undefined}
        size={tv ? 22 : undefined}
        {...(danger
          ? { tint: tokens.status.danger.onSoft, background: tokens.status.danger.soft }
          : null)}
      />
      <View style={styles.labelColumn}>
        <ThemedText
          type="small"
          // A single word wider than the label slot (TV 3-column Library grid,
          // long locales) otherwise breaks with an orphaned letter ("Bookmark / s").
          android_hyphenationFrequency="normal"
          style={[
            tv && { fontSize: TvLayout.bodyFontSize },
            danger && { color: tokens.status.danger.text },
          ]}
        >
          {label}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {isNew ? <NewBadge style={styles.newBadge} /> : null}
      {trailingNode ? (
        trailingNode
      ) : trailing ? (
        <View
          style={[
            styles.countBadge,
            {
              backgroundColor: completed ? tokens.status.success.soft : tokens.accentSoft,
            },
          ]}
        >
          {completed ? (
            <SymbolView
              name="checkmark"
              size={IconSize.xs}
              tintColor={tokens.status.success.onSoft}
            />
          ) : null}
          <ThemedText
            type="caption"
            maxFontSizeMultiplier={1.2}
            style={[
              styles.countText,
              { color: completed ? tokens.status.success.onSoft : colors.mutedForeground },
            ]}
          >
            {trailing}
          </ThemedText>
        </View>
      ) : null}
      <SymbolView
        key={rtl ? "chevron-rtl" : "chevron-ltr"}
        name={chevron}
        size={tv ? 20 : IconSize.md}
        tintColor={colors.mutedForeground}
      />
    </PressableScale>
  );
}

const COUNT_SIZE = 24;

const styles = StyleSheet.create({
  newBadge: { alignSelf: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.twoHalf + Spacing.half,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
    minHeight: Control.row,
  },
  rowTv: {
    minHeight: TvLayout.minFocusTarget,
    // Tighter than phone: in the 3-column Library grid the label slot is ~90dp.
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.lg,
  },
  labelColumn: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
  },
  countBadge: {
    flexDirection: "row",
    gap: Spacing.half,
    minWidth: COUNT_SIZE,
    minHeight: COUNT_SIZE,
    paddingHorizontal: Spacing.oneHalf,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    alignSelf: "center",
  },
  countText: {
    lineHeight: 14,
    textAlign: "center",
  },
});
