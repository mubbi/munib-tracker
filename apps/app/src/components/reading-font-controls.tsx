import type { ReadingSurface } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import {
  DEFAULT_ARABIC_SIZE,
  nextReadingDelta,
  resolveReadingFontSizes,
} from "@/lib/reading-typography";
import { ltrControlViewProps } from "@/lib/rtl";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

/**
 * Compact in-context A−/A+ text-size control (NF-1.32). Adjusts the Arabic +
 * translation sizes together for one reading surface, persisting a per-surface
 * delta over the global Settings sizes. Reset clears the surface's override.
 */
export function ReadingFontControls({
  surface,
  fullWidth = false,
}: {
  surface: ReadingSurface;
  /**
   * Stretch across the parent (e.g. hadith filter pane). Default stays compact
   * so learn chrome / toolbars do not blow A−/A+ across a 10-foot viewport.
   */
  fullWidth?: boolean;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const prefs = usePreferences();
  const { update } = usePreferencesActions();
  const tv = isTV();

  const override = prefs.fontPrefs.readingOverrides?.[surface];
  const hasOverride =
    !!override && ((override.arabicDelta ?? 0) !== 0 || (override.textDelta ?? 0) !== 0);
  const sizes = resolveReadingFontSizes(surface, prefs.fontPrefs);
  const baseArabic = prefs.fontPrefs.arabic.size ?? DEFAULT_ARABIC_SIZE;
  const delta = sizes.arabic - baseArabic;

  const stepLabel = delta === 0 ? t("reading.sizeDefault") : delta > 0 ? `+${delta}` : `${delta}`;

  const apply = (direction: 1 | -1) => {
    const next = nextReadingDelta(prefs.fontPrefs, surface, direction);
    void update({
      fontPrefs: {
        ...prefs.fontPrefs,
        readingOverrides: { ...prefs.fontPrefs.readingOverrides, [surface]: next },
      },
    });
  };

  const reset = () => {
    void update({
      fontPrefs: {
        ...prefs.fontPrefs,
        readingOverrides: {
          ...prefs.fontPrefs.readingOverrides,
          [surface]: { arabicDelta: 0, textDelta: 0 },
        },
      },
    });
  };

  return (
    <View
      {...ltrControlViewProps()}
      style={[
        styles.container,
        tv && styles.containerTv,
        tv && fullWidth && styles.containerTvFull,
        { backgroundColor: colors.muted },
      ]}
    >
      <PressableScale
        haptic="selection"
        accessibilityRole="button"
        accessibilityLabel={t("reading.decrease")}
        onPress={() => apply(-1)}
        style={[styles.button, tv && styles.buttonTv, { backgroundColor: colors.card }]}
      >
        <ThemedText
          type="smallBold"
          style={[styles.minus, tv && { fontSize: TvLayout.bodyFontSize }]}
        >
          A−
        </ThemedText>
      </PressableScale>

      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={t("reading.reset")}
        onPress={reset}
        disabled={!hasOverride}
        style={[styles.label, tv && styles.labelTv]}
      >
        <ThemedText
          type="caption"
          style={{
            color: hasOverride ? colors.accent : colors.mutedForeground,
            fontSize: tv ? TvLayout.bodyFontSize : undefined,
          }}
        >
          {stepLabel}
        </ThemedText>
      </PressableScale>

      <PressableScale
        haptic="selection"
        accessibilityRole="button"
        accessibilityLabel={t("reading.increase")}
        onPress={() => apply(1)}
        style={[styles.button, tv && styles.buttonTv, { backgroundColor: colors.card }]}
      >
        <ThemedText
          type="smallBold"
          style={[styles.plus, { color: colors.accent }, tv && { fontSize: TvLayout.bodyFontSize }]}
        >
          A+
        </ThemedText>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    padding: Spacing.half,
    gap: Spacing.half,
  },
  containerTv: {
    alignSelf: "flex-start",
    padding: Spacing.one,
    gap: Spacing.two,
    borderRadius: Radius.md,
  },
  containerTvFull: {
    alignSelf: "stretch",
    width: "100%",
    justifyContent: "space-between",
  },
  button: {
    minWidth: 40,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.two,
  },
  buttonTv: {
    minWidth: TvLayout.minFocusTarget,
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
  },
  label: {
    minWidth: 44,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  labelTv: {
    minWidth: 56,
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.three,
  },
  minus: { fontSize: 13 },
  plus: { fontSize: 17 },
});
