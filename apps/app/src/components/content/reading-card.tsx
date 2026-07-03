import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { usePreferences } from "@/stores/preferences-store";

export type ReadingItem = {
  id?: string;
  title?: string;
  arabic: string;
  transliteration: string;
  translation: string;
  virtues?: string;
  reference?: string;
  audioUri?: string;
};

/** Shared reading view for religious text (zikr, dua, durood, names). */
export function ReadingCard({ item }: { item: ReadingItem }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { fontPrefs } = usePreferences();
  const audio = useAudioPlayerContext();
  const arabicSize = fontPrefs.arabic.size;
  const textSize = fontPrefs.translation.size;

  const playAudio = () => {
    if (!item.audioUri) return;
    audio.play([{ id: item.id ?? "reading", title: item.title ?? "", uri: item.audioUri }]);
  };

  return (
    <Card padding="four">
      {item.audioUri ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.play")}
          hitSlop={8}
          onPress={playAudio}
          style={[styles.play, { backgroundColor: tokens.accentSoft }]}
        >
          <SymbolView
            name={{ ios: "play.fill", android: "play_arrow", web: "play_arrow" }}
            size={16}
            tintColor={colors.accent}
          />
        </Pressable>
      ) : null}
      <ThemedText
        type="arabic"
        style={[
          styles.arabic,
          arabicSize ? { fontSize: arabicSize, lineHeight: arabicSize * 1.8 } : null,
        ]}
      >
        {item.arabic}
      </ThemedText>

      <View style={[styles.divider, { backgroundColor: tokens.hairline }]} />

      <ThemedText
        type="small"
        style={[
          styles.transliteration,
          { color: colors.accent },
          textSize ? { fontSize: textSize } : null,
        ]}
      >
        {item.transliteration}
      </ThemedText>
      <ThemedText
        type="default"
        style={[styles.translation, textSize ? { fontSize: textSize } : null]}
      >
        {item.translation}
      </ThemedText>

      {item.virtues ? (
        <View style={[styles.note, { backgroundColor: tokens.status.success.soft }]}>
          <SymbolView
            name={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
            size={16}
            tintColor={tokens.status.success.color}
          />
          <ThemedText type="small" themeColor="mutedForeground" style={styles.noteText}>
            {item.virtues}
          </ThemedText>
        </View>
      ) : null}

      {item.reference ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.reference}>
          {t("reading.reference", { ref: item.reference })}
        </ThemedText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  play: {
    alignSelf: "flex-end",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  arabic: { writingDirection: "rtl", textAlign: "right" },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: Spacing.three },
  transliteration: { fontStyle: "italic" },
  translation: { marginTop: Spacing.two },
  note: {
    flexDirection: "row",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: 14,
    borderCurve: "continuous",
    marginTop: Spacing.three,
  },
  noteText: { flex: 1 },
  reference: { marginTop: Spacing.three },
});
