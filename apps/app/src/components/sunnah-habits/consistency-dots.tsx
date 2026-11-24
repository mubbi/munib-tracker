import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * 30-day consistency dots, oldest → newest (start → end, so RTL flips with the
 * layout). A filled dot is a day the habit was kept; an empty dot is neutral —
 * never a "broken streak".
 */
export function ConsistencyDots({ dots, label }: { dots: readonly boolean[]; label: string }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const kept = dots.filter(Boolean).length;
  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="image"
      accessibilityLabel={t("sunnahHabits.dotsA11y", { title: label, kept, days: dots.length })}
    >
      {dots.map((done, index) => (
        <View
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length day strip, position is the identity
          key={index}
          style={[
            styles.dot,
            done
              ? { backgroundColor: tokens.status.success.color }
              : {
                  backgroundColor: colors.muted,
                  borderColor: tokens.hairline,
                  borderWidth: StyleSheet.hairlineWidth,
                },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 3, marginTop: 4 },
  dot: { width: 7, height: 7, borderRadius: 4 },
});
