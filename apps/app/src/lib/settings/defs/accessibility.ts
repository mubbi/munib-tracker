import type { TasbeehAnnouncementFrequency } from "@munib-tracker/shared/types";
import type { Href } from "expo-router";

import { editor } from "../editors";
import { nativeOnly, notOnTv } from "../platform";
import { settingHref } from "../routes";
import { type AnySettingDef, defineSetting } from "../types";
import { deviceToggle, NO_VALUE, updatePrefs } from "./helpers";

const InfoNote = editor("InfoNote");

const G = "accessibility" as const;
const FEEDBACK = "settingsPanel.section.feedbackMotion";
const READING = "settingsPanel.section.readingAids";

export const ACCESSIBILITY_SETTINGS: AnySettingDef[] = [
  deviceToggle({
    id: "accessibility.haptics",
    group: G,
    section: FEEDBACK,
    titleKey: "settings.haptics",
    subtitleKey: "settings.hapticsSub",
    keywordsKey: "settingsPanel.kw.haptics",
    icon: { ios: "iphone.radiowaves.left.and.right", android: "vibration", web: "vibration" },
    key: "hapticsEnabled",
    fallback: true,
    available: nativeOnly,
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "accessibility.motionInfo",
    group: G,
    section: FEEDBACK,
    titleKey: "settingsPanel.motionInfo",
    subtitleKey: "settingsPanel.motionInfoSub",
    keywordsKey: "settingsPanel.kw.motion",
    scope: "device",
    control: { kind: "custom", Component: InfoNote },
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "accessibility.textSizes",
    group: G,
    section: READING,
    titleKey: "settingsPanel.perScreenSizes",
    subtitleKey: "settingsPanel.textSizesShortcutSub",
    keywordsKey: "settingsPanel.kw.textSize",
    icon: { ios: "textformat.size", android: "format_size", web: "format_size" },
    scope: "account",
    control: { kind: "link", href: settingHref("fonts.perScreen") as Href },
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "accessibility.screenReader",
    group: G,
    section: READING,
    titleKey: "settingsPanel.screenReaderTips",
    subtitleKey: "settingsPanel.screenReaderTipsSub",
    keywordsKey: "settingsPanel.kw.screenReader",
    scope: "device",
    control: { kind: "custom", Component: InfoNote },
  }),
  // NF-3.20: how often the tasbeeh counter speaks the count to a screen reader.
  // While hands-free counting listens it is capped at milestones (the phone's
  // own speech must not be counted).
  defineSetting<TasbeehAnnouncementFrequency>({
    id: "accessibility.tasbeehAnnouncements",
    group: G,
    section: READING,
    titleKey: "tasbeehVoice.announce.title",
    subtitleKey: "tasbeehVoice.announce.hint",
    keywordsKey: "tasbeehVoice.settings.keywords",
    scope: "account",
    control: {
      kind: "choice",
      presentation: "list",
      options: [
        { value: "every", labelKey: "tasbeehVoice.announce.every" },
        { value: "milestones", labelKey: "tasbeehVoice.announce.milestones" },
        { value: "off", labelKey: "tasbeehVoice.announce.off" },
      ],
    },
    read: (s) => s.prefs.tasbeehAnnouncements ?? "milestones",
    write: (tasbeehAnnouncements) => updatePrefs({ tasbeehAnnouncements }),
    defaultValue: "milestones",
    available: notOnTv,
    summary: (v, t) => t(`tasbeehVoice.announce.${v}`),
    shortcuts: ["TasbeehCounter"],
    fields: ["prefs.tasbeehAnnouncements"],
  }),
];
