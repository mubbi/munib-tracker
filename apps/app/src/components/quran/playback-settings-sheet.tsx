import type { QuranRepeatMode, QuranTranslationAudio } from "@munib-tracker/shared/types";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getTtsVoices, type TtsVoice } from "@/lib/tts";

export type PlaybackSettingsSheetProps = {
  visible: boolean;
  onClose: () => void;
  ayahCount: number;
  repeatMode: QuranRepeatMode;
  repeatRange: { start: number; end: number };
  translationAudio: QuranTranslationAudio;
  ttsLang: string;
  ttsVoiceId?: string;
  onRepeatModeChange: (mode: QuranRepeatMode) => void;
  onRepeatRangeChange: (range: { start: number; end: number }) => void;
  onTranslationAudioChange: (mode: QuranTranslationAudio) => void;
  onTtsVoiceChange: (voiceId: string | undefined) => void;
};

/**
 * Ayah-study playback sheet: repeat mode, translation TTS, and voice picker.
 */
export function PlaybackSettingsSheet({
  visible,
  onClose,
  ayahCount,
  repeatMode,
  repeatRange,
  translationAudio,
  ttsLang,
  ttsVoiceId,
  onRepeatModeChange,
  onRepeatRangeChange,
  onTranslationAudioChange,
  onTtsVoiceChange,
}: PlaybackSettingsSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [voices, setVoices] = useState<TtsVoice[]>([]);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    void getTtsVoices(ttsLang).then((list) => {
      if (!cancelled) setVoices(list);
    });
    return () => {
      cancelled = true;
    };
  }, [visible, ttsLang]);

  const repeatOptions = useMemo(
    () =>
      [
        { id: "off" as const, label: t("quran.playback.repeatOff") },
        { id: "verse" as const, label: t("quran.playback.repeatVerse") },
        { id: "range" as const, label: t("quran.playback.repeatRange") },
        { id: "surah" as const, label: t("quran.playback.repeatSurah") },
      ] satisfies Array<{ id: QuranRepeatMode; label: string }>,
    [t],
  );

  const translationOptions = useMemo(
    () =>
      [
        { id: "off" as const, label: t("quran.playback.translationOff") },
        { id: "after" as const, label: t("quran.playback.translationAfter") },
      ] satisfies Array<{ id: QuranTranslationAudio; label: string }>,
    [t],
  );

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom">
      <ThemedText type="subtitle">{t("quran.playback.title")}</ThemedText>

      <View style={styles.section}>
        <ThemedText type="caption" style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          {t("quran.playback.repeatMode")}
        </ThemedText>
        <SegmentedControl
          options={repeatOptions}
          value={repeatMode}
          onChange={onRepeatModeChange}
        />
        {repeatMode === "range" ? (
          <View style={styles.rangeRow}>
            <RangeField
              label={t("quran.playback.rangeStart")}
              value={repeatRange.start}
              max={ayahCount}
              onChange={(start) =>
                onRepeatRangeChange({
                  start: Math.min(start, repeatRange.end),
                  end: Math.max(start, repeatRange.end),
                })
              }
            />
            <RangeField
              label={t("quran.playback.rangeEnd")}
              value={repeatRange.end}
              max={ayahCount}
              onChange={(end) =>
                onRepeatRangeChange({
                  start: Math.min(repeatRange.start, end),
                  end: Math.max(repeatRange.start, end),
                })
              }
            />
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <ThemedText type="caption" style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          {t("quran.playback.translationAudio")}
        </ThemedText>
        <SegmentedControl
          options={translationOptions}
          value={translationAudio}
          onChange={onTranslationAudioChange}
        />
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quran.playback.translationAudioHint")}
        </ThemedText>
      </View>

      {translationAudio === "after" ? (
        <View style={styles.section}>
          <ThemedText
            type="caption"
            style={[styles.sectionLabel, { color: colors.mutedForeground }]}
          >
            {t("quran.playback.ttsVoice")}
          </ThemedText>
          {voices.length === 0 ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("quran.playback.ttsVoiceEmpty")}
            </ThemedText>
          ) : (
            <View style={styles.voiceList}>
              <PressableScale
                haptic="selection"
                accessibilityRole="radio"
                accessibilityState={{ selected: !ttsVoiceId }}
                onPress={() => onTtsVoiceChange(undefined)}
                style={[
                  styles.voiceRow,
                  {
                    backgroundColor: !ttsVoiceId ? tokens.accentSoft : colors.muted,
                    borderColor: !ttsVoiceId ? colors.accent : "transparent",
                  },
                ]}
              >
                <ThemedText type="smallBold">{t("quran.playback.ttsVoiceDefault")}</ThemedText>
              </PressableScale>
              {voices.map((voice) => {
                const selected = ttsVoiceId === voice.identifier;
                return (
                  <PressableScale
                    key={voice.identifier}
                    haptic="selection"
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => onTtsVoiceChange(voice.identifier)}
                    style={[
                      styles.voiceRow,
                      {
                        backgroundColor: selected ? tokens.accentSoft : colors.muted,
                        borderColor: selected ? colors.accent : "transparent",
                      },
                    ]}
                  >
                    <ThemedText type="smallBold" numberOfLines={1}>
                      {voice.name}
                    </ThemedText>
                    <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                      {voice.language}
                    </ThemedText>
                  </PressableScale>
                );
              })}
            </View>
          )}
        </View>
      ) : null}
    </Sheet>
  );
}

function RangeField({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <View style={styles.rangeField}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {label}
      </ThemedText>
      <TextInput
        accessibilityLabel={label}
        keyboardType="number-pad"
        value={String(value)}
        onChangeText={(text) => {
          const parsed = Number.parseInt(text.replace(/\D/g, ""), 10);
          if (!Number.isFinite(parsed)) return;
          onChange(Math.max(1, Math.min(max, parsed)));
        }}
        style={[
          styles.rangeInput,
          {
            color: colors.foreground,
            backgroundColor: colors.muted,
            borderColor: tokens.hairline,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  sectionLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  rangeRow: {
    flexDirection: "row",
    gap: Spacing.three,
  },
  rangeField: {
    flex: 1,
    gap: Spacing.one,
  },
  rangeInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  voiceList: {
    gap: Spacing.two,
    maxHeight: 220,
  },
  voiceRow: {
    gap: Spacing.half,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
});
