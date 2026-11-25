import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ayahCount } from "@/lib/quran-companion/passage";
import type { Passage } from "@/lib/quran-companion/types";

/**
 * Inline custom range for the practice hub: "From ayah" and "To ayah" steppers,
 * always inside one surah (§8 — a passage never crosses a surah). Moving From
 * past To drags To along; To never goes below From.
 */
export function PracticeRangeEditor({
  value,
  onChange,
}: {
  value: Passage;
  onChange: (next: Passage) => void;
}) {
  const { t } = useTranslation();
  const total = Math.max(1, ayahCount(value.surah));

  const setFrom = (from: number) => {
    const ayahStart = Math.min(Math.max(1, from), total);
    onChange({ ...value, ayahStart, ayahEnd: Math.max(ayahStart, value.ayahEnd) });
  };
  const setTo = (to: number) => {
    const ayahEnd = Math.min(Math.max(value.ayahStart, to), total);
    onChange({ ...value, ayahEnd });
  };

  return (
    <View style={styles.wrap}>
      <Stepper
        label={t("quranCompanion.range.fromAyah")}
        value={value.ayahStart}
        canDecrease={value.ayahStart > 1}
        canIncrease={value.ayahStart < total}
        onStep={(d) => setFrom(value.ayahStart + d)}
      />
      <Stepper
        label={t("quranCompanion.range.toAyah")}
        value={value.ayahEnd}
        canDecrease={value.ayahEnd > value.ayahStart}
        canIncrease={value.ayahEnd < total}
        onStep={(d) => setTo(value.ayahEnd + d)}
      />
    </View>
  );
}

function Stepper({
  label,
  value,
  canDecrease,
  canIncrease,
  onStep,
}: {
  label: string;
  value: number;
  canDecrease: boolean;
  canIncrease: boolean;
  onStep: (delta: number) => void;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();

  const button = (delta: 1 | -1, enabled: boolean) => (
    <PressableScale
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={
        delta > 0
          ? t("quranCompanion.range.increase", { label })
          : t("quranCompanion.range.decrease", { label })
      }
      accessibilityState={{ disabled: !enabled }}
      disabled={!enabled}
      onPress={() => onStep(delta)}
      // Long-press jumps by 10 for long surahs.
      onLongPress={() => onStep(delta * 10)}
      style={[styles.stepBtn, { backgroundColor: colors.muted, opacity: enabled ? 1 : 0.4 }]}
    >
      <SymbolView
        name={
          delta > 0
            ? { ios: "plus", android: "add", web: "add" }
            : { ios: "minus", android: "remove", web: "remove" }
        }
        size={16}
        tintColor={colors.foreground}
      />
    </PressableScale>
  );

  return (
    <View style={[styles.stepper, { borderColor: colors.border }]}>
      <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
        {label}
      </ThemedText>
      <View style={styles.stepRow}>
        {button(-1, canDecrease)}
        <ThemedText
          type="subtitle"
          style={styles.value}
          accessibilityLiveRegion="polite"
          accessibilityLabel={`${label}: ${value}`}
        >
          {value}
        </ThemedText>
        {button(1, canIncrease)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", gap: Spacing.two, marginTop: Spacing.two },
  stepper: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.one,
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.hairline,
  },
  stepRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  value: { minWidth: 40, textAlign: "center", fontVariant: ["tabular-nums"] },
});
