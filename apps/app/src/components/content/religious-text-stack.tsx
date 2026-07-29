import type { ReadingSurface } from "@munib-tracker/shared/types";
import { StyleSheet, View } from "react-native";

import { useReadingTypography } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { arabicReadingLayout } from "@/lib/reading-typography";

/**
 * Arabic + transliteration + translation stack with user font preferences applied.
 * Used on Learn Salah and Journey to Jannah inner pages.
 */
export function ReligiousTextStack({
  arabic,
  transliteration,
  translation,
  surface,
  compact,
}: {
  arabic?: string;
  transliteration?: string;
  translation?: string;
  surface?: ReadingSurface;
  /** Suppress top margin when nested inside another padded block. */
  compact?: boolean;
}) {
  const { sizes } = useReadingTypography(surface);

  if (!arabic && !transliteration && !translation) return null;

  return (
    <View style={[styles.stack, compact ? styles.stackCompact : null]}>
      {arabic ? (
        <ThemedText type="arabic" style={arabicReadingLayout(sizes.arabic)}>
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
          {translation}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.one + 2, marginTop: Spacing.two },
  stackCompact: { marginTop: 0 },
  translit: { fontStyle: "italic" },
});
