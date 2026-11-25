import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { KidsMicButton } from "@/components/kids/kids-mic-button";
import { KidsReciteCelebration } from "@/components/kids/kids-recite-celebration";
import { KidsAyahFeedback } from "@/components/kids/kids-try-again";
import { ListenerStatusStrip } from "@/components/quran/listener-status-strip";
import { PracticeWordRow } from "@/components/quran/practice-word-row";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { engineDownloadMb } from "@/constants/recitation-models";
import { BorderWidth, Spacing } from "@/constants/theme";
import { useIsOnline } from "@/hooks/use-is-online";
import { usePracticeSession } from "@/hooks/use-practice-session";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { canOpenAppSettings, openAppSettings } from "@/lib/quran-companion/open-app-settings";
import { applyKidsReadingCredit } from "@/lib/quran-companion/reading-credit-apply";
import type { Passage } from "@/lib/quran-companion/types";
import { getSurahByNumber } from "@/lib/quran-meta";
import {
  resolveArabicFontFamily,
  resolveReadingFontSizes,
  translationReadingStyle,
} from "@/lib/reading-typography";
import {
  kidsDisplayStates,
  kidsNewlyCreditedAyahs,
  kidsReciteFinished,
  kidsWordsToTryAgain,
} from "@/lib/recite-along/kids";
import { usePreferences } from "@/stores/preferences-store";
import { useCompanionPrefs } from "@/stores/quran-companion-prefs-store";
import { quranListenerStore, useListenerState } from "@/stores/quran-listener-store";

const EMPTY_HIDDEN: Set<number> = new Set();
/** Kids read bigger than the reader default. */
const KIDS_MIN_ARABIC = 34;

/**
 * Kids recite-along for one short surah (D27 + D68): one ayah at a time, a big
 * Start / Stop, words light up as the child recites (practice Follow mode, all
 * on the device), a gentle "try these words again", a celebration at the end.
 * Nothing is scored — no summary, no streak, no history entry. D73: each ayah the
 * listener heard (≥ ⅔ of its words) is added once per session to the device's
 * daily Qur'an reading log (unless "Count practice as Qur'an reading" is off) —
 * never khatm, never practice history, nothing shown to the child.
 * Without the listener (not downloaded / unsupported) it becomes listen-and-read:
 * the reciter plays and the words light up with the recitation.
 */
export function KidsReciteSession({
  passage,
  onAnother,
  onAgain,
}: {
  passage: Passage;
  onAnother: () => void;
  onAgain: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { fontPrefs, translationLocale, locale } = usePreferences();
  const prefs = useCompanionPrefs();
  const listener = useListenerState();
  const online = useIsOnline();
  const meta = getSurahByNumber(passage.surah);
  const surahName = meta?.nameTransliteration ?? String(passage.surah);
  const sizes = resolveReadingFontSizes("quran", fontPrefs);
  const arabicSize = Math.max(sizes.arabic + 4, KIDS_MIN_ARABIC);
  const arabicFamily = resolveArabicFontFamily(fontPrefs.arabic.family);

  const s = usePracticeSession({
    passage,
    mode: "follow",
    language: translationLocale || locale || "en",
    surahName,
  });

  const ayahState = s.session.ayahs[s.ayah];
  const reciting = s.mic === "listening" || s.mic === "starting" || s.mic === "settling";
  const listenOnly = s.engineStatus === "listen-only" || s.engineStatus === "failed";
  const preparing = s.engineStatus === "loading";
  const settled = s.settledAyahs.has(s.ayah) && !reciting;
  const isLast = s.index >= s.ayahs.length - 1;
  const tryAgain = useMemo(
    () => (settled && ayahState ? kidsWordsToTryAgain(ayahState) : []),
    [ayahState, settled],
  );
  const states = ayahState ? kidsDisplayStates(ayahState.states, reciting) : [];
  const micDenied = s.micPermission === "denied";
  const progressLabel = t("kids.recite.ayahOf", { n: s.index + 1, total: s.ayahs.length });

  // D73: ayahs this kids session already added to today's reading log.
  const creditedRef = useRef<Set<number>>(new Set());
  const logReading = prefs.logToReadingLog !== false;
  useEffect(() => {
    if (!logReading || listenOnly || reciting) return;
    const fresh = kidsNewlyCreditedAyahs({
      session: s.session,
      settled: s.settledAyahs,
      engineRan: true,
      already: creditedRef.current,
    });
    if (!fresh.length) return;
    for (const a of fresh) creditedRef.current.add(a);
    void applyKidsReadingCredit(getLocalDateString(), fresh.length);
  }, [listenOnly, logReading, reciting, s.session, s.settledAyahs]);

  const [finished, setFinished] = useState(false);
  // A clean last ayah ends the surah by itself; with words to try, the child chooses.
  useEffect(() => {
    if (finished || tryAgain.length) return;
    if (kidsReciteFinished({ index: s.index, total: s.ayahs.length, lastSettled: settled })) {
      setFinished(true);
    }
  }, [finished, s.ayahs.length, s.index, settled, tryAgain.length]);

  // Say how the ayah went once, after the mic closes — never while listening.
  useEffect(() => {
    if (!settled || !ayahState?.takes || listenOnly) return;
    AccessibilityInfo.announceForAccessibility(
      tryAgain.length ? t("kids.recite.tryWordsTitle") : t("kids.recite.wellDone"),
    );
  }, [ayahState?.takes, listenOnly, settled, t, tryAgain.length]);

  const [cellularConfirm, setCellularConfirm] = useState(false);
  const sizeMb = engineDownloadMb(prefs.engineChoice);
  const requestDownload = async (allowCellular = false) => {
    const result = await quranListenerStore
      .getState()
      .download(prefs.engineChoice, { wifiOnly: prefs.wifiOnlyDownload, allowCellular });
    if (result === "needs-cellular-confirm") setCellularConfirm(true);
  };

  if (finished) {
    return <KidsReciteCelebration surahName={surahName} onAgain={onAgain} onAnother={onAnother} />;
  }

  return (
    <View style={styles.stack}>
      <View style={styles.dots} accessible accessibilityLabel={progressLabel}>
        {s.ayahs.map((a, i) => (
          <View
            key={a}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === s.index
                    ? colors.accent
                    : s.settledAyahs.has(a)
                      ? tokens.status.success.color
                      : tokens.hairline,
              },
            ]}
          />
        ))}
      </View>

      <Card
        padding="four"
        style={
          s.mic === "listening" && !listenOnly
            ? { borderColor: tokens.status.danger.border, borderWidth: BorderWidth.thick }
            : undefined
        }
      >
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
          {progressLabel}
        </ThemedText>
        {s.row ? (
          <PracticeWordRow
            words={ayahState?.words ?? s.row.words}
            states={states}
            hidden={EMPTY_HIDDEN}
            activeIndex={s.mic === "listening" ? (ayahState?.activeIndex ?? null) : null}
            hearIndex={s.hearWordIndex}
            fontSize={arabicSize}
            fontFamily={arabicFamily}
            markStyle="underline"
          />
        ) : (
          <ThemedText type="small" themeColor="mutedForeground" style={styles.center}>
            {t("kids.recite.loading")}
          </ThemedText>
        )}
        {s.row?.translation ? (
          <ThemedText
            themeColor="mutedForeground"
            style={[styles.translation, translationReadingStyle(locale, sizes.translation)]}
          >
            {s.row.translation}
          </ThemedText>
        ) : null}
      </Card>

      {listenOnly ? (
        <View style={styles.stack}>
          <ThemedText type="small" themeColor="mutedForeground" style={styles.center}>
            {t("kids.recite.listenOnly")}
          </ThemedText>
          <ListenerStatusStrip
            listener={listener}
            online={online}
            sizeMb={sizeMb}
            onDownload={() => void requestDownload()}
            onCancel={() => quranListenerStore.getState().cancel()}
          />
        </View>
      ) : (
        <>
          <KidsMicButton
            mic={s.mic}
            preparing={preparing}
            disabled={s.engineError != null || s.mic === "settling"}
            onPress={() => {
              if (micDenied && canOpenAppSettings()) {
                void openAppSettings();
                return;
              }
              void s.toggleMic();
            }}
          />
          {s.mic === "listening" ? (
            <ThemedText type="small" themeColor="mutedForeground" style={styles.center}>
              {t("kids.recite.listening")}
            </ThemedText>
          ) : null}
        </>
      )}

      {micDenied ? (
        <View style={styles.centerBlock}>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
            {t("quranCompanion.session.micOff")}
          </ThemedText>
          {canOpenAppSettings() ? (
            <Button
              label={t("quranCompanion.session.openSettings")}
              variant="ghost"
              size="sm"
              onPress={() => void openAppSettings()}
            />
          ) : null}
        </View>
      ) : null}

      {s.engineError != null && !listenOnly ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
          {t("quranCompanion.session.listeningStopped")}
        </ThemedText>
      ) : null}

      {settled && ayahState && ayahState.takes > 0 && !listenOnly ? (
        <KidsAyahFeedback
          words={ayahState.words}
          tryAgain={tryAgain}
          isLast={isLast}
          onHearWord={(i) => void s.hearWord(i)}
          onHear={() => void s.hear()}
          onRetry={() => {
            s.retry();
            void s.toggleMic();
          }}
          onNext={s.next}
          onFinish={() => setFinished(true)}
        />
      ) : null}

      <View style={styles.row}>
        <Button
          label={t("kids.recite.previous")}
          variant="ghost"
          size="sm"
          disabled={s.index === 0 || reciting}
          onPress={s.previous}
        />
        <Button
          label={s.isHearing ? t("kids.recite.stopListening") : t("kids.recite.listen")}
          variant="secondary"
          size="sm"
          icon={
            s.isHearing
              ? { ios: "stop.fill", android: "stop", web: "stop" }
              : { ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" }
          }
          disabled={reciting}
          onPress={() => void s.hear()}
        />
        {isLast ? (
          <Button
            label={t("kids.recite.finish")}
            variant="ghost"
            size="sm"
            disabled={reciting}
            onPress={() => setFinished(true)}
          />
        ) : (
          <Button
            label={t("kids.recite.next")}
            variant="ghost"
            size="sm"
            disabled={reciting}
            onPress={s.next}
          />
        )}
      </View>

      <ConfirmDialog
        visible={cellularConfirm}
        title={t("quranCompanion.listener.cellularTitle")}
        message={t("quranCompanion.listener.cellularBody", { size: sizeMb })}
        confirmLabel={t("quranCompanion.listener.useMobileData")}
        onConfirm={() => {
          setCellularConfirm(false);
          void requestDownload(true);
        }}
        onClose={() => setCellularConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  center: { textAlign: "center" },
  centerBlock: { alignItems: "center", gap: Spacing.one },
  translation: { marginTop: Spacing.three },
  dots: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: Spacing.two },
  dot: { width: 12, height: 12, borderRadius: 6 },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.two,
  },
});
