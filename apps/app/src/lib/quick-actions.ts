import { type AppIcon, NAMES_OF_ALLAH_ICON } from "./names-of-allah-ui";

/** Semantic tone → theme token, resolved by consumers against `tokens.status` / accent. */
export type QuickActionTone = "success" | "info" | "danger" | "warning" | "accent";

/**
 * Metadata for every home quick action (NF-1.23). Kept separate from the home
 * screen's behavioral array (which owns `onPress`) so the customization screen
 * can list, toggle, and reorder actions by id. The two stay aligned on ids.
 */
export interface QuickActionDef {
  id: string;
  labelKey: string;
  icon: AppIcon;
  tone: QuickActionTone;
}

export const QUICK_ACTION_META: QuickActionDef[] = [
  {
    id: "checklist",
    labelKey: "actions.checklist",
    icon: { ios: "checklist", android: "checklist", web: "checklist" },
    tone: "success",
  },
  {
    id: "salahGuide",
    labelKey: "actions.salahGuide",
    icon: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
    tone: "info",
  },
  {
    id: "schedule",
    labelKey: "home.scheduleTitle",
    icon: { ios: "clock.fill", android: "schedule", web: "schedule" },
    tone: "info",
  },
  {
    id: "zikr",
    labelKey: "actions.zikr",
    icon: { ios: "heart.fill", android: "favorite", web: "favorite" },
    tone: "danger",
  },
  {
    id: "tasbeeh",
    labelKey: "actions.tasbeeh",
    icon: { ios: "hand.tap.fill", android: "touch_app", web: "touch_app" },
    tone: "accent",
  },
  {
    id: "ramadan",
    labelKey: "actions.ramadan",
    icon: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
    tone: "info",
  },
  {
    id: "qaza",
    labelKey: "actions.qaza",
    icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
    tone: "warning",
  },
  {
    id: "quran",
    labelKey: "actions.quran",
    icon: { ios: "book.fill", android: "menu_book", web: "menu_book" },
    tone: "accent",
  },
  {
    id: "hadith",
    labelKey: "actions.hadith",
    icon: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
    tone: "info",
  },
  {
    id: "bookmarks",
    labelKey: "actions.bookmarks",
    icon: { ios: "bookmark.fill", android: "bookmark", web: "bookmark" },
    tone: "warning",
  },
  {
    id: "duas",
    labelKey: "actions.duas",
    icon: {
      ios: "hands.and.sparkles.fill",
      android: "volunteer_activism",
      web: "volunteer_activism",
    },
    tone: "danger",
  },
  {
    id: "duroods",
    labelKey: "actions.duroods",
    icon: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" },
    tone: "danger",
  },
  {
    id: "names",
    labelKey: "actions.names",
    icon: NAMES_OF_ALLAH_ICON,
    tone: "accent",
  },
  {
    id: "qibla",
    labelKey: "actions.qibla",
    icon: { ios: "location.north.line.fill", android: "explore", web: "explore" },
    tone: "info",
  },
  {
    id: "calendar",
    labelKey: "actions.calendar",
    icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
    tone: "warning",
  },
  {
    id: "events",
    labelKey: "actions.events",
    icon: { ios: "star.circle.fill", android: "event", web: "event" },
    tone: "warning",
  },
  {
    id: "zakat",
    labelKey: "actions.zakat",
    icon: { ios: "banknote.fill", android: "payments", web: "payments" },
    tone: "success",
  },
  {
    id: "jannah",
    labelKey: "actions.jannah",
    icon: { ios: "leaf.fill", android: "park", web: "park" },
    tone: "success",
  },
  {
    id: "achievements",
    labelKey: "settings.achievements",
    icon: { ios: "trophy.fill", android: "emoji_events", web: "emoji_events" },
    tone: "warning",
  },
  {
    id: "stats",
    labelKey: "actions.stats",
    icon: { ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" },
    tone: "success",
  },
];

/** Orders a behavioral action list by a saved id order, dropping unknown/removed ids. */
export function orderQuickActions<T extends { id: string }>(all: T[], order: string[]): T[] {
  const byId = new Map(all.map((item) => [item.id, item]));
  const result: T[] = [];
  for (const id of order) {
    const item = byId.get(id);
    if (item) result.push(item);
  }
  return result;
}
