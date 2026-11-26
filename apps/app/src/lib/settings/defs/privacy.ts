import type { Href } from "expo-router";

import { clearDeviceHistory } from "../actions";
import { editor } from "../editors";
import { nativeOnly, notOnTv } from "../platform";
import { settingHref } from "../routes";
import { type AnySettingDef, defineSetting } from "../types";
import { NO_VALUE } from "./helpers";

const AppLockRow = editor("AppLockRow");
const BiometricUnlockRow = editor("BiometricUnlockRow");
const VaultLockJournalsRow = editor("VaultLockJournalsRow");
const VaultSyncRow = editor("VaultSyncRow");
const VaultCredentialsRows = editor("VaultCredentialsRows");
const MicrophoneStatusRow = editor("MicrophoneStatusRow");

const G = "privacy" as const;
const LOCK = "settingsPanel.section.appLock";
const HISTORY = "settingsPanel.section.history";
const JOURNALS = "vault.settings.sectionTitle";
const REPORTS = "settingsPanel.section.reports";
const RECITATION = "settingsWiring.section.recitation";

export const PRIVACY_SETTINGS: AnySettingDef[] = [
  defineSetting<null>({
    ...NO_VALUE,
    id: "privacy.appLock",
    group: G,
    section: LOCK,
    titleKey: "settings.appLock",
    subtitleKey: "settings.appLockSub",
    keywordsKey: "settingsPanel.kw.appLock",
    scope: "device",
    // PIN, change PIN and lock timeout live on /settings/app-lock; the custom
    // row reads the provider's PIN state for its value.
    control: { kind: "custom", Component: AppLockRow },
    available: nativeOnly,
  }),
  // Face ID / fingerprint unlock — was automatic, now a device toggle (default on).
  // Stored with the PIN (SecureStore), so the custom row reads the provider.
  defineSetting<null>({
    ...NO_VALUE,
    id: "privacy.biometricUnlock",
    group: G,
    section: LOCK,
    titleKey: "settingsStep4.biometric.title",
    subtitleKey: "settingsStep4.biometric.subtitle",
    keywordsKey: "settingsStep4.kw.biometric",
    scope: "device",
    control: { kind: "custom", Component: BiometricUnlockRow },
    available: nativeOnly,
  }),
  // §4.2 Private journals: lock (device, needs the app PIN), encrypted sync
  // (opt-in; hidden on TV and for guests), passphrase and recovery code.
  defineSetting<null>({
    ...NO_VALUE,
    id: "privacy.vault.lockJournals",
    group: G,
    section: JOURNALS,
    titleKey: "vault.settings.lockJournals",
    subtitleKey: "vault.settings.lockJournalsHint",
    keywordsKey: "settingsStep4.kw.vault",
    scope: "device",
    control: { kind: "custom", Component: VaultLockJournalsRow },
    available: notOnTv,
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "privacy.vault.sync",
    group: G,
    section: JOURNALS,
    titleKey: "vault.settings.sync",
    subtitleKey: "vault.sync.howItWorks",
    keywordsKey: "settingsStep4.kw.vault",
    scope: "account",
    control: { kind: "custom", Component: VaultSyncRow },
    available: notOnTv,
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "privacy.vault.credentials",
    group: G,
    section: JOURNALS,
    titleKey: "vault.settings.changePassphrase",
    subtitleKey: "vault.settings.newRecoveryCodeHint",
    keywordsKey: "settingsStep4.kw.vault",
    scope: "account",
    control: { kind: "custom", Component: VaultCredentialsRows },
    available: notOnTv,
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "privacy.clearHistory",
    group: G,
    section: HISTORY,
    titleKey: "settingsPanel.clearHistory",
    subtitleKey: "settingsPanel.clearHistorySub",
    keywordsKey: "settingsPanel.kw.history",
    icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
    scope: "device",
    control: {
      kind: "action",
      run: clearDeviceHistory,
      destructive: true,
      confirmKey: "settingsPanel.clearHistoryConfirm",
      actionLabelKey: "settingsPanel.clearAction",
      doneKey: "settings.done.history",
    },
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "privacy.myReports",
    group: G,
    section: REPORTS,
    titleKey: "contentReport.myReportsTitle",
    subtitleKey: "contentReport.myReportsNavSub",
    icon: { ios: "flag.fill", android: "flag", web: "flag" },
    scope: "account",
    control: { kind: "link", href: "/settings/my-reports" },
  }),
  // §4.5.3: microphone status + Quran Lab recitation sharing (the switch itself
  // lives on the Qur'an › Practice pronunciation card).
  defineSetting<null>({
    ...NO_VALUE,
    id: "privacy.microphone",
    group: G,
    section: RECITATION,
    titleKey: "quranCompanion.privacy.microphone",
    scope: "device",
    control: { kind: "custom", Component: MicrophoneStatusRow },
    available: notOnTv,
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "privacy.quranLabSharing",
    group: G,
    section: RECITATION,
    titleKey: "quranCompanion.pronunciation.sharingSwitch",
    subtitleKey: "quranCompanion.pronunciation.sharingSub",
    keywordsKey: "quranPronunciation.settings.keywords",
    icon: { ios: "waveform.badge.mic", android: "record_voice_over", web: "record_voice_over" },
    scope: "device",
    control: { kind: "link", href: settingHref("quran.practice.pronunciation") as Href },
    available: notOnTv,
  }),
];
