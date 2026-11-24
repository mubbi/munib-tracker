import { TAJWEED_COACHING_GUIDE } from "@munib-tracker/shared/content/tajweed-coaching-guide";
import type { TajweedCoachingState } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { EvidenceLinks } from "@/components/self-review/evidence-links";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { rebuildCoachingPlan } from "@/lib/tajweed-coaching/actions";
import { DRILL_HEAD_IDS, LISTEN_CATEGORIES } from "@/lib/tajweed-coaching/categories";
import { TAJWEED_COACHING_EVIDENCE } from "@/lib/tajweed-coaching/evidence";
import { planIsStale } from "@/lib/tajweed-coaching/plan";
import type { RefreshOutcome } from "@/lib/tajweed-coaching/refresh";
import { useStore } from "@/stores/create-store";
import {
  quranPracticeStore,
  useEnsurePracticeLoaded,
  usePracticeHistory,
} from "@/stores/quran-practice-store";
import {
  useEnsureTajweedCoachingLoaded,
  useTajweedCoaching,
  useTajweedCoachingReady,
} from "@/stores/tajweed-coaching-store";

import { CoachingItemCard, useDueLabel } from "./coaching-item-card";
import { WordCoachingCard } from "./word-coaching-card";

type BuildStatus = "idle" | "building" | RefreshOutcome;

/**
 * The "Coaching" tab of `/learn-quran/tajweed` (NF-3.15). Builds the plan from
 * the person's own practice when it's out of date, then lists the drills and
 * listen-and-repeat cards, the Phase B word cards, and gentle progress (times
 * practised + when it's due — never a score). TV is read-only: it shows a
 * synced plan and the explanations but offers no microphone practice.
 */
export function CoachingPanel() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  useEnsureTajweedCoachingLoaded();
  useEnsurePracticeLoaded();
  const state = useTajweedCoaching();
  const ready = useTajweedCoachingReady();
  const history = usePracticeHistory();
  const practiceReady = useStore(quranPracticeStore, (s) => s.isReady);
  const canPractise = isPracticeAvailable();
  const [status, setStatus] = useState<BuildStatus>("idle");
  const tried = useRef(false);

  const rebuild = useCallback(async () => {
    setStatus("building");
    try {
      setStatus(await rebuildCoachingPlan(i18n.language));
    } catch {
      setStatus("offline");
    }
  }, [i18n.language]);

  // Build once on open when a newer session exists (or there's no plan yet).
  useEffect(() => {
    if (!ready || !practiceReady || !canPractise || tried.current) return;
    tried.current = true;
    if (planIsStale(state.plan, history)) void rebuild();
  }, [canPractise, history, practiceReady, ready, rebuild, state.plan]);

  const plan = state.plan;
  const building = status === "building";

  return (
    <View style={styles.stack}>
      <Card padding="three">
        <SectionHeader
          title={t("tajweedCoaching.title")}
          icon={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
        />
        <ThemedText type="small" style={styles.gap}>
          {t("tajweedCoaching.intro")}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.gap}>
          {t("tajweedCoaching.honesty")}
        </ThemedText>
        {!canPractise ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.gap}>
            {t("tajweedCoaching.tvReadOnly")}
          </ThemedText>
        ) : null}
      </Card>

      {plan?.items.length ? (
        plan.items.map((item) => (
          <CoachingItemCard key={item.head} item={item} state={state} canPractise={canPractise} />
        ))
      ) : (
        <Card padding="three">
          <ThemedText type="small">
            {building
              ? t("tajweedCoaching.empty.building")
              : status === "offline"
                ? t("tajweedCoaching.empty.offline")
                : status === "empty"
                  ? t("tajweedCoaching.empty.nothing")
                  : t("tajweedCoaching.empty.noPractice")}
          </ThemedText>
          {canPractise && !building && status !== "offline" && status !== "empty" ? (
            <Button
              label={t("tajweedCoaching.empty.openPractice")}
              size="sm"
              variant="secondary"
              icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
              onPress={() => router.push("/quran/practice" as Href)}
              style={styles.button}
            />
          ) : null}
        </Card>
      )}

      {plan?.wordCards?.length ? (
        <View style={styles.stack}>
          <SectionHeader
            title={t("tajweedCoaching.word.title")}
            icon={{ ios: "ear", android: "hearing", web: "hearing" }}
          />
          {plan.wordCards.map((card) => (
            <WordCoachingCard
              key={`${card.surah}:${card.ayah}:${card.wordIndex}`}
              card={card}
              canPractise={canPractise}
            />
          ))}
        </View>
      ) : null}

      {canPractise ? (
        <Button
          label={building ? t("tajweedCoaching.updating") : t("tajweedCoaching.update")}
          variant="ghost"
          size="sm"
          disabled={building}
          icon={{ ios: "arrow.clockwise", android: "refresh", web: "refresh" }}
          onPress={() => void rebuild()}
          style={styles.center}
        />
      ) : null}
      {/* A refresh that failed offline keeps the stored plan — say why it didn't change. */}
      {status === "offline" && plan?.items.length ? (
        <ThemedText
          type="caption"
          themeColor="mutedForeground"
          style={styles.centerText}
          accessibilityLiveRegion="polite"
        >
          {t("tajweedCoaching.empty.offline")}
        </ThemedText>
      ) : null}

      <CoachingProgress state={state} />

      <EvidenceLinks
        titleKey="tajweedCoaching.evidence.title"
        introKey="tajweedCoaching.evidence.intro"
        refs={TAJWEED_COACHING_EVIDENCE}
      />

      <ThemedText type="caption" themeColor="mutedForeground" style={styles.centerText}>
        {t("tajweedCoaching.privacy")}
      </ThemedText>
    </View>
  );
}

function ProgressRow({
  title,
  count,
  itemKey,
  state,
}: {
  title: string;
  count: number;
  itemKey: string;
  state: TajweedCoachingState;
}) {
  const { t } = useTranslation();
  const due = useDueLabel(state, itemKey);
  return (
    <View style={styles.progressRow}>
      <ThemedText type="smallBold">{title}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {`${t("tajweedCoaching.progress.practised", { count })} · ${due}`}
      </ThemedText>
    </View>
  );
}

/** Times practised and when each sound is due again. No match rate, no score. */
export function CoachingProgress({ state }: { state: TajweedCoachingState }) {
  const { t } = useTranslation();
  const rows = [
    ...DRILL_HEAD_IDS.flatMap((id) => {
      const attempts = state.heads[id]?.attempts ?? 0;
      return attempts > 0 ? [{ id, key: id, count: attempts }] : [];
    }),
    ...LISTEN_CATEGORIES.flatMap((id) => {
      const count = state.listened?.[id]?.count ?? 0;
      return count > 0 ? [{ id, key: `listen:${id}`, count }] : [];
    }),
  ];
  if (!rows.length) return null;
  return (
    <Card padding="three">
      <SectionHeader
        title={t("tajweedCoaching.progress.title")}
        icon={{ ios: "calendar", android: "event", web: "event" }}
      />
      <View style={styles.progressList}>
        {rows.map((row) => (
          <ProgressRow
            key={row.key}
            title={TAJWEED_COACHING_GUIDE[row.id].title}
            count={row.count}
            itemKey={row.key}
            state={state}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { marginTop: Spacing.two },
  button: { marginTop: Spacing.three, alignSelf: "flex-start" },
  center: { alignSelf: "center" },
  centerText: { textAlign: "center" },
  progressList: { gap: Spacing.two, marginTop: Spacing.two },
  progressRow: { gap: Spacing.half },
});
