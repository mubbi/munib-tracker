import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Control, IconSize, Opacity, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

export type SwitchRowProps = {
  title: string;
  subtitle?: string;
  /** Alias of `subtitle` (spoken as the accessibility hint too). */
  hint?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  /** Leading glyph. */
  icon?: SymbolViewProps["name"];
  /**
   * Custom leading visual (e.g. a settings `IconWell`); replaces `icon`. Drawn
   * only — hidden from assistive tech and never pressable on its own.
   */
  leading?: ReactNode;
  /** Non-interactive trailing content between the text and the switch (a badge, a value). */
  accessory?: ReactNode;
  /** `filled`: muted card-like row (default on TV). `plain`: bare row (default elsewhere). */
  surface?: "filled" | "plain";
  /** Shows the state but cannot be toggled; not dimmed. */
  readOnly?: boolean;
};

/**
 * Non-interactive on/off track. tvOS has no `UISwitch` and a small native switch
 * is a poor D-pad target; on web a nested native switch would be an interactive
 * element inside the row `<button>`. The row owns the press; this only draws the
 * state. `flex-start`/`flex-end` follow layout direction.
 */
export function TvSwitchTrack({ value }: { value: boolean }) {
  const { colors, tokens } = useThemeTokens();
  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: value ? colors.accent : tokens.switchTrackOff,
          alignItems: value ? "flex-end" : "flex-start",
        },
      ]}
    >
      <View style={[styles.knob, { backgroundColor: colors.card }]} />
    </View>
  );
}

/**
 * The one on/off row (icon + title + hint + accessory + switch). The whole row
 * is a single pressable with role `switch` on every platform; the drawn switch
 * is hidden from assistive tech and never takes the press itself.
 */
export function SwitchRow({
  title,
  subtitle,
  hint,
  value,
  onValueChange,
  disabled,
  icon,
  leading,
  accessory,
  surface,
  readOnly,
}: SwitchRowProps) {
  const { colors } = useThemeTokens();
  const tv = isTV();
  const description = subtitle ?? hint;
  const filled = (surface ?? (tv ? "filled" : "plain")) === "filled";
  const drawnTrack = tv || Platform.OS === "web";

  const content = (
    <>
      {leading != null ? (
        <View
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ pointerEvents: "none" }}
        >
          {leading}
        </View>
      ) : icon ? (
        <SymbolView
          name={icon}
          size={tv ? TvLayout.bodyFontSize : IconSize.lg}
          tintColor={colors.mutedForeground}
        />
      ) : null}
      <View style={styles.text}>
        <ThemedText type="small" style={tv ? { fontSize: TvLayout.bodyFontSize } : undefined}>
          {title}
        </ThemedText>
        {description ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {description}
          </ThemedText>
        ) : null}
      </View>
      {accessory}
      <View
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ pointerEvents: "none" }}
      >
        {drawnTrack ? (
          <TvSwitchTrack value={value} />
        ) : (
          <ThemedSwitch value={value} disabled={disabled} onValueChange={() => undefined} />
        )}
      </View>
    </>
  );

  const rowStyle = [
    styles.row,
    filled && [styles.filled, { backgroundColor: colors.muted }],
    tv && styles.rowTv,
  ];

  if (readOnly) {
    return (
      <View
        accessible
        accessibilityRole="switch"
        accessibilityLabel={title}
        accessibilityHint={description}
        accessibilityState={{ checked: value, disabled: false }}
        style={rowStyle}
      >
        {content}
      </View>
    );
  }

  return (
    <PressableScale
      accessibilityRole="switch"
      accessibilityLabel={title}
      accessibilityHint={description}
      accessibilityState={{ checked: value, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[rowStyle, disabled && { opacity: Opacity.disabled }]}
    >
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    // 44pt / 48dp row even when the subtitle is absent (HIG / M3 minimum target).
    minHeight: Math.max(Control.md, Control.minTouch),
    paddingVertical: Spacing.one,
  },
  rowTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  filled: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  text: { flex: 1, minWidth: 0, gap: Spacing.half },
  track: {
    width: tvDp(56),
    height: tvDp(32),
    borderRadius: tvDp(16),
    padding: tvDp(3),
    justifyContent: "center",
  },
  knob: {
    width: tvDp(26),
    height: tvDp(26),
    borderRadius: tvDp(13),
  },
});
