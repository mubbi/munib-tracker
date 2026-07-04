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

/** Inserts group boundaries while preserving chronological order within each group. */
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

export function kindBadgeKey(kind: ScheduleKind): string | null {
  if (kind === "obligatory") return "home.scheduleObligatory";
  if (kind === "optional") return "home.scheduleOptional";
  return null;
}
