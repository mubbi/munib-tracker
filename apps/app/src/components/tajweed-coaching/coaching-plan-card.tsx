import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { useArrowForward } from "@/lib/rtl";
import { rebuildCoachingPlan } from "@/lib/tajweed-coaching/actions";
import {
  useEnsureTajweedCoachingLoaded,
  useTajweedCoaching,
} from "@/stores/tajweed-coaching-store";

import { CoachingItemCard } from "./coaching-item-card";

/** How many plan items the summary shows before linking to the Coaching tab. */
export const SUMMARY_PLAN_ITEMS = 2;

export const COACHING_TAB_HREF = {
  pathname: "/learn-quran/tajweed" as const,
  params: { tab: "coaching" },
};

/**
 * "Practise these sounds" on `/quran/practice/summary` (NF-3.15 step 7). The
 * just-finished session is in the history, so the plan is rebuilt once on
 * mount; the card stays hidden until it has something to show.
 */
export function CoachingPlanCard({ sessionId }: { sessionId: string }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const forward = useArrowForward();
  useEnsureTajweedCoachingLoaded();
  const state = useTajweedCoaching();
  const built = useRef<string | null>(null);

  useEffect(() => {
    if (!isPracticeAvailable() || built.current === sessionId) return;
    built.current = sessionId;
    void rebuildCoachingPlan(i18n.language).catch(() => {
      // Offline: the stored plan (if any) still shows.
    });
  }, [i18n.language, sessionId]);

  const items = state.plan?.items ?? [];
  if (!items.length) return null;

  return (
    <View style={styles.stack}>
      <SectionHeader
        title={t("tajweedCoaching.title")}
        icon={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("tajweedCoaching.summaryIntro")}
      </ThemedText>
      {items.slice(0, SUMMARY_PLAN_ITEMS).map((item) => (
        <CoachingItemCard key={item.head} item={item} state={state} canPractise compact />
      ))}
      <Button
        label={t("tajweedCoaching.seePlan")}
        variant="ghost"
        size="sm"
        icon={forward}
        onPress={() => router.push(COACHING_TAB_HREF)}
        style={styles.center}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two, marginTop: Spacing.four },
  center: { alignSelf: "center" },
});
