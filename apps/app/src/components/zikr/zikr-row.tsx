import type { ZikrItem } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { ListIndexBadge } from "@/components/ui/list-index-badge";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { chevronForward } from "@/lib/rtl";

const CHEVRON_SIZE = 14;
const FAVORITE_SIZE = 18;
const ROW_GAP = Spacing.two + 2;

type ZikrRowProps = {
  item: ZikrItem;
  /** 1-based position in the source list (category, favorites order, etc.). */
  index?: number;
  isFavorite?: boolean;
  /** Stable id-taking handlers so memoized rows keep their prop identity. */
  onPress: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  /** Optional category pill shown in cross-category search results. */
  categoryLabel?: string;
  /** Today's completion for the active prayer scope. */
  completed?: boolean;
  /** e.g. "3/5" when tracking across multiple salah slots. */
  progressLabel?: string;
};

export const ZikrRow = memo(function ZikrRow({
  item,
  index,
  isFavorite,
  onPress,
  onToggleFavorite,
  categoryLabel,
  completed,
  progressLabel,
}: ZikrRowProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  const handlePress = useCallback(() => onPress(item.id), [item.id, onPress]);
  const handleToggleFavorite = useCallback(
    () => onToggleFavorite?.(item.id),
    [item.id, onToggleFavorite],
  );

  return (
    // The favorite toggle is rendered as a sibling overlay rather than nested
    // inside the row's Pressable — on web, nesting a <button> inside another
    // <button> is invalid HTML and triggers a DOM-nesting warning.
    <View style={styles.wrapper}>
      <PressableScale
        haptic="light"
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={index != null ? `${index}. ${item.title}` : item.title}
        style={[styles.row, { backgroundColor: colors.muted }]}
      >
        {index != null ? <ListIndexBadge index={index} /> : null}

        <View style={styles.body}>
          <ThemedText type="small" numberOfLines={1}>
            {item.title}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {item.transliteration}
          </ThemedText>
        </View>

        {completed ? (
          <Pill
            label={progressLabel ?? t("zikr.done")}
            color={tokens.status.success.color}
            background={tokens.status.success.soft}
            icon={{ ios: "checkmark", android: "check", web: "check" }}
          />
        ) : progressLabel ? (
          <Pill label={progressLabel} color={colors.mutedForeground} background={colors.card} />
        ) : item.targetCount ? (
          <Pill
            label={`×${item.targetCount}`}
            color={colors.accent}
            background={tokens.accentSoft}
          />
        ) : null}

        {categoryLabel ? (
          <Pill label={categoryLabel} color={colors.mutedForeground} background={colors.card} />
        ) : null}

        {onToggleFavorite ? <View style={styles.favoriteSlot} /> : null}

        <SymbolView
          name={chevronForward()}
          size={CHEVRON_SIZE}
          tintColor={colors.mutedForeground}
        />
      </PressableScale>

      {onToggleFavorite ? (
        <IconButton
          name={
            isFavorite
              ? { ios: "star.fill", android: "star", web: "star" }
              : { ios: "star", android: "star_border", web: "star_border" }
          }
          size={FAVORITE_SIZE}
          tintColor={isFavorite ? tokens.status.warning.color : colors.mutedForeground}
          accessibilityLabel={isFavorite ? t("zikr.removeFavorite") : t("zikr.favorite")}
          accessibilityState={{ selected: isFavorite }}
          haptic="selection"
          onPress={handleToggleFavorite}
          style={styles.favoriteButton}
        />
      ) : null}
    </View>
  );
});

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
    // Vertically centered over the collapsed header row (two text lines +
    // padding ≈ 58pt tall, minus the 44pt target ≈ 7pt inset from the top).
    top: 7,
    // Center the 44pt target over the reserved slot (slot sits just left of the
    // chevron): slot right edge + half the slot, minus half the tap target.
    right: Spacing.three + CHEVRON_SIZE + ROW_GAP + FAVORITE_SIZE / 2 - 22,
  },
});
