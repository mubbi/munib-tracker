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
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useTasbeehCounterDock } from "@/hooks/use-tasbeeh-counter-dock";
import { getDuroodByIdFrom, loadDuroodItems } from "@/lib/content-loaders";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { usePreferences } from "@/stores/preferences-store";
import { useReadingTextVisibility } from "@/stores/reading-text-visibility-store";

/** Pre-render a static HTML page for every bundled durood at web export time. */
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  const { DUROOD_ITEMS } = await import("@munib-tracker/shared/content/duroods");
  return DUROOD_ITEMS.map((item) => ({ id: item.id }));
}

/** Fallback dock height before onLayout (excludes safe-area already in ScreenLayout). */
const DOCK_BAR_FALLBACK = 72;

function paramId(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function DuroodTasbeehScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  const duroodId = paramId(params.id);
  const contentBottomInset = useContentBottomInset();
  const { width: windowWidth } = useWindowDimensions();
  // Wide web / tablets: the counter sits beside the zikr text (TV keeps its layout).
  const wide = !isTV() && windowWidth >= 1024;
  const dock = useTasbeehCounterDock();
  const { counterRef, onScroll, onCounterLayout, recompute } = dock;
  // TV: the landscape counter fits the viewport and keeps preferred focus — a
  // second floating glass dock would only add focus targets (and blur cost).
  const dockVisible = dock.dockVisible && !isTV();
  const { showTransliteration, showTranslation } = useReadingTextVisibility();
  const { fontPrefs } = usePreferences();
  const [dockBarHeight, setDockBarHeight] = useState(DOCK_BAR_FALLBACK);
  const [corpusReady, setCorpusReady] = useState(false);
  const [item, setItem] = useState<
    Awaited<ReturnType<typeof loadDuroodItems>>[number] | undefined
  >();
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
    void loadDuroodItems().then((items) => {
      if (!active) return;
      setCorpusReady(true);
      setItem(duroodId ? getDuroodByIdFrom(items, duroodId) : undefined);
    });
    return () => {
      active = false;
    };
  }, [duroodId]);

  const goBack = () => goBackOrReplace(router, "/duroods");

  if (!corpusReady) {
    return null;
  }

  if (!item) {
    return (
      <ScreenLayout title={t("tasbeeh.eyebrow")} onBack={goBack}>
        <Seo
          title={t("tasbeeh.eyebrow")}
          description={t("seo.tasbeehDurood.description")}
          index={false}
        />
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("tasbeeh.notFoundTitle")}
          description={t("tasbeeh.notFoundDesc")}
          actionLabel={t("duroods.title")}
          onAction={() => router.replace("/duroods")}
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
          description={t("seo.tasbeehDurood.description")}
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
export const generateMetadata = routeMetadata("/tasbeeh/durood/[id]");
