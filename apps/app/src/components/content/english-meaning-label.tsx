import { useTranslation } from "react-i18next";
import { type StyleProp, StyleSheet, type TextStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";

/**
 * D45 — shown next to a Qur'an / hadith / dua meaning that is displayed in English because no
 * dataset translation exists for the user's language. Render it only when
 * `useScriptureMeaning(...).englishFallback` is true.
 */
export function EnglishMeaningLabel({
  visible = true,
  style,
}: {
  visible?: boolean;
  /** e.g. a hero colour on brand backgrounds. */
  style?: StyleProp<TextStyle>;
}) {
  const { t } = useTranslation();
  if (!visible) return null;
  return (
    <ThemedText
      type="caption"
      themeColor="mutedForeground"
      style={[styles.label, style]}
      accessibilityLabel={t("scriptureMeaning.englishLabelA11y")}
    >
      {t("scriptureMeaning.englishLabel")}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  label: { fontStyle: "italic" },
});
