import type { HadithIsnadLink } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { arabicReadingLayout } from "@/lib/reading-typography";
import { usePreferences } from "@/stores/preferences-store";

type HadithIsnadChainProps = {
  isnad: HadithIsnadLink[];
  /** Prefer Arabic names when the meaning locale is Arabic. */
  preferArabic?: boolean;
};

/**
 * Ordered transmission chain ending with the Prophet ﷺ (NF-2.9).
 * Visual language matches the prophets timeline rail (dot + connector).
 */
export function HadithIsnadChain({ isnad, preferArabic }: HadithIsnadChainProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { translationLocale } = usePreferences();
  const useArabic = preferArabic ?? translationLocale === "ar";

  if (!isnad.length) return null;

  const sorted = [...isnad].sort((a, b) => a.order - b.order);

  return (
    <View style={styles.wrap} accessibilityLabel={t("hadith.isnad")}>
      <ThemedText type="smallBold" themeColor="mutedForeground">
        {t("hadith.isnad")}
      </ThemedText>
      <View style={styles.chain}>
        {sorted.map((link, index) => {
          const label =
            useArabic && link.nameArabic ? link.nameArabic : (link.nameEnglish ?? link.nameArabic);
          const isLast = index === sorted.length - 1;
          const isProphet = link.role === "prophet";
          return (
            <View key={`${link.order}:${label}`} style={styles.step}>
              <View style={styles.rail}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: isProphet ? colors.accent : colors.muted,
                      borderColor: isProphet ? colors.accent : tokens.hairline,
                    },
                  ]}
                />
                {!isLast ? (
                  <View style={[styles.line, { backgroundColor: tokens.hairline }]} />
                ) : null}
              </View>
              <ThemedText
                type={isProphet ? "smallBold" : "caption"}
                themeColor={isProphet ? "foreground" : "mutedForeground"}
                style={[styles.name, useArabic && link.nameArabic ? arabicReadingLayout(15) : null]}
              >
                {label}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two, marginBottom: Spacing.two },
  chain: { gap: 0 },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    minHeight: 28,
  },
  rail: {
    width: 16,
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: Radius.pill,
    marginTop: 3,
    borderWidth: StyleSheet.hairlineWidth,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 14,
    marginTop: 2,
  },
  name: { flex: 1, paddingBottom: Spacing.two },
});
