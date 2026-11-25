import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ListenerStatusStrip } from "@/components/quran/listener-status-strip";
import { PronunciationSettingsCard } from "@/components/quran/pronunciation-settings-card";
import { ChoiceList } from "@/components/settings/choice-list";
import { MicrophoneStatusRow } from "@/components/settings/editors/practice-editors";
import { SettingsColumns, useSettingsTwoColumn } from "@/components/settings/settings-layout";
import { SettingsRow, ToggleRow } from "@/components/settings/settings-rows";
import { SettingsDetailScreen } from "@/components/settings/settings-screen";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { engineDownloadMb, RECITATION_MODEL_HOST } from "@/constants/recitation-models";
import { Radius, Spacing } from "@/constants/theme";
import { useIsOnline } from "@/hooks/use-is-online";
import { useNotificationPermissions } from "@/hooks/use-notification-permissions";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { requestReminderReschedule } from "@/lib/notifications/reschedule";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import type {
  DailyRevisionLimit,
  EngineId,
  FeedbackTiming,
  HearBeforeRecite,
  PracticeMode,
  StartFrom,
} from "@/lib/quran-companion/types";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { updateCompanionPrefs } from "@/lib/settings/companion-shortcuts";
import { useReadingDisplayToggles } from "@/lib/settings/use-reading-display-toggles";
import { usePreferences } from "@/stores/preferences-store";
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
import { quranPracticeStore, useEnsurePracticeLoaded } from "@/stores/quran-practice-store";

type Pending =
  | { kind: "delete" }
  | { kind: "cellular" }
  | { kind: "switchEngine"; engine: EngineId }
  | { kind: "update" }
  | { kind: "deleteHistory" }
  | null;

const MODE_HELP_KEY: Record<PracticeMode, string> = {
  follow: "quranCompanion.modeHelp.follow",
  check: "quranCompanion.modeHelp.check",
  "hide-words": "quranCompanion.modeHelp.hideWords",
  "hide-ayahs": "quranCompanion.modeHelp.hideAyahs",
};
const TIMING_HELP_KEY: Record<FeedbackTiming, string> = {
  ayah: "quranCompanion.settings.timingHelp.ayah",
  live: "quranCompanion.settings.timingHelp.live",
  end: "quranCompanion.settings.timingHelp.end",
};
const HEAR_HELP_KEY: Record<HearBeforeRecite, string> = {
  off: "quranCompanion.settings.hearHelp.off",
  once: "quranCompanion.settings.hearHelp.once",
  "every-ayah": "quranCompanion.settings.hearHelp.every",
};
const START_HELP_KEY: Record<StartFrom, string> = {
  lastPractice: "quranCompanion.settings.startHelp.lastPractice",
  lastRead: "quranCompanion.settings.startHelp.lastRead",
  ask: "quranCompanion.settings.startHelp.ask",
};

/** A labelled setting with a one-line explanation of the current choice. */
function SettingBlock({
  title,
  help,
  children,
}: {
  title: string;
  help: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.block}>
      <ThemedText type="smallBold">{title}</ThemedText>
      {children}
      <ThemedText type="caption" themeColor="mutedForeground">
        {help}
      </ThemedText>
    </View>
  );
}

/**
 * Settings → Qur'an practice (§9.5). Four cards, in this order: Listener,
 * Practice, Revision, Privacy and sources. The Listener card is the only place
 * that deletes the model. Hidden entirely on TV.
 */
export default function QuranPracticeSettingsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string }>();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const online = useIsOnline();
  useEnsureCompanionPrefsLoaded();
  useEnsurePracticeLoaded();
  const ready = useCompanionPrefsReady();
  const prefs = useCompanionPrefs();
  // Every row writes through its registered setting (quran.practice.*, §4.5.4).
  const update = updateCompanionPrefs;
  // Translation / transliteration are the app-wide pair (Text & fonts, D13).
  const readingDisplay = useReadingDisplayToggles();
  useEnsureListenerLoaded(prefs.engineChoice, ready);
  const listener = useListenerState();
  const userPrefs = usePreferences();
  const notifications = useNotificationPermissions();
  const [pending, setPending] = useState<Pending>(null);

  useEffect(() => {
    if (!isPracticeAvailable()) router.replace("/settings");
  }, [router]);

  const engine = listener.manifest?.engine ?? prefs.engineChoice;
  const sizeMb = engineDownloadMb(prefs.engineChoice);

  const startDownload = async (allowCellular = false) => {
    const result = await quranListenerStore
      .getState()
      .download(prefs.engineChoice, { wifiOnly: prefs.wifiOnlyDownload, allowCellular });
    if (result === "needs-cellular-confirm") setPending({ kind: "cellular" });
  };

  const onConfirm = () => {
    const p = pending;
    setPending(null);
    if (!p) return;
    switch (p.kind) {
      case "delete":
        void quranListenerStore.getState().remove();
        break;
      case "cellular":
        void startDownload(true);
        break;
      case "switchEngine":
        void (async () => {
          await quranListenerStore.getState().remove();
          await update({ engineChoice: p.engine });
          await quranListenerStore.getState().load(p.engine);
        })();
        break;
      case "update":
        void startDownload();
        break;
      case "deleteHistory":
        void quranPracticeStore.getState().clearHistory();
        break;
    }
  };

  const chooseEngine = (next: EngineId) => {
    if (next === prefs.engineChoice) return;
    if (listener.manifest && listener.manifest.engine !== next) {
      setPending({ kind: "switchEngine", engine: next });
      return;
    }
    void update({ engineChoice: next }).then(() => quranListenerStore.getState().load(next));
  };

  const toggleReminder = async (value: boolean) => {
    if (value && !notifications.granted) {
      const result = await notifications.requestPermission();
      if (!result || (typeof result === "object" && "granted" in result && !result.granted)) {
        await notifications.refresh();
      }
    }
    await update({ revisionReminder: value });
    requestReminderReschedule();
  };

  const timingOptions: { value: FeedbackTiming; label: string }[] = [
    { value: "ayah", label: t("quranCompanion.settings.timing.ayah") },
    { value: "live", label: t("quranCompanion.settings.timing.live") },
    { value: "end", label: t("quranCompanion.settings.timing.end") },
  ];
  const hearOptions: { value: HearBeforeRecite; label: string }[] = [
    { value: "off", label: t("quranCompanion.settings.hear.off") },
    { value: "once", label: t("quranCompanion.settings.hear.once") },
    { value: "every-ayah", label: t("quranCompanion.settings.hear.every") },
  ];
  const startOptions: { value: StartFrom; label: string }[] = [
    { value: "lastPractice", label: t("quranCompanion.settings.startFrom.lastPractice") },
    { value: "lastRead", label: t("quranCompanion.settings.startFrom.lastRead") },
    { value: "ask", label: t("quranCompanion.settings.startFrom.ask") },
  ];
  const modeOptions: { value: PracticeMode; label: string }[] = [
    { value: "follow", label: t("quranCompanion.mode.follow") },
    { value: "check", label: t("quranCompanion.mode.check") },
    { value: "hide-words", label: t("quranCompanion.mode.hideWords") },
    { value: "hide-ayahs", label: t("quranCompanion.mode.hideAyahs") },
  ];
  const limitOptions: { value: DailyRevisionLimit; label: string }[] = (
    [5, 10, 20] as DailyRevisionLimit[]
  ).map((n) => ({ value: n, label: String(n) }));

  const masterOff = !userPrefs.notificationPrefs.masterEnabled;
  const usable = listener.status === "ready" || listener.status === "update-available";
  const onDeviceMb = listener.manifest
    ? Math.round(listener.manifest.files.reduce((sum, f) => sum + f.bytes, 0) / (1024 * 1024))
    : sizeMb;

  // Card 1 — Listener: one status strip with the action that moves it forward.
  const listenerCard = (
    <Card padding="three">
      <SectionHeader
        title={t("quranCompanion.listener.title")}
        icon={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
      />
      <View style={styles.rows}>
        <ListenerStatusStrip
          listener={listener}
          online={online}
          sizeMb={sizeMb}
          onDownload={() => void startDownload()}
          onCancel={() => quranListenerStore.getState().cancel()}
        />
        {usable ? (
          <View style={[styles.detailRow, { backgroundColor: colors.muted }]}>
            <View style={styles.flex}>
              <ThemedText type="small">
                {t("quranCompanion.listener.detailsLine", {
                  size: onDeviceMb,
                  engine:
                    engine === "tilawa-zipformer"
                      ? t("quranCompanion.listener.recommended")
                      : t("quranCompanion.listener.alternate"),
                })}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                {listener.status === "update-available"
                  ? t("quranCompanion.listener.updateSize", { size: sizeMb })
                  : t("quranCompanion.listener.version", {
                      version: listener.manifest?.version ?? "",
                    })}
              </ThemedText>
            </View>
            {listener.status === "update-available" ? (
              <Button
                label={t("quranCompanion.listener.downloadUpdate")}
                size="sm"
                onPress={() => setPending({ kind: "update" })}
              />
            ) : null}
            <Button
              label={t("quranCompanion.listener.delete")}
              variant="ghost"
              size="sm"
              onPress={() => setPending({ kind: "delete" })}
              labelColor={tokens.status.danger.color}
            />
          </View>
        ) : null}

        {listener.status !== "unsupported" ? (
          <ToggleRow
            icon={{ ios: "wifi", android: "wifi", web: "wifi" }}
            title={t("quranCompanion.listener.wifiOnly")}
            subtitle={t("quranCompanion.listener.staysOnDevice")}
            value={prefs.wifiOnlyDownload}
            onValueChange={(value) => void update({ wifiOnlyDownload: value })}
          />
        ) : null}

        {/* Web serves only the recommended listener from this site (no CORS on GitHub assets). */}
        {listener.status !== "unsupported" && Platform.OS !== "web" ? (
          <CollapsibleSection title={t("quranCompanion.listener.advanced")}>
            <View style={styles.rows}>
              <ChoiceList
                items={[
                  {
                    value: "tilawa-zipformer" as EngineId,
                    label: t("quranCompanion.listener.recommendedSize", {
                      size: engineDownloadMb("tilawa-zipformer"),
                    }),
                  },
                  {
                    value: "tilawa-fastconformer" as EngineId,
                    label: t("quranCompanion.listener.alternateSize", {
                      size: engineDownloadMb("tilawa-fastconformer"),
                    }),
                  },
                ]}
                value={prefs.engineChoice}
                onChange={chooseEngine}
              />
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("quranCompanion.listener.alternateCaption")}
              </ThemedText>
            </View>
          </CollapsibleSection>
        ) : null}
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranCompanion.listener.knownLimits")}
        </ThemedText>
      </View>
    </Card>
  );

  // Card 2 — During a session
  const sessionCard = (
    <Card padding="three">
      <SectionHeader
        title={t("quranCompanion.settings.sessionTitle")}
        icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
      />
      <SettingBlock
        title={t("quranCompanion.settings.defaultMode")}
        help={t(MODE_HELP_KEY[prefs.defaultMode])}
      >
        <ChoiceList
          items={modeOptions}
          value={prefs.defaultMode}
          onChange={(mode) => void update({ defaultMode: mode })}
        />
      </SettingBlock>
      <SettingBlock
        title={t("quranCompanion.settings.feedbackTiming")}
        help={t(TIMING_HELP_KEY[prefs.feedbackTiming])}
      >
        <ChoiceList
          items={timingOptions}
          value={prefs.feedbackTiming}
          onChange={(id) => void update({ feedbackTiming: id })}
        />
      </SettingBlock>
      <SettingBlock
        title={t("quranCompanion.settings.hearBeforeRecite")}
        help={t(HEAR_HELP_KEY[prefs.hearBeforeRecite])}
      >
        <ChoiceList
          items={hearOptions}
          value={prefs.hearBeforeRecite}
          onChange={(id) => void update({ hearBeforeRecite: id })}
        />
      </SettingBlock>
      <SettingBlock
        title={t("quranCompanion.settings.startFromTitle")}
        help={t(START_HELP_KEY[prefs.startFrom])}
      >
        <ChoiceList
          items={startOptions}
          value={prefs.startFrom}
          onChange={(id) => void update({ startFrom: id })}
        />
      </SettingBlock>
      <View style={styles.rows}>
        <ToggleRow
          icon={{ ios: "forward.fill", android: "fast_forward", web: "fast_forward" }}
          title={t("quranCompanion.settings.autoAdvance")}
          subtitle={t("quranCompanion.settings.autoAdvanceSub")}
          value={prefs.autoAdvance}
          onValueChange={(value) => void update({ autoAdvance: value })}
        />
        {Platform.OS !== "web" ? (
          <ToggleRow
            icon={{ ios: "sun.max.fill", android: "light_mode", web: "light_mode" }}
            title={t("quranCompanion.settings.keepAwake")}
            value={prefs.keepAwake}
            onValueChange={(value) => void update({ keepAwake: value })}
          />
        ) : null}
        {/* D68: recited ayahs → today's reading log + personal khatm. */}
        <ToggleRow
          icon={{ ios: "book.fill", android: "auto_stories", web: "auto_stories" }}
          title={t("practiceReadingCredit.settings.title")}
          subtitle={t("practiceReadingCredit.settings.sub")}
          value={prefs.logToReadingLog !== false}
          onValueChange={(value) => void update({ logToReadingLog: value })}
        />
      </View>
    </Card>
  );

  // Card 3 — On screen
  const screenCard = (
    <Card padding="three">
      <SectionHeader
        title={t("quranCompanion.settings.displayTitle")}
        icon={{ ios: "textformat", android: "text_fields", web: "text_fields" }}
      />
      <View style={styles.rows}>
        <ToggleRow
          icon={{ ios: "globe", android: "translate", web: "translate" }}
          title={t("quranCompanion.settings.showTranslation")}
          subtitle={t("settingsPanel.readingDisplaySub")}
          value={readingDisplay.showTranslation}
          onValueChange={(value) => void readingDisplay.setShowTranslation(value)}
        />
        <ToggleRow
          icon={{ ios: "character.book.closed", android: "spellcheck", web: "spellcheck" }}
          title={t("quranCompanion.settings.showTransliteration")}
          subtitle={t("settingsPanel.readingDisplaySub")}
          value={readingDisplay.showTransliteration}
          onValueChange={(value) => void readingDisplay.setShowTransliteration(value)}
        />
        <ToggleRow
          icon={{ ios: "paintpalette.fill", android: "palette", web: "palette" }}
          title={t("quranCompanion.settings.showTajweed")}
          subtitle={t("quranCompanion.settings.showTajweedSub")}
          value={prefs.showTajweedColors}
          onValueChange={(value) => void update({ showTajweedColors: value })}
        />
      </View>
    </Card>
  );

  // Card 4 — Revision
  const revisionCard = (
    <Card padding="three">
      <SectionHeader
        title={t("quranCompanion.settings.revisionTitle")}
        icon={{ ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" }}
      />
      <SettingBlock
        title={t("quranCompanion.settings.dailyLimit")}
        help={t("quranCompanion.settings.dailyLimitHelp", { count: prefs.dailyRevisionLimit })}
      >
        <ChoiceList
          items={limitOptions}
          value={prefs.dailyRevisionLimit}
          onChange={(limit) => void update({ dailyRevisionLimit: limit })}
        />
      </SettingBlock>
      <View style={styles.rows}>
        <ToggleRow
          icon={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
          title={t("quranCompanion.settings.includeHifz")}
          subtitle={t("quranCompanion.settings.includeHifzSub")}
          value={prefs.includeHifzReview}
          onValueChange={(value) => {
            void update({ includeHifzReview: value }).then(requestReminderReschedule);
          }}
        />
        {notifications.isLocalSupported ? (
          <ToggleRow
            icon={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
            title={t("quranCompanion.settings.reminder")}
            subtitle={
              masterOff
                ? t("quranCompanion.settings.reminderMasterOff")
                : t("quranCompanion.settings.reminderSub")
            }
            value={prefs.revisionReminder}
            onValueChange={(value) => void toggleReminder(value)}
          />
        ) : null}
        {masterOff && prefs.revisionReminder ? (
          <SettingsRow
            icon={{
              ios: "bell.badge.fill",
              android: "notifications_active",
              web: "notifications_active",
            }}
            title={t("quranCompanion.settings.openNotifications")}
            onPress={() => router.push("/settings/notifications")}
          />
        ) : null}
      </View>
    </Card>
  );

  // Phase 6 — pronunciation listener (Quran Lab)
  const pronunciationCard = <PronunciationSettingsCard />;

  // Card 5 — Privacy and sources
  const privacyCard = (
    <Card padding="three">
      <SectionHeader
        title={t("quranCompanion.privacy.title")}
        icon={{ ios: "lock.shield.fill", android: "shield", web: "shield" }}
      />
      <View style={styles.rows}>
        <View style={[styles.privacyNote, { backgroundColor: tokens.status.success.soft }]}>
          <SymbolView
            name={{ ios: "lock.fill", android: "lock", web: "lock" }}
            size={16}
            tintColor={tokens.status.success.color}
          />
          <ThemedText type="small" style={styles.flex}>
            {t("quranCompanion.privacy.onDevice")}
          </ThemedText>
        </View>
        <MicrophoneStatusRow />
        <Button
          label={t("quranCompanion.privacy.deleteHistory")}
          variant="ghost"
          icon={{ ios: "trash", android: "delete", web: "delete" }}
          labelColor={tokens.status.danger.color}
          onPress={() => setPending({ kind: "deleteHistory" })}
        />
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranCompanion.privacy.practiceAid")}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranCompanion.privacy.sources", {
            host:
              Platform.OS === "web" && typeof window !== "undefined"
                ? window.location.host
                : RECITATION_MODEL_HOST,
          })}{" "}
          {t("quranCompanion.privacy.licence")}
        </ThemedText>
        <SettingsRow
          icon={{ ios: "text.badge.checkmark", android: "verified", web: "verified" }}
          title={t("credits.settingsLabel")}
          onPress={() => router.push("/credits")}
        />
      </View>
    </Card>
  );

  // Wide web / tablets: two card columns instead of one long stretched stack.
  const twoColumn = useSettingsTwoColumn();

  return (
    <SettingsDetailScreen
      parent="quran"
      path="/settings/quran-practice"
      title={t("quranCompanion.settings.title")}
      subtitle={t("quranCompanion.settings.rowSubtitle")}
      // Lays out its own card columns on wide windows.
      wide
      {...(params.from === "hub" ? { backTo: "/quran/practice" as Href } : {})}
    >
      {twoColumn ? (
        <SettingsColumns
          start={
            <>
              {listenerCard}
              {screenCard}
              {pronunciationCard}
            </>
          }
          end={
            <>
              {sessionCard}
              {revisionCard}
              {privacyCard}
            </>
          }
        />
      ) : (
        <Stagger>
          {listenerCard}
          {sessionCard}
          {screenCard}
          {revisionCard}
          {pronunciationCard}
          {privacyCard}
        </Stagger>
      )}

      <ConfirmDialog
        visible={pending != null}
        title={
          pending?.kind === "cellular"
            ? t("quranCompanion.listener.cellularTitle")
            : pending?.kind === "deleteHistory"
              ? t("quranCompanion.privacy.deleteHistoryTitle")
              : pending?.kind === "switchEngine"
                ? t("quranCompanion.listener.switchTitle")
                : pending?.kind === "update"
                  ? t("quranCompanion.listener.updateTitle")
                  : t("quranCompanion.listener.deleteTitle")
        }
        message={
          pending?.kind === "cellular"
            ? t("quranCompanion.listener.cellularBody", { size: sizeMb })
            : pending?.kind === "deleteHistory"
              ? t("quranCompanion.privacy.deleteHistoryBody")
              : t("quranCompanion.listener.deleteBody")
        }
        confirmLabel={
          pending?.kind === "cellular"
            ? t("quranCompanion.listener.useMobileData")
            : pending?.kind === "update"
              ? t("quranCompanion.listener.downloadUpdate")
              : t("quranCompanion.listener.confirmRemove")
        }
        destructive={pending?.kind !== "cellular" && pending?.kind !== "update"}
        onConfirm={onConfirm}
        onClose={() => setPending(null)}
      />
    </SettingsDetailScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  rows: { gap: Spacing.two, marginTop: Spacing.two },
  block: { gap: Spacing.two, marginTop: Spacing.three },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  privacyNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/quran-practice");
