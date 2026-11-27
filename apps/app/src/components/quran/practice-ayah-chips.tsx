import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, type ScrollViewInstance, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export type AyahChipState = "current" | "done" | "retry" | "todo";

const CHIP_WIDTH = 44;
const CHIP_GAP = Spacing.one;

/**
 * Progress through a multi-ayah passage: one chip per ayah (done, try again, not
 * yet, current). Tap to jump — disabled while the mic is live. Scrolls the
 * current ayah into view.
 */
export function PracticeAyahChips({
  ayahs,
  stateOf,
  disabled,
  onSelect,
}: {
  ayahs: number[];
  stateOf: (ayah: number) => AyahChipState;
  disabled: boolean;
  onSelect: (index: number) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const currentIndex = ayahs.findIndex((a) => stateOf(a) === "current");

  useEffect(() => {
    if (currentIndex < 0) return;
    scrollRef.current?.scrollTo({
      x: Math.max(0, currentIndex * (CHIP_WIDTH + CHIP_GAP) - CHIP_WIDTH * 2),
      animated: false,
    });
  }, [currentIndex]);

  const labelFor = (state: AyahChipState): string => {
    switch (state) {
      case "done":
        return t("quranCompanion.session.chipDone");
      case "retry":
        return t("quranCompanion.session.chipRetry");
      case "current":
        return t("quranCompanion.session.chipCurrent");
      default:
        return t("quranCompanion.session.chipTodo");
    }
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {ayahs.map((ayah, index) => {
        const state = stateOf(ayah);
        const style =
          state === "current"
            ? {
                backgroundColor: colors.accent,
                borderColor: colors.accent,
                color: colors.accentForeground,
              }
            : state === "done"
              ? {
                  backgroundColor: tokens.status.success.soft,
                  borderColor: tokens.status.success.border,
                  color: tokens.status.success.onSoft,
                }
              : state === "retry"
                ? {
                    backgroundColor: tokens.status.warning.soft,
                    borderColor: tokens.status.warning.border,
                    color: tokens.status.warning.onSoft,
                  }
                : {
                    backgroundColor: colors.muted,
                    borderColor: colors.border,
                    color: colors.mutedForeground,
                  };
        return (
          <PressableScale
            key={ayah}
            haptic="selection"
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ selected: state === "current", disabled }}
            accessibilityLabel={t("quranCompanion.session.chipLabel", {
              n: ayah,
              state: labelFor(state),
            })}
            onPress={() => onSelect(index)}
            style={[
              styles.chip,
              { backgroundColor: style.backgroundColor, borderColor: style.borderColor },
            ]}
          >
            <ThemedText weight="semibold" type="caption" style={{ color: style.color }}>
              {ayah}
            </ThemedText>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: CHIP_GAP, paddingVertical: Spacing.half },
  chip: {
    width: CHIP_WIDTH,
    height: 36,
    borderRadius: Radius.sm,
    borderWidth: BorderWidth.thin,
    alignItems: "center",
    justifyContent: "center",
  },
});
