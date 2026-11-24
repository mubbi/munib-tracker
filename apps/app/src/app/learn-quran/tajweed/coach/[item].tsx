import { TAJWEED_COACHING_GUIDE } from "@munib-tracker/shared/content/tajweed-coaching-guide";
import type { TajweedWordRef } from "@munib-tracker/shared/types";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { useDueLabel } from "@/components/tajweed-coaching/coaching-item-card";
import { DrillTakeCard } from "@/components/tajweed-coaching/drill-take-card";
import { ExampleWords } from "@/components/tajweed-coaching/example-words";
import { RuleExplanation } from "@/components/tajweed-coaching/rule-explanation";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { goBackOrReplace } from "@/lib/navigation";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { recordCoachingDrill, recordCoachingListen } from "@/lib/tajweed-coaching/actions";
import {
  COACHING_CATEGORIES,
  categoryFromParam,
  isDrillHead,
  planItemKey,
} from "@/lib/tajweed-coaching/categories";
import { categoryNameKey } from "@/lib/tajweed-coaching/copy";
import { useToast } from "@/providers/toast-provider";
import {
  useEnsureTajweedCoachingLoaded,
  useTajweedCoaching,
} from "@/stores/tajweed-coaching-store";

export function generateStaticParams(): Array<{ item: string }> {
  return COACHING_CATEGORIES.map((item) => ({ item }));
}

const COACHING_TAB = "/learn-quran/tajweed?tab=coaching" as Href;

/**
 * NF-3.15 practice for one coaching item. Drill heads (qalqalah, ghunna,
 * gemination) get the Quran Lab take (one word, one sound; three-line verdict,
 * no score). Every other rule is listen-and-repeat with the reciter's word
 * audio and is never judged. Example words come from the person's own
 * recitation. TV is read-only (no microphone path).
 */
export default function TajweedCoachItemScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();
  const { item } = useLocalSearchParams<{ item: string }>();
  const category = categoryFromParam(Array.isArray(item) ? item[0] : item);
  useEnsureTajweedCoachingLoaded();
  const state = useTajweedCoaching();
  const key = category ? planItemKey(category) : "";
  const dueLabel = useDueLabel(state, key);
  const canPractise = isPracticeAvailable();

  useEffect(() => {
    if (!category) router.replace(COACHING_TAB);
  }, [category, router]);

  const words = useMemo<TajweedWordRef[]>(() => {
    if (!category) return [];
    const fromPlan = state.plan?.items.find((i) => i.head === key)?.words ?? [];
    const fromCards = (state.plan?.wordCards ?? []).filter((c) => c.categories.includes(category));
    const seen = new Set<string>();
    return [...fromCards, ...fromPlan].filter((w) => {
      const k = `${w.surah}:${w.ayah}:${w.wordIndex}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [category, key, state.plan]);

  if (!category) return null;
  const entry = TAJWEED_COACHING_GUIDE[category];
  const rule = t(categoryNameKey(category));

  return (
    <ScreenLayout
      eyebrow={t("tajweedCoaching.title")}
      title={entry.title}
      subtitle={entry.summary}
      onBack={() => goBackOrReplace(router, COACHING_TAB)}
    >
      <Seo path={`/learn-quran/tajweed/coach/${category}`} index={false} />

      <Card padding="three">
        <ThemedText type="smallBold">{t("tajweedCoaching.coach.wordsTitle")}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.gap}>
          {words.length
            ? t("tajweedCoaching.coach.wordsIntro", { rule })
            : t("tajweedCoaching.coach.noWords")}
        </ThemedText>
        <ExampleWords refs={words} />
      </Card>

      <Card padding="three">
        <ThemedText type="smallBold">{t("tajweedCoaching.card.aboutRule", { rule })}</ThemedText>
        <RuleExplanation category={category} />
        {entry.lessonId ? (
          <Button
            label={t("tajweedCoaching.coach.readLesson")}
            variant="ghost"
            size="sm"
            onPress={() =>
              router.push({
                pathname: "/learn-quran/tajweed/[id]",
                params: { id: entry.lessonId as string },
              })
            }
            style={styles.button}
          />
        ) : null}
      </Card>

      {canPractise && isDrillHead(category) ? (
        <DrillTakeCard
          head={category}
          onVerdict={(verdict) => void recordCoachingDrill(category, verdict)}
        />
      ) : null}

      {canPractise && !isDrillHead(category) ? (
        <Card padding="three">
          <ThemedText type="small">{t("tajweedCoaching.coach.listenIntro")}</ThemedText>
          <Button
            label={t("tajweedCoaching.coach.listened")}
            icon={{ ios: "checkmark", android: "check", web: "check" }}
            onPress={() =>
              void recordCoachingListen(category).then(() =>
                toast.success(t("tajweedCoaching.coach.listenedToast")),
              )
            }
            style={styles.button}
          />
        </Card>
      ) : null}

      <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
        {canPractise ? dueLabel : t("tajweedCoaching.tvReadOnly")}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
        {t("tajweedCoaching.privacy")}
      </ThemedText>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  gap: { marginTop: Spacing.two },
  button: { marginTop: Spacing.three, alignSelf: "flex-start" },
  center: { textAlign: "center", marginTop: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran/tajweed/coach/[item]");
