import type { ReadingSurface } from "@munib-tracker/shared/types";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ReadingFontControls } from "@/components/reading-font-controls";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import {
  DEFAULT_ARABIC_SIZE,
  DEFAULT_TRANSLATION_SIZE,
  type ReadingFontSizes,
  resolveArabicFontFamily,
  resolveReadingFontSizes,
} from "@/lib/reading-typography";
import { usePreferences } from "@/stores/preferences-store";

const ReadingTypographyContext = createContext<ReadingSurface | null>(null);

/** Wrap a learn screen so descendants resolve font sizes for that surface. */
export function ReadingTypographyProvider({
  surface,
  children,
}: {
  surface: ReadingSurface;
  children: ReactNode;
}) {
  return (
    <ReadingTypographyContext.Provider value={surface}>
      {children}
    </ReadingTypographyContext.Provider>
  );
}

/** Resolved Arabic / transliteration / translation sizes for the active learn surface. */
export function useReadingTypography(explicitSurface?: ReadingSurface): {
  surface: ReadingSurface | null;
  sizes: ReadingFontSizes;
} {
  const fromContext = useContext(ReadingTypographyContext);
  const { fontPrefs } = usePreferences();
  const surface = explicitSurface ?? fromContext;

  const sizes = useMemo(() => {
    if (surface) return resolveReadingFontSizes(surface, fontPrefs);
    const arabic = fontPrefs.arabic.size ?? DEFAULT_ARABIC_SIZE;
    const translation = fontPrefs.translation.size ?? DEFAULT_TRANSLATION_SIZE;
    return {
      arabic,
      translation,
      transliteration: Math.max(12, translation - 1),
    };
  }, [surface, fontPrefs]);

  return { surface: surface ?? null, sizes };
}

export function useArabicFontFamily(): string | undefined {
  const { fontPrefs } = usePreferences();
  return resolveArabicFontFamily(fontPrefs.arabic.family);
}

/** A−/A+ bar — place at the top of learn screens with Arabic or translated religious text. */
export function ReadingTypographyBar({ surface }: { surface: ReadingSurface }) {
  const { t } = useTranslation();

  return (
    <View style={styles.bar}>
      <ThemedText type="smallBold">{t("reading.textSize")}</ThemedText>
      <ReadingFontControls surface={surface} />
    </View>
  );
}

/** Provider + font-size bar for Learn Salah / Jannah inner screens. */
export function LearnReadingChrome({
  surface,
  children,
}: {
  surface: ReadingSurface;
  children: ReactNode;
}) {
  return (
    <ReadingTypographyProvider surface={surface}>
      <ReadingTypographyBar surface={surface} />
      <View style={styles.content}>{children}</View>
    </ReadingTypographyProvider>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  content: {
    gap: Spacing.four,
  },
});
