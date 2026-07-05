import type { ReadingSurface } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  DEFAULT_ARABIC_SIZE,
  nextReadingDelta,
  resolveReadingFontSizes,
} from "@/lib/reading-typography";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

/**
 * Compact in-context A−/A+ text-size control (NF-1.32). Adjusts the Arabic +
 * translation sizes together for one reading surface, persisting a per-surface
 * delta over the global Settings sizes. Reset clears the surface's override.
 */
export function ReadingFontControls({ surface }: { surface: ReadingSurface }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const prefs = usePreferences();
  const { update } = usePreferencesActions();

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
    <View style={[styles.container, { backgroundColor: colors.muted }]}>
      <PressableScale
        haptic="selection"
        accessibilityRole="button"
        accessibilityLabel={t("reading.decrease")}
        onPress={() => apply(-1)}
        style={[styles.button, { backgroundColor: colors.card }]}
      >
        <ThemedText type="smallBold" style={styles.minus}>
          A−
        </ThemedText>
      </PressableScale>

      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={t("reading.reset")}
        onPress={reset}
        disabled={!hasOverride}
        style={styles.label}
      >
        <ThemedText
          type="caption"
          style={{ color: hasOverride ? colors.accent : colors.mutedForeground }}
        >
          {stepLabel}
        </ThemedText>
      </PressableScale>

      <PressableScale
        haptic="selection"
        accessibilityRole="button"
        accessibilityLabel={t("reading.increase")}
        onPress={() => apply(1)}
        style={[styles.button, { backgroundColor: colors.card }]}
      >
        <ThemedText type="smallBold" style={[styles.plus, { color: colors.accent }]}>
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
  button: {
    minWidth: 40,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.two,
  },
  label: {
    minWidth: 44,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  minus: { fontSize: 13 },
  plus: { fontSize: 17 },
});
