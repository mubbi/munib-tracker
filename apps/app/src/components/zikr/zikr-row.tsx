import type { ZikrItem } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const CHEVRON_SIZE = 14;
const FAVORITE_SIZE = 18;
const ROW_GAP = Spacing.two + 2;

type ZikrRowProps = {
  item: ZikrItem;
  isFavorite?: boolean;
  onPress: () => void;
  onToggleFavorite?: () => void;
};

export function ZikrRow({ item, isFavorite, onPress, onToggleFavorite }: ZikrRowProps) {
  const { colors, tokens } = useThemeTokens();

  return (
    // The favorite toggle is rendered as a sibling overlay rather than nested
    // inside the row's Pressable — on web, nesting a <button> inside another
    // <button> is invalid HTML and triggers a DOM-nesting warning.
    <View style={styles.wrapper}>
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
          <Pill
            label={`×${item.targetCount}`}
            color={colors.accent}
            background={tokens.accentSoft}
          />
        ) : null}

        {onToggleFavorite ? <View style={styles.favoriteSlot} /> : null}

        <SymbolView
          name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
          size={CHEVRON_SIZE}
          tintColor={colors.mutedForeground}
        />
      </PressableScale>

      {onToggleFavorite ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? "Remove favorite" : "Add favorite"}
          hitSlop={8}
          onPress={onToggleFavorite}
          style={styles.favoriteButton}
        >
          <SymbolView
            name={
              isFavorite
                ? { ios: "star.fill", android: "star", web: "star" }
                : { ios: "star", android: "star_border", web: "star_border" }
            }
            size={FAVORITE_SIZE}
            tintColor={isFavorite ? tokens.status.warning.color : colors.mutedForeground}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  body: {
    flex: 1,
    gap: 2,
  },
  favoriteSlot: {
    width: FAVORITE_SIZE,
    height: FAVORITE_SIZE,
  },
  favoriteButton: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: Spacing.three + CHEVRON_SIZE + ROW_GAP,
    width: FAVORITE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});
