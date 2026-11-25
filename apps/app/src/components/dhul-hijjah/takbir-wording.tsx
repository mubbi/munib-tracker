import type { MadhhabRules } from "@munib-tracker/shared/fiqh";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { arabicReadingLayout, resolveReadingFontSizes } from "@/lib/reading-typography";
import { ensureZikrCorpus, getZikrById } from "@/lib/zikr";
import { usePreferences } from "@/stores/preferences-store";

/** Bundled adhkar item whose Arabic is the takbir ("Allahu akbar"). Never typed here. */
const TAKBIR_ZIKR_ID = "after_prayer-takbir";

/**
 * Takbir al-Tashriq wording card (NF-3.3). The opening takbir is rendered from
 * the bundled adhkar dataset with ×2 / ×3 per the school's `openingTakbirs`;
 * the full formula is not in the bundled dataset, so the rest is described in
 * guide copy (tahlil, then takbir twice, then tahmid) rather than typed.
 */
export function TakbirWording({ rules }: { rules: MadhhabRules | null }) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const { fontPrefs } = usePreferences();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    void ensureZikrCorpus().then(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);
  const item = ready ? getZikrById(TAKBIR_ZIKR_ID) : undefined;
  const sizes = resolveReadingFontSizes("dua_zikr", fontPrefs);
  const opening = rules
    ? t("dhulHijjah.tashriq.openingCount", { number: rules.takbirTashriq.openingTakbirs })
    : t("dhulHijjah.tashriq.openingAllViews");

  return (
    <Card variant="muted" style={styles.card}>
      {item ? (
        <View style={styles.line}>
          <ThemedText
            type="arabic"
            style={[styles.arabic, arabicReadingLayout(sizes.arabic, "center")]}
          >
            {item.arabic}
          </ThemedText>
          <Pill
            label={opening}
            compact
            color={tokens.status.info.color}
            background={tokens.status.info.soft}
          />
        </View>
      ) : null}
      <ThemedText type="small" themeColor="mutedForeground">
        {t("dhulHijjah.tashriq.wordingRest")}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("dhulHijjah.tashriq.womenQuietly")}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  line: { alignItems: "center", gap: Spacing.two },
  arabic: { writingDirection: "rtl" },
});
