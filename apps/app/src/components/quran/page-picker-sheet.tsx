import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getPageList } from "@/lib/quran";

type PagePickerSheetProps = {
  visible: boolean;
  selectedPage: number;
  onSelect: (page: number) => void;
  onClose: () => void;
};

const PAGE_LIST = getPageList();

export function PagePickerSheet({
  visible,
  selectedPage,
  onSelect,
  onClose,
}: PagePickerSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [query, setQuery] = useState("");

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
    <Sheet visible={visible} onClose={onClose} variant="bottom" scrollable={false}>
      <TvFlatList
        data={filtered}
        keyExtractor={(item) => String(item.page)}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="subtitle">{t("quran.pagePickerTitle")}</ThemedText>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t("quran.pagePickerSearch")}
              placeholderTextColor={colors.mutedForeground}
              keyboardType="number-pad"
              style={[
                styles.input,
                {
                  backgroundColor: colors.muted,
                  color: colors.foreground,
                  borderColor: tokens.hairline,
                },
              ]}
            />
          </View>
        }
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
              style={[
                styles.row,
                {
                  backgroundColor: selected ? tokens.accentSoft : colors.muted,
                },
              ]}
            >
              <ThemedText
                type="smallBold"
                style={{ color: selected ? colors.accent : colors.foreground }}
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
  header: {
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  input: {
    marginTop: Spacing.one,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  row: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    marginBottom: Spacing.two,
    gap: Spacing.one,
  },
});
