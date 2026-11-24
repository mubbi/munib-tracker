import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { ROOT_ALPHABET, rootLetters, rootToArabic } from "@/lib/quran-morphology/buckwalter";

const MAX_LETTERS = 4;

/**
 * 28-letter grid for building a root without an Arabic keyboard (phones without
 * one installed, TV with a D-pad). Letters come from the transliteration table,
 * never typed by hand. `value` is a Buckwalter root under construction.
 */
export function RootLetterPicker({
  visible,
  value,
  onChange,
  onDone,
  onClose,
}: {
  visible: boolean;
  value: string;
  onChange: (root: string) => void;
  onDone: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const full = value.length >= MAX_LETTERS;

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom" solid>
      <View style={styles.body}>
        <ThemedText type="smallBold">{t("quranRoots.picker.title")}</ThemedText>
        <View
          style={[styles.preview, { backgroundColor: colors.muted }]}
          accessibilityLabel={t("quranRoots.picker.current", {
            letters: value ? rootToArabic(value) : "—",
          })}
        >
          <ThemedText type="arabic" style={styles.previewText}>
            {value ? rootToArabic(value) : " "}
          </ThemedText>
        </View>
        {/* Arabic order reads right-to-left whatever the UI language. */}
        <View style={[styles.grid, styles.rtlGrid]}>
          {ROOT_ALPHABET.map((bw, i) => {
            const letter = rootLetters(bw)[0];
            return (
              <PressableScale
                key={bw}
                haptic="selection"
                accessibilityRole="button"
                accessibilityLabel={letter}
                disabled={full}
                hasTVPreferredFocus={tv && visible && i === 0}
                onPress={() => onChange(value + bw)}
                style={[
                  styles.key,
                  tv && styles.keyTv,
                  { backgroundColor: tokens.accentSoft, opacity: full ? 0.5 : 1 },
                ]}
              >
                <ThemedText type="arabic" style={styles.keyText}>
                  {letter}
                </ThemedText>
              </PressableScale>
            );
          })}
        </View>
        <View style={styles.actions}>
          <Button
            label={t("quranRoots.picker.backspace")}
            variant="secondary"
            size="sm"
            disabled={!value}
            onPress={() => onChange(value.slice(0, -1))}
          />
          <Button
            label={t("quranRoots.picker.clear")}
            variant="ghost"
            size="sm"
            disabled={!value}
            onPress={() => onChange("")}
          />
          <Button
            label={t("quranRoots.picker.done")}
            size="sm"
            disabled={value.length < 2}
            onPress={onDone}
          />
        </View>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.three, padding: Spacing.three },
  preview: {
    minHeight: 56,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  previewText: { fontSize: 30, lineHeight: 44 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "center" },
  // RN Web rejects the Yoga `direction` prop; it maps `writingDirection` to CSS `direction`.
  rtlGrid: Platform.select({
    web: { writingDirection: "rtl" } as const,
    default: { direction: "rtl" } as const,
  }),
  key: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  keyTv: { width: TvLayout.minFocusTarget, height: TvLayout.minFocusTarget },
  keyText: { fontSize: 24, lineHeight: 36 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "flex-end" },
});
