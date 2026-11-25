import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { arabicWordRowStyle } from "@/lib/quran-companion/arabic-row";
import { useIsRTL } from "@/lib/rtl";

/**
 * After an ayah: either a cheerful "well done" with Next, or a gentle "let's try
 * these words again" — the words as big chips (tap to hear the reciter), then
 * Listen / Try again. Amber, never red; no counts of mistakes.
 */
export function KidsAyahFeedback({
  words,
  tryAgain,
  isLast,
  onHearWord,
  onHear,
  onRetry,
  onNext,
  onFinish,
}: {
  words: readonly string[];
  tryAgain: readonly number[];
  isLast: boolean;
  onHearWord: (index: number) => void;
  onHear: () => void;
  onRetry: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const rtl = useIsRTL();

  if (!tryAgain.length) {
    return (
      <Card style={styles.card}>
        <ThemedText type="subtitle" style={styles.center}>
          {t("kids.recite.wellDone")}
        </ThemedText>
        {isLast ? null : (
          <Button label={t("kids.recite.nextAyah")} variant="primary" fullWidth onPress={onNext} />
        )}
      </Card>
    );
  }

  return (
    <Card
      style={[
        styles.card,
        { borderColor: tokens.status.warning.border, borderWidth: BorderWidth.hairline },
      ]}
    >
      <ThemedText type="subtitle" style={styles.center}>
        {t("kids.recite.tryWordsTitle")}
      </ThemedText>
      <ThemedText type="small" themeColor="mutedForeground" style={styles.center}>
        {t("kids.recite.tryWordsBody")}
      </ThemedText>
      <View style={[styles.chips, arabicWordRowStyle(rtl)]}>
        {tryAgain.map((i) => (
          <PressableScale
            key={`${i}:${words[i]}`}
            accessibilityRole="button"
            accessibilityLabel={t("kids.recite.hearWordA11y", { word: words[i] ?? "" })}
            onPress={() => onHearWord(i)}
            style={[styles.chip, { backgroundColor: tokens.status.warning.soft }]}
          >
            <ThemedText type="arabic" style={styles.chipText}>
              {words[i]}
            </ThemedText>
          </PressableScale>
        ))}
      </View>
      <View style={styles.buttons}>
        <Button
          label={t("kids.recite.listen")}
          variant="secondary"
          icon={{ ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" }}
          onPress={onHear}
        />
        <Button
          label={t("kids.recite.tryAgain")}
          variant="primary"
          icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
          onPress={onRetry}
        />
      </View>
      <Button
        label={isLast ? t("kids.recite.finish") : t("kids.recite.moveOn")}
        variant="ghost"
        size="sm"
        onPress={isLast ? onFinish : onNext}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three, alignItems: "stretch" },
  center: { textAlign: "center" },
  chips: {
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  chipText: { fontSize: 28, lineHeight: 50, writingDirection: "rtl" },
  buttons: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "center" },
});
