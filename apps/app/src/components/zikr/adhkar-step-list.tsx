import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import type { AdhkarStep } from "@/components/zikr/adhkar-step-strip";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

const MARK = 26;

/**
 * Wide / TV session outline: every zikr by name with its own count, so the
 * whole set is readable at a glance and any item is one tap (or Select) away.
 */
export function AdhkarStepList({
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
  const tv = isTV();
  const mark = tv ? tvDp(MARK) : MARK;

  return (
    <View style={styles.list}>
      {steps.map((step, index) => {
        const active = index === activeIndex;
        const success = tokens.status.success.color;
        const status = step.done
          ? t("zikr.done")
          : step.optional
            ? t("zikrSession.optional")
            : step.target > 1
              ? `${Math.min(step.count, step.target)}/${step.target}`
              : t("zikrSession.once");
        return (
          <PressableScale
            key={step.id}
            haptic="selection"
            onPress={() => onSelect(index)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${index + 1}. ${step.title}, ${status}`}
            style={[
              styles.row,
              tv && styles.rowTv,
              {
                backgroundColor: active ? tokens.accentSoft : "transparent",
                borderColor: active ? withAlpha(colors.accent, 0.45) : "transparent",
              },
            ]}
          >
            <View
              style={[
                styles.mark,
                {
                  width: mark,
                  height: mark,
                  borderRadius: mark / 2,
                  backgroundColor: step.done ? success : "transparent",
                  borderColor: step.done
                    ? success
                    : step.started
                      ? colors.accent
                      : withAlpha(colors.mutedForeground, 0.5),
                  borderStyle: step.optional && !step.done ? "dashed" : "solid",
                },
              ]}
            >
              {step.done ? (
                <SymbolView
                  name={{ ios: "checkmark", android: "check", web: "check" }}
                  size={tv ? tvDp(14) : 14}
                  tintColor={colors.accentForeground}
                />
              ) : (
                <ThemedText
                  type="caption"
                  style={[styles.markText, { color: colors.mutedForeground }]}
                >
                  {index + 1}
                </ThemedText>
              )}
            </View>
            <ThemedText
              type="small"
              numberOfLines={1}
              style={[
                styles.title,
                {
                  color: active || !step.done ? colors.foreground : colors.mutedForeground,
                  fontWeight: active ? "700" : "400",
                },
              ]}
            >
              {step.title}
            </ThemedText>
            <ThemedText
              type="caption"
              style={[
                styles.status,
                {
                  color: step.done
                    ? success
                    : step.optional
                      ? tokens.status.warning.color
                      : colors.mutedForeground,
                },
              ]}
            >
              {status}
            </ThemedText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two + 2,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.two,
    minHeight: 44,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  rowTv: { minHeight: TvLayout.minFocusTarget, paddingHorizontal: Spacing.three },
  mark: { borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  markText: { fontWeight: "700", fontVariant: ["tabular-nums"] },
  title: { flex: 1, minWidth: 0 },
  status: { fontVariant: ["tabular-nums"] },
});
