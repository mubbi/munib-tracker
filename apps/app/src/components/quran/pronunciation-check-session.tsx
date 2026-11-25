import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, Platform, StyleSheet, View } from "react-native";

import { ReferenceLine } from "@/components/content/reference-line";
import { PracticeHabitDoneButton } from "@/components/quran/practice-habit-done";
import { PracticeReadingCreditLine } from "@/components/quran/practice-session-summary-credit";
import { PracticeWordRow } from "@/components/quran/practice-word-row";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { engineDownloadMb } from "@/constants/recitation-models";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { createId } from "@/db/id";
import { usePracticeAyahText } from "@/hooks/use-practice-ayah-text";
import { type CheckTarget, usePronunciationCheck } from "@/hooks/use-pronunciation-check";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isWebInteractiveTarget, useWebScreenKeyHandler } from "@/hooks/use-web-key-handler";
import { goBackOrReplace } from "@/lib/navigation";
import { singleAyahTrack } from "@/lib/quran-audio";
import { arabicWordRowStyle } from "@/lib/quran-companion/arabic-row";
import { restorePlaybackMode } from "@/lib/quran-companion/audio/audio-mode";
import { PRACTICE_ERROR_COPY } from "@/lib/quran-companion/error-codes";
import { canOpenAppSettings, openAppSettings } from "@/lib/quran-companion/open-app-settings";
import { passageAyahs } from "@/lib/quran-companion/passage";
import { practiceSessionKeyAction } from "@/lib/quran-companion/session-keys";
import type { Passage, PracticeSummary } from "@/lib/quran-companion/types";
import { getSurahByNumber } from "@/lib/quran-meta";
import { PINNED_CALIBRATION } from "@/lib/quran-pronunciation/calibration";
import { clearWordWindows, rememberWordWindows } from "@/lib/quran-pronunciation/flagged-words";
import {
  buildPronunciationSummary,
  type PronunciationResults,
} from "@/lib/quran-pronunciation/summary";
import type { StudyWordVerdict } from "@/lib/quran-pronunciation/types";
import {
  resolveArabicFontFamily,
  resolveReadingFontSizes,
  translationReadingStyle,
} from "@/lib/reading-typography";
import { useIsRTL } from "@/lib/rtl";
import { useReadingDisplay } from "@/lib/settings/reading-display";
import { FASTCONFORMER_ENGINE, FASTCONFORMER_VERSION } from "@/lib/speech/fastconformer";
import { downloadFraction } from "@/lib/tasbeeh-voice/model-status";
import { useAudioPlayerContext } from "@/providers/audio-player-context";
import { usePreferences } from "@/stores/preferences-store";
import { usePronunciationCalibration } from "@/stores/pronunciation-calibration-store";
import { useCompanionPrefs } from "@/stores/quran-companion-prefs-store";
import { quranListenerStore, useListenerState } from "@/stores/quran-listener-store";
import { quranPracticeStore, useLastPracticeCredit } from "@/stores/quran-practice-store";
import { useQuranPrefs } from "@/stores/quran-store";

/**
 * NF-3.24 "Check pronunciation" (`/quran/practice/session?mode=pronunciation`).
 * The person reads the ayah on screen aloud; each word comes back Clear /
 * Listen again / Not sure (or, in the D24 fallback, "Skipped or unclear"), with
 * the reciter's word audio one tap away. No score, percentage or "correct"
 * wording anywhere, and the teacher line is always visible. Everything runs on
 * the device; only word states are saved, inside the practice history.
 */
export function PronunciationCheckSession({
  passage,
  source,
  habitId,
}: {
  passage: Passage;
  source: string;
  /** D74: the Sunnah habit this check came from — the summary offers "Mark habit done". */
  habitId?: string;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { fontPrefs, translationLocale, locale } = usePreferences();
  const quranPrefs = useQuranPrefs();
  const companion = useCompanionPrefs();
  const audio = useAudioPlayerContext();
  const listener = useListenerState();
  const deviceCalibration = usePronunciationCalibration();
  const check = usePronunciationCheck();
  const rtl = useIsRTL();
  const mode = PINNED_CALIBRATION.mode;
  // The app-wide translation toggle (D13), as in the reader and practice session.
  const { showTranslation } = useReadingDisplay();

  const ayahs = useMemo(() => passageAyahs(passage), [passage]);
  const { rows } = usePracticeAyahText(passage.surah, ayahs, translationLocale || locale || "en");
  const surahName = getSurahByNumber(passage.surah)?.nameTransliteration ?? String(passage.surah);
  const sizes = resolveReadingFontSizes("quran", fontPrefs);
  const arabicFamily = resolveArabicFontFamily(fontPrefs.arabic.family);

  const [index, setIndex] = useState(0);
  const ayah = ayahs[Math.min(index, ayahs.length - 1)] ?? passage.ayahStart;
  const row = rows[ayah];
  const [results, setResults] = useState<PronunciationResults>({});
  const [finished, setFinished] = useState<PracticeSummary | null>(null);
  // D68: ayahs this check added to today's reading (and a personal khatm plan).
  const readingCredit = useLastPracticeCredit(finished?.id);
  const [calibrating, setCalibrating] = useState(false);
  const [needsCellular, setNeedsCellular] = useState(false);
  const startedAt = useRef(new Date().toISOString());

  // In-memory word windows are for this screen only.
  useEffect(() => () => clearWordWindows(), []);

  const status = check.state.status;
  const listening = status === "listening";
  const busy = status === "preparing" || listening || status === "assessing";

  // Keep the verdicts of each ayah as they come in.
  useEffect(() => {
    if (status !== "result" || !check.state.verdicts || calibrating) return;
    const verdicts = check.state.verdicts;
    setResults((prev) => ({ ...prev, [ayah]: verdicts }));
    rememberWordWindows(passage.surah, ayah, verdicts);
    const flagged = verdicts.filter((v) => v.state === "listen-again").length;
    AccessibilityInfo.announceForAccessibility(
      flagged
        ? t("quranPronunciation.result.announceListen", { count: flagged })
        : t("quranPronunciation.result.announceDone"),
    );
  }, [ayah, calibrating, check.state.verdicts, passage.surah, status, t]);

  const verdicts: StudyWordVerdict[] | null =
    status === "result" ? check.state.verdicts : (results[ayah] ?? null);
  const states = useMemo(() => {
    if (!row) return [];
    const out: (StudyWordVerdict["state"] | null)[] = row.words.map(() => null);
    for (const v of verdicts ?? []) out[v.index] = v.state;
    return out;
  }, [row, verdicts]);

  const target: CheckTarget | null = row
    ? { surah: passage.surah, ayah, arabic: row.arabic, words: row.words }
    : null;

  const hearWord = async (wordIndex: number) => {
    if (busy) return;
    await restorePlaybackMode();
    const url = row?.wordAudio[wordIndex];
    if (url) {
      audio.play(
        [
          {
            id: `word:${passage.surah}:${ayah}:${wordIndex}`,
            title: surahName,
            subtitle: row?.words[wordIndex] ?? "",
            uri: url,
          },
        ],
        0,
      );
      return;
    }
    audio.play(
      [singleAyahTrack(quranPrefs.preferredReciterDir, surahName, passage.surah, ayah)],
      0,
    );
  };

  const hearAyah = async () => {
    if (busy) return;
    await restorePlaybackMode();
    audio.play(
      [singleAyahTrack(quranPrefs.preferredReciterDir, surahName, passage.surah, ayah)],
      0,
    );
  };

  const begin = async (calibrate = false) => {
    if (!target) return;
    // Clear the last take first so a calibration read's marks are never kept as a result.
    check.reset();
    setCalibrating(calibrate);
    const result = await check.start(target, { calibrate });
    if (result === "needs-permission" && (await check.requestPermission()) === "granted") {
      await check.start(target, { calibrate });
    }
  };

  const download = async (allowCellular = false) => {
    const result = await quranListenerStore.getState().download(FASTCONFORMER_ENGINE, {
      wifiOnly: companion.wifiOnlyDownload,
      allowCellular,
    });
    setNeedsCellular(result === "needs-cellular-confirm");
  };

  const goTo = (next: number) => {
    if (busy) return;
    check.reset();
    setCalibrating(false);
    setIndex(Math.max(0, Math.min(ayahs.length - 1, next)));
  };

  const finish = async () => {
    if (busy) return;
    // Nothing was checked: a "nothing to listen to again" summary would be
    // misleading, so just leave (nothing is saved either).
    if (Object.keys(results).length === 0) {
      onBack();
      return;
    }
    const wordCounts: Record<number, number> = {};
    for (const a of ayahs) wordCounts[a] = rows[a]?.words.length ?? 0;
    const summary = buildPronunciationSummary({
      id: createId(),
      passage,
      results,
      startedAt: startedAt.current,
      endedAt: new Date().toISOString(),
      engineVersion: FASTCONFORMER_VERSION,
      wordCounts,
    });
    await quranPracticeStore.getState().addSummary(summary);
    setFinished(summary);
  };

  const onBack = () =>
    goBackOrReplace(router, source === "reader" ? `/quran/${passage.surah}` : "/quran/practice");

  // Desktop web: Space starts / finishes a take, ← / → move between ayahs.
  useWebScreenKeyHandler(
    (event) => {
      const action = practiceSessionKeyAction(event.key, {
        rtl,
        interactiveTarget: isWebInteractiveTarget(event.target),
        canNavigate: ayahs.length > 1 && !busy,
        shiftKey: event.shiftKey,
      });
      if (action === "primary") {
        if (check.modelStatus !== "ready" || check.permission === "denied") return undefined;
        if (listening) void check.stop();
        else if (!busy) void begin(false);
        return true;
      }
      if (action === "next" || action === "previous") {
        goTo(index + (action === "next" ? 1 : -1));
        return true;
      }
      return undefined;
    },
    Platform.OS === "web" && finished == null,
  );

  const model = check.modelStatus;
  const permission = check.permission;
  const sizeMb = engineDownloadMb(FASTCONFORMER_ENGINE);

  const listenLabel =
    mode === "full"
      ? t("quranPronunciation.word.listenAgain")
      : t("quranPronunciation.word.skippedOrUnclear");
  const clearLabel =
    mode === "full" ? t("quranPronunciation.word.clear") : t("quranPronunciation.word.heard");

  const flaggedNow = (verdicts ?? []).filter((v) => v.state === "listen-again");
  const notSureNow = (verdicts ?? []).filter((v) => v.state === "not-sure");

  const wordChips = (list: StudyWordVerdict[], color: string, soft: string) => (
    <View style={[styles.chips, arabicWordRowStyle(rtl)]}>
      {list.map((v) => (
        <PressableScale
          key={`${v.index}:${row?.words[v.index]}`}
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={`${row?.words[v.index] ?? ""}, ${t("quranPronunciation.word.tapToHear")}`}
          onPress={() => void hearWord(v.index)}
          style={[styles.chip, { backgroundColor: soft, borderColor: color }]}
        >
          <ThemedText type="arabic" accessibilityLanguage="ar" style={styles.chipText}>
            {row?.words[v.index] ?? ""}
          </ThemedText>
          <SymbolView
            name={{ ios: "speaker.wave.2", android: "volume_up", web: "volume_up" }}
            size={12}
            tintColor={color}
          />
        </PressableScale>
      ))}
    </View>
  );

  const teacherFooter = (
    <View style={styles.footer}>
      <ThemedText type="small" themeColor="mutedForeground">
        {t("quranPronunciation.copy.tartil")}
      </ThemedText>
      <ReferenceLine reference={t("quranPronunciation.refs.tartil")} />
      <ThemedText type="small" themeColor="mutedForeground">
        {t("quranPronunciation.copy.effort")}
      </ThemedText>
      <ReferenceLine reference={t("quranPronunciation.refs.effort")} />
      <ThemedText type="small" themeColor="mutedForeground">
        {t("quranPronunciation.copy.teacher")}
      </ThemedText>
      <ReferenceLine reference={t("quranPronunciation.refs.teacher")} />
    </View>
  );

  if (finished) {
    const flagged = (finished.pronunciation?.words ?? []).filter((w) => w.state === "listen-again");
    return (
      <ScreenLayout
        eyebrow={t("quranPronunciation.title")}
        title={t("quranPronunciation.summary.title")}
        onBack={onBack}
      >
        <Seo path="/quran/practice/session" />
        <Card padding="four">
          <ThemedText type="smallBold">
            {flagged.length
              ? t("quranPronunciation.summary.listenAgainTitle")
              : t("quranPronunciation.summary.nothingFlagged")}
          </ThemedText>
          {flagged.length ? (
            <View style={[styles.chips, arabicWordRowStyle(rtl)]}>
              {flagged.map((w) => (
                <View
                  key={`${w.ayah}:${w.word}`}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: tokens.status.warning.soft,
                      borderColor: tokens.status.warning.color,
                    },
                  ]}
                >
                  <ThemedText type="arabic" accessibilityLanguage="ar" style={styles.chipText}>
                    {rows[w.ayah]?.words[w.word] ?? ""}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("quranPronunciation.summary.ayahRef", { ayah: w.ayah })}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : null}
          {flagged.length ? (
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.gapTop}>
              {companion.feedCoachingFromAssessment
                ? t("quranPronunciation.summary.feedsCoaching")
                : t("quranPronunciation.summary.feedOff")}
            </ThemedText>
          ) : null}
          {readingCredit && (readingCredit.ayahs > 0 || (readingCredit.khatm?.added ?? 0) > 0) ? (
            <View style={styles.gapTop}>
              <PracticeReadingCreditLine
                credit={readingCredit}
                onOpen={() => router.push("/quran/khatm")}
              />
            </View>
          ) : null}
          <PracticeHabitDoneButton habitId={habitId} summary={finished} />
          {teacherFooter}
          <View style={styles.actions}>
            <Button
              label={t("quranPronunciation.summary.done")}
              onPress={onBack}
              style={styles.flex}
            />
          </View>
        </Card>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      eyebrow={t("quranPronunciation.title")}
      title={t("quranCompanion.passage.single", { surah: surahName, ayah })}
      subtitle={
        ayahs.length > 1
          ? t("quranCompanion.session.ayahOf", { n: index + 1, total: ayahs.length })
          : undefined
      }
      onBack={onBack}
      maxContentWidth={880}
    >
      <Seo path="/quran/practice/session" />
      <ThemedText type="small" themeColor="mutedForeground">
        {calibrating
          ? t("quranPronunciation.calibrate.intro")
          : mode === "full"
            ? t("quranPronunciation.intro")
            : t("quranPronunciation.introSkipped")}
      </ThemedText>

      <Card
        padding="four"
        style={
          listening
            ? { borderColor: tokens.status.warning.border, borderWidth: BorderWidth.thick }
            : undefined
        }
      >
        {row ? (
          <PracticeWordRow
            words={row.words}
            states={[]}
            hidden={EMPTY_SET}
            activeIndex={null}
            hearIndex={null}
            fontSize={sizes.arabic}
            fontFamily={arabicFamily}
            markStyle="underline"
            pronunciation={calibrating ? undefined : states}
            pronunciationMode={mode}
            onWordPress={(i) => void hearWord(i)}
          />
        ) : (
          <ThemedText type="small" themeColor="mutedForeground">
            {t("quranCompanion.session.loading")}
          </ThemedText>
        )}
        {showTranslation && row?.translation ? (
          <ThemedText style={[styles.gapTop, translationReadingStyle(locale, sizes.translation)]}>
            {row.translation}
          </ThemedText>
        ) : null}
        {/* The key explains marks — only once this ayah has some. */}
        {verdicts && !calibrating ? (
          <View style={styles.legend} accessibilityElementsHidden>
            {[
              { label: clearLabel, color: tokens.status.success.color },
              { label: listenLabel, color: tokens.status.warning.color },
              { label: t("quranPronunciation.word.notSure"), color: colors.mutedForeground },
            ].map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <ThemedText type="caption" themeColor="mutedForeground">
                  {item.label}
                </ThemedText>
              </View>
            ))}
          </View>
        ) : null}
      </Card>

      {/* Model / permission / mic */}
      {!check.available ? (
        <Card>
          <ThemedText type="small">{t("quranPronunciation.unavailable")}</ThemedText>
        </Card>
      ) : model !== "ready" ? (
        <Card style={styles.stack}>
          <ThemedText type="smallBold">{t("quranPronunciation.model.title")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {model === "other-engine"
              ? t("quranPronunciation.model.otherEngine")
              : t("quranPronunciation.model.body", { size: sizeMb })}
          </ThemedText>
          {model === "downloading" ? (
            <>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("quranPronunciation.model.downloading", {
                  percent: Math.round(downloadFraction(listener) * 100),
                })}
              </ThemedText>
              <ProgressBar
                value={downloadFraction(listener)}
                accessibilityLabel={t("a11yProgress.modelDownload")}
              />
            </>
          ) : model === "unsupported" ? null : (
            <>
              {needsCellular ? (
                <Button
                  label={t("quranPronunciation.model.downloadAnyway")}
                  variant="secondary"
                  onPress={() => void download(true)}
                />
              ) : null}
              <Button
                label={t("quranPronunciation.model.download", { size: sizeMb })}
                onPress={() => void download(false)}
                icon={{ ios: "arrow.down.circle", android: "download", web: "download" }}
              />
            </>
          )}
        </Card>
      ) : permission === "denied" ? (
        // Mic denied is a blocker, not a hint: warning callout + Open Settings (G-05).
        <Callout
          tone="warning"
          action={
            canOpenAppSettings()
              ? {
                  label: t("quranPronunciation.openSettings"),
                  onPress: () => void openAppSettings(),
                }
              : undefined
          }
        >
          {t("quranPronunciation.micDenied")}
        </Callout>
      ) : (
        <Card style={styles.stack}>
          {status === "assessing" ? (
            <ThemedText type="small" accessibilityLiveRegion="polite">
              {t("quranPronunciation.assessing")}
            </ThemedText>
          ) : listening ? (
            <>
              <ThemedText type="small" accessibilityLiveRegion="polite">
                {t("quranPronunciation.listening")}
              </ThemedText>
              <ProgressBar
                value={check.level}
                accessibilityLabel={t("a11yProgress.micLevel")}
                color={tokens.status.warning.color}
                height={6}
              />
            </>
          ) : status === "no-fit" ? (
            <ThemedText type="small">
              {t(`quranPronunciation.noFit.${check.state.noFit ?? "different-passage"}`)}
            </ThemedText>
          ) : status === "error" && check.state.error ? (
            <Callout tone="danger">{t(PRACTICE_ERROR_COPY[check.state.error])}</Callout>
          ) : null}

          {calibrating && check.calibration ? (
            <ThemedText type="small">
              {t(`quranPronunciation.calibrate.${check.calibration}`)}
            </ThemedText>
          ) : null}

          {status === "result" && !calibrating && verdicts ? (
            <View style={styles.stack}>
              <ThemedText type="smallBold">
                {flaggedNow.length
                  ? t("quranPronunciation.result.headListen", { count: flaggedNow.length })
                  : t("quranPronunciation.result.headClear")}
              </ThemedText>
              {flaggedNow.length ? (
                <>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {mode === "full"
                      ? t("quranPronunciation.result.listenHint")
                      : t("quranPronunciation.result.skippedHint")}
                  </ThemedText>
                  {wordChips(flaggedNow, tokens.status.warning.color, tokens.status.warning.soft)}
                </>
              ) : null}
              {notSureNow.length ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("quranPronunciation.result.notSureNote")}
                </ThemedText>
              ) : null}
            </View>
          ) : null}

          <View style={styles.actions}>
            {listening ? (
              <Button
                label={t("quranPronunciation.done")}
                onPress={() => void check.stop()}
                style={styles.flex}
                icon={{ ios: "stop.fill", android: "stop", web: "stop" }}
              />
            ) : (
              <Button
                label={
                  status === "idle" ? t("quranPronunciation.start") : t("quranPronunciation.again")
                }
                onPress={() => void begin(false)}
                disabled={busy || !target}
                style={styles.flex}
                icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
              />
            )}
            <Button
              label={t("quranCompanion.dock.hear")}
              variant="secondary"
              disabled={busy}
              onPress={() => void hearAyah()}
              icon={{ ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" }}
            />
          </View>
          <View style={styles.actions}>
            {index > 0 ? (
              <Button
                label={t("quranPronunciation.previous")}
                variant="ghost"
                size="sm"
                disabled={busy}
                onPress={() => goTo(index - 1)}
              />
            ) : null}
            {ayahs.length > 1 && index < ayahs.length - 1 ? (
              <Button
                label={t("quranCompanion.result.nextAyah")}
                variant="ghost"
                size="sm"
                disabled={busy}
                onPress={() => goTo(index + 1)}
              />
            ) : null}
            <Button
              label={t("quranCompanion.result.finish")}
              variant="ghost"
              size="sm"
              disabled={busy}
              onPress={() => void finish()}
            />
          </View>
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            disabled={busy}
            onPress={() => void begin(true)}
            accessibilityState={{ disabled: busy }}
            style={[styles.link, { borderColor: tokens.hairline, borderRadius: Radius.md }]}
          >
            <ThemedText type="caption" themeColor="mutedForeground">
              {deviceCalibration
                ? t("quranPronunciation.calibrate.again")
                : t("quranPronunciation.calibrate.cta")}
            </ThemedText>
          </PressableScale>
        </Card>
      )}

      {teacherFooter}
    </ScreenLayout>
  );
}

const EMPTY_SET = new Set<number>();

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  stack: { gap: Spacing.two },
  gapTop: { marginTop: Spacing.two },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  dot: { width: 8, height: 8, borderRadius: 4 },
  chips: { flexWrap: "wrap", gap: Spacing.one, marginTop: Spacing.two },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    minHeight: 44,
    borderRadius: Radius.sm,
    borderWidth: BorderWidth.thin,
  },
  chipText: { fontSize: 20, lineHeight: 34, writingDirection: "rtl" },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.two },
  link: {
    alignSelf: "flex-start",
    minHeight: 44,
    justifyContent: "center",
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderWidth: BorderWidth.hairline,
  },
  footer: { gap: Spacing.one, marginTop: Spacing.three },
});
