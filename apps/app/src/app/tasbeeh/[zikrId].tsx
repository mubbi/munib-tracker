import { getZikrById } from "@munib-tracker/shared/content";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { ReferenceLine } from "@/components/content/reference-line";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { TasbeehCounter } from "@/components/tasbeeh/tasbeeh-counter";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spacing } from "@/constants/theme";
import { arabicReadingLayout } from "@/lib/reading-typography";
import { usePreferences } from "@/stores/preferences-store";
import { trackerStore } from "@/stores/tracker-store";

export default function ZikrTasbeehScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ zikrId: string }>();
  const { fontPrefs } = usePreferences();
  const arabicSize = fontPrefs.arabic.size;
  const item = params.zikrId ? getZikrById(params.zikrId) : undefined;
  const target = item?.targetCount && item.targetCount > 0 ? item.targetCount : 33;

  // Local, responsive count seeded once from today's stored progress; every
  // change is persisted so the dashboard and zikr detail stay in sync.
  const [count, setCount] = useState(() => {
    if (!item) return 0;
    const stored = trackerStore.getState().zikrCounts[item.id] ?? 0;
    return Math.max(0, Math.min(stored, target));
  });

  useEffect(() => {
    if (!item) return;
    const stored = trackerStore.getState().zikrCounts[item.id] ?? 0;
    if (stored > target) {
      void trackerStore.getState().setZikrCount(item.id, target, target);
    }
  }, [item, target]);

  if (!item) {
    return (
      <ScreenLayout
        title={t("tasbeeh.eyebrow")}
        onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      >
        <Seo
          title={t("tasbeeh.eyebrow")}
          description="Count this dhikr with a tactile tasbeeh counter."
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
    setCount(safe);
    void trackerStore.getState().setZikrCount(item.id, safe, target);
  };

  return (
    <ScreenLayout
      eyebrow={t("tasbeeh.eyebrow")}
      title={item.title}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo
        title={t("tasbeeh.eyebrow")}
        description="Count this dhikr with a tactile tasbeeh counter."
        index={false}
      />
      <Card variant="muted" padding="four" style={styles.reading}>
        <ThemedText
          type="arabic"
          style={[styles.arabic, arabicSize ? arabicReadingLayout(arabicSize, "center") : null]}
        >
          {item.arabic}
        </ThemedText>
        {item.transliteration ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.translit}>
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
          onIncrement={() => persist(count + 1)}
          onDecrement={() => persist(count - 1)}
          onReset={() => persist(0)}
        />
      </Card>
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
