import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { RevisionQueue } from "@/components/quran/revision-queue";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";
import { goBackOrReplace } from "@/lib/navigation";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { type DueItem, todaysSitting } from "@/lib/quran-companion/due-queue";
import { requestReminderReschedule } from "@/lib/quran-companion/reschedule";
import type { MemorizationStatus } from "@/lib/quran-companion/types";
import { useEnsureHifzLoaded, useHifzMap } from "@/stores/hifz-store";
import {
  useCompanionPrefs,
  useEnsureCompanionPrefsLoaded,
} from "@/stores/quran-companion-prefs-store";
import {
  useDueQueue,
  useEnsureMemorizationLoaded,
  useMemorizationActions,
  useMemorizationRecords,
} from "@/stores/quran-memorization-store";
import { quranPracticeStore, useEnsurePracticeLoaded } from "@/stores/quran-practice-store";

/**
 * Revision queue (§9.4). The primary button starts a sitting of at most
 * `dailyRevisionLimit` ayahs, overdue first. "Not now" moves a row to tomorrow
 * without deleting its hifz mark. The old hifz cycle in the reader is untouched.
 */
export default function RevisionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  useEnsureCompanionPrefsLoaded();
  useEnsureMemorizationLoaded();
  useEnsurePracticeLoaded();
  useEnsureHifzLoaded();
  const prefs = useCompanionPrefs();
  const queue = useDueQueue();
  const records = useMemorizationRecords();
  const hifz = useHifzMap();
  const { snooze, setStatus } = useMemorizationActions();
  const [statusFor, setStatusFor] = useState<DueItem | null>(null);

  useEffect(() => {
    if (!isPracticeAvailable()) router.replace("/quran");
  }, [router]);

  const sitting = todaysSitting(queue, prefs.dailyRevisionLimit);

  const openItem = (item: DueItem, items: DueItem[], index: number, remaining: number) => {
    quranPracticeStore.getState().startSitting({ items, index, remaining });
    router.push({
      pathname: "/quran/practice/session",
      params: {
        surah: String(item.surah),
        from: String(item.ayah),
        to: String(item.ayah),
        mode: "revision",
        source: "revision",
      },
    });
  };

  const statusOptions: { id: MemorizationStatus; label: string }[] = [
    { id: "learning", label: t("quranCompanion.revision.status.learning") },
    { id: "practising", label: t("quranCompanion.revision.status.practising") },
    { id: "needs_revision", label: t("quranCompanion.revision.status.needsRevision") },
  ];

  // Tablet / desktop: summary + start action side by side instead of a
  // full-width stacked button.
  const wideHeader = windowWidth >= WIDE_HEADER_MIN_WIDTH;

  // TV (no microphone): redirected to /quran above — render nothing meanwhile.
  if (!isPracticeAvailable()) return null;

  return (
    <ScreenLayout
      eyebrow={t("quran.eyebrow")}
      title={t("quranCompanion.revision.title")}
      subtitle={t("quranCompanion.revision.subtitle")}
      onBack={() => goBackOrReplace(router, "/quran/practice")}
    >
      <Seo path="/quran/revision" />
      {queue.length === 0 ? (
        <EmptyState
          icon={{ ios: "checkmark.seal", android: "task_alt", web: "task_alt" }}
          title={t("quranCompanion.revision.emptyTitle")}
          description={t("quranCompanion.revision.emptyDesc")}
        />
      ) : (
        <View style={styles.stack}>
          <Card padding="three" style={wideHeader ? styles.headerWide : undefined}>
            <View style={wideHeader ? styles.headerCopyWide : undefined}>
              <ThemedText type="subtitle">
                {t("quranCompanion.hub.reviseTitle", { count: queue.length })}
              </ThemedText>
              {wideHeader && sitting.remaining > 0 ? (
                <ThemedText type="caption" themeColor="mutedForeground" style={styles.caption}>
                  {t("quranCompanion.hub.reviseRemaining", { count: sitting.remaining })}
                </ThemedText>
              ) : null}
            </View>
            <Button
              label={t("quranCompanion.hub.startRevision")}
              fullWidth={!wideHeader}
              onPress={() => {
                const first = sitting.items[0];
                if (first) openItem(first, sitting.items, 0, sitting.remaining);
              }}
              style={wideHeader ? undefined : styles.button}
            />
            {!wideHeader && sitting.remaining > 0 ? (
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.caption}>
                {t("quranCompanion.hub.reviseRemaining", { count: sitting.remaining })}
              </ThemedText>
            ) : null}
          </Card>
          <RevisionQueue
            items={queue}
            records={records}
            hifz={hifz}
            onOpen={(item) => openItem(item, [item], 0, 0)}
            onNotNow={(item) => {
              void snooze(item.surah, item.ayah).then(requestReminderReschedule);
            }}
            onStatus={setStatusFor}
          />
        </View>
      )}

      <Sheet visible={statusFor != null} onClose={() => setStatusFor(null)} variant="bottom">
        <View style={styles.sheet}>
          <ThemedText type="subtitle">{t("quranCompanion.revision.setStatus")}</ThemedText>
          {statusOptions.map((option) => (
            <Button
              key={option.id}
              label={option.label}
              variant={
                records[statusFor?.key ?? ""]?.status === option.id ? "primary" : "secondary"
              }
              fullWidth
              onPress={() => {
                const item = statusFor;
                setStatusFor(null);
                if (item)
                  void setStatus(item.surah, item.ayah, option.id).then(requestReminderReschedule);
              }}
            />
          ))}
        </View>
      </Sheet>
    </ScreenLayout>
  );
}

const WIDE_HEADER_MIN_WIDTH = 768;

const styles = StyleSheet.create({
  stack: { gap: Spacing.two },
  headerWide: { flexDirection: "row", alignItems: "center", gap: Spacing.four },
  headerCopyWide: { flex: 1, minWidth: 0 },
  button: { marginTop: Spacing.three },
  caption: { marginTop: Spacing.two },
  sheet: { gap: Spacing.two, padding: Spacing.three },
});
