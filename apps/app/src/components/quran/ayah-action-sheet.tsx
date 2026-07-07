import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type AyahActionSheetProps = {
  visible: boolean;
  surah: number;
  ayah: number;
  surahName?: string;
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
  isBookmarked,
  isPlaying,
  onPlay,
  onBookmark,
  onShare,
  onClose,
}: AyahActionSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const ref = surahName ? `${surahName} ${ayah}` : t("quran.ayahRef", { surah, ayah });

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom">
      <ThemedText type="subtitle">{ref}</ThemedText>
      <View style={styles.actions}>
        <LabeledIconButton
          name={
            isPlaying
              ? { ios: "pause.circle.fill", android: "pause_circle", web: "pause_circle" }
              : { ios: "play.circle.fill", android: "play_circle", web: "play_circle" }
          }
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
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
});
