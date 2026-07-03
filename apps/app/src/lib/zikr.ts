import { ZIKR_CATEGORY_IDS, ZIKR_CATEGORY_LABELS } from "@munib-tracker/shared/constants";
import { ZIKR_ITEMS } from "@munib-tracker/shared/content";
import type { ZikrCategoryId, ZikrItem } from "@munib-tracker/shared/types";
import type { SymbolViewProps } from "expo-symbols";

type SymbolName = SymbolViewProps["name"];

export const ZIKR_CATEGORY_ICONS: Record<ZikrCategoryId, SymbolName> = {
  morning: { ios: "sunrise.fill", android: "wb_twilight", web: "wb_twilight" },
  evening: { ios: "sunset.fill", android: "wb_twilight", web: "wb_twilight" },
  before_prayer: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  after_prayer: {
    ios: "hands.and.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
  after_azan: { ios: "megaphone.fill", android: "campaign", web: "campaign" },
  before_sleep: { ios: "moon.zzz.fill", android: "bedtime", web: "bedtime" },
  anytime: { ios: "infinity", android: "all_inclusive", web: "all_inclusive" },
};

export function zikrByCategory(categoryId: ZikrCategoryId): ZikrItem[] {
  return ZIKR_ITEMS.filter((item) => item.categoryId === categoryId);
}

export function zikrCategories(): Array<{
  id: ZikrCategoryId;
  label: string;
  icon: SymbolName;
  count: number;
}> {
  return ZIKR_CATEGORY_IDS.map((id) => ({
    id,
    label: ZIKR_CATEGORY_LABELS[id],
    icon: ZIKR_CATEGORY_ICONS[id],
    count: zikrByCategory(id).length,
  }));
}

export function formatZikrShare(item: ZikrItem): string {
  const lines = [item.title, "", item.arabic, "", item.transliteration, "", item.translation];
  if (item.reference) lines.push("", `— ${item.reference}`);
  return lines.join("\n");
}
