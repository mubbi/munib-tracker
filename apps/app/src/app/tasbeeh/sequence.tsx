import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type { AfterSalahPrayer, ObligatoryPrayer, ZikrItem } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { PartyPopper } from "@/components/tasbeeh/party-popper";
import { TasbeehCounter } from "@/components/tasbeeh/tasbeeh-counter";
import { TasbeehReadingBlock } from "@/components/tasbeeh/tasbeeh-reading-block";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { type AdhkarStep, AdhkarStepStrip } from "@/components/zikr/adhkar-step-strip";
import { ZikrHadithContext } from "@/components/zikr/zikr-hadith-context";
import { Spacing } from "@/constants/theme";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { useAdhkarClock } from "@/hooks/use-adhkar-clock";
import { useAdhkarDayCounts } from "@/hooks/use-adhkar-day-counts";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  currentStepIndex,
  loggedCount,
  nextStepIndex,
  parseSequenceEnding,
  SEQUENCE_ENDINGS,
  SEQUENCE_EVIDENCE,
  SEQUENCE_TOTAL,
  SEQUENCE_ZIKR,
  type SequenceEnding,
  seedSequenceCounts,
  sequenceCount,
  sequenceSteps,
} from "@/lib/tasbeeh/after-salah-sequence";
import type { PhraseKey } from "@/lib/tasbeeh-voice/phrases";
import { AYAT_AL_KURSI_PASSAGE } from "@/lib/tasbeeh-voice/recite-instead";
import { isHandsFreeStep } from "@/lib/tasbeeh-voice/steps";
import { voiceZikrFromZikr } from "@/lib/tasbeeh-voice/voice-zikr";
import { ensureZikrCorpus, getZikrById } from "@/lib/zikr";
import { zikrCountKey, zikrTarget } from "@/lib/zikr-count-key";

/** Pause after a phrase reaches its target before the next one (lets the haptic land). */
const ADVANCE_DELAY_MS = 650;

/** The localized phrase name of each step (UI label; the Arabic comes from the dataset). */
const STEP_PHRASE: Record<string, PhraseKey> = {
  [SEQUENCE_ZIKR.tasbih]: "subhanallah",
  [SEQUENCE_ZIKR.tahmid]: "alhamdulillah",
  [SEQUENCE_ZIKR.takbir]: "allahu_akbar",
  [SEQUENCE_ZIKR.tahlil]: "tahlil",
};

function paramValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isObligatory(value: string | undefined): value is ObligatoryPrayer {
  return value != null && (OBLIGATORY_PRAYERS as readonly string[]).includes(value);
}

/** The sequence is said after the five fard salah; Witr time logs under Isha. */
function fardFor(prayer: AfterSalahPrayer): ObligatoryPrayer {
  return isObligatory(prayer) ? prayer : "isha";
}

/**
 * After-Salah tasbeeh as one sequence (D69): SubhanAllah 33 → Alhamdulillah 33 →
 * Allahu Akbar 34 (Sahih Muslim 596), or Allahu Akbar 33 + the tahlil to
 * complete the hundred (Sahih Muslim 597). The counter moves from phrase to
 * phrase by itself — by tap, or hands-free: switched on once, the microphone
 * follows the phrases (taught pattern per phrase, else pause counting).
 *
 * Counts are logged in today's after-Salah adhkar for the chosen salah, so the
 * guided session, the after-Salah reminder and statistics all see them.
 */
export default function TasbeehSequenceScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const params = useLocalSearchParams<{ prayer?: string; ending?: string }>();
  const { width } = useWindowDimensions();
  const tv = isTV();
  const wide = !tv && width >= 1024;
  const clock = useAdhkarClock();
  const day = useAdhkarDayCounts(clock.date);

  const [corpusReady, setCorpusReady] = useState(false);
  useEffect(() => {
    let active = true;
    void ensureZikrCorpus().then(() => {
      if (active) setCorpusReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const prayerParam = paramValue(params.prayer);
  const [prayer, setPrayer] = useState<ObligatoryPrayer>(() =>
    isObligatory(prayerParam) ? prayerParam : fardFor(clock.currentAfterSalah),
  );
  const [ending, setEnding] = useState<SequenceEnding>(() =>
    parseSequenceEnding(paramValue(params.ending)),
  );
  const steps = useMemo(() => sequenceSteps(ending), [ending]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: corpusReady gates the sync corpus read
  const items = useMemo(() => steps.map((step) => getZikrById(step.zikrId)), [steps, corpusReady]);

  const dayCounts = day.counts;
  const dayCountsRef = useRef(dayCounts);
  dayCountsRef.current = dayCounts;
  const datasetTarget = useCallback(
    (item: ZikrItem | undefined) => (item ? zikrTarget(item, prayer) : 1),
    [prayer],
  );

  const [counts, setCounts] = useState<number[]>(() => steps.map(() => 0));
  const countsRef = useRef(counts);
  countsRef.current = counts;
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [burst, setBurst] = useState(0);
  // After "Start again" the run is a fresh count: it only ever adds to the log.
  const [restarted, setRestarted] = useState(false);
  const [runId, setRunId] = useState(0);

  // Seed once per day / salah / ending from what is already logged.
  const seededFor = useRef<string | null>(null);
  useEffect(() => {
    if (!corpusReady || !day.ready) return;
    const key = `${day.date}|${prayer}|${ending}`;
    if (seededFor.current === key) return;
    seededFor.current = key;
    const seeded = seedSequenceCounts(steps, (zikrId) => {
      const item = getZikrById(zikrId);
      return {
        count: dayCountsRef.current[zikrCountKey(zikrId, prayer)] ?? 0,
        target: datasetTarget(item),
      };
    });
    countsRef.current = seeded;
    setCounts(seeded);
    const current = currentStepIndex(steps, seeded);
    setFinished(current >= steps.length);
    setIndex(Math.min(current, steps.length - 1));
    setRestarted(false);
  }, [corpusReady, datasetTarget, day.date, day.ready, ending, prayer, steps]);

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  const goTo = useCallback((next: number) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
    setFinished(false);
    setIndex(next);
  }, []);

  const log = useCallback(
    (stepIndex: number, next: number, direction: "up" | "down") => {
      const step = steps[stepIndex];
      const item = items[stepIndex];
      if (!step || !item) return;
      const target = datasetTarget(item);
      const key = zikrCountKey(step.zikrId, prayer);
      const logged = dayCountsRef.current[key] ?? 0;
      const capped = loggedCount(next, target);
      if (direction === "up" ? capped > logged : !restarted && capped < logged) {
        void day.setCount(step.zikrId, capped, target, prayer);
      }
    },
    [datasetTarget, day.setCount, items, prayer, restarted, steps],
  );

  const setStepCount = useCallback(
    (stepIndex: number, next: number, direction: "up" | "down") => {
      const step = steps[stepIndex];
      if (!step) return;
      const safe = Math.max(0, Math.min(next, step.target));
      const updated = countsRef.current.slice();
      const previous = updated[stepIndex] ?? 0;
      if (safe === previous) return;
      updated[stepIndex] = safe;
      countsRef.current = updated;
      setCounts(updated);
      log(stepIndex, safe, direction);
      if (direction === "up" && safe >= step.target && previous < step.target) {
        trackReviewInteraction("mark_zikr");
        if (advanceTimer.current) clearTimeout(advanceTimer.current);
        advanceTimer.current = setTimeout(() => {
          advanceTimer.current = null;
          const nextIndex = nextStepIndex(steps, countsRef.current, stepIndex);
          if (nextIndex < 0) {
            setFinished(true);
            setBurst((value) => value + 1);
          } else {
            setIndex(nextIndex);
          }
        }, ADVANCE_DELAY_MS);
      }
    },
    [log, steps],
  );

  const restart = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
    const zero = steps.map(() => 0);
    countsRef.current = zero;
    setCounts(zero);
    setIndex(0);
    setFinished(false);
    setRestarted(true);
    // A fresh counter: hands-free does not reopen by itself after a finished run.
    setRunId((value) => value + 1);
  };

  const changePrayer = (next: ObligatoryPrayer) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setPrayer(next);
  };
  const changeEnding = (next: SequenceEnding) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setEnding(next);
  };

  const phraseLabel = useCallback(
    (stepIndex: number) => {
      const step = steps[stepIndex];
      const phrase = step ? STEP_PHRASE[step.zikrId] : undefined;
      return phrase ? t(`tasbeehVoice.phrase.${phrase}`) : "";
    },
    [steps, t],
  );
  const summary = steps
    .map((step, i) =>
      t("handsFreeZikr.sequence.stepSummary", { phrase: phraseLabel(i), times: step.target }),
    )
    .join(" · ");

  const seo = (
    <Seo
      path="/tasbeeh/sequence"
      title={t("handsFreeZikr.sequence.title")}
      description={t("seo.tasbeehZikr.description")}
      index={false}
    />
  );

  const back = () => goBackOrReplace(router, "/tasbeeh/free");

  if (!corpusReady) return null;

  const safeIndex = Math.min(index, steps.length - 1);
  const step = steps[safeIndex];
  const item = items[safeIndex];
  const count = Math.min(counts[safeIndex] ?? 0, step.target);
  const done = sequenceCount(steps, counts);

  const stripSteps: AdhkarStep[] = steps.map((s, i) => ({
    id: s.zikrId,
    title: phraseLabel(i),
    done: (counts[i] ?? 0) >= s.target,
    started: (counts[i] ?? 0) > 0,
    optional: false,
    count: Math.min(counts[i] ?? 0, s.target),
    target: s.target,
  }));

  const evidence = SEQUENCE_EVIDENCE[ending];
  const settings = (
    <View style={styles.settings}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("handsFreeZikr.sequence.prayerLabel")}
      </ThemedText>
      <SegmentedControl
        options={OBLIGATORY_PRAYERS.map((p) => ({ id: p, label: t(`prayers.${p}`) }))}
        value={prayer}
        onChange={changePrayer}
      />
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("handsFreeZikr.sequence.endingLabel")}
      </ThemedText>
      <SegmentedControl
        options={SEQUENCE_ENDINGS.map((id) => ({
          id,
          label:
            id === "takbir34"
              ? t("handsFreeZikr.sequence.stepSummary", {
                  phrase: t("tasbeehVoice.phrase.allahu_akbar"),
                  times: 34,
                })
              : t("handsFreeZikr.sequence.endingTahlil", {
                  phrase: t("tasbeehVoice.phrase.tahlil"),
                }),
        }))}
        value={ending}
        onChange={changeEnding}
      />
      <ThemedText type="caption" themeColor="mutedForeground">
        {t(`handsFreeZikr.sequence.evidence.${ending}`, { reference: evidence.reference })}
      </ThemedText>
    </View>
  );

  const doneCard = finished ? (
    <Card variant="muted" padding="four" style={styles.doneCard}>
      <PartyPopper
        burstKey={burst}
        colors={[colors.accent, tokens.status.success.color, tokens.status.warning.color]}
      />
      <ThemedText type="subtitle" style={styles.center}>
        {t("zikrSession.allDoneTitle")}
      </ThemedText>
      <ThemedText type="small" themeColor="mutedForeground" style={styles.center}>
        {t("handsFreeZikr.sequence.doneBody", { prayer: t(`prayers.${prayer}`) })}
      </ThemedText>
      <View style={styles.doneActions}>
        <Button
          label={t("zikrSession.finish")}
          icon={{ ios: "checkmark.seal.fill", android: "verified", web: "verified" }}
          onPress={back}
          preferredFocus={tv}
          style={styles.flex}
        />
        <Button
          label={t("tasbeehUi.startAgain")}
          variant="secondary"
          onPress={restart}
          style={styles.flex}
        />
      </View>
      {/* The next sunnah after the tasbeeh: Ayat al-Kursi after each Salah (D68). */}
      <ReciteAlongButton
        passage={AYAT_AL_KURSI_PASSAGE}
        label={t("handsFreeZikr2.sequence.reciteKursi")}
        variant="ghost"
        fullWidth
      />
    </Card>
  ) : null;

  const counterCard = (
    <Card variant="plain" padding="five" style={styles.card}>
      <ThemedText type="smallBold" style={styles.center} accessibilityLiveRegion="polite">
        {t("handsFreeZikr.sequence.progress", { done, total: SEQUENCE_TOTAL })}
      </ThemedText>
      <TasbeehCounter
        key={runId}
        count={count}
        target={step.target}
        onIncrement={() => setStepCount(safeIndex, (countsRef.current[safeIndex] ?? 0) + 1, "up")}
        onDecrement={() => setStepCount(safeIndex, (countsRef.current[safeIndex] ?? 0) - 1, "down")}
        onReset={() => setStepCount(safeIndex, 0, "down")}
        // Short repeated phrases listen; the single closing tahlil is tapped once recited.
        voiceZikr={item && isHandsFreeStep(item, step.target) ? voiceZikrFromZikr(item) : null}
        voiceContinuous
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
        {t("handsFreeZikr.sequence.handsFreeHint")}
      </ThemedText>
    </Card>
  );

  const reading = item ? (
    <>
      <TasbeehReadingBlock item={item} />
      <ZikrHadithContext item={getZikrById(evidence.zikrId) ?? item} />
    </>
  ) : null;

  return (
    <ScreenLayout
      eyebrow={t("tasbeeh.eyebrow")}
      title={t("handsFreeZikr.sequence.title")}
      subtitle={summary}
      onBack={back}
      scrollable
    >
      {seo}
      {doneCard}
      {settings}
      <AdhkarStepStrip steps={stripSteps} activeIndex={safeIndex} onSelect={goTo} />
      {wide ? (
        <View style={styles.wideRow}>
          <View style={styles.wideReading}>{reading}</View>
          <View style={styles.wideCounter}>{counterCard}</View>
        </View>
      ) : (
        <>
          {item ? <TasbeehReadingBlock item={item} /> : null}
          {counterCard}
          {item ? <ZikrHadithContext item={getZikrById(evidence.zikrId) ?? item} /> : null}
        </>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: "center" },
  settings: { gap: Spacing.two },
  card: { alignItems: "stretch", gap: Spacing.three },
  doneCard: { alignItems: "center", gap: Spacing.two, overflow: "visible" },
  doneActions: {
    flexDirection: "row",
    gap: Spacing.two,
    alignSelf: "stretch",
    marginTop: Spacing.two,
  },
  wideRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  wideReading: { flex: 1, minWidth: 0, gap: Spacing.three },
  wideCounter: { width: 420, flexShrink: 0 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/tasbeeh/sequence");
