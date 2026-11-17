import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { singleAyahTrack } from "@/lib/quran-audio";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { ayahCount } from "@/lib/quran-companion/passage";
import { requestReminderReschedule } from "@/lib/quran-companion/reschedule";
import { getSurahByNumber } from "@/lib/quran-meta";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { useToast } from "@/providers/toast-provider";
import { hifzKey, useEnsureHifzLoaded, useHifzActions, useHifzMap } from "@/stores/hifz-store";
import {
  canOfferMarkMemorized,
  useEnsureMemorizationLoaded,
  useMemorizationRecords,
} from "@/stores/quran-memorization-store";
import {
  quranPracticeStore,
  useLastPracticeSummary,
  useRevisionSitting,
} from "@/stores/quran-practice-store";
import { useQuranPrefs } from "@/stores/quran-store";

/**
 * Session summary (§9.3). The next action comes first; the counts are a caption.
 * No percentage, no confetti, no streak. "Mark memorized" is a text button,
 * shown only when the ladder offers it, and runs the existing hifz transition
 * behind the same confirm the reader uses.
 */
export default function PracticeSummaryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();
  const params = useLocalSearchParams<{ source?: string }>();
  const summary = useLastPracticeSummary();
  const sitting = useRevisionSitting();
  const audio = useAudioPlayerContext();
  const quranPrefs = useQuranPrefs();
  useEnsureHifzLoaded();
  useEnsureMemorizationLoaded();
  const hifz = useHifzMap();
  const records = useMemorizationRecords();
  const { setStatus } = useHifzActions();
  const [confirmAyah, setConfirmAyah] = useState<number | null>(null);

  // Opened cold (deep link, reload) with nothing in memory → the hub.
  useEffect(() => {
    if (!isPracticeAvailable()) router.replace("/quran");
    else if (!summary) router.replace("/quran/practice" as Href);
  }, [router, summary]);

  const isRevision = params.source === "revision" || summary?.mode === "revision";
  const nextRevisionItem =
    isRevision && sitting && sitting.index + 1 < sitting.items.length
      ? sitting.items[sitting.index + 1]
      : null;

  useEffect(() => {
    if (isRevision) requestReminderReschedule();
  }, [isRevision]);

  const offerAyah = useMemo(() => {
    if (!summary) return null;
    for (let a = summary.ayahStart; a <= summary.ayahEnd; a++) {
      const key = hifzKey(summary.surah, a);
      if (hifz[key] !== "memorized" && canOfferMarkMemorized(records[key])) return a;
    }
    return null;
  }, [hifz, records, summary]);

  // TV (no microphone) redirects to /quran above — render nothing meanwhile.
  if (!summary || !isPracticeAvailable()) return null;

  const surahName = getSurahByNumber(summary.surah)?.nameTransliteration ?? String(summary.surah);
  const listened = summary.engine === "none";
  const tryAgainAyah = !listened && summary.confirmedMismatch > 0 ? summary.weakAyahs[0] : null;
  const hasLaterAyah = !isRevision && summary.ayahEnd < ayahCount(summary.surah);

  const openSession = (surah: number, from: number, to: number, mode: string, source: string) =>
    router.replace({
      pathname: "/quran/practice/session",
      params: { surah: String(surah), from: String(from), to: String(to), mode, source },
    });

  const primary = (() => {
    if (tryAgainAyah != null) {
      return {
        label: t("quranCompanion.summary.tryAyahAgain"),
        onPress: () =>
          openSession(
            summary.surah,
            tryAgainAyah,
            tryAgainAyah,
            summary.mode,
            isRevision ? "revision" : "hub",
          ),
      };
    }
    if (nextRevisionItem) {
      return {
        label: t("quranCompanion.summary.nextRevision"),
        onPress: () => {
          quranPracticeStore.getState().advanceSitting();
          openSession(
            nextRevisionItem.surah,
            nextRevisionItem.ayah,
            nextRevisionItem.ayah,
            "revision",
            "revision",
          );
        },
      };
    }
    if (hasLaterAyah) {
      const next = summary.ayahEnd + 1;
      return {
        label: t("quranCompanion.summary.nextAyah"),
        onPress: () => openSession(summary.surah, next, next, summary.mode, "hub"),
      };
    }
    return {
      label: t("quranCompanion.summary.done"),
      onPress: () => {
        if (isRevision) quranPracticeStore.getState().startSitting(null);
        router.replace(isRevision ? ("/quran/revision" as Href) : ("/quran/practice" as Href));
      },
    };
  })();

  const hearAyah = summary.weakAyahs[0] ?? summary.ayahStart;
  const ref = (ayah: number) => t("hifz.toastRef", { surah: surahName, ayah });

  const counts = listened
    ? t("quranCompanion.summary.listened")
    : summary.mismatchesUnconfirmed
      ? [
          t("quranCompanion.summary.countMatched", { count: summary.matched + summary.corrected }),
          t("quranCompanion.summary.listenerNotSure", {
            count: summary.uncertain + summary.confirmedMismatch,
          }),
          t("quranCompanion.summary.countNotReached", { count: summary.notReached }),
        ].join(" · ")
      : [
          t("quranCompanion.summary.countMatched", { count: summary.matched + summary.corrected }),
          t("quranCompanion.summary.countNotSure", { count: summary.uncertain }),
          t("quranCompanion.summary.countTryAgain", { count: summary.confirmedMismatch }),
          t("quranCompanion.summary.countNotReached", { count: summary.notReached }),
        ].join(" · ");

  return (
    <ScreenLayout
      eyebrow={t("quranCompanion.hub.title")}
      title={
        summary.ayahStart === summary.ayahEnd
          ? t("quranCompanion.passage.single", { surah: surahName, ayah: summary.ayahStart })
          : t("quranCompanion.passage.range", {
              surah: surahName,
              from: summary.ayahStart,
              to: summary.ayahEnd,
            })
      }
      subtitle={t("quranCompanion.summary.subtitle")}
      // Desktop: a results card + actions, not a 1100px-wide button.
      maxContentWidth={SUMMARY_MAX_WIDTH}
      onBack={() =>
        router.replace(isRevision ? ("/quran/revision" as Href) : ("/quran/practice" as Href))
      }
    >
      <Seo path="/quran/practice/summary" />
      <Card padding="four">
        <Button label={primary.label} onPress={primary.onPress} fullWidth />
        <Button
          label={t("quranCompanion.summary.hearAyah")}
          variant="ghost"
          size="sm"
          onPress={() =>
            audio.play(
              [singleAyahTrack(quranPrefs.preferredReciterDir, surahName, summary.surah, hearAyah)],
              0,
            )
          }
          style={styles.secondary}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.counts}>
          {counts}
        </ThemedText>
        {isRevision && sitting ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.counts}>
            {t("quranCompanion.revision.sittingProgress", {
              n: Math.min(sitting.index + 1, sitting.items.length),
              total: sitting.items.length,
            })}
          </ThemedText>
        ) : null}
      </Card>

      {offerAyah != null ? (
        <View style={styles.center}>
          <Button
            label={t("quranCompanion.summary.markMemorized")}
            variant="ghost"
            size="sm"
            onPress={() => setConfirmAyah(offerAyah)}
          />
        </View>
      ) : null}

      <ConfirmDialog
        visible={confirmAyah != null}
        title={t("hifz.confirmTitle")}
        message={
          confirmAyah != null
            ? t("hifz.confirmMemorizedBody", { ref: ref(confirmAyah) })
            : undefined
        }
        confirmLabel={t("hifz.markMemorized")}
        onConfirm={() => {
          const ayah = confirmAyah;
          setConfirmAyah(null);
          if (ayah == null) return;
          void setStatus(summary.surah, ayah, "memorized").then(() =>
            toast.success(
              t("hifz.toastMemorizedTitle"),
              t("hifz.toastMemorizedBody", { ref: ref(ayah) }),
            ),
          );
        }}
        onClose={() => setConfirmAyah(null)}
      />
    </ScreenLayout>
  );
}

const SUMMARY_MAX_WIDTH = 640;

const styles = StyleSheet.create({
  secondary: { marginTop: Spacing.two },
  counts: { marginTop: Spacing.three, textAlign: "center" },
  center: { alignItems: "center", marginTop: Spacing.two },
});
