import type { MadhhabId } from "@munib-tracker/shared/fiqh";
import type { FiqhCustomValues, FiqhDomain } from "@munib-tracker/shared/types";
import type { Href } from "expo-router";

import { setMadhhab } from "@/lib/fiqh/set-madhhab";
import { preferencesStore } from "@/stores/preferences-store";

import { editor } from "../editors";
import { advancedCount, madhhabSummary } from "../fiqh-settings";
import { settingHref } from "../routes";
import { type AnySettingDef, defineSetting } from "../types";
import { NO_VALUE } from "./helpers";
import { FASTING_FIQH_SETTINGS, RAWATIB_FIQH_SETTINGS } from "./worship-practice";

const MadhhabEditor = editor("MadhhabEditor");
const FiqhAdvancedEditor = editor("FiqhAdvancedEditor");
const FiqhWhereAppliesEditor = editor("FiqhWhereAppliesEditor");

const G = "fiqh" as const;
const MADHHAB = "settingsPanel.section.madhhab";
const ADVANCED = "settingsStep4.fiqh.advanced";
const WHERE = "settingsStep4.fiqh.whereApplies";

interface FiqhAdvancedValue {
  overrides: Partial<Record<FiqhDomain, MadhhabId | null>>;
  custom: FiqhCustomValues;
}

/**
 * Fiqh & madhhab (§4.5.3, NF-3.0a §4.1.5): My madhhab (+ "Not sure?"), the
 * Asr calculation link, Advanced (per-area overrides with the talfiq caution
 * and scholar-given custom values) and "Where this applies". NF-3.1 rawatib (+ Witr
 * qaza) and NF-3.2 fasting defaults live in `worship-practice.ts`.
 */
export const FIQH_SETTINGS: AnySettingDef[] = [
  defineSetting<MadhhabId | null | undefined>({
    id: "fiqh.madhhab",
    group: G,
    section: MADHHAB,
    titleKey: "fiqh.picker.title",
    keywordsKey: "settingsStep4.kw.madhhab",
    icon: { ios: "building.columns.fill", android: "account_balance", web: "account_balance" },
    scope: "account",
    control: { kind: "custom", Component: MadhhabEditor },
    read: (s) => s.prefs.madhhab,
    // The shared action (also used by onboarding / home card / lazy sheet)
    // reschedules reminders itself, so no declared side effect.
    write: async (v) => {
      if (v !== undefined) await setMadhhab(v);
    },
    defaultValue: undefined,
    // A school is a personal choice: "Reset settings" never clears it.
    resettable: false,
    summary: madhhabSummary,
    fields: ["prefs.madhhab"],
  }),
  defineSetting<string>({
    id: "fiqh.asrMethod",
    group: G,
    section: MADHHAB,
    titleKey: "location.madhab",
    subtitleKey: "settingsStep4.fiqh.asrSub",
    keywordsKey: "settingsPanel.kw.madhhab",
    scope: "device",
    control: { kind: "link", href: settingHref("prayer-times.asr") as Href },
    read: (s) => s.location.madhab,
    write: async () => {},
    defaultValue: "shafi",
    resettable: false,
    summary: (v, t) => t(v === "hanafi" ? "location.madhabHanafi" : "location.madhabShafi"),
  }),
  defineSetting<FiqhAdvancedValue>({
    id: "fiqh.advanced",
    group: G,
    section: ADVANCED,
    titleKey: "settingsStep4.fiqh.advanced",
    subtitleKey: "settingsStep4.fiqh.advancedSub",
    keywordsKey: "settingsStep4.kw.fiqhAdvanced",
    scope: "account",
    control: { kind: "custom", Component: FiqhAdvancedEditor },
    read: (s) => ({ overrides: s.prefs.madhhabOverrides ?? {}, custom: s.prefs.fiqhCustom ?? {} }),
    write: (v) =>
      preferencesStore.getState().update({ madhhabOverrides: v.overrides, fiqhCustom: v.custom }),
    defaultValue: { overrides: {}, custom: {} },
    summary: (v, t) => {
      const count = advancedCount({ madhhabOverrides: v.overrides, fiqhCustom: v.custom });
      return count === 0
        ? t("settingsStep4.fiqh.advancedNone")
        : t("settingsPanel.customCount", { count });
    },
    // Preferred-time reminder offsets may follow the school.
    sideEffects: ["reschedule-reminders"],
    fields: ["prefs.madhhabOverrides", "prefs.fiqhCustom"],
  }),
  // NF-3.1 rawatib + Witr qaza, NF-3.2 voluntary fasting defaults.
  ...RAWATIB_FIQH_SETTINGS,
  ...FASTING_FIQH_SETTINGS,
  defineSetting<null>({
    ...NO_VALUE,
    id: "fiqh.whereApplies",
    group: G,
    section: WHERE,
    titleKey: "settingsStep4.fiqh.whereApplies",
    subtitleKey: "settingsStep4.fiqh.whereAppliesSub",
    scope: "account",
    control: { kind: "custom", Component: FiqhWhereAppliesEditor },
  }),
];
