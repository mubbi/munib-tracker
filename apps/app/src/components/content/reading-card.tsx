import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { usePreferences } from "@/stores/preferences-store";

export type ReadingItem = {
  arabic: string;
  transliteration: string;
  translation: string;
  virtues?: string;
  reference?: string;
};

/** Shared reading view for religious text (zikr, dua, durood, names). */
export function ReadingCard({ item }: { item: ReadingItem }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { fontPrefs } = usePreferences();
  const arabicSize = fontPrefs.arabic.size;
  const textSize = fontPrefs.translation.size;

  return (
    <Card padding="four">
      <ThemedText
        type="arabic"
        style={[
          styles.arabic,
          arabicSize ? { fontSize: arabicSize, lineHeight: arabicSize * 1.8 } : null,
        ]}
      >
        {item.arabic}
      </ThemedText>

      <View style={[styles.divider, { backgroundColor: tokens.hairline }]} />

      <ThemedText
        type="small"
        style={[
          styles.transliteration,
          { color: colors.accent },
          textSize ? { fontSize: textSize } : null,
        ]}
      >
        {item.transliteration}
      </ThemedText>
      <ThemedText
        type="default"
        style={[styles.translation, textSize ? { fontSize: textSize } : null]}
      >
        {item.translation}
      </ThemedText>

      {item.virtues ? (
        <View style={[styles.note, { backgroundColor: tokens.status.success.soft }]}>
          <SymbolView
            name={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
            size={16}
            tintColor={tokens.status.success.color}
          />
          <ThemedText type="small" themeColor="mutedForeground" style={styles.noteText}>
            {item.virtues}
          </ThemedText>
        </View>
      ) : null}

      {item.reference ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.reference}>
          {t("reading.reference", { ref: item.reference })}
        </ThemedText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  arabic: { writingDirection: "rtl", textAlign: "right" },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: Spacing.three },
  transliteration: { fontStyle: "italic" },
  translation: { marginTop: Spacing.two },
  note: {
    flexDirection: "row",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: 14,
    borderCurve: "continuous",
    marginTop: Spacing.three,
  },
  noteText: { flex: 1 },
  reference: { marginTop: Spacing.three },
});
