/**
 * Custom setting editors (`control.kind === "custom"`). Loaded on demand through
 * `lib/settings/editors.ts`, never imported statically by the registry.
 */

export { AsrMismatchHint } from "@/components/fiqh/asr-mismatch-hint";
export { AboutPanel } from "./about-panel";
export { AccentEditor } from "./accent-editor";
export { AdhanPreviewRow, AdhanStyleControl } from "./adhan-controls";
export { DeviceVoiceControl } from "./device-voice-control";
export { DownloadAppsCard } from "./download-apps-card";
export { FastingIntentTimeEditor, FastingKindsEditor } from "./fasting-editors";
export { FiqhAdvancedEditor, FiqhWhereAppliesEditor, MadhhabEditor } from "./fiqh-editors";
export { ArabicTypefacePicker, FontPreview, ReadingSizeOverrides } from "./font-editors";
export { InfoNote } from "./info-note";
export { LanguageControl } from "./language-control";
export { AppLockRow, BiometricUnlockRow, VoiceShortcutsRow } from "./link-rows";
export { LocationPicker } from "./location-picker";
export { NotificationsMasterControl } from "./notifications-master";
export { MicrophoneStatusRow, PronunciationSettingsEditor } from "./practice-editors";
export { QuranEditionControl } from "./quran-edition-control";
export { DefaultCurrencyEditor, HijriDateEditor, LibraryOrderEditor } from "./region-editors";
export { ResetAppDataRow, ResetSettingsRow } from "./reset-rows";
export { SyncNowButton, SyncStatusCard, useManualSync } from "./sync-status-card";
export { TasbeehAppearanceSettingsEditor } from "./tasbeeh-editor";
export { TasbeehVoiceCalibrationEditor } from "./tasbeeh-voice-calibration-editor";
export { UpcomingRemindersPreview } from "./upcoming-reminders";
export { VaultCredentialsRows, VaultLockJournalsRow, VaultSyncRow } from "./vault-editors";
