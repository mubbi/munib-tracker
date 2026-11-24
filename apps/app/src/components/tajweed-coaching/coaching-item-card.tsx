import { TAJWEED_COACHING_GUIDE } from "@munib-tracker/shared/content/tajweed-coaching-guide";
import type { TajweedCoachingState, TajweedPlanItem } from "@munib-tracker/shared/types";
import { diffInDays, getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { Spacing } from "@/constants/theme";
import { isDrillHead, planItemCategory } from "@/lib/tajweed-coaching/categories";
import { categoryNameKey, planItemCopyKey } from "@/lib/tajweed-coaching/copy";
import { itemNextDue } from "@/lib/tajweed-coaching/progress";

import { ExampleWords } from "./example-words";
import { RuleExplanation } from "./rule-explanation";

export function coachHref(category: string) {
  return { pathname: "/learn-quran/tajweed/coach/[item]" as const, params: { item: category } };
}

/** "Due today" / "Next practice in N days" — spacing only, never a score. */
export function useDueLabel(state: TajweedCoachingState, key: string): string {
  const { t } = useTranslation();
  const next = itemNextDue(state, key);
  const today = getLocalDateString();
  if (next == null || next <= today) return t("tajweedCoaching.card.dueToday");
  return t("tajweedCoaching.card.dueIn", { count: diffInDays(next, today) });
}

/**
 * One coaching plan item: what the person's ayahs include (reviewed copy,
 * never "you made a mistake"), example words from their own recitation, the
 * rule explanation, and a way to practise it (a Quran Lab drill for the three
 * heads, listen-and-repeat for everything else).
 */
export function CoachingItemCard({
  item,
  state,
  canPractise,
  compact = false,
}: {
  item: TajweedPlanItem;
  state: TajweedCoachingState;
  /** False on TV / without a microphone path: the card is read-only. */
  canPractise: boolean;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const category = planItemCategory(item.head);
  const dueLabel = useDueLabel(state, item.head);
  if (!category) return null;
  const entry = TAJWEED_COACHING_GUIDE[category];
  const rule = t(categoryNameKey(category));

  return (
    <Card padding="three">
      <ThemedText type="subtitle" heading={3}>
        {entry.title}
      </ThemedText>
      <ThemedText type="small" style={styles.gap}>
        {t(planItemCopyKey(category), { rule })}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.gap}>
        {isDrillHead(category) ? dueLabel : `${t("tajweedCoaching.card.listenOnly")} · ${dueLabel}`}
      </ThemedText>
      <ExampleWords refs={item.words} />
      {compact ? null : (
        <View style={styles.gap}>
          <CollapsibleSection title={t("tajweedCoaching.card.aboutRule", { rule })}>
            <RuleExplanation category={category} />
          </CollapsibleSection>
        </View>
      )}
      {canPractise ? (
        <Button
          label={
            isDrillHead(category)
              ? t("tajweedCoaching.card.practise")
              : t("tajweedCoaching.card.listenAndRepeat")
          }
          size="sm"
          variant={compact ? "secondary" : "primary"}
          icon={
            isDrillHead(category)
              ? { ios: "mic.fill", android: "mic", web: "mic" }
              : { ios: "ear", android: "hearing", web: "hearing" }
          }
          onPress={() => router.push(coachHref(category))}
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
