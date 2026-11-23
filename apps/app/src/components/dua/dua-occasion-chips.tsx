import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

export interface DuaOccasionChip {
  key: string;
  label: string;
  count: number;
}

type DuaOccasionChipsProps = {
  chips: readonly DuaOccasionChip[];
  /** Selected chip key, or null for "All". */
  selected: string | null;
  onSelect: (key: string | null) => void;
  totalCount: number;
};

/**
 * Occasion filter ("All · Upon waking up · Before sleeping …"). Phones get a
 * swipeable single row; wide web and TV wrap instead — a mouse can't swipe a
 * scrollbar-less strip, and on TV every chip stays in the D-pad grid.
 */
export function DuaOccasionChips({ chips, selected, onSelect, totalCount }: DuaOccasionChipsProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const wrap = isTV() || width >= 768;
  const content = (
    <>
      <Chip
        label={t("dua.allOccasions")}
        count={totalCount}
        active={selected == null}
        wrapped={wrap}
        onPress={() => onSelect(null)}
      />
      {chips.map((chip) => (
        <Chip
          key={chip.key}
          label={chip.label}
          count={chip.count}
          active={selected === chip.key}
          wrapped={wrap}
          onPress={() => onSelect(selected === chip.key ? null : chip.key)}
        />
      ))}
    </>
  );

  if (wrap) {
    return (
      <View style={[styles.row, styles.wrap]} accessibilityLabel={t("dua.filterOccasion")}>
        {content}
      </View>
    );
  }
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityLabel={t("dua.filterOccasion")}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  );
}

function Chip({
  label,
  count,
  active,
  wrapped,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  /** Wrapping layout: the full label fits, so no width cap / ellipsis. */
  wrapped: boolean;
  onPress: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const fg = active ? colors.accentForeground : colors.foreground;
  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${label}, ${count}`}
      onPress={onPress}
      style={[
        styles.chip,
        wrapped && styles.chipWrapped,
        tv && styles.chipTv,
        active
          ? { backgroundColor: colors.accent, borderColor: colors.accent }
          : { backgroundColor: colors.muted, borderColor: tokens.hairline },
      ]}
    >
      <ThemedText type="caption" numberOfLines={1} style={[styles.label, { color: fg }]}>
        {label}
      </ThemedText>
      <ThemedText
        type="caption"
        style={[styles.count, { color: active ? fg : colors.mutedForeground }]}
      >
        {count}
      </ThemedText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: Spacing.two, paddingVertical: 2 },
  wrap: { flexWrap: "wrap" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: tvDp(36),
    maxWidth: tvDp(260),
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  chipWrapped: { maxWidth: "100%" },
  chipTv: { minHeight: TvLayout.minFocusTarget, paddingHorizontal: Spacing.four },
  label: { flexShrink: 1, fontWeight: "600" },
  count: { fontVariant: ["tabular-nums"] },
});
