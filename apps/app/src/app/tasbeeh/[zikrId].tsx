import { isAfterSalahPrayer } from "@munib-tracker/shared/validators";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { TasbeehCounter } from "@/components/tasbeeh/tasbeeh-counter";
import { TasbeehCounterBar } from "@/components/tasbeeh/tasbeeh-counter-bar";
import { TasbeehReadingBlock } from "@/components/tasbeeh/tasbeeh-reading-block";
import { ZikrReciteAlongCard } from "@/components/tasbeeh/zikr-recite-along";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spacing } from "@/constants/theme";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { useAdhkarClock } from "@/hooks/use-adhkar-clock";
import { useAdhkarDayCounts } from "@/hooks/use-adhkar-day-counts";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useTasbeehCounterDock } from "@/hooks/use-tasbeeh-counter-dock";
import { resolveAfterSalahPrayer } from "@/lib/adhkar-session";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useReadingDisplay } from "@/lib/settings/reading-display";
import { zikrRecitePassages } from "@/lib/tasbeeh-voice/recite-instead";
import { isHandsFreeCounter } from "@/lib/tasbeeh-voice/steps";
import { voiceZikrFromZikr } from "@/lib/tasbeeh-voice/voice-zikr";
import { ensureZikrCorpus, getZikrById } from "@/lib/zikr";
import { zikrCountKey, zikrTarget } from "@/lib/zikr-count-key";
import { usePreferences } from "@/stores/preferences-store";

/** Fallback dock height before onLayout (excludes safe-area already in ScreenLayout). */
const DOCK_BAR_FALLBACK = 72;

function paramId(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function ZikrTasbeehScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ zikrId: string; prayer?: string }>();
  const zikrId = paramId(params.zikrId);
  const prayerParam = paramId(params.prayer);
  const contentBottomInset = useContentBottomInset();
  const { width: windowWidth } = useWindowDimensions();
  // Wide web / tablets: the counter sits beside the zikr text (TV keeps its layout).
  const wide = !isTV() && windowWidth >= 1024;
  const dock = useTasbeehCounterDock();
  const { counterRef, onScroll, onCounterLayout, recompute } = dock;
  // TV: the landscape counter fits the viewport and keeps preferred focus — a
  // second floating glass dock would only add focus targets (and blur cost).
  const dockVisible = dock.dockVisible && !isTV();
  const { showTransliteration, showTranslation } = useReadingDisplay();
  const { fontPrefs } = usePreferences();
  const [dockBarHeight, setDockBarHeight] = useState(DOCK_BAR_FALLBACK);
  const [corpusReady, setCorpusReady] = useState(false);

  useEffect(() => {
    // Visibility / size changes move the counter in the window — re-measure dock need.
    void showTransliteration;
    void showTranslation;
    void fontPrefs;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => recompute());
    });
    return () => cancelAnimationFrame(id);
  }, [fontPrefs, recompute, showTransliteration, showTranslation]);

  useEffect(() => {
    let active = true;
    void ensureZikrCorpus().then(() => {
      if (active) setCorpusReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const item = corpusReady && zikrId ? getZikrById(zikrId) : undefined;
  const { currentAfterSalah, date: adhkarDate } = useAdhkarClock();
  const day = useAdhkarDayCounts(adhkarDate);
  // After-salah counts are per salah; without one, use the current salah.
  const afterSalahPrayer =
    item?.categoryId === "after_prayer"
      ? resolveAfterSalahPrayer(
          item,
          prayerParam && isAfterSalahPrayer(prayerParam) ? prayerParam : undefined,
          currentAfterSalah,
        )
      : undefined;
  // The zikr's own repetition count — never a generic 33 (a single recitation is 1).
  const target = item ? zikrTarget(item, afterSalahPrayer) : 1;

  // Seed once per zikr from the adhkar day's stored progress (Fajr → Fajr, so
  // last night's Isha after midnight continues last night's count).
  const [count, setCount] = useState(0);
  const seededKey = useRef<string | null>(null);
  const { counts: dayCounts, ready: dayReady, setCount: writeCount } = day;
  useEffect(() => {
    if (!item || !dayReady) return;
    const key = `${day.date}|${zikrCountKey(item.id, afterSalahPrayer)}`;
    if (seededKey.current === key) return;
    seededKey.current = key;
    const stored = dayCounts[zikrCountKey(item.id, afterSalahPrayer)] ?? 0;
    setCount(Math.max(0, Math.min(stored, target)));
    // Older builds could store more than the target — clamp the record.
    if (stored > target) void writeCount(item.id, target, target, afterSalahPrayer);
  }, [afterSalahPrayer, day.date, dayCounts, dayReady, item, target, writeCount]);

  if (!corpusReady) {
    return null;
  }

  if (!item) {
    return (
      <ScreenLayout title={t("tasbeeh.eyebrow")} onBack={() => goBackOrReplace(router, "/")}>
        <Seo
          title={t("tasbeeh.eyebrow")}
          description={t("seo.tasbeehZikr.description")}
          index={false}
        />
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("tasbeeh.notFoundTitle")}
          description={t("tasbeeh.notFoundDesc")}
        />
      </ScreenLayout>
    );
  }

  const persist = (next: number) => {
    const safe = Math.max(0, target > 0 ? Math.min(next, target) : next);
    const reachedTarget = target > 0 && safe >= target && count < target;
    setCount(safe);
    void writeCount(item.id, safe, target, afterSalahPrayer);
    if (reachedTarget) {
      trackReviewInteraction("mark_zikr");
    }
  };

  const dockClearance = dockVisible
    ? Math.max(Spacing.three, dockBarHeight - contentBottomInset + Spacing.two)
    : 0;

  // Hands-free only for short repeated zikr (one breath); long adhkar stay
  // tap-counted, and Qur'anic ones offer "Recite along" instead (D68 / D69).
  const quranic = zikrRecitePassages(item.id).length > 0;
  const handsFree = !quranic && isHandsFreeCounter(item, target);
  const readingBlock = <TasbeehReadingBlock item={item} />;
  const counterCard = (
    <Card variant="plain" padding="five" style={styles.card}>
      <TasbeehCounter
        count={count}
        target={target}
        onIncrement={() => persist(count + 1)}
        onDecrement={() => persist(count - 1)}
        onReset={() => persist(0)}
        voiceZikr={handsFree ? voiceZikrFromZikr(item) : null}
      />
    </Card>
  );
  const reciteAlong = <ZikrReciteAlongCard zikrId={item.id} />;

  return (
    <View style={styles.root}>
      <ScreenLayout
        eyebrow={t("tasbeeh.eyebrow")}
        title={item.title}
        onBack={() => goBackOrReplace(router, "/")}
        scrollable
        onScroll={onScroll}
        contentStyle={dockClearance > 0 ? { paddingBottom: dockClearance } : undefined}
      >
        <Seo
          title={t("tasbeeh.eyebrow")}
          description={t("seo.tasbeehZikr.description")}
          index={false}
        />
        {wide ? (
          <View style={styles.wideRow}>
            <View style={styles.wideReading}>
              {readingBlock}
              {reciteAlong}
            </View>
            <View
              ref={counterRef}
              onLayout={onCounterLayout}
              collapsable={false}
              style={styles.wideCounter}
            >
              {counterCard}
            </View>
          </View>
        ) : (
          <>
            {readingBlock}
            <View ref={counterRef} onLayout={onCounterLayout} collapsable={false}>
              {counterCard}
            </View>
            {reciteAlong}
          </>
        )}
      </ScreenLayout>

      {dockVisible ? (
        <TasbeehCounterBar
          count={count}
          target={target}
          onIncrement={() => persist(count + 1)}
          onDecrement={() => persist(count - 1)}
          onHeightChange={setDockBarHeight}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  wideRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  wideReading: { flex: 1, minWidth: 0, gap: Spacing.three },
  wideCounter: { width: 420, flexShrink: 0 },
  card: {
    alignItems: "stretch",
    flex: 1,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/tasbeeh/[zikrId]");
