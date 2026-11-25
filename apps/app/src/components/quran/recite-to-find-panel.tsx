import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { TFunction } from "i18next";
import { type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  type SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { engineDownloadMb } from "@/constants/recitation-models";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useIsOnline } from "@/hooks/use-is-online";
import { useReciteToFind, useReciteToFindAvailability } from "@/hooks/use-recite-to-find";
import { useReciteCandidateArabic } from "@/hooks/use-recite-to-find-text";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatBytes } from "@/lib/cache-manager";
import { PRACTICE_ERROR_COPY } from "@/lib/quran-companion/error-codes";
import {
  downloadPercent,
  isListenerUsable,
  type ListenerState,
} from "@/lib/quran-companion/model/download-job";
import { canOpenAppSettings, openAppSettings } from "@/lib/quran-companion/open-app-settings";
import type { EngineId } from "@/lib/quran-companion/types";
import { getSurahByNumber } from "@/lib/quran-meta";
import { practiceFromHereHref, readerHref } from "@/lib/recite-to-find/links";
import type { CandidateStrength, ReciteCandidate } from "@/lib/recite-to-find/reducer";
import { useChevronForward } from "@/lib/rtl";
import { quranListenerStore } from "@/stores/quran-listener-store";

/**
 * Recite to find (D68): a big mic, a live listening state, and the ayahs the
 * on-device listener heard — shown with the bundled Arabic text and surah name.
 * Tap opens the ayah in the reader; "Practise from here" starts practice there.
 * Without the listener, the download card takes the mic's place. Renders
 * nothing where recite-to-find is unavailable (TV, unsupported browsers).
 */
export function ReciteToFindPanel({
  twoPane = false,
}: {
  /** Wide layout: the mic card on the start side, matches beside it. */
  twoPane?: boolean;
}) {
  const { available, listener, engineChoice, wifiOnlyDownload } = useReciteToFindAvailability();
  if (!available) return null;
  if (!isListenerUsable(listener)) {
    return (
      <ListenerDownloadCard listener={listener} engine={engineChoice} wifiOnly={wifiOnlyDownload} />
    );
  }
  return <ReciteListening twoPane={twoPane} />;
}

// ── Listening + results ──────────────────────────────────────────────────────

function ReciteListening({ twoPane }: { twoPane: boolean }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const recite = useReciteToFind();
  const { state, mic, engineStatus, engineError, micPermission, level, toggle } = recite;
  const texts = useReciteCandidateArabic(state.candidates);
  const listening = mic === "listening" || mic === "starting";
  const ready = engineStatus === "ready";

  const { title, hint } = statusCopy(t, {
    status: state.status,
    mic,
    engineStatus,
    hasCandidates: state.candidates.length > 0,
  });
  const error = state.status === "error" ? state.error : engineError;
  const micDenied = error === "mic-denied" || micPermission === "denied";

  const micCard = (
    <Card padding="four" style={[styles.micCard, { borderColor: colors.border }]}>
      <ReciteMicButton
        listening={listening}
        disabled={!ready || mic === "settling"}
        level={level}
        onPress={() => void toggle()}
        label={listening ? t("reciteToFind.mic.stop") : t("reciteToFind.mic.start")}
        hint={listening ? t("reciteToFind.mic.stopHint") : t("reciteToFind.mic.startHint")}
      />
      <View style={styles.statusBlock} accessibilityLiveRegion="polite">
        <ThemedText type="subtitle" style={styles.centerText}>
          {title}
        </ThemedText>
        <ThemedText type="small" themeColor="mutedForeground" style={styles.centerText}>
          {hint}
        </ThemedText>
      </View>
      {error && state.status === "error" ? (
        <View
          style={[
            styles.errorBox,
            {
              backgroundColor: tokens.status.warning.soft,
              borderColor: tokens.status.warning.border,
            },
          ]}
        >
          <ThemedText type="small" style={{ color: tokens.status.warning.color }}>
            {micDenied ? t("reciteToFind.error.micDenied") : t(PRACTICE_ERROR_COPY[error])}
          </ThemedText>
          {micDenied && canOpenAppSettings() ? (
            <Button
              label={t("reciteToFind.error.openSettings")}
              variant="secondary"
              size="sm"
              onPress={() => void openAppSettings()}
            />
          ) : null}
        </View>
      ) : null}
      <PrivacyLine />
    </Card>
  );

  const results = state.candidates.length ? (
    <View style={styles.results}>
      <ThemedText type="smallBold" themeColor="mutedForeground" accessibilityRole="header">
        {listening ? t("reciteToFind.results.live") : t("reciteToFind.results.title")}
      </ThemedText>
      {state.candidates.map((candidate, index) => (
        <CandidateCard
          key={candidate.key}
          candidate={candidate}
          arabic={texts[`${candidate.surah}:${candidate.ayah}`] ?? ""}
          featured={index === 0}
        />
      ))}
    </View>
  ) : null;

  if (twoPane) {
    return (
      <View style={styles.split}>
        <View style={styles.splitStart}>{micCard}</View>
        <View style={styles.splitEnd}>{results}</View>
      </View>
    );
  }
  return (
    <View style={styles.stack}>
      {micCard}
      {results}
    </View>
  );
}

function statusCopy(
  t: TFunction,
  s: {
    status: string;
    mic: string;
    engineStatus: string;
    hasCandidates: boolean;
  },
): { title: string; hint: string } {
  if (s.engineStatus === "loading" || s.engineStatus === "idle") {
    return {
      title: t("reciteToFind.status.preparing"),
      hint: t("reciteToFind.status.preparingHint"),
    };
  }
  if (s.engineStatus === "failed") {
    return { title: t("reciteToFind.status.failed"), hint: t("reciteToFind.status.failedHint") };
  }
  if (s.mic === "starting" || s.mic === "listening") {
    return s.hasCandidates
      ? { title: t("reciteToFind.status.listening"), hint: t("reciteToFind.status.narrowing") }
      : { title: t("reciteToFind.status.listening"), hint: t("reciteToFind.status.nothingYet") };
  }
  if (s.mic === "settling") {
    return {
      title: t("reciteToFind.status.settling"),
      hint: t("reciteToFind.status.settlingHint"),
    };
  }
  switch (s.status) {
    case "found":
      return { title: t("reciteToFind.status.found"), hint: t("reciteToFind.status.foundHint") };
    case "nothing":
      return {
        title: t("reciteToFind.status.nothing"),
        hint: t("reciteToFind.status.nothingHint"),
      };
    case "error":
      return { title: t("reciteToFind.status.stopped"), hint: t("reciteToFind.status.idleHint") };
    default:
      return { title: t("reciteToFind.status.idle"), hint: t("reciteToFind.status.idleHint") };
  }
}

function PrivacyLine() {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  return (
    <View style={styles.privacy}>
      <SymbolView
        name={{ ios: "lock.fill", android: "lock", web: "lock" }}
        size={13}
        tintColor={colors.mutedForeground}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.flex}>
        {t("reciteToFind.privacy")}
      </ThemedText>
    </View>
  );
}

const MIC_SIZE = 88;

function ReciteMicButton({
  listening,
  disabled,
  level,
  onPress,
  label,
  hint,
}: {
  listening: boolean;
  disabled: boolean;
  level: SharedValue<number>;
  onPress: () => void;
  label: string;
  hint: string;
}) {
  const { colors } = useThemeTokens();
  const reducedMotion = useReducedMotion();
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (listening && !reducedMotion) {
      pulse.value = withRepeat(withTiming(1, { duration: 1400 }), -1, false);
    } else {
      cancelAnimation(pulse);
      pulse.value = 0;
    }
  }, [listening, pulse, reducedMotion]);

  // Inner ring follows the voice; the outer ring breathes while listening.
  const levelRing = useAnimatedStyle(() => ({
    opacity: listening ? 0.35 + level.value * 0.4 : 0,
    transform: [{ scale: 1 + (listening ? level.value * 0.35 : 0) }],
  }));
  const pulseRing = useAnimatedStyle(() => ({
    opacity: listening ? 0.35 * (1 - pulse.value) : 0,
    transform: [{ scale: 1 + pulse.value * 0.6 }],
  }));

  return (
    <View style={styles.micWrap}>
      <Animated.View
        style={[styles.ring, { backgroundColor: withAlpha(colors.accent, 0.25) }, pulseRing]}
      />
      <Animated.View
        style={[styles.ring, { backgroundColor: withAlpha(colors.accent, 0.3) }, levelRing]}
      />
      <PressableScale
        haptic="medium"
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={hint}
        accessibilityState={{ disabled, busy: listening }}
        disabled={disabled}
        onPress={onPress}
        style={[
          styles.mic,
          {
            backgroundColor: disabled ? colors.muted : colors.accent,
            borderColor: withAlpha(colors.accent, 0.4),
          },
        ]}
      >
        <SymbolView
          name={
            listening
              ? { ios: "stop.fill", android: "stop", web: "stop" }
              : { ios: "mic.fill", android: "mic", web: "mic" }
          }
          size={34}
          tintColor={disabled ? colors.mutedForeground : colors.accentForeground}
        />
      </PressableScale>
    </View>
  );
}

const STRENGTH_KEY: Record<CandidateStrength, string> = {
  strong: "reciteToFind.strength.strong",
  likely: "reciteToFind.strength.likely",
  possible: "reciteToFind.strength.possible",
};

function CandidateCard({
  candidate,
  arabic,
  featured,
}: {
  candidate: ReciteCandidate;
  arabic: string;
  featured: boolean;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const chevron = useChevronForward();
  const meta = getSurahByNumber(candidate.surah);
  const surahName = meta?.nameTransliteration ?? String(candidate.surah);
  const range =
    candidate.ayahEnd > candidate.ayah
      ? t("reciteToFind.result.range", {
          surah: candidate.surah,
          from: candidate.ayah,
          to: candidate.ayahEnd,
        })
      : t("quran.ayahRef", { surah: candidate.surah, ayah: candidate.ayah });
  const tone =
    candidate.strength === "strong"
      ? tokens.status.success
      : candidate.strength === "likely"
        ? tokens.status.info
        : tokens.status.warning;
  const practiceHref = practiceFromHereHref(candidate.surah, candidate.ayah, candidate.ayahEnd);

  return (
    <View
      style={[
        styles.candidate,
        {
          backgroundColor: featured ? tokens.accentSoft : colors.muted,
          borderColor: featured ? colors.accent : colors.border,
        },
        featured && styles.candidateFeatured,
      ]}
    >
      <View style={styles.candidateHeader}>
        <View style={styles.flex}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {surahName}
          </ThemedText>
          {meta?.nameArabic ? (
            <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
              {meta.nameArabic}
            </ThemedText>
          ) : null}
        </View>
        <View style={styles.badges}>
          <Pill label={range} color={colors.accent} background={colors.card} compact />
          <Pill
            label={t(STRENGTH_KEY[candidate.strength])}
            color={tone.color}
            background={tone.soft}
            compact
          />
        </View>
      </View>
      {arabic ? (
        <ThemedText type="arabic" numberOfLines={featured ? 4 : 2} style={styles.arabic}>
          {arabic}
        </ThemedText>
      ) : null}
      <View style={styles.candidateActions}>
        <Button
          label={t("reciteToFind.result.open")}
          accessibilityHint={t("reciteToFind.result.openHint", { name: surahName, ref: range })}
          variant={featured ? "primary" : "secondary"}
          size="sm"
          trailingIcon={chevron}
          style={styles.flex}
          onPress={() => router.push(readerHref(candidate.surah, candidate.ayah))}
        />
        {practiceHref ? (
          <Button
            label={t("reciteToFind.result.practise")}
            accessibilityHint={t("reciteToFind.result.practiseHint", {
              name: surahName,
              ref: range,
            })}
            variant="ghost"
            size="sm"
            onPress={() => router.push(practiceHref)}
          />
        ) : null}
      </View>
    </View>
  );
}

// ── Listener download ────────────────────────────────────────────────────────

function ListenerDownloadCard({
  listener,
  engine,
  wifiOnly,
}: {
  listener: ListenerState;
  engine: EngineId;
  wifiOnly: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const online = useIsOnline();
  const [cellularConfirm, setCellularConfirm] = useState(false);
  const sizeMb = engineDownloadMb(engine);
  const downloading = listener.status === "downloading" || listener.status === "verifying";
  const failed = listener.status === "failed";

  const requestDownload = async (allowCellular = false) => {
    const result = await quranListenerStore
      .getState()
      .download(engine, { wifiOnly, allowCellular });
    if (result === "needs-cellular-confirm") setCellularConfirm(true);
  };

  let body: ReactNode;
  if (downloading) {
    body = (
      <View style={styles.downloadBody}>
        <ThemedText type="small" themeColor="mutedForeground">
          {listener.status === "verifying"
            ? t("quranCompanion.listener.verifying")
            : t("quranCompanion.listener.downloadingBytes", {
                done: formatBytes(listener.bytesDone),
                total: formatBytes(listener.bytesTotal),
              })}
        </ThemedText>
        <ProgressBar value={downloadPercent(listener) / 100} color={colors.accent} />
        <Button
          label={t("quranCompanion.listener.cancel")}
          variant="ghost"
          size="sm"
          onPress={() => quranListenerStore.getState().cancel()}
        />
      </View>
    );
  } else {
    body = (
      <View style={styles.downloadBody}>
        {failed ? (
          <ThemedText type="small" style={{ color: tokens.status.warning.color }}>
            {t(PRACTICE_ERROR_COPY[listener.error ?? "unknown"])}
          </ThemedText>
        ) : null}
        {online ? (
          <Button
            label={
              failed ? t("quranCompanion.listener.tryAgain") : t("reciteToFind.download.action")
            }
            accessibilityHint={t("reciteToFind.download.size", { size: sizeMb })}
            onPress={() => void requestDownload()}
          />
        ) : (
          <ThemedText type="small" themeColor="mutedForeground">
            {t("reciteToFind.download.offline")}
          </ThemedText>
        )}
      </View>
    );
  }

  return (
    <Card padding="four" style={[styles.downloadCard, { borderColor: colors.border }]}>
      <View style={styles.downloadHeader}>
        <View style={[styles.downloadIcon, { backgroundColor: tokens.accentSoft }]}>
          <SymbolView
            name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
            size={22}
            tintColor={colors.accent}
          />
        </View>
        <View style={styles.flex}>
          <ThemedText type="subtitle">{t("reciteToFind.download.title")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("reciteToFind.download.body")}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("reciteToFind.download.size", { size: sizeMb })}
      </ThemedText>
      {body}
      <PrivacyLine />
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
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  stack: { gap: Spacing.three },
  split: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  splitStart: { width: 440, maxWidth: "44%" },
  splitEnd: { flex: 1, minWidth: 0 },
  micCard: {
    alignItems: "center",
    gap: Spacing.three,
    borderWidth: 1,
  },
  micWrap: {
    width: MIC_SIZE * 1.8,
    height: MIC_SIZE * 1.8,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    pointerEvents: "none",
    width: MIC_SIZE,
    height: MIC_SIZE,
    borderRadius: MIC_SIZE / 2,
  },
  mic: {
    width: MIC_SIZE,
    height: MIC_SIZE,
    borderRadius: MIC_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  statusBlock: { gap: Spacing.one, alignItems: "center", maxWidth: 420 },
  centerText: { textAlign: "center" },
  errorBox: {
    alignSelf: "stretch",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  privacy: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  results: { gap: Spacing.two },
  candidate: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  candidateFeatured: { borderWidth: 1.5 },
  candidateHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: Spacing.one,
    maxWidth: "60%",
  },
  arabic: {
    writingDirection: "rtl",
    lineHeight: Platform.OS === "web" ? 40 : 44,
  },
  candidateActions: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  downloadCard: { gap: Spacing.three, borderWidth: 1 },
  downloadHeader: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.three },
  downloadIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  downloadBody: { gap: Spacing.two },
});
