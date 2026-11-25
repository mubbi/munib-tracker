import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  DEFAULT_USER_PREFERENCES,
  DEFAULT_WEATHER_PREFERENCES,
} from "@munib-tracker/shared/constants";
import type {
  FontPreferences,
  NotificationPreferences,
  UserPreferences,
} from "@munib-tracker/shared/types";

import { DEFAULT_HADITH_PREFS } from "@/db/repositories/hadith-repository";
import { DEFAULT_QURAN_PREFS, type QuranPrefs } from "@/db/repositories/quran-repository";
import type { StoredLocation } from "@/lib/location";
import { DEFAULT_COMPANION_PREFS } from "@/lib/quran-companion/prefs";
import {
  DEFAULT_DEVICE_PREFERENCES,
  type DevicePreferences,
} from "@/stores/device-preferences-store";

import {
  INTERNAL_FIELDS,
  PENDING_REGISTRATION,
  PENDING_REGISTRATION_PREFIXES,
} from "./internal-fields";
import { SETTINGS_REGISTRY } from "./registry";

/**
 * "All settings in one place" (§4.5.4): every preference field is either owned
 * by a registered setting (`SettingDef.fields`) or listed in `INTERNAL_FIELDS`
 * with a reason. Adding a preference without a place in Settings fails here.
 *
 * Optional fields don't appear in the default objects, so the typed key maps
 * below make the compiler list them too (a new `UserPreferences` field is a type
 * error until it is added here — and then this test demands a registration).
 */
type PendingPrefKey = never;
type CoveredPrefKey = Exclude<keyof UserPreferences, PendingPrefKey>;

const USER_PREFERENCE_KEYS = {
  locale: 1,
  translationLocale: 1,
  timeFormat: 1,
  defaultCalendar: 1,
  colorMode: 1,
  accentColorId: 1,
  bedtime: 1,
  notificationPrefs: 1,
  prayerAlerts: 1,
  prayerReminderOffsets: 1,
  fontPrefs: 1,
  readingDisplay: 1,
  favoriteZikrIds: 1,
  favoriteZikrOrder: 1,
  hasCompletedOnboarding: 1,
  displayName: 1,
  avatarUri: 1,
  customAccent: 1,
  adhanStyleId: 1,
  quickActionOrder: 1,
  hiddenHomeModules: 1,
  libraryMenuOrder: 1,
  defaultCurrency: 1,
  defaultNumberFormat: 1,
  tasbeehAppearance: 1,
  tasbeehVoice: 1,
  tasbeehAnnouncements: 1,
  qiblaCompassStyle: 1,
  madhhab: 1,
  madhhabOverrides: 1,
  fiqhCustom: 1,
  hijriAdjustment: 1,
  audioSpeed: 1,
  audioVolume: 1,
  cacheAudioLocally: 1,
  cacheQuranEditionsLocally: 1,
  cacheHadithLocally: 1,
  weatherPrefs: 1,
  hapticsEnabled: 1,
  liveActivityEnabled: 1,
  salahTrackingSession: 1,
  activeExcusedReason: 1,
  updatedAt: 1,
  favoritesUpdatedAt: 1,
  rawatib: 1,
  witrQaza: 1,
  voluntaryFasting: 1,
  coachWeekday: 1,
  focusLock: 1,
  // NF-3.11 masjid finder.
  homeMasjid: 1,
  masjidWalkMinutes: 1,
} satisfies Record<CoveredPrefKey, 1>;

const NOTIFICATION_KEYS = {
  ...DEFAULT_NOTIFICATION_PREFERENCES,
  preciseAdhan: false,
  reviewReactivationEnabled: true,
  // Optional (unset ⇒ on), so absent from the defaults.
  debts: true,
  wasiyyahReview: true,
  muhasabah: false,
  familyTies: true,
  coach: true,
  // NF-3.11: opt-in iqamah reminder (unset ⇒ off).
  iqamah: false,
} satisfies Record<keyof NotificationPreferences, unknown>;

const FONT_KEYS = {
  arabic: 1,
  translation: 1,
  readingOverrides: 1,
} satisfies Record<keyof FontPreferences, 1>;

const QURAN_KEYS = {
  ...DEFAULT_QURAN_PREFS,
  secondaryTranslationId: 1,
  preferredTafsirId: 1,
  repeatRange: 1,
} satisfies Record<keyof QuranPrefs, unknown>;

const LOCATION_KEYS = {
  latitude: 1,
  longitude: 1,
  label: 1,
  city: 1,
  country: 1,
  method: 1,
  madhab: 1,
  highLatitudeRule: 1,
  prayerAdjustments: 1,
  source: 1,
  updatedAt: 1,
  timeZone: 1,
  countryCode: 1,
} satisfies Record<keyof StoredLocation, 1>;

const COMPANION_KEYS = {
  ...DEFAULT_COMPANION_PREFS,
  pronunciationConsentAt: 1,
  lastPassage: 1,
};

/** DevicePreferences (B4): never synced; each field is registered or internal too. */
const DEVICE_KEYS = {
  ...DEFAULT_DEVICE_PREFERENCES,
  preciseAdhan: 1,
  liveActivityEnabled: 1,
  avatarUri: 1,
  languageConfirmedAt: 1,
  methodReviewedAt: 1,
  setupProgress: 1,
  methodSuggestionDismissed: 1,
  tvShowFinanceTools: 1,
  appIcon: 1,
  appIconOffersSeen: 1,
} satisfies Record<keyof DevicePreferences, unknown>;

function allPreferenceFields(): string[] {
  const prefKeys = new Set([
    ...Object.keys(DEFAULT_USER_PREFERENCES),
    ...Object.keys(USER_PREFERENCE_KEYS),
  ]);
  const fields: string[] = [];
  for (const key of prefKeys) {
    if (key === "notificationPrefs") {
      for (const k of Object.keys(NOTIFICATION_KEYS)) fields.push(`prefs.notificationPrefs.${k}`);
    } else if (key === "weatherPrefs") {
      for (const k of Object.keys(DEFAULT_WEATHER_PREFERENCES)) {
        fields.push(`prefs.weatherPrefs.${k}`);
      }
    } else if (key === "fontPrefs") {
      for (const k of Object.keys(FONT_KEYS)) fields.push(`prefs.fontPrefs.${k}`);
    } else {
      fields.push(`prefs.${key}`);
    }
  }
  for (const k of Object.keys(QURAN_KEYS)) fields.push(`quran.${k}`);
  for (const k of Object.keys(DEFAULT_HADITH_PREFS)) fields.push(`hadith.${k}`);
  for (const k of Object.keys(COMPANION_KEYS)) fields.push(`companion.${k}`);
  for (const k of Object.keys(LOCATION_KEYS)) fields.push(`location.${k}`);
  for (const k of Object.keys(DEVICE_KEYS)) fields.push(`device.${k}`);
  return fields;
}

const registered = new Set(SETTINGS_REGISTRY.flatMap((def) => def.fields ?? []));

function isPending(field: string): boolean {
  return (
    PENDING_REGISTRATION.includes(field) ||
    PENDING_REGISTRATION_PREFIXES.some((prefix) => field.startsWith(prefix))
  );
}

describe("settings registry coverage", () => {
  it("every preference field is registered or explicitly internal", () => {
    const orphans = allPreferenceFields().filter(
      (field) => !registered.has(field) && !(field in INTERNAL_FIELDS) && !isPending(field),
    );
    expect(orphans).toEqual([]);
  });

  it("no field is both registered and internal", () => {
    expect(Object.keys(INTERNAL_FIELDS).filter((field) => registered.has(field))).toEqual([]);
  });

  it("every internal field still exists (no stale reasons)", () => {
    const all = new Set(allPreferenceFields());
    expect(Object.keys(INTERNAL_FIELDS).filter((field) => !all.has(field))).toEqual([]);
  });

  it("registered fields point at real preference fields", () => {
    const all = new Set(allPreferenceFields());
    expect([...registered].filter((field) => !all.has(field))).toEqual([]);
  });
});
