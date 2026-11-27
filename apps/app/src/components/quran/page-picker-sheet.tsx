import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SearchField } from "@/components/ui/search-field";
import { Sheet } from "@/components/ui/sheet";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { getPageList } from "@/lib/quran-meta";

type PagePickerSheetProps = {
  visible: boolean;
  selectedPage: number;
  onSelect: (page: number) => void;
  onClose: () => void;
};

const PAGE_LIST = getPageList();
/**
 * Fixed row height so the list opens scrolled to the current page on every
 * platform (`initialScrollIndex` needs `getItemLayout`) — G-19: it used to open
 * at page 1 of 604 off TV. Scaled by the text size so large text never clips.
 */
const ROW_HEIGHT = 64;
const TV_ROW_HEIGHT = tvDp(72);

export function PagePickerSheet({
  visible,
  selectedPage,
  onSelect,
  onClose,
}: PagePickerSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { fontScale } = useWindowDimensions();
  const [query, setQuery] = useState("");
  const tv = isTV();
  const rowHeight = Math.ceil((tv ? TV_ROW_HEIGHT : ROW_HEIGHT) * Math.max(1, fontScale));
  const rowStride = rowHeight + Spacing.two;
  const selectedIndex = PAGE_LIST.findIndex((p) => p.page === selectedPage);
  const startIndex = query.trim() === "" ? Math.max(0, selectedIndex) : 0;

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return PAGE_LIST;
    const n = Number.parseInt(q, 10);
    if (Number.isFinite(n)) return PAGE_LIST.filter((p) => String(p.page).includes(String(n)));
    return PAGE_LIST.filter(
      (p) =>
        p.surahNameTransliteration.toLowerCase().includes(q.toLowerCase()) ||
        p.surahNameEnglish.toLowerCase().includes(q.toLowerCase()),
    );
  }, [query]);

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      variant="bottom"
      scrollable={false}
      title={t("quran.pagePickerTitle")}
    >
      {/* Default keyboard: the field also finds surahs by name (G-19). */}
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder={t("quran.pagePickerSearch")}
        style={styles.search}
      />
      <TvFlatList
        testID="page-picker-list"
        // Remount per query so the start index applies to the list it belongs to.
        key={query.trim() === "" ? "all" : "filtered"}
        data={filtered}
        keyExtractor={(item) => String(item.page)}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        getItemLayout={(_: unknown, index: number) => ({
          length: rowStride,
          offset: rowStride * index,
          index,
        })}
        initialScrollIndex={startIndex}
        renderItem={({ item }) => {
          const selected = item.page === selectedPage;
          return (
            <PressableScale
              haptic="light"
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => {
                onSelect(item.page);
                onClose();
              }}
              {...(tv && selected ? { hasTVPreferredFocus: true } : {})}
              style={[
                styles.row,
                { height: rowHeight },
                {
                  backgroundColor: selected ? tokens.accentSoft : colors.muted,
                },
              ]}
            >
              <ThemedText
                type="smallBold"
                numberOfLines={1}
                style={{ color: selected ? colors.accentText : colors.foreground }}
              >
                {t("quran.pageN", { n: item.page })}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                {item.surahNameTransliteration} · {item.surah}:{item.ayah} ·{" "}
                {t("quran.juzN", { n: item.juz })}
              </ThemedText>
            </PressableScale>
          );
        }}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 0,
    flexShrink: 1,
    minHeight: 0,
  },
  search: { marginBottom: Spacing.two },
  row: {
    justifyContent: "center",
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    marginBottom: Spacing.two,
    gap: Spacing.one,
  },
});
