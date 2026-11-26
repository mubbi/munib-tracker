import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { getTtsVoices, type TtsVoice } from "@/lib/tts";

/** One row per voice id — some platforms list a voice twice (duplicate React keys). */
function dedupeVoices(voices: TtsVoice[]): TtsVoice[] {
  const seen = new Set<string>();
  return voices.filter((voice) => {
    if (!voice.identifier || seen.has(voice.identifier)) return false;
    seen.add(voice.identifier);
    return true;
  });
}

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
      try {
        const filtered = await getTtsVoices(lang);
        if (cancelled) return;
        if (filtered.length > 0) {
          setVoices(dedupeVoices(filtered));
          return;
        }
        // Web often has no `ar` voice installed — fall back to every installed
        // voice so the sheet matches learn listen instead of an empty state.
        const all = await getTtsVoices();
        if (!cancelled) setVoices(dedupeVoices(all));
      } catch {
        if (!cancelled) setVoices([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visible, lang]);

  const tv = isTV();
  const selectedBorder = tv ? tokens.accentBorder : colors.accent;

  const pick = (voiceId: string | undefined) => {
    // Close first, so playback (and the mini-player mounting) starts while this
    // modal animates out — not while it is still presented.
    onClose();
    onSelectVoice(voiceId);
  };

  return (
    <Sheet
      title={t("reading.listenVoiceTitle")}
      visible={visible}
      onClose={onClose}
      variant="bottom"
    >
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("reading.listenVoiceHint")}
      </ThemedText>

      {voices === null ? (
        <SkeletonPlaceholder
          preset="rows"
          count={3}
          accessibilityLabel={t("reading.listenVoiceTitle")}
        />
      ) : voices.length === 0 ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.empty}>
          {t("reading.listenVoiceEmpty")}
        </ThemedText>
      ) : (
        <View style={styles.voiceList} accessibilityRole="radiogroup">
          <PressableScale
            haptic="selection"
            accessibilityRole="radio"
            accessibilityState={{ checked: !selectedVoiceId }}
            {...(tv && !selectedVoiceId ? { hasTVPreferredFocus: true } : {})}
            onPress={() => pick(undefined)}
            style={[
              styles.voiceRow,
              {
                backgroundColor: !selectedVoiceId ? tokens.accentSoft : colors.muted,
                // TV: selected = soft fill + hairline; the accent ring is D-pad focus.
                borderColor: !selectedVoiceId ? selectedBorder : "transparent",
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
                accessibilityState={{ checked: selected }}
                {...(tv && selected ? { hasTVPreferredFocus: true } : {})}
                onPress={() => pick(voice.identifier)}
                style={[
                  styles.voiceRow,
                  {
                    backgroundColor: selected ? tokens.accentSoft : colors.muted,
                    borderColor: selected ? selectedBorder : "transparent",
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
    marginBottom: Spacing.three,
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
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
});
