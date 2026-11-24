import type { FocusLockPrefs } from "@munib-tracker/shared/types";
import type { Href } from "expo-router";

import { DEFAULT_FOCUS_LOCK_PREFS, resolveFocusLockPrefs } from "@/lib/focus-lock/prefs";

import { editor } from "../editors";
import { nativeOnly, notOnTv, webOnly } from "../platform";
import { settingHref } from "../routes";
import { type AnySettingDef, defineSetting } from "../types";
import { NO_VALUE, updatePrefs } from "./helpers";

const InfoNote = editor("InfoNote");
const VoiceShortcutsRow = editor("VoiceShortcutsRow");
const DownloadAppsCard = editor("DownloadAppsCard");

const G = "devices" as const;
const ASSISTANTS = "settingsPanel.section.assistants";
const SURFACES = "settingsPanel.section.surfaces";
const TV = "settingsPanel.section.tv";
const WEB = "settingsPanel.section.getApp";
const FOCUS = "settingsPanel.section.focusLock";

export const DEVICE_SETTINGS: AnySettingDef[] = [
  defineSetting<null>({
    ...NO_VALUE,
    id: "devices.voiceShortcuts",
    group: G,
    section: ASSISTANTS,
    titleKey: "externalCommands.titleIos",
    keywordsKey: "settingsPanel.kw.assistant",
    scope: "device",
    // Title/subtitle differ per OS (Siri vs Google Assistant) → custom row.
    control: { kind: "custom", Component: VoiceShortcutsRow },
    available: nativeOnly,
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "devices.liveActivity",
    group: G,
    section: SURFACES,
    titleKey: "notif.liveActivity",
    subtitleKey: "settingsPanel.liveActivitySub",
    keywordsKey: "settingsPanel.kw.liveActivity",
    icon: { ios: "platter.filled.top.iphone", android: "widgets", web: "widgets" },
    scope: "device",
    control: { kind: "link", href: settingHref("notifications.salah.liveActivity") as Href },
    available: (ctx) => ctx.native && (ctx.os === "android" || ctx.liveActivitySupported),
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "devices.widgets",
    group: G,
    section: SURFACES,
    titleKey: "settingsPanel.widgetsInfo",
    subtitleKey: "settingsPanel.widgetsInfoSub",
    keywordsKey: "settingsPanel.kw.widgets",
    scope: "device",
    control: { kind: "custom", Component: InfoNote },
    available: nativeOnly,
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "devices.tvPair",
    group: G,
    section: TV,
    titleKey: "settingsPanel.tvPair",
    subtitleKey: "settingsPanel.tvPairSub",
    keywordsKey: "settingsPanel.kw.tv",
    icon: { ios: "tv", android: "tv", web: "tv" },
    scope: "account",
    control: { kind: "link", href: "/tv-pair" },
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "devices.getApp",
    group: G,
    section: WEB,
    titleKey: "settings.downloadNativeApps",
    subtitleKey: "settings.downloadNativeAppsDesc",
    keywordsKey: "settingsPanel.kw.getApp",
    scope: "device",
    control: { kind: "custom", Component: DownloadAppsCard },
    available: webOnly,
  }),
  /**
   * NF-3.13 Salah focus lock (D4/D17). The whole synced `FocusLockPrefs` object
   * (validated by `resolveFocusLockPrefs`) is edited on `/focus-lock` and its
   * setup flow through this def; the picked apps stay on the device natively.
   * Its native "Tap to confirm" alert lives under Reminders (notifications.ts).
   */
  defineSetting<FocusLockPrefs>({
    id: "devices.focusLock",
    group: G,
    section: FOCUS,
    titleKey: "focusLock.title",
    subtitleKey: "focusLock.subtitle",
    keywordsKey: "focusLock.searchKeywords",
    icon: { ios: "moon.circle.fill", android: "do_not_disturb_on", web: "do_not_disturb_on" },
    scope: "account",
    control: { kind: "link", href: "/focus-lock" as Href },
    read: (s) => resolveFocusLockPrefs(s.prefs.focusLock),
    write: (v) => updatePrefs({ focusLock: resolveFocusLockPrefs(v) }),
    defaultValue: DEFAULT_FOCUS_LOCK_PREFS,
    summary: (v, t) => t(v.enabled ? "common.on" : "common.off"),
    available: notOnTv,
    shortcuts: ["/focus-lock", "/focus-lock/setup"],
    fields: ["prefs.focusLock"],
  }),
];
