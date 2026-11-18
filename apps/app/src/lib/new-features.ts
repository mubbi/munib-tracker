/**
 * "New" feature highlights. A feature listed here gets a "New" badge on its home
 * Explore tile and its Library row for {@link NEW_BADGE_DAYS} days, counted from
 * the first time this device shows it to the person (not from the release date),
 * so everyone gets the same 15-day window whenever they update.
 *
 * `homeAnchor`: when set, the feature's tile is added once to a person's
 * customised home grid, right after that anchor id (people on the default order
 * already get it from `DEFAULT_QUICK_ACTION_ORDER`). If they remove it later it
 * stays removed.
 */
export const NEW_BADGE_DAYS = 15;

export type NewFeatureDef = {
  /** Quick-action / library id the badge attaches to. */
  id: string;
  /** Insert into a customised home grid after this quick-action id (once). */
  homeAnchor?: string;
};

export const NEW_FEATURES: readonly NewFeatureDef[] = [
  { id: "quranPractice", homeAnchor: "quran" },
];

export type NewFeatureSeen = {
  /** ISO time the badge window started on this device. */
  firstSeenAt: string;
  /** True once the tile was added to (or checked against) a customised home order. */
  homeIntroduced?: boolean;
};

export type NewFeaturesSeenMap = Record<string, NewFeatureSeen>;

const DAY_MS = 24 * 60 * 60 * 1000;

/** True while `now` is within the badge window that started at `firstSeenAt`. */
export function isWithinNewWindow(
  firstSeenAt: string | undefined,
  now: Date,
  days = NEW_BADGE_DAYS,
): boolean {
  if (!firstSeenAt) return true; // not stamped yet → this is the first sighting
  const start = Date.parse(firstSeenAt);
  if (!Number.isFinite(start)) return false;
  return now.getTime() - start < days * DAY_MS;
}

/** Stamp a first-seen time for every registered feature that has none. Pure. */
export function stampFirstSeen(seen: NewFeaturesSeenMap, now: Date): NewFeaturesSeenMap {
  let changed = false;
  const next: NewFeaturesSeenMap = { ...seen };
  for (const feature of NEW_FEATURES) {
    if (!next[feature.id]?.firstSeenAt) {
      next[feature.id] = { ...next[feature.id], firstSeenAt: now.toISOString() };
      changed = true;
    }
  }
  return changed ? next : seen;
}

/**
 * Insert not-yet-introduced features into a customised home order, after their
 * anchor (or at the front when the anchor is absent). Returns `null` when nothing
 * changes. A default (unset) order needs no change — the defaults include them.
 */
export function introduceToHomeOrder(
  order: readonly string[] | undefined,
  seen: NewFeaturesSeenMap,
): { order: string[] | null; seen: NewFeaturesSeenMap } {
  let nextSeen = seen;
  if (!order?.length) {
    // Default order already contains them; remember so a later customisation is respected.
    for (const feature of NEW_FEATURES) {
      if (feature.homeAnchor && !nextSeen[feature.id]?.homeIntroduced) {
        nextSeen = {
          ...nextSeen,
          [feature.id]: { ...nextSeen[feature.id], homeIntroduced: true } as NewFeatureSeen,
        };
      }
    }
    return { order: null, seen: nextSeen };
  }
  const nextOrder = [...order];
  let changed = false;
  for (const feature of NEW_FEATURES) {
    if (!feature.homeAnchor || nextSeen[feature.id]?.homeIntroduced) continue;
    if (!nextOrder.includes(feature.id)) {
      const anchorIndex = nextOrder.indexOf(feature.homeAnchor);
      nextOrder.splice(anchorIndex >= 0 ? anchorIndex + 1 : 0, 0, feature.id);
      changed = true;
    }
    nextSeen = {
      ...nextSeen,
      [feature.id]: { ...nextSeen[feature.id], homeIntroduced: true } as NewFeatureSeen,
    };
  }
  return { order: changed ? nextOrder : null, seen: nextSeen };
}
