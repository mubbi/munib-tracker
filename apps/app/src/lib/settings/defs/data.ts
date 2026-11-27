import { editor } from "../editors";
import { notOnTv } from "../platform";
import { type AnySettingDef, defineSetting } from "../types";
import { deviceToggle, NO_VALUE } from "./helpers";

const SyncStatusCard = editor("SyncStatusCard");
const ResetSettingsRow = editor("ResetSettingsRow");
const ResetAppDataRow = editor("ResetAppDataRow");

const G = "data" as const;
const SYNC = "settingsPanel.section.sync";
const OFFLINE = "settings.offlineData";
const BACKUP = "settingsPanel.section.backup";
const RESET = "settingsPanel.section.reset";

export const DATA_SETTINGS: AnySettingDef[] = [
  defineSetting<null>({
    ...NO_VALUE,
    id: "data.sync",
    group: G,
    section: SYNC,
    titleKey: "sync.title",
    keywordsKey: "settingsPanel.kw.sync",
    scope: "account",
    control: { kind: "custom", Component: SyncStatusCard },
  }),
  // The three "save locally" toggles moved in from the hub; device preferences (B4).
  deviceToggle({
    id: "data.offline.cacheAudio",
    group: G,
    section: OFFLINE,
    titleKey: "settings.cacheAudioLocally",
    subtitleKey: "settings.cacheAudioLocallySub",
    keywordsKey: "settingsPanel.kw.offline",
    icon: { ios: "arrow.down.circle.fill", android: "download", web: "download" },
    key: "cacheAudioLocally",
    fallback: true,
  }),
  deviceToggle({
    id: "data.offline.cacheQuran",
    group: G,
    section: OFFLINE,
    titleKey: "settings.cacheQuranEditionsLocally",
    subtitleKey: "settings.cacheQuranEditionsLocallySub",
    keywordsKey: "settingsPanel.kw.offline",
    icon: { ios: "text.book.closed.fill", android: "menu_book", web: "menu_book" },
    key: "cacheQuranEditionsLocally",
    fallback: true,
  }),
  deviceToggle({
    id: "data.offline.cacheHadith",
    group: G,
    section: OFFLINE,
    titleKey: "settings.cacheHadithLocally",
    subtitleKey: "settings.cacheHadithLocallySub",
    keywordsKey: "settingsPanel.kw.offline",
    icon: { ios: "books.vertical.fill", android: "library_books", web: "library_books" },
    key: "cacheHadithLocally",
    fallback: true,
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "data.offline.manage",
    group: G,
    section: OFFLINE,
    titleKey: "settings.offlineData",
    subtitleKey: "settings.offlineDataSub",
    keywordsKey: "settingsPanel.kw.offline",
    icon: { ios: "internaldrive.fill", android: "storage", web: "storage" },
    scope: "device",
    control: { kind: "link", href: "/settings/offline-data" },
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "data.listenerModels",
    group: G,
    section: OFFLINE,
    titleKey: "quranCompanion.listener.title",
    subtitleKey: "settingsPanel.listenerModelsSub",
    icon: { ios: "waveform.and.mic", android: "record_voice_over", web: "record_voice_over" },
    scope: "device",
    control: { kind: "link", href: "/settings/quran-practice" },
    available: notOnTv,
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "data.backup",
    group: G,
    section: BACKUP,
    titleKey: "settings.backup",
    subtitleKey: "settings.backupSub",
    keywordsKey: "settingsPanel.kw.backup",
    icon: { ios: "externaldrive.fill.badge.timemachine", android: "backup", web: "backup" },
    scope: "account",
    control: { kind: "link", href: "/settings/backup" },
    available: notOnTv,
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "data.import",
    group: G,
    section: BACKUP,
    titleKey: "settings.import",
    subtitleKey: "settings.importSub",
    icon: { ios: "square.and.arrow.down", android: "file_upload", web: "file_upload" },
    scope: "account",
    control: { kind: "link", href: "/settings/import" },
    available: notOnTv,
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "data.resetSettings",
    group: G,
    section: RESET,
    titleKey: "settingsPanel.resetSettings",
    subtitleKey: "settingsPanel.resetSettingsSub",
    keywordsKey: "settingsPanel.kw.reset",
    scope: "account",
    control: { kind: "custom", Component: ResetSettingsRow },
  }),
  // D13: lives only here now (Profile keeps Delete account).
  defineSetting<null>({
    ...NO_VALUE,
    id: "data.resetAppData",
    group: G,
    section: RESET,
    titleKey: "profile.resetData",
    subtitleKey: "settingsPanel.resetAppDataSub",
    keywordsKey: "settingsPanel.kw.reset",
    scope: "account",
    control: { kind: "custom", Component: ResetAppDataRow },
  }),
];
