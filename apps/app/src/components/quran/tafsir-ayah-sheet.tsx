import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type TafsirAyahSheetProps = {
  visible: boolean;
  onClose: () => void;
  surah: number;
  ayah: number;
  editionName: string;
  author: string;
  text: string | null | undefined;
  direction: "ltr" | "rtl";
  loading: boolean;
  offline: boolean;
};

export function TafsirAyahSheet({
  visible,
  onClose,
  surah,
  ayah,
  editionName,
  author,
  text,
  direction,
  loading,
  offline,
}: TafsirAyahSheetProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const trimmed = text?.trim() ?? "";
  const empty = !loading && !offline && trimmed.length === 0;

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom" scrollable={false} solid>
      <View style={styles.header}>
        <ThemedText type="subtitle">{t("quran.tafsir")}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quran.ayahRef", { surah, ayah })}
        </ThemedText>
        <ThemedText type="small" numberOfLines={2}>
          {editionName}
        </ThemedText>
        {author ? (
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {author}
          </ThemedText>
        ) : null}
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator
      >
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="small" color={colors.accent} />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("quran.tafsirLoading")}
            </ThemedText>
          </View>
        ) : offline ? (
          <ThemedText type="default" themeColor="mutedForeground" style={styles.message}>
            {t("quran.tafsirOffline")}
          </ThemedText>
        ) : empty ? (
          <ThemedText type="default" themeColor="mutedForeground" style={styles.message}>
            {t("quran.tafsirEmpty")}
          </ThemedText>
        ) : (
          <ThemedText
            type="default"
            style={[
              styles.text,
              direction === "rtl" ? styles.rtl : null,
              { color: colors.foreground },
            ]}
          >
            {trimmed}
          </ThemedText>
        )}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
    marginBottom: Spacing.three,
  },
  body: {
    maxHeight: 420,
  },
  bodyContent: {
    paddingBottom: Spacing.four,
  },
  center: {
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.six,
  },
  message: {
    lineHeight: 22,
    paddingVertical: Spacing.two,
  },
  text: {
    lineHeight: 26,
  },
  rtl: {
    writingDirection: "rtl",
    textAlign: "right",
  },
});
