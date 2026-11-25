import { resolveIntlLocale } from "@munib-tracker/shared/i18n";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { PlaybackSettingsSheet } from "@/components/quran/playback-settings-sheet";
import { IconButton } from "@/components/ui/icon-button";
import { BorderWidth } from "@/constants/theme";
import { usePlaybackSummaryLabel } from "@/hooks/use-playback-summary-label";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getSurahByNumber } from "@/lib/quran-meta";
import { normalizeRepeatPlan, surahNumberFromSourceHref } from "@/lib/quran-repeat";
import { updateQuranPrefs as updatePrefs } from "@/lib/settings/quran-shortcuts";
import { setTtsVoice, useTtsVoice } from "@/lib/settings/tts-voice";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { usePreferences } from "@/stores/preferences-store";
import { useQuranPrefs } from "@/stores/quran-store";

const PLAYBACK_ICON = {
  ios: "slider.horizontal.3",
  android: "tune",
  web: "tune",
} as const;

type QuranPlaybackSettingsControlProps = {
  size?: number;
  wellRadius?: number;
};

/**
 * Mini-/expanded-player control that opens ayah-study playback settings when
 * the current queue is a Qur'an surah reader session.
 */
export function QuranPlaybackSettingsControl({
  size = 18,
  wellRadius = 20,
}: QuranPlaybackSettingsControlProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const audio = useAudioPlayerContext();
  const prefs = useQuranPrefs();
  const translationLocale = usePreferences().translationLocale;
  const [open, setOpen] = useState(false);

  const surahNumber = surahNumberFromSourceHref(audio.sourceHref);
  const ayahCount = useMemo(() => {
    if (surahNumber == null) return audio.queue.length || 1;
    return getSurahByNumber(surahNumber)?.ayahCount ?? (audio.queue.length || 1);
  }, [audio.queue.length, surahNumber]);

  const repeatPlan = useMemo(
    () => normalizeRepeatPlan(prefs.repeatMode, prefs.repeatRange, ayahCount),
    [ayahCount, prefs.repeatMode, prefs.repeatRange],
  );
  const translationAudio = prefs.translationAudio ?? "off";
  const { label, active } = usePlaybackSummaryLabel(repeatPlan, translationAudio);
  const ttsLang = resolveIntlLocale(translationLocale);
  const ttsVoiceId = useTtsVoice(ttsLang);

  if (surahNumber == null) return null;

  return (
    <>
      <IconButton
        name={PLAYBACK_ICON}
        size={size}
        tintColor={active ? colors.accent : colors.mutedForeground}
        accessibilityLabel={label}
        accessibilityHint={t("quran.playback.open")}
        accessibilityState={{ selected: active }}
        onPress={() => setOpen(true)}
        glass={!active}
        background={active ? tokens.accentSoft : undefined}
        wellRadius={wellRadius}
        style={active ? { borderWidth: BorderWidth.thick, borderColor: colors.accent } : undefined}
      />
      <PlaybackSettingsSheet
        visible={open}
        onClose={() => setOpen(false)}
        ayahCount={ayahCount}
        repeatMode={prefs.repeatMode ?? "off"}
        repeatRange={prefs.repeatRange ?? { start: 1, end: Math.max(1, ayahCount) }}
        translationAudio={translationAudio}
        ttsLang={ttsLang}
        ttsVoiceId={ttsVoiceId}
        onRepeatModeChange={(mode) => {
          void updatePrefs({ repeatMode: mode });
          audio.setRepeatPlan(normalizeRepeatPlan(mode, prefs.repeatRange, ayahCount));
        }}
        onRepeatRangeChange={(range) => {
          void updatePrefs({ repeatRange: range });
          audio.setRepeatPlan(normalizeRepeatPlan(prefs.repeatMode, range, ayahCount));
        }}
        onTranslationAudioChange={(mode) => {
          void updatePrefs({ translationAudio: mode });
          audio.setTranslationAudio(mode);
        }}
        onTtsVoiceChange={(voiceId) => void setTtsVoice(ttsLang, voiceId)}
      />
    </>
  );
}
