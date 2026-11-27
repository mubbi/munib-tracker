import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { ReferenceLine } from "@/components/content/reference-line";
import { ReadingTypographyBar } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { useScriptureTranslation } from "@/hooks/use-scripture-translation";
import {
  arabicReadingLayout,
  resolveReadingFontSizes,
  translationReadingStyle,
} from "@/lib/reading-typography";
import { useReadingDisplay } from "@/lib/settings/reading-display";
import { usePreferences } from "@/stores/preferences-store";

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
  collapsible = false,
  defaultCollapsed = false,
}: {
  item: TasbeehReadingItem;
  footer?: ReactNode;
  /**
   * Long readings can be folded to a single Arabic line so the counter stays in
   * view (B-71). Off by default — the reading is the screen's content.
   */
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(collapsible && defaultCollapsed);
  const { fontPrefs, translationLocale } = usePreferences();
  const { showTransliteration, showTranslation } = useReadingDisplay();
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
          numberOfLines={collapsed ? 1 : undefined}
          style={[styles.arabic, arabicReadingLayout(readingSizes.arabic, "center")]}
        >
          {item.arabic}
        </ThemedText>
        {!collapsed && showTransliteration && transliteration ? (
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
        {!collapsed && showTranslation && translationText ? (
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
        {!collapsed && item.reference ? (
          <ReferenceLine reference={item.reference} style={styles.reference} />
        ) : null}
        {collapsed ? null : footer}
        {collapsible ? (
          <Button
            label={collapsed ? t("reading.showMore") : t("reading.showLess")}
            variant="ghost"
            onPress={() => setCollapsed((value) => !value)}
          />
        ) : null}
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
