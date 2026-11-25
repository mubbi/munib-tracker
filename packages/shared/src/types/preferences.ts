import type { AppLocale } from "../i18n/app-locale";
import type { VoluntaryFastingNotificationPrefs, VoluntaryFastingPrefs } from "./fasting";
import type { FocusLockPrefs } from "./focus-lock";
import type { HomeMasjid } from "./masjid";
import type { ExcusedReason, PrayerId, RawatibExtraPrayer } from "./prayer";
import type { QiblaCompassStyleId } from "./qibla-compass";
import type { TasbeehAppearance } from "./tasbeeh-appearance";
import type { WeatherPreferences } from "./weather";

export type { AppLocale };

/** Clock display format for prayer times, reminders, and schedules. */
export type TimeFormat = "12" | "24";

/** Calendar system used for on-screen dates and calendar pickers. */
export type CalendarMode = "gregorian" | "hijri";

export interface NotificationPreferences {
  masterEnabled: boolean;
  prayer: boolean;
  /** Reminders for sunnah & optional prayers with fixed times. */
  sunnahPrayer: boolean;
  qaza: boolean;
  morningZikr: boolean;
  eveningZikr: boolean;
  beforePrayer: boolean;
  afterPrayer: boolean;
  beforeSleep: boolean;
  afterAzan: boolean;
  achievements: boolean;
  /**
   * Play the adhan as the notification sound at each obligatory prayer time
   * (native only — custom notification sounds require a dev/EAS build and do not
   * work in Expo Go or on the web).
   */
  playAdhanOnPrayer: boolean;
  /**
   * Android only, opt-in (default off): schedule Adhan notifications as exact
   * alarm-clock alarms (`AlarmManager.setAlarmClock`) so battery optimisation can't
   * delay them. Needs the exact-alarm permission; without it Android falls back to
   * normal scheduling. The status bar shows an alarm icon until the Adhan fires.
   */
  preciseAdhan?: boolean;
  /** A daily reflection nudge (verse / hadith of the day) — NF-1.24. */
  dailyContent: boolean;
  /** Friday reminder for Jumu'ah, Surah Al-Kahf, and the hour of acceptance — NF-1.25. */
  friday: boolean;
  /** White Days (Ayyām al-Bīḍ) fasting nudge on Hijri 13–15 — NF-2.37. */
  whiteDays: boolean;
  /** Nightly muhasabah reminder (NF-3.6). Unset ⇒ off; offered after the first review. */
  muhasabah?: boolean;
  /**
   * Weekly family-ties digest + one parent nudge (NF-3.7). Unset ⇒ on once at
   * least one relative is added; `false` turns it off.
   */
  familyTies?: boolean;
  /**
   * Voluntary fasting (NF-3.2): night-before intent + suhoor reminders. Weekly
   * (Mon/Thu) default off; seasonal (Arafah, Ashura, Shawwal, …) default on.
   * Unset ⇒ `DEFAULT_VOLUNTARY_FASTING_NOTIFICATION_PREFS`.
   */
  voluntaryFasting?: VoluntaryFastingNotificationPrefs;
  /**
   * NF-3.8: "A payment is due" on a debt's due date and 3 days before (generic
   * text, no names or amounts). Unset ⇒ on; only fires when an open record has a due date.
   */
  debts?: boolean;
  /**
   * NF-3.9: "Review your wasiyyah" every N months (interval kept in the vault) and
   * after open debts change by more than 20 %. Unset ⇒ on once a wasiyyah is saved.
   */
  wasiyyahReview?: boolean;
  /** NF-3.5: one optional evening nudge for the daily Sunnah habits (default off). */
  habits?: boolean;
  /**
   * NF-3.14: weekly "Your weekly reflection is ready" on the coach day (generic
   * text, §11 tier 5). Unset ⇒ on; skipped while excused or with nothing tracked.
   */
  coach?: boolean;
  /** NF-3.3: Dhul-Hijjah seasonal nudges — eve of the ten, daily morning card, Arafah eve (default on). */
  dhulHijjah?: boolean;
  /** NF-3.3: Takbir al-Tashriq reminder after each fard in the window (default off). */
  takbirTashriq?: boolean;
  /**
   * NF-3.1: one gentle nudge ~10 min after marking a fard when its after-rawatib
   * is still unlogged (default off). Paused during excused periods.
   */
  rawatibNudge?: boolean;
  /**
   * NF-3.11: "leave now" reminder at `iqamah − masjidWalkMinutes` for the home
   * masjid — only when iqamah times exist (private or public). Default off;
   * paused during excused periods. Generic text (no masjid name).
   */
  iqamah?: boolean;
  /**
   * D40: one reminder at the start of the chosen school's preferred (mustahabb)
   * band — Hanafi Fajr isfar / Asr before yellowing / Isha towards ⅓ of the
   * night (Hanbali Isha too). Default off; never in all-views mode; paused
   * during excused periods. Generic text.
   */
  preferredTime?: boolean;
  /**
   * NF-3.13: the native "Tap to confirm your salah" notification posted when the
   * user taps "I've prayed" on the focus-lock shield (default on). Scheduled by
   * the native focus-lock module, so it is outside the JS reminder budget (§11).
   */
  focusLock?: boolean;
  /**
   * D33 circle push (server-sent, Expo + Web Push; also in the inbox either way):
   * a group-khatm part was completed (≤ 1 per khatm per hour), a group khatm
   * was completed, someone in a partner circle made dua for you. Unset ⇒ on.
   * The API reads these from the synced `preferences` record.
   */
  circleKhatmProgress?: boolean;
  circleKhatmCompleted?: boolean;
  circleDuaReceived?: boolean;
  /**
   * D40 weekly family digest push to parents (counts only, no child names),
   * Friday 18:00 UTC; the inbox row is written either way. Unset ⇒ on.
   */
  circleFamilyDigest?: boolean;
}

/** Daily rawatib target: 12 (4 before Dhuhr) or 10 (2 before Dhuhr) — D8. */
export type RawatibPreset = 10 | 12;

/** NF-3.1 rawatib preferences (account-scoped, synced with the prefs blob). */
export interface RawatibPreferences {
  enabled: boolean;
  /** Unset ⇒ follows the madhhab default (`MADHHAB_RULES[m].rawatib.defaultPreset`). */
  preset?: RawatibPreset;
  /** Optional ghayr mu'akkadah extras (default none). */
  extras: RawatibExtraPrayer[];
}

export interface FontScopePrefs {
  family?: string;
  size?: number;
}

/** Reading surfaces that can carry an in-context font-size delta on top of the global sizes. */
export type ReadingSurface =
  | "quran"
  | "hadith"
  | "dua_zikr"
  | "salah_guide"
  | "jannah"
  | "jahannam"
  | "battles"
  | "taharah"
  | "prophets"
  | "aqeedah"
  | "last_day"
  | "learn_dua"
  | "learn_quran"
  /** Zakat, Islamic finance and fidyah guides (G-72); they used to borrow "jannah". */
  | "finance";

/**
 * Every {@link ReadingSurface}, in Settings › Per-screen text sizes order. The
 * `satisfies` check plus `reading-surfaces.test.ts` keep it exhaustive.
 */
export const READING_SURFACE_IDS = [
  "quran",
  "hadith",
  "dua_zikr",
  "salah_guide",
  "jannah",
  "jahannam",
  "battles",
  "taharah",
  "prophets",
  "aqeedah",
  "last_day",
  "learn_dua",
  "learn_quran",
  "finance",
] as const satisfies readonly ReadingSurface[];

/** A per-surface size adjustment applied on top of the global font sizes. */
export interface ReadingSizeOverride {
  /** Points added to the resolved Arabic size (clamped by the resolver). */
  arabicDelta?: number;
  /** Points added to the resolved transliteration + translation size. */
  textDelta?: number;
}

/**
 * Settings › Text & fonts. The never-read `global`, `titles`, `transliteration`
 * and `color` scopes were removed (settings audit B5): transliteration always
 * follows the translation size − 1. Old synced blobs that still carry them are
 * tolerated — the preferences repository drops unknown scopes on read.
 */
export interface FontPreferences {
  arabic: FontScopePrefs;
  translation: FontScopePrefs;
  /** In-context A−/A+ deltas per reading surface, applied over the global sizes. */
  readingOverrides?: Partial<Record<ReadingSurface, ReadingSizeOverride>>;
}

/**
 * App-wide translation / transliteration visibility (D13): one pair shared by the
 * Qur'an reader, practice, hadith, duas, adhkar, duroods and tasbeeh.
 */
export interface ReadingDisplayPrefs {
  showTranslation: boolean;
  showTransliteration: boolean;
}

/** Whole-calendar Hijri shift in days (D14). +1 = "my months start one day later than predicted". */
export type HijriOffsetDays = -2 | -1 | 0 | 1 | 2;

/** Hijri month key `"YYYY-MM"`, e.g. `"1448-09"` for Ramadan 1448. */
export type HijriMonthKey = `${number}-${string}`;

/**
 * User correction of the computed Hijri calendar (D14, plan §4.5.11). Applied
 * once inside `apps/app/src/lib/hijri.ts`, so every surface agrees. Months
 * always stay 29 or 30 days long by construction.
 */
export interface HijriAdjustment {
  /** Whole-calendar shift in days, −2…+2. Default 0. */
  offsetDays: HijriOffsetDays;
  /** Per-month announced starts: key `"1448-09"` → Gregorian ISO date of day 1 in the user's area. */
  monthStarts?: Record<HijriMonthKey, string>;
  /** Method fingerprint when the corrections were made (Umm al-Qura / sighting + rounded lat/lon). */
  basis?: string;
  /** Display-only place name for `basis` ("Your corrections were made for <place>"). */
  basisPlace?: string;
  /** ISO datetime of the last edit. */
  updatedAt: string;
}

/**
 * Fiqh school for rulings (NF-3.0a, D9). Independent of the Asr calculation
 * `MadhabKey` in `apps/app/src/lib/prayer-times.ts`.
 */
export type MadhhabId = "hanafi" | "shafii" | "maliki" | "hanbali";

/** Fiqh areas a user may set independently (advanced; talfiq caution shown). */
export type FiqhDomain =
  | "salah"
  | "taharah"
  | "fasting"
  | "zakat"
  | "travel"
  | "hajj"
  | "udhiyah"
  | "inheritance";

/** Zakat nisab basis for cash / trade goods: the lower of gold or silver, or one metal. */
export type NisabBasis = "lower" | "gold" | "silver";

/** Explicit numeric overrides a local scholar gave (labelled "Custom" in the UI). */
export interface FiqhCustomValues {
  qasrDistanceKm?: number;
  residencyDays?: number;
  nisabBasis?: NisabBasis;
  haydMaxDays?: number;
  nifasMaxDays?: number;
}

/** Thousands/decimal separators for money inputs (mirrors the app's `NumberFormatStyle`). */
export type NumberFormatId = "comma_dot" | "dot_comma" | "space_dot" | "space_comma";

/** Mirrors `@munib-tracker/theme` ColorMode — kept here so preferences stay package-local. */
export type PreferenceColorMode = "light" | "dark" | "system";

/** Hands-free tasbeeh confidence gate (D16): Strict is the default. */
export type TasbeehVoiceSensitivity = "strict" | "balanced";
/** Auto-stop listening after this many seconds without speech. */
export type TasbeehVoiceSilenceStopSec = 30 | 60 | 120;

/** NF-3.20 voice counting settings (synced with preferences; calibration is device-local). */
export interface TasbeehVoicePreferences {
  sensitivity: TasbeehVoiceSensitivity;
  silenceStopSec: TasbeehVoiceSilenceStopSec;
}

/** How often the tasbeeh counter speaks the count to a screen reader. */
export type TasbeehAnnouncementFrequency = "every" | "milestones" | "off";

/** Mirrors `@munib-tracker/theme` AccentColorId presets. */
export type PreferenceAccentColorId =
  | "forest"
  | "ocean"
  | "indigo"
  | "purple"
  | "rose"
  | "coral"
  | "amber"
  | "teal"
  | "cyan"
  | "slate"
  | "pink"
  | "lime";

export interface UserPreferences {
  locale: AppLocale;
  translationLocale: AppLocale;
  /** Clock display format (12-hour with AM/PM or 24-hour). */
  timeFormat: TimeFormat;
  /** Default calendar for dates shown across the app and calendar tabs. */
  defaultCalendar: CalendarMode;
  /** App chrome light/dark/system preference (cloud-synced with the prefs blob). */
  colorMode?: PreferenceColorMode;
  /** Preset accent id when not using a custom hex (cloud-synced). */
  accentColorId?: PreferenceAccentColorId;
  /** HH:mm */
  bedtime?: string;
  notificationPrefs: NotificationPreferences;
  /** Per-prayer alert overrides; unset entries fall back to category toggles. */
  prayerAlerts?: Partial<Record<PrayerId, boolean>>;
  /**
   * Per-prayer reminder offset in minutes applied to the main obligatory-prayer
   * reminder (negative = before the adhan, positive = after, ±120). Unset ⇒
   * fires at adhan time (NF-1.7).
   */
  prayerReminderOffsets?: Partial<Record<PrayerId, number>>;
  fontPrefs: FontPreferences;
  /**
   * App-wide translation / transliteration visibility (D13). Unset until the
   * one-time migration seeds it from the Qur'an reader (then the old dua/zikr
   * visibility store); readers treat unset as both on.
   */
  readingDisplay?: ReadingDisplayPrefs;
  favoriteZikrIds: string[];
  favoriteZikrOrder: string[];
  hasCompletedOnboarding: boolean;
  /** Local display name (falls back to the provider's name when signed in). */
  displayName?: string;
  /** Local avatar image URI chosen from the gallery. */
  avatarUri?: string;
  /** Custom accent hex when the user picks their own colour (P7.6). */
  customAccent?: string;
  /** Selected adhan style id (NF-1.26); resolves against the bundled ADHAN_STYLES. */
  adhanStyleId?: string;
  /** Ordered ids of the home quick actions to show (NF-1.23); unset ⇒ show all. */
  quickActionOrder?: string[];
  /** Home module ids the user has hidden (NF-1.21); unset ⇒ all visible. */
  hiddenHomeModules?: string[];
  /**
   * Library tab section order (D13, Settings › Appearance & home › Library
   * order): `LibrarySectionId`s. Unknown ids are dropped; sections added later
   * are appended in their default position. Unset ⇒ default order.
   */
  libraryMenuOrder?: string[];
  /**
   * Default currency (ISO 4217) that seeds the zakat, fidyah and sadaqah drafts
   * the first time they open (each calculator keeps its own override). Unset ⇒
   * the device region's currency.
   */
  defaultCurrency?: string;
  /** Default number format for money inputs (seeds the same drafts). Unset ⇒ `comma_dot`. */
  defaultNumberFormat?: NumberFormatId;
  /** Preferred audio playback speed for the global player. */
  audioSpeed?: number;
  /** Preferred audio volume for the global player (0–1). */
  audioVolume?: number;
  /**
   * When true (default), streamed audio (Qur'an recitation, duas, adhan, etc.) is
   * downloaded to on-device storage for offline replay and smoother queue playback.
   * When false, audio is streamed only and nothing new is written to local cache.
   */
  cacheAudioLocally?: boolean;
  /**
   * When true (default), on-demand Qur'an translations & tafsir are saved to
   * on-device storage so opened editions work offline. When false they are
   * fetched for the current session only and never written to local storage.
   */
  cacheQuranEditionsLocally?: boolean;
  /**
   * When true (default), fetched hadith collections are saved to on-device
   * storage for offline reading. When false they are fetched for the current
   * session only and never written to local storage.
   */
  cacheHadithLocally?: boolean;
  /** Hero weather display and animated overlays. */
  weatherPrefs: WeatherPreferences;
  /** Vibration feedback on taps and meaningful actions (native only). */
  hapticsEnabled: boolean;
  /** Qibla compass dial design. Unset (or unknown to this client) ⇒ "classic". */
  qiblaCompassStyle?: QiblaCompassStyleId;
  /** Tasbeeh counter design, sound and haptics (NF-3.19). Unset ⇒ Ring default (D10). */
  tasbeehAppearance?: TasbeehAppearance;
  /**
   * Hands-free (voice) tasbeeh counting (NF-3.20). Unset ⇒ Strict, auto-stop
   * after 60 s of silence. Optional, so older clients ignore it.
   */
  tasbeehVoice?: TasbeehVoicePreferences;
  /**
   * Screen-reader count announcements on the tasbeeh counter (NF-3.20,
   * Accessibility). Unset ⇒ "milestones". While voice counting is listening,
   * announcements are capped at milestones whatever this says.
   */
  tasbeehAnnouncements?: TasbeehAnnouncementFrequency;
  /**
   * Show a live next-prayer countdown on the iOS lock screen and Dynamic Island
   * (NF-1.19). iOS ActivityKit; on Android gates the sticky countdown preference.
   * Defaults off — the user must opt in.
   */
  liveActivityEnabled?: boolean;
  /**
   * Explicit Android Live Update / Web Push tracking session started via
   * "Track this Salah". Null/undefined when idle. Shape is opaque JSON so
   * older clients ignore unknown fields safely.
   */
  salahTrackingSession?: {
    sessionId: string;
    prayerId: string;
    prayerName: string;
    startedAt: string;
    promoteAt: string;
    endsAt: string;
    dismissed: boolean;
    status: "active" | "ended" | "dismissed";
  } | null;
  /**
   * Ongoing excused period (hayd / illness / travel). Persists across calendar
   * days until the user taps resume. `undefined` = never set (legacy bootstrap
   * from yesterday's logs); `null` = explicitly cleared.
   */
  activeExcusedReason?: ExcusedReason | null;
  /** Fiqh school for rulings (NF-3.0a). `null` = show all views side by side; `undefined` = never asked. */
  madhhab?: MadhhabId | null;
  /** Advanced: per-domain school (e.g. Hanafi overall, silver nisab for zakat). Unset domain ⇒ `madhhab`. */
  madhhabOverrides?: Partial<Record<FiqhDomain, MadhhabId | null>>;
  /** Advanced: explicit numeric overrides a local scholar gave (labelled "Custom" in the UI). */
  fiqhCustom?: FiqhCustomValues;
  /** Hijri date adjustment (D14): global offset + per-month announced starts. Unset ⇒ no adjustment. */
  hijriAdjustment?: HijriAdjustment;
  /**
   * Sunnah rawatib tracking (NF-3.1, D8). Unset ⇒ on with the school preset once a
   * madhhab is chosen; otherwise the tracker asks first.
   */
  rawatib?: RawatibPreferences;
  /**
   * Count a missed Witr toward qaza (§4.1.4 retrofit). Unset ⇒ the school default
   * (`MADHHAB_RULES[m].witr.qazaDefault`: on only for Hanafi); with no school
   * chosen the tracker keeps asking each time.
   */
  witrQaza?: boolean;
  /** Voluntary fasting tracker (NF-3.2). Unset ⇒ `DEFAULT_VOLUNTARY_FASTING_PREFS`. */
  voluntaryFasting?: VoluntaryFastingPrefs;
  /** NF-3.11 home masjid (OSM ref + display snapshot). Unset ⇒ none. Never sent to the masjids API. */
  homeMasjid?: HomeMasjid | null;
  /** NF-3.11 minutes to reach the home masjid (iqamah "leave now" lead). Unset ⇒ 10. */
  masjidWalkMinutes?: number;
  /** NF-3.13 Salah focus lock (D4). Unset ⇒ `DEFAULT_FOCUS_LOCK_PREFS` (off). App picks stay on the device. */
  focusLock?: FocusLockPrefs;
  /**
   * NF-3.14 weekly coach day (0 = Sunday … 6 = Saturday). Unset ⇒ Friday, with
   * the reminder after Jumu'ah (`COACH_DEFAULT_WEEKDAY`).
   */
  coachWeekday?: number;
  /** ISO datetime the preferences blob was last edited (sync last-write-wins). */
  updatedAt?: string;
  /** ISO datetime the favorite-zikr list was last edited (sync last-write-wins). */
  favoritesUpdatedAt?: string;
}
