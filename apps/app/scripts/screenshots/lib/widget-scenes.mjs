/**
 * Home-screen widget store-screenshot scenes.
 *
 * Phone widget chrome is native (WidgetKit / App Widgets). Capture is manual or
 * via platform screenshot tools after seeding `widget_snapshot_v1` — Maestro
 * cannot open the iOS/Android widget gallery reliably. These builders supply
 * the same demo payloads used for Watch screenshots so store marketing stays
 * consistent.
 *
 * See docs/STORE_ASSETS.md → "Home-screen widgets".
 */

import { buildLocationDeniedSnapshot, buildScheduleSnapshot } from "./watch-scenes.mjs";

/**
 * @typedef {{
 *   id: string,
 *   title: string,
 *   note: string,
 *   buildSnapshot: () => object,
 * }} WidgetStoreScene
 */

/** @type {WidgetStoreScene[]} */
export const WIDGET_STORE_SCENES = [
  {
    id: "widget-next-schedule",
    title: "Next Salah + schedule",
    note: "Place Next Salah (medium) and Schedule (large) on a clean home screen, then capture.",
    buildSnapshot: () => {
      const snap = buildScheduleSnapshot();
      return {
        ...snap,
        theme: { ...snap.theme, followsSystem: true },
        nextPrayer: {
          ...snap.nextPrayer,
          followingName: "Maghrib",
          followingTime: "6:51 PM",
          markLabel: "Mark Salah",
          accessibilityLabel: "Asr, 4:18 PM, in 42 minutes",
          targetTimeMs: Date.now() + 42 * 60_000,
        },
        schedule: {
          ...snap.schedule,
          rows: (snap.schedule.rows ?? []).map((row) => ({
            ...row,
            statusLabel:
              row.status === "completed" ? "Done" : row.status === "active" ? "Next" : "Pending",
          })),
          accessibilityLabel: "Today's schedule, Asr next at 4:18 PM",
        },
        progress: {
          ...snap.progress,
          markLabel: "Mark Salah",
          accessibilityLabel: "Today's progress, 3 of 5",
        },
      };
    },
  },
  {
    id: "widget-location-denied",
    title: "Location denied (independent sections)",
    note: "Streak / hadith / Hijri remain filled; next/qibla show set-location CTA.",
    buildSnapshot: () => {
      const snap = buildLocationDeniedSnapshot();
      return { ...snap, theme: { ...snap.theme, followsSystem: false } };
    },
  },
];

export function filterWidgetStoreScenes(ids) {
  if (!ids?.length) return WIDGET_STORE_SCENES;
  const set = new Set(ids);
  const matched = WIDGET_STORE_SCENES.filter((s) => set.has(s.id));
  if (!matched.length) throw new Error("No widget store scenes matched filters");
  return matched;
}
