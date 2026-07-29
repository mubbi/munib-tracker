/**
 * Apple Watch store-screenshot scenes.
 *
 * The watch UI is a single SwiftUI list driven by `widget_snapshot_v1`.
 * Scenes differ by the seeded App Group snapshot — no Maestro navigation.
 */

/** App Store Ultra 3 size — Apple scales down to smaller watches. */
export const WATCH_STORE_SIZE = { w: 422, h: 514, label: "watch-ultra-3" };

/**
 * @typedef {{
 *   id: string,
 *   storeFile: string,
 *   title: string,
 *   buildSnapshot: () => object,
 * }} WatchScene
 */

/** @returns {string} ISO timestamp ~now */
function nowIso() {
  return new Date().toISOString();
}

function baseTheme(isDark = true) {
  return isDark
    ? {
        isDark: true,
        primary: "#34d399",
        background: "#060a09",
        cardBackground: "#0d1a16",
        textPrimary: "#f0fdf4",
        textSecondary: "#86a89a",
        border: "#1e3a32",
        success: "#34d399",
        warning: "#fbbf24",
      }
    : {
        isDark: false,
        primary: "#059669",
        background: "#F5F0E6",
        cardBackground: "#FFFCF7",
        textPrimary: "#152921",
        textSecondary: "#5C7268",
        border: "#C9C0AE",
        success: "#059669",
        warning: "#D97706",
      };
}

function sectionBase(overrides) {
  return {
    summary: "",
    deepLink: "munib-tracker://tracker",
    lockScreenLine: overrides.title ?? "",
    lockScreenDetail: "",
    ctaLabel: "Open",
    ...overrides,
  };
}

/** Full schedule with next Salah + today's rows (primary store shot). */
export function buildScheduleSnapshot() {
  return {
    version: 1,
    updatedAt: nowIso(),
    updatedAgoLabel: "Just now",
    locationDenied: false,
    theme: baseTheme(true),
    nextPrayer: {
      ...sectionBase({
        title: "Next Salah",
        lockScreenLine: "Asr",
        lockScreenDetail: "in 42 min",
        ctaLabel: "Mark",
      }),
      prayerId: "asr",
      prayerName: "Asr",
      prayerTime: "4:18 PM",
      countdownLabel: "42 min",
      minutesUntil: 42,
      displayDate: "Today",
      location: "Makkah",
    },
    schedule: {
      ...sectionBase({
        title: "Today",
        summary: "3 of 5",
        lockScreenLine: "3/5",
        lockScreenDetail: "Fajr · Dhuhr · Asr next",
      }),
      rows: [
        { id: "fajr", name: "Fajr", time: "5:12 AM", status: "completed" },
        { id: "dhuhr", name: "Dhuhr", time: "12:24 PM", status: "completed" },
        { id: "asr", name: "Asr", time: "4:18 PM", status: "active" },
        { id: "maghrib", name: "Maghrib", time: "6:51 PM", status: "pending" },
        { id: "isha", name: "Isha", time: "8:21 PM", status: "pending" },
      ],
    },
    progress: {
      ...sectionBase({
        title: "Progress",
        summary: "3/5",
        lockScreenLine: "3/5",
      }),
      progressLabel: "3/5",
      progressPercent: 0.6,
      completed: 3,
      total: 5,
    },
  };
}

/** Location-denied empty state (second store shot). */
export function buildLocationDeniedSnapshot() {
  return {
    version: 1,
    updatedAt: nowIso(),
    updatedAgoLabel: "Just now",
    locationDenied: true,
    theme: baseTheme(true),
    nextPrayer: {
      ...sectionBase({
        title: "Next Salah",
        summary: "Set location on iPhone",
        lockScreenLine: "Location needed",
        lockScreenDetail: "Open Munib on iPhone",
      }),
      prayerId: "",
      prayerName: "—",
      prayerTime: "—",
      countdownLabel: "—",
      minutesUntil: 0,
      displayDate: "",
      location: "",
    },
    schedule: {
      ...sectionBase({
        title: "Today",
        summary: "Set location on iPhone",
      }),
      rows: [],
    },
    progress: {
      ...sectionBase({
        title: "Progress",
        summary: "0/5",
      }),
      progressLabel: "0/5",
      progressPercent: 0,
      completed: 0,
      total: 5,
    },
  };
}

/** Morning progress — Fajr done, Dhuhr next. */
export function buildMorningSnapshot() {
  return {
    version: 1,
    updatedAt: nowIso(),
    updatedAgoLabel: "Just now",
    locationDenied: false,
    theme: baseTheme(true),
    nextPrayer: {
      ...sectionBase({
        title: "Next Salah",
        lockScreenLine: "Dhuhr",
        lockScreenDetail: "in 1h 12m",
        ctaLabel: "Mark",
      }),
      prayerId: "dhuhr",
      prayerName: "Dhuhr",
      prayerTime: "12:24 PM",
      countdownLabel: "1h 12m",
      minutesUntil: 72,
      displayDate: "Today",
      location: "Makkah",
    },
    schedule: {
      ...sectionBase({
        title: "Today",
        summary: "1 of 5",
      }),
      rows: [
        { id: "fajr", name: "Fajr", time: "5:12 AM", status: "completed" },
        { id: "dhuhr", name: "Dhuhr", time: "12:24 PM", status: "active" },
        { id: "asr", name: "Asr", time: "4:18 PM", status: "pending" },
        { id: "maghrib", name: "Maghrib", time: "6:51 PM", status: "pending" },
        { id: "isha", name: "Isha", time: "8:21 PM", status: "pending" },
      ],
    },
    progress: {
      ...sectionBase({ title: "Progress", summary: "1/5" }),
      progressLabel: "1/5",
      progressPercent: 0.2,
      completed: 1,
      total: 5,
    },
  };
}

/** @type {WatchScene[]} */
export const WATCH_SCENES = [
  {
    id: "schedule",
    storeFile: "01-schedule.png",
    title: "Today's schedule + next Salah",
    buildSnapshot: buildScheduleSnapshot,
  },
  {
    id: "morning",
    storeFile: "02-morning.png",
    title: "Morning progress (Fajr done)",
    buildSnapshot: buildMorningSnapshot,
  },
  {
    id: "location-denied",
    storeFile: "03-location.png",
    title: "Location denied empty state",
    buildSnapshot: buildLocationDeniedSnapshot,
  },
];

export function filterWatchScenes(ids) {
  if (!ids?.length) return [...WATCH_SCENES];
  const set = new Set(ids);
  const matched = WATCH_SCENES.filter((s) => set.has(s.id));
  const unknown = ids.filter((id) => !WATCH_SCENES.some((s) => s.id === id));
  if (unknown.length) throw new Error(`Unknown watch SCENES: ${unknown.join(", ")}`);
  if (!matched.length) throw new Error("No watch scenes matched filters");
  return matched;
}
