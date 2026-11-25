import type { TFunction } from "i18next";

import type { CategoryHueKey } from "@/constants/theme";
import type { AppIcon } from "@/lib/names-of-allah-ui";

import { getSetting, isSettingAvailable, settingsForGroup } from "./registry";
import type { SettingsGroupId, SettingsSubgroupId } from "./routes";
import type { PlatformCtx, SettingsSnapshot } from "./types";

export type SettingsClusterId = "worship" | "reading" | "personalise" | "privacy" | "help";

export interface SettingsClusterMeta {
  id: SettingsClusterId;
  titleKey: string;
  hue: CategoryHueKey;
  icon: AppIcon;
}

/** The five hub clusters (§4.5.3), in display order. */
export const SETTINGS_CLUSTERS: readonly SettingsClusterMeta[] = [
  {
    id: "worship",
    titleKey: "settingsPanel.cluster.worship",
    hue: "dawn",
    icon: { ios: "moon.stars.fill", android: "mosque", web: "mosque" },
  },
  {
    id: "reading",
    titleKey: "settingsPanel.cluster.reading",
    hue: "sky",
    icon: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  },
  {
    id: "personalise",
    titleKey: "settingsPanel.cluster.personalise",
    hue: "accent",
    icon: { ios: "paintpalette.fill", android: "palette", web: "palette" },
  },
  {
    id: "privacy",
    titleKey: "settingsPanel.cluster.privacy",
    hue: "rose",
    icon: { ios: "lock.shield.fill", android: "shield", web: "shield" },
  },
  {
    id: "help",
    titleKey: "settingsPanel.cluster.help",
    hue: "accent",
    icon: { ios: "questionmark.circle.fill", android: "help", web: "help" },
  },
];

/** A sub-screen of a long group (`/settings/<group>/<id>`), holding whole sections. */
export interface SettingsSubgroupMeta {
  id: SettingsSubgroupId;
  titleKey: string;
  subtitleKey: string;
  icon: AppIcon;
  /** Section keys (`SettingDef.section`) shown on this sub-screen, in order. */
  sections: readonly string[];
}

export interface SettingsGroupMeta {
  id: SettingsGroupId;
  cluster: SettingsClusterId;
  titleKey: string;
  subtitleKey: string;
  icon: AppIcon;
  /** Shown on TV (only groups with something TV-relevant, §4.5.3). */
  tv: boolean;
  /** Setting ids whose summaries make up the group row's one-line value. */
  summaryIds: readonly string[];
  /**
   * Long, rarely-changed sections (per-prayer steppers and toggles) that start
   * collapsed behind a header showing how many are customised. A deep link /
   * search result into one opens it.
   */
  collapsedSections?: readonly string[];
  /**
   * Sub-screens for a group too long for one page. Sections not listed in any
   * sub-screen (the master switch, the upcoming preview) stay on the group
   * screen, which lists the sub-screens as rows.
   */
  subgroups?: readonly SettingsSubgroupMeta[];
}

/** Group order = how often each task is done (§4.5.3). */
export const SETTINGS_GROUPS: readonly SettingsGroupMeta[] = [
  {
    id: "prayer-times",
    cluster: "worship",
    titleKey: "settingsPanel.group.prayerTimes",
    subtitleKey: "settingsPanel.group.prayerTimesSub",
    icon: { ios: "location.fill", android: "location_on", web: "location_on" },
    tv: true,
    summaryIds: ["prayer-times.method", "prayer-times.asr", "prayer-times.location"],
    collapsedSections: ["prayerTuning.offsetTitle"],
  },
  {
    id: "fiqh",
    cluster: "worship",
    titleKey: "settingsPanel.group.fiqh",
    subtitleKey: "settingsPanel.group.fiqhSub",
    icon: { ios: "building.columns.fill", android: "account_balance", web: "account_balance" },
    tv: false,
    summaryIds: ["fiqh.madhhab", "fiqh.asrMethod"],
    collapsedSections: ["settingsStep4.fiqh.advanced", "settingsStep4.fiqh.whereApplies"],
  },
  {
    id: "notifications",
    cluster: "worship",
    titleKey: "settingsPanel.group.notifications",
    subtitleKey: "settingsPanel.group.notificationsSub",
    icon: { ios: "bell.fill", android: "notifications", web: "notifications" },
    tv: false,
    summaryIds: ["notifications.master", "notifications.salah.adhanStyle"],
    collapsedSections: [
      "notif.prayerAlertsObligatory",
      "notif.prayerAlertsSunnah",
      "reminderOffsets.title",
    ],
    subgroups: [
      {
        id: "salah",
        titleKey: "settingsSubgroups.salah.title",
        subtitleKey: "settingsSubgroups.salah.subtitle",
        icon: { ios: "moon.stars.fill", android: "mosque", web: "mosque" },
        sections: [
          "settingsPanel.section.salahAdhan",
          "notif.prayerAlertsObligatory",
          "notif.prayerAlertsSunnah",
          "reminderOffsets.title",
          "settingsIntegration.section.sunnah",
          "settingsPanel.section.qaza",
        ],
      },
      {
        id: "zikr",
        titleKey: "settingsSubgroups.zikr.title",
        subtitleKey: "settingsSubgroups.zikr.subtitle",
        icon: { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
        sections: ["notif.groupZikr", "settingsPanel.section.quran"],
      },
      {
        id: "fasting",
        titleKey: "settingsSubgroups.fasting.title",
        subtitleKey: "settingsSubgroups.fasting.subtitle",
        icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
        sections: [
          "settingsIntegration.section.remindersFasting",
          "settingsIntegration.section.seasonal",
        ],
      },
      {
        id: "personal",
        titleKey: "settingsSubgroups.personal.title",
        subtitleKey: "settingsSubgroups.personal.subtitle",
        icon: { ios: "person.2.fill", android: "group", web: "group" },
        sections: ["settingsIntegration.section.personal"],
      },
      {
        id: "other",
        titleKey: "settingsSubgroups.other.title",
        subtitleKey: "settingsSubgroups.other.subtitle",
        icon: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
        sections: ["notif.groupContent", "settingsPanel.section.feedback"],
      },
    ],
  },
  {
    id: "quran",
    cluster: "reading",
    titleKey: "settingsPanel.group.quran",
    subtitleKey: "settingsPanel.group.quranSub",
    icon: { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
    tv: true,
    summaryIds: ["quran.reader.layout", "quran.recitation.reciter"],
  },
  {
    id: "content",
    cluster: "reading",
    titleKey: "settingsPanel.group.content",
    subtitleKey: "settingsPanel.group.contentSub",
    icon: { ios: "books.vertical.fill", android: "library_books", web: "library_books" },
    tv: true,
    summaryIds: ["content.tasbeeh.appearance"],
  },
  {
    id: "fonts",
    cluster: "reading",
    titleKey: "settingsPanel.group.fonts",
    subtitleKey: "settingsPanel.group.fontsSub",
    icon: { ios: "textformat.size", android: "format_size", web: "format_size" },
    tv: true,
    summaryIds: ["fonts.arabicTypeface", "fonts.arabicSize"],
  },
  {
    id: "audio",
    cluster: "reading",
    titleKey: "settingsPanel.group.audio",
    subtitleKey: "settingsPanel.group.audioSub",
    icon: { ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" },
    tv: false,
    summaryIds: ["audio.speed", "audio.volume"],
  },
  {
    id: "appearance",
    cluster: "personalise",
    titleKey: "settingsPanel.group.appearance",
    subtitleKey: "settingsPanel.group.appearanceSub",
    icon: { ios: "paintpalette.fill", android: "palette", web: "palette" },
    tv: true,
    summaryIds: ["appearance.theme", "appearance.accent"],
  },
  {
    id: "language",
    cluster: "personalise",
    titleKey: "settingsPanel.group.language",
    subtitleKey: "settingsPanel.group.languageSub",
    icon: { ios: "globe", android: "language", web: "language" },
    tv: true,
    summaryIds: ["language.app", "language.timeFormat", "language.defaultCalendar"],
  },
  {
    id: "accessibility",
    cluster: "personalise",
    titleKey: "settingsPanel.group.accessibility",
    subtitleKey: "settingsPanel.group.accessibilitySub",
    icon: { ios: "accessibility", android: "accessibility_new", web: "accessibility_new" },
    tv: false,
    summaryIds: ["accessibility.haptics"],
  },
  {
    id: "privacy",
    cluster: "privacy",
    titleKey: "settingsPanel.group.privacy",
    subtitleKey: "settingsPanel.group.privacySub",
    icon: { ios: "lock.fill", android: "lock", web: "lock" },
    tv: false,
    summaryIds: [],
  },
  {
    // NF-3.16–3.18 (§4.5.8): family & kids, accountability partner, group khatm.
    // D-34: sits next to Privacy — circles are about who sees your data.
    id: "circles",
    cluster: "privacy",
    titleKey: "circles.settings.groupTitle",
    subtitleKey: "circles.settings.groupSub",
    icon: { ios: "person.3.fill", android: "groups", web: "groups" },
    tv: false,
    summaryIds: [],
  },
  {
    id: "data",
    cluster: "privacy",
    titleKey: "settingsPanel.group.data",
    subtitleKey: "settingsPanel.group.dataSub",
    icon: { ios: "internaldrive.fill", android: "storage", web: "storage" },
    tv: true,
    summaryIds: [],
  },
  {
    id: "devices",
    cluster: "privacy",
    titleKey: "settingsPanel.group.devices",
    subtitleKey: "settingsPanel.group.devicesSub",
    icon: { ios: "applewatch", android: "devices", web: "devices" },
    tv: true,
    summaryIds: [],
  },
  {
    id: "about",
    cluster: "help",
    titleKey: "settingsPanel.group.about",
    subtitleKey: "settingsPanel.group.aboutSub",
    icon: { ios: "info.circle.fill", android: "info", web: "info" },
    tv: true,
    summaryIds: [],
  },
];

const GROUP_BY_ID = new Map(SETTINGS_GROUPS.map((g) => [g.id, g]));

export function getSettingsGroup(id: SettingsGroupId): SettingsGroupMeta {
  const group = GROUP_BY_ID.get(id);
  if (!group) throw new Error(`Unknown settings group: ${id}`);
  return group;
}

/** A group is shown when it is TV-relevant (on TV) and has at least one available row. */
export function isGroupAvailable(group: SettingsGroupMeta, ctx: PlatformCtx): boolean {
  if (ctx.tv && !group.tv) return false;
  return settingsForGroup(group.id, ctx, { listedOnly: true }).length > 0;
}

export function availableGroups(ctx: PlatformCtx): SettingsGroupMeta[] {
  return SETTINGS_GROUPS.filter((g) => isGroupAvailable(g, ctx));
}

/** "Muslim World League · Hanafi · Lahore" — joined summaries of the group's key settings. */
export function groupSummary(
  group: SettingsGroupMeta,
  snapshot: SettingsSnapshot,
  t: TFunction,
  ctx: PlatformCtx,
): string {
  const parts: string[] = [];
  for (const id of group.summaryIds) {
    const def = getSetting(id);
    if (!def?.summary || !isSettingAvailable(def, ctx)) continue;
    const text = def.summary(def.read(snapshot), t);
    if (text) parts.push(text);
  }
  return parts.length > 0 ? parts.join(" · ") : t(group.subtitleKey);
}

/** The sub-screen holding `section` in `group`, or null (shown on the group screen itself). */
export function subgroupOfSection(
  group: SettingsGroupId,
  section: string,
): SettingsSubgroupMeta | null {
  return getSettingsGroup(group).subgroups?.find((sub) => sub.sections.includes(section)) ?? null;
}

/** The sub-screen that holds a setting (by id), or null. */
export function subgroupOfSetting(id: string): SettingsSubgroupMeta | null {
  const def = getSetting(id);
  return def ? subgroupOfSection(def.group, def.section) : null;
}

export function getSettingsSubgroup(
  group: SettingsGroupId,
  subgroup: string,
): SettingsSubgroupMeta | null {
  return getSettingsGroup(group).subgroups?.find((sub) => sub.id === subgroup) ?? null;
}
