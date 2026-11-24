import type { TajweedWordRef } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getSurahByNumber } from "@/lib/quran-meta";
import { useIsRTL } from "@/lib/rtl";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";

import { useCoachingWords, wordRefKey } from "./use-coaching-words";

/**
 * Example words from the person's own ayahs (NF-3.15). Each chip shows the
 * Uthmani word from the corpus (by reference) and plays the reciter's word
 * audio. Nothing here records or judges the person.
 */
export function ExampleWords({ refs }: { refs: readonly TajweedWordRef[] }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const audio = useAudioPlayerContext();
  const { words, loading } = useCoachingWords(refs);
  const rtl = useIsRTL();

  if (!refs.length) return null;
  if (!words.size) {
    return (
      <ThemedText type="caption" themeColor="mutedForeground">
        {loading ? t("tajweedCoaching.words.loading") : t("tajweedCoaching.words.unavailable")}
      </ThemedText>
    );
  }

  return (
    <View style={[styles.row, { flexDirection: rtl ? "row" : "row-reverse" }]}>
      {refs.map((ref) => {
        const word = words.get(wordRefKey(ref));
        if (!word) return null;
        const surahName = getSurahByNumber(ref.surah)?.nameTransliteration ?? String(ref.surah);
        const label = t("tajweedCoaching.words.a11y", {
          surah: surahName,
          ayah: ref.ayah,
          word: ref.wordIndex + 1,
        });
        const uri = word.audioUrl;
        return (
          <PressableScale
            key={wordRefKey(ref)}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityHint={
              uri ? t("tajweedCoaching.words.playHint") : t("tajweedCoaching.words.noAudio")
            }
            disabled={!uri}
            onPress={() => {
              if (!uri) return;
              audio.play(
                [
                  {
                    id: `tajweed-word:${wordRefKey(ref)}`,
                    title: surahName,
                    subtitle: t("tajweedCoaching.words.trackSubtitle", {
                      ayah: ref.ayah,
                      word: ref.wordIndex + 1,
                    }),
                    uri,
                  },
                ],
                0,
              );
            }}
            style={[
              styles.chip,
              { backgroundColor: tokens.accentSoft, borderColor: colors.border },
            ]}
          >
            <ThemedText type="arabic" style={styles.arabic}>
              {word.arabic}
            </ThemedText>
            <View style={styles.meta}>
              {uri ? (
                // Playable affordance (the chip plays the reciter's word audio).
                <SymbolView
                  name={{ ios: "speaker.wave.2", android: "volume_up", web: "volume_up" }}
                  size={12}
                  tintColor={colors.mutedForeground}
                />
              ) : null}
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("tajweedCoaching.words.ref", { surah: ref.surah, ayah: ref.ayah })}
              </ThemedText>
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.two },
  chip: {
    alignItems: "center",
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minHeight: 44,
  },
  meta: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  arabic: { fontSize: 24, lineHeight: 40, textAlign: "center", writingDirection: "rtl" },
});
