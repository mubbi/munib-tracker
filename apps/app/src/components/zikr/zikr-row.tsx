import type { ZikrItem } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
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
  /**
   * When true, tapping the row expands a full-text preview in place instead of
   * firing `onPress` immediately; a "show more" link inside then calls
   * `onPress` to open the detail screen. Keeps long category lists scannable.
   */
  expandable?: boolean;
};

export function ZikrRow({ item, isFavorite, onPress, onToggleFavorite, expandable }: ZikrRowProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [expanded, setExpanded] = useState(false);

  return (
    // The favorite toggle is rendered as a sibling overlay rather than nested
    // inside the row's Pressable — on web, nesting a <button> inside another
    // <button> is invalid HTML and triggers a DOM-nesting warning.
    <View style={styles.wrapper}>
      <View style={[styles.card, { backgroundColor: colors.muted }]}>
        <PressableScale
          haptic="light"
          onPress={expandable ? () => setExpanded((value) => !value) : onPress}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          accessibilityState={expandable ? { expanded } : undefined}
          style={styles.row}
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
            name={
              expandable
                ? {
                    ios: "chevron.down",
                    android: "keyboard_arrow_down",
                    web: "keyboard_arrow_down",
                  }
                : { ios: "chevron.right", android: "chevron_right", web: "chevron_right" }
            }
            size={CHEVRON_SIZE}
            tintColor={colors.mutedForeground}
            style={
              expandable ? { transform: [{ rotate: expanded ? "180deg" : "0deg" }] } : undefined
            }
          />
        </PressableScale>

        {expandable && expanded ? (
          <Animated.View
            entering={FadeIn.duration(180)}
            style={[styles.expanded, { borderTopColor: tokens.hairline }]}
          >
            <ThemedText type="arabic" style={styles.arabic}>
              {item.arabic}
            </ThemedText>
            <ThemedText type="default">{item.translation}</ThemedText>
            <PressableScale
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={onPress}
              style={styles.openRow}
            >
              <ThemedText type="smallBold" style={{ color: colors.accentText }}>
                {t("reading.showMore")}
              </ThemedText>
              <SymbolView
                name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
                size={13}
                tintColor={colors.accentText}
              />
            </PressableScale>
          </Animated.View>
        ) : null}
      </View>

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
          onPress={onToggleFavorite}
          style={styles.favoriteButton}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  card: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
    padding: Spacing.three,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  expanded: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
  },
  arabic: {
    writingDirection: "rtl",
    textAlign: "right",
    marginTop: Spacing.two,
  },
  openRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: Spacing.one,
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
