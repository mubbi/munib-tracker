/**
 * Settings registry (NF-3.0b, §4.5.4): every user-facing persisted option is
 * declared ONCE here. The hub, group screens, search, deep links, reset, TV/web
 * filtering and `registry.coverage.test.ts` all read these declarations.
 *
 * Adding a setting = add a def to the group's file in `defs/` (one file per
 * group so feature PRs don't collide) and list its persisted `fields`.
 */
import { ABOUT_SETTINGS } from "./defs/about";
import { ACCESSIBILITY_SETTINGS } from "./defs/accessibility";
import { APPEARANCE_SETTINGS } from "./defs/appearance";
import { AUDIO_SETTINGS } from "./defs/audio";
import { CIRCLE_SETTINGS } from "./defs/circles";
import { CONTENT_SETTINGS } from "./defs/content";
import { DATA_SETTINGS } from "./defs/data";
import { DEVICE_SETTINGS } from "./defs/devices";
import { FIQH_SETTINGS } from "./defs/fiqh";
import { FONT_SETTINGS } from "./defs/fonts";
import { LANGUAGE_SETTINGS } from "./defs/language";
import { NOTIFICATION_SETTINGS } from "./defs/notifications";
import { PRAYER_TIMES_SETTINGS } from "./defs/prayer-times";
import { PRIVACY_SETTINGS } from "./defs/privacy";
import { QURAN_SETTINGS } from "./defs/quran";
import { TASBEEH_SETTINGS } from "./defs/tasbeeh";
import type { SettingsGroupId } from "./routes";
import type {
  AnySettingDef,
  PlatformCtx,
  SettingControl,
  SettingDef,
  SettingId,
  SettingScope,
  SettingsSnapshot,
} from "./types";

export type {
  AnySettingDef,
  PlatformCtx,
  SettingControl,
  SettingDef,
  SettingId,
  SettingScope,
  SettingsGroupId,
  SettingsSnapshot,
};

export const SETTINGS_REGISTRY: readonly AnySettingDef[] = [
  ...PRAYER_TIMES_SETTINGS,
  ...FIQH_SETTINGS,
  ...NOTIFICATION_SETTINGS,
  ...QURAN_SETTINGS,
  ...CONTENT_SETTINGS,
  ...TASBEEH_SETTINGS,
  ...FONT_SETTINGS,
  ...AUDIO_SETTINGS,
  ...APPEARANCE_SETTINGS,
  ...LANGUAGE_SETTINGS,
  ...ACCESSIBILITY_SETTINGS,
  ...CIRCLE_SETTINGS,
  ...PRIVACY_SETTINGS,
  ...DATA_SETTINGS,
  ...DEVICE_SETTINGS,
  ...ABOUT_SETTINGS,
];

const BY_ID = new Map<SettingId, AnySettingDef>(SETTINGS_REGISTRY.map((def) => [def.id, def]));

export function getSetting(id: SettingId): AnySettingDef | undefined {
  return BY_ID.get(id);
}

export function isSettingAvailable(def: AnySettingDef, ctx: PlatformCtx): boolean {
  return def.available ? def.available(ctx) : true;
}

export function isSettingEnabled(def: AnySettingDef, snapshot: SettingsSnapshot): boolean {
  return def.enabledWhen ? def.enabledWhen(snapshot) : true;
}

export function isSettingVisible(def: AnySettingDef, snapshot: SettingsSnapshot): boolean {
  return def.visibleWhen ? def.visibleWhen(snapshot) : true;
}

export function isSettingResettable(def: AnySettingDef): boolean {
  if (def.resettable === false) return false;
  return def.control.kind !== "action";
}

/** Available defs of a group in declaration order. */
export function settingsForGroup(
  group: SettingsGroupId,
  ctx: PlatformCtx,
  options: { listedOnly?: boolean } = {},
): AnySettingDef[] {
  return SETTINGS_REGISTRY.filter(
    (def) =>
      def.group === group &&
      isSettingAvailable(def, ctx) &&
      (!options.listedOnly || def.listed !== false),
  );
}

export interface SettingsSectionModel {
  /** i18n key of the section header. */
  key: string;
  defs: AnySettingDef[];
}

/** Group defs bucketed by `section`, preserving first-seen order. */
export function sectionsForGroup(group: SettingsGroupId, ctx: PlatformCtx): SettingsSectionModel[] {
  const sections: SettingsSectionModel[] = [];
  for (const def of settingsForGroup(group, ctx, { listedOnly: true })) {
    let section = sections.find((s) => s.key === def.section);
    if (!section) {
      section = { key: def.section, defs: [] };
      sections.push(section);
    }
    section.defs.push(def);
  }
  return sections;
}

export function resolveDefault<V>(def: SettingDef<V>, snapshot: SettingsSnapshot): V {
  return typeof def.defaultValue === "function"
    ? (def.defaultValue as (s: SettingsSnapshot) => V)(snapshot)
    : def.defaultValue;
}

/** Structural equality good enough for setting values (primitives, arrays, plain objects). */
export function settingValuesEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}

export function isAtDefault(def: AnySettingDef, snapshot: SettingsSnapshot): boolean {
  return settingValuesEqual(def.read(snapshot), resolveDefault(def, snapshot));
}
