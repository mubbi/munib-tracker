import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { CustomTargetModal } from "@/components/tasbeeh/custom-target-modal";
import { TasbeehCounter } from "@/components/tasbeeh/tasbeeh-counter";
import { TasbeehCounterBar } from "@/components/tasbeeh/tasbeeh-counter-bar";
import { TasbeehReadingBlock } from "@/components/tasbeeh/tasbeeh-reading-block";
import { TasbeehLoadingScreen } from "@/components/tasbeeh/tasbeeh-screen-scaffold";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Breakpoints, Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useTasbeehCounterDock } from "@/hooks/use-tasbeeh-counter-dock";
import { getDuaByIdFrom, loadDuaItems } from "@/lib/content-loaders";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useReadingDisplay } from "@/lib/settings/reading-display";
import { isHandsFreeCounter } from "@/lib/tasbeeh-voice/steps";
import { voiceZikrFromDua } from "@/lib/tasbeeh-voice/voice-zikr";
import { usePreferences } from "@/stores/preferences-store";

/** Fallback dock height before onLayout (excludes safe-area already in ScreenLayout). */
const DOCK_BAR_FALLBACK = 72;

function paramId(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * Counter for a dua that is repeated as zikr — e.g. the Laylat al-Qadr dua
 * (Tirmidhi 3513), offered from the Ramadan last-ten card. Text always comes
 * from the bundled dua dataset; short duas count hands-free (`dua:<id>`), long
 * ones stay tap-counted. The target is the user's (no number in the hadith).
 */
export default function DuaTasbeehScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  const duaId = paramId(params.id);
  const contentBottomInset = useContentBottomInset();
  const { width: windowWidth } = useWindowDimensions();
  // Wide web / tablets: the counter sits beside the zikr text (TV keeps its layout).
  const wide = !isTV() && windowWidth >= Breakpoints.wide;
  const dock = useTasbeehCounterDock();
  const { counterRef, onScroll, onCounterLayout, recompute } = dock;
  // TV: the landscape counter fits the viewport and keeps preferred focus — a
  // second floating glass dock would only add focus targets (and blur cost).
  const dockVisible = dock.dockVisible && !isTV();
  const { showTransliteration, showTranslation } = useReadingDisplay();
  const { fontPrefs } = usePreferences();
  const [dockBarHeight, setDockBarHeight] = useState(DOCK_BAR_FALLBACK);
  const [corpusReady, setCorpusReady] = useState(false);
  const [corpusFailed, setCorpusFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [item, setItem] = useState<Awaited<ReturnType<typeof loadDuaItems>>[number] | undefined>();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [customOpen, setCustomOpen] = useState(false);

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
    void attempt; // a retry re-runs the load
    setCorpusFailed(false);
    loadDuaItems().then(
      (items) => {
        if (!active) return;
        setCorpusReady(true);
        setItem(duaId ? getDuaByIdFrom(items, duaId) : undefined);
      },
      () => {
        if (active) setCorpusFailed(true);
      },
    );
    return () => {
      active = false;
    };
  }, [duaId, attempt]);

  const goBack = () => goBackOrReplace(router, "/dua");

  if (!corpusReady) {
    return (
      <TasbeehLoadingScreen
        onBack={goBack}
        failed={corpusFailed}
        onRetry={() => setAttempt((n) => n + 1)}
      />
    );
  }

  if (!item) {
    return (
      <ScreenLayout title={t("tasbeeh.eyebrow")} onBack={goBack}>
        <Seo
          title={t("tasbeeh.eyebrow")}
          description={t("seo.tasbeehDua.description")}
          index={false}
        />
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("tasbeeh.notFoundTitle")}
          description={t("tasbeeh.notFoundDesc")}
          actionLabel={t("handsFreeZikr2.dua.browse")}
          onAction={() => router.replace("/dua")}
        />
      </ScreenLayout>
    );
  }

  const dockClearance = dockVisible
    ? Math.max(Spacing.three, dockBarHeight - contentBottomInset + Spacing.two)
    : 0;

  const readingBlock = <TasbeehReadingBlock item={item} />;
  const counterCard = (
    <Card variant="plain" padding="five" style={styles.card}>
      <TasbeehCounter
        count={count}
        target={target}
        onIncrement={() => setCount((c) => (target > 0 ? Math.min(c + 1, target) : c + 1))}
        onDecrement={() => setCount((c) => Math.max(0, c - 1))}
        onReset={() => setCount(0)}
        onSelectMode={setTarget}
        onCustom={() => setCustomOpen(true)}
        keyboardShortcuts={!customOpen}
        // A long dua pause-counts once per breath: tap only.
        voiceZikr={isHandsFreeCounter(item, target) ? voiceZikrFromDua(item) : null}
      />
    </Card>
  );

  return (
    <View style={styles.root}>
      <ScreenLayout
        eyebrow={t("tasbeeh.eyebrow")}
        title={item.title}
        onBack={goBack}
        scrollable
        onScroll={onScroll}
        contentStyle={dockClearance > 0 ? { paddingBottom: dockClearance } : undefined}
      >
        <Seo
          title={t("tasbeeh.eyebrow")}
          description={t("seo.tasbeehDua.description")}
          index={false}
        />
        {wide ? (
          <View style={styles.wideRow}>
            <View style={styles.wideReading}>{readingBlock}</View>
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
          </>
        )}

        <CustomTargetModal
          visible={customOpen}
          initial={target || undefined}
          onSubmit={(next) => setTarget(next)}
          onClose={() => setCustomOpen(false)}
        />
      </ScreenLayout>

      {dockVisible ? (
        <TasbeehCounterBar
          count={count}
          target={target}
          onIncrement={() => setCount((c) => (target > 0 ? Math.min(c + 1, target) : c + 1))}
          onDecrement={() => setCount((c) => Math.max(0, c - 1))}
          onHeightChange={setDockBarHeight}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  wideRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  wideReading: { flex: 1, minWidth: 0 },
  wideCounter: { width: 420, flexShrink: 0 },
  card: {
    alignItems: "stretch",
    flex: 1,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/tasbeeh/dua/[id]");
