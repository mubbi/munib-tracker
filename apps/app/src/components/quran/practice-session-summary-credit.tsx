import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { ReadingCreditResult } from "@/lib/quran-companion/reading-credit";
import { useChevronForward } from "@/lib/rtl";

/**
 * D68 summary line: "Added 7 ayahs to today's reading" (+ the khatm percentage
 * when a personal plan moved). D72: an ayah counts toward khatm once per cycle,
 * so the khatm line says "already counted" when every heard ayah was, and the
 * khatm line alone shows when only khatm moved (today's log already had the
 * ayahs). Renders nothing when the setting is off or nothing was added. With
 * `onOpen` the line opens the khatm screen.
 */
export function PracticeReadingCreditLine({
  credit,
  onOpen,
}: {
  credit: ReadingCreditResult | null;
  onOpen?: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevron = useChevronForward();
  const khatm = credit?.khatm ?? null;
  const khatmMoved = khatm != null && khatm.added > 0;
  if (!credit || (credit.ayahs <= 0 && !khatmMoved)) return null;

  const tone = tokens.status.success;
  const khatmText = khatm
    ? khatm.alreadyCounted
      ? t("practiceReadingCredit.khatmAlready", { percent: khatm.percent })
      : t("practiceReadingCredit.khatm", { percent: khatm.percent })
    : null;
  // Only khatm moved: its line leads, with no "added to today's reading".
  const line =
    credit.ayahs > 0
      ? t("practiceReadingCredit.added", { count: credit.ayahs })
      : (khatmText ?? "");
  const khatmLine = credit.ayahs > 0 ? khatmText : null;

  const body = (
    <>
      <SymbolView
        name={{ ios: "book.fill", android: "auto_stories", web: "auto_stories" }}
        size={18}
        tintColor={tone.color}
      />
      <View style={styles.flex}>
        <ThemedText type="smallBold">{line}</ThemedText>
        {khatmLine ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {khatmLine}
          </ThemedText>
        ) : null}
      </View>
      {onOpen ? <SymbolView name={chevron} size={14} tintColor={colors.mutedForeground} /> : null}
    </>
  );

  const style = [styles.row, { backgroundColor: tone.soft, borderColor: tone.border }];
  if (!onOpen) {
    return (
      <View style={style} accessible accessibilityRole="text">
        {body}
      </View>
    );
  }
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={khatmLine ? `${line}. ${khatmLine}` : line}
      accessibilityHint={t("practiceReadingCredit.openHint")}
      onPress={onOpen}
      style={style}
    >
      {body}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0, gap: Spacing.half },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
  },
});
