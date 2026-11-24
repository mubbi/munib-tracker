import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";

import { Chip } from "@/components/ui/chip";
import { Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
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
  // Wrapping layout: the full label fits, so no width cap / ellipsis.
  const chipStyle = wrap ? styles.chipWrapped : styles.chipStrip;
  const content = (
    <>
      <Chip
        label={t("dua.allOccasions")}
        count={totalCount}
        variant="solid"
        selected={selected == null}
        style={chipStyle}
        onPress={() => onSelect(null)}
      />
      {chips.map((chip) => (
        <Chip
          key={chip.key}
          label={chip.label}
          count={chip.count}
          variant="solid"
          selected={selected === chip.key}
          style={chipStyle}
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

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: Spacing.two, paddingVertical: 2 },
  wrap: { flexWrap: "wrap" },
  chipStrip: { maxWidth: tvDp(260) },
  chipWrapped: { maxWidth: "100%" },
});
