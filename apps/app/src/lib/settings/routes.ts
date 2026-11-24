/**
 * Settings routes — pure (no store imports) so `lib/app-links.ts`, redirects and
 * the universal search can build settings deep links without pulling the registry.
 *
 * Setting ids are always `<group>.<…>`, so `/settings/<group>?focus=<id>` is
 * derivable from the id alone (`registry.test.ts` enforces the prefix).
 */

export const SETTINGS_GROUP_IDS = [
  "prayer-times",
  "fiqh",
  "notifications",
  "quran",
  "content",
  "fonts",
  "audio",
  "appearance",
  "language",
  "accessibility",
  "circles",
  "privacy",
  "data",
  "devices",
  "about",
] as const;

export type SettingsGroupId = (typeof SETTINGS_GROUP_IDS)[number];

/** Route of a group screen. */
export type SettingsGroupPath = `/settings/${SettingsGroupId}`;

/**
 * Long groups split into sub-screens (`/settings/<group>/<subgroup>`). The
 * group screen keeps its master switch and lists the sub-screens; titles and
 * the sections each one holds live in `groups.ts`.
 */
export const SETTINGS_SUBGROUPS = {
  notifications: ["salah", "zikr", "fasting", "personal", "other"],
} as const satisfies Partial<Record<SettingsGroupId, readonly string[]>>;

export type SettingsSubgroupId =
  (typeof SETTINGS_SUBGROUPS)[keyof typeof SETTINGS_SUBGROUPS][number];

/** Route of a sub-screen, e.g. `/settings/notifications/salah`. */
export function settingsSubgroupPath(group: SettingsGroupId, subgroup: string): string {
  return `${settingsGroupPath(group)}/${subgroup}`;
}

/** Rich editors / detail screens that stay their own route under a group. */
export const SETTINGS_DETAIL_PATHS = [
  "/settings/home",
  "/settings/quran-practice",
  "/settings/offline-data",
  "/settings/backup",
  "/settings/import",
  "/settings/app-lock",
  "/settings/voice-shortcuts",
  "/settings/my-reports",
] as const;

export function isSettingsGroupId(value: unknown): value is SettingsGroupId {
  return typeof value === "string" && (SETTINGS_GROUP_IDS as readonly string[]).includes(value);
}

export function settingsGroupPath(group: SettingsGroupId): SettingsGroupPath {
  return `/settings/${group}`;
}

/** Group id a setting id belongs to (`"quran.reader.layout"` → `"quran"`), or null. */
export function groupOfSettingId(id: string): SettingsGroupId | null {
  const dot = id.indexOf(".");
  const head = dot === -1 ? id : id.slice(0, dot);
  return isSettingsGroupId(head) ? head : null;
}

/**
 * `/settings/<group>?focus=<id>` for a setting id (or the hub for an unknown id).
 * For a split group the group screen forwards the focus to the sub-screen that
 * holds the row, so links stay derivable from the id alone.
 */
export function settingHref(id: string): string {
  const group = groupOfSettingId(id);
  if (!group) return "/settings";
  return `${settingsGroupPath(group)}?focus=${encodeURIComponent(id)}`;
}

/**
 * Old routes that became inline rows (§4.5.6). Each file under `app/` now just
 * renders `<Redirect href={settingHref(target)} />`.
 */
export const LEGACY_SETTINGS_REDIRECTS = {
  "/settings/time-format": "language.timeFormat",
  "/settings/default-calendar": "language.defaultCalendar",
  "/settings/weather": "language.temperatureUnit",
  "/settings/bedtime": "notifications.zikr.bedtime",
  "/settings/reminder-offsets": "notifications.salah.offset.fajr",
  "/settings/prayer-tuning": "prayer-times.offset.fajr",
  "/location": "prayer-times.location",
} as const satisfies Record<string, string>;

export type LegacySettingsPath = keyof typeof LEGACY_SETTINGS_REDIRECTS;

/** Every settings path the deep-link allowlist advertises (hub, groups, details, aliases). */
export const SETTINGS_ROUTE_PATHS: readonly string[] = [
  "/settings",
  ...SETTINGS_GROUP_IDS.map(settingsGroupPath),
  ...Object.entries(SETTINGS_SUBGROUPS).flatMap(([group, subs]) =>
    subs.map((sub) => settingsSubgroupPath(group as SettingsGroupId, sub)),
  ),
  ...SETTINGS_DETAIL_PATHS,
  ...Object.keys(LEGACY_SETTINGS_REDIRECTS),
];
