import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ListenerStatusStrip } from "@/components/quran/listener-status-strip";
import { PracticePassagePicker } from "@/components/quran/practice-passage-picker";
import { type PracticePillOption, PracticePills } from "@/components/quran/practice-pills";
import { PracticeRangeEditor } from "@/components/quran/practice-range-editor";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { SettingsRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { engineDownloadMb } from "@/constants/recitation-models";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useIsOnline } from "@/hooks/use-is-online";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { todaysSitting } from "@/lib/quran-companion/due-queue";
import { isListenerUsable } from "@/lib/quran-companion/model/download-job";
import { clampPassage, modeNeedsListener, passageForPreset } from "@/lib/quran-companion/passage";
import type { Passage, PracticeMode, PracticeView, RangePreset } from "@/lib/quran-companion/types";
import { getSurahByNumber } from "@/lib/quran-meta";
import { isPronunciationCheckPlatformAvailable } from "@/lib/quran-pronunciation/availability";
import { pronunciationCheckHref } from "@/lib/quran-pronunciation/entry";
import { useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { updateCompanionPrefs } from "@/lib/settings/companion-shortcuts";
import { useEnsureHifzLoaded } from "@/stores/hifz-store";
import {
  useCompanionPrefs,
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
type Icon = SymbolViewProps["name"];

const MODE_ICON: Record<PracticeMode, Icon> = {
  follow: { ios: "waveform", android: "graphic_eq", web: "graphic_eq" },
  check: { ios: "checkmark.circle", android: "fact_check", web: "fact_check" },
  "hide-words": { ios: "eye.slash", android: "visibility_off", web: "visibility_off" },
  "hide-ayahs": { ios: "eye.slash.circle", android: "hide_source", web: "hide_source" },
};

const RANGE_ICON: Record<RangeChoice, Icon> = {
  ayah: { ios: "text.alignleft", android: "short_text", web: "short_text" },
  next5: { ios: "list.number", android: "format_list_numbered", web: "format_list_numbered" },
  surah: { ios: "book.closed", android: "menu_book", web: "menu_book" },
  page: { ios: "doc.text", android: "description", web: "description" },
  custom: { ios: "slider.horizontal.3", android: "tune", web: "tune" },
};

const VIEW_ICON: Record<PracticeView, Icon> = {
  ayah: { ios: "text.justify", android: "view_agenda", web: "view_agenda" },
  page: { ios: "doc.plaintext", android: "article", web: "article" },
  mushaf: { ios: "book", android: "auto_stories", web: "auto_stories" },
};

/** Small icon well + bold label that opens each choice group (and card titles). */
function SectionLabel({ icon, label, first }: { icon: Icon; label: string; first?: boolean }) {
  return (
    <View
      style={[styles.sectionLabel, first ? null : styles.sectionGap]}
      accessibilityRole="header"
    >
      <IconWell icon={icon} size={14} well={26} radius={8} />
      <ThemedText type="smallBold">{label}</ThemedText>
    </View>
  );
}

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
  // Hub pickers are shortcuts to Settings › Qur'an › Practice (one write path).
  const update = updateCompanionPrefs;
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

  const rangeOptions: PracticePillOption<RangeChoice>[] = [
    { id: "ayah", label: t("quranCompanion.range.ayah"), icon: RANGE_ICON.ayah },
    { id: "next5", label: t("quranCompanion.range.next5"), icon: RANGE_ICON.next5 },
    { id: "surah", label: t("quranCompanion.range.surah"), icon: RANGE_ICON.surah },
    ...(pageKnown
      ? [{ id: "page" as const, label: t("quranCompanion.range.page"), icon: RANGE_ICON.page }]
      : []),
    { id: "custom", label: t("quranCompanion.range.custom"), icon: RANGE_ICON.custom },
  ];

  const viewOptions: PracticePillOption<PracticeView>[] = [
    { id: "ayah", label: t("quran.layoutAyah"), icon: VIEW_ICON.ayah },
    { id: "page", label: t("quran.layoutPage"), icon: VIEW_ICON.page },
    { id: "mushaf", label: t("quran.layoutMushaf"), icon: VIEW_ICON.mushaf },
  ];

  const modeOptions: PracticePillOption<PracticeMode>[] = [
    { id: "follow", label: t("quranCompanion.mode.follow"), icon: MODE_ICON.follow },
    { id: "check", label: t("quranCompanion.mode.check"), icon: MODE_ICON.check },
    { id: "hide-words", label: t("quranCompanion.mode.hideWords"), icon: MODE_ICON["hide-words"] },
    { id: "hide-ayahs", label: t("quranCompanion.mode.hideAyahs"), icon: MODE_ICON["hide-ayahs"] },
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
          <IconWell
            icon={{ ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" }}
            size={20}
            tint={tokens.status.warning.color}
            background={tokens.status.warning.soft}
          />
          <View style={styles.flex}>
            <ThemedText type="subtitle">
              {t("quranCompanion.hub.reviseTitle", { count: queue.length })}
            </ThemedText>
            {sitting.remaining > 0 ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("quranCompanion.hub.reviseRemaining", { count: sitting.remaining })}
              </ThemedText>
            ) : null}
          </View>
        </View>
        <View style={styles.reviseActions}>
          <Button
            label={t("quranCompanion.hub.startRevision")}
            icon={{ ios: "play.fill", android: "play_arrow", web: "play_arrow" }}
            variant="secondary"
            onPress={startRevision}
            style={styles.flex}
          />
          <Button
            label={t("quranCompanion.hub.openQueue")}
            icon={{
              ios: "list.bullet",
              android: "format_list_bulleted",
              web: "format_list_bulleted",
            }}
            variant="ghost"
            onPress={() => router.push("/quran/revision" as Href)}
            style={styles.flex}
          />
        </View>
      </Card>
    ) : null;
  const passageCard = (
    <Card padding="three">
      <View style={styles.eyebrowRow}>
        <SymbolView
          name={
            picked
              ? { ios: "book", android: "menu_book", web: "menu_book" }
              : { ios: "clock.arrow.circlepath", android: "history", web: "history" }
          }
          size={14}
          tintColor={colors.mutedForeground}
        />
        <ThemedText type="caption" themeColor="mutedForeground">
          {picked ? t("quranCompanion.hub.passageLabel") : t("quranCompanion.hub.continue")}
        </ThemedText>
      </View>
      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={`${passageLabel}. ${t("quranCompanion.hub.change")}`}
        accessibilityHint={t("quranCompanion.picker.title")}
        onPress={() => setPickerOpen(true)}
        style={[
          styles.passageRow,
          { backgroundColor: colors.muted, borderColor: tokens.accentBorder },
        ]}
      >
        <View style={[styles.passageBadge, { backgroundColor: tokens.accentSoft }]}>
          <ThemedText type="smallBold" style={{ color: colors.accentText }}>
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
        <View style={[styles.changeLink, { backgroundColor: tokens.accentSoft }]}>
          <SymbolView
            name={{ ios: "pencil", android: "edit", web: "edit" }}
            size={14}
            tintColor={colors.accent}
          />
          <ThemedText type="smallBold" style={{ color: colors.accentText }}>
            {t("quranCompanion.hub.change")}
          </ThemedText>
        </View>
      </PressableScale>

      <SectionLabel
        icon={{ ios: "arrow.left.and.right", android: "straighten", web: "straighten" }}
        label={t("quranCompanion.hub.rangeTitle")}
      />
      <PracticePills
        options={rangeOptions}
        value={rangeChoice}
        onChange={chooseRange}
        accessibilityLabel={t("quranCompanion.hub.rangeTitle")}
      />
      {custom ? <PracticeRangeEditor value={custom} onChange={setCustom} /> : null}

      <SectionLabel
        icon={{ ios: "graduationcap", android: "school", web: "school" }}
        label={t("quranCompanion.hub.modeTitle")}
      />
      <PracticePills
        options={modeOptions}
        value={prefs.defaultMode}
        onChange={(id) => void update({ defaultMode: id })}
        accessibilityLabel={t("quranCompanion.hub.modeTitle")}
      />
      <View style={[styles.modeHelp, { backgroundColor: withAlpha(colors.accent, 0.08) }]}>
        <SymbolView
          name={MODE_ICON[prefs.defaultMode]}
          size={16}
          tintColor={colors.accent}
          style={styles.calloutIcon}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.flex}>
          {t(MODE_HELP_KEY[prefs.defaultMode])}
        </ThemedText>
      </View>
      <SectionLabel
        icon={{ ios: "square.split.1x2", android: "view_agenda", web: "view_agenda" }}
        label={t("quranCompanion.view.title")}
      />
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
          <SymbolView
            name={{ ios: "exclamationmark.triangle", android: "warning", web: "warning" }}
            size={16}
            tintColor={tokens.status.warning.color}
            style={styles.calloutIcon}
          />
          <ThemedText type="caption" style={[styles.flex, { color: tokens.status.warning.text }]}>
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
      {passage && isPronunciationCheckPlatformAvailable() ? (
        <Button
          label={t("quranPronunciation.entry.hub")}
          variant="secondary"
          onPress={() =>
            router.push(
              pronunciationCheckHref(passage.surah, passage.ayahStart, passage.ayahEnd, "hub"),
            )
          }
          fullWidth
          icon={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
          style={styles.startButton}
        />
      ) : null}
    </Card>
  );
  const recentCard =
    recent.length > 0 ? (
      <Card padding="three">
        <SectionLabel
          first
          icon={{ ios: "clock.arrow.circlepath", android: "history", web: "history" }}
          label={t("quranCompanion.hub.recentTitle")}
        />
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
                <View style={[styles.recentIcon, { backgroundColor: tokens.accentSoft }]}>
                  <SymbolView
                    name={{ ios: "arrow.clockwise", android: "replay", web: "replay" }}
                    size={14}
                    tintColor={colors.accent}
                  />
                </View>
                <ThemedText type="smallBold" style={styles.flex} numberOfLines={1}>
                  {label}
                </ThemedText>
                <View style={[styles.modeChip, { borderColor: colors.border }]}>
                  <SymbolView
                    name={MODE_ICON[r.mode]}
                    size={12}
                    tintColor={colors.mutedForeground}
                  />
                  <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                    {modeLabel}
                  </ThemedText>
                </View>
                <SymbolView name={chevron} size={14} tintColor={colors.mutedForeground} />
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
  sectionLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  sectionGap: { marginTop: Spacing.four },
  eyebrowRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  modeHelp: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    marginTop: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  /** Nudge so a 16pt symbol lines up with the first caption line. */
  calloutIcon: { marginTop: 1 },
  reviseHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
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
    borderWidth: StyleSheet.hairlineWidth,
  },
  passageBadge: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  changeLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
  },
  recentList: { gap: Spacing.two },
  recentIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexShrink: 1,
  },
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
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    marginTop: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  startButton: { marginTop: Spacing.four },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/practice");
