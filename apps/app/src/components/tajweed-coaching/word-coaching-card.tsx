import type { TajweedWordCard } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { isDrillHead } from "@/lib/tajweed-coaching/categories";
import { COACHING_COPY, categoryNameKey } from "@/lib/tajweed-coaching/copy";

import { coachHref } from "./coaching-item-card";
import { ExampleWords } from "./example-words";

/**
 * NF-3.15 Phase B: a word NF-3.24 marked "Listen again" that contains a tajweed
 * rule. Not a tajweed judgement — the card names the rule the word CONTAINS
 * and invites listening to the reciter and trying again. No score.
 */
export function WordCoachingCard({
  card,
  canPractise,
}: {
  card: TajweedWordCard;
  canPractise: boolean;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const rule = card.categories.map((c) => t(categoryNameKey(c))).join(", ");
  const first = card.categories[0];
  return (
    <Card padding="three">
      <ExampleWords refs={[card]} />
      <ThemedText type="small" style={styles.gap}>
        {t(COACHING_COPY.wordCard, { rule })}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.gap}>
        {t("tajweedCoaching.word.fromCheck")}
      </ThemedText>
      {canPractise && first ? (
        <Button
          label={
            isDrillHead(first)
              ? t("tajweedCoaching.card.practise")
              : t("tajweedCoaching.card.listenAndRepeat")
          }
          size="sm"
          variant="secondary"
          onPress={() => router.push(coachHref(first))}
          style={styles.button}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  gap: { marginTop: Spacing.two },
  button: { marginTop: Spacing.three, alignSelf: "flex-start" },
});
