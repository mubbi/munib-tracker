import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  PracticeSessionSummary,
  type SummaryAction,
  summaryOutcome,
} from "@/components/quran/practice-session-summary";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { CoachingPlanCard } from "@/components/tajweed-coaching/coaching-plan-card";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { singleAyahTrack } from "@/lib/quran-audio";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { ayahCount } from "@/lib/quran-companion/passage";
import { requestReminderReschedule } from "@/lib/quran-companion/reschedule";
import type { SessionMode } from "@/lib/quran-companion/types";
import { getSurahByNumber } from "@/lib/quran-meta";
import { useArrowForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
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
 * Session summary (§9.3). Headline + counts, then the next action; a session
 * where nothing was heard offers the passage again instead of moving on.
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
  const forward = useArrowForward();
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
  const outcome = summaryOutcome(summary);
  const tryAgainAyah =
    !outcome.listened && summary.confirmedMismatch > 0 ? summary.weakAyahs[0] : null;
  const hasLaterAyah = !isRevision && summary.ayahEnd < ayahCount(summary.surah);
  const source = isRevision ? "revision" : "hub";

  const openSession = (surah: number, from: number, to: number, mode: string, src: string) =>
    router.replace({
      pathname: "/quran/practice/session",
      params: { surah: String(surah), from: String(from), to: String(to), mode, source: src },
    });

  const micIcon: SummaryAction["icon"] = { ios: "mic.fill", android: "mic", web: "mic" };
  const repeatPassage: SummaryAction = {
    label: t("quranCompanion.summary.practiseAgain"),
    icon: { ios: "arrow.counterclockwise", android: "replay", web: "replay" },
    onPress: () =>
      openSession(summary.surah, summary.ayahStart, summary.ayahEnd, summary.mode, source),
  };

  const moveOn: SummaryAction = (() => {
    if (nextRevisionItem) {
      return {
        label: t("quranCompanion.summary.nextRevision"),
        icon: forward,
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
        icon: forward,
        onPress: () => openSession(summary.surah, next, next, summary.mode, "hub"),
      };
    }
    return {
      label: t("quranCompanion.summary.done"),
      icon: { ios: "checkmark", android: "check", web: "check" },
      onPress: () => {
        if (isRevision) quranPracticeStore.getState().startSitting(null);
        router.replace(isRevision ? ("/quran/revision" as Href) : ("/quran/practice" as Href));
      },
    };
  })();

  // A retry leads when something needs another go (nothing heard → the whole
  // passage; a confirmed mismatch → that ayah); moving on is then the secondary.
  // When moving on leads, the secondary repeats the passage.
  const retry: SummaryAction | null = outcome.nothingHeard
    ? { ...repeatPassage, icon: micIcon }
    : tryAgainAyah != null
      ? {
          label: t("quranCompanion.summary.tryAyahAgain"),
          icon: micIcon,
          onPress: () =>
            openSession(summary.surah, tryAgainAyah, tryAgainAyah, summary.mode, source),
        }
      : null;
  const primary = retry ?? moveOn;
  const secondary = retry ? moveOn : repeatPassage;
  const singleAyah = summary.ayahStart === summary.ayahEnd;

  const hearAyah = summary.weakAyahs[0] ?? summary.ayahStart;
  const ref = (ayah: number) => t("hifz.toastRef", { surah: surahName, ayah });

  return (
    <ScreenLayout
      eyebrow={t("quranCompanion.hub.title")}
      title={
        singleAyah
          ? t("quranCompanion.passage.single", { surah: surahName, ayah: summary.ayahStart })
          : t("quranCompanion.passage.range", {
              surah: surahName,
              from: summary.ayahStart,
              to: summary.ayahEnd,
            })
      }
      subtitle={`${t("quranCompanion.summary.subtitle")} · ${t(MODE_LABEL[summary.mode])}`}
      // Desktop: a results card + actions, not a 1100px-wide button.
      maxContentWidth={SUMMARY_MAX_WIDTH}
      onBack={() =>
        router.replace(isRevision ? ("/quran/revision" as Href) : ("/quran/practice" as Href))
      }
    >
      <Seo path="/quran/practice/summary" />
      <PracticeSessionSummary
        summary={summary}
        primary={primary}
        secondary={secondary}
        onHear={() =>
          audio.play(
            [singleAyahTrack(quranPrefs.preferredReciterDir, surahName, summary.surah, hearAyah)],
            0,
          )
        }
        onOpenAyah={(ayah) => openSession(summary.surah, ayah, ayah, summary.mode, source)}
        progress={
          isRevision && sitting
            ? { n: Math.min(sitting.index + 1, sitting.items.length), total: sitting.items.length }
            : null
        }
      />

      {/* NF-3.15: sounds the practised ayahs include, with words from this recitation. */}
      <CoachingPlanCard sessionId={summary.id} />

      {offerAyah != null ? (
        <View style={styles.center}>
          <Button
            label={t("quranCompanion.summary.markMemorized")}
            variant="ghost"
            size="sm"
            icon={{ ios: "checkmark.seal", android: "verified", web: "verified" }}
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

/** Session mode → its label key, shown beside "Session finished". */
const MODE_LABEL: Record<SessionMode, string> = {
  follow: "quranCompanion.mode.follow",
  check: "quranCompanion.mode.check",
  "hide-words": "quranCompanion.mode.hideWords",
  "hide-ayahs": "quranCompanion.mode.hideAyahs",
  revision: "quranCompanion.revision.title",
};

const styles = StyleSheet.create({
  center: { alignItems: "center", marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/practice/summary");
