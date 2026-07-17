import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { ReferenceLine } from "@/components/content/reference-line";
import { ReadingTypographyBar } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { CustomTargetModal } from "@/components/tasbeeh/custom-target-modal";
import { TasbeehCounter } from "@/components/tasbeeh/tasbeeh-counter";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spacing } from "@/constants/theme";
import { getDuroodByIdFrom, loadDuroodItems } from "@/lib/content-loaders";
import { goBackOrReplace } from "@/lib/navigation";
import { arabicReadingLayout, resolveReadingFontSizes } from "@/lib/reading-typography";
import { usePreferences } from "@/stores/preferences-store";

/** Pre-render a static HTML page for every bundled durood at web export time. */
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  const { DUROOD_ITEMS } = await import("@munib-tracker/shared/content/duroods");
  return DUROOD_ITEMS.map((item) => ({ id: item.id }));
}

function paramId(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function DuroodTasbeehScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  const duroodId = paramId(params.id);
  const { fontPrefs } = usePreferences();
  const [corpusReady, setCorpusReady] = useState(false);
  const [item, setItem] = useState<
    Awaited<ReturnType<typeof loadDuroodItems>>[number] | undefined
  >();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [customOpen, setCustomOpen] = useState(false);

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

  const readingSizes = resolveReadingFontSizes("dua_zikr", fontPrefs);
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

  return (
    <ScreenLayout eyebrow={t("tasbeeh.eyebrow")} title={item.title} onBack={goBack} scrollable>
      <Seo
        title={t("tasbeeh.eyebrow")}
        description={t("seo.tasbeehDurood.description")}
        index={false}
      />
      <ReadingTypographyBar surface="dua_zikr" />
      <Card variant="muted" padding="four" style={styles.reading}>
        <ThemedText
          type="arabic"
          style={[styles.arabic, arabicReadingLayout(readingSizes.arabic, "center")]}
        >
          {item.arabic}
        </ThemedText>
        {item.transliteration ? (
          <ThemedText
            type="caption"
            themeColor="mutedForeground"
            style={[
              styles.translit,
              {
                fontSize: readingSizes.transliteration,
                lineHeight: readingSizes.transliteration * 1.35,
              },
            ]}
          >
            {item.transliteration}
          </ThemedText>
        ) : null}
        {item.reference ? (
          <ReferenceLine reference={item.reference} style={styles.reference} />
        ) : null}
      </Card>

      <Card variant="plain" padding="five" style={styles.card}>
        <TasbeehCounter
          count={count}
          target={target}
          onIncrement={() => setCount((c) => (target > 0 ? Math.min(c + 1, target) : c + 1))}
          onDecrement={() => setCount((c) => Math.max(0, c - 1))}
          onReset={() => setCount(0)}
          onSelectMode={setTarget}
          onCustom={() => setCustomOpen(true)}
        />
      </Card>

      <CustomTargetModal
        visible={customOpen}
        initial={target || undefined}
        onSubmit={(next) => setTarget(next)}
        onClose={() => setCustomOpen(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  reading: {
    alignItems: "center",
    marginBottom: Spacing.one,
  },
  arabic: {
    textAlign: "center",
    writingDirection: "rtl",
  },
  translit: {
    textAlign: "center",
    marginTop: Spacing.two,
    fontStyle: "italic",
    maxWidth: 320,
  },
  reference: {
    textAlign: "center",
    marginTop: Spacing.two,
  },
  card: {
    alignItems: "stretch",
    flex: 1,
  },
});
