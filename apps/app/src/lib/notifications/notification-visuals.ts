import type { PrayerId } from "@munib-tracker/shared/types";
import type { SymbolViewProps } from "expo-symbols";

import type { InAppNotificationKind } from "@/lib/in-app-notifications/storage";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import { ZIKR_CATEGORY_ICONS } from "@/lib/zikr-ui";

type SymbolName = SymbolViewProps["name"];

export type NotificationCategory =
  | "salah"
  | "zikr"
  | "qaza"
  | "milestone"
  | "system"
  | "announcement";

export type NotificationVisualSpec = {
  icon: SymbolName;
  category: NotificationCategory;
};

const PRAYER_IDS = new Set<string>(Object.keys(PRAYER_ICONS));

const DAILY_REMINDER_ICONS = {
  morningZikr: ZIKR_CATEGORY_ICONS.morning,
  eveningZikr: ZIKR_CATEGORY_ICONS.evening,
  beforeSleep: ZIKR_CATEGORY_ICONS.before_sleep,
  qaza: {
    ios: "arrow.clockwise.circle.fill",
    android: "history",
    web: "history",
  } satisfies SymbolName,
  friday: {
    ios: "book.fill",
    android: "menu_book",
    web: "menu_book",
  } satisfies SymbolName,
  dailyContent: {
    ios: "sparkles",
    android: "auto_awesome",
    web: "auto_awesome",
  } satisfies SymbolName,
} as const;

type DailyReminderId = keyof typeof DAILY_REMINDER_ICONS;

type ParsedReminder =
  | { kind: "prayer"; prayerId: PrayerId }
  | { kind: "afterAzan"; prayerId: PrayerId }
  | { kind: "beforePrayer"; prayerId: PrayerId }
  | { kind: "afterPrayer"; prayerId: PrayerId }
  | { kind: "daily"; id: DailyReminderId };

const DATE_SUFFIX = /^\d{4}-\d{2}-\d{2}$/;

function parseDailyReminderId(prefix: string): DailyReminderId | null {
  return prefix in DAILY_REMINDER_ICONS ? (prefix as DailyReminderId) : null;
}

function parsePrayerSlot(slot: string): PrayerId | null {
  return PRAYER_IDS.has(slot) ? (slot as PrayerId) : null;
}

/** Parses stable reminder ids such as `prayer:fajr:2026-07-04` or `beforeSleep:2026-07-06`. */
export function parseReminderKey(key: string): ParsedReminder | null {
  const exactDaily = parseDailyReminderId(key);
  if (exactDaily) {
    return { kind: "daily", id: exactDaily };
  }

  const [head, second, ...rest] = key.split(":");
  const dailyId = parseDailyReminderId(head);
  if (dailyId && second && DATE_SUFFIX.test(second) && rest.length === 0) {
    return { kind: "daily", id: dailyId };
  }

  const prayerId = second ? parsePrayerSlot(second) : null;
  if (!prayerId) return null;

  switch (head) {
    case "prayer":
      return { kind: "prayer", prayerId };
    case "afterAzan":
      return { kind: "afterAzan", prayerId };
    case "beforePrayer":
      return { kind: "beforePrayer", prayerId };
    case "afterPrayer":
      return { kind: "afterPrayer", prayerId };
    default:
      return null;
  }
}

export function extractReminderKey(rowId: string, inboxId?: string): string | undefined {
  if (inboxId?.startsWith("os-")) return inboxId.slice(3);
  if (inboxId?.startsWith("web-")) return inboxId.slice(4);
  if (rowId.startsWith("scheduled:")) return rowId.slice("scheduled:".length);
  return undefined;
}

export function resolveNotificationVisual(input: {
  kind?: InAppNotificationKind;
  reminderKey?: string;
}): NotificationVisualSpec {
  if (input.kind === "achievement") {
    return {
      icon: { ios: "trophy.fill", android: "emoji_events", web: "emoji_events" },
      category: "milestone",
    };
  }

  if (input.kind === "admin_announcement") {
    return {
      icon: { ios: "megaphone.fill", android: "campaign", web: "campaign" },
      category: "announcement",
    };
  }

  if (input.kind === "system") {
    return {
      icon: { ios: "info.circle.fill", android: "info", web: "info" },
      category: "system",
    };
  }

  const parsed = input.reminderKey ? parseReminderKey(input.reminderKey) : null;
  if (parsed) {
    switch (parsed.kind) {
      case "prayer":
        return { icon: PRAYER_ICONS[parsed.prayerId], category: "salah" };
      case "afterAzan":
        return { icon: ZIKR_CATEGORY_ICONS.after_azan, category: "zikr" };
      case "beforePrayer":
        return { icon: ZIKR_CATEGORY_ICONS.before_prayer, category: "zikr" };
      case "afterPrayer":
        return { icon: ZIKR_CATEGORY_ICONS.after_prayer, category: "zikr" };
      case "daily":
        return {
          icon: DAILY_REMINDER_ICONS[parsed.id],
          category: parsed.id === "qaza" ? "qaza" : "zikr",
        };
    }
  }

  return {
    icon: { ios: "bell.fill", android: "notifications", web: "notifications" },
    category: "system",
  };
}
