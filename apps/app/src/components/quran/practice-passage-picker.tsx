import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SearchField } from "@/components/ui/search-field";
import { Sheet } from "@/components/ui/sheet";
import { Stepper } from "@/components/ui/stepper";
import { Control, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { Passage } from "@/lib/quran-companion/types";
import { getSurahByNumber } from "@/lib/quran-meta";
import { searchSurahList } from "@/lib/search";

/**
 * Choose what to practise (surah → start ayah → end ayah). Opened from the hub's
 * passage row and from inside a session. Uses surah meta only — no ayah JSON.
 */
export function PracticePassagePicker({
  visible,
  initial,
  onClose,
  onSelect,
}: {
  visible: boolean;
  initial: Passage | null;
  onClose: () => void;
  onSelect: (passage: Passage) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [step, setStep] = useState<"surah" | "ayah">("ayah");
  const [query, setQuery] = useState("");
  const [surah, setSurah] = useState(initial?.surah ?? 1);
  const [from, setFrom] = useState(initial?.ayahStart ?? 1);
  const [to, setTo] = useState(initial?.ayahEnd ?? initial?.ayahStart ?? 1);

  // Reset to the current passage each time the sheet opens.
  useEffect(() => {
    if (!visible) return;
    setStep(initial ? "ayah" : "surah");
    setQuery("");
    setSurah(initial?.surah ?? 1);
    setFrom(initial?.ayahStart ?? 1);
    setTo(initial?.ayahEnd ?? initial?.ayahStart ?? 1);
  }, [initial, visible]);

  const meta = getSurahByNumber(surah);
  const count = meta?.ayahCount ?? 1;
  const surahs = useMemo(() => searchSurahList(query), [query]);
  const ayahNumbers = useMemo(() => Array.from({ length: count }, (_, i) => i + 1), [count]);

  const chooseSurah = (n: number) => {
    setSurah(n);
    setFrom(1);
    setTo(1);
    setStep("ayah");
  };

  const chooseFrom = (n: number) => {
    setFrom(n);
    setTo((prev) => (prev < n ? n : Math.min(prev, count)));
  };

  const name = meta?.nameTransliteration ?? String(surah);
  const label =
    from === to
      ? t("quranCompanion.passage.single", { surah: name, ayah: from })
      : t("quranCompanion.passage.range", { surah: name, from, to });

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      variant="bottom"
      solid
      title={t("quranCompanion.picker.title")}
    >
      <View style={styles.body}>
        {step === "surah" ? (
          <>
            <SearchField
              value={query}
              onChangeText={setQuery}
              placeholder={t("quranCompanion.picker.searchSurah")}
              accessibilityLabel={t("quranCompanion.picker.searchSurah")}
            />
            <View style={styles.list}>
              {surahs.map((s) => {
                const selected = s.number === surah;
                return (
                  <PressableScale
                    key={s.number}
                    haptic="selection"
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${s.number}. ${s.nameTransliteration}, ${t("quranCompanion.picker.ayahCount", { count: s.ayahCount })}`}
                    onPress={() => chooseSurah(s.number)}
                    style={[
                      styles.surahRow,
                      { backgroundColor: selected ? tokens.accentSoft : colors.muted },
                    ]}
                  >
                    <View style={[styles.surahNumber, { backgroundColor: tokens.accentSoft }]}>
                      <ThemedText type="caption" style={{ color: colors.accentText }}>
                        {s.number}
                      </ThemedText>
                    </View>
                    <View style={styles.flex}>
                      <ThemedText type="small" numberOfLines={1}>
                        {s.nameTransliteration}
                      </ThemedText>
                      <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                        {t("quranCompanion.picker.ayahCount", { count: s.ayahCount })}
                      </ThemedText>
                    </View>
                    <ThemedText type="arabic" accessibilityLanguage="ar" style={styles.arabicName}>
                      {s.nameArabic}
                    </ThemedText>
                  </PressableScale>
                );
              })}
            </View>
          </>
        ) : (
          <>
            <PressableScale
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={t("quranCompanion.picker.changeSurah")}
              onPress={() => setStep("surah")}
              style={[styles.surahRow, { backgroundColor: colors.muted }]}
            >
              <View style={[styles.surahNumber, { backgroundColor: tokens.accentSoft }]}>
                <ThemedText type="caption" style={{ color: colors.accentText }}>
                  {surah}
                </ThemedText>
              </View>
              <View style={styles.flex}>
                <ThemedText type="small">{name}</ThemedText>
                <ThemedText type="caption" style={{ color: colors.accentText }}>
                  {t("quranCompanion.picker.changeSurah")}
                </ThemedText>
              </View>
              <ThemedText type="arabic" accessibilityLanguage="ar" style={styles.arabicName}>
                {meta?.nameArabic ?? ""}
              </ThemedText>
            </PressableScale>

            <ThemedText type="smallBold">{t("quranCompanion.picker.fromAyah")}</ThemedText>
            <View style={styles.grid}>
              {ayahNumbers.map((n) => {
                const inRange = n >= from && n <= to;
                const isStart = n === from;
                return (
                  <PressableScale
                    key={n}
                    haptic="selection"
                    accessibilityRole="button"
                    accessibilityState={{ selected: isStart }}
                    accessibilityLabel={t("quranCompanion.picker.ayahN", { n })}
                    onPress={() => chooseFrom(n)}
                    style={[
                      styles.ayahCell,
                      {
                        backgroundColor: isStart
                          ? colors.accent
                          : inRange
                            ? tokens.accentSoft
                            : colors.muted,
                      },
                    ]}
                  >
                    <ThemedText
                      type="caption"
                      style={{ color: isStart ? colors.accentForeground : colors.foreground }}
                    >
                      {n}
                    </ThemedText>
                  </PressableScale>
                );
              })}
            </View>

            <View style={styles.endRow}>
              <ThemedText type="smallBold" style={styles.flex}>
                {t("quranCompanion.picker.toAyah")}
              </ThemedText>
              <Stepper
                value={to}
                min={from}
                label={t("quranCompanion.picker.toAyah")}
                onDecrement={() => setTo((v) => Math.max(from, v - 1))}
                onIncrement={() => setTo((v) => Math.min(count, v + 1))}
              />
            </View>
            <View style={styles.quick}>
              <Button
                label={t("quranCompanion.range.ayah")}
                variant="ghost"
                size="sm"
                onPress={() => setTo(from)}
              />
              <Button
                label={t("quranCompanion.range.next5")}
                variant="ghost"
                size="sm"
                onPress={() => setTo(Math.min(count, from + 4))}
              />
              <Button
                label={t("quranCompanion.picker.toEnd")}
                variant="ghost"
                size="sm"
                onPress={() => setTo(count)}
              />
            </View>

            <Button
              label={t("quranCompanion.picker.confirm", { passage: label })}
              fullWidth
              onPress={() => onSelect({ surah, ayahStart: from, ayahEnd: to })}
            />
          </>
        )}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.three, padding: Spacing.three },
  list: { gap: Spacing.one },
  surahRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  surahNumber: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1, minWidth: 0 },
  arabicName: { fontSize: 18, writingDirection: "rtl" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.one },
  ayahCell: {
    minWidth: Control.minTouch,
    minHeight: Control.minTouch,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  endRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  quick: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.one },
});
