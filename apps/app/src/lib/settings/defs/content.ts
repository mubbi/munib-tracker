import { DEFAULT_HADITH_PREFS, type HadithPrefs } from "@/db/repositories/hadith-repository";
import { hadithStore } from "@/stores/hadith-store";

import type { AnySettingDef, SettingDef } from "../types";
import { onOff } from "./helpers";

const G = "content" as const;
const HADITH = "settingsPanel.section.hadith";

function hadithToggle(key: keyof HadithPrefs, titleKey: string): SettingDef<boolean> {
  return {
    id: `content.hadith.${key}`,
    group: G,
    section: HADITH,
    titleKey,
    keywordsKey: key === "showIsnad" || key === "showSharh" ? "settingsPanel.kw.hadith" : undefined,
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => s.hadith[key],
    write: (v) => hadithStore.getState().updatePrefs({ [key]: v }),
    defaultValue: DEFAULT_HADITH_PREFS[key],
    summary: onOff,
    shortcuts: ["/hadith/[collection]"],
    fields: [`hadith.${key}`],
  };
}

export const CONTENT_SETTINGS: AnySettingDef[] = [
  hadithToggle("showArabic", "hadith.showArabic"),
  // Translation visibility is the app-wide `fonts.reading.showTranslation` (D13).
  hadithToggle("showNarrator", "hadith.showNarrator"),
  hadithToggle("showGrade", "hadith.showGrade"),
  hadithToggle("showIsnad", "hadith.showIsnad"),
  hadithToggle("showSharh", "hadith.showSharh"),
  // NF-3.19 / NF-3.20 add "Tasbeeh counter" (design, sound, haptics, hands-free)
  // and NF-3.23 "Hadith audio" sections to this group.
];
