import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { CustomTasbeeh } from "@/stores/custom-tasbeeh-store";

type CustomTasbeehRowProps = {
  item: CustomTasbeeh;
  onPress: () => void;
};

function progressLabel(item: CustomTasbeeh): string {
  if (item.target <= 0) return String(item.count);
  return `${item.count} / ${item.target}`;
}

export function CustomTasbeehRow({ item, onPress }: CustomTasbeehRowProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const complete = item.target > 0 && item.count >= item.target;

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={item.title}
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.muted }]}
    >
      <View style={styles.body}>
        <ThemedText type="small" numberOfLines={1}>
          {item.title}
        </ThemedText>
        {item.description ? (
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
            {item.description}
          </ThemedText>
        ) : (
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {item.target > 0
              ? t("tasbeeh.customTargetSummary", { target: item.target })
              : t("tasbeeh.customUnlimitedSummary")}
          </ThemedText>
        )}
      </View>

      <Pill
        label={progressLabel(item)}
        color={complete ? tokens.status.success.color : colors.accent}
        background={complete ? tokens.status.success.soft : tokens.accentSoft}
        icon={
          complete
            ? { ios: "checkmark.seal.fill", android: "verified", web: "verified" }
            : undefined
        }
      />

      <SymbolView
        name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
        size={14}
        tintColor={colors.mutedForeground}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  body: {
    flex: 1,
    gap: Spacing.half,
    minWidth: 0,
  },
});
