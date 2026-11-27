import type { PreferenceColorMode } from "@munib-tracker/shared/types";
import { resolveTheme } from "@munib-tracker/theme/resolve";
import type { ThemeColors } from "@munib-tracker/theme/types";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { useSetting } from "@/lib/settings/use-setting";

const MODES: readonly { value: PreferenceColorMode; labelKey: string }[] = [
  { value: "light", labelKey: "appearance.modeLight" },
  { value: "dark", labelKey: "appearance.modeDark" },
  { value: "system", labelKey: "appearance.modeSystem" },
];

/** A miniature screen in one scheme: page, a card, two text bars and an accent pill. */
function MiniScreen({ palette, half }: { palette: ThemeColors; half?: "start" | "end" }) {
  return (
    <View
      style={[
        styles.mini,
        half === "start" && styles.miniStart,
        half === "end" && styles.miniEnd,
        { backgroundColor: palette.background },
      ]}
    >
      <View
        style={[
          styles.miniCard,
          { backgroundColor: palette.card, borderColor: palette.cardBorder },
        ]}
      >
        <View style={[styles.barLong, { backgroundColor: palette.foreground }]} />
        <View style={[styles.barShort, { backgroundColor: palette.mutedForeground }]} />
        <View style={[styles.pill, { backgroundColor: palette.accent }]} />
      </View>
    </View>
  );
}

/**
 * Appearance › Theme (`appearance.theme`): three preview tiles — Light, Dark and
 * System (half light / half dark) — instead of a plain segmented control. Same
 * registry semantics: one radio group that reads and writes through
 * `useSetting`, so search, reset and sync are unchanged.
 */
export function ThemeModeEditor({ settingId }: { settingId: string }) {
  const { t } = useTranslation();
  const { colors, tokens, accentColorId } = useThemeTokens();
  const { value, setValue, def, enabled } = useSetting<PreferenceColorMode>(settingId);
  const tv = isTV();
  const light = resolveTheme("light", "light", accentColorId);
  const dark = resolveTheme("dark", "dark", accentColorId);
  const title = t(def.titleKey);

  return (
    <View style={[styles.block, !enabled && styles.disabled]}>
      <View style={styles.copy}>
        <ThemedText type="small">{title}</ThemedText>
        {def.subtitleKey ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {t(def.subtitleKey)}
          </ThemedText>
        ) : null}
      </View>
      <View
        testID="theme-tiles"
        accessibilityRole="radiogroup"
        accessibilityLabel={title}
        style={styles.tiles}
      >
        {MODES.map((mode) => {
          const selected = value === mode.value;
          const label = t(mode.labelKey);
          return (
            <View key={mode.value} style={styles.cell}>
              <PressableScale
                testID={`theme-tile-${mode.value}`}
                accessibilityRole="radio"
                accessibilityLabel={label}
                accessibilityState={{ selected, checked: selected, disabled: !enabled }}
                disabled={!enabled}
                haptic="selection"
                scaleTo={0.96}
                onPress={() => {
                  if (!selected) void setValue(mode.value);
                }}
                style={[
                  styles.tile,
                  {
                    backgroundColor: selected ? tokens.accentSoft : colors.muted,
                    // TV: the accent ring is the D-pad focus visual — mark the
                    // selection with the soft fill + check instead.
                    borderColor: selected && !tv ? colors.accent : "transparent",
                  },
                ]}
              >
                <View style={styles.preview}>
                  {mode.value === "system" ? (
                    <View style={styles.split}>
                      <MiniScreen palette={light} half="start" />
                      <MiniScreen palette={dark} half="end" />
                    </View>
                  ) : (
                    <MiniScreen palette={mode.value === "light" ? light : dark} />
                  )}
                </View>
                <View style={styles.labelLine}>
                  {selected ? (
                    <SymbolView
                      name={{
                        ios: "checkmark.circle.fill",
                        android: "check_circle",
                        web: "check_circle",
                      }}
                      size={14}
                      tintColor={tokens.accentOnSoft}
                    />
                  ) : null}
                  <ThemedText
                    type="caption"
                    weight={selected ? "semibold" : "medium"}
                    numberOfLines={1}
                    style={{ color: selected ? tokens.accentOnSoft : colors.foreground }}
                  >
                    {label}
                  </ThemedText>
                </View>
              </PressableScale>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
  disabled: { opacity: 0.5 },
  copy: { gap: Spacing.half },
  tiles: { flexDirection: "row", gap: Spacing.two },
  // Width lives on a plain View — PressableScale drops width from its Android ripple host.
  cell: { flex: 1, minWidth: 0 },
  tile: {
    alignSelf: "stretch",
    gap: Spacing.oneHalf,
    padding: Spacing.oneHalf,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thick,
  },
  preview: {
    height: tvDp(56),
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  split: { flex: 1, flexDirection: "row" },
  mini: { flex: 1, padding: Spacing.oneHalf, justifyContent: "center" },
  miniStart: { paddingEnd: 0 },
  miniEnd: { paddingStart: 0 },
  miniCard: {
    flex: 1,
    gap: Spacing.one,
    padding: Spacing.oneHalf,
    borderRadius: Radius.xs,
    borderWidth: BorderWidth.hairline,
    justifyContent: "center",
  },
  barLong: { height: tvDp(4), width: "80%", borderRadius: Radius.pill },
  barShort: { height: tvDp(4), width: "55%", borderRadius: Radius.pill, opacity: 0.7 },
  pill: { height: tvDp(6), width: "40%", borderRadius: Radius.pill },
  labelLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    minHeight: tvDp(20),
  },
});
