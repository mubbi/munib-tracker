import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SelectTrigger } from "@/components/quran/option-picker-sheet";
import type { ReaderEditionSheet } from "@/components/quran/reader-edition-sheets";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { ReadingFontControls } from "@/components/reading-font-controls";
import { MoreInSettingsLink } from "@/components/settings/more-in-settings-link";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { wholeSurah } from "@/lib/recite-along/passages";
import { updateQuranPrefs } from "@/lib/settings/quran-shortcuts";
import { readerControlStyles } from "./reader-control-styles";
import { CONTROL_ICONS, ControlLabel, PlaySurahButton, PrefToggle } from "./reading-controls";

/**
 * The surah reader's reading controls (layout / reciter / editions / display
 * toggles / playback / text size). Rides in the list header on narrow screens
 * and in the sticky side pane on list–detail. Every option is a shortcut to
 * Settings › Qur'an (one write path, §4.5.2).
 */
export function ReaderFiltersCard({
  reciterName,
  translationName,
  secondTranslationName,
  tafsirName,
  translationLoading,
  usingFallback,
  showTransliteration,
  showTranslation,
  showWordByWord,
  showTajweed,
  studyExtrasLoading,
  playbackLabel,
  playbackActive,
  onToggleTransliteration,
  onToggleTranslation,
  onOpenLayout,
  onOpenReciter,
  onOpenEdition,
  onOpenPlayback,
  onPlaySurah,
  reciteSurah,
}: {
  reciterName: string;
  translationName: string;
  secondTranslationName: string;
  tafsirName: string;
  translationLoading: boolean;
  /** Remote edition unavailable — showing the bundled fallback. */
  usingFallback: boolean;
  showTransliteration: boolean;
  showTranslation: boolean;
  showWordByWord: boolean;
  showTajweed: boolean;
  studyExtrasLoading: boolean;
  playbackLabel: string;
  playbackActive: boolean;
  onToggleTransliteration: () => unknown;
  onToggleTranslation: () => unknown;
  onOpenLayout: () => void;
  onOpenReciter: () => void;
  onOpenEdition: (sheet: ReaderEditionSheet) => void;
  onOpenPlayback: () => void;
  /** Omit to hide "Play surah" (the side pane's nav card owns play / pause). */
  onPlaySurah?: () => void;
  /** Surah to offer "Recite along" for (whole surah; long ones are sectioned). Omit to hide. */
  reciteSurah?: number;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const tv = isTV();
  const recitePassage = reciteSurah != null ? wholeSurah(reciteSurah) : null;
  return (
    <Card padding="three">
      <View style={readerControlStyles.controlRow}>
        <ControlLabel icon={CONTROL_ICONS.layout} label={t("quran.readerLayout")} />
        <SelectTrigger
          label={t("quran.layoutAyah")}
          accessibilityLabel={t("quran.readerLayout")}
          onPress={onOpenLayout}
        />
      </View>

      <View style={[readerControlStyles.controlRow, styles.translationRow]}>
        <ControlLabel icon={CONTROL_ICONS.reciter} label={t("quran.reciter")} />
        <SelectTrigger
          label={reciterName}
          accessibilityLabel={t("quran.reciter")}
          onPress={onOpenReciter}
        />
      </View>

      <View style={[readerControlStyles.controlRow, styles.translationRow]}>
        <ControlLabel icon={CONTROL_ICONS.translation} label={t("quran.translation")} />
        <SelectTrigger
          label={translationName}
          accessibilityLabel={t("quran.translation")}
          onPress={() => onOpenEdition("translation")}
        />
      </View>

      <View style={[readerControlStyles.controlRow, styles.translationRow]}>
        <ControlLabel icon={CONTROL_ICONS.secondTranslation} label={t("quran.secondTranslation")} />
        <SelectTrigger
          label={secondTranslationName}
          accessibilityLabel={t("quran.secondTranslation")}
          onPress={() => onOpenEdition("secondary")}
        />
      </View>

      <View style={[readerControlStyles.controlRow, styles.translationRow]}>
        <ControlLabel icon={CONTROL_ICONS.tafsir} label={t("quran.tafsir")} />
        <SelectTrigger
          label={tafsirName}
          accessibilityLabel={t("quran.tafsir")}
          onPress={() => onOpenEdition("tafsir")}
        />
      </View>
      {translationLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.accent} />
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("quran.loadingTranslation")}
          </ThemedText>
        </View>
      ) : usingFallback ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.offlineNote}>
          {t("quran.offlineTranslation")}
        </ThemedText>
      ) : null}

      <PrefToggle
        icon={CONTROL_ICONS.showTransliteration}
        label={t("quran.showTransliteration")}
        enabled={showTransliteration}
        onToggle={() => void onToggleTransliteration()}
      />
      <PrefToggle
        icon={CONTROL_ICONS.showTranslation}
        label={t("quran.showTranslation")}
        enabled={showTranslation}
        onToggle={() => void onToggleTranslation()}
      />
      <PrefToggle
        icon={CONTROL_ICONS.wordByWord}
        label={t("quran.showWordByWord")}
        enabled={showWordByWord}
        onToggle={() => updateQuranPrefs({ showWordByWord: !showWordByWord })}
      />
      <PrefToggle
        icon={CONTROL_ICONS.tajweed}
        label={t("quran.showTajweed")}
        enabled={showTajweed}
        onToggle={() => updateQuranPrefs({ showTajweed: !showTajweed })}
      />
      {studyExtrasLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.accent} />
          <ThemedText type="caption" themeColor="mutedForeground">
            {showWordByWord && showTajweed
              ? `${t("quran.wordByWord.loading")} / ${t("quran.tajweed.loading")}`
              : showTajweed
                ? t("quran.tajweed.loading")
                : t("quran.wordByWord.loading")}
          </ThemedText>
        </View>
      ) : null}

      <View style={[readerControlStyles.controlRow, styles.translationRow]}>
        <ControlLabel icon={CONTROL_ICONS.playback} label={t("quran.playback.title")} />
        <SelectTrigger
          label={playbackLabel}
          accessibilityLabel={t("quran.playback.open")}
          active={playbackActive}
          onPress={onOpenPlayback}
        />
      </View>

      <View
        style={[
          readerControlStyles.controlRow,
          styles.translationRow,
          tv && styles.controlRowTv,
          tv && styles.controlRowStackTv,
        ]}
      >
        <ControlLabel icon={CONTROL_ICONS.textSize} label={t("reading.textSize")} />
        <View style={[readerControlStyles.controlValue, tv && styles.controlValueTv]}>
          <ReadingFontControls surface="quran" />
        </View>
      </View>

      {onPlaySurah ? <PlaySurahButton onPress={onPlaySurah} /> : null}
      {recitePassage ? (
        <ReciteAlongButton passage={recitePassage} fullWidth style={styles.recite} />
      ) : null}
      <MoreInSettingsLink settingId="quran.reader.layout" />
    </Card>
  );
}

const styles = StyleSheet.create({
  controlRowTv: {
    minHeight: TvLayout.minFocusTarget,
  },
  controlRowStackTv: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: Spacing.two,
  },
  controlValueTv: {
    width: "100%",
    justifyContent: "flex-start",
  },
  translationRow: { marginTop: Spacing.three },
  recite: { marginTop: Spacing.two },
  offlineNote: { marginTop: Spacing.two },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
