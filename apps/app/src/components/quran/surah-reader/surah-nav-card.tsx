import { SymbolView } from "expo-symbols";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getSurahByNumber } from "@/lib/quran";
import { wholeSurah } from "@/lib/recite-along/passages";
import { useChevronBackward, useChevronForward } from "@/lib/rtl";
import { TOTAL_SURAHS } from "./constants";
import { readerControlStyles } from "./reader-control-styles";

/**
 * Desktop / wide-tablet side pane: previous / next surah, jump to an ayah, and
 * a play–pause control for this surah (keyboard: ←/→ and Space on web).
 */
export function SurahNavCard({
  surahNumber,
  ayahCount,
  audioActive,
  audioPlaying,
  onGoToSurah,
  onJumpToAyah,
  onPlayPause,
}: {
  surahNumber: number;
  ayahCount: number;
  audioActive: boolean;
  audioPlaying: boolean;
  onGoToSurah: (n: number) => void;
  onJumpToAyah: (ayah: number) => void;
  onPlayPause: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const backwardIcon = useChevronBackward();
  const forwardIcon = useChevronForward();
  const [ayahInput, setAyahInput] = useState("");
  const [invalid, setInvalid] = useState(false);
  const prev = surahNumber > 1 ? getSurahByNumber(surahNumber - 1) : undefined;
  const next = surahNumber < TOTAL_SURAHS ? getSurahByNumber(surahNumber + 1) : undefined;
  const recitePassage = wholeSurah(surahNumber);

  const submit = () => {
    const n = Number.parseInt(ayahInput, 10);
    if (!Number.isFinite(n) || n < 1 || n > ayahCount) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setAyahInput("");
    onJumpToAyah(n);
  };

  const playLabel = audioActive
    ? audioPlaying
      ? t("quran.actionPause")
      : t("quran.actionPlay")
    : t("quran.playSurah");

  const stepButton = (target: typeof prev, direction: "prev" | "next"): ReactNode => {
    const label = direction === "prev" ? t("common.previous") : t("common.next");
    const disabled = !target;
    return (
      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={target ? `${label}: ${target.nameTransliteration}` : label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => target && onGoToSurah(target.number)}
        scaleTo={0.97}
        style={[
          styles.navStep,
          direction === "next" && styles.navStepNext,
          { backgroundColor: colors.muted, opacity: disabled ? 0.45 : 1 },
        ]}
      >
        {direction === "prev" ? (
          <SymbolView name={backwardIcon} size={14} tintColor={colors.mutedForeground} />
        ) : null}
        <View style={[styles.navStepCopy, direction === "next" && styles.navStepCopyNext]}>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {label}
          </ThemedText>
          <ThemedText type="smallBold" numberOfLines={1}>
            {target ? target.nameTransliteration : "—"}
          </ThemedText>
        </View>
        {direction === "next" ? (
          <SymbolView name={forwardIcon} size={14} tintColor={colors.mutedForeground} />
        ) : null}
      </PressableScale>
    );
  };

  return (
    <Card padding="three" style={styles.navCard}>
      <View style={styles.navStepsRow}>
        {stepButton(prev, "prev")}
        {stepButton(next, "next")}
      </View>

      <View style={styles.navJumpRow}>
        <TextInput
          value={ayahInput}
          onChangeText={(text) => {
            setAyahInput(text.replace(/[^0-9]/g, ""));
            if (invalid) setInvalid(false);
          }}
          onSubmitEditing={submit}
          keyboardType="number-pad"
          inputMode="numeric"
          returnKeyType="go"
          maxLength={3}
          placeholder={t("quran.goToAyahPlaceholder", { max: ayahCount })}
          placeholderTextColor={colors.mutedForeground}
          accessibilityLabel={t("quran.goToAyahA11y")}
          style={[
            styles.navJumpInput,
            {
              color: colors.foreground,
              backgroundColor: colors.input,
              borderColor: invalid ? tokens.status.danger.color : colors.inputBorder,
              borderWidth: 1,
            },
          ]}
        />
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("quran.goToAyahA11y")}
          onPress={submit}
          scaleTo={0.97}
          style={[styles.navJumpGo, { backgroundColor: tokens.accentSoft }]}
        >
          <ThemedText type="smallBold" style={{ color: colors.accentText }}>
            {t("quran.goToPageAction")}
          </ThemedText>
        </PressableScale>
      </View>
      {invalid ? (
        <ThemedText type="caption" style={{ color: tokens.status.danger.text }}>
          {t("quran.goToAyahInvalid", { max: ayahCount })}
        </ThemedText>
      ) : null}

      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={playLabel}
        onPress={onPlayPause}
        style={[readerControlStyles.playSurah, styles.navPlay, { backgroundColor: colors.accent }]}
      >
        <SymbolView
          name={audioPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
          size={20}
          tintColor={colors.accentForeground}
        />
        <ThemedText type="smallBold" style={{ color: colors.accentForeground }}>
          {playLabel}
        </ThemedText>
      </PressableScale>
      {/* Recite along with the whole surah (D68); long surahs ask whole or ten ayahs. */}
      {recitePassage ? <ReciteAlongButton passage={recitePassage} fullWidth /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  navCard: { gap: Spacing.three },
  navStepsRow: { flexDirection: "row", gap: Spacing.two },
  navStep: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two + 2,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  navStepNext: { justifyContent: "flex-end" },
  navStepCopy: { flex: 1, minWidth: 0, gap: 2 },
  navStepCopyNext: { alignItems: "flex-end" },
  navJumpRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  navJumpInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 15,
  },
  navJumpGo: {
    minHeight: 38,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  navPlay: { marginTop: 0 },
});
