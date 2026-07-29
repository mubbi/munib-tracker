/**
 * TV store-screenshot scenes (Apple TV / Android TV).
 *
 * Subset of phone scenes that work with D-pad / focus and avoid TV-degraded
 * features (live Qibla compass, verse detector, notifications, camera).
 *
 * Capture is prepared but not automated in CI — see capture-tvos.mjs /
 * capture-android-tv.mjs (require RUN_CAPTURE=1).
 */

/** Preferred landscape store size (1080p). Override via TV_CAPTURE_W / TV_CAPTURE_H. */
export const TV_STORE_SIZE = {
  w: Number(process.env.TV_CAPTURE_W || 1920),
  h: Number(process.env.TV_CAPTURE_H || 1080),
  label: "tv-1080p",
};

/**
 * @typedef {{
 *   id: string,
 *   storeFile: string,
 *   title: string,
 *   type: "tab" | "route",
 *   tab?: string,
 *   route?: string,
 *   group: string,
 *   settleMs?: number,
 * }} TvScene
 */

/** Marketing + QA scenes for living-room listings. */
export const TV_SCENES = /** @type {TvScene[]} */ ([
  {
    id: "home",
    storeFile: "01-home",
    title: "Home — next Salah + side rail",
    type: "tab",
    tab: "index",
    group: "tabs",
  },
  {
    id: "tracker",
    storeFile: "02-tracker",
    title: "Tracker — mark Salah",
    type: "tab",
    tab: "tracker",
    group: "tabs",
  },
  {
    id: "library",
    storeFile: "03-library",
    title: "Library hub",
    type: "tab",
    tab: "library",
    group: "tabs",
  },
  {
    id: "quran",
    storeFile: "04-quran",
    title: "Qur'an surah list",
    type: "route",
    route: "/quran",
    group: "content",
    settleMs: 2_000,
  },
  {
    id: "zikr",
    storeFile: "05-zikr",
    title: "Zikr categories",
    type: "route",
    route: "/zikr",
    group: "content",
  },
  {
    id: "settings",
    storeFile: "06-settings",
    title: "Settings rail",
    type: "tab",
    tab: "settings",
    group: "tabs",
  },
]);

/** App Store / Play / Amazon slide order → filename prefix. */
export const TV_SLIDE_SCENES = Object.fromEntries(
  TV_SCENES.map((s, i) => [String(i + 1).padStart(2, "0"), s.storeFile]),
);

/**
 * @param {string[] | null | undefined} sceneIds
 * @returns {TvScene[]}
 */
export function filterTvScenes(sceneIds) {
  if (!sceneIds?.length) return [...TV_SCENES];
  const set = new Set(sceneIds);
  const matched = TV_SCENES.filter((s) => set.has(s.id) || set.has(s.storeFile));
  if (!matched.length) {
    throw new Error(
      `No TV scenes matched SCENES=${sceneIds.join(",")}. Known: ${TV_SCENES.map((s) => s.id).join(", ")}`,
    );
  }
  return matched;
}

export function tvSceneCount() {
  return TV_SCENES.length;
}
