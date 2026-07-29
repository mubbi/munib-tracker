import { isAfterSalahPrayer } from "@munib-tracker/shared/validators";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { TasbeehCounter } from "@/components/tasbeeh/tasbeeh-counter";
import { TasbeehCounterBar } from "@/components/tasbeeh/tasbeeh-counter-bar";
import { TasbeehReadingBlock } from "@/components/tasbeeh/tasbeeh-reading-block";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spacing } from "@/constants/theme";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useTasbeehCounterDock } from "@/hooks/use-tasbeeh-counter-dock";
import { goBackOrReplace } from "@/lib/navigation";
import { ensureZikrCorpus, getZikrById } from "@/lib/zikr";
import { zikrCountKey } from "@/lib/zikr-count-key";
import { usePreferences } from "@/stores/preferences-store";
import { useReadingTextVisibility } from "@/stores/reading-text-visibility-store";
import { trackerStore } from "@/stores/tracker-store";

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
  const { counterRef, dockVisible, onScroll, onCounterLayout, recompute } = useTasbeehCounterDock();
  const { showTransliteration, showTranslation } = useReadingTextVisibility();
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
  const afterSalahPrayer =
    item?.categoryId === "after_prayer" && prayerParam && isAfterSalahPrayer(prayerParam)
      ? prayerParam
      : undefined;
  const target = item?.targetCount && item.targetCount > 0 ? item.targetCount : 33;

  // Seed from today's stored progress once the corpus (and thus the item) is ready.
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!item) return;
    const key = zikrCountKey(item.id, afterSalahPrayer);
    const stored = trackerStore.getState().zikrCounts[key] ?? 0;
    setCount(Math.max(0, Math.min(stored, target)));
  }, [afterSalahPrayer, item, target]);

  useEffect(() => {
    if (!item) return;
    const key = zikrCountKey(item.id, afterSalahPrayer);
    const stored = trackerStore.getState().zikrCounts[key] ?? 0;
    if (stored > target) {
      void trackerStore
        .getState()
        .setZikrCount(
          item.id,
          target,
          target,
          afterSalahPrayer ? { prayerId: afterSalahPrayer } : undefined,
        );
    }
  }, [afterSalahPrayer, item, target]);

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
    void trackerStore
      .getState()
      .setZikrCount(
        item.id,
        safe,
        target,
        afterSalahPrayer ? { prayerId: afterSalahPrayer } : undefined,
      );
    if (reachedTarget) {
      trackReviewInteraction("mark_zikr");
    }
  };

  const dockClearance = dockVisible
    ? Math.max(Spacing.three, dockBarHeight - contentBottomInset + Spacing.two)
    : 0;

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
        <TasbeehReadingBlock item={item} />

        <View ref={counterRef} onLayout={onCounterLayout} collapsable={false}>
          <Card variant="plain" padding="five" style={styles.card}>
            <TasbeehCounter
              count={count}
              target={target}
              onIncrement={() => persist(count + 1)}
              onDecrement={() => persist(count - 1)}
              onReset={() => persist(0)}
            />
          </Card>
        </View>
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
  card: {
    alignItems: "stretch",
    flex: 1,
  },
});
