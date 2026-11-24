import type { UserPreferences } from "@munib-tracker/shared/types";
import type { Href } from "expo-router";
import type { TFunction } from "i18next";
import type { ComponentType } from "react";

import type { HadithPrefs } from "@/db/repositories/hadith-repository";
import type { QuranPrefs } from "@/db/repositories/quran-repository";
import type { StoredLocation } from "@/lib/location";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import type { QuranCompanionPrefs } from "@/lib/quran-companion/types";
import type { DevicePreferences } from "@/stores/device-preferences-store";

import type { SettingsGroupId } from "./routes";

export type { SettingsGroupId };

/**
 * Stable setting id. Always `<group>.<…>` (e.g. `"quran.reader.layout"`) so a
 * deep link can be built from the id alone without loading the registry
 * (`settingHref` in `routes.ts`); `registry.test.ts` enforces the prefix.
 */
export type SettingId = string;

/** account = synced with the preferences blob / blob-sync; device = never synced. */
export type SettingScope = "account" | "device";

/** Read-only view over every store a setting can live in (pure selectors read this). */
export interface SettingsSnapshot {
  prefs: UserPreferences;
  quran: QuranPrefs;
  hadith: HadithPrefs;
  companion: QuranCompanionPrefs;
  location: StoredLocation;
  /** Device preferences (B4, never synced): explicitly-set values only. */
  device: Partial<DevicePreferences>;
}

/** Platform facts the `available` predicates read (injected so tests can vary them). */
export interface PlatformCtx {
  os: "ios" | "android" | "web" | "windows" | "macos";
  tv: boolean;
  /** iOS/Android phone or tablet (not TV, not web). */
  native: boolean;
  web: boolean;
  /** iOS ActivityKit available in this build. */
  liveActivitySupported: boolean;
}

export interface ChoiceOption<V> {
  value: V;
  /** i18n key of the option label. */
  labelKey?: string;
  /** Literal label (proper nouns: reciter names, native language names). */
  label?: string;
  descriptionKey?: string;
}

export type SettingControl<V> =
  | { kind: "toggle" }
  | {
      kind: "choice";
      options: ReadonlyArray<ChoiceOption<V>>;
      presentation: "segmented" | "list" | "sheet";
    }
  | {
      kind: "stepper";
      min: number;
      max: number;
      step: number;
      format: (v: number, t: TFunction) => string;
    }
  /** HH:mm, respects `timeFormat`. */
  | { kind: "time" }
  /** Rich editor on its own screen. */
  | { kind: "link"; href: Href }
  | { kind: "action"; run: () => Promise<void>; destructive?: boolean; confirmKey?: string }
  /** Accent picker, location picker, adhan style… rendered full-width in the section. */
  | { kind: "custom"; Component: ComponentType<{ settingId: SettingId }> };

export type SettingSideEffect = "reschedule-reminders" | "reload-locale" | "refresh-prayer-times";

export interface SettingDef<V = unknown> {
  id: SettingId;
  group: SettingsGroupId;
  /** i18n key of the section header inside the group. */
  section: string;
  titleKey: string;
  subtitleKey?: string;
  /** Per-locale comma-separated synonyms for search ("adhan, azan, athan"). */
  keywordsKey?: string;
  icon?: AppIcon;
  scope: SettingScope;
  control: SettingControl<V>;
  /** Pure selector over all pref stores. */
  read: (s: SettingsSnapshot) => V;
  /** The ONLY write path; wraps the store action. */
  write: (v: V) => Promise<void>;
  defaultValue: V | ((s: SettingsSnapshot) => V);
  available?: (ctx: PlatformCtx) => boolean;
  enabledWhen?: (s: SettingsSnapshot) => boolean;
  /**
   * False hides the row from the group screen while it doesn't apply to the
   * user's data (e.g. a school-specific option in all-views mode). Unlike
   * `enabledWhen` (greyed out), the row disappears; search still finds it.
   */
  visibleWhen?: (s: SettingsSnapshot) => boolean;
  /** Value shown on the row, in search results and in the group summary. */
  summary?: (v: V, t: TFunction) => string;
  sideEffects?: SettingSideEffect[];
  /** Routes with an in-context control (documentation + tests). */
  shortcuts?: string[];
  /**
   * Persisted fields this setting owns (`prefs.timeFormat`, `quran.readerLayout`,
   * `location.method`…). Read by `registry.coverage.test.ts`.
   */
  fields?: string[];
  /** False for actions, info rows and pickers whose "default" is meaningless. */
  resettable?: boolean;
  /**
   * False hides the row from the group screen (it still appears in search,
   * reset and coverage). Used for options edited on a rich detail screen that the
   * group already links to once (e.g. Qur'an practice).
   */
  listed?: boolean;
}

/** Erased def type the registry stores (each def keeps its own `V` at declaration). */
// biome-ignore lint/suspicious/noExplicitAny: heterogenous registry of differently-typed defs.
export type AnySettingDef = SettingDef<any>;

/** Identity helper that keeps `V` inference at the declaration site. */
export function defineSetting<V>(def: SettingDef<V>): SettingDef<V> {
  return def;
}
