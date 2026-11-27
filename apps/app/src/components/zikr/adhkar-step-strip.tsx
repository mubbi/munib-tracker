import { SymbolView } from "expo-symbols";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollViewInstance, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { BorderWidth, Control, Spacing, withAlpha } from "@/constants/theme";
import { useScrollToActiveHorizontal } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/** Each stop is a full 44pt touch target. */
const STEP = Control.md;

export type AdhkarStep = {
  id: string;
  title: string;
  done: boolean;
  started: boolean;
  /** Weak-chain zikr: drawn dashed and never required. */
  optional: boolean;
  count: number;
  target: number;
};

/**
 * One numbered stop per zikr in the session — green when done, ringed when
 * partly counted, filled for the current one. Tap to jump straight to any zikr.
 */
export function AdhkarStepStrip({
  steps,
  activeIndex,
  onSelect,
}: {
  steps: AdhkarStep[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const { register, onScroll } = useScrollToActiveHorizontal(scrollRef, String(activeIndex));

  return (
    <TvScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroller}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      {steps.map((step, index) => {
        const active = index === activeIndex;
        const success = tokens.status.success.color;
        const background = active
          ? step.done
            ? success
            : colors.accent
          : step.done
            ? tokens.status.success.soft
            : colors.muted;
        const borderColor = active
          ? "transparent"
          : step.started && !step.done
            ? withAlpha(colors.accent, 0.7)
            : step.optional && !step.done
              ? withAlpha(tokens.status.warning.color, 0.6)
              : "transparent";
        const fg = active ? colors.accentForeground : step.done ? success : colors.mutedForeground;
        const status = step.done
          ? t("zikr.done")
          : step.optional
            ? t("zikrSession.optional")
            : step.started
              ? t("zikrSession.status.inProgress")
              : t("zikrSession.status.pending");
        return (
          <PressableScale
            key={step.id}
            ref={register(String(index))}
            haptic="selection"
            onPress={() => onSelect(index)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${index + 1}. ${step.title}, ${status}`}
            style={[
              styles.step,
              {
                backgroundColor: background,
                borderColor,
                borderStyle: step.optional && !step.done && !active ? "dashed" : "solid",
              },
            ]}
          >
            {step.done && !active ? (
              <SymbolView
                name={{ ios: "checkmark", android: "check", web: "check" }}
                size={14}
                tintColor={fg}
              />
            ) : (
              <ThemedText weight="bold" type="caption" style={[styles.label, { color: fg }]}>
                {index + 1}
              </ThemedText>
            )}
          </PressableScale>
        );
      })}
    </TvScrollView>
  );
}

const styles = StyleSheet.create({
  scroller: { flexGrow: 0 },
  row: { gap: Spacing.oneHalf, paddingVertical: Spacing.half, paddingEnd: Spacing.one },
  step: {
    width: STEP,
    height: STEP,
    borderRadius: STEP / 2,
    borderWidth: BorderWidth.thick,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontVariant: ["tabular-nums"] },
});
