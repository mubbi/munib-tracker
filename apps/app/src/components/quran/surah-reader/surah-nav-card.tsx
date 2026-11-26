import { SymbolView } from "expo-symbols";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NumberField } from "@/components/ui/number-field";
import { PressableScale } from "@/components/ui/pressable-scale";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Control, IconSize, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getSurahByNumber } from "@/lib/quran";
import { wholeSurah } from "@/lib/recite-along/passages";
import { useChevronBackward, useChevronForward } from "@/lib/rtl";
import { TOTAL_SURAHS } from "./constants";

/**
 * Previous / next surah navigation.
 *
 * - `pane` (default): the desktop / wide-tablet side pane: previous / next
 *   surah, jump to an ayah, and a play–pause control (web keys: ←/→, Space).
 * - `footer`: the end of the ayah list on phones, narrow web and TV (G-02), so
 *   a reader who finishes a surah can continue straight to the next one.
 */
export function SurahNavCard({
  surahNumber,
  ayahCount,
  audioActive = false,
  audioPlaying = false,
  onGoToSurah,
  onJumpToAyah,
  onPlayPause,
  variant = "pane",
}: {
  surahNumber: number;
  ayahCount: number;
  audioActive?: boolean;
  audioPlaying?: boolean;
  onGoToSurah: (n: number) => void;
  onJumpToAyah?: (ayah: number) => void;
  onPlayPause?: () => void;
  variant?: "pane" | "footer";
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const backwardIcon = useChevronBackward();
  const forwardIcon = useChevronForward();
  const [ayahValue, setAyahValue] = useState<number | undefined>(undefined);
  const [invalid, setInvalid] = useState(false);
  const prev = surahNumber > 1 ? getSurahByNumber(surahNumber - 1) : undefined;
  const next = surahNumber < TOTAL_SURAHS ? getSurahByNumber(surahNumber + 1) : undefined;
  const recitePassage = wholeSurah(surahNumber);
  const footer = variant === "footer";

  const submit = () => {
    const n = ayahValue;
    if (n == null || !Number.isFinite(n) || n < 1 || n > ayahCount) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setAyahValue(undefined);
    onJumpToAyah?.(n);
  };

  const playLabel = audioActive
    ? audioPlaying
      ? t("quran.actionPause")
      : t("quran.actionPlay")
    : t("quran.playSurah");

  const stepButton = (target: typeof prev, direction: "prev" | "next"): ReactNode => {
    const label = direction === "prev" ? t("common.previous") : t("common.next");
    const disabled = !target;
    // The footer drops the missing side (Al-Fatihah has no previous surah, An-Nas no next).
    if (footer && disabled) return null;
    return (
      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={
          target
            ? t("quran.reader.surahNavA11y", {
                direction: label,
                name: target.nameTransliteration,
                number: target.number,
              })
            : label
        }
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
          <SymbolView name={backwardIcon} size={IconSize.sm} tintColor={colors.mutedForeground} />
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
          <SymbolView name={forwardIcon} size={IconSize.sm} tintColor={colors.mutedForeground} />
        ) : null}
      </PressableScale>
    );
  };

  if (footer) {
    return (
      <View
        testID="surah-nav-footer"
        accessibilityRole="toolbar"
        accessibilityLabel={t("quran.reader.surahNavTitle")}
        style={styles.footer}
      >
        <View style={styles.navStepsRow}>
          {stepButton(prev, "prev")}
          {stepButton(next, "next")}
        </View>
      </View>
    );
  }

  return (
    <Card style={styles.navCard}>
      <View style={styles.navStepsRow}>
        {stepButton(prev, "prev")}
        {stepButton(next, "next")}
      </View>

      {onJumpToAyah ? (
        // "Go" sits inside the field (trailing edge), so it always lines up with
        // the input — whatever the label above or an error message below.
        <NumberField
          label={t("quran.goToAyahA11y")}
          value={ayahValue}
          onChangeValue={(value) => {
            setAyahValue(value);
            if (invalid) setInvalid(false);
          }}
          onSubmitEditing={submit}
          returnKeyType="go"
          maxFractionDigits={0}
          placeholder={t("quran.goToAyahPlaceholder", { max: ayahCount })}
          error={invalid ? t("quran.goToAyahInvalid", { max: ayahCount }) : undefined}
          trailing={
            <Button
              label={t("quran.goToPageAction")}
              variant="secondary"
              size="sm"
              onPress={submit}
              style={styles.navJumpGo}
            />
          }
        />
      ) : null}

      {/* Play + Recite along are the same Button size, so the pair lines up. */}
      {onPlayPause ? (
        <Button
          label={playLabel}
          icon={audioPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
          haptic="light"
          fullWidth
          onPress={onPlayPause}
        />
      ) : null}
      {/* Recite along with the whole surah (D68); long surahs ask whole or ten ayahs. */}
      {recitePassage ? <ReciteAlongButton passage={recitePassage} fullWidth /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  navCard: { gap: Spacing.three },
  navStepsRow: { flexDirection: "row", gap: Spacing.two },
  footer: { marginTop: Spacing.four },
  navStep: {
    flex: 1,
    minWidth: 0,
    minHeight: Control.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.twoHalf,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  navStepNext: { justifyContent: "flex-end" },
  navStepCopy: { flex: 1, minWidth: 0, gap: Spacing.half },
  navStepCopyNext: { alignItems: "flex-end" },
  // Hug the field's trailing padding so the pill sits snugly inside the input row.
  navJumpGo: { marginEnd: -Spacing.one },
});
