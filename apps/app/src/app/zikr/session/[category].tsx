import { ZIKR_CATEGORY_IDS } from "@munib-tracker/shared/constants";
import type { AfterSalahPrayer, ZikrCategoryId } from "@munib-tracker/shared/types";
import { parseLocalDateString } from "@munib-tracker/shared/utils";
import { isAfterSalahPrayer, isZikrCategoryId } from "@munib-tracker/shared/validators";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollViewInstance, StyleSheet, useWindowDimensions, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ReadingTypographyBar } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { PartyPopper } from "@/components/tasbeeh/party-popper";
import { VoiceStepPanel, VoiceStepToggle } from "@/components/tasbeeh/voice/voice-step-panel";
import { ZikrReciteAlongButtons } from "@/components/tasbeeh/zikr-recite-along";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import {
  type AdhkarCounterControls,
  AdhkarCounterPanel,
} from "@/components/zikr/adhkar-counter-panel";
import { AdhkarReadingCard } from "@/components/zikr/adhkar-reading-card";
import { AdhkarSessionDock } from "@/components/zikr/adhkar-session-dock";
import { AdhkarStepList } from "@/components/zikr/adhkar-step-list";
import { type AdhkarStep, AdhkarStepStrip } from "@/components/zikr/adhkar-step-strip";
import { AfterSalahPrayerChips } from "@/components/zikr/after-salah-prayer-chips";
import { ZikrHadithContext } from "@/components/zikr/zikr-hadith-context";
import { Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { useAdhkarClock } from "@/hooks/use-adhkar-clock";
import { useAdhkarDayCounts } from "@/hooks/use-adhkar-day-counts";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useVoiceTasbeehSteps } from "@/hooks/use-voice-tasbeeh-steps";
import { isWebInteractiveTarget, useWebScreenKeyHandler } from "@/hooks/use-web-key-handler";
import {
  type AdhkarScope,
  adhkarScopeState,
  afterSalahScopeStates,
  completeAllEntries,
  firstPendingIndex,
  isSessionItemOptional,
  nextPendingIndex,
  scopePrayerKey,
  sessionItemCount,
  sessionItems,
  sessionItemTarget,
} from "@/lib/adhkar-session";
import { useIsChildDevice } from "@/lib/circles/child-session";
import { kidsSessionItems } from "@/lib/circles/kids-content";
import { triggerHaptic } from "@/lib/haptics";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { isRTL } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { isSequenceZikrId } from "@/lib/tasbeeh/after-salah-sequence";
import { zikrRecitePassages } from "@/lib/tasbeeh-voice/recite-instead";
import { isHandsFreeStep } from "@/lib/tasbeeh-voice/steps";
import { voiceZikrFromZikr } from "@/lib/tasbeeh-voice/voice-zikr";
import { ensureZikrCorpus } from "@/lib/zikr";
import { zikrCountKey } from "@/lib/zikr-count-key";
import { zikrQuranHref } from "@/lib/zikr-quran";
import { useFavoriteZikrIds, usePreferencesActions } from "@/stores/preferences-store";

/** Pause after a zikr reaches its target before moving on (lets the haptic land). */
const ADVANCE_DELAY_MS = 650;
/** Fallback dock height before onLayout. */
const DOCK_FALLBACK = 170;
/** Two panes (reading | counter + outline) from here up, and always on TV. */
const WIDE_BREAKPOINT = 1024;
const SESSION_MAX_WIDTH = 1280;
const PANEL_WIDTH = 380;

function paramValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Pre-render one static page per category at web export time. */
export function generateStaticParams(): Array<{ category: string }> {
  return ZIKR_CATEGORY_IDS.map((id) => ({ category: id }));
}

/**
 * Guided adhkar session: every zikr of a set (morning, evening, before sleep,
 * or one salah's after-salah adhkar) on one screen with the counter built in.
 * Reaching a zikr's target moves straight on to the next pending one, so the
 * rhythm is never broken by list → tasbeeh → back navigation.
 *
 * Layout: phones / portrait tablets read in one column with a thumb-reach
 * counter dock; wide web, landscape tablets and TV split into the reading pane
 * and a fixed counter panel with the whole set outlined by name.
 */
export default function AdhkarSessionScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const { width } = useWindowDimensions();
  const wide = tv || width >= WIDE_BREAKPOINT;
  const params = useLocalSearchParams<{
    category: string | string[];
    prayer?: string | string[];
    start?: string | string[];
  }>();
  const clock = useAdhkarClock();
  // Logged under the adhkar day (Fajr → Fajr): last night's Isha after midnight
  // still lands on last night's date, so calendar and stats stay correct.
  const day = useAdhkarDayCounts(clock.date);
  const counts = day.counts;
  const countsRef = useRef(counts);
  countsRef.current = counts;
  const favoriteIds = useFavoriteZikrIds();
  const { toggleFavorite } = usePreferencesActions();
  const contentBottomInset = useContentBottomInset();
  const scrollRef = useRef<ScrollViewInstance>(null);

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

  const categoryParam = paramValue(params.category) ?? "";
  const categoryId: ZikrCategoryId = isZikrCategoryId(categoryParam) ? categoryParam : "morning";
  const isAfterSalah = categoryId === "after_prayer";
  const prayerParam = paramValue(params.prayer);
  const linkedPrayer = prayerParam && isAfterSalahPrayer(prayerParam) ? prayerParam : null;
  const startId = paramValue(params.start);

  const [prayer, setPrayer] = useState<AfterSalahPrayer>(
    () => linkedPrayer ?? clock.currentAfterSalah,
  );
  useEffect(() => {
    if (linkedPrayer) setPrayer(linkedPrayer);
  }, [linkedPrayer]);

  const scope = useMemo<AdhkarScope>(
    () => (isAfterSalah ? { categoryId, prayer } : { categoryId }),
    [categoryId, isAfterSalah, prayer],
  );
  const prayerId = scopePrayerKey(scope);
  const scopeKey = `${categoryId}:${prayerId ?? ""}`;
  // Kids mode (D27): a child device sees only the curated adhkar of the set.
  const childDevice = useIsChildDevice();
  // biome-ignore lint/correctness/useExhaustiveDependencies: corpusReady gates the sync corpus read
  const items = useMemo(() => {
    const all = sessionItems(scope);
    return childDevice ? kidsSessionItems(all) : all;
  }, [scope, corpusReady, childDevice]);

  const [advancing, setAdvancing] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [burst, setBurst] = useState(0);

  // Position: the linked zikr on first open, else the first one still pending.
  const [index, setIndex] = useState(0);
  const seededFor = useRef<string | null>(null);
  useEffect(() => {
    if (items.length === 0 || seededFor.current === scopeKey) return;
    const linked =
      seededFor.current === null && startId ? items.findIndex((i) => i.id === startId) : -1;
    seededFor.current = scopeKey;
    setIndex(linked >= 0 ? linked : firstPendingIndex(items, countsRef.current, scope));
    setCelebrate(false);
  }, [items, scope, scopeKey, startId]);

  const safeIndex = Math.min(index, Math.max(0, items.length - 1));
  const item = items[safeIndex];
  const target = item ? sessionItemTarget(item, scope) : 1;
  const optional = item ? isSessionItemOptional(item, scope) : false;
  const storedCount = item ? Math.min(sessionItemCount(item, counts, scope), target) : 0;
  // Store writes are queued (async), so rapid taps could read a stale count from
  // the last render and drop a recitation. Track the latest written value
  // synchronously and count from it until the store catches up.
  const itemKey = item ? zikrCountKey(item.id, prayerId) : "";
  const liveCount = useRef<{ key: string; value: number } | null>(null);
  if (
    liveCount.current &&
    liveCount.current.key === itemKey &&
    liveCount.current.value === storedCount
  ) {
    liveCount.current = null;
  }
  const count = liveCount.current?.key === itemKey ? liveCount.current.value : storedCount;

  const state = useMemo(
    () => adhkarScopeState(scope, counts, clock.now, clock.times, items),
    [clock.now, clock.times, counts, items, scope],
  );
  const chipStates = useMemo(
    () => (isAfterSalah ? afterSalahScopeStates(counts, clock.now, clock.times) : null),
    [clock.now, clock.times, counts, isAfterSalah],
  );
  const allDone = state.total > 0 && state.completed >= state.total;

  const steps = useMemo<AdhkarStep[]>(
    () =>
      items.map((entry) => {
        const n = sessionItemCount(entry, counts, scope);
        const stepTarget = sessionItemTarget(entry, scope);
        return {
          id: entry.id,
          title: entry.title,
          done: n >= stepTarget,
          started: n > 0,
          optional: isSessionItemOptional(entry, scope),
          count: n,
          target: stepTarget,
        };
      }),
    [counts, items, scope],
  );

  // "Next: …" — the zikr auto-advance will land on, so the reader can anticipate it.
  const nextIndex = item ? nextPendingIndex(items, counts, scope, safeIndex) : -1;
  const nextItem = nextIndex >= 0 && nextIndex !== safeIndex ? items[nextIndex] : undefined;
  const nextTarget = nextItem ? sessionItemTarget(nextItem, scope) : 0;
  const nextLabel = nextItem
    ? t("zikrSession.nextUp", {
        title: nextItem.title,
        times: nextTarget > 1 ? `×${nextTarget}` : t("zikrSession.once"),
      })
    : undefined;

  // ── Advancing ────────────────────────────────────────────────────────────
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      setAdvancing(false);
      setIndex(next);
      scrollToTop();
    },
    [scrollToTop],
  );

  const scheduleAdvance = useCallback(
    (fromIndex: number, delay = ADVANCE_DELAY_MS) => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      setAdvancing(true);
      advanceTimer.current = setTimeout(() => {
        advanceTimer.current = null;
        setAdvancing(false);
        // Read fresh counts — the write that triggered this has landed by now.
        // The tapped zikr's count may not have round-tripped through storage yet.
        const live = liveCount.current;
        const latest = live ? { ...countsRef.current, [live.key]: live.value } : countsRef.current;
        const next = nextPendingIndex(items, latest, scope, fromIndex);
        if (next < 0) {
          setCelebrate(true);
          setBurst((key) => key + 1);
        } else {
          setIndex(next);
        }
        scrollToTop();
      }, delay);
    },
    [items, scope, scrollToTop],
  );

  const write = useCallback(
    (next: number) => {
      if (!item) return;
      const safe = Math.max(0, Math.min(next, target));
      liveCount.current = { key: itemKey, value: safe };
      void day.setCount(item.id, safe, target, prayerId);
    },
    [day.setCount, item, itemKey, prayerId, target],
  );

  const onTap = useCallback(() => {
    if (!item || advancing) return;
    // Read the live value at call time — this closure may predate the last tap.
    const current = liveCount.current?.key === itemKey ? liveCount.current.value : storedCount;
    if (current >= target) return;
    const next = current + 1;
    write(next);
    if (next >= target) {
      trackReviewInteraction("mark_zikr");
      scheduleAdvance(safeIndex);
    }
  }, [advancing, item, itemKey, safeIndex, scheduleAdvance, storedCount, target, write]);

  const onComplete = useCallback(() => {
    if (!item) return;
    write(target);
    trackReviewInteraction("mark_zikr");
    scheduleAdvance(safeIndex, 350);
  }, [item, safeIndex, scheduleAdvance, target, write]);

  // Hands-free (D69): each short repeated zikr listens for itself; a voice count
  // takes the same path as a tap (haptic, target, auto-advance), so a tap still
  // corrects any miscount (D51). The mic closes between steps and when done.
  const voiceZikr = useMemo(() => (item ? voiceZikrFromZikr(item) : null), [item]);
  const voiceTapRef = useRef(onTap);
  voiceTapRef.current = onTap;
  const voiceCountRef = useRef({ count, target });
  voiceCountRef.current = { count, target };
  const handsFree = useVoiceTasbeehSteps({
    zikr: voiceZikr,
    eligible: item ? isHandsFreeStep(item, target) : false,
    count,
    target,
    active: !advancing && !(celebrate && allDone),
    onVoiceCount: () => {
      const latest = voiceCountRef.current;
      triggerHaptic(latest.count + 1 >= latest.target ? "success" : "light");
      voiceTapRef.current();
    },
  });

  const [confirm, setConfirm] = useState<"reset" | "all" | null>(null);

  const markAll = () => {
    void day.setCounts(completeAllEntries(items, scope));
    trackReviewInteraction("mark_zikr");
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setAdvancing(false);
    setCelebrate(true);
    setBurst((key) => key + 1);
    scrollToTop();
  };

  const canPrev = safeIndex > 0;
  const canNext = safeIndex < items.length - 1;

  // Desktop web: Space / Enter count, ← / → move between adhkar.
  useWebScreenKeyHandler(
    (event) => {
      if (isWebInteractiveTarget(event.target)) return undefined;
      if (event.key === " " || event.key === "Enter") {
        if (!event.repeat) onTap();
        return true;
      }
      const forward = isRTL() ? "ArrowLeft" : "ArrowRight";
      const backward = isRTL() ? "ArrowRight" : "ArrowLeft";
      if (event.key === forward && canNext) {
        goTo(safeIndex + 1);
        return true;
      }
      if (event.key === backward && canPrev) {
        goTo(safeIndex - 1);
        return true;
      }
      return undefined;
    },
    !tv && confirm === null,
  );

  const [dockHeight, setDockHeight] = useState(DOCK_FALLBACK);
  const dockClearance = wide
    ? 0
    : Math.max(Spacing.three, dockHeight - contentBottomInset + Spacing.three);

  const categoryName = t(`zikrCat.${categoryId}`);
  const setName = isAfterSalah
    ? t("zikrSession.afterPrayerEyebrow", { prayer: t(`prayers.${prayer}`) })
    : categoryName;
  const backHref = (
    isAfterSalah ? `/zikr/after_prayer?prayer=${prayer}` : `/zikr/${categoryId}`
  ) as Href;

  if (!corpusReady) return null;

  const statusLabel = t(`zikrSession.status.${state.status}`);
  const statusColor =
    state.status === "done"
      ? tokens.status.success.color
      : state.status === "missed"
        ? tokens.status.warning.color
        : state.status === "upcoming"
          ? colors.mutedForeground
          : colors.accent;
  const quranHref = item ? zikrQuranHref(item.id) : null;
  // After-Salah tasbeeh phrases: count all of them as one 33 / 33 / 34 sequence (D69).
  const sequenceLink = isAfterSalah && item != null && isSequenceZikrId(item.id);
  // Qur'anic steps (Ayat al-Kursi, the Quls …): recite along on-device (D68); the
  // step itself stays tap-counted. The practice session is pushed, so finishing or
  // going back lands on this same step.
  const reciteLink = item != null && zikrRecitePassages(item.id).length > 0;
  const isFavorite = item ? favoriteIds.includes(item.id) : false;

  const controls: AdhkarCounterControls = {
    count,
    target,
    advancing,
    onTap,
    onUndo: () => write(count - 1),
    onComplete,
    onReset: () => setConfirm("reset"),
    onPrev: () => canPrev && goTo(safeIndex - 1),
    onNext: () => canNext && goTo(safeIndex + 1),
    canPrev,
    canNext,
    nextLabel,
    voiceToggle: <VoiceStepToggle steps={handsFree} />,
    voicePanel: (
      <VoiceStepPanel steps={handsFree} label={item?.title ?? null} hasNext={nextItem != null} />
    ),
  };

  const chips =
    isAfterSalah && chipStates ? (
      <AfterSalahPrayerChips
        selected={prayer}
        onSelect={setPrayer}
        states={chipStates}
        current={clock.currentAfterSalah}
      />
    ) : null;

  const summary = (
    <View style={styles.summary}>
      <View style={styles.summaryRow}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <ThemedText type="smallBold" style={{ color: statusColor }}>
          {statusLabel}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.flex}>
          {t("zikrSession.progressShort", { completed: state.completed, total: state.total })}
        </ThemedText>
        {!allDone ? (
          <PressableScale
            haptic="selection"
            accessibilityRole="button"
            accessibilityHint={t("zikrSession.markAllHint")}
            onPress={() => setConfirm("all")}
            style={[
              styles.linkButton,
              tv && styles.linkButtonTv,
              { backgroundColor: colors.muted },
            ]}
          >
            <ThemedText type="caption" style={{ color: colors.accentText, fontWeight: "600" }}>
              {t("zikrSession.markAll")}
            </ThemedText>
          </PressableScale>
        ) : null}
      </View>
      {!day.isToday ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("zikrSession.loggingPreviousDay", {
            date: parseLocalDateString(day.date).toLocaleDateString(i18n.language, {
              weekday: "long",
              day: "numeric",
              month: "short",
            }),
          })}
        </ThemedText>
      ) : null}
      {wide ? (
        <ProgressBar
          value={state.total > 0 ? state.completed / state.total : 0}
          height={5}
          color={allDone ? tokens.status.success.color : undefined}
        />
      ) : null}
    </View>
  );

  const doneCard =
    celebrate && allDone ? (
      <Card variant="muted" padding="four" style={styles.doneCard}>
        <PartyPopper
          burstKey={burst}
          colors={[colors.accent, tokens.status.success.color, tokens.status.warning.color]}
        />
        <ThemedText type="subtitle" style={styles.center}>
          {t("zikrSession.allDoneTitle")}
        </ThemedText>
        <ThemedText type="small" themeColor="mutedForeground" style={styles.center}>
          {t("zikrSession.allDoneBody", { total: state.total, set: setName })}
        </ThemedText>
        <View style={styles.doneActions}>
          <Button
            label={t("zikrSession.finish")}
            icon={{ ios: "checkmark.seal.fill", android: "verified", web: "verified" }}
            onPress={() => goBackOrReplace(router, backHref)}
            preferredFocus={tv}
            style={styles.flex}
          />
          <Button
            label={t("zikrSession.review")}
            variant="secondary"
            onPress={() => setCelebrate(false)}
            style={styles.flex}
          />
        </View>
      </Card>
    ) : null;

  const readingCard = item ? (
    <AdhkarReadingCard
      item={item}
      position={safeIndex + 1}
      total={items.length}
      target={target}
      done={count >= target}
      optional={optional}
      emphasis={wide}
      actions={
        <>
          <IconButton
            name={
              isFavorite
                ? { ios: "star.fill", android: "star", web: "star" }
                : { ios: "star", android: "star_border", web: "star_border" }
            }
            size={18}
            hitTarget={tv ? TvLayout.minFocusTargetDp : 40}
            tintColor={isFavorite ? tokens.status.warning.color : colors.mutedForeground}
            accessibilityLabel={isFavorite ? t("zikr.removeFavorite") : t("zikr.favorite")}
            accessibilityState={{ selected: isFavorite }}
            haptic="selection"
            onPress={() => toggleFavorite(item.id)}
          />
          <IconButton
            name={{ ios: "info.circle", android: "info", web: "info" }}
            size={18}
            hitTarget={tv ? TvLayout.minFocusTargetDp : 40}
            tintColor={colors.mutedForeground}
            accessibilityLabel={t("zikrSession.details")}
            onPress={() =>
              router.push({
                pathname: "/zikr/detail/[id]",
                params: prayerId ? { id: item.id, prayer: prayerId } : { id: item.id },
              })
            }
          />
        </>
      }
      footer={
        quranHref || sequenceLink || reciteLink ? (
          <View style={styles.footerLinks}>
            {reciteLink && item ? <ZikrReciteAlongButtons zikrId={item.id} /> : null}
            {quranHref ? (
              <Button
                label={t("zikrSession.openQuran")}
                variant="ghost"
                size="sm"
                icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
                onPress={() => router.push(quranHref)}
              />
            ) : null}
            {sequenceLink ? (
              <Button
                label={t("handsFreeZikr.sequence.openFromSession")}
                variant="ghost"
                size="sm"
                icon={{
                  ios: "circle.dotted",
                  android: "radio_button_checked",
                  web: "radio_button_checked",
                }}
                onPress={() => router.push({ pathname: "/tasbeeh/sequence", params: { prayer } })}
              />
            ) : null}
          </View>
        ) : null
      }
    />
  ) : null;

  // Phones keep the zikr itself as high as possible; text settings follow it.
  const typography = <ReadingTypographyBar surface="dua_zikr" textVisibility />;
  const readingColumn: ReactNode = (
    <>
      {doneCard}
      {wide ? typography : null}
      {readingCard}
      {item ? <ZikrHadithContext item={item} /> : null}
      {wide ? null : typography}
    </>
  );

  const empty = (
    <EmptyState
      icon={{ ios: "heart", android: "favorite_border", web: "favorite_border" }}
      title={t("zikr.emptyTitle")}
      description={t("zikr.emptyDesc")}
    />
  );

  const header = {
    eyebrow: isAfterSalah ? categoryName : t("zikrSession.sessionEyebrow"),
    title: setName,
  };

  const seo = (
    <Seo
      path={`/zikr/session/${categoryId}`}
      title={categoryName}
      description={t("zikrSession.seoDescription", { category: categoryName })}
      index={false}
    />
  );

  const dialog = (
    <ConfirmDialog
      visible={confirm !== null}
      title={
        confirm === "all" ? t("zikrSession.confirmAllTitle") : t("zikrSession.confirmResetTitle")
      }
      message={
        confirm === "all"
          ? t("zikrSession.confirmAllMessage", { set: setName })
          : t("zikrSession.confirmResetMessage")
      }
      confirmLabel={confirm === "all" ? t("zikrSession.markAll") : t("zikrSession.markNotDone")}
      destructive={confirm === "reset"}
      onConfirm={() => {
        if (confirm === "all") markAll();
        else write(0);
      }}
      onClose={() => setConfirm(null)}
    />
  );

  // ── Wide web / landscape tablet / TV: reading pane + fixed counter panel ──
  if (wide) {
    return (
      <View style={styles.root}>
        <ScreenLayout
          {...header}
          onBack={() => goBackOrReplace(router, backHref)}
          scrollable={false}
          maxContentWidth={tv ? TvLayout.listDetailMaxWidth : SESSION_MAX_WIDTH}
        >
          {seo}
          {chips ? <View style={styles.wideChips}>{chips}</View> : null}
          {items.length === 0 ? (
            empty
          ) : (
            <View style={styles.wideRow}>
              <TvScrollView
                ref={scrollRef}
                style={styles.wideReading}
                contentContainerStyle={[
                  styles.wideReadingContent,
                  { paddingBottom: contentBottomInset + Spacing.four },
                ]}
                showsVerticalScrollIndicator={false}
              >
                {readingColumn}
              </TvScrollView>
              <View
                style={[styles.panel, tv && styles.panelTv, { borderStartColor: tokens.hairline }]}
              >
                <TvScrollView
                  style={styles.flex}
                  contentContainerStyle={[
                    styles.panelContent,
                    { paddingBottom: contentBottomInset + Spacing.four },
                  ]}
                  showsVerticalScrollIndicator={false}
                >
                  {summary}
                  {item ? <AdhkarCounterPanel {...controls} /> : null}
                  <View style={[styles.outline, { borderTopColor: tokens.hairline }]}>
                    <ThemedText
                      type="caption"
                      themeColor="mutedForeground"
                      style={styles.outlineTitle}
                    >
                      {t("zikrSession.outline", { total: items.length })}
                    </ThemedText>
                    <AdhkarStepList steps={steps} activeIndex={safeIndex} onSelect={goTo} />
                  </View>
                </TvScrollView>
              </View>
            </View>
          )}
        </ScreenLayout>
        {dialog}
      </View>
    );
  }

  // ── Phone / portrait tablet: one column + thumb-reach counter dock ────────
  return (
    <View style={styles.root}>
      <ScreenLayout
        {...header}
        onBack={() => goBackOrReplace(router, backHref)}
        scrollable
        scrollRef={scrollRef}
        contentStyle={dockClearance > 0 ? { paddingBottom: dockClearance } : undefined}
      >
        {seo}
        {chips}
        {items.length === 0 ? (
          empty
        ) : (
          <>
            {summary}
            <AdhkarStepStrip steps={steps} activeIndex={safeIndex} onSelect={goTo} />
            {readingColumn}
          </>
        )}
      </ScreenLayout>
      {item ? <AdhkarSessionDock {...controls} onHeightChange={setDockHeight} /> : null}
      {dialog}
    </View>
  );
}

const styles = StyleSheet.create({
  footerLinks: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: Spacing.one },
  root: { flex: 1 },
  flex: { flex: 1 },
  center: { textAlign: "center" },
  doneCard: { alignItems: "center", gap: Spacing.two, overflow: "visible" },
  doneActions: {
    flexDirection: "row",
    gap: Spacing.two,
    alignSelf: "stretch",
    marginTop: Spacing.two,
  },
  summary: { gap: Spacing.two },
  summaryRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  linkButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: 999,
    minHeight: 32,
    justifyContent: "center",
  },
  linkButtonTv: { minHeight: TvLayout.minFocusTarget, paddingHorizontal: Spacing.four },
  wideChips: { marginBottom: Spacing.three },
  wideRow: { flex: 1, minHeight: 0, flexDirection: "row", gap: Spacing.four },
  wideReading: { flex: 1, minWidth: 0 },
  wideReadingContent: { gap: Spacing.three, paddingEnd: Spacing.one },
  panel: {
    width: PANEL_WIDTH,
    flexShrink: 0,
    borderStartWidth: StyleSheet.hairlineWidth,
  },
  panelTv: { width: TvLayout.detailPaneMinWidth },
  panelContent: { paddingStart: Spacing.four, gap: Spacing.four },
  outline: {
    gap: Spacing.two,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  outlineTitle: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontWeight: "600",
    paddingHorizontal: Spacing.two,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/zikr/session/[category]");
