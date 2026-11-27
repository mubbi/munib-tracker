import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { BorderWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

/**
 * Reading-preference rows shared by the Qur'an reader, the hadith collection
 * reader and the dua / zikr scripture filters (one implementation instead of
 * three copies).
 */

/** Leading icon + label used by every reading-control row for quick scanning. */
export function ControlLabel({ icon, label }: { icon: SymbolViewProps["name"]; label: string }) {
  const { colors } = useThemeTokens();
  const tv = isTV();
  return (
    <View style={styles.controlLabel}>
      <SymbolView name={icon} size={tv ? 22 : 18} tintColor={colors.mutedForeground} />
      <ThemedText type="smallBold" style={tv ? { fontSize: TvLayout.bodyFontSize } : undefined}>
        {label}
      </ThemedText>
    </View>
  );
}

/**
 * On/off reading preference. Phone / web: label + native switch in a 44pt row.
 * TV: the whole row is the focus target (Select toggles) with an On/Off pill —
 * remotes struggle with native switch thumbs. `style` adds outer spacing.
 */
export function PrefToggle({
  icon,
  label,
  enabled,
  onToggle,
  style,
}: {
  icon: SymbolViewProps["name"];
  label: string;
  enabled: boolean;
  onToggle: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  if (isTV()) {
    return (
      <PressableScale
        haptic="selection"
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityState={{ checked: enabled }}
        onPress={onToggle}
        scaleTo={0.98}
        style={[
          styles.prefToggleTv,
          {
            // On = soft fill + muted hairline; the solid accent ring is D-pad focus.
            backgroundColor: enabled ? tokens.accentSoft : colors.muted,
            borderColor: enabled ? withAlpha(colors.accent, 0.35) : tokens.hairline,
          },
          style,
        ]}
      >
        <SymbolView
          name={icon}
          size={22}
          tintColor={enabled ? colors.accent : colors.mutedForeground}
        />
        <ThemedText
          type="smallBold"
          numberOfLines={2}
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: TvLayout.bodyFontSize,
            color: enabled ? colors.accentText : colors.foreground,
          }}
        >
          {label}
        </ThemedText>
        <View
          style={[
            styles.prefToggleStateTv,
            { backgroundColor: enabled ? colors.accent : colors.card },
          ]}
        >
          <ThemedText
            weight="bold"
            type="caption"
            style={{
              color: enabled ? colors.accentForeground : colors.mutedForeground,
            }}
          >
            {enabled ? t("common.on") : t("common.off")}
          </ThemedText>
        </View>
      </PressableScale>
    );
  }

  return (
    <View style={[styles.toggleRow, style]}>
      <ControlLabel icon={icon} label={label} />
      <View style={styles.controlValue}>
        <ThemedSwitch value={enabled} onValueChange={onToggle} accessibilityLabel={label} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    minHeight: 44,
    paddingVertical: Spacing.half,
  },
  controlLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexShrink: 1,
    minWidth: 0,
  },
  controlValue: {
    flexShrink: 0,
  },
  prefToggleTv: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  prefToggleStateTv: {
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    minWidth: tvDp(44),
    alignItems: "center",
  },
});
