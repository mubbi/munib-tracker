import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { TtsVoiceSheet } from "@/components/tts-voice-sheet";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { APP_LOCALES } from "@/lib/locale-display";
import { setTtsVoice, useTtsVoices } from "@/lib/settings/tts-voice";
import { useSetting } from "@/lib/settings/use-setting";
import { speak, stopTts } from "@/lib/tts";
import { usePreferences } from "@/stores/preferences-store";

import { SettingsRow } from "../settings-rows";
import { ThisDeviceBadge } from "../this-device-badge";

/**
 * Device voice per language (`ttsVoiceByLang`, a device preference — B4), used
 * by every Listen button. One row per language the user reads in (translation +
 * app language), each with a "Test voice" button that speaks a short sample in
 * that language with the chosen voice.
 */
export function DeviceVoiceControl({ settingId }: { settingId: string }) {
  const { t, i18n } = useTranslation();
  const prefs = usePreferences();
  const { def } = useSetting<number>(settingId);
  const [lang, setLang] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const langs = [...new Set([prefs.translationLocale, prefs.locale])];
  const voices = useTtsVoices();

  useEffect(
    () => () => {
      void stopTts();
    },
    [],
  );

  const select = (code: string, voiceId: string | undefined) => {
    void setTtsVoice(code, voiceId);
  };

  const testVoice = (code: string) => {
    if (testing === code) {
      void stopTts();
      setTesting(null);
      return;
    }
    setTesting(code);
    const sample = i18n.t("settingsStep4.voice.sample", { lng: code });
    void speak(sample, {
      lang: code,
      voice: voices[code],
      onDone: () => setTesting((current) => (current === code ? null : current)),
      onError: () => setTesting((current) => (current === code ? null : current)),
    });
  };

  return (
    <View style={styles.block}>
      <View style={styles.titleLine}>
        <ThemedText type="small">{t(def.titleKey)}</ThemedText>
        <ThisDeviceBadge />
      </View>
      {def.subtitleKey ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t(def.subtitleKey)}
        </ThemedText>
      ) : null}
      {langs.map((code) => {
        const name = APP_LOCALES.find((l) => l.code === code)?.name ?? code;
        return (
          <View key={code} style={styles.langRow}>
            <SettingsRow
              icon={{ ios: "waveform", android: "record_voice_over", web: "record_voice_over" }}
              title={name}
              value={
                voices[code] ? t("settingsPanel.voiceChosen") : t("quran.playback.ttsVoiceDefault")
              }
              onPress={() => setLang(code)}
            />
            <Button
              label={
                testing === code ? t("settingsStep4.voice.stop") : t("settingsStep4.voice.test")
              }
              accessibilityHint={t("settingsStep4.voice.testA11y", { language: name })}
              variant="ghost"
              size="sm"
              onPress={() => testVoice(code)}
            />
          </View>
        );
      })}
      {lang ? (
        <TtsVoiceSheet
          visible
          lang={lang}
          selectedVoiceId={voices[lang]}
          onSelectVoice={(voiceId) => select(lang, voiceId)}
          onClose={() => setLang(null)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
  titleLine: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: Spacing.two },
  langRow: { gap: Spacing.one },
});
