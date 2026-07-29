import type { SymbolViewProps } from "expo-symbols";

import type { DailyScheduleEntryId, ScheduleKind } from "@/lib/prayer-times";
import { PRAYER_SLOT_ICONS } from "@/lib/prayer-times";
import { PRAYER_ICONS } from "@/lib/prayer-ui";

export type ScheduleGroupId = "night" | "morning" | "day" | "evening" | "flexible";

export type ScheduleEntryStatus = "past" | "active" | "upcoming" | "flexible";

const GROUP_ORDER: ScheduleGroupId[] = ["night", "morning", "day", "evening", "flexible"];

export const SCHEDULE_GROUP_LABEL_KEY: Record<ScheduleGroupId, string> = {
  night: "home.scheduleGroupNight",
  morning: "home.scheduleGroupMorning",
  day: "home.scheduleGroupDay",
  evening: "home.scheduleGroupEvening",
  flexible: "home.scheduleGroupFlexible",
};

const ENTRY_GROUP: Record<DailyScheduleEntryId, ScheduleGroupId> = {
  tahajjud: "night",
  fajr: "night",
  sunrise: "night",
  ishraq: "morning",
  duha: "morning",
  dhuhr: "day",
  asr: "day",
  maghrib: "evening",
  isha: "evening",
  witr: "evening",
  tahiyyatul_masjid: "flexible",
  hajat_istikhara: "flexible",
};

export function scheduleGroupFor(id: DailyScheduleEntryId): ScheduleGroupId {
  return ENTRY_GROUP[id];
}

export function scheduleEntryIcon(id: DailyScheduleEntryId): SymbolViewProps["name"] {
  if (id in PRAYER_ICONS) return PRAYER_ICONS[id as keyof typeof PRAYER_ICONS];
  if (id in PRAYER_SLOT_ICONS) return PRAYER_SLOT_ICONS[id as keyof typeof PRAYER_SLOT_ICONS];
  return { ios: "clock.fill", android: "schedule", web: "schedule" };
}

export function scheduleEntryStatus(
  kind: ScheduleKind,
  active: boolean,
  at: Date | undefined,
  now: Date,
): ScheduleEntryStatus {
  if (kind !== "marker" && !at) return "flexible";
  if (active) return "active";
  if (at && at.getTime() <= now.getTime()) return "past";
  return "upcoming";
}

export type GroupedScheduleItem<T extends { id: string; group: ScheduleGroupId }> = {
  group: ScheduleGroupId;
  items: T[];
};

/** Groups by time-of-day section while preserving the input order (for timelines). */
export function groupScheduleItemsInOrder<T extends { id: string }>(
  items: T[],
  groupFor: (id: string) => ScheduleGroupId,
): GroupedScheduleItem<T & { group: ScheduleGroupId }>[] {
  const groups: GroupedScheduleItem<T & { group: ScheduleGroupId }>[] = [];
  let currentGroup: ScheduleGroupId | null = null;
  let batch: (T & { group: ScheduleGroupId })[] = [];

  for (const item of items) {
    const group = groupFor(item.id);
    const withGroup = { ...item, group };
    if (group !== currentGroup) {
      if (batch.length > 0 && currentGroup) {
        groups.push({ group: currentGroup, items: batch });
      }
      currentGroup = group;
      batch = [withGroup];
    } else {
      batch.push(withGroup);
    }
  }

  if (batch.length > 0 && currentGroup) {
    groups.push({ group: currentGroup, items: batch });
  }

  return groups;
}

/** Inserts group boundaries sorted by canonical section order (settings-style lists). */
export function groupScheduleItems<T extends { id: string }>(
  items: T[],
  groupFor: (id: string) => ScheduleGroupId,
): GroupedScheduleItem<T & { group: ScheduleGroupId }>[] {
  const withGroup = items.map((item) => ({
    ...item,
    group: groupFor(item.id),
  }));

  return GROUP_ORDER.flatMap((group) => {
    const groupItems = withGroup.filter((item) => item.group === group);
    return groupItems.length > 0 ? [{ group, items: groupItems }] : [];
  });
}

export function sortTimedScheduleItems<
  T extends { atMs: number | null; status: ScheduleEntryStatus },
>(items: T[]): T[] {
  return [...items]
    .filter((item) => item.status !== "flexible")
    .sort((a, b) => {
      if (a.atMs == null && b.atMs == null) return 0;
      if (a.atMs == null) return 1;
      if (b.atMs == null) return -1;
      return a.atMs - b.atMs;
    });
}

export function kindBadgeKey(kind: ScheduleKind): string | null {
  if (kind === "obligatory") return "home.scheduleObligatory";
  if (kind === "optional") return "home.scheduleOptional";
  return null;
}

export type ScheduleFocusItem = {
  id: string;
  status: ScheduleEntryStatus;
  active: boolean;
  atMs: number | null;
};

export type ScheduleFocusWindow<T extends ScheduleFocusItem> = {
  /** Anchor window: last past (optional), all active, next, and a few upcoming. */
  focus: T[];
  hiddenPast: T[];
  hiddenFuture: T[];
  flexible: T[];
};

const DEFAULT_UPCOMING_AFTER_NEXT = 2;

/**
 * Splits a chronological schedule into a compact home focus window plus collapsible
 * past/future slices. Flexible entries are always returned separately for display.
 */
export function computeScheduleFocusWindow<T extends ScheduleFocusItem>(
  items: T[],
  nextScheduleId: string | null,
  options?: { maxUpcomingAfterNext?: number; includeLastPast?: boolean },
): ScheduleFocusWindow<T> {
  const maxUpcoming = options?.maxUpcomingAfterNext ?? DEFAULT_UPCOMING_AFTER_NEXT;
  const includeLastPast = options?.includeLastPast ?? true;

  const flexible = items.filter((item) => item.status === "flexible");
  const timed = sortTimedScheduleItems(items);
  const focusIds = new Set<string>();

  const past = timed.filter((item) => item.status === "past");
  const lastPast = past.at(-1);
  if (includeLastPast && lastPast) {
    focusIds.add(lastPast.id);
  }

  for (const item of timed) {
    if (item.active || item.status === "active") {
      focusIds.add(item.id);
    }
  }

  const nextItem =
    nextScheduleId !== null ? timed.find((item) => item.id === nextScheduleId) : undefined;

  if (nextItem) {
    focusIds.add(nextItem.id);
    const nextAt = nextItem.atMs ?? Number.NEGATIVE_INFINITY;
    const upcomingAfterNext = timed
      .filter(
        (item) =>
          item.status === "upcoming" &&
          item.id !== nextItem.id &&
          item.atMs != null &&
          item.atMs > nextAt,
      )
      .slice(0, maxUpcoming);
    for (const item of upcomingAfterNext) {
      focusIds.add(item.id);
    }
  } else {
    let added = 0;
    const maxLeading = maxUpcoming + 1;
    for (const item of timed) {
      if (item.status !== "upcoming") continue;
      focusIds.add(item.id);
      added++;
      if (added >= maxLeading) break;
    }
  }

  return {
    focus: timed.filter((item) => focusIds.has(item.id)),
    hiddenPast: past.filter((item) => !focusIds.has(item.id)),
    hiddenFuture: timed.filter((item) => item.status === "upcoming" && !focusIds.has(item.id)),
    flexible,
  };
}

export type ScheduleTimelineSegment<T extends ScheduleFocusItem> =
  | { type: "collapse-past"; count: number }
  | { type: "collapse-future"; count: number }
  | { type: "item"; item: T };

/** Builds a single time-ordered timeline with collapse placeholders inserted once. */
export function buildScheduleTimelineSegments<T extends ScheduleFocusItem>(
  items: T[],
  window: ScheduleFocusWindow<T>,
  options: { pastExpanded: boolean; futureExpanded: boolean },
): ScheduleTimelineSegment<T>[] {
  const timed = sortTimedScheduleItems(items);
  const hiddenPastIds = new Set(window.hiddenPast.map((item) => item.id));
  const hiddenFutureIds = new Set(window.hiddenFuture.map((item) => item.id));
  const segments: ScheduleTimelineSegment<T>[] = [];
  let pastBarAdded = false;
  let futureBarAdded = false;

  for (const item of timed) {
    if (hiddenPastIds.has(item.id)) {
      if (!pastBarAdded) {
        segments.push({ type: "collapse-past", count: window.hiddenPast.length });
        pastBarAdded = true;
      }
      if (options.pastExpanded) {
        segments.push({ type: "item", item });
      }
      continue;
    }

    if (hiddenFutureIds.has(item.id)) {
      if (!futureBarAdded) {
        segments.push({ type: "collapse-future", count: window.hiddenFuture.length });
        futureBarAdded = true;
      }
      if (options.futureExpanded) {
        segments.push({ type: "item", item });
      }
      continue;
    }

    segments.push({ type: "item", item });
  }

  return segments;
}
