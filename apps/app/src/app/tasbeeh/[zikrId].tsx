import { getZikrById } from "@munib-tracker/shared/content";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { TasbeehCounter } from "@/components/tasbeeh/tasbeeh-counter";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spacing } from "@/constants/theme";
import { trackerStore } from "@/stores/tracker-store";

export default function ZikrTasbeehScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ zikrId: string }>();
  const item = params.zikrId ? getZikrById(params.zikrId) : undefined;
  const target = item?.targetCount && item.targetCount > 0 ? item.targetCount : 33;

  // Local, responsive count seeded once from today's stored progress; every
  // change is persisted so the dashboard and zikr detail stay in sync.
  const [count, setCount] = useState(() =>
    item ? (trackerStore.getState().zikrCounts[item.id] ?? 0) : 0,
  );

  if (!item) {
    return (
      <ScreenLayout
        title={t("tasbeeh.eyebrow")}
        onBack={router.canGoBack() ? () => router.back() : undefined}
      >
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("tasbeeh.notFoundTitle")}
          description={t("tasbeeh.notFoundDesc")}
        />
      </ScreenLayout>
    );
  }

  const persist = (next: number) => {
    const safe = Math.max(0, next);
    setCount(safe);
    void trackerStore.getState().setZikrCount(item.id, safe, target);
  };

  return (
    <ScreenLayout
      eyebrow={t("tasbeeh.eyebrow")}
      title={item.title}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Card padding="four" style={styles.reading}>
        <ThemedText type="arabic" style={styles.arabic}>
          {item.arabic}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.translit}>
          {item.transliteration}
        </ThemedText>
      </Card>

      <Card padding="four" style={styles.card}>
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
  },
  arabic: {
    textAlign: "center",
    writingDirection: "rtl",
  },
  translit: {
    textAlign: "center",
    marginTop: Spacing.two,
    fontStyle: "italic",
  },
  card: {
    alignItems: "center",
    paddingVertical: Spacing.five,
  },
});
