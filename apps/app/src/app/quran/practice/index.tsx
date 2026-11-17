import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ListenerStatusStrip } from "@/components/quran/listener-status-strip";
import { PracticePassagePicker } from "@/components/quran/practice-passage-picker";
import { PracticePills } from "@/components/quran/practice-pills";
import { PracticeRangeEditor } from "@/components/quran/practice-range-editor";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { SettingsRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { engineDownloadMb } from "@/constants/recitation-models";
import { Radius, Spacing } from "@/constants/theme";
import { useIsOnline } from "@/hooks/use-is-online";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { todaysSitting } from "@/lib/quran-companion/due-queue";
import { isListenerUsable } from "@/lib/quran-companion/model/download-job";
import { clampPassage, modeNeedsListener, passageForPreset } from "@/lib/quran-companion/passage";
import type { Passage, PracticeMode, PracticeView, RangePreset } from "@/lib/quran-companion/types";
import { getSurahByNumber } from "@/lib/quran-meta";
import { useChevronForward } from "@/lib/rtl";
import { useEnsureHifzLoaded } from "@/stores/hifz-store";
import {
  useCompanionPrefs,
  useCompanionPrefsActions,
  useCompanionPrefsReady,
  useEnsureCompanionPrefsLoaded,
} from "@/stores/quran-companion-prefs-store";
import {
  quranListenerStore,
  useEnsureListenerLoaded,
  useListenerState,
} from "@/stores/quran-listener-store";
import { useDueQueue, useEnsureMemorizationLoaded } from "@/stores/quran-memorization-store";
import {
  quranPracticeStore,
  useEnsurePracticeLoaded,
  usePracticeHistory,
} from "@/stores/quran-practice-store";
import { useLastRead, useQuranPrefs } from "@/stores/quran-store";

const MODE_HELP_KEY: Record<PracticeMode, string> = {
  follow: "quranCompanion.modeHelp.follow",
  check: "quranCompanion.modeHelp.check",
  "hide-words": "quranCompanion.modeHelp.hideWords",
  "hide-ayahs": "quranCompanion.modeHelp.hideAyahs",
};

type RangeChoice = RangePreset | "custom";

/**
 * Practice hub (§9.1). Read top to bottom: what the listener can do, what you
 * will practise (tap to change surah/ayah), how, then one primary Start. Revise
 * appears only when ayahs are due. Listening always works before any download.
 */
export default function PracticeHubScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  // Practice is never on TV (no microphone) — width alone gates the split.
  const wideAside = windowWidth >= WIDE_ASIDE_MIN_WIDTH;
  const { colors, tokens } = useThemeTokens();
  const chevron = useChevronForward();
  const params = useLocalSearchParams<{ surah?: string }>();
  useEnsureCompanionPrefsLoaded();
  useEnsureMemorizationLoaded();
  useEnsurePracticeLoaded();
  useEnsureHifzLoaded();
  const prefsReady = useCompanionPrefsReady();
  const prefs = useCompanionPrefs();
  const { update } = useCompanionPrefsActions();
  // TV: never warm the on-device recitation model — practice is mic-only.
  useEnsureListenerLoaded(prefs.engineChoice, prefsReady && isPracticeAvailable());
  const listener = useListenerState();
  const online = useIsOnline();
  const lastRead = useLastRead();
  const quranPrefs = useQuranPrefs();
  const queue = useDueQueue();
  const [cellularConfirm, setCellularConfirm] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  /** A start ayah chosen in the picker; overrides the continue position. */
  const [picked, setPicked] = useState<Passage | null>(null);
  /** An explicit From–To range (the Custom pill, or a range picked in the sheet). */
  const [custom, setCustom] = useState<Passage | null>(null);
  const history = usePracticeHistory();

  useEffect(() => {
    if (!isPracticeAvailable()) router.replace("/quran");
  }, [router]);

  // Continue position (§9.5 startFrom): a plan's surah, last practice, or last read.
  const anchor = useMemo(() => {
    const planSurah = Number(params.surah);
    if (Number.isInteger(planSurah) && planSurah >= 1 && planSurah <= 114) {
      return { surah: planSurah, ayah: 1, page: null as number | null };
    }
    if (prefs.startFrom === "lastPractice" && prefs.lastPassage) {
      return { surah: prefs.lastPassage.surah, ayah: prefs.lastPassage.ayahStart, page: null };
    }
    if (lastRead)
      return { surah: lastRead.surah, ayah: lastRead.ayah, page: lastRead.page ?? null };
    if (prefs.lastPassage) {
      return { surah: prefs.lastPassage.surah, ayah: prefs.lastPassage.ayahStart, page: null };
    }
    return { surah: 1, ayah: 1, page: null };
  }, [lastRead, params.surah, prefs.lastPassage, prefs.startFrom]);

  const pageKnown =
    !picked &&
    (quranPrefs.readerLayout === "page" || quranPrefs.readerLayout === "mushaf") &&
    lastRead?.page != null;
  const presetValue: RangePreset =
    prefs.rangePreset === "page" && !pageKnown ? "ayah" : prefs.rangePreset;

  // "Custom" stays selected until a range pill is tapped again.
  const rangeChoice: RangeChoice = custom ? "custom" : presetValue;
  const start = picked ?? { surah: anchor.surah, ayahStart: anchor.ayah, ayahEnd: anchor.ayah };
  const presetPassage = passageForPreset(
    presetValue,
    start.surah,
    start.ayahStart,
    picked ? null : anchor.page,
  );
  const passage = custom ?? presetPassage;

  // Recent passages (newest first, one per range) for a one-tap restart.
  const recent = useMemo(() => {
    const seen = new Set<string>();
    const out: Array<{ key: string; passage: Passage; mode: PracticeMode }> = [];
    for (const item of history.items) {
      if (item.mode === "revision") continue;
      const key = `${item.surah}:${item.ayahStart}-${item.ayahEnd}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        key,
        passage: { surah: item.surah, ayahStart: item.ayahStart, ayahEnd: item.ayahEnd },
        mode: item.mode,
      });
      if (out.length >= 3) break;
    }
    return out;
  }, [history.items]);

  const rangeOptions: { id: RangeChoice; label: string }[] = [
    { id: "ayah", label: t("quranCompanion.range.ayah") },
    { id: "next5", label: t("quranCompanion.range.next5") },
    { id: "surah", label: t("quranCompanion.range.surah") },
    ...(pageKnown ? [{ id: "page" as const, label: t("quranCompanion.range.page") }] : []),
    { id: "custom", label: t("quranCompanion.range.custom") },
  ];

  const viewOptions: { id: PracticeView; label: string }[] = [
    { id: "ayah", label: t("quran.layoutAyah") },
    { id: "page", label: t("quran.layoutPage") },
    { id: "mushaf", label: t("quran.layoutMushaf") },
  ];

  const modeOptions: { id: PracticeMode; label: string }[] = [
    { id: "follow", label: t("quranCompanion.mode.follow") },
    { id: "check", label: t("quranCompanion.mode.check") },
    { id: "hide-words", label: t("quranCompanion.mode.hideWords") },
    { id: "hide-ayahs", label: t("quranCompanion.mode.hideAyahs") },
  ];

  const usable = isListenerUsable(listener);
  const unsupported = listener.status === "unsupported";
  const sizeMb = engineDownloadMb(prefs.engineChoice);
  const manualOnly = !usable && modeNeedsListener(prefs.defaultMode);
  const sitting = todaysSitting(queue, prefs.dailyRevisionLimit);
  const surahMeta = getSurahByNumber(passage?.surah ?? start.surah);
  const surahName = surahMeta?.nameTransliteration ?? String(passage?.surah ?? start.surah);
  const passageLabel = passage
    ? passage.ayahStart === passage.ayahEnd
      ? t("quranCompanion.passage.single", { surah: surahName, ayah: passage.ayahStart })
      : t("quranCompanion.passage.range", {
          surah: surahName,
          from: passage.ayahStart,
          to: passage.ayahEnd,
        })
    : "";
  const ayahTotal = passage ? passage.ayahEnd - passage.ayahStart + 1 : 0;

  const openSession = (target: Passage, mode: PracticeMode) =>
    router.push({
      pathname: "/quran/practice/session",
      params: {
        surah: String(target.surah),
        from: String(target.ayahStart),
        to: String(target.ayahEnd),
        mode,
        source: "hub",
      },
    });
  const startSession = () => {
    if (passage) openSession(passage, prefs.defaultMode);
  };

  const startRevision = () => {
    const first = sitting.items[0];
    if (!first) return;
    quranPracticeStore
      .getState()
      .startSitting({ items: sitting.items, index: 0, remaining: sitting.remaining });
    router.push({
      pathname: "/quran/practice/session",
      params: {
        surah: String(first.surah),
        from: String(first.ayah),
        to: String(first.ayah),
        mode: "revision",
        source: "revision",
      },
    });
  };

  const requestDownload = async (allowCellular = false) => {
    const result = await quranListenerStore
      .getState()
      .download(prefs.engineChoice, { wifiOnly: prefs.wifiOnlyDownload, allowCellular });
    if (result === "needs-cellular-confirm") setCellularConfirm(true);
  };

  const chooseRange = (id: RangeChoice) => {
    if (id === "custom") {
      // Start from what is selected now, so the editor opens on a familiar range.
      if (!custom && presetPassage) setCustom(presetPassage);
      return;
    }
    // Keep the custom start ayah; drop the custom end.
    if (custom) setPicked({ ...custom, ayahEnd: custom.ayahStart });
    setCustom(null);
    void update({ rangePreset: id });
  };

  const openSettings = () =>
    router.push({
      pathname: "/settings/quran-practice",
      params: { from: "hub" },
    } as unknown as Href);

  const statusStrip = (
    <ListenerStatusStrip
      listener={listener}
      online={online}
      sizeMb={sizeMb}
      onDownload={() => void requestDownload()}
      onCancel={() => quranListenerStore.getState().cancel()}
    />
  );
  const reviseCard =
    sitting.items.length > 0 ? (
      <Card padding="three">
        <View style={styles.reviseHeader}>
          <SymbolView
            name={{ ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" }}
            size={20}
            tintColor={tokens.status.warning.color}
          />
          <ThemedText type="subtitle" style={styles.flex}>
            {t("quranCompanion.hub.reviseTitle", { count: queue.length })}
          </ThemedText>
        </View>
        {sitting.remaining > 0 ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.gapTop}>
            {t("quranCompanion.hub.reviseRemaining", { count: sitting.remaining })}
          </ThemedText>
        ) : null}
        <View style={styles.reviseActions}>
          <Button
            label={t("quranCompanion.hub.startRevision")}
            variant="secondary"
            onPress={startRevision}
            style={styles.flex}
          />
          <Button
            label={t("quranCompanion.hub.openQueue")}
            variant="ghost"
            onPress={() => router.push("/quran/revision" as Href)}
          />
        </View>
      </Card>
    ) : null;
  const passageCard = (
    <Card padding="three">
      <ThemedText type="caption" themeColor="mutedForeground">
        {picked ? t("quranCompanion.hub.passageLabel") : t("quranCompanion.hub.continue")}
      </ThemedText>
      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={`${passageLabel}. ${t("quranCompanion.hub.change")}`}
        accessibilityHint={t("quranCompanion.picker.title")}
        onPress={() => setPickerOpen(true)}
        style={[styles.passageRow, { backgroundColor: colors.muted }]}
      >
        <View style={[styles.passageBadge, { backgroundColor: tokens.accentSoft }]}>
          <ThemedText type="smallBold" style={{ color: colors.accent }}>
            {passage?.surah ?? start.surah}
          </ThemedText>
        </View>
        <View style={styles.flex}>
          <ThemedText type="subtitle" numberOfLines={1}>
            {passageLabel}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("quranCompanion.hub.ayahCount", { count: ayahTotal })}
            {surahMeta?.nameArabic ? ` · ${surahMeta.nameArabic}` : ""}
          </ThemedText>
        </View>
        <View style={styles.changeLink}>
          <ThemedText type="smallBold" style={{ color: colors.accent }}>
            {t("quranCompanion.hub.change")}
          </ThemedText>
          <SymbolView name={chevron} size={14} tintColor={colors.accent} />
        </View>
      </PressableScale>

      <ThemedText type="smallBold" style={styles.sectionGap}>
        {t("quranCompanion.hub.rangeTitle")}
      </ThemedText>
      <PracticePills
        options={rangeOptions}
        value={rangeChoice}
        onChange={chooseRange}
        accessibilityLabel={t("quranCompanion.hub.rangeTitle")}
      />
      {custom ? <PracticeRangeEditor value={custom} onChange={setCustom} /> : null}

      <ThemedText type="smallBold" style={styles.sectionGap}>
        {t("quranCompanion.hub.modeTitle")}
      </ThemedText>
      <PracticePills
        options={modeOptions}
        value={prefs.defaultMode}
        onChange={(id) => void update({ defaultMode: id })}
        accessibilityLabel={t("quranCompanion.hub.modeTitle")}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.gapTop}>
        {t(MODE_HELP_KEY[prefs.defaultMode])}
      </ThemedText>
      <ThemedText type="smallBold" style={styles.sectionGap}>
        {t("quranCompanion.view.title")}
      </ThemedText>
      <PracticePills
        options={viewOptions}
        value={prefs.practiceView}
        onChange={(id) => void update({ practiceView: id })}
        accessibilityLabel={t("quranCompanion.view.title")}
      />

      {manualOnly && !unsupported ? (
        <View
          style={[
            styles.note,
            {
              backgroundColor: tokens.status.warning.soft,
              borderColor: tokens.status.warning.border,
            },
          ]}
        >
          <ThemedText type="caption" style={{ color: tokens.status.warning.color }}>
            {t("quranCompanion.hub.captionManualMode")}
          </ThemedText>
        </View>
      ) : null}

      <Button
        label={
          unsupported && Platform.OS === "web"
            ? t("quranCompanion.hub.listen")
            : t("quranCompanion.hub.startPassage", { passage: passageLabel })
        }
        onPress={startSession}
        disabled={!passage}
        fullWidth
        icon={{ ios: "play.fill", android: "play_arrow", web: "play_arrow" }}
        style={styles.startButton}
      />
    </Card>
  );
  const recentCard =
    recent.length > 0 ? (
      <Card padding="three">
        <ThemedText type="smallBold">{t("quranCompanion.hub.recentTitle")}</ThemedText>
        <View style={styles.recentList}>
          {recent.map((r) => {
            const name =
              getSurahByNumber(r.passage.surah)?.nameTransliteration ?? String(r.passage.surah);
            const label =
              r.passage.ayahStart === r.passage.ayahEnd
                ? t("quranCompanion.passage.single", { surah: name, ayah: r.passage.ayahStart })
                : t("quranCompanion.passage.range", {
                    surah: name,
                    from: r.passage.ayahStart,
                    to: r.passage.ayahEnd,
                  });
            const modeLabel = modeOptions.find((m) => m.id === r.mode)?.label ?? "";
            return (
              <PressableScale
                key={r.key}
                haptic="light"
                accessibilityRole="button"
                accessibilityLabel={`${label}, ${modeLabel}`}
                accessibilityHint={t("quranCompanion.hub.recentHint")}
                onPress={() => openSession(r.passage, r.mode)}
                style={[styles.recentRow, { backgroundColor: colors.muted }]}
              >
                <SymbolView
                  name={{ ios: "arrow.clockwise", android: "replay", web: "replay" }}
                  size={16}
                  tintColor={colors.accent}
                />
                <ThemedText type="smallBold" style={styles.flex} numberOfLines={1}>
                  {label}
                </ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {modeLabel}
                </ThemedText>
              </PressableScale>
            );
          })}
        </View>
      </Card>
    ) : null;
  const settingsRow = (
    <SettingsRow
      icon={{ ios: "slider.horizontal.3", android: "tune", web: "tune" }}
      title={t("quranCompanion.settings.title")}
      subtitle={t("quranCompanion.settings.rowSubtitle")}
      onPress={openSettings}
    />
  );

  return (
    <ScreenLayout
      eyebrow={t("quran.eyebrow")}
      title={t("quranCompanion.hub.title")}
      subtitle={t("quranCompanion.hub.subtitle")}
      onBack={() => goBackOrReplace(router, "/quran")}
    >
      <Seo path="/quran/practice" />
      {wideAside ? (
        // Desktop: the practice form keeps a form-width main column; listener
        // status, the revision prompt and settings move to a side column.
        <View style={styles.wideRow}>
          <View style={styles.wideMain}>
            <Stagger>{passageCard}</Stagger>
          </View>
          <View style={styles.wideAside}>
            <Stagger>
              {statusStrip}
              {reviseCard}
              {recentCard}
              {settingsRow}
            </Stagger>
          </View>
        </View>
      ) : (
        <Stagger>
          {statusStrip}
          {reviseCard}
          {passageCard}
          {recentCard}
          {settingsRow}
        </Stagger>
      )}

      <PracticePassagePicker
        visible={pickerOpen}
        initial={passage}
        onClose={() => setPickerOpen(false)}
        onSelect={(next) => {
          setPickerOpen(false);
          const clamped = clampPassage(next);
          if (!clamped) return;
          if (clamped.ayahEnd !== clamped.ayahStart || custom) {
            setCustom(clamped);
          } else {
            setPicked(clamped);
          }
        }}
      />

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
    </ScreenLayout>
  );
}

/** Window width at which the hub splits into form + side column. */
const WIDE_ASIDE_MIN_WIDTH = 1200;

const styles = StyleSheet.create({
  wideRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four, width: "100%" },
  wideMain: { flex: 1, minWidth: 0, maxWidth: 720 },
  wideAside: { flex: 1, minWidth: 300, maxWidth: 400, gap: Spacing.three },
  flex: { flex: 1, minWidth: 0 },
  gapTop: { marginTop: Spacing.two },
  sectionGap: { marginTop: Spacing.three, marginBottom: Spacing.one },
  reviseHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  reviseActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  passageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    marginTop: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  passageBadge: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  changeLink: { flexDirection: "row", alignItems: "center", gap: 4 },
  recentList: { gap: Spacing.two, marginTop: Spacing.two },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  note: {
    marginTop: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  startButton: { marginTop: Spacing.four },
});
