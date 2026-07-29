import type { ReactNode } from "react";
import { StyleSheet } from "react-native";

import { ReferenceLine } from "@/components/content/reference-line";
import { ReadingTypographyBar } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { useScriptureTranslation } from "@/hooks/use-scripture-translation";
import {
  arabicReadingLayout,
  resolveReadingFontSizes,
  translationReadingStyle,
} from "@/lib/reading-typography";
import { usePreferences } from "@/stores/preferences-store";
import { useReadingTextVisibility } from "@/stores/reading-text-visibility-store";

type TasbeehReadingItem = {
  arabic: string;
  transliteration?: string;
  translation: string;
  translations?: Partial<Record<string, string>>;
  reference?: string;
};

/** Arabic + optional transliteration/translation for tasbeeh screens with text. */
export function TasbeehReadingBlock({
  item,
  footer,
}: {
  item: TasbeehReadingItem;
  footer?: ReactNode;
}) {
  const { fontPrefs, translationLocale } = usePreferences();
  const { showTransliteration, showTranslation } = useReadingTextVisibility();
  const displayTranslation = useScriptureTranslation(item);
  const readingSizes = resolveReadingFontSizes("dua_zikr", fontPrefs);
  const transliteration = item.transliteration?.trim() ?? "";
  const translationText = displayTranslation.trim();

  return (
    <>
      <ReadingTypographyBar surface="dua_zikr" textVisibility />
      <Card variant="muted" padding="four" style={styles.reading}>
        <ThemedText
          type="arabic"
          style={[styles.arabic, arabicReadingLayout(readingSizes.arabic, "center")]}
        >
          {item.arabic}
        </ThemedText>
        {showTransliteration && transliteration ? (
          <ThemedText
            type="caption"
            themeColor="mutedForeground"
            style={[
              styles.translit,
              {
                fontSize: readingSizes.transliteration,
                lineHeight: readingSizes.transliteration * 1.35,
              },
            ]}
          >
            {transliteration}
          </ThemedText>
        ) : null}
        {showTranslation && translationText ? (
          <ThemedText
            type="default"
            style={[
              styles.translation,
              translationReadingStyle(translationLocale, readingSizes.translation),
              { textAlign: "center" },
            ]}
          >
            {translationText}
          </ThemedText>
        ) : null}
        {item.reference ? (
          <ReferenceLine reference={item.reference} style={styles.reference} />
        ) : null}
        {footer}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  reading: {
    alignItems: "center",
    marginBottom: Spacing.one,
  },
  arabic: {
    textAlign: "center",
    writingDirection: "rtl",
  },
  translit: {
    textAlign: "center",
    marginTop: Spacing.two,
    fontStyle: "italic",
    maxWidth: 320,
  },
  translation: {
    marginTop: Spacing.two,
    maxWidth: 360,
  },
  reference: {
    textAlign: "center",
    marginTop: Spacing.two,
  },
});
