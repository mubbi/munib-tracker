import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { Sheet } from "@/components/ui/sheet";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { arabicReadingLayout } from "@/lib/reading-typography";

type AyahActionSheetProps = {
  visible: boolean;
  surah: number;
  ayah: number;
  surahName?: string;
  surahNameEnglish?: string;
  juz?: number;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  secondTranslation?: string;
  translationDir?: "ltr" | "rtl";
  secondTranslationDir?: "ltr" | "rtl";
  arabicSize?: number;
  transliterationSize?: number;
  translationSize?: number;
  isBookmarked: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onClose: () => void;
};

export function AyahActionSheet({
  visible,
  surah,
  ayah,
  surahName,
  surahNameEnglish,
  juz,
  arabic,
  transliteration,
  translation,
  secondTranslation,
  translationDir = "ltr",
  secondTranslationDir = "ltr",
  arabicSize = 26,
  transliterationSize = 14,
  translationSize = 16,
  isBookmarked,
  isPlaying,
  onPlay,
  onBookmark,
  onShare,
  onClose,
}: AyahActionSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const title = surahName ? `${surahName} ${ayah}` : t("quran.ayahRef", { surah, ayah });
  const metaParts = [
    t("quran.ayahRef", { surah, ayah }),
    juz != null ? t("quran.juzN", { n: juz }) : null,
    surahNameEnglish || null,
  ].filter(Boolean);
  const hasBody = Boolean(arabic || transliteration || translation || secondTranslation);

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom">
      <View style={styles.header}>
        <ThemedText type="subtitle">{title}</ThemedText>
        {metaParts.length > 0 ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {metaParts.join(" · ")}
          </ThemedText>
        ) : null}
      </View>

      {hasBody ? (
        <View style={[styles.body, { borderTopColor: tokens.hairline }]}>
          {arabic ? (
            <ThemedText type="arabic" style={arabicReadingLayout(arabicSize)}>
              {arabic}
            </ThemedText>
          ) : null}
          {transliteration ? (
            <ThemedText
              type="small"
              style={[styles.translit, { color: colors.accent, fontSize: transliterationSize }]}
            >
              {transliteration}
            </ThemedText>
          ) : null}
          {translation ? (
            <ThemedText
              type="default"
              style={[
                styles.translation,
                { fontSize: translationSize, lineHeight: translationSize * 1.5 },
                translationDir === "rtl" ? styles.rtl : null,
              ]}
            >
              {translation}
            </ThemedText>
          ) : null}
          {secondTranslation ? (
            <ThemedText
              type="default"
              themeColor="mutedForeground"
              style={[
                styles.secondTranslation,
                {
                  fontSize: translationSize,
                  lineHeight: translationSize * 1.5,
                  borderTopColor: tokens.hairline,
                },
                secondTranslationDir === "rtl" ? styles.rtl : null,
              ]}
            >
              {secondTranslation}
            </ThemedText>
          ) : null}
        </View>
      ) : null}

      <View style={styles.actions}>
        <LabeledIconButton
          name={isPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
          label={isPlaying ? t("quran.actionPause") : t("quran.actionPlay")}
          tintColor={colors.accent}
          labelColor={colors.accent}
          background={tokens.accentSoft}
          accessibilityLabel={isPlaying ? t("quran.pauseAyah") : t("quran.playAyah", { n: ayah })}
          onPress={onPlay}
        />
        <LabeledIconButton
          name={
            isBookmarked
              ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
              : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
          }
          label={isBookmarked ? t("quran.actionBookmarked") : t("quran.actionBookmark")}
          tintColor={isBookmarked ? tokens.status.warning.color : colors.mutedForeground}
          accessibilityLabel={isBookmarked ? t("quran.bookmarkRemove") : t("quran.bookmarkAdd")}
          onPress={onBookmark}
        />
        <LabeledIconButton
          name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
          label={t("quran.actionShare")}
          tintColor={colors.mutedForeground}
          accessibilityLabel={t("quran.shareAyah")}
          onPress={onShare}
        />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
  },
  body: {
    gap: Spacing.three,
    marginTop: Spacing.four,
    paddingTop: Spacing.four,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  translit: {
    lineHeight: 22,
  },
  translation: {
    lineHeight: 24,
  },
  secondTranslation: {
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rtl: {
    writingDirection: "rtl",
    textAlign: "right",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
});
