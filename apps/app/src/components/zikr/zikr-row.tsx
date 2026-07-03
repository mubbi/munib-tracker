import type { ZikrItem } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type ZikrRowProps = {
  item: ZikrItem;
  isFavorite?: boolean;
  onPress: () => void;
  onToggleFavorite?: () => void;
};

export function ZikrRow({ item, isFavorite, onPress, onToggleFavorite }: ZikrRowProps) {
  const { colors, tokens } = useThemeTokens();

  return (
    <PressableScale
      haptic="light"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      style={[styles.row, { backgroundColor: colors.muted }]}
    >
      <View style={styles.body}>
        <ThemedText type="small" numberOfLines={1}>
          {item.title}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
          {item.transliteration}
        </ThemedText>
      </View>

      {item.targetCount ? (
        <Pill label={`×${item.targetCount}`} color={colors.accent} background={tokens.accentSoft} />
      ) : null}

      {onToggleFavorite ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? "Remove favorite" : "Add favorite"}
          hitSlop={8}
          onPress={onToggleFavorite}
        >
          <SymbolView
            name={
              isFavorite
                ? { ios: "star.fill", android: "star", web: "star" }
                : { ios: "star", android: "star_border", web: "star_border" }
            }
            size={18}
            tintColor={isFavorite ? tokens.status.warning.color : colors.mutedForeground}
          />
        </Pressable>
      ) : null}

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
    gap: Spacing.two + 2,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  body: {
    flex: 1,
    gap: 2,
  },
});
