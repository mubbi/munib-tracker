import { duasByCategory } from "@munib-tracker/shared/content";
import type { DuaCategoryId, DuaItem } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  useDuaFavoritesActions,
  useEnsureDuaFavoritesLoaded,
  useFavoriteDuaIds,
} from "@/stores/dua-favorites-store";

const VALID: DuaCategoryId[] = ["sunnah", "quranic", "daily"];

export default function DuaCategoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureDuaFavoritesLoaded();
  const favoriteIds = useFavoriteDuaIds();
  const { toggle } = useDuaFavoritesActions();
  const params = useLocalSearchParams<{ category: string }>();
  const categoryId = (
    VALID.includes(params.category as DuaCategoryId) ? params.category : "daily"
  ) as DuaCategoryId;
  const items = duasByCategory(categoryId);

  return (
    <ScreenLayout
      eyebrow={t("dua.categoryEyebrow")}
      title={t(`duaCat.${categoryId}`)}
      subtitle={t("dua.supplicationsCount", { count: items.length })}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card padding="three">
          <View style={styles.list}>
            {items.map((item) => (
              <DuaRow
                key={item.id}
                item={item}
                isFavorite={favoriteIds.includes(item.id)}
                onToggleFavorite={() => toggle(item.id)}
                onOpen={() =>
                  router.push({ pathname: "/dua/detail/[id]", params: { id: item.id } })
                }
              />
            ))}
          </View>
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

/**
 * An expandable dua row: tapping toggles a full-text preview in place (no
 * gesture libs — cross-platform), with a favorite toggle and a jump-to-detail
 * chevron. Long category lists stay scannable while still giving the full text
 * a tap away.
 */
function DuaRow({
  item,
  isFavorite,
  onToggleFavorite,
  onOpen,
}: {
  item: DuaItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [expanded, setExpanded] = useState(false);

  return (
    // The favorite toggle is a sibling overlay, not nested inside the header's
    // Pressable — nesting a <button> inside another <button> is invalid HTML on
    // web (matches the ZikrRow pattern).
    <View style={[styles.rowWrap, { backgroundColor: colors.muted }]}>
      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={item.title}
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((value) => !value)}
        style={styles.rowHeader}
      >
        <View style={styles.body}>
          <ThemedText type="small" numberOfLines={expanded ? undefined : 1}>
            {item.title}
          </ThemedText>
          <ThemedText
            type="caption"
            themeColor="mutedForeground"
            numberOfLines={expanded ? undefined : 1}
          >
            {item.transliteration}
          </ThemedText>
        </View>
        <View style={styles.favoriteSlot} />
        <SymbolView
          name={{ ios: "chevron.down", android: "keyboard_arrow_down", web: "keyboard_arrow_down" }}
          size={14}
          tintColor={colors.mutedForeground}
          style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}
        />
      </PressableScale>

      <IconButton
        name={
          isFavorite
            ? { ios: "star.fill", android: "star", web: "star" }
            : { ios: "star", android: "star_border", web: "star_border" }
        }
        size={18}
        tintColor={isFavorite ? tokens.status.warning.color : colors.mutedForeground}
        accessibilityLabel={isFavorite ? t("dua.unfavorite") : t("dua.favorite")}
        accessibilityState={{ selected: isFavorite }}
        haptic="selection"
        onPress={onToggleFavorite}
        style={styles.favoriteButton}
      />

      {expanded ? (
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
            onPress={onOpen}
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
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  rowWrap: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
  },
  body: { flex: 1, gap: 2 },
  favoriteSlot: { width: 18, height: 18 },
  favoriteButton: {
    position: "absolute",
    // Vertically centered over the collapsed header (two text lines + padding
    // ≈ 58pt, minus the 44pt target ≈ 7pt inset from the top).
    top: 7,
    // Center the 44pt target over the reserved slot, just left of the chevron.
    right: Spacing.three + 14 + Spacing.two + 18 / 2 - 22,
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
});
