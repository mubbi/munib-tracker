import type { DuaItem } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { type DuaNeighbors, duaOccasion } from "@/lib/dua-browse";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronBackward, useChevronForward, useIsRTL } from "@/lib/rtl";

type DuaDetailPagerProps = {
  neighbors: DuaNeighbors;
  categoryLabel: string;
  onOpen: (item: DuaItem) => void;
};

/**
 * Previous / next within the category, each showing where it leads — so a set
 * like the morning remembrances can be read straight through without going
 * back to the list.
 */
export function DuaDetailPager({ neighbors, categoryLabel, onOpen }: DuaDetailPagerProps) {
  const { t } = useTranslation();
  const { previous, next, position, total } = neighbors;
  if (!previous && !next) return null;

  return (
    <View style={styles.root}>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.position}>
        {t("dua.positionInCategory", { current: position, total, category: categoryLabel })}
      </ThemedText>
      <View style={styles.row}>
        <PagerButton direction="previous" item={previous} onOpen={onOpen} />
        <PagerButton direction="next" item={next} onOpen={onOpen} />
      </View>
    </View>
  );
}

function PagerButton({
  direction,
  item,
  onOpen,
}: {
  direction: "previous" | "next";
  item?: DuaItem;
  onOpen: (item: DuaItem) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const backward = useChevronBackward();
  const forward = useChevronForward();
  const rtl = useIsRTL();
  const tv = isTV();
  if (!item) return <View style={styles.button} />;

  const isNext = direction === "next";
  const label = isNext ? t("dua.next") : t("dua.previous");
  const heading = duaOccasion(item);
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${heading}`}
      onPress={() => onOpen(item)}
      style={[
        styles.button,
        styles.buttonFilled,
        tv && styles.buttonTv,
        isNext && styles.buttonNext,
        { backgroundColor: colors.muted, borderColor: tokens.hairline },
      ]}
    >
      {isNext ? null : <SymbolView name={backward} size={14} tintColor={colors.accentText} />}
      <View style={[styles.buttonText, isNext && styles.buttonTextNext]}>
        <ThemedText type="caption" weight="bold" style={{ color: colors.accentText }}>
          {label}
        </ThemedText>
        <ThemedText
          type="caption"
          numberOfLines={1}
          themeColor="mutedForeground"
          // Chrome text that hugs the trailing edge flips with layout direction.
          style={isNext ? { textAlign: rtl ? "left" : "right" } : undefined}
        >
          {heading}
        </ThemedText>
      </View>
      {isNext ? <SymbolView name={forward} size={14} tintColor={colors.accentText} /> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.two },
  position: { textAlign: "center" },
  row: { flexDirection: "row", gap: Spacing.two },
  /** Empty slot keeps a lone Previous / Next at half width. */
  button: { flex: 1, minWidth: 0 },
  buttonFilled: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: tvDp(56),
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  buttonTv: { minHeight: TvLayout.minFocusTarget, paddingHorizontal: Spacing.four },
  buttonNext: { justifyContent: "flex-end" },
  buttonText: { flex: 1, minWidth: 0, gap: 1 },
  buttonTextNext: { alignItems: "flex-end" },
});
