import type { ReadingSurface } from "@munib-tracker/shared/types";
import { StyleSheet, View } from "react-native";

import { EnglishMeaningLabel } from "@/components/content/english-meaning-label";
import { useReadingTypography } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useScriptureMeaning } from "@/hooks/use-scripture-meaning";
import { arabicReadingLayout } from "@/lib/reading-typography";
import type { QuranMeaningRef } from "@/lib/scripture-meaning";

/**
 * Arabic + transliteration + translation stack with user font preferences applied.
 * Used on Learn Salah and Journey to Jannah inner pages.
 *
 * `translation` is the English meaning from Learn content — D45: it is never translated by hand
 * or AI. Pass `quranRef` for an ayah so a non-English UI shows the user's dataset translation;
 * otherwise a non-English UI keeps the English and shows an "English meaning" label.
 */
export function ReligiousTextStack({
  arabic,
  transliteration,
  translation,
  surface,
  compact,
  quranRef,
}: {
  arabic?: string;
  transliteration?: string;
  translation?: string;
  surface?: ReadingSurface;
  /** Suppress top margin when nested inside another padded block. */
  compact?: boolean;
  /** Ayah span the translation belongs to (dataset translation in non-English UIs). */
  quranRef?: QuranMeaningRef | null;
}) {
  const { sizes } = useReadingTypography(surface);
  const meaning = useScriptureMeaning(translation, quranRef);

  if (!arabic && !transliteration && !translation) return null;

  return (
    <View style={[styles.stack, compact ? styles.stackCompact : null]}>
      {arabic ? (
        <ThemedText
          type="arabic"
          accessibilityLanguage="ar"
          style={arabicReadingLayout(sizes.arabic)}
        >
          {arabic}
        </ThemedText>
      ) : null}
      {transliteration ? (
        <ThemedText
          type="caption"
          themeColor="mutedForeground"
          style={[
            styles.translit,
            { fontSize: sizes.transliteration, lineHeight: sizes.transliteration * 1.35 },
          ]}
        >
          {transliteration}
        </ThemedText>
      ) : null}
      {translation ? (
        <ThemedText
          type="small"
          style={{ fontSize: sizes.translation, lineHeight: sizes.translation * 1.45 }}
        >
          {meaning.text}
        </ThemedText>
      ) : null}
      {translation ? <EnglishMeaningLabel visible={meaning.englishFallback} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.oneHalf, marginTop: Spacing.two },
  stackCompact: { marginTop: 0 },
  translit: { fontStyle: "italic" },
});
