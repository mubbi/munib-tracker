import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getTtsVoices, type TtsVoice } from "@/lib/tts";

export type TtsVoiceSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** BCP-47 (or primary) language tag used to filter installed voices. */
  lang: string;
  /** Currently preferred voice id for this language, if any. */
  selectedVoiceId?: string;
  /**
   * Called when the user picks a voice (or the system default). The sheet
   * closes after this; the caller should persist the preference and start TTS.
   */
  onSelectVoice: (voiceId: string | undefined) => void;
};

/**
 * Bottom sheet that lists installed TTS voices for a language.
 * Selecting a row confirms the choice and dismisses — used before play in
 * learn listen and custom-adhkar TTS.
 */
export function TtsVoiceSheet({
  visible,
  onClose,
  lang,
  selectedVoiceId,
  onSelectVoice,
}: TtsVoiceSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [voices, setVoices] = useState<TtsVoice[] | null>(null);

  useEffect(() => {
    if (!visible) {
      setVoices(null);
      return;
    }
    let cancelled = false;
    setVoices(null);
    void (async () => {
      const filtered = await getTtsVoices(lang);
      if (cancelled) return;
      if (filtered.length > 0) {
        setVoices(filtered);
        return;
      }
      // Web often has no `ar` voice installed — fall back to every installed
      // voice so the sheet matches learn listen instead of an empty state.
      const all = await getTtsVoices();
      if (!cancelled) setVoices(all);
    })();
    return () => {
      cancelled = true;
    };
  }, [visible, lang]);

  const pick = (voiceId: string | undefined) => {
    onSelectVoice(voiceId);
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom">
      <ThemedText type="subtitle">{t("reading.listenVoiceTitle")}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("reading.listenVoiceHint")}
      </ThemedText>

      {voices === null ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : voices.length === 0 ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.empty}>
          {t("reading.listenVoiceEmpty")}
        </ThemedText>
      ) : (
        <View style={styles.voiceList}>
          <PressableScale
            haptic="selection"
            accessibilityRole="radio"
            accessibilityState={{ selected: !selectedVoiceId }}
            onPress={() => pick(undefined)}
            style={[
              styles.voiceRow,
              {
                backgroundColor: !selectedVoiceId ? tokens.accentSoft : colors.muted,
                borderColor: !selectedVoiceId ? colors.accent : "transparent",
              },
            ]}
          >
            <ThemedText type="smallBold">{t("reading.listenVoiceDefault")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("reading.listenVoiceDefaultHint")}
            </ThemedText>
          </PressableScale>
          {voices.map((voice) => {
            const selected = selectedVoiceId === voice.identifier;
            return (
              <PressableScale
                key={voice.identifier}
                haptic="selection"
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => pick(voice.identifier)}
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
    </Sheet>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: Spacing.one,
    marginBottom: Spacing.three,
  },
  loading: {
    paddingVertical: Spacing.four,
    alignItems: "center",
  },
  empty: {
    marginTop: Spacing.two,
  },
  voiceList: {
    gap: Spacing.two,
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
