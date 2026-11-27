import type { DuaItem } from "@munib-tracker/shared/types";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Control, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatDuaHeading, groupDuasByOccasion } from "@/lib/dua-browse";

type DuaCategoryPaneProps = {
  /** The whole dua corpus — the pane lists the selected dua's category. */
  items: readonly DuaItem[];
  selectedId: string;
  categoryLabel: string;
  onSelect: (item: DuaItem) => void;
};

/**
 * Tablet / desktop list pane of the dua list–detail layout (D-UX11): every dua
 * in the open dua's category, in the same occasion order as the category screen
 * and the pager. Selection is the route's `id` — the caller replaces the route,
 * so deep links and Back behave exactly as on phone.
 */
export function DuaCategoryPane({
  items,
  selectedId,
  categoryLabel,
  onSelect,
}: DuaCategoryPaneProps) {
  const { colors, tokens } = useThemeTokens();
  const categoryId = items.find((item) => item.id === selectedId)?.categoryId;
  const ordered = useMemo(
    () =>
      categoryId
        ? groupDuasByOccasion(items.filter((item) => item.categoryId === categoryId)).flatMap(
            (section) => section.items,
          )
        : [],
    [categoryId, items],
  );
  if (ordered.length === 0) return null;

  return (
    <Card style={styles.card}>
      <ThemedText type="smallBold" heading={2} style={styles.title}>
        {categoryLabel}
      </ThemedText>
      <View style={styles.list}>
        {ordered.map((item, index) => {
          const selected = item.id === selectedId;
          const heading = formatDuaHeading(item.title);
          return (
            <PressableScale
              key={item.id}
              haptic="selection"
              accessibilityRole="button"
              accessibilityLabel={`${index + 1}. ${heading}`}
              accessibilityState={{ selected }}
              aria-current={selected ? "page" : undefined}
              onPress={() => {
                if (!selected) onSelect(item);
              }}
              scaleTo={0.98}
              style={[styles.row, selected && { backgroundColor: tokens.accentSoft }]}
            >
              <ThemedText
                type="caption"
                style={[
                  styles.index,
                  { color: selected ? tokens.accentOnSoft : colors.mutedForeground },
                ]}
              >
                {index + 1}
              </ThemedText>
              <ThemedText
                type="small"
                weight={selected ? "semibold" : undefined}
                numberOfLines={2}
                style={[styles.label, selected && { color: tokens.accentOnSoft }]}
              >
                {heading}
              </ThemedText>
            </PressableScale>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  title: { paddingHorizontal: Spacing.one },
  list: { gap: Spacing.half },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: Control.minTouch,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  index: { minWidth: Spacing.four, textAlign: "center" },
  label: { flex: 1, minWidth: 0 },
});
