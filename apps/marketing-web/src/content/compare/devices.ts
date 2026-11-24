import type { CompareCell, ComparePage } from "@/content/types";
import { cell } from "./shared";

/**
 * Device and platform support, compared row by row.
 *
 * Munib Tracker's values follow docs/DEVICES.md, docs/NATIVE_SURFACES.md and
 * docs/TV.md: the watch and Wear OS surfaces are companions tied to the phone
 * app, so they are `partial`. Competitor cells come only from official
 * listings (App Store "Compatibility", Google Play, the developer's site) and
 * default to `unverified` when a source doesn't say.
 */
export const DEVICE_ROWS = [
  { key: "web", feature: "Web app (any browser)" },
  { key: "pwa", feature: "Installable web app (PWA)" },
  { key: "ios", feature: "iPhone and iPad" },
  { key: "android", feature: "Android phones and tablets" },
  { key: "appleWatch", feature: "Apple Watch" },
  { key: "wearOs", feature: "Wear OS" },
  { key: "appleTv", feature: "Apple TV" },
  { key: "androidTv", feature: "Android TV" },
  { key: "widgets", feature: "Home-screen widgets" },
  { key: "liveActivities", feature: "Live Activities / Live Updates" },
] as const;

export type DeviceKey = (typeof DEVICE_ROWS)[number]["key"];

export const MUNIB_DEVICES: Readonly<Record<DeviceKey, CompareCell>> = {
  web: cell.yes("Full app in any modern browser"),
  pwa: cell.yes("Installs from the browser and works offline"),
  ios: cell.yes("iPhone and iPad, with wide-screen layouts"),
  android: cell.yes("Phones, tablets and foldables"),
  appleWatch: cell.partial(
    "Companion: today's schedule, mark Salah, tasbeeh and complications; needs the iPhone app",
  ),
  wearOs: cell.partial("Tiles: next Salah (marks it on the phone) and a tasbeeh counter"),
  appleTv: cell.yes("Full app with remote navigation; phone-only features are hidden"),
  androidTv: cell.yes("Full app, incl. Fire TV; phone-only features are hidden"),
  widgets: cell.yes("Home and lock screen on iPhone; home screen on Android"),
  liveActivities: cell.yes("iPhone Live Activities and Android Live Updates"),
};

/** App Store "Compatibility" lists no such device. */
export const NOT_ON_APP_STORE = cell.no("Not on its App Store listing");

type Row = ComparePage["table"][number]["rows"][number];

/**
 * A "Devices and platforms" table group. Pass each competitor's verified
 * cells by app id; anything left out renders as "Not verified". `extraRows`
 * keeps page-specific rows (e.g. voice shortcuts) in the same group.
 */
export function devicesGroup(
  competitors: Readonly<Record<string, Partial<Record<DeviceKey, CompareCell>>>>,
  extraRows: readonly Row[] = [],
): ComparePage["table"][number] {
  return {
    group: "Devices and platforms",
    rows: [
      ...DEVICE_ROWS.map(({ key, feature }) => ({
        feature,
        cells: {
          munib: MUNIB_DEVICES[key],
          ...Object.fromEntries(
            Object.entries(competitors).map(([id, cells]) => [id, cells[key] ?? cell.unverified()]),
          ),
        },
      })),
      ...extraRows,
    ],
  };
}
