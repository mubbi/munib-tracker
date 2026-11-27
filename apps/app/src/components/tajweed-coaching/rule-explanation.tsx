import {
  TAJWEED_CLASSICAL_SOURCES,
  TAJWEED_COACHING_GUIDE,
} from "@munib-tracker/shared/content/tajweed-coaching-guide";
import type { TajweedCoachingCategory } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";

/**
 * The tajweed rule explanation for a coaching card: how the sound is made,
 * listen-and-repeat steps, any difference between readings, and the classical
 * works it follows (D11, `docs/proofs/tajweed-coaching.md`).
 */
export function RuleExplanation({
  category,
  showSteps = true,
}: {
  category: TajweedCoachingCategory;
  showSteps?: boolean;
}) {
  const { t } = useTranslation();
  const entry = TAJWEED_COACHING_GUIDE[category];
  return (
    <View style={styles.body}>
      {entry.explanation.map((paragraph) => (
        <ThemedText key={paragraph} type="small">
          {paragraph}
        </ThemedText>
      ))}
      {showSteps ? (
        <View style={styles.steps}>
          <ThemedText type="smallBold">{t("tajweedCoaching.card.howTo")}</ThemedText>
          {entry.howTo.map((step, i) => (
            <ThemedText key={step} type="small">
              {t("tajweedCoaching.card.step", { n: i + 1, text: step })}
            </ThemedText>
          ))}
        </View>
      ) : null}
      {entry.note ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {entry.note}
        </ThemedText>
      ) : null}
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("tajweedCoaching.card.sources", {
          sources: entry.sources.map((id) => TAJWEED_CLASSICAL_SOURCES[id].title).join("; "),
        })}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two, marginTop: Spacing.two },
  steps: { gap: Spacing.one },
});
