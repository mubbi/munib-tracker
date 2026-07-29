import { TIMING } from "./config.mjs";

/**
 * Screenshot scene catalog.
 *
 * type:
 * - route     — expo-router deep link
 * - tab       — bottom tab (uses tab id: home|tracker|library|settings)
 * - interact  — deep link + Maestro steps before capture
 *
 * keepOverlay: do not press back before screenshot (modals/sheets)
 */
export const SCENES = [
  // ── Tabs ──────────────────────────────────────────────────────────────────
  { id: "home", type: "tab", tab: "home", waitMs: TIMING.animationMs, group: "tabs" },
  { id: "tracker", type: "tab", tab: "tracker", waitMs: TIMING.animationMs, group: "tabs" },
  { id: "library", type: "tab", tab: "library", waitMs: TIMING.animationMs, group: "tabs" },
  { id: "settings", type: "tab", tab: "settings", waitMs: TIMING.animationMs, group: "tabs" },

  // ── Tracker / Qaza ────────────────────────────────────────────────────────
  { id: "schedule", type: "route", route: "/schedule", waitMs: TIMING.settleMs, group: "track" },
  { id: "qaza", type: "route", route: "/qaza", waitMs: TIMING.animationMs, group: "track" },
  {
    id: "qaza-planner",
    type: "route",
    route: "/qaza/planner",
    waitMs: TIMING.animationMs,
    group: "track",
  },
  {
    id: "qaza-calculator",
    type: "route",
    route: "/qaza/calculator",
    waitMs: TIMING.animationMs,
    group: "track",
  },
  {
    id: "tracker-status-sheet",
    type: "interact",
    route: "/tracker",
    waitMs: TIMING.modalMs,
    keepOverlay: true,
    group: "track",
    steps: [
      { action: "tapPrayerRow", prayer: "asr" },
      { action: "wait", ms: TIMING.modalMs },
    ],
  },
  {
    id: "statistics",
    type: "route",
    route: "/statistics",
    waitMs: TIMING.animationMs,
    group: "track",
  },
  {
    id: "achievements",
    type: "route",
    route: "/achievements",
    waitMs: TIMING.animationMs,
    group: "track",
  },
  { id: "ramadan", type: "route", route: "/ramadan", waitMs: TIMING.animationMs, group: "track" },
  { id: "tahajjud", type: "route", route: "/tahajjud", waitMs: TIMING.animationMs, group: "track" },
  { id: "journal", type: "route", route: "/journal", waitMs: TIMING.animationMs, group: "track" },
  {
    id: "tasbeeh",
    type: "route",
    route: "/tasbeeh/free",
    waitMs: TIMING.animationMs,
    group: "track",
  },

  // ── Read ──────────────────────────────────────────────────────────────────
  { id: "quran", type: "route", route: "/quran", waitMs: TIMING.heavyScreenMs, group: "read" },
  {
    id: "quran-surah",
    type: "route",
    route: "/quran/2",
    waitMs: TIMING.heavyScreenMs,
    group: "read",
  },
  {
    id: "quran-search",
    type: "route",
    route: "/quran/search",
    waitMs: TIMING.heavyScreenMs,
    group: "read",
  },
  {
    id: "quran-pages",
    type: "route",
    route: "/quran/pages",
    waitMs: TIMING.heavyScreenMs,
    group: "read",
  },
  { id: "hadith", type: "route", route: "/hadith", waitMs: TIMING.animationMs, group: "read" },
  {
    id: "hadith-collection",
    type: "route",
    route: "/hadith/nawawi40",
    waitMs: TIMING.heavyScreenMs,
    group: "read",
  },
  {
    id: "bookmarks",
    type: "route",
    route: "/bookmarks",
    waitMs: TIMING.animationMs,
    group: "read",
  },

  // ── Supplicate ────────────────────────────────────────────────────────────
  { id: "dua", type: "route", route: "/dua", waitMs: TIMING.animationMs, group: "supplicate" },
  {
    id: "dua-category",
    type: "route",
    route: "/dua/morning_evening",
    waitMs: TIMING.animationMs,
    group: "supplicate",
  },
  { id: "zikr", type: "route", route: "/zikr", waitMs: TIMING.animationMs, group: "supplicate" },
  {
    id: "zikr-category",
    type: "route",
    route: "/zikr/morning",
    waitMs: TIMING.animationMs,
    group: "supplicate",
  },
  {
    id: "duroods",
    type: "route",
    route: "/duroods",
    waitMs: TIMING.animationMs,
    group: "supplicate",
  },
  {
    id: "names-of-allah",
    type: "route",
    route: "/names-of-allah",
    waitMs: TIMING.animationMs,
    group: "supplicate",
  },
  {
    id: "adhkar-builder",
    type: "route",
    route: "/adhkar-builder",
    waitMs: TIMING.animationMs,
    group: "supplicate",
  },

  // ── Learn ─────────────────────────────────────────────────────────────────
  {
    id: "salah-guide",
    type: "route",
    route: "/salah-guide",
    waitMs: TIMING.animationMs,
    group: "learn",
  },
  { id: "jannah", type: "route", route: "/jannah", waitMs: TIMING.animationMs, group: "learn" },
  { id: "last-day", type: "route", route: "/last-day", waitMs: TIMING.animationMs, group: "learn" },
  { id: "jahannam", type: "route", route: "/jahannam", waitMs: TIMING.animationMs, group: "learn" },
  { id: "battles", type: "route", route: "/battles", waitMs: TIMING.animationMs, group: "learn" },
  {
    id: "learn-quran",
    type: "route",
    route: "/learn-quran",
    waitMs: TIMING.animationMs,
    group: "learn",
  },
  { id: "taharah", type: "route", route: "/taharah", waitMs: TIMING.animationMs, group: "learn" },
  { id: "prophets", type: "route", route: "/prophets", waitMs: TIMING.animationMs, group: "learn" },
  { id: "aqeedah", type: "route", route: "/aqeedah", waitMs: TIMING.animationMs, group: "learn" },
  {
    id: "learn-dua",
    type: "route",
    route: "/learn-dua",
    waitMs: TIMING.animationMs,
    group: "learn",
  },
  { id: "travel", type: "route", route: "/travel", waitMs: TIMING.animationMs, group: "learn" },
  { id: "hajj", type: "route", route: "/hajj", waitMs: TIMING.animationMs, group: "learn" },
  { id: "seerah", type: "route", route: "/seerah", waitMs: TIMING.animationMs, group: "learn" },
  { id: "events", type: "route", route: "/events", waitMs: TIMING.animationMs, group: "learn" },

  // ── More ──────────────────────────────────────────────────────────────────
  { id: "calendar", type: "route", route: "/calendar", waitMs: TIMING.animationMs, group: "more" },
  { id: "qibla", type: "route", route: "/qibla", waitMs: TIMING.heavyScreenMs, group: "more" },
  { id: "zakat", type: "route", route: "/zakat", waitMs: TIMING.animationMs, group: "more" },
  { id: "search", type: "route", route: "/search", waitMs: TIMING.animationMs, group: "more" },
  { id: "profile", type: "route", route: "/profile", waitMs: TIMING.animationMs, group: "more" },

  // ── Settings stack ────────────────────────────────────────────────────────
  {
    id: "settings-appearance",
    type: "route",
    route: "/settings/appearance",
    waitMs: TIMING.animationMs,
    group: "settings",
  },
  {
    id: "settings-language",
    type: "route",
    route: "/settings/language",
    waitMs: TIMING.animationMs,
    group: "settings",
  },
  {
    id: "settings-notifications",
    type: "route",
    route: "/settings/notifications",
    waitMs: TIMING.animationMs,
    group: "settings",
  },
  {
    id: "settings-backup",
    type: "route",
    route: "/settings/backup",
    waitMs: TIMING.animationMs,
    group: "settings",
  },
  {
    id: "settings-offline-data",
    type: "route",
    route: "/settings/offline-data",
    waitMs: TIMING.animationMs,
    group: "settings",
  },
];

export function getSceneById(id) {
  const scene = SCENES.find((s) => s.id === id);
  if (!scene) throw new Error(`Unknown scene id: ${id}`);
  return scene;
}

export function filterScenes({ scenesFilter, groupsFilter }) {
  let list = SCENES;
  if (groupsFilter?.length) {
    const set = new Set(groupsFilter);
    list = list.filter((s) => set.has(s.group));
  }
  if (scenesFilter?.length) {
    const set = new Set(scenesFilter);
    list = list.filter((s) => set.has(s.id));
  }
  return list;
}

export function sceneCount() {
  return SCENES.length;
}
