import type { ZikrCategoryId } from "@munib-tracker/shared/types";
import type { SymbolViewProps } from "expo-symbols";

type SymbolName = SymbolViewProps["name"];

/** Category icons only — no ZIKR corpus (keeps notification/settings graphs light). */
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
