import { FARD_PRAYERS, type FardPrayer, type FardStatusValue } from "@munib-tracker/shared/circles";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * The five fard statuses for one day — ✓ when logged, – otherwise (never a
 * red "missed" mark: no signal is just no signal, D7). Pressable when the
 * viewer may log on the child's behalf.
 */
export function FardDots({
  value,
  onToggle,
  size = "md",
  showLabels = true,
}: {
  value: FardStatusValue | null;
  onToggle?: (prayer: FardPrayer) => void;
  size?: "md" | "lg";
  showLabels?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const dot = size === "lg" ? 56 : 32;

  return (
    <View style={styles.row} accessibilityRole={onToggle ? undefined : "summary"}>
      {FARD_PRAYERS.map((prayer) => {
        const done = value?.[prayer] === true;
        const label = t(`prayers.${prayer}`);
        const state = done ? t("family.status.logged") : t("family.status.notLogged");
        const content = (
          <View style={styles.cell}>
            <View
              style={[
                styles.dot,
                {
                  width: dot,
                  height: dot,
                  borderRadius: dot / 2,
                  backgroundColor: done ? tokens.status.success.soft : colors.muted,
                  borderColor: done ? tokens.status.success.color : colors.border,
                },
              ]}
            >
              <ThemedText
                type={size === "lg" ? "title" : "smallBold"}
                style={{ color: done ? tokens.status.success.color : colors.mutedForeground }}
              >
                {done ? "✓" : "–"}
              </ThemedText>
            </View>
            {showLabels ? (
              <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                {label}
              </ThemedText>
            ) : null}
          </View>
        );
        if (!onToggle) {
          return (
            <View key={prayer} accessible accessibilityLabel={`${label}: ${state}`}>
              {content}
            </View>
          );
        }
        return (
          <PressableScale
            key={prayer}
            onPress={() => onToggle(prayer)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: done }}
            accessibilityLabel={label}
            accessibilityHint={t("family.status.toggleHint")}
            style={styles.pressable}
          >
            {content}
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", gap: Spacing.one },
  cell: { alignItems: "center", gap: Spacing.half },
  // 44pt minimum touch target (HIG / Material) around the 32pt dot.
  pressable: { borderRadius: Radius.md, minWidth: 44, minHeight: 44, alignItems: "center" },
  dot: { alignItems: "center", justifyContent: "center", borderWidth: 1.5 },
});
