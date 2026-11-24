import type { SymbolViewProps } from "expo-symbols";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { AsrOfferCard, useMadhhabChooser } from "@/components/fiqh/madhhab-chooser";
import { MadhhabPicker } from "@/components/fiqh/madhhab-picker";
import { LanguagePickerSheet, LanguageSelectRow } from "@/components/language-picker-sheet";
import { SettingRow } from "@/components/settings/setting-row";
import { SettingsRow } from "@/components/settings/settings-rows";
import { SetupChecklistCard } from "@/components/settings/setup-checklist-card";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useMadhhab } from "@/hooks/use-madhhab";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { canEnableLocalReminders } from "@/lib/notifications/permissions";
import { isWeb } from "@/lib/notifications/platform";
import { beginWebNotificationPermissionRequest } from "@/lib/notifications/web-environment";
import {
  chooseSetupLanguage,
  type SetupDestination,
  type SetupStepId,
  setupStepForItem,
} from "@/lib/onboarding/setup-flow";
import { isTV } from "@/lib/platform/is-tv";
import { enableNotifications } from "@/lib/settings/actions";
import { getPlatformCtx } from "@/lib/settings/platform";
import { getSetting, isSettingAvailable } from "@/lib/settings/registry";
import { runSideEffects } from "@/lib/settings/side-effects";
import type { SettingId } from "@/lib/settings/types";
import { useSettingsSelector } from "@/lib/settings/use-setting";
import { useAuth } from "@/providers/auth-provider";
import { useLocation, useLocationActions, useLocationStatus } from "@/stores/location-store";

import { type SetupChrome, SetupShell } from "./setup-shell";

export interface SetupStepProps {
  chrome: SetupChrome;
  /** Advance to the next step (the wizard records progress and completion). */
  onNext: () => void;
}

const ICONS = {
  language: { ios: "globe", android: "language", web: "language" },
  location: { ios: "location.fill", android: "location_on", web: "location_on" },
  madhhab: { ios: "building.columns.fill", android: "account_balance", web: "account_balance" },
  reminders: { ios: "bell.fill", android: "notifications", web: "notifications" },
  personalise: { ios: "paintpalette.fill", android: "palette", web: "palette" },
  done: { ios: "checkmark.seal.fill", android: "verified", web: "verified" },
} as const satisfies Record<SetupStepId, SymbolViewProps["name"]>;

const CHECK_ICON = {
  ios: "checkmark.circle.fill",
  android: "check_circle",
  web: "check_circle",
} as const;

/**
 * Apple 5.1.1(iv): a screen that explains a permission must lead straight to
 * the system dialog — no "Later" that skips it on iPhone/iPad. Android, web and
 * TV may offer an alternative.
 */
const canSkipPermissionPrompt = () => isTV() || Platform.OS !== "ios";

/** A registered setting rendered through its own control (single write path). */
function RegisteredSetting({ id }: { id: SettingId }) {
  const ctx = useMemo(getPlatformCtx, []);
  const def = getSetting(id);
  if (!def || !isSettingAvailable(def, ctx)) return null;
  return <SettingRow def={def} />;
}

function Highlights({ lines }: { lines: string[] }) {
  const { colors } = useThemeTokens();
  return (
    <View style={styles.highlights}>
      {lines.map((line) => (
        <View key={line} style={styles.highlightRow}>
          <SymbolView name={CHECK_ICON} size={18} tintColor={colors.accent} />
          <ThemedText type="small" style={styles.highlightText}>
            {line}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

/** Step 1 — app language (and the meaning-translation language, which follows it by default). */
export function LanguageStep({ chrome, onNext }: SetupStepProps) {
  const { t } = useTranslation();
  const locale = useSettingsSelector((s) => s.prefs.locale);
  const [open, setOpen] = useState(false);
  const label = t("language.appLanguage");
  return (
    <SetupShell
      chrome={chrome}
      icon={ICONS.language}
      title={t("setupFlow.language.title")}
      body={t("setupFlow.language.body")}
      primary={{ label: t("common.next"), onPress: onNext }}
    >
      <Card padding="three" style={styles.card}>
        <ThemedText type="small">{label}</ThemedText>
        <LanguageSelectRow
          locale={locale}
          accessibilityLabel={label}
          onPress={() => setOpen(true)}
        />
        <RegisteredSetting id="language.translation" />
      </Card>
      <LanguagePickerSheet
        visible={open}
        value={locale}
        onSelect={(next) => void chooseSetupLanguage(next)}
        onClose={() => setOpen(false)}
      />
    </SetupShell>
  );
}

/**
 * Step 2 — location and how Salah times are calculated. A device that never
 * had a location first sees why it's needed, and Continue opens the system
 * dialog (just in time). Afterwards — or straight away on TV / "Run setup
 * again" — the place, method and Asr calculation are shown to confirm or change.
 */
export function LocationStep({ chrome, onNext }: SetupStepProps) {
  const { t } = useTranslation();
  const tv = isTV();
  const location = useLocation();
  const status = useLocationStatus();
  const { requestDeviceLocation } = useLocationActions();
  const [asked, setAsked] = useState(false);
  const [busy, setBusy] = useState(false);
  const ask = !tv && !asked && location.source === "default";

  const onAllow = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await requestDeviceLocation();
      await runSideEffects(["refresh-prayer-times"]);
    } finally {
      setBusy(false);
      setAsked(true);
    }
  };

  if (ask) {
    return (
      <SetupShell
        chrome={chrome}
        icon={ICONS.location}
        title={t("setupFlow.location.title")}
        body={t("setupFlow.location.body")}
        primary={{
          label: busy ? t("location.locating") : t("onboarding.locationAllow"),
          icon: ICONS.location,
          disabled: busy,
          onPress: () => void onAllow(),
        }}
        secondary={
          canSkipPermissionPrompt()
            ? {
                label: t("setupFlow.location.chooseCity"),
                disabled: busy,
                onPress: () => setAsked(true),
              }
            : undefined
        }
      >
        <Highlights
          lines={[t("onboarding.locationHighlight1"), t("onboarding.locationHighlight2")]}
        />
        <Card variant="muted" padding="three" style={styles.card}>
          <ThemedText type="smallBold">{t("onboarding.locationPrivacyTitle")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("setupFlow.location.privacy")}
          </ThemedText>
        </Card>
      </SetupShell>
    );
  }

  return (
    <SetupShell
      chrome={chrome}
      icon={ICONS.location}
      title={t("settingsPanel.group.prayerTimes")}
      body={t("setupFlow.location.confirmBody")}
      primary={{ label: t("common.next"), onPress: onNext }}
      primaryFocus={false}
    >
      <Card padding="three" style={styles.card}>
        {status === "denied" ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("location.permissionDenied")}
          </ThemedText>
        ) : null}
        <RegisteredSetting id="prayer-times.location" />
        {location.source === "default" ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("setupFlow.location.defaultHint")}
          </ThemedText>
        ) : null}
      </Card>
      <Card padding="three" style={styles.card}>
        <SectionHeader title={t("location.calculationTitle")} />
        <RegisteredSetting id="prayer-times.method" />
        <RegisteredSetting id="prayer-times.methodSuggestion" />
        <RegisteredSetting id="prayer-times.asr" />
      </Card>
    </SetupShell>
  );
}

/**
 * Step 3 — "My madhhab" (NF-3.0a §4.1.1 item 1), pre-filled on "Run setup
 * again". Picking saves at once and may offer the matching Asr calculation
 * (never applied automatically); "Decide later" leaves it unset, so the
 * checklist and the one-time home card ask again.
 */
export function MadhhabStep({ chrome, onNext, quiet }: SetupStepProps & { quiet: boolean }) {
  const { t } = useTranslation();
  const { madhhab } = useMadhhab();
  const location = useLocation();
  const chooser = useMadhhabChooser({ quiet });
  const unset = madhhab === undefined;
  return (
    <SetupShell
      chrome={chrome}
      icon={ICONS.madhhab}
      title={t("fiqhRetrofit.onboarding.title")}
      body={t("fiqhRetrofit.onboarding.body")}
      primary={{ label: t("common.next"), disabled: unset, onPress: onNext }}
      secondary={unset ? { label: t("fiqhRetrofit.onboarding.later"), onPress: onNext } : undefined}
      primaryFocus={false}
    >
      <MadhhabPicker value={madhhab} onChange={(choice) => void chooser.choose(choice)} />
      {chooser.offer ? (
        <AsrOfferCard
          offer={chooser.offer}
          currentAsr={location.madhab}
          onAccept={() => void chooser.acceptOffer()}
          onDecline={chooser.declineOffer}
        />
      ) : null}
    </SetupShell>
  );
}

/**
 * Step 4 — reminders (not on TV). The explanation comes right before the
 * system dialog; once on, the most-used reminders can be tuned in place.
 */
export function RemindersStep({ chrome, onNext }: SetupStepProps) {
  const { t } = useTranslation();
  const { session } = useAuth();
  const master = useSettingsSelector((s) => s.prefs.notificationPrefs.masterEnabled);
  const [asked, setAsked] = useState(false);
  const [busy, setBusy] = useState(false);

  const onAllow = async () => {
    if (busy) return;
    // Web: the permission prompt must start synchronously inside the tap.
    const webPermissionRequest = isWeb ? beginWebNotificationPermissionRequest() : null;
    setBusy(true);
    try {
      if (isWeb || canEnableLocalReminders()) {
        await enableNotifications({ webPermissionRequest, accessToken: session?.accessToken });
      }
    } finally {
      setBusy(false);
      setAsked(true);
    }
  };

  if (master) {
    return (
      <SetupShell
        chrome={chrome}
        icon={ICONS.reminders}
        title={t("setupFlow.reminders.onTitle")}
        body={t("setupFlow.reminders.onBody")}
        primary={{ label: t("common.next"), onPress: onNext }}
      >
        <Card padding="three" style={styles.card}>
          <RegisteredSetting id="notifications.salah.playAdhan" />
          <RegisteredSetting id="notifications.zikr.morning" />
          <RegisteredSetting id="notifications.zikr.evening" />
        </Card>
      </SetupShell>
    );
  }

  if (asked) {
    return (
      <SetupShell
        chrome={chrome}
        icon={ICONS.reminders}
        title={t("setupFlow.reminders.offTitle")}
        body={t("setupFlow.reminders.offBody")}
        primary={{ label: t("common.next"), onPress: onNext }}
      />
    );
  }

  return (
    <SetupShell
      chrome={chrome}
      icon={ICONS.reminders}
      title={t("setupFlow.reminders.title")}
      body={t("setupFlow.reminders.body")}
      primary={{
        label: busy ? t("onboarding.locationLocating") : t("onboarding.locationAllow"),
        disabled: busy,
        onPress: () => void onAllow(),
      }}
      secondary={
        canSkipPermissionPrompt()
          ? { label: t("onboarding.locationSkip"), disabled: busy, onPress: onNext }
          : undefined
      }
    >
      <Highlights
        lines={[t("onboarding.locationHighlight3"), t("onboarding.locationHighlight4")]}
      />
    </SetupShell>
  );
}

/** Step 5 — optional extras (theme, Qur'an translation, home cards, tasbeeh design). */
export function PersonaliseStep({ chrome, onNext }: SetupStepProps) {
  const { t } = useTranslation();
  return (
    <SetupShell
      chrome={chrome}
      icon={ICONS.personalise}
      title={t("setupFlow.personalise.title")}
      body={t("setupFlow.personalise.body")}
      primary={{ label: t("common.next"), onPress: onNext }}
    >
      <Card padding="three" style={styles.card}>
        <RegisteredSetting id="appearance.theme" />
        <RegisteredSetting id="quran.reader.translation" />
        <RegisteredSetting id="appearance.homeCards" />
      </Card>
      <Card padding="three" style={styles.card}>
        <SectionHeader title={t("tasbeehDesigns.settingsTitle")} />
        <RegisteredSetting id="content.tasbeeh.appearance" />
      </Card>
    </SetupShell>
  );
}

/** Summary value of a registered setting (the same text Settings shows). */
function useSettingSummary(id: SettingId): string {
  const { t } = useTranslation();
  return useSettingsSelector((s) => {
    const def = getSetting(id);
    return def?.summary ? def.summary(def.read(s), t) : "";
  });
}

/**
 * Closing screen: what is still unset (the shared "Finish setting up"
 * checklist, each item jumping back to its step) and a recap of the choices,
 * each tappable to change it.
 */
export function DoneStep({
  chrome,
  onJump,
  onFinish,
  rerun,
  destination,
}: {
  chrome: SetupChrome;
  onJump: (step: SetupStepId) => void;
  onFinish: () => void;
  rerun: boolean;
  destination: SetupDestination;
}) {
  const { t } = useTranslation();
  const tv = isTV();
  const language = useSettingSummary("language.app");
  const place = useSettingSummary("prayer-times.location");
  const method = useSettingSummary("prayer-times.method");
  const asr = useSettingSummary("prayer-times.asr");
  const madhhab = useSettingSummary("fiqh.madhhab");
  const reminders = useSettingSummary("notifications.master");
  const finishLabel = rerun
    ? t("common.done")
    : destination === "/login"
      ? t("onboarding.signInToSync")
      : t("onboarding.begin");

  return (
    <SetupShell
      chrome={chrome}
      icon={ICONS.done}
      title={t("setupFlow.done.title")}
      body={t("setupFlow.done.body")}
      primary={{ label: finishLabel, onPress: onFinish }}
    >
      <SetupChecklistCard
        onOpen={(item) => onJump(setupStepForItem(item.id))}
        dismissible={false}
        hintKey="settingsGaps.onboarding.setupHint"
      />
      <Card padding="three" style={styles.card}>
        <SectionHeader title={t("setupFlow.done.recap")} />
        <SettingsRow
          title={t("language.appLanguage")}
          value={language}
          onPress={() => onJump("language")}
        />
        <SettingsRow
          title={t("location.currentTitle")}
          value={place}
          onPress={() => onJump("location")}
        />
        <SettingsRow
          title={t("location.method")}
          value={[method, asr].filter(Boolean).join(" · ")}
          onPress={() => onJump("location")}
        />
        <SettingsRow
          title={t("fiqh.picker.title")}
          value={madhhab}
          onPress={() => onJump("madhhab")}
        />
        {tv ? null : (
          <SettingsRow
            title={t("settingsPanel.group.notifications")}
            value={reminders}
            onPress={() => onJump("reminders")}
          />
        )}
      </Card>
    </SetupShell>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  highlights: { gap: Spacing.two },
  highlightRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.two },
  highlightText: { flex: 1 },
});
