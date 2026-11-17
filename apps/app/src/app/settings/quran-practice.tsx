import { type Href, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ListenerStatusStrip } from "@/components/quran/listener-status-strip";
import { PracticePills } from "@/components/quran/practice-pills";
import { PronunciationSettingsCard } from "@/components/quran/pronunciation-settings-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { SettingsColumns, useSettingsTwoColumn } from "@/components/settings/settings-layout";
import { SettingsRow, ToggleRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { engineDownloadMb, RECITATION_MODEL_HOST } from "@/constants/recitation-models";
import { Radius, Spacing } from "@/constants/theme";
import { useIsOnline } from "@/hooks/use-is-online";
import { useNotificationPermissions } from "@/hooks/use-notification-permissions";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { createRecitationCapture } from "@/lib/quran-companion/audio/capture";
import type { MicPermission } from "@/lib/quran-companion/audio/types";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { canOpenAppSettings, openAppSettings } from "@/lib/quran-companion/open-app-settings";
import { requestReminderReschedule } from "@/lib/quran-companion/reschedule";
import type {
  DailyRevisionLimit,
  EngineId,
  FeedbackTiming,
  HearBeforeRecite,
  PracticeMode,
  StartFrom,
} from "@/lib/quran-companion/types";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { usePreferences } from "@/stores/preferences-store";
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
import { quranPracticeStore, useEnsurePracticeLoaded } from "@/stores/quran-practice-store";

type Pending =
  | { kind: "delete" }
  | { kind: "cellular" }
  | { kind: "switchEngine"; engine: EngineId }
  | { kind: "update" }
  | { kind: "deleteHistory" }
  | null;

const capture = createRecitationCapture();

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
  const { update } = useCompanionPrefsActions();
  useEnsureListenerLoaded(prefs.engineChoice, ready);
  const listener = useListenerState();
  const userPrefs = usePreferences();
  const notifications = useNotificationPermissions();
  const [pending, setPending] = useState<Pending>(null);
  const [mic, setMic] = useState<MicPermission | null>(null);

  useEffect(() => {
    if (!isPracticeAvailable()) router.replace("/settings");
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      void capture.getPermission().then(setMic);
    }, []),
  );

  const engine = listener.manifest?.engine ?? prefs.engineChoice;
  const micLabel =
    mic === "granted"
      ? t("quranCompanion.privacy.micAllowed")
      : mic === "denied"
        ? t("quranCompanion.privacy.micBlocked")
        : t("quranCompanion.privacy.micNotAsked");
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

  const timingOptions: { id: FeedbackTiming; label: string }[] = [
    { id: "ayah", label: t("quranCompanion.settings.timing.ayah") },
    { id: "live", label: t("quranCompanion.settings.timing.live") },
    { id: "end", label: t("quranCompanion.settings.timing.end") },
  ];
  const hearOptions: { id: HearBeforeRecite; label: string }[] = [
    { id: "off", label: t("quranCompanion.settings.hear.off") },
    { id: "once", label: t("quranCompanion.settings.hear.once") },
    { id: "every-ayah", label: t("quranCompanion.settings.hear.every") },
  ];
  const startOptions: { id: StartFrom; label: string }[] = [
    { id: "lastPractice", label: t("quranCompanion.settings.startFrom.lastPractice") },
    { id: "lastRead", label: t("quranCompanion.settings.startFrom.lastRead") },
    { id: "ask", label: t("quranCompanion.settings.startFrom.ask") },
  ];
  const modeOptions: { id: PracticeMode; label: string }[] = [
    { id: "follow", label: t("quranCompanion.mode.follow") },
    { id: "check", label: t("quranCompanion.mode.check") },
    { id: "hide-words", label: t("quranCompanion.mode.hideWords") },
    { id: "hide-ayahs", label: t("quranCompanion.mode.hideAyahs") },
  ];
  const limitOptions: { id: string; label: string }[] = [5, 10, 20].map((n) => ({
    id: String(n),
    label: String(n),
  }));

  const masterOff = !userPrefs.notificationPrefs.masterEnabled;
  const usable = listener.status === "ready" || listener.status === "update-available";
  const onDeviceMb = listener.manifest
    ? Math.round(listener.manifest.files.reduce((sum, f) => sum + f.bytes, 0) / (1024 * 1024))
    : sizeMb;
  const micTone =
    mic === "granted"
      ? tokens.status.success.color
      : mic === "denied"
        ? tokens.status.danger.color
        : colors.mutedForeground;

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
              <PracticePills
                options={[
                  {
                    id: "tilawa-zipformer" as EngineId,
                    label: t("quranCompanion.listener.recommendedSize", {
                      size: engineDownloadMb("tilawa-zipformer"),
                    }),
                  },
                  {
                    id: "tilawa-fastconformer" as EngineId,
                    label: t("quranCompanion.listener.alternateSize", {
                      size: engineDownloadMb("tilawa-fastconformer"),
                    }),
                  },
                ]}
                value={prefs.engineChoice}
                onChange={chooseEngine}
                accessibilityLabel={t("quranCompanion.listener.advanced")}
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
        <PracticePills
          options={modeOptions}
          value={prefs.defaultMode}
          onChange={(id) => void update({ defaultMode: id })}
          accessibilityLabel={t("quranCompanion.settings.defaultMode")}
        />
      </SettingBlock>
      <SettingBlock
        title={t("quranCompanion.settings.feedbackTiming")}
        help={t(TIMING_HELP_KEY[prefs.feedbackTiming])}
      >
        <PracticePills
          options={timingOptions}
          value={prefs.feedbackTiming}
          onChange={(id) => void update({ feedbackTiming: id })}
          accessibilityLabel={t("quranCompanion.settings.feedbackTiming")}
        />
      </SettingBlock>
      <SettingBlock
        title={t("quranCompanion.settings.hearBeforeRecite")}
        help={t(HEAR_HELP_KEY[prefs.hearBeforeRecite])}
      >
        <PracticePills
          options={hearOptions}
          value={prefs.hearBeforeRecite}
          onChange={(id) => void update({ hearBeforeRecite: id })}
          accessibilityLabel={t("quranCompanion.settings.hearBeforeRecite")}
        />
      </SettingBlock>
      <SettingBlock
        title={t("quranCompanion.settings.startFromTitle")}
        help={t(START_HELP_KEY[prefs.startFrom])}
      >
        <PracticePills
          options={startOptions}
          value={prefs.startFrom}
          onChange={(id) => void update({ startFrom: id })}
          accessibilityLabel={t("quranCompanion.settings.startFromTitle")}
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
          value={prefs.showTranslation}
          onValueChange={(value) => void update({ showTranslation: value })}
        />
        <ToggleRow
          icon={{ ios: "character.book.closed", android: "spellcheck", web: "spellcheck" }}
          title={t("quranCompanion.settings.showTransliteration")}
          value={prefs.showTransliteration}
          onValueChange={(value) => void update({ showTransliteration: value })}
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
        <PracticePills
          options={limitOptions}
          value={String(prefs.dailyRevisionLimit)}
          onChange={(id) => void update({ dailyRevisionLimit: Number(id) as DailyRevisionLimit })}
          accessibilityLabel={t("quranCompanion.settings.dailyLimit")}
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
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={`${t("quranCompanion.privacy.microphone")}: ${micLabel}`}
          onPress={() => {
            // Native: the OS settings page. Web: ask the browser again.
            if (canOpenAppSettings()) void openAppSettings();
            else void capture.requestPermission().then(setMic);
          }}
          style={[styles.detailRow, { backgroundColor: colors.muted }]}
        >
          <SymbolView
            name={{ ios: "mic.fill", android: "mic", web: "mic" }}
            size={18}
            tintColor={colors.foreground}
          />
          <ThemedText type="small" style={styles.flex}>
            {t("quranCompanion.privacy.microphone")}
          </ThemedText>
          <View style={[styles.statusDot, { backgroundColor: micTone }]} />
          <ThemedText type="caption" style={{ color: micTone }}>
            {micLabel}
          </ThemedText>
        </PressableScale>
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
    <ScreenLayout
      eyebrow={t("settings.title")}
      title={t("quranCompanion.settings.title")}
      subtitle={t("quranCompanion.settings.rowSubtitle")}
      onBack={() =>
        goBackOrReplace(router, params.from === "hub" ? ("/quran/practice" as Href) : "/settings")
      }
    >
      <Seo path="/settings/quran-practice" />
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
    </ScreenLayout>
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
  statusDot: { width: 8, height: 8, borderRadius: 4 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/quran-practice");
